"use client";

import * as React from "react";
import logoImage from "../../Assets/Trivoxa Triangle.png";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { COLLECTIONS, SiteSettings } from "@/lib/firestore";

// ---
// ## Component: NavLink
// ---

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  onClick: (e: React.MouseEvent<HTMLAnchorElement>) => void;
  className?: string;
  isActive: boolean;
  isContactButton?: boolean;
}

function NavLink({
  href,
  children,
  onClick,
  className,
  isActive,
  isContactButton,
}: NavLinkProps) {
  if (isContactButton) {
    return (
      <Button
        asChild
        size="sm"
        className={`transition-all duration-300 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-400 hover:to-orange-500 text-white font-semibold text-sm px-4 py-1.5 shadow-lg shadow-orange/25 hover:shadow-orange/50 border border-white/10 hover:scale-105 active:scale-95 group ${className}`}
      >
        <a href={href} onClick={onClick}>
          {children}
        </a>
      </Button>
    );
  }

  return (
    <a
      href={href}
      onClick={onClick}
      className={`text-gray-300 hover:text-orange-light transition-colors duration-200 font-medium text-sm relative group ${isActive ? "text-orange-light" : ""
        } ${className || ""}`}
    >
      {children}
      <span
        className={`absolute -bottom-1 left-0 h-[2px] transition-all duration-200 bg-orange-light ${isActive ? "w-full" : "w-0 group-hover:w-full"
          }`}
      ></span>
    </a>
  );
}

// ---
// ## Page Visibility Interface
// ---

interface PageVisibility {
  hero: boolean;
  services: boolean;
  projects: boolean;
  about: boolean;
  testimonials: boolean;
  faq: boolean;
  contact: boolean;
}

const defaultVisibility: PageVisibility = {
  hero: true,
  services: true,
  projects: true,
  about: true,
  testimonials: true,
  faq: true,
  contact: true,
};

// ---
// ## Component: Navbar
// ---

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("Hero");
  const [visibility, setVisibility] = useState<PageVisibility>(defaultVisibility);

  useEffect(() => {
    // Fetch settings for page visibility
    const fetchSettings = async () => {
      try {
        const docSnap = await getDoc(doc(db, COLLECTIONS.SETTINGS, 'main'));
        if (docSnap.exists()) {
          const data = docSnap.data() as SiteSettings;
          if (data.pageVisibility) {
            setVisibility({
              ...defaultVisibility,
              ...data.pageVisibility,
            });
          }
        }
      } catch (error) {
        console.error('Error fetching settings:', error);
      }
    };
    fetchSettings();

    const handleScroll = () => {
      setScrolled(window.scrollY > 20);

      const sections = document.querySelectorAll("section[id]");
      const scrollPosition = window.scrollY + window.innerHeight / 3;

      let currentSection = "Hero";

      sections.forEach((section) => {
        const sectionTop = (section as HTMLElement).offsetTop;
        const sectionHeight = (section as HTMLElement).offsetHeight;

        if (
          scrollPosition >= sectionTop &&
          scrollPosition < sectionTop + sectionHeight
        ) {
          currentSection = section.id;
        }
      });

      if (window.scrollY < 50) {
        currentSection = "Hero";
      }

      setActiveSection(currentSection);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleScrollTo = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      setActiveSection(sectionId);
      section.scrollIntoView({ behavior: "smooth", block: "start" });
      setIsMobileMenuOpen(false);
    }
  };

  // Navigation items with visibility mapping
  const navItems = [
    { id: "Hero", label: "Home", visible: visibility.hero },
    { id: "services", label: "Services", visible: visibility.services },
    { id: "work", label: "Projects", visible: visibility.projects },
    { id: "process", label: "Process", visible: true }, // Always visible
    { id: "about", label: "About", visible: visibility.about },
    { id: "testimonials", label: "Reviews", visible: visibility.testimonials },
    { id: "faq", label: "FAQ", visible: visibility.faq },
  ];

  return (
    <nav
      className={`fixed z-50 transition-all duration-700 ease-[cubic-bezier(0.25,0.1,0.25,1)] ${scrolled
        ? "top-6 left-1/2 -translate-x-1/2 w-[95%] md:w-[920px] lg:w-[980px] rounded-full bg-black/60 backdrop-blur-xl border border-white/10 shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] py-2.5 px-6"
        : "top-4 left-1/2 -translate-x-1/2 w-[95%] md:w-[90%] lg:w-[1200px] border border-white/5 bg-black/20 backdrop-blur-sm py-4 rounded-2xl px-6"
        }`}
    >
      <div className="w-full h-full flex items-center justify-between">
        {/* Logo and Brand Name */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="flex items-center gap-2">
            <img src={logoImage} alt="Trivoxa Logo" className="h-7 w-auto" />
            <span
              className="text-orange-light font-bold text-xl tracking-tight cursor-pointer hidden lg:block"
              onClick={() => handleScrollTo("Hero")}
            >
              Trivoxa
            </span>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-4 lg:gap-5">
          {navItems.filter(item => item.visible).map((item) => (
            <NavLink
              key={item.id}
              href={`#${item.id}`}
              onClick={(e) => {
                e.preventDefault();
                handleScrollTo(item.id);
              }}
              isActive={activeSection === item.id}
            >
              {item.label}
            </NavLink>
          ))}
          {visibility.contact && (
            <NavLink
              href="#Contact"
              onClick={(e) => {
                e.preventDefault();
                handleScrollTo("Contact");
              }}
              isActive={activeSection === "Contact"}
              isContactButton={true}
            >
              Contact
            </NavLink>
          )}
        </div>

        {/* Mobile menu button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden hover:bg-gray-700 transition-colors"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? (
            <X className="w-6 h-6 text-gray-300" />
          ) : (
            <Menu className="w-6 h-6 text-gray-300" />
          )}
        </Button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div
          className="md:hidden absolute left-0 right-0 bg-tech-dark/95 backdrop-blur-md shadow-lg flex flex-col items-center gap-6 py-8 z-40"
          style={{ top: scrolled ? "70px" : "80px", borderRadius: scrolled ? "24px" : "0" }}
        >
          {navItems.filter(item => item.visible).map((item) => (
            <NavLink
              key={item.id}
              href={`#${item.id}`}
              onClick={(e) => {
                e.preventDefault();
                handleScrollTo(item.id);
              }}
              isActive={activeSection === item.id}
            >
              {item.label}
            </NavLink>
          ))}
          {visibility.contact && (
            <NavLink
              href="#Contact"
              onClick={(e) => {
                e.preventDefault();
                handleScrollTo("Contact");
              }}
              isActive={activeSection === "Contact"}
              isContactButton={true}
            >
              Contact
            </NavLink>
          )}
        </div>
      )}
    </nav>
  );
}
