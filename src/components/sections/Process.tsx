import { useState, useRef, useEffect } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import {
  Lightbulb,
  Palette,
  Code2,
  TestTube2,
  Rocket,
  Headphones,
  ChevronRight,
  ChevronLeft,
  Sparkles
} from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Discovery",
    subtitle: "& Planning",
    description: "We begin by understanding your goals, requirements, and vision. Through detailed discussions and research, we create a comprehensive project plan.",
    icon: Lightbulb,
    color: "from-amber-500 to-orange-500",
    bgGlow: "bg-amber-500/20",
  },
  {
    number: "02",
    title: "Design",
    subtitle: "& Prototyping",
    description: "Creating intuitive user interfaces and experiences that align with your brand. We develop interactive prototypes to visualize the final product.",
    icon: Palette,
    color: "from-purple-500 to-pink-500",
    bgGlow: "bg-purple-500/20",
  },
  {
    number: "03",
    title: "Development",
    subtitle: "& Engineering",
    description: "Our expert engineers build your solution using industry-leading technologies and best practices, with a focus on performance and scalability.",
    icon: Code2,
    color: "from-cyan-500 to-blue-500",
    bgGlow: "bg-cyan-500/20",
  },
  {
    number: "04",
    title: "Testing",
    subtitle: "& Quality Assurance",
    description: "Rigorous quality assurance and testing ensure your product functions flawlessly across all devices and environments.",
    icon: TestTube2,
    color: "from-green-500 to-emerald-500",
    bgGlow: "bg-green-500/20",
  },
  {
    number: "05",
    title: "Deployment",
    subtitle: "& Launch",
    description: "Seamless deployment to production with comprehensive documentation and knowledge transfer to ensure a smooth launch.",
    icon: Rocket,
    color: "from-orange-500 to-red-500",
    bgGlow: "bg-orange-500/20",
  },
  {
    number: "06",
    title: "Support",
    subtitle: "& Maintenance",
    description: "Ongoing support and maintenance to keep your product running smoothly, with updates and improvements as technology evolves.",
    icon: Headphones,
    color: "from-indigo-500 to-purple-500",
    bgGlow: "bg-indigo-500/20",
  }
];

