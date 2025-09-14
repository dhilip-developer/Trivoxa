import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Github, Linkedin, Twitter, Globe } from "lucide-react"
import dhilip from "@/Assets/dhilip2.jpg"

// ---
// ## Component: StartYourProject (Mock Component)
// This is a placeholder modal for the "Start Your Project" action.
// This component has been moved into this file to resolve a compilation error.
// ---
function StartYourProject({ isOpen, closeModal }) {
  if (!isOpen) {
    return null
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 p-8 rounded-xl border border-gray-700 max-w-lg w-full text-center relative shadow-2xl">
        <button
          onClick={closeModal}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
        <h3 className="text-3xl font-bold text-white mb-4">
          Start Your Project
        </h3>
        <p className="text-gray-300 mb-6">
          Thank you for your interest! This is a placeholder for a contact form.
          Please replace this with your actual form component.
        </p>
        <Button onClick={closeModal}>Close</Button>
      </div>
    </div>
  )
}

function TeamCard({
  name,
  role,
  image,
  bio,
  social,
}: {
  name: string
  role: string
  image: string
  bio: string
  social: { github?: string; linkedin?: string; twitter?: string; portfolio?: string }
}) {
  return (
    <div className="group relative">
      {/* Glassmorphism card with hover effects */}
      <div className="relative bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-6 transition-all duration-500 hover:scale-105 hover:bg-card/70 hover:border-accent/30 hover:shadow-2xl hover:shadow-accent/10">
        {/* Gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-accent/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Profile image with floating effect */}
        <div className="relative mb-6">
          <div className="w-24 h-24 mx-auto rounded-full overflow-hidden border-2 border-accent/20 group-hover:border-accent/50 transition-all duration-300">
            <img
              src={image }
              alt={name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          </div>
          {/* Floating glow effect */}
          <div className="absolute inset-0 w-24 h-24 mx-auto rounded-full bg-accent/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </div>

        {/* Content */}
        <div className="relative z-10 text-center">
          <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-accent transition-colors duration-300">
            {name}
          </h3>
          <p className="text-accent font-medium mb-3">{role}</p>
          <p className="text-muted-foreground text-sm leading-relaxed mb-4">{bio}</p>

          {/* Social links */}
          <div className="flex justify-center gap-3">
            {social.portfolio && (
              <a
                href={social.portfolio}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-muted/50 hover:bg-accent hover:text-accent-foreground transition-all duration-300 hover:scale-110"
              >
                <Globe className="w-4 h-4" />
              </a>
            )}
            {social.github && (
              <a
                href={social.github}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-muted/50 hover:bg-accent hover:text-accent-foreground transition-all duration-300 hover:scale-110"
              >
                <Github className="w-4 h-4" />
              </a>
            )}
            {social.linkedin && (
              <a
                href={social.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-muted/50 hover:bg-accent hover:text-accent-foreground transition-all duration-300 hover:scale-110"
              >
                <Linkedin className="w-4 h-4" />
              </a>
            )}
            {social.twitter && (
              <a
                href={social.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-muted/50 hover:bg-accent hover:text-accent-foreground transition-all duration-300 hover:scale-110"
              >
                <Twitter className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

const companyData = {
  about: {
    title: "We Create Digital Excellence",
    subtitle: "About Us",
    description:
      "We're a passionate team of developers and designers dedicated to crafting exceptional digital experiences. Our focus is on building innovative, user-friendly solutions that empower businesses to thrive in the digital world.",
  },
  team: [
    {
      name: "Mageshwar S.V",
      role: "Developer",
      image: "/professional-woman-developer.png",
      bio: "Specialized in Automation and Micro SaaS development with expertise in IoT and modern web technologies.",
      social: {
        portfolio: "#",
        github: "https://github.com/MageshwarSV",
        linkedin: "https://www.linkedin.com/in/mageshwar-avinash/",
      },
    },
    {
      name: "Dhilipkumar A",
      role: "Developer",
      image: dhilip,
      bio: "Proficient in Java and MERN stack development with hands-on experience in J2EE and advanced coding practices.",
      social: {
        portfolio: "https://personal-portfolio-crazydhilip02s-projects.vercel.app",
        github: "https://github.com/crazydhilip02",
        linkedin: "https://www.linkedin.com/in/dhilipkumar03",
      },
    },
    {
      name: "Ashraf Ali S",
      role: "Developer",
      image: "/professional-woman-manager.png",
      bio: "Skilled Automation and Manual Test Engineer with experience in WordPress development and React applications.",
      social: {
        portfolio: "#",
        linkedin: "#",
        github: "#",
      },
    },
  ],
  heroImage: "/modern-office-collaboration.png",
}


export default function About() {
  const [isFormVisible, setIsFormVisible] = useState(false)

  return (
    <section id="about" className="py-20 bg-background relative overflow-hidden">
      <div className="absolute top-1/4 left-0 w-96 h-96 rounded-full bg-accent/5 filter blur-3xl" />
      <div className="absolute bottom-1/4 right-0 w-96 h-96 rounded-full bg-accent/3 filter blur-3xl" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-4xl mx-auto mb-16">
          <div className="inline-block px-4 py-2 rounded-full bg-accent text-accent-foreground font-medium text-sm mb-4">
            {companyData.about.subtitle}
          </div>
          <h2 className="text-4xl lg:text-6xl font-bold text-foreground mb-6 text-balance">
            {companyData.about.title}
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed max-w-2xl mx-auto text-pretty">
            {companyData.about.description}
          </p>
        </div>


        <div className="mb-16">
          <div className="text-center mb-12">
            <h3 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">Meet Our Team</h3>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              {"The creative minds behind every successful project"}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {companyData.team.map((member, index) => (
              <TeamCard
                key={index}
                name={member.name}
                role={member.role}
                image={member.image}
                bio={member.bio}
                social={member.social}
              />
            ))}
          </div>
        </div>

        <div className="text-center">
          <div className="max-w-2xl mx-auto mb-8">
            <h3 className="text-2xl lg:text-3xl font-bold text-foreground mb-4">{"Ready to Start Your Project?"}</h3>
            <p className="text-muted-foreground text-lg">
              {"Let's discuss your ideas and bring them to life together."}
            </p>
          </div>
          <Button
            size="lg"
            className="bg-accent hover:bg-accent/90 text-accent-foreground px-8 py-6 text-lg font-semibold rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-accent/25"
            onClick={() => setIsFormVisible(true)}
          >
            Start Your Project
          </Button>
        </div>
      </div>

      <StartYourProject isOpen={isFormVisible} closeModal={() => setIsFormVisible(false)} />
    </section>
  )
}
