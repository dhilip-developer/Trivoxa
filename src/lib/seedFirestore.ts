import { collection, getDocs } from 'firebase/firestore';
import { db } from './firebase';
import { COLLECTIONS } from './firestore';

/**
 * Sync/Refresh data from Firestore
 * This function no longer seeds default data - it just verifies the connection
 * and reports what data exists. All content is managed through the admin panel.
 */
export async function seedFirestore() {
    console.log('🔄 Checking Firestore data...');

    try {
        // Just verify connection and count existing data
        const collections = [
            COLLECTIONS.HERO,
            COLLECTIONS.SERVICES,
            COLLECTIONS.PROJECTS,
            COLLECTIONS.PAGES,
            COLLECTIONS.SETTINGS,
            COLLECTIONS.REQUESTS,
        ];

        const stats: Record<string, number> = {};

        for (const collectionName of collections) {
            const snapshot = await getDocs(collection(db, collectionName));
            stats[collectionName] = snapshot.docs.length;
        }

        console.log('📊 Current Firestore data:', stats);
        console.log('✅ Sync complete - Frontend will use current Firestore data');

        return {
            success: true,
            message: 'Data synced! Frontend will display current Firestore content.',
            stats
        };
    } catch (error: any) {
        console.error('❌ Sync failed:', error);
        return { success: false, error: error.message };
    }
}
