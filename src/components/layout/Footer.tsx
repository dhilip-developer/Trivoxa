import React from "react";
import { Link } from "react-router-dom";
import logoImage from "../../Assets/Trivoxa Triangle.png";

// ---
// ## Component: Footer
// The main Footer component with corrected logic and JSX.
// ---

export default function Footer() {
  const handleScrollTo = (sectionId: string) => {
    const section = document.querySelector(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      console.warn(`Scroll target not found: ${sectionId}`);
    }
  };

  return (
    <footer className="bg-black relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-tech-dark/50 to-transparent"></div>
      <div className="absolute top-1/4 left-10 w-40 h-40 rounded-full bg-orange/5 filter blur-3xl"></div>
      <div className="absolute bottom-1/4 right-10 w-60 h-60 rounded-full bg-neon-cyan/5 filter blur-3xl"></div>

      {/* Main Footer */}
      <div className="container mx-auto px-4 pt-8 pb-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-10">
          {/* Logo and info */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <a
              href="/"
              className="flex flex-col items-center md:items-start gap-2 mb-6"
            >
              <div className="relative">
                <div className=" flex  text-orange-light font-bold text-2xl tracking-tight">
                  <img
                    src={logoImage}
                    alt="Trivoxa Logo"
                    className="h-8 w-auto mx-auto md:mx-0"
                  />
                  <span className="text-orange-light font-bold text-2xl tracking-tight">
                    Trivoxa
                  </span>
                </div>
              </div>
            </a>
            <p className="text-gray-400 mb-6 max-w-sm">
              Premium software development services to transform your ideas into
              reality. Custom solutions designed for your unique needs.
            </p>
          </div>

          {/* Services */}
          <div className="text-center md:text-left">
            <h3 className="text-white font-bold mb-6">Services</h3>
            <ul className="space-y-4">
              <FooterLink href="#services">Web Development</FooterLink>
              <FooterLink href="#services">Mobile App Development</FooterLink>
              <FooterLink href="#services">UI/UX Design</FooterLink>
              <FooterLink href="#services">Backend Development</FooterLink>
              <FooterLink href="#services">AI Integration</FooterLink>
            </ul>
          </div>

          {/* Quick Links */}
          <div className="text-center md:text-left">
            <h3 className="text-white font-bold mb-6">Quick Links</h3>
            <ul className="space-y-4">
              <FooterLink href="#work">Portfolio</FooterLink>
              <FooterLink href="#process">Process</FooterLink>
              <FooterLink href="#about">About Me</FooterLink>
              <FooterLink href="#blog">Blog</FooterLink>
              <FooterLink href="#contact">Contact</FooterLink>
            </ul>
          </div>

          {/* Contact */}
          <div className="text-center md:text-left">
            <h3 className="text-white font-bold mb-6">Contact</h3>
            <ul className="space-y-4 text-gray-400">
              <li className="flex items-start gap-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5 text-orange-light mt-0.5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"
                  />
                </svg>
                <a href="mailto:trivoxatechnology@gmail.com">
                  contact@techdevx.com
                </a>
              </li>
              <li className="flex items-start gap-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5 text-orange-light mt-0.5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z"
                  />
                </svg>
                <a href="tel:6374106956">+91 6374106956</a>
              </li>
              <li className="flex items-start gap-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5 text-orange-light mt-0.5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
                  />
                </svg>
                <span>
                  Virtualy Service All Over The World ,<br />
                  Founders Located Chennai
                </span>
              </li>
            </ul>
          </div>
        </div>

        <hr className="border-gray-800 my-8" />

        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} TechDevX. All rights reserved.
          </p>
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <Link
              to="#"
              className="text-gray-500 hover:text-orange-light transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              to="#"
              className="text-gray-500 hover:text-orange-light transition-colors"
            >
              Terms of Service
            </Link>
            <Link
              to="#"
              className="text-gray-500 hover:text-orange-light transition-colors"
            >
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <li>
      <a
        href={href}
        className="text-gray-400 hover:text-orange-light transition-colors inline-block relative group"
      >
        {children}
        <span className="absolute left-0 -bottom-1 w-0 h-[1px] bg-orange-light transition-all group-hover:w-full"></span>
      </a>
    </li>
  );
}
