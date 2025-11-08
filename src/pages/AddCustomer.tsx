import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserPlus } from "lucide-react";
import { toast } from "sonner";
import { Customer, assignCluster } from "@/utils/clustering";

const AddCustomer = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    income: "",
    spendingScore: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.name || !formData.age || !formData.income || !formData.spendingScore) {
      toast.error("Please fill in all fields");
      return;
    }

    const age = parseFloat(formData.age);
    const income = parseFloat(formData.income);
    const spendingScore = parseFloat(formData.spendingScore);

    if (age < 0 || age > 120) {
      toast.error("Please enter a valid age (0-120)");
      return;
    }

    if (income < 0 || income > 500000) {
      toast.error("Please enter a valid income (0-500,000)");
      return;
    }

    if (spendingScore < 1 || spendingScore > 100) {
      toast.error("Spending score must be between 1-100");
      return;
    }

    // Get existing customers from localStorage
    const existingData = localStorage.getItem("customers");
    const customers: Customer[] = existingData ? JSON.parse(existingData) : [];

    // Assign cluster based on rules
    const cluster = assignCluster(income, spendingScore);

    // Create new customer
    const newCustomer: Customer = {
      id: `customer-${Date.now()}`,
      name: formData.name,
      age,
      income,
      spendingScore,
      cluster,
    };

    // Add to array and save
    customers.push(newCustomer);
    localStorage.setItem("customers", JSON.stringify(customers));

    toast.success(`Customer added successfully! Cluster: ${cluster}`);

    // Reset form
    setFormData({ name: "", age: "", income: "", spendingScore: "" });
  };

  const handleViewClusters = () => {
    const customersData = localStorage.getItem("customers");
    if (!customersData || JSON.parse(customersData).length === 0) {
      toast.error("No customers added yet. Add some customers first!");
      return;
    }
    navigate("/result");
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Navigation />
      
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8 animate-fade-in">
            <div className="inline-flex p-3 rounded-2xl bg-gradient-primary mb-4 shadow-glow">
              <UserPlus className="w-8 h-8 text-primary-foreground" />
            </div>
            <h1 className="text-4xl font-bold mb-2 bg-gradient-primary bg-clip-text text-transparent">
              Add Customer
            </h1>
            <p className="text-muted-foreground">
              Enter customer details to automatically assign them to a cluster
            </p>
          </div>

          <Card className="p-8 shadow-card border-border animate-slide-in">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Customer Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="border-input"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  type="number"
                  placeholder="25"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                  min="0"
                  max="120"
                  className="border-input"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="income">Annual Income ($)</Label>
                <Input
                  id="income"
                  type="number"
                  placeholder="50000"
                  value={formData.income}
                  onChange={(e) => setFormData({ ...formData, income: e.target.value })}
                  min="0"
                  max="500000"
                  className="border-input"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="spendingScore">Spending Score (1-100)</Label>
                <Input
                  id="spendingScore"
                  type="number"
                  placeholder="75"
                  value={formData.spendingScore}
                  onChange={(e) => setFormData({ ...formData, spendingScore: e.target.value })}
                  min="1"
                  max="100"
                  className="border-input"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button type="submit" className="flex-1 shadow-glow">
                  <UserPlus className="w-4 h-4 mr-2" />
                  Add Customer
                </Button>
                <Button type="button" onClick={handleViewClusters} variant="outline" className="flex-1">
                  View Clusters
                </Button>
              </div>
            </form>
          </Card>

          {/* Clustering Rules Info */}
          <Card className="p-6 mt-6 bg-card/50 border-border">
            <h3 className="font-semibold mb-3 text-primary">Clustering Rules</h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>🟢 <strong className="text-foreground">High Value:</strong> Income &gt; $70,000 AND Spending Score &gt; 70</p>
              <p>🟠 <strong className="text-foreground">Medium Value:</strong> Income &gt; $40,000 AND Spending Score &gt; 40</p>
              <p>🔴 <strong className="text-foreground">Low Value:</strong> All other customers</p>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default AddCustomer;
