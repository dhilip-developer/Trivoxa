import React, { useState } from "react";
import { Linkedin, Instagram, MessageCircle, Mail, MapPin, X,Phone } from "lucide-react";

// --- Button Component ---
const Button = ({ children, className = "", ...props }) => {
  const baseClasses =
    "rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500";
  const finalClassNames = `${baseClasses} ${className}`;
  return (
    <button className={finalClassNames} {...props}>
      {children}
    </button>
  );
};

// --- App Component ---
const App = () => {
  // State to manage the visibility of the location message box
  const [showLocationMessage, setShowLocationMessage] = useState(false);

  // Social links with correct URL formats and a new tab target
  const socialLinks = [
    { name: "LinkedIn", icon: <Linkedin className="w-8 h-8" />, href: "https://www.linkedin.com/company/trivoxa" },
    {
      name: "WhatsApp",
      icon: <MessageCircle className="w-8 h-8" />,
      // WhatsApp links use the format "https://wa.me/countrycode+number"
      href: "https://wa.me/916374106956", 
    },
    { 
      name: "Instagram", 
      icon: <Instagram className="w-8 h-8" />, 
      href: "https://www.instagram.com/trivoxa_technology/" 
    },
    { 
      name: "Mail", 
      icon: <Mail className="w-8 h-8" />, 
      // Mail links use the "mailto:" protocol
      href: "mailto:trivoxatechnology@gmail.com" 
    },
    { name: "Location", icon: <MapPin className="w-8 h-8" />, href: "#" },
    { 
      name: "Mail", 
      icon: <Phone className="w-8 h-8" />, 
      // Mail links use the "mailto:" protocol
      href:"tel:6374106956" 
    } // Removed the old link
  ];

  const floatAnimation = `@keyframes float3D {
    0% { transform: translateY(0) rotateX(0deg); }
    50% { transform: translateY(-10px) rotateX(5deg); }
    100% { transform: translateY(0) rotateX(0deg); }
  }`;
  
  // Click handler for the location icon
  const handleLocationClick = (e) => {
    e.preventDefault(); // Prevents the link from navigating
    setShowLocationMessage(true);
  };
  
  return (
    <section
      id="Contact"
      className="bg-zinc-950 text-gray-300 py-16 px-0 md:px-5 font-sans antialiased flex flex-col justify-center items-center"
    >
      <style>{floatAnimation}</style>
      
      <header className="text-center mb-8"></header>

      <div className="container mx-auto px-5 relative z-10">
        <div className="max-w-4xl mx-auto bg-gradient-to-br from-zinc-950 to-black p-8 md:p-12 rounded-xl border border-gray-800 text-center">
          <h1 className="text-4xl md:text-3xl font-bold bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent mb-4 animate-fadeInUp">
            Ready to Build Something Amazing?
          </h1>
          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto animate-fadeInUp delay-200">
            We'd love to hear from you! Connect with us on our social platforms.
          </p>

          {/* Social Icons */}
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12 my-12">
            {socialLinks.map((link, index) => (
              <a
                key={index}
                href={link.href}
                // Conditionally apply onClick handler and other link properties
                onClick={link.name === "Location" ? handleLocationClick : null}
                target={link.name !== "Location" ? "_blank" : null}
                rel={link.name !== "Location" ? "noopener noreferrer" : null}
                className="group block transform-gpu perspective-1000"
              >
                <div
                  className="relative w-16 h-16 p-2 rounded-3xl bg-gradient-to-br from-zinc-800 to-zinc-900 shadow-xl border border-zinc-700 hover:from-orange-500 hover:to-orange-700 transition-all duration-300 transform-gpu preserve-3d flex items-center justify-center"
                  style={{
                    animation: `float3D 3s ease-in-out infinite ${index * 0.2}s`,
                  }}
                >
                  <div className="text-white group-hover:text-white transition-colors">
                    {link.icon}
                  </div>
                </div>
                <span className="sr-only">{link.name}</span>
              </a>
            ))}
          </div>

          {/* Contact Button */}
          <Button className="w-full max-w-xs py-4 bg-orange-500 hover:bg-orange-600 text-gray-900 font-bold text-lg rounded-full shadow-lg transition-all">
            Let's Talk
          </Button>
        </div>
      </div>
      
      {/* Conditionally rendered message box for Location */}
      {showLocationMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950 bg-opacity-75 backdrop-blur-sm p-4">
          <div className="bg-zinc-800 p-6 rounded-lg shadow-2xl max-w-sm w-full text-center relative border border-zinc-700">
            <button 
              onClick={() => setShowLocationMessage(false)} 
              className="absolute top-2 right-2 p-2 rounded-full text-gray-400 hover:bg-zinc-700 transition-colors"
              aria-label="Close message"
            >
              <X size={20} />
            </button>
            <p className="text-lg text-gray-200 font-semibold mb-2">Office Location</p>
            <p className="text-sm text-gray-400">
              No physical office location. We operate in virtual mode only.
            </p>
          </div>
        </div>
      )}

    </section>
  );
};

export default App;
