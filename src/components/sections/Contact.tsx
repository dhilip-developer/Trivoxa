import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Linkedin, Instagram, MessageCircle, Mail, MapPin, X, Phone, Github, Twitter, Globe, Youtube, Facebook, ArrowRight, Sparkles } from "lucide-react";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { COLLECTIONS, SocialLink } from "../../lib/firestore";

// Icon mapping for lucide-react icons
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  'linkedin': Linkedin,
  'instagram': Instagram,
  'whatsapp': MessageCircle,
  'mail': Mail,
  'email': Mail,
  'location': MapPin,
  'github': Github,
  'twitter': Twitter,
  'twitter/x': Twitter,
  'website': Globe,
  'youtube': Youtube,
  'facebook': Facebook,
  'phone': Phone,
};

// Color schemes for social icons
const iconColors: Record<string, { bg: string; hover: string; glow: string }> = {
  'linkedin': { bg: 'from-blue-600/20 to-blue-400/10', hover: 'group-hover:from-blue-600 group-hover:to-blue-400', glow: 'group-hover:shadow-blue-500/30' },
  'instagram': { bg: 'from-pink-600/20 to-purple-400/10', hover: 'group-hover:from-pink-600 group-hover:to-purple-400', glow: 'group-hover:shadow-pink-500/30' },
  'whatsapp': { bg: 'from-green-600/20 to-green-400/10', hover: 'group-hover:from-green-600 group-hover:to-green-400', glow: 'group-hover:shadow-green-500/30' },
  'mail': { bg: 'from-orange-600/20 to-orange-400/10', hover: 'group-hover:from-orange-600 group-hover:to-orange-400', glow: 'group-hover:shadow-orange-500/30' },
  'email': { bg: 'from-orange-600/20 to-orange-400/10', hover: 'group-hover:from-orange-600 group-hover:to-orange-400', glow: 'group-hover:shadow-orange-500/30' },
  'location': { bg: 'from-red-600/20 to-red-400/10', hover: 'group-hover:from-red-600 group-hover:to-red-400', glow: 'group-hover:shadow-red-500/30' },
  'github': { bg: 'from-gray-600/20 to-gray-400/10', hover: 'group-hover:from-gray-600 group-hover:to-gray-400', glow: 'group-hover:shadow-gray-500/30' },
  'twitter': { bg: 'from-sky-600/20 to-sky-400/10', hover: 'group-hover:from-sky-600 group-hover:to-sky-400', glow: 'group-hover:shadow-sky-500/30' },
  'youtube': { bg: 'from-red-600/20 to-red-400/10', hover: 'group-hover:from-red-600 group-hover:to-red-400', glow: 'group-hover:shadow-red-500/30' },
  'facebook': { bg: 'from-blue-700/20 to-blue-500/10', hover: 'group-hover:from-blue-700 group-hover:to-blue-500', glow: 'group-hover:shadow-blue-500/30' },
  'phone': { bg: 'from-emerald-600/20 to-emerald-400/10', hover: 'group-hover:from-emerald-600 group-hover:to-emerald-400', glow: 'group-hover:shadow-emerald-500/30' },
};

// Default social links
const defaultSocialLinks: SocialLink[] = [
  { platform: "LinkedIn", url: "https://www.linkedin.com/company/trivoxa", icon: "linkedin" },
  { platform: "WhatsApp", url: "https://wa.me/916374106956", icon: "whatsapp" },
  { platform: "Instagram", url: "https://www.instagram.com/trivoxa_technology/", icon: "instagram" },
  { platform: "Mail", url: "mailto:trivoxatechnology@gmail.com", icon: "mail" },
  { platform: "Location", url: "#", icon: "location" },
];

interface ContactData {
  email: string;
  phone: string;
  whatsapp: string;
  address: string;
  socialLinks: SocialLink[];
}

