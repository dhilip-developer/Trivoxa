"use client";

// src/components/layout/Navbar.tsx

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
// Corrected import path
import logoImage from "../../Assets/Trivoxa Triangle.png";
import { Button } from "@/components/ui/button";
// ... rest of your code



// A separate component for the navigation links
function NavLink({ href, children }) {
  return (
    <a
      href={href}
      className="text-gray-300 hover:text-orange-light transition-colors font-medium text-sm relative group"
    >
      {children}
      <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-orange-light transition-all group-hover:w-full"></span>
    </a>
  );
}

// The main Navbar component
export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled 
        ? "bg-tech-dark/90 backdrop-blur-md shadow-lg py-3" 
        : "bg-transparent py-5"
    }`}>
      <div className="container mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo and Brand Name */}
        <Link to="/" className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <img 
              src={logoImage} 
              alt="Trivoxa Logo" 
              className="h-8 w-auto" 
            />
            <span className="text-orange-light font-bold text-2xl tracking-tight">
              Trivoxa
            </span>
          </div>
        </Link>
        
        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-8">
          <NavLink href="/">Home</NavLink>
          <NavLink href="#services">Services</NavLink>
          <NavLink href="#work">Work</NavLink>
          <NavLink href="#process">Process</NavLink>
          <NavLink href="#about">About</NavLink>
          <Button >
            <NavLink  href="#Contact">Contact Me</NavLink>
          </Button>
        </div>

        {/* Mobile menu button */}
        <Button 
          variant="ghost" 
          size="icon" 
          className="md:hidden"
          onClick={toggleMobileMenu}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
        </Button>
      </div>

      {/* Mobile Menu (Optional, but a good practice) */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-[75px] left-0 right-0 bg-tech-dark/95 backdrop-blur-md shadow-lg flex flex-col items-center gap-6 py-8">
          <NavLink href="/">Home</NavLink>
          <NavLink href="#services">Services</NavLink>
          <NavLink href="#work">Work</NavLink>
          <NavLink href="#process">Process</NavLink>
          <NavLink href="#about">About</NavLink>
          <Button className="bg-orange  text-black font-medium w-fit">
          <NavLink href="#Contact">Contact Me</NavLink>
          </Button>
        </div>
      )}
    </nav>
  );
}