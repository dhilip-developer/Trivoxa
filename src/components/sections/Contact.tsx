import React, { useState, useEffect } from "react";
import { Linkedin, Instagram, MessageCircle, Mail, MapPin, X, Phone, Github, Twitter, Globe, Youtube, Facebook } from "lucide-react";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { COLLECTIONS, SocialLink } from "../../lib/firestore";

// Icon mapping for lucide-react icons
const iconMap: Record<string, React.ReactNode> = {
  'linkedin': <Linkedin className="w-8 h-8" />,
  'instagram': <Instagram className="w-8 h-8" />,
  'whatsapp': <MessageCircle className="w-8 h-8" />,
  'mail': <Mail className="w-8 h-8" />,
  'email': <Mail className="w-8 h-8" />,
  'location': <MapPin className="w-8 h-8" />,
  'github': <Github className="w-8 h-8" />,
  'twitter': <Twitter className="w-8 h-8" />,
  'twitter/x': <Twitter className="w-8 h-8" />,
  'website': <Globe className="w-8 h-8" />,
  'youtube': <Youtube className="w-8 h-8" />,
  'facebook': <Facebook className="w-8 h-8" />,
  'phone': <Phone className="w-8 h-8" />,
};

// Default social links (same as original)
const defaultSocialLinks: SocialLink[] = [
  { platform: "LinkedIn", url: "https://www.linkedin.com/company/trivoxa", icon: "linkedin" },
  { platform: "WhatsApp", url: "https://wa.me/916374106956", icon: "whatsapp" },
  { platform: "Instagram", url: "https://www.instagram.com/trivoxa_technology/", icon: "instagram" },
  { platform: "Mail", url: "mailto:trivoxatechnology@gmail.com", icon: "mail" },
  { platform: "Location", url: "#", icon: "location" },
];

// --- Button Component ---
const Button = ({ children, className = "", ...props }: any) => {
  const baseClasses =
    "rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500";
  const finalClassNames = `${baseClasses} ${className}`;
  return (
    <button className={finalClassNames} {...props}>
      {children}
    </button>
  );
};

interface ContactData {
  email: string;
  phone: string;
  whatsapp: string;
  address: string;
  socialLinks: SocialLink[];
}

// --- Contact Section Component ---
const ContactSection = () => {
  const [showLocationMessage, setShowLocationMessage] = useState(false);
  const [contactData, setContactData] = useState<ContactData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContact = async () => {
      try {
        const docSnap = await getDoc(doc(db, COLLECTIONS.CONTACT, 'main'));
        if (docSnap.exists()) {
          const data = docSnap.data() as ContactData;
          setContactData({
            email: data.email || 'trivoxatechnology@gmail.com',
            phone: data.phone || '+91 6374106956',
            whatsapp: data.whatsapp || '916374106956',
            address: data.address || '',
            socialLinks: data.socialLinks && data.socialLinks.length > 0 ? data.socialLinks : defaultSocialLinks,
          });
        } else {
          // No data in Firestore - use defaults and save them
          const defaultData: ContactData = {
            email: 'trivoxatechnology@gmail.com',
            phone: '+91 6374106956',
            whatsapp: '916374106956',
            address: '',
            socialLinks: defaultSocialLinks,
          };
          setContactData(defaultData);
          // Auto-save defaults to Firestore
          await setDoc(doc(db, COLLECTIONS.CONTACT, 'main'), {
            ...defaultData,
            updatedAt: serverTimestamp(),
          });
        }
      } catch (error) {
        console.error('Error fetching contact:', error);
        // Use defaults on error
        setContactData({
          email: 'trivoxatechnology@gmail.com',
          phone: '+91 6374106956',
          whatsapp: '916374106956',
          address: '',
          socialLinks: defaultSocialLinks,
        });
      } finally {
        setLoading(false);
      }
    };
    fetchContact();
  }, []);

  const floatAnimation = `@keyframes float3D {
    0% { transform: translateY(0) rotateX(0deg); }
    50% { transform: translateY(-10px) rotateX(5deg); }
    100% { transform: translateY(0) rotateX(0deg); }
  }`;

  const handleLocationClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowLocationMessage(true);
  };

  // Get lucide icon or fallback to emoji/text
  const getIcon = (link: SocialLink) => {
    const iconKey = link.icon?.toLowerCase() || link.platform?.toLowerCase();
    if (iconMap[iconKey]) {
      return iconMap[iconKey];
    }
    // Fallback: if icon starts with http, show image; otherwise show text
    if (link.icon?.startsWith('http')) {
      return <img src={link.icon} alt={link.platform} className="w-8 h-8" />;
    }
    return <span className="text-2xl">{link.icon || '🔗'}</span>;
  };

  const socialLinks = contactData?.socialLinks || defaultSocialLinks;

  return (
    <section
      id="Contact"
      className="bg-transparent text-gray-300 py-16 px-0 md:px-5 font-sans antialiased flex flex-col justify-center items-center relative"
    >
      <style>{floatAnimation}</style>

      <header className="text-center mb-8"></header>

      <div className="container mx-auto px-5 relative z-10">
        <div className="max-w-4xl mx-auto bg-black/60 backdrop-blur-md p-8 md:p-12 rounded-3xl border border-white/10 text-center shadow-2xl">
          <h1 className="text-4xl md:text-3xl font-bold bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent mb-4 animate-fadeInUp">
            Ready to Build Something Amazing?
          </h1>
          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto animate-fadeInUp delay-200">
            We'd love to hear from you! Connect with us on our social platforms.
          </p>

          {/* Social Icons */}
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12 my-12">
            {loading ? (
              <div className="w-16 h-16 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
            ) : (
              socialLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.url}
                  onClick={link.platform === "Location" || link.icon === "location" ? handleLocationClick : undefined}
                  target={link.platform !== "Location" && link.icon !== "location" ? "_blank" : undefined}
                  rel={link.platform !== "Location" && link.icon !== "location" ? "noopener noreferrer" : undefined}
                  className="group block transform-gpu perspective-1000"
                  title={link.platform}
                >
                  <div
                    className="relative w-16 h-16 p-2 rounded-3xl bg-black/50 backdrop-blur-sm shadow-xl border border-white/10 hover:from-orange-500 hover:to-orange-700 transition-all duration-300 transform-gpu preserve-3d flex items-center justify-center hover:bg-orange-500"
                    style={{
                      animation: `float3D 3s ease-in-out infinite ${index * 0.2}s`,
                    }}
                  >
                    <div className="text-white group-hover:text-white transition-colors">
                      {getIcon(link)}
                    </div>
                  </div>
                  <span className="sr-only">{link.platform}</span>
                </a>
              ))
            )}
          </div>

          {/* Animated "Let's Talk" Button */}
          <Button
            className="w-full max-w-xs py-5 md:py-5 bg-orange-500 hover:bg-orange-600 text-gray-900 font-bold text-lg rounded-full shadow-lg transition-all transform hover:scale-105 active:scale-95"
          >
            <a href={`tel:${contactData?.phone?.replace(/\s/g, '') || '6374106956'}`}>
              <span className="flex items-center justify-center">
                <Phone className="w-5 h-5 mr-3" />
                Let's Talk
              </span>
            </a>
          </Button>
        </div>
      </div>

      {/* Conditionally rendered message box for Location */}
      {showLocationMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4">
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
              {contactData?.address || 'No physical office location. We operate in virtual mode only.'}
            </p>
          </div>
        </div>
      )}
    </section>
  );
};

export default ContactSection;

