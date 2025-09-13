import React, { useState, Fragment } from "react";
import { Link } from "react-router-dom";
import trivoxa from "@/Assets/trivoxa-logo.png";
import { Dialog, Transition } from "@headlessui/react";

// ---
// ## Component: Footer
// The main Footer component with corrected logic and JSX.
// ---

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
      <p>This Privacy Policy describes how Trivoxa collects, uses, and protects your personal information. We are committed to safeguarding your privacy and ensuring the security of your data.</p>
      
      <h2>2. Information We Collect</h2>
      <p>We may collect information you provide directly to us, such as your name, email address, and phone number when you contact us through our website. We also collect certain data automatically, including IP addresses, browser type, and usage data, to improve our services.</p>
      
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
      <p>You have the right to access, correct, or delete your personal data. If you wish to exercise these rights or have any questions about this policy, please contact us at contact@techdevx.com.</p>
    `,
  },
  terms: {
    title: "Terms of Service",
    content: `
      <h2>1. Acceptance of Terms</h2>
      <p>By accessing and using our website and services, you agree to comply with and be bound by these Terms of Service. If you do not agree to these terms, you should not use our services.</p>

      <h2>2. Services</h2>
      <p>Trivoxa provides professional software development services. The specifics of each project will be outlined in a separate agreement between you and Trivoxa. We reserve the right to modify, suspend, or discontinue any part of our services at any time.</p>

      <h2>3. User Responsibilities</h2>
      <p>You are responsible for ensuring that any content you provide to us is accurate and does not violate any third-party rights. You agree not to use our services for any illegal or unauthorized purposes.</p>

      <h2>4. Intellectual Property</h2>
      <p>All intellectual property rights related to the services provided by Trivoxa, including but not limited to software, designs, and content, remain the property of Trivoxa unless otherwise specified in a separate agreement.</p>

      <h2>5. Limitation of Liability</h2>
      <p>Trivoxa shall not be liable for any indirect, incidental, or consequential damages resulting from the use of our services. Our total liability for any claim arising from these terms will not exceed the amount you paid for the services.</p>
    `,
  },
  cookie: {
    title: "Cookie Policy",
    content: `
      <h2>1. What Are Cookies?</h2>
      <p>Cookies are small text files stored on your device when you visit a website. They are widely used to make websites work more efficiently, as well as to provide information to the site's owners.</p>

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
      <p>The content, organization, graphics, design, compilation, and other matters related to this website and its services are protected under applicable copyrights and other proprietary laws. All content, including but not limited to text, images, and code, is the property of Trivoxa.</p>

      <h2>2. Unauthorized Use</h2>
      <p>Any unauthorized use of the content or materials on this website, including but not limited to reproduction, distribution, public display, or modification, is strictly prohibited without the express written permission of Trivoxa. This includes using the website's code, design elements, or proprietary content for commercial or non-commercial purposes.</p>

      <h2>3. Permission Requests</h2>
      <p>If you wish to use any content from this website, please contact us at contact@techdevx.com to request permission. Unauthorized use may result in legal action, including claims for monetary damages and injunctive relief.</p>
    `,
  },
};

export default function Footer() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState<ModalContent | null>(null);

  const handleOpenModal = (section: keyof typeof policyData) => {
    setModalContent(policyData[section]);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setModalContent(null);
  };

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
                    src={trivoxa}
                    alt="Trivoxa Logo"
                    className="h-8 w-auto mx-auto md:mx-0"
                  />
                  <span
                    className="text-orange-light font-bold text-2xl tracking-tight cursor-pointer"
                    onClick={() => handleScrollTo("Hero")}
                  >
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
                  trivoxatechnology@gmail.com
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
          <button
            onClick={() => handleOpenModal("copyright")}
            className="text-gray-500 hover:text-orange-light transition-colors"
          >
            © {new Date().getFullYear()} Trivoxa. All rights reserved.
          </button>
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <button
              onClick={() => handleOpenModal("privacy")}
              className="text-gray-500 hover:text-orange-light transition-colors"
            >
              Privacy Policy
            </button>
            <button
              onClick={() => handleOpenModal("terms")}
              className="text-gray-500 hover:text-orange-light transition-colors"
            >
              Terms of Service
            </button>
            <button
              onClick={() => handleOpenModal("cookie")}
              className="text-gray-500 hover:text-orange-light transition-colors"
            >
              Cookie Policy
            </button>
          </div>
        </div>
      </div>

      {/* Modal for Policy Sections */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={modalContent?.title || ""}
      >
        <div
          className="prose prose-sm md:prose-base dark:prose-invert"
          dangerouslySetInnerHTML={{ __html: modalContent?.content || "" }}
        ></div>
      </Modal>
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

// Reusable Modal Component
function Modal({
  isOpen,
  onClose,
  title,
  children,
}: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-90 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-gray-950/70 backdrop-blur-sm p-6 text-left align-middle shadow-xl transition-all border border-gray-700">
                <Dialog.Title
                  as="h3"
                  className="text-2xl font-bold leading-6 text-white mb-4 flex justify-between items-center"
                >
                  {title}
                  <button
                    onClick={onClose}
                    className="p-1 rounded-full text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </Dialog.Title>
                <div className="mt-2 text-gray-300">{children}</div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
