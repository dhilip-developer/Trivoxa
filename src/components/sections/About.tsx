import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { StartYourProject } from "./StartYourProject";

// ---
// ## Component: ExperienceBar
// A component to display a skill and its percentage mastery.
// ---
function ExperienceBar({
  label,
  percentage,
  color = "orange",
}: {
  label: string;
  percentage: number;
  color?: string;
}) {
  const colorClass = {
    orange: "from-orange-light to-orange",
    "neon-cyan": "from-neon-cyan to-cyan-600",
    "neon-purple": "from-neon-purple to-purple-600",
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

// ---
// ## Component: StatCard
// A small card to display a key metric.
// ---
function StatCard({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex-1 bg-tech-dark/50 backdrop-blur-sm p-4 rounded-lg border border-gray-800 text-center">
      <div className="text-3xl font-bold text-orange-light">{value}</div>
      <div className="text-sm text-gray-400 mt-1">{label}</div>
    </div>
  );
}

// ---
// ## Data for the About Section
// This object contains all the content for the component, making it easy to update.
// ---
const companyData = {
  about: {
    title: "Turning Ideas into Digital Reality",
    subtitle: "About Trivoxa",
    description:
      "At Trivoxa, we believe every business and individual deserves a professional online presence — without the sky-high costs. Founded by three passionate IT graduates from the 2025 batch — Mageshwar, Ashraf Ali, and Dhilip Kumar — our mission is to make high-quality website development accessible to everyone. We create websites through both programmatic development and WordPress, giving you the flexibility to choose what suits your needs best. Whether it’s an e-commerce store, a branding platform, or a personal portfolio, we tailor every project to reflect your goals, brand, and style.",
    points: [
      "Custom & WordPress Solutions – From hand-coded precision to flexible CMS builds.",
      "E-commerce Expertise – Secure, easy-to-manage online stores.",
      "Affordable Pricing – Professional quality without overspending.",
      "Client-Centric Approach – We listen, adapt, and deliver exactly what you need.",
    ],
  },
  stats: [
    { value: "3", label: "Founders" },
    { value: "2025", label: "Batch Graduates" },
    { value: "10+", label: "Projects Delivered" },
  ],
  skills: [
    { label: "MERN STACK Development", percentage: 95, color: "orange" },
    { label: "WORDPRESS Development", percentage: 85, color: "neon-cyan" },
    { label: "UI/UX Design", percentage: 90, color: "neon-purple" },
    { label: "Backend & API", percentage: 80, color: "orange" },
  ],
  image:
    "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2070&auto=format&fit=crop",
};

// ---
// ## Component: About
// The main About section component with dynamic data integration.
// ---
export default function About() {
  const [isFormVisible, setIsFormVisible] = useState(false);

  return (
    <section
      id="about"
      className="py-24 bg-gradient-to-b from-tech-dark to-black relative overflow-hidden"
    >
      {/* Background elements */}
      <div className="absolute top-1/3 left-0 w-64 h-64 rounded-full bg-neon-cyan/5 filter blur-3xl"></div>
      <div className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full bg-orange/5 filter blur-3xl"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col lg:flex-row gap-12 items-center">
          {/* Visual Side */}
          <div className="flex-1 relative order-2 lg:order-1 mt-12 lg:mt-0">
            <div className="relative rounded-xl overflow-hidden w-full max-w-lg mx-auto border border-gray-800 shadow-xl shadow-orange/10 aspect-[4/5]">
              <div className="absolute inset-0 bg-gradient-to-tr from-black via-transparent to-black/60 z-10"></div>
              <img
                src={companyData.image}
                alt="Trivoxa Team"
                className="w-full h-full object-cover"
              />

              {/* Experience bars */}
              <div className="absolute bottom-6 left-6 right-6 z-20">
                <div className="space-y-3">
                  {companyData.skills.map((skill, index) => (
                    <ExperienceBar
                      key={index}
                      label={skill.label}
                      percentage={skill.percentage}
                      color={skill.color}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Content side */}
          <div className="flex-1 space-y-6 order-1 lg:order-2">
            <div className="inline-block px-3 py-1 rounded-full bg-orange/10 border border-orange/20 text-orange-light font-medium text-sm mb-2">
              {companyData.about.subtitle}
            </div>
            <h2 className="text-4xl font-bold mb-6 orange-glow">
              <span className="bg-gradient-to-r from-orange-light to-orange bg-clip-text text-transparent">
                {companyData.about.title}
              </span>
            </h2>

            <div className="space-y-4 text-gray-300">
              <p>{companyData.about.description}</p>

              {/* "Why People Choose Us" section */}
              <div className="mt-6">
                <h4 className="text-xl font-bold text-white mb-4">
                  Why People Choose Us:
                </h4>
                <ul className="space-y-3 list-none p-0">
                  {companyData.about.points.map((point, index) => (
                    <li key={index} className="flex items-start text-gray-300">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-5 h-5 text-orange mr-2 mt-1 flex-shrink-0"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                        />
                      </svg>
                      <span className="text-lg">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Journey/Stats Section */}
        <div className="mt-12 flex flex-col items-center">
          <h4 className="text-xl font-bold text-white mb-4">Our Journey</h4>
          <div className="flex flex-col md:flex-row gap-4 w-full justify-center max-w-2xl">
            <StatCard
              value={companyData.stats[0].value}
              label={companyData.stats[0].label}
            />
            <StatCard
              value={companyData.stats[1].value}
              label={companyData.stats[1].label}
            />
            <StatCard
              value={companyData.stats[2].value}
              label={companyData.stats[2].label}
            />
          </div>
        </div>
        
        {/* Call to Action Button */}
        <div className="flex justify-center mt-12">
          <Button
            variant="outline"
            className="border-orange hover:bg-orange/10 text-orange-light"
            onClick={() => setIsFormVisible(true)}
          >
            Start Your Project
          </Button>
        </div>
      </div>
      <StartYourProject
        isOpen={isFormVisible}
        closeModal={() => setIsFormVisible(false)}
      />
    </section>
  );
}
