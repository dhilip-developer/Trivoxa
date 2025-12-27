import React, { useState, Fragment, useEffect } from "react";
import { motion } from "framer-motion";
import trivoxa from "@/Assets/trivoxa-logo.png";
import { Dialog, Transition } from "@headlessui/react";
import { getSiteSettings, SiteSettings } from "../../lib/firestore";
import { Mail, Phone, MapPin, X, ArrowUpRight } from "lucide-react";

// Interface for the modal content
interface ModalContent {
  title: string;
  content: string;
}

// Data for each policy section
const policyData = {
  privacy: {
    title: "Privacy Policy",
    content: `
      <h2>1. Introduction</h2>
      <p>This Privacy Policy describes how Trivoxa Technology collects, uses, and protects your personal information. We are committed to safeguarding your privacy and ensuring the security of your data.</p>
      
      <h2>2. Information We Collect</h2>
      <p>We may collect information you provide directly to us, such as your name, email address, and phone number when you contact us. We also automatically collect certain non-personal data, including your IP addresses, browser type, and usage data, to improve our services.</p>
      
      <h2>3. How We Use Your Information</h2>
      <p>The information we collect is used to:</p>
      <ul>
        <li>Provide and maintain our services.</li>
        <li>Communicate with you regarding our services and your inquiries.</li>
        <li>Improve our website's functionality and user experience.</li>
        <li>Analyze and monitor usage to better understand our audience.</li>
        <li>Comply with legal obligations.</li>
      </ul>

      <h2>4. Data Security</h2>
      <p>We implement robust security measures to protect your information from unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the Internet is 100% secure, and we cannot guarantee absolute security.</p>

      <h2>5. Your Rights</h2>
      <p>You have the right to access, correct, or delete your personal data. If you wish to exercise these rights or have any questions about this policy, please contact us at **trivoxatechnology@gmail.com**.</p>
    `,
  },
  terms: {
    title: "Terms of Service",
    content: `
      <h2>1. Acceptance of Terms</h2>
      <p>By accessing and using our website and services, you agree to comply with and be bound by these Terms of Service. If you do not agree to these terms, you should not use our services.</p>

      <h2>2. Services</h2>
      <p>Trivoxa Technology provides professional software development services. The specifics of each project will be outlined in a separate agreement. We reserve the right to modify, suspend, or discontinue any part of our services at any time.</p>

      <h2>3. User Responsibilities</h2>
      <p>You are responsible for ensuring that any content you provide to us is accurate and does not violate any third-party rights. You agree not to use our services for any illegal or unauthorized purposes.</p>

      <h2>4. Intellectual Property</h2>
      <p>All intellectual property rights related to the services provided by Trivoxa Technology, including but not limited to software, designs, and content, remain the property of Trivoxa Technology unless otherwise specified in a separate agreement.</p>

      <h2>5. Limitation of Liability</h2>
      <p>Trivoxa Technology shall not be liable for any indirect, incidental, or consequential damages resulting from the use of our services. Our total liability for any claim arising from these terms will not exceed the amount you paid for the services.</p>
    `,
  },
  cookie: {
    title: "Cookie Policy",
    content: `
      <h2>1. What Are Cookies?</h2>
      <p>Cookies are small text files stored on your device when you visit a website. They are widely used to make websites work more efficiently and to provide information to the site's owners.</p>

      <h2>2. How We Use Cookies</h2>
      <p>We use cookies to enhance your experience on our website. This includes:</p>
      <ul>
        <li>**Session Cookies:** These are temporary and are erased when you close your browser.</li>
        <li>**Analytics Cookies:** We use these to understand how visitors interact with our website, helping us improve its functionality and content.</li>
        <li>**Functionality Cookies:** These remember your preferences to provide a more personalized experience.</li>
      </ul>

      <h2>3. Your Choices</h2>
      <p>Most web browsers allow you to control cookies through their settings. However, disabling cookies may impact your ability to use certain features on our website. By continuing to use our site without changing your settings, you consent to our use of cookies.</p>
    `,
  },
  copyright: {
    title: "Copyright Notice",
    content: `
      <h2>1. Copyright Ownership</h2>
      <p>The content, organization, graphics, design, and other matters related to this website and its services are protected under applicable copyrights and other proprietary laws. All content, including but not limited to text, images, and code, is the property of Trivoxa Technology.</p>

      <h2>2. Unauthorized Use</h2>
      <p>Any unauthorized use of the content or materials on this website, including but not limited to reproduction, distribution, public display, or modification, is strictly prohibited without the express written permission of Trivoxa Technology. This includes using the website's code, design elements, or proprietary content for commercial or non-commercial purposes.</p>

      <h2>3. Permission Requests</h2>
      <p>If you wish to use any content from this website, please contact us at **trivoxatechnology@gmail.com** to request permission. Unauthorized use may result in legal action, including claims for monetary damages and injunctive relief.</p>
    `,
  },
};

