import { Button } from "@/components/ui/button";

export default function About() {
  return (
    <section id="about" className="py-24 bg-gradient-to-b from-tech-dark to-black relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-1/3 left-0 w-64 h-64 rounded-full bg-neon-cyan/5 filter blur-3xl"></div>
      <div className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full bg-orange/5 filter blur-3xl"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col lg:flex-row gap-12 items-center">
          {/* Image/visual side */}
          <div className="flex-1 relative">
            <div className="relative rounded-xl overflow-hidden w-full max-w-md mx-auto aspect-[4/5] border border-gray-800">
              <div className="absolute inset-0 bg-gradient-to-tr from-black via-transparent to-black/60 z-10"></div>
              <img 
                src="https://images.unsplash.com/photo-1573164713988-8665fc963095?q=80&w=2069&auto=format&fit=crop" 
                alt="Software Developer" 
                className="w-full h-full object-cover"
              />
              
              {/* Tech experience indicators */}
              <div className="absolute bottom-6 left-6 right-6 z-20">
                <div className="space-y-3">
                  <ExperienceBar label="Web Development" percentage={95} color="orange" />
                  <ExperienceBar label="Mobile Development" percentage={85} color="neon-cyan" />
                  <ExperienceBar label="UI/UX Design" percentage={80} color="neon-purple" />
                  <ExperienceBar label="Backend & API" percentage={90} color="orange" />
                </div>
              </div>
              
              {/* Floating tech badges */}
              <div className="absolute top-6 right-6 flex items-center justify-center gap-2 z-20">
                <div className="tech-badge">
                  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" alt="JavaScript" />
                </div>
                <div className="tech-badge">
                  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" alt="React" />
                </div>
                <div className="tech-badge">
                  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" alt="Node.js" />
                </div>
              </div>
            </div>
          </div>
          
          {/* Content side */}
          <div className="flex-1 space-y-6">
            <div className="inline-block px-3 py-1 rounded-full bg-orange/10 border border-orange/20 text-orange-light font-medium text-sm mb-2">
              About Me
            </div>
            <h2 className="text-4xl font-bold mb-6 orange-glow">
              <span className="bg-gradient-to-r from-orange-light to-orange bg-clip-text text-transparent">
                Passionate Developer<br />Creating Digital Experiences
              </span>
            </h2>
            
            <div className="space-y-4 text-gray-300">
              <p>
                Hello! I'm Alex, a dedicated software engineer with over 5 years of experience in creating cutting-edge web and mobile applications. My passion lies in transforming complex problems into elegant, intuitive solutions.
              </p>
              <p>
                My expertise spans the entire development stack—from crafting beautiful frontend interfaces to building robust backend systems. I specialize in React, TypeScript, Node.js, and modern web technologies, always staying on top of the latest industry trends.
              </p>
              <p>
                What sets me apart is my commitment to understanding your business needs and delivering solutions that not only meet technical requirements but also drive real value. I approach each project with a combination of technical excellence and creative problem-solving.
              </p>
            </div>
            
            <div className="flex flex-wrap gap-4 mt-8">
              {/* <Button className="bg-orange hover:bg-orange-light text-black font-medium">
                Download Resume
              </Button> */}
              <Button variant="outline" className="border-orange hover:bg-orange/10 text-orange-light">
                Contact Me
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ExperienceBar({ label, percentage, color = "orange" }: { label: string, percentage: number, color?: string }) {
  const colorClass = {
    orange: "from-orange-light to-orange",
    "neon-cyan": "from-neon-cyan to-cyan-600",
    "neon-purple": "from-neon-purple to-purple-600"
  }[color];
  
  return (
    <div>
      <div className="flex justify-between text-xs text-gray-300 mb-1">
        <span>{label}</span>
        <span>{percentage}%</span>
      </div>
      <div className="h-2 bg-black/50 rounded-full overflow-hidden">
        <div 
          className={`h-full bg-gradient-to-r ${colorClass}`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
}