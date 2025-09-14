"use client";

import * as React from "react";
import logoImage from "../../Assets/Trivoxa Triangle.png";
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

// ---
// ## Component: NavLink
// A separate component for the navigation links with type safety and active state.
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
        className={`transition-all duration-200 ${
          isActive
            ? "bg-orange-light hover:bg-orange-light/90"
            : "hover:bg-orange-light/70"
        }`}
      >
        <a href={href} onClick={onClick} className={className || ""}>
          {children}
        </a>
      </Button>
    );
  }

  return (
    <a
      href={href}
      onClick={onClick}
      className={`text-gray-300 hover:text-orange-light transition-colors duration-200 font-medium text-sm relative group ${
        isActive ? "text-orange-light" : ""
      } ${className || ""}`}
    >
      {children}
      <span
        className={`absolute -bottom-1 left-0 h-[2px] transition-all duration-200 bg-orange-light ${
          isActive ? "w-full" : "w-0 group-hover:w-full"
        }`}
      ></span>
    </a>
  );
}

// ---
// ## Component: Navbar
// The main Navbar component with the corrected logic and JSX.
// ---

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("Hero"); // Set initial active section to "Hero"
  const observerRef = useRef<Map<string, IntersectionObserverEntry>>(new Map());

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const sections = document.querySelectorAll("section[id]");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          observerRef.current.set(entry.target.id, entry);
        });

        const visibleSections = Array.from(observerRef.current.values()).filter(
          (entry) => entry.isIntersecting
        );

        // Find the top-most visible section based on its position in the viewport.
        if (visibleSections.length > 0) {
          const topVisibleSection = visibleSections.reduce((prev, curr) =>
            curr.boundingClientRect.top < prev.boundingClientRect.top
              ? curr
              : prev
          );
          setActiveSection(topVisibleSection.target.id);
        }
      },
      // Using a threshold of 0.2 and a margin of 80px to account for the navbar height.
      { threshold: 0.2, rootMargin: "-80px 0px -80px 0px" }
    );

    sections.forEach((section) => {
      observer.observe(section);
    });

    return () => {
      sections.forEach((section) => {
        observer.unobserve(section);
      });
    };
  }, []);

  const handleScrollTo = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      // Manually set the active section before scrolling.
      setActiveSection(sectionId);
      section.scrollIntoView({ behavior: "smooth", block: "start" });
      setIsMobileMenuOpen(false); // Close mobile menu after clicking a link
    } else {
      console.warn(`Scroll target not found: #${sectionId}`);
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-tech-dark/90 backdrop-blur-md shadow-lg py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="container mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo and Brand Name */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <img src={logoImage} alt="Trivoxa Logo" className="h-8 w-auto" />
            <span
              className="text-orange-light font-bold text-2xl tracking-tight cursor-pointer"
              onClick={() => handleScrollTo("Hero")}
            >
              Trivoxa
            </span>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-8">
          <NavLink
            href="#Hero"
            onClick={(e) => {
              e.preventDefault();
              handleScrollTo("Hero");
            }}
            isActive={activeSection === "Hero"}
          >
            Home
          </NavLink>
          <NavLink
            href="#services"
            onClick={(e) => {
              e.preventDefault();
              handleScrollTo("services");
            }}
            isActive={activeSection === "services"}
          >
            Services
          </NavLink>
          <NavLink
            href="#work"
            onClick={(e) => {
              e.preventDefault();
              handleScrollTo("work");
            }}
            isActive={activeSection === "work"}
          >
            Projects
          </NavLink>
          <NavLink
            href="#process"
            onClick={(e) => {
              e.preventDefault();
              handleScrollTo("process");
            }}
            isActive={activeSection === "process"}
          >
            Process
          </NavLink>
          <NavLink
            href="#about"
            onClick={(e) => {
              e.preventDefault();
              handleScrollTo("about");
            }}
            isActive={activeSection === "about"}
          >
            About
          </NavLink>
          <NavLink
            href="#Contact"
            onClick={(e) => {
              e.preventDefault();
              handleScrollTo("Contact");
            }}
            isActive={activeSection === "Contact"}
            isContactButton={true}
          >
            Contact Me
          </NavLink>
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
          style={{ top: scrolled ? "60px" : "76px" }}
        >
          <NavLink
            href="#Hero"
            onClick={(e) => {
              e.preventDefault();
              handleScrollTo("Hero");
            }}
            isActive={activeSection === "Hero"}
          >
            Home
          </NavLink>
          <NavLink
            href="#services"
            onClick={(e) => {
              e.preventDefault();
              handleScrollTo("services");
            }}
            isActive={activeSection === "services"}
          >
            Services
          </NavLink>
          <NavLink
            href="#work"
            onClick={(e) => {
              e.preventDefault();
              handleScrollTo("work");
            }}
            isActive={activeSection === "work"}
          >
            Projects
          </NavLink>
          <NavLink
            href="#process"
            onClick={(e) => {
              e.preventDefault();
              handleScrollTo("process");
            }}
            isActive={activeSection === "process"}
          >
            Process
          </NavLink>
          <NavLink
            href="#about"
            onClick={(e) => {
              e.preventDefault();
              handleScrollTo("about");
            }}
            isActive={activeSection === "about"}
          >
            About
          </NavLink>
          <NavLink
            href="#Contact"
            onClick={(e) => {
              e.preventDefault();
              handleScrollTo("Contact");
            }}
            isActive={activeSection === "Contact"}
            isContactButton={true}
          >
            Contact Me
          </NavLink>
        </div>
      )}
    </nav>
  );
}