// Footer Link Component
function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <a
        href={href}
        className="text-gray-500 hover:text-white transition-colors duration-300 text-sm flex items-center gap-1 group"
      >
        <span className="relative">
          {children}
          <span className="absolute left-0 -bottom-0.5 w-0 h-px bg-orange-500 transition-all duration-300 group-hover:w-full" />
        </span>
      </a>
    </li>
  );
}

// Contact Item Component
function ContactItem({ icon: Icon, children, href }: { icon: React.ComponentType<{ className?: string }>; children: React.ReactNode; href?: string }) {
  const content = (
    <div className="flex items-start gap-3 text-gray-500 hover:text-gray-300 transition-colors group">
      <Icon className="w-4 h-4 mt-0.5 text-orange-500/70 group-hover:text-orange-500 transition-colors flex-shrink-0" />
      <span className="text-sm">{children}</span>
    </div>
  );

  if (href) {
    return <a href={href} className="block">{content}</a>;
  }
  return content;
}

export default function Footer() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState<ModalContent | null>(null);
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [legalPages, setLegalPages] = useState<Record<string, { title: string; content: string }>>({});
  const [footerContact, setFooterContact] = useState({
    email: 'trivoxatechnology@gmail.com',
    phone: '+91 6374106956',
    address: 'Serving clients worldwide, founders based in Chennai',
  });

  useEffect(() => {
    getSiteSettings().then(data => {
      if (data) setSettings(data);
    });

    const fetchFooterContact = async () => {
      try {
        const { doc, getDoc } = await import('firebase/firestore');
        const { db } = await import('../../lib/firebase');
        const { COLLECTIONS } = await import('../../lib/firestore');
        const docSnap = await getDoc(doc(db, COLLECTIONS.SETTINGS, 'footerContact'));
        if (docSnap.exists()) {
          const data = docSnap.data();
          setFooterContact({
            email: data.email || 'trivoxatechnology@gmail.com',
            phone: data.phone || '+91 6374106956',
            address: data.address || 'Serving clients worldwide, founders based in Chennai',
          });
        }
      } catch (error) {
        console.error('Error fetching footer contact:', error);
      }
    };
    fetchFooterContact();

    const fetchLegalPages = async () => {
      try {
        const { collection, getDocs } = await import('firebase/firestore');
        const { db } = await import('../../lib/firebase');
        const { COLLECTIONS } = await import('../../lib/firestore');
        const querySnapshot = await getDocs(collection(db, COLLECTIONS.LEGAL));
        const pages: Record<string, { title: string; content: string }> = {};
        querySnapshot.docs.forEach(doc => {
          const data = doc.data();
          pages[doc.id] = { title: data.title, content: data.content };
        });
        if (Object.keys(pages).length > 0) {
          setLegalPages(pages);
        }
      } catch (error) {
        console.error('Error fetching legal pages:', error);
      }
    };
    fetchLegalPages();
  }, []);

  const handleOpenModal = (section: keyof typeof policyData) => {
    const firestoreContent = legalPages[section];
    if (firestoreContent) {
      setModalContent(firestoreContent);
    } else {
      setModalContent(policyData[section]);
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setModalContent(null);
  };

  return (
    <footer className="relative overflow-hidden">
      {/* Gradient fade at top */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      {/* Subtle background glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-orange-500/5 rounded-full blur-[150px] pointer-events-none" />

      {/* Main Footer Content */}
      <div className="container mx-auto px-4 pt-16 pb-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">

          {/* Brand Column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-1"
          >
            <a href="/" className="inline-flex items-center gap-2 mb-4 group">
              <img src={trivoxa} alt="Trivoxa Logo" className="h-7 w-auto" />
              <span className="text-white font-bold text-xl tracking-tight group-hover:text-orange-400 transition-colors">
                {settings?.siteName || 'Trivoxa'}
              </span>
            </a>
            <p className="text-gray-500 text-sm leading-relaxed max-w-xs">
              Premium software development services transforming ideas into reality with cutting-edge technology.
            </p>
          </motion.div>

          {/* Services Column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">Services</h3>
            <ul className="space-y-3">
              <FooterLink href="#services">Web Development</FooterLink>
              <FooterLink href="#services">Mobile Apps</FooterLink>
              <FooterLink href="#services">UI/UX Design</FooterLink>
              <FooterLink href="#services">Backend Systems</FooterLink>
              <FooterLink href="#services">AI Integration</FooterLink>
            </ul>
          </motion.div>

          {/* Quick Links Column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">Quick Links</h3>
            <ul className="space-y-3">
              <FooterLink href="#work">Portfolio</FooterLink>
              <FooterLink href="#process">Our Process</FooterLink>
              <FooterLink href="#about">About Us</FooterLink>
              <FooterLink href="#testimonials">Testimonials</FooterLink>
              <FooterLink href="#Contact">Contact</FooterLink>
            </ul>
          </motion.div>

          {/* Contact Column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">Contact</h3>
            <div className="space-y-3">
              <ContactItem icon={Mail} href={`mailto:${footerContact.email}`}>
                {footerContact.email}
              </ContactItem>
              <ContactItem icon={Phone} href={`tel:${footerContact.phone.replace(/\s/g, '')}`}>
                {footerContact.phone}
              </ContactItem>
              <ContactItem icon={MapPin}>
                {footerContact.address}
              </ContactItem>
            </div>
          </motion.div>
        </div>

        {/* Separator */}
        <div className="my-10 border-t border-dashed border-white/10" />

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <button
            onClick={() => handleOpenModal("copyright")}
            className="text-gray-600 hover:text-gray-400 transition-colors text-sm"
          >
            {settings?.copyrightText || `© ${new Date().getFullYear()} ${settings?.siteName || 'Trivoxa'}. All rights reserved.`}
          </button>

          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <button
              onClick={() => handleOpenModal("privacy")}
              className="text-gray-600 hover:text-white transition-colors flex items-center gap-1 group"
            >
              Privacy
              <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
            <button
              onClick={() => handleOpenModal("terms")}
              className="text-gray-600 hover:text-white transition-colors flex items-center gap-1 group"
            >
              Terms
              <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
            <button
              onClick={() => handleOpenModal("cookie")}
              className="text-gray-600 hover:text-white transition-colors flex items-center gap-1 group"
            >
              Cookies
              <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          </div>
        </div>
      </div>

      {/* Modal */}
      <Transition show={isModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={handleCloseModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-gray-900/95 backdrop-blur-xl p-8 shadow-2xl transition-all">
                  <Dialog.Title className="text-2xl font-bold text-white mb-6 flex justify-between items-center">
                    {modalContent?.title}
                    <button
                      onClick={handleCloseModal}
                      className="p-2 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </Dialog.Title>
                  <div
                    className="prose prose-sm prose-invert prose-headings:text-white prose-p:text-gray-400 prose-li:text-gray-400 max-w-none"
                    dangerouslySetInnerHTML={{ __html: modalContent?.content || "" }}
                  />
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </footer>
  );
}
