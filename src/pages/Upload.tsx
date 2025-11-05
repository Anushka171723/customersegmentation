import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload as UploadIcon, Plus, Download, ArrowRight } from "lucide-react";
import { parseCSV, generateSampleCSV } from "@/utils/csvParser";
import { Customer } from "@/utils/clustering";
import { toast } from "sonner";

const Upload = () => {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [manualEntry, setManualEntry] = useState({
    name: "",
    age: "",
    income: "",
    spendingScore: "",
  });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const parsedCustomers = await parseCSV(file);
      setCustomers(parsedCustomers);
      toast.success(`Successfully loaded ${parsedCustomers.length} customers`);
    } catch (error) {
      toast.error("Failed to parse CSV file. Please check the format.");
    }
  };

  const handleAddManual = () => {
    if (!manualEntry.name || !manualEntry.age || !manualEntry.income || !manualEntry.spendingScore) {
      toast.error("Please fill in all fields");
      return;
    }

    const newCustomer: Customer = {
      id: `customer-${customers.length + 1}`,
      name: manualEntry.name,
      age: parseFloat(manualEntry.age),
      income: parseFloat(manualEntry.income),
      spendingScore: parseFloat(manualEntry.spendingScore),
    };

    setCustomers([...customers, newCustomer]);
    setManualEntry({ name: "", age: "", income: "", spendingScore: "" });
    toast.success("Customer added successfully");
  };

  const handleDownloadSample = () => {
    const csv = generateSampleCSV();
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "sample_customers.csv";
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success("Sample CSV downloaded");
  };

  const handleProceed = () => {
    if (customers.length === 0) {
      toast.error("Please add at least one customer");
      return;
    }
    localStorage.setItem("customers", JSON.stringify(customers));
    navigate("/result");
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Navigation />
      
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-primary bg-clip-text text-transparent">
            Upload Customer Data
          </h1>
          <p className="text-muted-foreground mb-8">
            Upload a CSV file or add customers manually to analyze customer data
          </p>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* CSV Upload */}
            <Card className="p-6 shadow-card border-border">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <UploadIcon className="w-5 h-5 text-primary" />
                Upload CSV File
              </h2>
              <div className="space-y-4">
                <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary transition-colors">
                  <Input
                    type="file"
                    accept=".csv"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="csv-upload"
                  />
                  <Label htmlFor="csv-upload" className="cursor-pointer">
                    <UploadIcon className="w-12 h-12 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">CSV files only</p>
                  </Label>
                </div>
                <Button onClick={handleDownloadSample} variant="outline" className="w-full">
                  <Download className="w-4 h-4 mr-2" />
                  Download Sample CSV
                </Button>
              </div>
            </Card>

            {/* Manual Entry */}
            <Card className="p-6 shadow-card border-border">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Plus className="w-5 h-5 text-primary" />
                Add Manually
              </h2>
              <div className="space-y-3">
                <div>
                  <Label htmlFor="name">Customer Name</Label>
                  <Input
                    id="name"
                    value={manualEntry.name}
                    onChange={(e) => setManualEntry({ ...manualEntry, name: e.target.value })}
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <Label htmlFor="age">Age</Label>
                  <Input
                    id="age"
                    type="number"
                    value={manualEntry.age}
                    onChange={(e) => setManualEntry({ ...manualEntry, age: e.target.value })}
                    placeholder="25"
                  />
                </div>
                <div>
                  <Label htmlFor="income">Annual Income ($)</Label>
                  <Input
                    id="income"
                    type="number"
                    value={manualEntry.income}
                    onChange={(e) => setManualEntry({ ...manualEntry, income: e.target.value })}
                    placeholder="50000"
                  />
                </div>
                <div>
                  <Label htmlFor="spending">Spending Score (1-100)</Label>
                  <Input
                    id="spending"
                    type="number"
                    value={manualEntry.spendingScore}
                    onChange={(e) => setManualEntry({ ...manualEntry, spendingScore: e.target.value })}
                    placeholder="75"
                    min="1"
                    max="100"
                  />
                </div>
                <Button onClick={handleAddManual} className="w-full">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Customer
                </Button>
              </div>
            </Card>
          </div>

          {/* Customer List */}
          {customers.length > 0 && (
            <Card className="p-6 shadow-card border-border mb-6">
              <h2 className="text-xl font-semibold mb-4">
                Loaded Customers ({customers.length})
              </h2>
              <div className="max-h-64 overflow-y-auto">
                <table className="w-full text-sm">
                  <thead className="border-b border-border sticky top-0 bg-card">
                    <tr>
                      <th className="text-left p-2 font-medium">Name</th>
                      <th className="text-left p-2 font-medium">Age</th>
                      <th className="text-left p-2 font-medium">Income</th>
                      <th className="text-left p-2 font-medium">Spending Score</th>
                    </tr>
                  </thead>
                  <tbody>
                    {customers.map((customer) => (
                      <tr key={customer.id} className="border-b border-border/50">
                        <td className="p-2">{customer.name}</td>
                        <td className="p-2">{customer.age}</td>
                        <td className="p-2">${customer.income.toLocaleString()}</td>
                        <td className="p-2">{customer.spendingScore}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          )}

          {/* Proceed Button */}
          <div className="flex justify-end">
            <Button
              onClick={handleProceed}
              size="lg"
              disabled={customers.length === 0}
              className="shadow-glow"
            >
              Proceed to Analysis
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Upload;
