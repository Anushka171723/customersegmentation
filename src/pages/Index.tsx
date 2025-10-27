import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { BarChart3, Upload, Target, Users } from "lucide-react";
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
            Customer Segmentation Platform
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Leverage machine learning clustering to automatically segment your customers 
            and discover valuable insights for targeted marketing strategies.
          </p>
          <Link to="/upload">
            <Button size="lg" className="shadow-glow text-lg px-8 py-6">
              Get Started
              <Upload className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {[
            {
              icon: Upload,
              title: "Easy Data Upload",
              description: "Upload CSV files or add customer data manually with our intuitive interface",
            },
            {
              icon: Target,
              title: "Smart Clustering",
              description: "K-means algorithm runs in your browser for instant, privacy-focused analysis",
            },
            {
              icon: Users,
              title: "Visual Insights",
              description: "Interactive scatter plots and detailed tables to explore customer segments",
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
              { step: "1", title: "Upload Data", desc: "Provide customer information via CSV or manual entry" },
              { step: "2", title: "Analyze", desc: "Our algorithm processes data and identifies patterns" },
              { step: "3", title: "Visualize", desc: "Explore segments through charts and detailed tables" },
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
