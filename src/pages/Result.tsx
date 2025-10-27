import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { performKMeansClustering, Customer, ClusterResult } from "@/utils/clustering";
import { ArrowLeft, Download } from "lucide-react";
import { toast } from "sonner";

const CLUSTER_COLORS = ["hsl(250, 75%, 60%)", "hsl(200, 95%, 55%)", "hsl(280, 70%, 65%)", "hsl(150, 70%, 50%)"];

const Result = () => {
  const navigate = useNavigate();
  const [result, setResult] = useState<ClusterResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const customersData = localStorage.getItem("customers");
    if (!customersData) {
      toast.error("No customer data found. Please upload data first.");
      navigate("/upload");
      return;
    }

    try {
      const customers: Customer[] = JSON.parse(customersData);
      const clusterResult = performKMeansClustering(customers, 3);
      setResult(clusterResult);
      toast.success("Clustering analysis completed successfully!");
    } catch (error) {
      toast.error("Failed to perform clustering analysis");
      navigate("/upload");
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  const downloadResults = () => {
    if (!result) return;

    const csv = [
      "ID,Name,Age,Income,Spending Score,Cluster",
      ...result.customers.map(c => 
        `${c.id},${c.name},${c.age},${c.income},${c.spendingScore},${c.cluster! + 1}`
      )
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "clustering_results.csv";
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success("Results downloaded");
  };

  if (loading || !result) {
    return (
      <div className="min-h-screen bg-gradient-subtle">
        <Navigation />
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Analyzing customer data...</p>
          </div>
        </div>
      </div>
    );
  }

  const scatterData = result.customers.map(c => ({
    name: c.name,
    income: c.income,
    spendingScore: c.spendingScore,
    cluster: c.cluster,
  }));

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Navigation />
      
      <main className="container mx-auto px-4 py-12">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2 bg-gradient-primary bg-clip-text text-transparent">
              Segmentation Results
            </h1>
            <p className="text-muted-foreground">
              {result.customers.length} customers clustered into {result.centroids.length} segments
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => navigate("/upload")} variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <Button onClick={downloadResults} className="shadow-glow">
              <Download className="w-4 h-4 mr-2" />
              Download Results
            </Button>
          </div>
        </div>

        {/* Scatter Plot */}
        <Card className="p-6 mb-6 shadow-card border-border">
          <h2 className="text-2xl font-semibold mb-4">Customer Segments Visualization</h2>
          <ResponsiveContainer width="100%" height={400}>
            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                type="number" 
                dataKey="income" 
                name="Income" 
                label={{ value: "Annual Income ($)", position: "bottom" }}
              />
              <YAxis 
                type="number" 
                dataKey="spendingScore" 
                name="Spending Score" 
                label={{ value: "Spending Score", angle: -90, position: "left" }}
              />
              <Tooltip 
                cursor={{ strokeDasharray: '3 3' }}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-card p-3 rounded-lg shadow-lg border border-border">
                        <p className="font-semibold">{data.name}</p>
                        <p className="text-sm text-muted-foreground">Income: ${data.income.toLocaleString()}</p>
                        <p className="text-sm text-muted-foreground">Score: {data.spendingScore}</p>
                        <p className="text-sm text-muted-foreground">Cluster: {data.cluster + 1}</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend />
              {[...Array(result.centroids.length)].map((_, clusterIdx) => (
                <Scatter
                  key={clusterIdx}
                  name={`Cluster ${clusterIdx + 1}`}
                  data={scatterData.filter(d => d.cluster === clusterIdx)}
                  fill={CLUSTER_COLORS[clusterIdx]}
                />
              ))}
            </ScatterChart>
          </ResponsiveContainer>
        </Card>

        {/* Statistics */}
        <div className="grid md:grid-cols-3 gap-6 mb-6">
          {result.centroids.map((centroid, idx) => (
            <Card key={idx} className="p-6 shadow-card border-border">
              <div className="flex items-center gap-3 mb-3">
                <div 
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: CLUSTER_COLORS[idx] }}
                />
                <h3 className="text-lg font-semibold">Cluster {idx + 1}</h3>
              </div>
              <div className="space-y-2 text-sm">
                <p><span className="text-muted-foreground">Avg Age:</span> {centroid.age.toFixed(1)}</p>
                <p><span className="text-muted-foreground">Avg Income:</span> ${centroid.income.toFixed(0).toLocaleString()}</p>
                <p><span className="text-muted-foreground">Avg Score:</span> {centroid.spendingScore.toFixed(1)}</p>
                <p><span className="text-muted-foreground">Members:</span> {result.customers.filter(c => c.cluster === idx).length}</p>
              </div>
            </Card>
          ))}
        </div>

        {/* Data Table */}
        <Card className="p-6 shadow-card border-border">
          <h2 className="text-2xl font-semibold mb-4">Detailed Customer List</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-border">
                <tr>
                  <th className="text-left p-3 font-medium">Name</th>
                  <th className="text-left p-3 font-medium">Age</th>
                  <th className="text-left p-3 font-medium">Income</th>
                  <th className="text-left p-3 font-medium">Spending Score</th>
                  <th className="text-left p-3 font-medium">Cluster</th>
                </tr>
              </thead>
              <tbody>
                {result.customers.map((customer) => (
                  <tr key={customer.id} className="border-b border-border/50 hover:bg-secondary/50">
                    <td className="p-3">{customer.name}</td>
                    <td className="p-3">{customer.age}</td>
                    <td className="p-3">${customer.income.toLocaleString()}</td>
                    <td className="p-3">{customer.spendingScore}</td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: CLUSTER_COLORS[customer.cluster!] }}
                        />
                        Cluster {customer.cluster! + 1}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </main>
    </div>
  );
};

export default Result;
