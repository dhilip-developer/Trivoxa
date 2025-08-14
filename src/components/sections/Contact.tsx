import React, { useState } from 'react';
import { Mail, Phone, MapPin, Linkedin, Github } from 'lucide-react';

// Define the types for the form data and errors
interface FormData {
  name: string;
  email: string;
  message: string;
}

interface FormErrors {
  name?: string | null;
  email?: string | null;
  message?: string | null;
}

// A simple, self-contained Button component to avoid external dependency issues
const Button = ({ children, className = '', ...props }) => {
  const baseClasses = "rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500";
  const finalClassNames = `${baseClasses} ${className}`;
  return (
    <button
      className={finalClassNames}
      {...props}
    >
      {children}
    </button>
  );
};

const App = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    message: '',
  });
  const [formStatus, setFormStatus] = useState('idle'); // 'idle', 'submitting', 'success', 'error'
  const [errors, setErrors] = useState<FormErrors>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    // Clear the error for the field as the user types
    if (errors[name as keyof FormErrors]) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name as keyof FormErrors]: null,
      }));
    }
  };

  const validateForm = () => {
    const newErrors: FormErrors = {};
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email address is invalid';
    }
    if (!formData.message) newErrors.message = 'Message is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validateForm()) {
      setFormStatus('submitting');
      // Simulate a form submission delay
      setTimeout(() => {
        console.log('Form submitted:', formData);
        setFormStatus('success');
        setFormData({ name: '', email: '', message: '' }); // Clear the form
      }, 2000);
    } else {
      setFormStatus('error');
    }
  };

  return (
   <section id="Contact">
     <div className="bg-gradient-to-b from-background to-tech-dark text-gray-300 min-h-screen py-20 px-4 md:px-8 font-sans antialiased">
      <div className="container mx-auto">
        <header className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 animate-fadeInUp">
            Get in Touch
          </h1>
          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto animate-fadeInUp delay-200">
            We’d love to hear from you! Whether you have a project in mind, a question, or just want to say hi, feel free to reach out.
          </p>
        </header>

        <main className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-start">
          {/* Contact Information Section */}
          <div className="space-y-10 animate-fadeInLeft">
            <div className="space-y-6">
              <h2 className="text-2xl md:text-3xl font-semibold text-white">
                Contact Details
              </h2>
              <p className="text-gray-400">
                You can find us at our office or reach out through the following channels.
              </p>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="bg-orange-500/20 text-orange-400 p-3 rounded-full flex-shrink-0">
                  <Mail className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Email Address</h3>
                  <a href="mailto:info@techdevx.com" className="text-gray-400 hover:text-orange-400 transition-colors">
                    info@techdevx.com
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="bg-orange-500/20 text-orange-400 p-3 rounded-full flex-shrink-0">
                  <Phone className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Phone Number</h3>
                  <a href="tel:+1234567890" className="text-gray-400 hover:text-orange-400 transition-colors">
                    +1 (234) 567-890
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="bg-orange-500/20 text-orange-400 p-3 rounded-full flex-shrink-0">
                  <MapPin className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Office Address</h3>
                  <p className="text-gray-400">
                    123 Tech St, Silicon Valley, CA 90210
                  </p>
                </div>
              </div>
            </div>

            {/* Social Media Links */}
            <div className="flex space-x-6">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Linkedin className="h-7 w-7" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Github className="h-7 w-7" />
              </a>
              {/* Add more social icons as needed */}
            </div>
          </div>

          {/* Contact Form Section */}
          <div className="p-8 bg-gradient-to-b from-background to-tech-dark rounded-2xl shadow-lg animate-fadeInRight">
            {formStatus === 'success' ? (
              <div className="text-center p-10">
                <svg className="mx-auto h-16 w-16 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="mt-4 text-2xl font-bold text-white">Thank you!</h3>
                <p className="mt-2 text-gray-400">
                  Your message has been sent successfully. We'll get back to you shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    // Updated class name to a more robust format
                    className={`block w-full px-4 py-3 bg-gray-900 border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500 transition-colors ${
                      errors.name ? 'border-red-500' : 'border-gray-700'
                    }`}
                    placeholder="Your Name"
                  />
                  {errors.name && <p className="mt-2 text-sm text-red-400">{errors.name}</p>}
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    // Updated class name to a more robust format
                    className={`block w-full px-4 py-3 bg-gray-900 border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500 transition-colors ${
                      errors.email ? 'border-red-500' : 'border-gray-700'
                    }`}
                    placeholder="you@example.com"
                  />
                  {errors.email && <p className="mt-2 text-sm text-red-400">{errors.email}</p>}
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={4} // Changed to a number
                    // Updated class name to a more robust format
                    className={`block w-full px-4 py-3 bg-gray-900 border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-orange-500 transition-colors ${
                      errors.message ? 'border-red-500' : 'border-gray-700'
                    }`}
                    placeholder="Write your message here..."
                  />
                  {errors.message && <p className="mt-2 text-sm text-red-400">{errors.message}</p>}
                </div>
                <Button
                  type="submit"
                  className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-gray-900 font-bold rounded-lg transition-colors"
                  disabled={formStatus === 'submitting'}
                >
                  {formStatus === 'submitting' ? 'Sending...' : 'Send Message'}
                </Button>
                {formStatus === 'error' && (
                  <p className="mt-4 text-red-400 text-center">
                    Please fix the errors in the form before submitting.
                  </p>
                )}
              </form>
            )}
          </div>
        </main>
      </div>
    </div>
   </section>
  );
};

export default App;
