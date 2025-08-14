import { useRef, useEffect } from "react";

const steps = [
  {
    number: "01",
    title: "Discovery & Planning",
    description: "We begin by understanding your goals, requirements, and vision. Through detailed discussions and research, we create a comprehensive project plan."
  },
  {
    number: "02",
    title: "Design & Prototyping",
    description: "Creating intuitive user interfaces and experiences that align with your brand. We develop interactive prototypes to visualize the final product."
  },
  {
    number: "03",
    title: "Development",
    description: "Our expert engineers build your solution using industry-leading technologies and best practices, with a focus on performance and scalability."
  },
  {
    number: "04",
    title: "Testing & QA",
    description: "Rigorous quality assurance and testing ensure your product functions flawlessly across all devices and environments."
  },
  {
    number: "05",
    title: "Deployment",
    description: "Seamless deployment to production with comprehensive documentation and knowledge transfer to ensure a smooth launch."
  },
  {
    number: "06",
    title: "Maintenance & Support",
    description: "Ongoing support and maintenance to keep your product running smoothly, with updates and improvements as technology evolves."
  }
];

export default function Process() {
  const processRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const handleScroll = () => {
      if (!processRef.current) return;
      
      const elements = processRef.current.querySelectorAll('.process-item');
      const windowHeight = window.innerHeight;
      
      elements.forEach((el) => {
        const rect = el.getBoundingClientRect();
        const isVisible = rect.top < windowHeight * 0.85;
        
        if (isVisible) {
          el.classList.add('appear');
        }
      });
    };
    
    window.addEventListener('scroll', handleScroll);
    // Initial check
    setTimeout(handleScroll, 100);
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section id="process" className="py-24 bg-gradient-to-b from-black to-tech-dark relative overflow-hidden" ref={processRef}>
      {/* Background elements */}
      <div className="absolute top-1/2 right-0 w-80 h-80 rounded-full bg-orange/5 filter blur-3xl"></div>
      <div className="absolute bottom-0 left-10 w-60 h-60 rounded-full bg-neon-cyan/5 filter blur-3xl"></div>
      
      {/* Diagonal line */}
      <div className="absolute left-1/2 top-32 bottom-32 w-[1px] bg-gradient-to-b from-orange/10 via-orange/30 to-orange/10 hidden lg:block"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center mb-20">
          <div className="inline-block px-3 py-1 rounded-full bg-orange/10 border border-orange/20 text-orange-light font-medium text-sm mb-4">
            How I Work
          </div>
          <h2 className="text-4xl font-bold mb-4 orange-glow">
            <span className="bg-gradient-to-r from-orange-light to-orange bg-clip-text text-transparent">
              Development Process
            </span>
          </h2>
          <p className="text-lg text-gray-300">
            A structured approach to software development that ensures high-quality results, delivered on time and within budget.
          </p>
        </div>
        
        <div className="relative">
          {steps.map((step, index) => (
            <div 
              key={index} 
              className={`process-item mb-16 lg:mb-32 opacity-0 transition-all duration-700 ${
                index % 2 === 0 ? 'lg:pr-[50%]' : 'lg:pl-[50%] lg:text-right'
              }`}
            >
              <div className="relative">
                {/* Step number with glowing circle */}
                <div className={`inline-flex items-center justify-center w-14 h-14 rounded-full bg-black border border-orange mb-4 relative z-20 ${
                  index % 2 === 0 ? 'lg:float-right lg:ml-8 lg:-mr-7' : 'lg:float-left lg:mr-8 lg:-ml-7'
                }`}>
                  <div className="absolute inset-0 rounded-full bg-orange/10 blur-[5px]"></div>
                  <span className="text-orange-light font-bold relative z-10">{step.number}</span>
                </div>
                
                {/* Content */}
                <div className={`bg-tech-dark/50 backdrop-blur-sm border border-gray-800 p-6 rounded-lg hover:border-orange/30 transition-all ${
                  index % 2 === 0 ? 'lg:mr-12' : 'lg:ml-12'
                }`}>
                  <h3 className="text-2xl font-bold text-orange-light mb-3">
                    {step.title}
                  </h3>
                  <p className="text-gray-300">
                    {step.description}
                  </p>
                </div>
                
                {/* Connecting lines for desktop */}
                <div className="hidden lg:block absolute top-7 h-[1px] bg-gradient-to-r from-orange/10 via-orange/30 to-orange/10 z-10">
                  {index % 2 === 0 ? (
                    <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-orange/30 absolute right-0"></div>
                  ) : (
                    <div className="h-[1px] w-12 bg-gradient-to-r from-orange/30 to-transparent absolute left-0"></div>
                  )}
                </div>
                
                {/* Clear the float */}
                <div className="clear-both"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}