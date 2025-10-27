import { Navigation } from "@/components/Navigation";
import { Card } from "@/components/ui/card";

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Navigation />
      
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent">
            About Our Platform
          </h1>
          
          <Card className="p-8 mb-8 shadow-card border-border">
            <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
            <p className="text-muted-foreground mb-4">
              We're democratizing customer intelligence by making advanced machine learning 
              accessible to businesses of all sizes. Our platform eliminates the complexity 
              and costs traditionally associated with customer segmentation, putting enterprise-level 
              insights directly in your hands.
            </p>
            <p className="text-muted-foreground mb-4">
              Privacy isn't just a feature—it's our foundation. All analysis happens entirely 
              in your browser, meaning your customer data never touches our servers or leaves 
              your device. You get instant, powerful insights while maintaining complete 
              control over your sensitive business information.
            </p>
            <p className="text-muted-foreground">
              Whether you're launching targeted campaigns, optimizing product offerings, or 
              understanding customer behavior patterns, we're here to transform your raw data 
              into actionable strategies that drive real business growth.
            </p>
          </Card>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {[
              {
                title: "Zero Setup",
                description: "No installation, no servers, no configuration. Open your browser and start analyzing immediately.",
              },
              {
                title: "100% Private",
                description: "Your data never leaves your device. All processing happens locally in your browser.",
              },
              {
                title: "Instant Results",
                description: "See customer segments in seconds with real-time visualization and interactive charts.",
              },
            ].map((benefit, index) => (
              <Card
                key={index}
                className="p-6 shadow-card border-border hover:shadow-glow transition-all duration-300"
              >
                <h3 className="text-lg font-semibold mb-2 text-primary">{benefit.title}</h3>
                <p className="text-sm text-muted-foreground">{benefit.description}</p>
              </Card>
            ))}
          </div>

          <Card className="p-8 shadow-card border-border">
            <h2 className="text-2xl font-semibold mb-4">Perfect For</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-3 text-primary">E-commerce Businesses</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Identify high-value customers, create personalized product recommendations, 
                  and optimize your marketing spend by targeting the right segments.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-3 text-primary">Marketing Teams</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Design targeted campaigns based on customer behavior patterns and spending 
                  habits to maximize engagement and ROI.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-3 text-primary">Small Business Owners</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Understand your customer base without expensive analytics tools or hiring 
                  data scientists. Make data-driven decisions confidently.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-3 text-primary">Data Analysts</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Quick exploratory analysis and prototyping without setting up infrastructure. 
                  Export insights and share visualizations with stakeholders.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default About;
