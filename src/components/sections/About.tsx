import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Github, Linkedin, Twitter, Globe } from "lucide-react"
import dhilip from "@/Assets/dhilip2.jpg"
import { doc, getDoc } from "firebase/firestore"
import { db } from "../../lib/firebase"
import { COLLECTIONS } from "../../lib/firestore"
import { StartYourProject } from "./StartYourProject"

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
      <div className="relative bg-black/50 backdrop-blur-sm border border-border/50 rounded-2xl p-6 transition-all duration-500 hover:scale-105 hover:bg-card/70 hover:border-accent/30 hover:shadow-2xl hover:shadow-accent/10">
        {/* Gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-accent/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Profile image with floating effect */}
        <div className="relative mb-6">
          <div className="w-24 h-24 mx-auto rounded-full overflow-hidden border-2 border-accent/20 group-hover:border-accent/50 transition-all duration-300">
            <img
              src={image}
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

// Skeleton loader for team cards
function TeamCardSkeleton() {
  return (
    <div className="relative bg-black/50 backdrop-blur-sm border border-border/50 rounded-2xl p-6 animate-pulse">
      {/* Profile skeleton */}
      <div className="relative mb-6">
        <div className="w-24 h-24 mx-auto rounded-full bg-white/10" />
      </div>
      {/* Content skeleton */}
      <div className="text-center space-y-3">
        <div className="h-6 bg-white/10 rounded-lg w-3/4 mx-auto" />
        <div className="h-4 bg-white/10 rounded-lg w-1/2 mx-auto" />
        <div className="h-20 bg-white/10 rounded-lg w-full" />
        <div className="flex justify-center gap-3">
          <div className="w-8 h-8 bg-white/10 rounded-full" />
          <div className="w-8 h-8 bg-white/10 rounded-full" />
          <div className="w-8 h-8 bg-white/10 rounded-full" />
        </div>
      </div>
    </div>
  )
}

export default function About() {
  const [isFormVisible, setIsFormVisible] = useState(false)
  const [aboutData, setAboutData] = useState(companyData)
  const [loading, setLoading] = useState(true)

  // Fetch about content from Firestore
  useEffect(() => {
    const fetchAbout = async () => {
      try {
        const docSnap = await getDoc(doc(db, COLLECTIONS.PAGES, 'about'))
        if (docSnap.exists()) {
          const data = docSnap.data()
          setAboutData({
            about: {
              title: data.title || companyData.about.title,
              subtitle: data.subtitle || companyData.about.subtitle,
              description: data.description || companyData.about.description,
            },
            team: data.team?.map((member: any) => ({
              name: member.name,
              role: member.role,
              image: member.image || '',
              bio: member.bio,
              social: {
                github: member.github,
                linkedin: member.linkedin,
                portfolio: member.portfolio,
              },
            })) || companyData.team,
            heroImage: companyData.heroImage,
          })
        }
      } catch (error) {
        console.error('Error fetching about:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchAbout()
  }, [])

  return (
    <section id="about" className="py-20 bg-transparent relative overflow-hidden">

      <div className="container mx-auto px-4 relative z-10">
        {/* Glass Card Container */}
        <div className="rounded-3xl bg-black/40 backdrop-blur-md border border-white/10 p-8 md:p-12 shadow-2xl">
          <div className="text-center max-w-4xl mx-auto mb-16">
            <div className="inline-block px-4 py-2 rounded-full bg-accent text-accent-foreground font-medium text-sm mb-4">
              {aboutData.about.subtitle}
            </div>
            <h2 className="text-4xl lg:text-6xl font-bold text-foreground mb-6 text-balance">
              {aboutData.about.title}
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed max-w-2xl mx-auto text-pretty">
              {aboutData.about.description}
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
              {loading ? (
                // Show skeleton loaders while loading
                <>
                  <TeamCardSkeleton />
                  <TeamCardSkeleton />
                  <TeamCardSkeleton />
                </>
              ) : aboutData.team.length === 0 ? (
                // Empty state
                <div className="col-span-full text-center py-12">
                  <p className="text-muted-foreground">No team members yet</p>
                </div>
              ) : (
                // Render team cards with stagger animation
                aboutData.team.map((member, index) => (
                  <div
                    key={index}
                    className="animate-in fade-in slide-in-from-bottom-4 duration-500"
                    style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'backwards' }}
                  >
                    <TeamCard
                      name={member.name}
                      role={member.role}
                      image={member.image}
                      bio={member.bio}
                      social={member.social}
                    />
                  </div>
                ))
              )}
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
      </div>

      <StartYourProject isOpen={isFormVisible} closeModal={() => setIsFormVisible(false)} />
    </section>
  )
}
