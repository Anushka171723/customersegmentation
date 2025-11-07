import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, ZAxis } from "recharts";
import { calculateMetrics, Customer, CustomerMetrics, ClusterType } from "@/utils/clustering";
import { ArrowLeft, Download, ArrowUpDown, Trash2 } from "lucide-react";
import { toast } from "sonner";

type SortField = "name" | "age" | "income" | "spendingScore";
type SortDirection = "asc" | "desc";

const Result = () => {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [metrics, setMetrics] = useState<CustomerMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [sortField, setSortField] = useState<SortField>("name");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  useEffect(() => {
    const customersData = localStorage.getItem("customers");
    if (!customersData) {
      toast.error("No customer data found. Please upload data first.");
      navigate("/upload");
      return;
    }

    try {
      const parsedCustomers: Customer[] = JSON.parse(customersData);
      setCustomers(parsedCustomers);
      const calculatedMetrics = calculateMetrics(parsedCustomers);
      setMetrics(calculatedMetrics);
      toast.success("Data analysis completed successfully!");
    } catch (error) {
      toast.error("Failed to analyze customer data");
      navigate("/upload");
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const sortedCustomers = [...customers].sort((a, b) => {
    const aVal = a[sortField];
    const bVal = b[sortField];
    const modifier = sortDirection === "asc" ? 1 : -1;
    
    if (typeof aVal === "string" && typeof bVal === "string") {
      return aVal.localeCompare(bVal) * modifier;
    }
    return ((aVal as number) - (bVal as number)) * modifier;
  });

  const downloadResults = () => {
    const csv = [
      "ID,Name,Age,Income,Spending Score,Cluster",
      ...customers.map(c => 
        `${c.id},${c.name},${c.age},${c.income},${c.spendingScore},${c.cluster}`
      )
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "customer_clusters.csv";
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success("Data downloaded");
  };

  const handleDelete = (id: string) => {
    const updatedCustomers = customers.filter(c => c.id !== id);
    localStorage.setItem("customers", JSON.stringify(updatedCustomers));
    setCustomers(updatedCustomers);
    setMetrics(calculateMetrics(updatedCustomers));
    toast.success("Customer deleted");
  };

  const handleResetData = () => {
    if (confirm("Are you sure you want to delete all customer data?")) {
      localStorage.removeItem("customers");
      setCustomers([]);
      toast.success("All data cleared");
      navigate("/add-customer");
    }
  };

  const getClusterColor = (cluster?: ClusterType) => {
    switch (cluster) {
      case "High Value": return "text-green-600 dark:text-green-400";
      case "Medium Value": return "text-orange-600 dark:text-orange-400";
      case "Low Value": return "text-red-600 dark:text-red-400";
      default: return "text-muted-foreground";
    }
  };

  const getClusterBadge = (cluster?: ClusterType) => {
    const baseClasses = "px-3 py-1 rounded-full text-xs font-semibold";
    switch (cluster) {
      case "High Value": return `${baseClasses} bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400`;
      case "Medium Value": return `${baseClasses} bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400`;
      case "Low Value": return `${baseClasses} bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400`;
      default: return `${baseClasses} bg-secondary text-secondary-foreground`;
    }
  };

  if (loading || !metrics) {
    return (
      <div className="min-h-screen bg-gradient-subtle">
        <Navigation />
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading customer data...</p>
          </div>
        </div>
      </div>
    );
  }

  // Calculate cluster distribution
  const clusterCounts = {
    "High Value": customers.filter(c => c.cluster === "High Value").length,
    "Medium Value": customers.filter(c => c.cluster === "Medium Value").length,
    "Low Value": customers.filter(c => c.cluster === "Low Value").length,
  };

  const pieData = [
    { name: "High Value", value: clusterCounts["High Value"], color: "#22c55e" },
    { name: "Medium Value", value: clusterCounts["Medium Value"], color: "#f97316" },
    { name: "Low Value", value: clusterCounts["Low Value"], color: "#ef4444" },
  ];

  // Prepare scatter chart data
  const scatterData = customers.map(c => ({
    income: c.income,
    spendingScore: c.spendingScore,
    age: c.age,
    name: c.name,
    cluster: c.cluster,
  }));

  const getClusterInsights = () => {
    const highValueCustomers = customers.filter(c => c.cluster === "High Value");
    const mediumValueCustomers = customers.filter(c => c.cluster === "Medium Value");
    const lowValueCustomers = customers.filter(c => c.cluster === "Low Value");

    const avgAge = (customers: Customer[]) => 
      customers.length > 0 ? (customers.reduce((sum, c) => sum + c.age, 0) / customers.length).toFixed(1) : "0";
    
    const avgIncome = (customers: Customer[]) => 
      customers.length > 0 ? (customers.reduce((sum, c) => sum + c.income, 0) / customers.length).toFixed(0) : "0";
    
    const avgSpending = (customers: Customer[]) => 
      customers.length > 0 ? (customers.reduce((sum, c) => sum + c.spendingScore, 0) / customers.length).toFixed(1) : "0";

    return [
      {
        cluster: "High Value",
        count: highValueCustomers.length,
        avgAge: avgAge(highValueCustomers),
        avgIncome: avgIncome(highValueCustomers),
        avgSpending: avgSpending(highValueCustomers),
        description: "Premium customers with high income and spending patterns. They are the most valuable segment.",
        color: "text-green-600 dark:text-green-400",
        bgColor: "bg-green-100 dark:bg-green-900/30",
      },
      {
        cluster: "Medium Value",
        count: mediumValueCustomers.length,
        avgAge: avgAge(mediumValueCustomers),
        avgIncome: avgIncome(mediumValueCustomers),
        avgSpending: avgSpending(mediumValueCustomers),
        description: "Moderate customers with balanced income and spending. Potential for growth.",
        color: "text-orange-600 dark:text-orange-400",
        bgColor: "bg-orange-100 dark:bg-orange-900/30",
      },
      {
        cluster: "Low Value",
        count: lowValueCustomers.length,
        avgAge: avgAge(lowValueCustomers),
        avgIncome: avgIncome(lowValueCustomers),
        avgSpending: avgSpending(lowValueCustomers),
        description: "Budget-conscious customers with lower spending capacity. Requires targeted engagement.",
        color: "text-red-600 dark:text-red-400",
        bgColor: "bg-red-100 dark:bg-red-900/30",
      },
    ];
  };

  const insights = getClusterInsights();

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Navigation />
      
      <main className="container mx-auto px-4 py-12">
        <div className="mb-6 flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-4xl font-bold mb-2 bg-gradient-primary bg-clip-text text-transparent">
              Customer Clusters
            </h1>
            <p className="text-muted-foreground">
              Insights from {metrics.totalCustomers} customer records
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => navigate("/add-customer")} variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Add More
            </Button>
            <Button onClick={downloadResults} variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
            <Button onClick={handleResetData} variant="destructive">
              <Trash2 className="w-4 h-4 mr-2" />
              Reset Data
            </Button>
          </div>
        </div>

        {/* Summary Section */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <Card className="p-6 shadow-card border-border animate-fade-in">
            <h2 className="text-2xl font-semibold mb-4">Summary</h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Total Customers:</span>
                <span className="font-bold text-2xl">{metrics.totalCustomers}</span>
              </div>
              <div className="h-px bg-border"></div>
              <div className="flex justify-between items-center">
                <span className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-green-500"></span>
                  High Value:
                </span>
                <span className="font-bold text-xl text-green-600 dark:text-green-400">{clusterCounts["High Value"]}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-orange-500"></span>
                  Medium Value:
                </span>
                <span className="font-bold text-xl text-orange-600 dark:text-orange-400">{clusterCounts["Medium Value"]}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-red-500"></span>
                  Low Value:
                </span>
                <span className="font-bold text-xl text-red-600 dark:text-red-400">{clusterCounts["Low Value"]}</span>
              </div>
            </div>
          </Card>

          <Card className="p-6 shadow-card border-border">
            <h2 className="text-2xl font-semibold mb-4">Cluster Distribution</h2>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Scatter Chart */}
        <Card className="p-6 shadow-card border-border mb-6">
          <h2 className="text-2xl font-semibold mb-4">Customer Segmentation Scatter Plot</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Visual representation of customers based on Income and Spending Score
          </p>
          <ResponsiveContainer width="100%" height={400}>
            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                type="number" 
                dataKey="income" 
                name="Income" 
                label={{ value: 'Annual Income ($)', position: 'insideBottom', offset: -10 }}
                tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
              />
              <YAxis 
                type="number" 
                dataKey="spendingScore" 
                name="Spending Score" 
                label={{ value: 'Spending Score', angle: -90, position: 'insideLeft' }}
              />
              <ZAxis range={[100, 100]} />
              <Tooltip 
                cursor={{ strokeDasharray: '3 3' }}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-card border border-border p-3 rounded-lg shadow-lg">
                        <p className="font-semibold">{data.name}</p>
                        <p className="text-sm">Age: {data.age}</p>
                        <p className="text-sm">Income: ${data.income.toLocaleString()}</p>
                        <p className="text-sm">Spending: {data.spendingScore}</p>
                        <p className={`text-sm font-semibold ${getClusterColor(data.cluster)}`}>
                          {data.cluster}
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend />
              <Scatter 
                name="High Value" 
                data={scatterData.filter(d => d.cluster === "High Value")} 
                fill="#22c55e" 
              />
              <Scatter 
                name="Medium Value" 
                data={scatterData.filter(d => d.cluster === "Medium Value")} 
                fill="#f97316" 
              />
              <Scatter 
                name="Low Value" 
                data={scatterData.filter(d => d.cluster === "Low Value")} 
                fill="#ef4444" 
              />
            </ScatterChart>
          </ResponsiveContainer>
        </Card>

        {/* Insights Section */}
        <Card className="p-6 shadow-card border-border mb-6">
          <h2 className="text-2xl font-semibold mb-4">Cluster Insights</h2>
          <p className="text-muted-foreground mb-6">
            Understanding what each customer segment represents
          </p>
          <div className="space-y-4">
            {insights.map((insight) => (
              <div 
                key={insight.cluster}
                className={`p-4 rounded-lg border-l-4 ${insight.bgColor}`}
                style={{ borderLeftColor: insight.cluster === "High Value" ? "#22c55e" : insight.cluster === "Medium Value" ? "#f97316" : "#ef4444" }}
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className={`text-lg font-semibold ${insight.color}`}>
                    {insight.cluster} ({insight.count} customers)
                  </h3>
                </div>
                <p className="text-sm text-foreground/80 mb-3">{insight.description}</p>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Avg Age:</span>
                    <p className="font-semibold">{insight.avgAge} years</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Avg Income:</span>
                    <p className="font-semibold">${parseFloat(insight.avgIncome).toLocaleString()}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Avg Spending:</span>
                    <p className="font-semibold">{insight.avgSpending}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Sortable Data Table with Clusters */}
        <Card className="p-6 shadow-card border-border">
          <h2 className="text-2xl font-semibold mb-4">Customer Details</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-border">
                <tr>
                  <th className="text-left p-3 font-medium">
                    <button 
                      onClick={() => handleSort("name")}
                      className="flex items-center gap-1 hover:text-primary transition-colors"
                    >
                      Name
                      <ArrowUpDown className="w-4 h-4" />
                    </button>
                  </th>
                  <th className="text-left p-3 font-medium">
                    <button 
                      onClick={() => handleSort("age")}
                      className="flex items-center gap-1 hover:text-primary transition-colors"
                    >
                      Age
                      <ArrowUpDown className="w-4 h-4" />
                    </button>
                  </th>
                  <th className="text-left p-3 font-medium">
                    <button 
                      onClick={() => handleSort("income")}
                      className="flex items-center gap-1 hover:text-primary transition-colors"
                    >
                      Income
                      <ArrowUpDown className="w-4 h-4" />
                    </button>
                  </th>
                  <th className="text-left p-3 font-medium">
                    <button 
                      onClick={() => handleSort("spendingScore")}
                      className="flex items-center gap-1 hover:text-primary transition-colors"
                    >
                      Spending Score
                      <ArrowUpDown className="w-4 h-4" />
                    </button>
                  </th>
                  <th className="text-left p-3 font-medium">Cluster</th>
                  <th className="text-left p-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {sortedCustomers.map((customer) => (
                  <tr key={customer.id} className="border-b border-border/50 hover:bg-secondary/50 transition-colors">
                    <td className="p-3">{customer.name}</td>
                    <td className="p-3">{customer.age}</td>
                    <td className="p-3">${customer.income.toLocaleString()}</td>
                    <td className="p-3">{customer.spendingScore}</td>
                    <td className="p-3">
                      <span className={getClusterBadge(customer.cluster)}>
                        {customer.cluster}
                      </span>
                    </td>
                    <td className="p-3">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDelete(customer.id)}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
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
