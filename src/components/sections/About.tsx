import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Github, Linkedin, Globe, Sparkles } from "lucide-react"
import dhilip from "@/Assets/dhilip2.jpg"
import { doc, getDoc } from "firebase/firestore"
import { db } from "../../lib/firebase"
import { COLLECTIONS } from "../../lib/firestore"
import { StartYourProject } from "./StartYourProject"

// --- Minimal Transparent Team Card ---
function TeamCard({
  name = '',
  role = '',
  image = '',
  bio = '',
  portfolio = '',
  github = '',
  linkedin = '',
  social = {},
}: {
  name?: string
  role?: string
  image?: string
  bio?: string
  portfolio?: string
  github?: string
  linkedin?: string
  social?: { github?: string; linkedin?: string; twitter?: string; portfolio?: string }
}) {
  // Combine direct props with social object for backward compatibility
  const links = {
    portfolio: portfolio || social?.portfolio || '#',
    github: github || social?.github || '#',
    linkedin: linkedin || social?.linkedin || '#',
  };

  return (
    <div className="group relative text-center">
      {/* Avatar with subtle gradient ring */}
      <div className="relative inline-block mb-6">
        {/* Glow effect on hover */}
        <div className="absolute inset-0 bg-orange-500/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Spinning orbit ring */}
        <div className="absolute -inset-2 border border-dashed border-white/10 rounded-full animate-[spin_20s_linear_infinite] group-hover:border-orange-500/30 transition-colors" />

        {/* Avatar with gradient border */}
        <div className="relative w-24 h-24 rounded-full p-[2px] bg-gradient-to-br from-orange-500/60 to-purple-500/60 group-hover:from-orange-500 group-hover:to-purple-500 transition-all duration-300">
          <div className="w-full h-full rounded-full bg-black overflow-hidden">
            {image ? (
              <img
                src={image}
                alt={name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-900">
                <span className="text-2xl font-bold text-orange-500/50">{name?.charAt(0) || '?'}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Name */}
      <h3 className="text-lg font-semibold text-white mb-1 group-hover:text-orange-400 transition-colors duration-300">
        {name || 'Team Member'}
      </h3>

      {/* Role - simple, no box */}
      <p className="text-xs font-medium text-orange-400/70 uppercase tracking-wider mb-3">
        {role || 'Role'}
      </p>

      {/* Bio */}
      {bio && (
        <p className="text-gray-500 text-sm leading-relaxed mb-5 line-clamp-2 group-hover:text-gray-400 transition-colors">
          {bio}
        </p>
      )}

      {/* Social Links - Simple icons without boxes, always show all 3 */}
      <div className="flex justify-center items-center gap-4">
        <a
          href={links.portfolio}
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-500 hover:text-orange-400 transition-all duration-300 hover:scale-125"
          title="Portfolio"
        >
          <Globe className="w-5 h-5" />
        </a>
        <a
          href={links.github}
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-500 hover:text-white transition-all duration-300 hover:scale-125"
          title="GitHub"
        >
          <Github className="w-5 h-5" />
        </a>
        <a
          href={links.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-500 hover:text-blue-400 transition-all duration-300 hover:scale-125"
          title="LinkedIn"
        >
          <Linkedin className="w-5 h-5" />
        </a>
      </div>
    </div>
  )
}

const companyData = {
  about: {
    title: "We Create Digital Excellence",
    subtitle: "About Us",
    description: "We're a passionate team of developers and designers dedicated to crafting exceptional digital experiences. Our focus is on building innovative, user-friendly solutions that empower businesses to thrive in the digital world.",
  },
  team: [
    {
      name: "Mageshwar S.V",
      role: "Developer",
      image: "/professional-woman-developer.png",
      bio: "Specialized in Automation and Micro SaaS development with expertise in IoT and modern web technologies.",
      social: { portfolio: "#", github: "https://github.com/MageshwarSV", linkedin: "https://www.linkedin.com/in/mageshwar-avinash/" },
    },
    {
      name: "Dhilipkumar A",
      role: "Developer",
      image: dhilip,
      bio: "Proficient in Java and MERN stack development with hands-on experience in J2EE and advanced coding practices.",
      social: { portfolio: "https://personal-portfolio-crazydhilip02s-projects.vercel.app", github: "https://github.com/crazydhilip02", linkedin: "https://www.linkedin.com/in/dhilipkumar03" },
    },
    {
      name: "Ashraf Ali S",
      role: "Developer",
      image: "/professional-woman-manager.png",
      bio: "Skilled Automation and Manual Test Engineer with experience in WordPress development and React applications.",
      social: { portfolio: "#", linkedin: "#", github: "#" },
    },
  ],
  heroImage: "/modern-office-collaboration.png",
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
          const data = docSnap.data();
          const mergedData = {
            about: { ...companyData.about, ...data },
            team: data.team?.length ? data.team : companyData.team,
            heroImage: companyData.heroImage
          }
          setAboutData(mergedData as typeof companyData)
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
    <section id="about" className="py-24 bg-transparent relative overflow-hidden">
      {/* Background Atmosphere */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)',
          backgroundSize: '4rem 4rem',
          maskImage: 'radial-gradient(ellipse 60% 60% at 50% 0%, black 10%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse 60% 60% at 50% 0%, black 10%, transparent 100%)'
        }} />
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-orange-500/10 rounded-full blur-[100px] opacity-40" />
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[100px] opacity-30" />
      </div>

      <div className="container mx-auto px-4 relative z-10">

        {/* Header Section */}
        <div className="text-center max-w-4xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-6">
            <Sparkles className="w-3.5 h-3.5 text-orange-400" />
            <span className="text-gray-300 text-xs font-medium tracking-wide uppercase">{aboutData.about.subtitle}</span>
          </div>

          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 tracking-tight leading-tight">
            We Engineer <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-pink-500 to-purple-600">
              Digital Realities
            </span>
          </h2>

          <p className="text-gray-400 text-lg leading-relaxed max-w-2xl mx-auto">
            {aboutData.about.description}
          </p>
        </div>

        {/* Team Grid - Transparent minimal cards */}
        <div className="mb-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 max-w-5xl mx-auto">
            {loading ? (
              [1, 2, 3].map(i => (
                <div key={i} className="flex flex-col items-center">
                  <div className="w-24 h-24 rounded-full bg-white/5 animate-pulse mb-4" />
                  <div className="w-32 h-4 bg-white/5 rounded animate-pulse mb-2" />
                  <div className="w-20 h-3 bg-white/5 rounded animate-pulse" />
                </div>
              ))
            ) : aboutData.team.length === 0 ? (
              <div className="col-span-full text-center py-12 text-gray-500">No team members yet</div>
            ) : (
              aboutData.team.map((member, index) => (
                <TeamCard
                  key={index}
                  {...member}
                />
              ))
            )}
          </div>
        </div>

        {/* CTA - Clean, no box around content */}
        <div className="text-center">
          <h3 className="text-2xl md:text-3xl font-bold mb-3">
            <span className="text-white">Ready to </span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-pink-500">
              transcend the ordinary?
            </span>
          </h3>
          <p className="text-gray-500 mb-8">
            Let's build something extraordinary together
          </p>

          {/* Simple gradient button with glow */}
          <div className="inline-block relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-orange-500 to-pink-500 rounded-full blur-md opacity-60 group-hover:opacity-100 transition-opacity duration-300" />
            <Button
              className="relative bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-400 hover:to-pink-400 text-white px-8 py-6 text-lg rounded-full font-semibold shadow-lg transition-all duration-300 hover:scale-105 border-0"
              onClick={() => setIsFormVisible(true)}
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Start Your Project
            </Button>
          </div>
        </div>
      </div>

      <StartYourProject isOpen={isFormVisible} closeModal={() => setIsFormVisible(false)} />
    </section>
  )
}
