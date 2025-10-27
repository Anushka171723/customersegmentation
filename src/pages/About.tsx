import { Navigation } from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Github, Linkedin, Mail } from "lucide-react";

const About = () => {
  const teamMembers = [
    {
      name: "Alex Martinez",
      role: "Machine Learning Engineer",
      bio: "Expert in unsupervised learning and building real-time analytics solutions",
      avatar: "AM",
    },
    {
      name: "Priya Sharma",
      role: "Product Designer",
      bio: "Crafting intuitive experiences that make data science accessible to everyone",
      avatar: "PS",
    },
    {
      name: "Jordan Kim",
      role: "Backend Architect",
      bio: "Specializes in browser-based ML and privacy-first data processing",
      avatar: "JK",
    },
    {
      name: "Taylor Wong",
      role: "Growth Strategist",
      bio: "Passionate about empowering businesses through intelligent customer insights",
      avatar: "TW",
    },
  ];

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

          <h2 className="text-3xl font-bold mb-6">Meet the Team</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {teamMembers.map((member, index) => (
              <Card 
                key={index} 
                className="p-6 shadow-card border-border hover:shadow-glow transition-all duration-300"
              >
                <div className="w-20 h-20 rounded-full bg-gradient-primary flex items-center justify-center text-primary-foreground text-2xl font-bold mx-auto mb-4 shadow-glow">
                  {member.avatar}
                </div>
                <h3 className="text-xl font-semibold text-center mb-1">{member.name}</h3>
                <p className="text-primary text-sm text-center mb-3">{member.role}</p>
                <p className="text-sm text-muted-foreground text-center mb-4">{member.bio}</p>
                <div className="flex justify-center gap-3">
                  <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                    <Github className="w-5 h-5" />
                  </a>
                  <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                    <Linkedin className="w-5 h-5" />
                  </a>
                  <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                    <Mail className="w-5 h-5" />
                  </a>
                </div>
              </Card>
            ))}
          </div>

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