// Social Icon Component
function SocialIcon({ link, index, onClick }: { link: SocialLink; index: number; onClick?: (e: React.MouseEvent) => void }) {
  const iconKey = link.icon?.toLowerCase() || link.platform?.toLowerCase() || 'mail';
  const IconComponent = iconMap[iconKey] || Mail;
  const colors = iconColors[iconKey] || iconColors.mail;

  return (
    <motion.a
      href={link.url}
      onClick={onClick}
      target={link.platform !== "Location" && link.icon !== "location" ? "_blank" : undefined}
      rel={link.platform !== "Location" && link.icon !== "location" ? "noopener noreferrer" : undefined}
      className="group relative flex flex-col items-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      whileHover={{ y: -8 }}
    >
      {/* Icon Container */}
      <div
        className={`relative w-14 h-14 rounded-2xl bg-gradient-to-br ${colors.bg} ${colors.hover} backdrop-blur-sm flex items-center justify-center transition-all duration-300 shadow-lg ${colors.glow} group-hover:shadow-xl`}
      >
        {/* Glass reflection effect */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-white/10 to-transparent opacity-50" />

        <IconComponent className="w-6 h-6 text-white/80 group-hover:text-white transition-colors relative z-10" />
      </div>

      {/* Label - appears on hover */}
      <motion.span
        className="mt-2 text-xs font-medium text-gray-500 group-hover:text-white transition-colors"
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
      >
        {link.platform}
      </motion.span>
    </motion.a>
  );
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
          const defaultData: ContactData = {
            email: 'trivoxatechnology@gmail.com',
            phone: '+91 6374106956',
            whatsapp: '916374106956',
            address: '',
            socialLinks: defaultSocialLinks,
          };
          setContactData(defaultData);
          await setDoc(doc(db, COLLECTIONS.CONTACT, 'main'), {
            ...defaultData,
            updatedAt: serverTimestamp(),
          });
        }
      } catch (error) {
        console.error('Error fetching contact:', error);
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

  const handleLocationClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowLocationMessage(true);
  };

  const socialLinks = contactData?.socialLinks || defaultSocialLinks;

  return (
    <section id="Contact" className="relative py-24 overflow-hidden">
      {/* Background Ambient Glows */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-orange-500/10 rounded-full blur-[150px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-[120px]" />
      </div>

      {/* Subtle Grid Pattern */}
      <div className="absolute inset-0 opacity-[0.02] bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:60px_60px]" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 text-orange-400 text-sm font-mono mb-6"
          >
            <Sparkles className="w-4 h-4" />
            GET IN TOUCH
          </motion.div>

          {/* Heading */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold text-white mb-4"
          >
            Let's Create Something{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">
              Amazing
            </span>
          </motion.h2>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-gray-400 text-lg max-w-xl mx-auto mb-12"
          >
            Ready to transform your ideas into digital reality? Connect with us on your preferred platform.
          </motion.p>

          {/* Social Icons */}
          <div className="flex flex-wrap justify-center items-start gap-6 md:gap-8 mb-12">
            {loading ? (
              <div className="flex gap-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="w-14 h-14 rounded-2xl bg-white/5 animate-pulse" />
                ))}
              </div>
            ) : (
              socialLinks.map((link, index) => (
                <SocialIcon
                  key={index}
                  link={link}
                  index={index}
                  onClick={link.platform === "Location" || link.icon === "location" ? handleLocationClick : undefined}
                />
              ))
            )}
          </div>

          {/* Separator */}
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="w-32 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent mx-auto mb-12"
          />

          {/* CTA Button */}
          <motion.a
            href={`tel:${contactData?.phone?.replace(/\s/g, '') || '6374106956'}`}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-full shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 transition-all"
          >
            <Phone className="w-5 h-5" />
            <span>Schedule a Call</span>
            <ArrowRight className="w-5 h-5" />
          </motion.a>
        </div>
      </div>

      {/* Location Modal */}
      {showLocationMessage && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          onClick={() => setShowLocationMessage(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative bg-gray-900/90 backdrop-blur-xl p-8 rounded-3xl shadow-2xl max-w-sm w-full text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowLocationMessage(false)}
              className="absolute top-4 right-4 p-2 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X size={20} />
            </button>

            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center mx-auto mb-4">
              <MapPin className="w-8 h-8 text-white" />
            </div>

            <h3 className="text-xl font-bold text-white mb-2">Office Location</h3>
            <p className="text-gray-400">
              {contactData?.address || 'We operate virtually, serving clients worldwide. Our founders are based in Chennai, India.'}
            </p>
          </motion.div>
        </motion.div>
      )}
    </section>
  );
};

export default ContactSection;
