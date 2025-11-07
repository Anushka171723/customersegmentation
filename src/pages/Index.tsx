import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { BarChart3, UserPlus, Target, Users, Upload } from "lucide-react";
import { Navigation } from "@/components/Navigation";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Navigation />
      
      <main className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-flex p-3 rounded-2xl bg-gradient-primary mb-6 shadow-glow">
            <BarChart3 className="w-12 h-12 text-primary-foreground" />
          </div>
          <h1 className="text-5xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent">
            Customer Segmentation using Clustering
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Automatically group customers into High Value, Medium Value, and Low Value segments 
            based on their income and spending behavior for targeted marketing strategies.
          </p>
          <div className="flex gap-4 justify-center">
            <Link to="/upload">
              <Button size="lg" className="shadow-glow text-lg px-8 py-6">
                Get Started - Upload Data
                <Upload className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link to="/add-customer">
              <Button size="lg" variant="outline" className="text-lg px-8 py-6">
                Add Manually
                <UserPlus className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {[
            {
              icon: Upload,
              title: "CSV Upload & Manual Entry",
              description: "Upload CSV files for bulk data import or add customers manually through forms",
            },
            {
              icon: Target,
              title: "Rule-Based Clustering",
              description: "Automatic segmentation based on income and spending score thresholds",
            },
            {
              icon: Users,
              title: "Visual Insights & Charts",
              description: "Scatter plots, pie charts, cluster insights, and detailed customer analytics",
            },
          ].map((feature, index) => (
            <Card
              key={index}
              className="p-6 bg-card shadow-card hover:shadow-glow transition-all duration-300 animate-slide-in border-border"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="inline-flex p-3 rounded-xl bg-secondary mb-4">
                <feature.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </Card>
          ))}
        </div>

        {/* How It Works */}
        <Card className="p-8 bg-card shadow-card border-border">
          <h2 className="text-3xl font-bold mb-6 text-center">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: "1", title: "Upload Data", desc: "Upload CSV file or add customer details manually" },
              { step: "2", title: "Auto-Cluster", desc: "System assigns customers to High, Medium, or Low Value segments" },
              { step: "3", title: "Analyze Results", desc: "View scatter plots, insights, distribution charts, and detailed tables" },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-12 h-12 rounded-full bg-gradient-primary text-primary-foreground font-bold text-xl flex items-center justify-center mx-auto mb-4 shadow-glow">
                  {item.step}
                </div>
                <h4 className="font-semibold mb-2">{item.title}</h4>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </Card>
      </main>
    </div>
  );
};

export default Index;