export default function Process() {
  const [activeStep, setActiveStep] = useState(0);
  const [hoveredStep, setHoveredStep] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });

  // Auto-scroll progress on mobile
  const scrollToStep = (index: number) => {
    if (scrollContainerRef.current) {
      const cardWidth = 320;
      const gap = 24;
      const scrollPosition = index * (cardWidth + gap);
      scrollContainerRef.current.scrollTo({
        left: scrollPosition,
        behavior: 'smooth'
      });
    }
    setActiveStep(index);
  };

  // Handle scroll to update active step
  useEffect(() => {
    const handleScroll = () => {
      if (scrollContainerRef.current) {
        const scrollLeft = scrollContainerRef.current.scrollLeft;
        const cardWidth = 320 + 24; // card width + gap
        const newActiveStep = Math.round(scrollLeft / cardWidth);
        if (newActiveStep !== activeStep && newActiveStep >= 0 && newActiveStep < steps.length) {
          setActiveStep(newActiveStep);
        }
      }
    };

    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', handleScroll);
      return () => scrollContainer.removeEventListener('scroll', handleScroll);
    }
  }, [activeStep]);

  return (
    <section id="process" className="py-24 relative overflow-hidden" ref={containerRef}>
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-orange-500/5 to-transparent" />
      <div className="absolute top-1/4 left-0 w-[500px] h-[500px] bg-orange-500/10 rounded-full blur-[120px] animate-pulse-slow" />
      <div className="absolute bottom-1/4 right-0 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[120px] animate-pulse-slow" />

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-orange-500/30 rounded-full"
            initial={{
              x: Math.random() * 100 + "%",
              y: Math.random() * 100 + "%",
              opacity: 0
            }}
            animate={{
              y: [null, "-20%"],
              opacity: [0, 0.5, 0],
            }}
            transition={{
              duration: 5 + Math.random() * 5,
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: "linear"
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={isInView ? { scale: 1, opacity: 1 } : {}}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-sm font-mono mb-4"
          >
            <Sparkles className="w-4 h-4" />
            HOW WE WORK
          </motion.div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">Development</span> Process
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            A structured, transparent approach that transforms your vision into reality with precision and creativity.
          </p>
        </motion.div>

        {/* Progress Steps Indicator - Desktop */}
        <div className="hidden lg:block mb-12">
          <div className="relative max-w-5xl mx-auto">
            {/* Progress Line Background */}
            <div className="absolute top-8 left-0 right-0 h-0.5 bg-white/10 rounded-full" />

            {/* Animated Progress Line */}
            <motion.div
              className="absolute top-8 left-0 h-0.5 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full"
              initial={{ width: "0%" }}
              animate={{ width: `${(activeStep / (steps.length - 1)) * 100}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />

            {/* Step Indicators */}
            <div className="relative flex justify-between">
              {steps.map((step, index) => {
                const Icon = step.icon;
                const isActive = index === activeStep;
                const isPast = index < activeStep;

                return (
                  <motion.button
                    key={index}
                    onClick={() => setActiveStep(index)}
                    onMouseEnter={() => setHoveredStep(index)}
                    onMouseLeave={() => setHoveredStep(null)}
                    className="relative flex flex-col items-center group"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {/* Glow effect */}
                    <AnimatePresence>
                      {(isActive || hoveredStep === index) && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          className={`absolute -inset-3 rounded-full ${step.bgGlow} blur-xl`}
                        />
                      )}
                    </AnimatePresence>

                    {/* Icon Circle */}
                    <motion.div
                      className={`relative w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300 ${isActive
                          ? `bg-gradient-to-br ${step.color} shadow-lg shadow-orange-500/25`
                          : isPast
                            ? 'bg-gradient-to-br from-gray-700 to-gray-800 border border-orange-500/50'
                            : 'bg-black/50 border border-white/10 group-hover:border-white/30'
                        }`}
                      animate={isActive ? {
                        boxShadow: ["0 0 20px rgba(249,115,22,0.3)", "0 0 40px rgba(249,115,22,0.5)", "0 0 20px rgba(249,115,22,0.3)"]
                      } : {}}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Icon className={`w-7 h-7 ${isActive || isPast ? 'text-white' : 'text-gray-500 group-hover:text-gray-300'}`} />
                    </motion.div>

                    {/* Step Number */}
                    <span className={`absolute -top-2 -right-2 w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center ${isActive || isPast ? 'bg-orange-500 text-white' : 'bg-gray-800 text-gray-500 border border-white/10'
                      }`}>
                      {step.number}
                    </span>

                    {/* Title */}
                    <div className="mt-4 text-center">
                      <p className={`font-semibold transition-colors ${isActive ? 'text-white' : 'text-gray-500 group-hover:text-gray-300'}`}>
                        {step.title}
                      </p>
                      <p className={`text-xs transition-colors ${isActive ? 'text-orange-400' : 'text-gray-600'}`}>
                        {step.subtitle}
                      </p>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Active Step Detail Card - Desktop */}
        <div className="hidden lg:block">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeStep}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.4 }}
              className="max-w-4xl mx-auto"
            >
              <div className={`relative bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-8 overflow-hidden group hover:border-orange-500/30 transition-all duration-500`}>
                {/* Background Glow */}
                <div className={`absolute -top-20 -right-20 w-64 h-64 ${steps[activeStep].bgGlow} rounded-full blur-[80px] opacity-50 group-hover:opacity-70 transition-opacity`} />
                <div className={`absolute -bottom-20 -left-20 w-64 h-64 ${steps[activeStep].bgGlow} rounded-full blur-[80px] opacity-30 group-hover:opacity-50 transition-opacity`} />

                <div className="relative flex items-start gap-8">
                  {/* Large Icon */}
                  <motion.div
                    className={`w-24 h-24 rounded-3xl bg-gradient-to-br ${steps[activeStep].color} flex items-center justify-center shadow-2xl flex-shrink-0`}
                    whileHover={{ rotate: [0, -5, 5, 0] }}
                    transition={{ duration: 0.5 }}
                  >
                    {(() => {
                      const Icon = steps[activeStep].icon;
                      return <Icon className="w-12 h-12 text-white" />;
                    })()}
                  </motion.div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-orange-500 font-mono text-sm">{steps[activeStep].number}</span>
                      <div className="w-8 h-px bg-orange-500/50" />
                    </div>
                    <h3 className="text-3xl font-bold text-white mb-1">
                      {steps[activeStep].title} <span className="text-gray-400 font-normal">{steps[activeStep].subtitle}</span>
                    </h3>
                    <p className="text-gray-400 text-lg leading-relaxed mt-4">
                      {steps[activeStep].description}
                    </p>
                  </div>
                </div>

                {/* Navigation Arrows */}
                <div className="absolute bottom-8 right-8 flex gap-2">
                  <button
                    onClick={() => setActiveStep(Math.max(0, activeStep - 1))}
                    disabled={activeStep === 0}
                    className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setActiveStep(Math.min(steps.length - 1, activeStep + 1))}
                    disabled={activeStep === steps.length - 1}
                    className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Mobile Horizontal Scroll Cards */}
        <div className="lg:hidden">
          {/* Progress Dots */}
          <div className="flex justify-center gap-2 mb-6">
            {steps.map((_, index) => (
              <button
                key={index}
                onClick={() => scrollToStep(index)}
                className={`w-2 h-2 rounded-full transition-all ${index === activeStep
                    ? 'w-8 bg-orange-500'
                    : 'bg-white/20 hover:bg-white/40'
                  }`}
              />
            ))}
          </div>

          {/* Scrollable Cards */}
          <div
            ref={scrollContainerRef}
            className="flex gap-6 overflow-x-auto pb-6 snap-x snap-mandatory scrollbar-thin"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: index * 0.1 }}
                  className="flex-shrink-0 w-[320px] snap-center"
                >
                  <div className={`relative bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 h-full overflow-hidden group hover:border-orange-500/30 transition-all duration-300`}>
                    {/* Glow */}
                    <div className={`absolute -top-10 -right-10 w-32 h-32 ${step.bgGlow} rounded-full blur-[50px] opacity-30 group-hover:opacity-60 transition-opacity`} />

                    <div className="relative">
                      {/* Icon & Number */}
                      <div className="flex items-center justify-between mb-4">
                        <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center shadow-lg`}>
                          <Icon className="w-7 h-7 text-white" />
                        </div>
                        <span className="text-4xl font-bold text-white/10">{step.number}</span>
                      </div>

                      {/* Title */}
                      <h3 className="text-xl font-bold text-white mb-1">
                        {step.title}
                      </h3>
                      <p className="text-orange-400 text-sm mb-3">{step.subtitle}</p>

                      {/* Description */}
                      <p className="text-gray-400 text-sm leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Swipe Hint */}
          <motion.div
            initial={{ opacity: 1 }}
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ duration: 2, repeat: 3 }}
            className="text-center text-gray-500 text-sm mt-4 flex items-center justify-center gap-2"
          >
            <ChevronLeft className="w-4 h-4" />
            Swipe to explore
            <ChevronRight className="w-4 h-4" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
