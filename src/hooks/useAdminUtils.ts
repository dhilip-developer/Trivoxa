import { useState, useEffect, useCallback, useRef } from 'react';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';

// Debounce hook
export function useDebounce<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(timer);
        };
    }, [value, delay]);

    return debouncedValue;
}

// Auto-save status type
export type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

// Auto-save hook for Firestore documents
export function useAutoSave<T extends object>(
    collection: string,
    docId: string,
    data: T,
    options: {
        debounceMs?: number;
        enabled?: boolean;
        onSave?: () => void;
        onError?: (error: Error) => void;
    } = {}
) {
    const { debounceMs = 1500, enabled = true, onSave, onError } = options;
    const [status, setStatus] = useState<SaveStatus>('idle');
    const [lastSaved, setLastSaved] = useState<Date | null>(null);
    const previousDataRef = useRef<string>('');
    const isFirstRender = useRef(true);

    const debouncedData = useDebounce(data, debounceMs);

    useEffect(() => {
        // Skip on first render
        if (isFirstRender.current) {
            previousDataRef.current = JSON.stringify(data);
            isFirstRender.current = false;
            return;
        }

        if (!enabled) return;

        const currentDataString = JSON.stringify(debouncedData);

        // Skip if data hasn't actually changed
        if (currentDataString === previousDataRef.current) return;

        const save = async () => {
            setStatus('saving');
            try {
                await setDoc(doc(db, collection, docId), {
                    ...debouncedData,
                    updatedAt: serverTimestamp(),
                });
                setStatus('saved');
                setLastSaved(new Date());
                previousDataRef.current = currentDataString;
                onSave?.();

                // Reset to idle after 2 seconds
                setTimeout(() => setStatus('idle'), 2000);
            } catch (error: any) {
                setStatus('error');
                onError?.(error);
                setTimeout(() => setStatus('idle'), 3000);
            }
        };

        save();
    }, [debouncedData, collection, docId, enabled, onSave, onError]);

    return { status, lastSaved };
}

// Firestore document hook for fetching and managing document state
export function useFirestoreDoc<T>(
    collection: string,
    docId: string,
    defaultValue: T
) {
    const [data, setData] = useState<T>(defaultValue);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const fetchDoc = async () => {
            try {
                const docSnap = await getDoc(doc(db, collection, docId));
                if (docSnap.exists()) {
                    setData(docSnap.data() as T);
                }
            } catch (err: any) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };
        fetchDoc();
    }, [collection, docId]);

    const updateData = useCallback((updates: Partial<T> | ((prev: T) => T)) => {
        setData(prev => {
            if (typeof updates === 'function') {
                return updates(prev);
            }
            return { ...prev, ...updates };
        });
    }, []);

    return { data, setData, updateData, loading, error };
}

// Keyboard shortcut hook
export function useKeyboardShortcuts(shortcuts: { key: string; ctrl?: boolean; handler: () => void }[]) {
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            shortcuts.forEach(({ key, ctrl, handler }) => {
                if (e.key.toLowerCase() === key.toLowerCase() && (!ctrl || e.ctrlKey || e.metaKey)) {
                    e.preventDefault();
                    handler();
                }
            });
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [shortcuts]);
}
