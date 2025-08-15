import React, { useState } from 'react';
// The user has provided lucid-react icons which are perfect for use in a React app.
// I will create inline SVG versions of them so the code is self-contained and runnable.
const Mail = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="16" x="2" y="4" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);
const Phone = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2h-6.14a2 2 0 0 1-2-2.22c-.64-3.52-.45-6.72.7-9.92a2.38 2.38 0 0 1 2.37-1.87 2.37 2.37 0 0 1 2.37 1.87c.8 2.2.98 4.28.32 7.7a.89.89 0 0 0 .1.6c.35.35.5.85.5 1.35z" />
  </svg>
);
const MapPin = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 21.75a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15z" />
    <path d="M12 21.75v-6.75" />
    <path d="M12 21.75a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15zM12 12a3 3 0 1 1 0-6 3 3 0 0 1 0 6z" />
  </svg>
);
const Linkedin = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 0-6 6v7H6v-7c0-2.2 1.8-4 4-4a4 4 0 0 1 4 4v3h4z" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);
const Github = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2C6.48 2 2 6.48 2 12c0 4.42 2.87 8.17 6.84 9.54.5.09.68-.22.68-.48v-1.78c-2.78.6-3.37-1.34-3.37-1.34-.45-1.15-1.11-1.46-1.11-1.46-.91-.62.07-.61.07-.61 1.01.07 1.54 1.04 1.54 1.04.9 1.54 2.37 1.09 2.95.83.09-.65.35-1.09.64-1.34-2.25-.26-4.62-1.12-4.62-4.99 0-1.1.4-1.99 1.04-2.69-.1-.26-.45-1.28.1-2.65 0 0 .85-.27 2.78 1.02.81-.22 1.67-.33 2.53-.33.86 0 1.72.11 2.53.33 1.93-1.29 2.78-1.02 2.78-1.02.55 1.37.2 2.39.1 2.65.64.7 1.04 1.59 1.04 2.69 0 3.88-2.37 4.73-4.62 4.99.36.31.68.91.68 1.84v2.09c0 .26.18.57.69.48C19.13 20.17 22 16.42 22 12c0-5.52-4.48-10-10-10z" />
  </svg>
);

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
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email address is invalid';
    }
    if (!formData.message.trim()) newErrors.message = 'Message is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validateForm()) {
      setFormStatus('submitting');
      // In a real application, you would make an API call here.
      // We'll simulate a successful submission with a delay.
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
     <div className="bg-zinc-950 text-gray-300 min-h-screen py-20 px-4 md:px-8 font-sans antialiased">
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
                 <div className="bg-orange-600/20 text-orange-400 p-3 rounded-full flex-shrink-0">
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
                 <div className="bg-orange-600/20 text-orange-400 p-3 rounded-full flex-shrink-0">
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
                 <div className="bg-orange-600/20 text-orange-400 p-3 rounded-full flex-shrink-0">
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
           <div className="p-8 bg-zinc-900 rounded-2xl shadow-lg animate-fadeInRight">
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
                     rows={4}
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
