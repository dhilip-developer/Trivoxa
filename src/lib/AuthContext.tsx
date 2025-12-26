import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import {
    User,
    signInWithPopup,
    signInAnonymously,
    GoogleAuthProvider,
    signOut as firebaseSignOut,
    onAuthStateChanged
} from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from './firebase';
import { COLLECTIONS, SiteSettings } from './firestore';

// Primary admin email (Google) - always has access, cannot be disabled
const PRIMARY_ADMIN_EMAIL = 'trivoxatechnology@gmail.com';

// Default admin credential (fallback if Firestore is empty)
const DEFAULT_CREDENTIALS = [
    { id: 'Admin@trivoxa', password: 'Trivoxa@2025', name: 'Primary Admin' }
];

interface AuthContextType {
    user: User | null;
    isAdmin: boolean;
    loading: boolean;
    signInWithGoogle: () => Promise<{ success: boolean; error?: string }>;
    signInWithCredentials: (id: string, password: string) => Promise<{ success: boolean; error?: string }>;
    signOut: () => Promise<void>;
    primaryEmail: string;
    isAnonymous: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const googleProvider = new GoogleAuthProvider();

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            setUser(user);
            const emailMatch = user?.email?.toLowerCase() === PRIMARY_ADMIN_EMAIL.toLowerCase();
            const isAnonymousUser = user?.isAnonymous;
            setIsAdmin(!!user && (emailMatch || isAnonymousUser));
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    // Check if email is allowed for Google login
    const isEmailAllowed = async (email: string): Promise<boolean> => {
        const normalizedEmail = email.toLowerCase();

        // Primary admin always allowed
        if (normalizedEmail === PRIMARY_ADMIN_EMAIL.toLowerCase()) {
            return true;
        }

        // Check Firestore for additional allowed emails
        try {
            const docSnap = await getDoc(doc(db, COLLECTIONS.SETTINGS, 'main'));
            if (docSnap.exists()) {
                const data = docSnap.data() as SiteSettings;
                if (data.allowedEmails) {
                    return data.allowedEmails.some(
                        e => e.email.toLowerCase() === normalizedEmail && e.enabled
                    );
                }
            }
        } catch (error) {
            console.error('Error checking allowed emails:', error);
        }

        return false;
    };

    // Fetch admin credentials from Firestore
    const fetchCredentials = async (): Promise<{ id: string; password: string; name: string }[]> => {
        try {
            const docSnap = await getDoc(doc(db, COLLECTIONS.SETTINGS, 'main'));
            if (docSnap.exists()) {
                const data = docSnap.data() as SiteSettings;
                if (data.adminCredentials && data.adminCredentials.length > 0) {
                    return data.adminCredentials;
                }
            }
        } catch (error) {
            console.error('Error fetching credentials:', error);
        }
        return DEFAULT_CREDENTIALS;
    };

    const signInWithGoogle = async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const userEmail = result.user.email;

            if (!userEmail) {
                await firebaseSignOut(auth);
                return { success: false, error: 'No email associated with this account' };
            }

            // Check if email is allowed
            const allowed = await isEmailAllowed(userEmail);

            if (!allowed) {
                await firebaseSignOut(auth);
                return {
                    success: false,
                    error: `Access denied. ${userEmail} is not authorized.`
                };
            }

            setIsAdmin(true);
            return { success: true };
        } catch (error: any) {
            if (error.code === 'auth/popup-closed-by-user') {
                return { success: false, error: 'Sign-in cancelled' };
            }
            return { success: false, error: error.message || "Failed to sign in with Google" };
        }
    };

    const signInWithCredentials = async (id: string, password: string) => {
        // Fetch credentials from Firestore
        const credentials = await fetchCredentials();

        // Validate against stored credentials
        const validCred = credentials.find(c => c.id === id && c.password === password);

        if (!validCred) {
            return { success: false, error: 'Invalid admin ID or password' };
        }

        // Credentials valid, sign in anonymously to create Firebase session
        try {
            await signInAnonymously(auth);
            setIsAdmin(true);
            return { success: true };
        } catch (error: any) {
            return { success: false, error: error.message || "Failed to sign in" };
        }
    };

    const signOut = async () => {
        await firebaseSignOut(auth);
        setIsAdmin(false);
    };

    return (
        <AuthContext.Provider value={{
            user,
            isAdmin,
            loading,
            signInWithGoogle,
            signInWithCredentials,
            signOut,
            primaryEmail: PRIMARY_ADMIN_EMAIL,
            isAnonymous: user?.isAnonymous || false
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
