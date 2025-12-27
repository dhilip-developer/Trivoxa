import {
    collection,
    doc,
    getDoc,
    getDocs,
    addDoc,
    updateDoc,
    deleteDoc,
    query,
    where,
    orderBy,
    serverTimestamp,
    DocumentData
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { db, storage } from "./firebase";

export const COLLECTIONS = {
    HERO: "hero",
    SERVICES: "services",
    PROJECTS: "projects",
    TECH_STACK: "techStack",
    PAGES: "pages",
    SETTINGS: "siteSettings",
    CONTACT: "contact",
    ADMIN_USERS: "admin_users",
    REQUESTS: "requests",
    LEGAL: "legal",
    TESTIMONIALS: "testimonials",
    FAQ: "faq",
} as const;

// === TYPES ===
export interface HeroContent {
    id?: string;
    badge: string;
    headline: string;
    subheadline: string;
    primaryBtn: { text: string; action: string };
    secondaryBtn: { text: string; action: string };
    isPublished: boolean;
    updatedAt?: any;
}

export interface Service {
    id?: string;
    title: string;
    description: string;
    icon: string;
    features: string[];
    order: number;
    isPublished: boolean;
    // Design customization options
    accentColor?: 'blue' | 'purple' | 'cyan' | 'pink' | 'orange' | 'green' | 'amber' | 'indigo' | 'violet' | 'rose' | 'teal' | 'red';
    featured?: boolean;
}

export interface Project {
    id?: string;
    title: string;
    description: string;
    imageUrl: string;
    category?: string;
    tags: string[];
    link: string;
    order: number;
    isPublished: boolean;
    // Design customization options
    accentColor?: 'blue' | 'purple' | 'cyan' | 'pink' | 'orange' | 'green' | 'amber' | 'indigo' | 'violet' | 'rose' | 'teal' | 'red';
    featured?: boolean;
    displayStyle?: 'default' | 'minimal' | 'detailed';
}

export interface TechStackItem {
    id?: string;
    name: string;
    iconUrl: string;
    color: string;
    order: number;
    isActive: boolean;
}

export interface FooterLink {
    id?: string;
    label: string;
    href: string;
    icon?: string;
}

export interface SocialLink {
    id?: string;
    platform: string;
    url: string;
    icon: string;
}

export interface SiteSettings {
    siteName: string;
    tagline: string;
    logo: string;
    footerText: string;
    copyrightText: string;
    quickLinks: FooterLink[];
    serviceLinks: FooterLink[];
    socialLinks: SocialLink[];
    legalLinks: FooterLink[];
    contactEmail?: string;
    // Page visibility toggles
    pageVisibility?: {
        hero: boolean;
        services: boolean;
        projects: boolean;
        about: boolean;
        testimonials: boolean;
        faq: boolean;
        contact: boolean;
    };
    // Contact mode: 'free' = WhatsApp direct, 'rush' = Appointment booking
    contactMode?: 'free' | 'rush';
    whatsappNumber?: string;
    // Admin access control
    allowedPhones?: { phone: string; name: string; enabled: boolean }[];
    // Admin credentials (ID/Password login)
    adminCredentials?: { id: string; password: string; name: string }[];
    // Allowed Google emails for login
    allowedEmails?: { email: string; name: string; enabled: boolean }[];
}

export interface ContactInfo {
    email: string;
    phone: string;
    whatsapp: string;
    address: string;
    mapUrl?: string;
}

export interface LegalPage {
    id?: string;
    slug: string; // 'privacy', 'terms', 'cookie', 'copyright'
    title: string;
    content: string; // HTML content
    updatedAt?: any;
}

export interface ServiceRequest {
    id?: string;
    name: string;
    email: string;
    phone: string;
    company: string;
    projectType: string;
    budget: string;
    timeline: string;
    description: string;
    status: 'pending' | 'accepted' | 'rejected' | 'completed' | 'scheduled';
    scheduledDate?: string;
    adminNotes?: string;
    createdAt?: any;
    updatedAt?: any;
}

export interface Testimonial {
    id?: string;
    name: string;
    company: string;
    role: string;
    content: string;
    rating: number;
    avatarUrl?: string;
    isPublished: boolean;
    order: number;
    updatedAt?: any;
}

export interface FAQItem {
    id?: string;
    question: string;
    answer: string;
    category: string;
    order: number;
    isPublished: boolean;
    updatedAt?: any;
}

// === GENERIC CRUD OPERATIONS ===

// Get all documents from a collection
export async function getCollection<T>(collectionName: string, publishedOnly = true): Promise<T[]> {
    try {
        let q = collection(db, collectionName);
        const querySnapshot = await getDocs(q);

        const items = querySnapshot.docs
            .map(doc => ({ id: doc.id, ...doc.data() } as T))
            .filter((item: any) => !publishedOnly || item.isPublished !== false);

        // Sort by order if exists
        return items.sort((a: any, b: any) => (a.order || 0) - (b.order || 0));
    } catch (error) {
        console.error(`Error fetching ${collectionName}:`, error);
        return [];
    }
}

// Get single document
export async function getDocument<T>(collectionName: string, docId: string): Promise<T | null> {
    try {
        const docRef = doc(db, collectionName, docId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return { id: docSnap.id, ...docSnap.data() } as T;
        }
        return null;
    } catch (error) {
        console.error(`Error fetching document:`, error);
        return null;
    }
}

// Add document
export async function addDocument<T extends DocumentData>(collectionName: string, data: T): Promise<string | null> {
    try {
        const docRef = await addDoc(collection(db, collectionName), {
            ...data,
            updatedAt: serverTimestamp(),
        });
        return docRef.id;
    } catch (error) {
        console.error(`Error adding document:`, error);
        return null;
    }
}

// Update document
export async function updateDocument<T extends DocumentData>(
    collectionName: string,
    docId: string,
    data: Partial<T>
): Promise<boolean> {
    try {
        const docRef = doc(db, collectionName, docId);
        await updateDoc(docRef, {
            ...data,
            updatedAt: serverTimestamp(),
        });
        return true;
    } catch (error) {
        console.error(`Error updating document:`, error);
        return false;
    }
}

// Delete document
export async function deleteDocument(collectionName: string, docId: string): Promise<boolean> {
    try {
        await deleteDoc(doc(db, collectionName, docId));
        return true;
    } catch (error) {
        console.error(`Error deleting document:`, error);
        return false;
    }
}

// === IMAGE UPLOAD ===
export async function uploadImage(file: File, path: string): Promise<string | null> {
    try {
        const storageRef = ref(storage, path);
        const snapshot = await uploadBytes(storageRef, file);
        const downloadUrl = await getDownloadURL(snapshot.ref);
        return downloadUrl;
    } catch (error) {
        console.error("Error uploading image:", error);
        return null;
    }
}

export async function deleteImage(path: string): Promise<boolean> {
    try {
        const storageRef = ref(storage, path);
        await deleteObject(storageRef);
        return true;
    } catch (error) {
        console.error("Error deleting image:", error);
        return false;
    }
}

// === SPECIFIC GETTERS FOR FRONTEND ===

export async function getHeroContent(): Promise<HeroContent | null> {
    return getDocument<HeroContent>(COLLECTIONS.HERO, "main");
}

export async function getServices(): Promise<Service[]> {
    return getCollection<Service>(COLLECTIONS.SERVICES);
}

export async function getProjects(): Promise<Project[]> {
    return getCollection<Project>(COLLECTIONS.PROJECTS);
}

export async function getTechStack(): Promise<TechStackItem[]> {
    return getCollection<TechStackItem>(COLLECTIONS.TECH_STACK);
}

export async function getSiteSettings(): Promise<SiteSettings | null> {
    return getDocument<SiteSettings>(COLLECTIONS.SETTINGS, "main");
}
