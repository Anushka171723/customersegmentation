import { Navigation } from "@/components/Navigation";
import { Card } from "@/components/ui/card";
import { Github, Linkedin, Mail } from "lucide-react";

const About = () => {
  const teamMembers = [
    {
      name: "Dr. Sarah Chen",
      role: "Lead Data Scientist",
      bio: "PhD in Machine Learning with 10+ years of experience in customer analytics",
      avatar: "SC",
    },
    {
      name: "Michael Rodriguez",
      role: "Full Stack Developer",
      bio: "Specializes in building scalable data visualization platforms",
      avatar: "MR",
    },
    {
      name: "Emily Johnson",
      role: "UX Designer",
      bio: "Passionate about making complex data accessible and beautiful",
      avatar: "EJ",
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
              We believe that powerful data analytics tools should be accessible to everyone. 
              Our customer segmentation platform brings enterprise-grade machine learning 
              capabilities right to your browser, with no server required.
            </p>
            <p className="text-muted-foreground">
              By running all computations client-side, we ensure your data stays completely 
              private while delivering instant results. Whether you're a small business owner 
              or a data analyst, our tool helps you discover meaningful customer segments 
              to drive targeted marketing strategies.
            </p>
          </Card>

          <h2 className="text-3xl font-bold mb-6">Meet the Team</h2>
          
          <div className="grid md:grid-cols-3 gap-6 mb-8">
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
