import  { useEffect, useRef, useState, Fragment, FC } from "react";
import { Dialog, Transition } from '@headlessui/react';
import { UserCircleIcon, BriefcaseIcon, XMarkIcon } from '@heroicons/react/24/outline';

// Extend the Window interface for TypeScript compatibility with emailjs
declare global {
    interface Window {
        emailjs: any;
    }
}

// A reusable Button component with a consistent style
const Button = ({ children, className = '', ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) => {
    const baseClasses = "rounded-full font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500";
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
            showMessage('Please fill out all required fields to continue.', 'bg-red-700 text-white');
            return;
        }
        setStep(2);
    };

    const handleBack = () => {
        setStep(1);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!formData.projectRequirements) {
            showMessage('Please describe your project requirements.', 'bg-red-700 text-white');
            return;
        }

        if (!window.emailjs) {
            showMessage('Email service not available. Please try again later.', 'bg-red-700 text-white');
            return;
        }

        setIsSubmitting(true);
        showMessage('Sending...', 'bg-orange-500 text-white');

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

            showMessage('Success! Your project request has been sent.', 'bg-green-700 text-white');

            setTimeout(() => {
                closeModal();
            }, 2000);

        } catch (error) {
            console.error('Email sending failed:', error);
            showMessage('Failed to send your request. Please try again later.', 'bg-red-700 text-white');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-[100]" onClose={closeModal}>
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
                                        className="text-gray-400 hover:text-orange-300 transition-colors focus:outline-none"
                                        aria-label="Close"
                                    >
                                        <XMarkIcon className="h-6 w-6" />
                                    </button>
                                </div>

                                <Dialog.Title
                                    as="h1"
                                    className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-orange-500 mb-2 text-center"
                                >
                                    Start Your Project
                                </Dialog.Title>
                                <p className="text-gray-400 mb-10 text-center">Tell us about your project and we'll get in touch!</p>
                                
                                {/* Progress Bar */}
                                <div className="flex items-center justify-center mb-10 relative">
                                    <div className={`absolute h-1 bg-white/10 rounded-full transition-all duration-500 w-[calc(100%-80px)]`}>
                                        <div className={`h-full bg-gradient-to-r from-amber-300 to-orange-500 rounded-full transition-all duration-500 ${step > 1 ? 'w-full' : 'w-0'}`}></div>
                                    </div>

                                    {/* Step Icons */}
                                    <div className="flex justify-between w-full z-10">
                                        <div className="flex flex-col items-center">
                                            <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 relative ${step >= 1 ? 'bg-gradient-to-r from-amber-300 to-orange-500 text-gray-900' : 'bg-white/10 text-gray-400'}`}>
                                                <UserCircleIcon className={`h-6 w-6`} />
                                            </div>
                                            <span className={`text-sm mt-2 transition-colors duration-300 ${step === 1 ? 'text-white font-semibold' : 'text-gray-400'}`}>Personal</span>
                                        </div>
                                        <div className="flex flex-col items-center">
                                            <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 relative ${step >= 2 ? 'bg-gradient-to-r from-amber-300 to-orange-500 text-gray-900' : 'bg-white/10 text-gray-400'}`}>
                                                <BriefcaseIcon className={`h-6 w-6`} />
                                            </div>
                                            <span className={`text-sm mt-2 transition-colors duration-300 ${step === 2 ? 'text-white font-semibold' : 'text-gray-400'}`}>Project</span>
                                        </div>
                                    </div>
                                </div>
                                
                                {/* The main form element */}
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    {/* Step 1: User Information */}
                                    {step === 1 && (
                                        <div className="space-y-6">
                                            <div>
                                                <label htmlFor="userName" className="block text-sm font-medium text-gray-200">Your Name</label>
                                                <input
                                                    type="text"
                                                    id="userName"
                                                    name="userName"
                                                    value={formData.userName}
                                                    onChange={handleInputChange}
                                                    autoComplete="name"
                                                    required
                                                    className="mt-1 block w-full px-4 py-3 rounded-lg bg-white/5 text-white border-2 border-transparent focus:outline-none focus:ring-2 focus:ring-orange-500 transition duration-200 placeholder-gray-500"
                                                    placeholder="e.g., Jane Doe"
                                                />
                                            </div>
                                            <div>
                                                <label htmlFor="contactNumber" className="block text-sm font-medium text-gray-200">Contact Number</label>
                                                <input
                                                    type="tel"
                                                    id="contactNumber"
                                                    name="contactNumber"
                                                    value={formData.contactNumber}
                                                    onChange={handleInputChange}
                                                    autoComplete="tel"
                                                    required
                                                    className="mt-1 block w-full px-4 py-3 rounded-lg bg-white/5 text-white border-2 border-transparent focus:outline-none focus:ring-2 focus:ring-orange-500 transition duration-200 placeholder-gray-500"
                                                    placeholder="e.g., +1 (123) 456-7788"
                                                />
                                            </div>
                                            <div className="grid sm:grid-cols-2 gap-6">
                                                <div>
                                                    <label htmlFor="userAge" className="block text-sm font-medium text-gray-200">Your Age</label>
                                                    <input
                                                        type="number"
                                                        id="userAge"
                                                        name="userAge"
                                                        value={formData.userAge}
                                                        onChange={handleInputChange}
                                                        required
                                                        className="mt-1 block w-full px-4 py-3 rounded-lg bg-white/5 text-white border-2 border-transparent focus:outline-none focus:ring-2 focus:ring-orange-500 transition duration-200 placeholder-gray-500 age-input"
                                                        placeholder="e.g., 25"
                                                    />
                                                </div>
                                                <div>
                                                    <label htmlFor="userCategory" className="block text-sm font-medium text-gray-200">Your Category</label>
                                                    <select
                                                        id="userCategory"
                                                        name="userCategory"
                                                        value={formData.userCategory}
                                                        onChange={handleInputChange}
                                                        required
                                                        className="mt-1 block w-full px-4 py-3 rounded-lg bg-white/5 text-white border-2 border-transparent focus:outline-none focus:ring-2 focus:ring-orange-500 transition duration-200"
                                                    >
                                                        <option value="" disabled className="bg-gray-900 text-gray-400">Select an option</option>
                                                        <option value="Student" className="bg-gray-900 text-white">Student</option>
                                                        <option value="Business Professional" className="bg-gray-900 text-white">Business Professional</option>
                                                        <option value="Freelancer" className="bg-gray-900 text-white">Freelancer</option>
                                                        <option value="Other" className="bg-gray-900 text-white">Other</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="flex justify-between mt-8">
                                                <Button
                                                    type="button"
                                                    className="px-6 py-3 border-2 border-orange-500 text-orange-400 hover:bg-orange-500 hover:text-white"
                                                    onClick={closeModal}
                                                >
                                                    &larr; Back to Home
                                                </Button>
                                                <Button
                                                    type="button"
                                                    onClick={handleNext}
                                                    className="px-8 py-3 bg-gradient-to-r from-amber-300 to-orange-500 text-black shadow-lg hover:from-amber-200 hover:to-orange-400"
                                                >
                                                    Next &rarr;
                                                </Button>
                                            </div>
                                        </div>
                                    )}
                                
                                    {/* Step 2: Project Information */}
                                    {step === 2 && (
                                        <div className="space-y-6">
                                            <div>
                                                <label htmlFor="businessName" className="block text-sm font-medium text-gray-200">Business Name</label>
                                                <input
                                                    type="text"
                                                    id="businessName"
                                                    name="businessName"
                                                    value={formData.businessName}
                                                    onChange={handleInputChange}
                                                    className="mt-1 block w-full px-4 py-3 rounded-lg bg-white/5 text-white border-2 border-transparent focus:outline-none focus:ring-2 focus:ring-orange-500 transition duration-200 placeholder-gray-500"
                                                    placeholder="e.g., Trivoxa Inc."
                                                />
                                            </div>
                                            <div>
                                                <label htmlFor="businessAddress" className="block text-sm font-medium text-gray-200">Business Address</label>
                                                <input
                                                    type="text"
                                                    id="businessAddress"
                                                    name="businessAddress"
                                                    value={formData.businessAddress}
                                                    onChange={handleInputChange}
                                                    className="mt-1 block w-full px-4 py-3 rounded-lg bg-white/5 text-white border-2 border-transparent focus:outline-none focus:ring-2 focus:ring-orange-500 transition duration-200 placeholder-gray-500"
                                                    placeholder="e.g., 1234 Orange Street, Suite 500"
                                                />
                                            </div>
                                            <div>
                                                <label htmlFor="projectRequirements" className="block text-sm font-medium text-gray-200">Project Requirements</label>
                                                <textarea
                                                    id="projectRequirements"
                                                    name="projectRequirements"
                                                    value={formData.projectRequirements}
                                                    onChange={handleInputChange}
                                                    rows={6}
                                                    required
                                                    className="mt-1 block w-full px-4 py-3 rounded-lg bg-white/5 text-white border-2 border-transparent focus:outline-none focus:ring-2 focus:ring-orange-500 transition duration-200 placeholder-gray-500"
                                                    placeholder="Describe your project, goals, and any specific features you need."
                                                ></textarea>
                                            </div>
                                            <div className="flex justify-between mt-8">
                                                <Button
                                                    type="button"
                                                    onClick={handleBack}
                                                    className="px-6 py-3 border-2 border-orange-500 text-orange-400 hover:bg-orange-500 hover:text-white"
                                                >
                                                    &larr; Back
                                                </Button>
                                                <Button
                                                    type="submit"
                                                    disabled={isSubmitting}
                                                    className="px-8 py-3 bg-gradient-to-r from-amber-300 to-orange-500 text-black shadow-lg hover:from-amber-200 hover:to-orange-400 disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    {isSubmitting ? 'Sending...' : 'Submit Project'}
                                                </Button>
                                            </div>
                                        </div>
                                    )}
                                </form>
                                
                                {/* Success/Error Message Box */}
                                {message && (
                                    <div className={`message-box mt-8 p-4 rounded-lg text-center font-medium transition-all duration-300 ${messageStyle}`}>
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