import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { calculateMetrics, Customer, CustomerMetrics } from "@/utils/clustering";
import { ArrowLeft, Download, ArrowUpDown } from "lucide-react";
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
      "ID,Name,Age,Income,Spending Score",
      ...customers.map(c => 
        `${c.id},${c.name},${c.age},${c.income},${c.spendingScore}`
      )
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "customer_data.csv";
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success("Data downloaded");
  };

  if (loading || !metrics) {
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

  // Prepare data for age distribution chart
  const ageGroups = [
    { range: "18-25", count: customers.filter(c => c.age >= 18 && c.age <= 25).length },
    { range: "26-35", count: customers.filter(c => c.age >= 26 && c.age <= 35).length },
    { range: "36-45", count: customers.filter(c => c.age >= 36 && c.age <= 45).length },
    { range: "46-55", count: customers.filter(c => c.age >= 46 && c.age <= 55).length },
    { range: "56+", count: customers.filter(c => c.age >= 56).length },
  ];

  // Prepare data for income distribution chart
  const incomeGroups = [
    { range: "$0-30k", count: customers.filter(c => c.income < 30000).length },
    { range: "$30-50k", count: customers.filter(c => c.income >= 30000 && c.income < 50000).length },
    { range: "$50-70k", count: customers.filter(c => c.income >= 50000 && c.income < 70000).length },
    { range: "$70-100k", count: customers.filter(c => c.income >= 70000 && c.income < 100000).length },
    { range: "$100k+", count: customers.filter(c => c.income >= 100000).length },
  ];

  // Prepare data for spending score distribution
  const scoreGroups = [
    { range: "1-20", count: customers.filter(c => c.spendingScore >= 1 && c.spendingScore <= 20).length },
    { range: "21-40", count: customers.filter(c => c.spendingScore >= 21 && c.spendingScore <= 40).length },
    { range: "41-60", count: customers.filter(c => c.spendingScore >= 41 && c.spendingScore <= 60).length },
    { range: "61-80", count: customers.filter(c => c.spendingScore >= 61 && c.spendingScore <= 80).length },
    { range: "81-100", count: customers.filter(c => c.spendingScore >= 81 && c.spendingScore <= 100).length },
  ];

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Navigation />
      
      <main className="container mx-auto px-4 py-12">
        <div className="mb-6 flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-4xl font-bold mb-2 bg-gradient-primary bg-clip-text text-transparent">
              Customer Data Analysis
            </h1>
            <p className="text-muted-foreground">
              Insights from {metrics.totalCustomers} customer records
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => navigate("/upload")} variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <Button onClick={downloadResults} className="shadow-glow">
              <Download className="w-4 h-4 mr-2" />
              Download CSV
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid md:grid-cols-3 gap-6 mb-6">
          <Card className="p-6 shadow-card border-border animate-fade-in">
            <h3 className="text-lg font-semibold mb-4 text-primary">Age Statistics</h3>
            <div className="space-y-2 text-sm">
              <p><span className="text-muted-foreground">Average:</span> <span className="font-semibold">{metrics.avgAge.toFixed(1)} years</span></p>
              <p><span className="text-muted-foreground">Range:</span> <span className="font-semibold">{metrics.minAge} - {metrics.maxAge} years</span></p>
            </div>
          </Card>

          <Card className="p-6 shadow-card border-border animate-fade-in" style={{ animationDelay: "0.1s" }}>
            <h3 className="text-lg font-semibold mb-4 text-primary">Income Statistics</h3>
            <div className="space-y-2 text-sm">
              <p><span className="text-muted-foreground">Average:</span> <span className="font-semibold">${metrics.avgIncome.toFixed(0).toLocaleString()}</span></p>
              <p><span className="text-muted-foreground">Range:</span> <span className="font-semibold">${metrics.minIncome.toLocaleString()} - ${metrics.maxIncome.toLocaleString()}</span></p>
            </div>
          </Card>

          <Card className="p-6 shadow-card border-border animate-fade-in" style={{ animationDelay: "0.2s" }}>
            <h3 className="text-lg font-semibold mb-4 text-primary">Spending Score Statistics</h3>
            <div className="space-y-2 text-sm">
              <p><span className="text-muted-foreground">Average:</span> <span className="font-semibold">{metrics.avgSpendingScore.toFixed(1)}</span></p>
              <p><span className="text-muted-foreground">Range:</span> <span className="font-semibold">{metrics.minSpendingScore} - {metrics.maxSpendingScore}</span></p>
            </div>
          </Card>
        </div>

        {/* Distribution Charts */}
        <div className="grid md:grid-cols-3 gap-6 mb-6">
          <Card className="p-6 shadow-card border-border">
            <h2 className="text-xl font-semibold mb-4">Age Distribution</h2>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={ageGroups}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="range" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="count" fill="hsl(var(--primary))" />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          <Card className="p-6 shadow-card border-border">
            <h2 className="text-xl font-semibold mb-4">Income Distribution</h2>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={incomeGroups}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="range" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="count" fill="hsl(var(--primary))" />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          <Card className="p-6 shadow-card border-border">
            <h2 className="text-xl font-semibold mb-4">Spending Score Distribution</h2>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={scoreGroups}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="range" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="count" fill="hsl(var(--primary))" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Sortable Data Table */}
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
                </tr>
              </thead>
              <tbody>
                {sortedCustomers.map((customer) => (
                  <tr key={customer.id} className="border-b border-border/50 hover:bg-secondary/50 transition-colors">
                    <td className="p-3">{customer.name}</td>
                    <td className="p-3">{customer.age}</td>
                    <td className="p-3">${customer.income.toLocaleString()}</td>
                    <td className="p-3">{customer.spendingScore}</td>
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
