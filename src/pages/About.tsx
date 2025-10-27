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

          <Card className="p-8 shadow-card border-border">
            <h2 className="text-2xl font-semibold mb-4">Technology Stack</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold mb-2 text-primary">Frontend</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• React with TypeScript</li>
                  <li>• Tailwind CSS for styling</li>
                  <li>• Recharts for visualization</li>
                  <li>• shadcn/ui components</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2 text-primary">Algorithms</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• K-means clustering</li>
                  <li>• Data normalization</li>
                  <li>• Euclidean distance metrics</li>
                  <li>• CSV parsing with PapaParse</li>
                </ul>
              </div>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default About;
