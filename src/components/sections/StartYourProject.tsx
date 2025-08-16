import React, { useEffect, useRef, useState, Fragment, FC } from "react";
import { Dialog, Transition } from '@headlessui/react';
import { UserCircleIcon, BriefcaseIcon, XMarkIcon } from '@heroicons/react/24/outline';

// Extend the Window interface to include the emailjs property for TypeScript
declare global {
    interface Window {
        emailjs: any;
    }
}

// You can create a separate file for this or keep it here
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

interface FormData {
    userName: string;
    userAge: number | '';
    userCategory: string;
    contactNumber: string;
    businessName: string;
    businessAddress: string;
    projectRequirements: string;
}

interface StartYourProjectProps {
    isOpen: boolean;
    closeModal: () => void;
}

export const StartYourProject: FC<StartYourProjectProps> = ({ isOpen, closeModal }) => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState<FormData>({
        userName: '',
        userAge: '',
        userCategory: '',
        contactNumber: '', 
        businessName: '',
        businessAddress: '',
        projectRequirements: '',
    });
    
    const [message, setMessage] = useState('');
    const [messageStyle, setMessageStyle] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const formRef = useRef<HTMLFormElement>(null);

    // IMPORTANT: Replace with your actual EmailJS credentials
    const PUBLIC_KEY = '5y8KdjzVD5ppIrt3r';
    const SERVICE_ID = 'service_9fdnprq';
    const TEMPLATE_ID = 'template_9y2i8jf';

    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js';
        script.async = true;
        
        script.onload = () => {
            if (window.emailjs) {
                window.emailjs.init(PUBLIC_KEY);
            } else {
                console.warn('EmailJS library failed to load.');
            }
        };

        if (!window.emailjs && !document.querySelector('script[src*="email.min.js"]')) {
            document.body.appendChild(script);
        }

        return () => {
            if (document.body.contains(script)) {
                document.body.removeChild(script);
            }
        };
    }, [PUBLIC_KEY]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const showMessage = (msg: string, style: string) => {
        setMessage(msg);
        setMessageStyle(style);
        setTimeout(() => {
            setMessage('');
        }, 5000);
    };

    const handleNext = () => {
        if (!formData.userName || !formData.userAge || !formData.userCategory || !formData.contactNumber) {
            showMessage('Please fill out all fields to continue.', 'bg-red-200 text-red-800');
            return;
        }
        setStep(2);
    };

    const handleBack = () => {
        setStep(1);
    };

    // The fix: This function is now the onSubmit handler for the form
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!formData.projectRequirements) {
            showMessage('Please describe your project requirements.', 'bg-red-200 text-red-800');
            return;
        }

        if (!window.emailjs) {
            showMessage('Email service not available. Please try again later.', 'bg-red-200 text-red-800');
            return;
        }

        setIsSubmitting(true);
        showMessage('Sending...', 'bg-blue-200 text-blue-800');

        try {
            await window.emailjs.send(SERVICE_ID, TEMPLATE_ID, {
                user_name: formData.userName,
                user_age: formData.userAge,
                user_category: formData.userCategory,
                contact_number: formData.contactNumber,
                business_name: formData.businessName,
                business_address: formData.businessAddress,
                project_requirements: formData.projectRequirements,
            });

            showMessage('Success! Your project request has been sent.', 'bg-green-200 text-green-800');
            
            setTimeout(() => {
                closeModal();
            }, 1000);

        } catch (error) {
            console.error('Email sending failed:', error);
            showMessage('Failed to send your request. Please try again later.', 'bg-red-200 text-red-800');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={closeModal}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-md" />
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
                            <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-3xl bg-white/5 p-8 sm:p-12 text-left align-middle shadow-2xl transition-all border border-white/10 backdrop-blur-lg">
                                <div className="flex justify-end">
                                    <button
                                        onClick={closeModal}
                                        className="text-gray-400 hover:text-white transition-colors focus:outline-none"
                                        aria-label="Close"
                                    >
                                        <XMarkIcon className="h-6 w-6" />
                                    </button>
                                </div>
                                
                                <Dialog.Title
                                    as="h1"
                                    className="text-4xl font-extrabold text-white mb-6 text-center text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-500"
                                >
                                    Start Your Project
                                </Dialog.Title>
                                <p className="text-gray-300 mb-10 text-center">Tell us about your project and we'll get in touch!</p>
                                
                                {/* Progress Bar */}
                                <div className="flex items-center justify-center mb-10 relative">
                                    {/* Connecting Line */}
                                    <div className={`absolute h-1 bg-gray-700 rounded-full transition-all duration-500`} style={{ width: 'calc(100% - 80px)' }}>
                                        <div className={`h-full bg-gradient-to-r from-teal-400 to-blue-500 rounded-full transition-all duration-500 ${step > 1 ? 'w-full' : 'w-0'}`}></div>
                                    </div>

                                    {/* Step Icons */}
                                    <div className="flex justify-between w-full z-10">
                                        <div className="flex flex-col items-center">
                                            <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 relative ${step >= 1 ? 'bg-gradient-to-r from-teal-400 to-blue-500' : 'bg-gray-700'}`}>
                                                <UserCircleIcon className={`h-6 w-6 text-gray-900 transition-all duration-300 ${step !== 1 ? 'text-gray-400' : 'text-gray-900'}`} />
                                            </div>
                                            <span className="text-sm text-gray-400 mt-2">Personal</span>
                                        </div>
                                        <div className="flex flex-col items-center">
                                            <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 relative ${step >= 2 ? 'bg-gradient-to-r from-teal-400 to-blue-500' : 'bg-gray-700'}`}>
                                                <BriefcaseIcon className={`h-6 w-6 text-gray-900 transition-all duration-300 ${step !== 2 ? 'text-gray-400' : 'text-gray-900'}`} />
                                            </div>
                                            <span className="text-sm text-gray-400 mt-2">Project</span>
                                        </div>
                                    </div>
                                </div>
                                
                                {/* The main form element */}
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    {/* Step 1: User Information */}
                                    {step === 1 && (
                                        <div className="space-y-6">
                                            <div>
                                                <label htmlFor="userName" className="block text-sm font-medium text-gray-300">Your Name</label>
                                                <input
                                                    type="text"
                                                    id="userName"
                                                    name="userName"
                                                    value={formData.userName}
                                                    onChange={handleInputChange}
                                                    autoComplete="name"
                                                    required
                                                    className="mt-1 block w-full px-4 py-3 rounded-lg bg-white/5 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-400 transition duration-200"
                                                />
                                            </div>
                                            <div>
                                                <label htmlFor="userAge" className="block text-sm font-medium text-gray-300">Your Age</label>
                                                <input
                                                    type="number"
                                                    id="userAge"
                                                    name="userAge"
                                                    value={formData.userAge}
                                                    onChange={handleInputChange}
                                                    required
                                                    className="mt-1 block w-full px-4 py-3 rounded-lg bg-white/5 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-400 transition duration-200"
                                                />
                                            </div>
                                             <div>
                                                    <label htmlFor="userCategory" className="block text-sm font-medium text-gray-300">Your Category</label>
                                                    <select
                                                        id="userCategory"
                                                        name="userCategory"
                                                        value={formData.userCategory}
                                                        onChange={handleInputChange}
                                                        required
                                                        className="mt-1 block w-full px-4 py-3 rounded-lg bg-white/5 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-400 transition duration-200"
                                                    >
                                                        <option value="" disabled className="bg-gray-800 text-gray-400">Select an option</option>
                                                        <option value="Student" className="bg-gray-800 text-white">Student</option>
                                                        <option value="Business Professional" className="bg-gray-800 text-white">Business Professional</option>
                                                        <option value="Freelancer" className="bg-gray-800 text-white">Freelancer</option>
                                                        <option value="Other" className="bg-gray-800 text-white">Other</option>
                                                    </select>
                                                </div>
                                            <div>
                                                <label htmlFor="contactNumber" className="block text-sm font-medium text-gray-300">Contact Number</label>
                                                <input
                                                    type="tel"
                                                    id="contactNumber"
                                                    name="contactNumber"
                                                    value={formData.contactNumber}
                                                    onChange={handleInputChange}
                                                    autoComplete="tel"
                                                    required
                                                    className="mt-1 block w-full px-4 py-3 rounded-lg bg-white/5 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-400 transition duration-200"
                                                />
                                            </div>
                                            <div className="flex justify-between mt-8">
                                                <Button
                                                    type="button"
                                                    className="border-2 border-teal-500 hover:bg-teal-500/20 text-teal-300 px-6 py-3"
                                                    onClick={closeModal}
                                                >
                                                    &larr; Back to Home
                                                </Button>
                                                <button
                                                    type="button"
                                                    onClick={handleNext}
                                                    className="px-8 py-3 bg-gradient-to-r from-teal-400 to-blue-500 text-black font-semibold rounded-full shadow-md hover:from-teal-500 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    Next &rarr;
                                                </button>
                                            </div>
                                        </div>
                                    )}
                    
                                    {/* Step 2: Project Information */}
                                    {step === 2 && (
                                        <div className="space-y-6">
                                            <div>
                                                <label htmlFor="businessName" className="block text-sm font-medium text-gray-300">Business Name</label>
                                                <input
                                                    type="text"
                                                    id="businessName"
                                                    name="businessName"
                                                    value={formData.businessName}
                                                    onChange={handleInputChange}
                                                    className="mt-1 block w-full px-4 py-3 rounded-lg bg-white/5 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-400 transition duration-200"
                                                />
                                            </div>
                                            <div>
                                                <label htmlFor="businessAddress" className="block text-sm font-medium text-gray-300">Business Address</label>
                                                <input
                                                    type="text"
                                                    id="businessAddress"
                                                    name="businessAddress"
                                                    value={formData.businessAddress}
                                                    onChange={handleInputChange}
                                                    className="mt-1 block w-full px-4 py-3 rounded-lg bg-white/5 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-400 transition duration-200"
                                                />
                                            </div>
                                            <div>
                                                <label htmlFor="projectRequirements" className="block text-sm font-medium text-gray-300">Project Requirements</label>
                                                <textarea
                                                    id="projectRequirements"
                                                    name="projectRequirements"
                                                    value={formData.projectRequirements}
                                                    onChange={handleInputChange}
                                                    rows={6}
                                                    required
                                                    className="mt-1 block w-full px-4 py-3 rounded-lg bg-white/5 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-400 transition duration-200"
                                                ></textarea>
                                            </div>
                                            <div className="flex justify-between mt-8">
                                                <button
                                                    type="button"
                                                    onClick={handleBack}
                                                    className="px-6 py-3 border-2 border-gray-500 text-gray-300 font-semibold rounded-full hover:bg-gray-500/20 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition duration-200"
                                                >
                                                    &larr; Back
                                                </button>
                                                <button
                                                    type="submit"
                                                    disabled={isSubmitting}
                                                    className="px-8 py-3 bg-gradient-to-r from-teal-400 to-blue-500 text-black font-semibold rounded-full shadow-md hover:from-teal-500 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    {isSubmitting ? 'Sending...' : 'Submit Project'}
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </form>
                                
                                {/* Success/Error Message Box */}
                                {message && (
                                    <div className={`message-box mt-8 p-4 rounded-lg text-center font-medium ${messageStyle}`}>
                                        {message}
                                    </div>
                                )}
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );

};