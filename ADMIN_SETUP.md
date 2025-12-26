# Firebase Admin Panel Setup Guide

## 🚀 Quick Start

### 1. Create Admin User in Firebase Console

1. Go to [Firebase Console](https://console.firebase.google.com/) → Your Project → **Authentication**
2. Click **Add user** → Enter email & password
3. Copy the **User UID**
4. Go to **Firestore Database** → Create collection `admin_users`
5. Add a document with:
   - Document ID: `{paste the User UID}`
   - Fields:
     - `email`: (string) your email
     - `role`: (string) "admin"
     - `createdAt`: (timestamp) now

### 2. Deploy Security Rules

```bash
# Install Firebase CLI if not installed
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase in project (if not done)
firebase init

# Deploy Firestore rules
firebase deploy --only firestore:rules

# Deploy Storage rules
firebase deploy --only storage
```

### 3. Access Admin Panel

Navigate to: `http://localhost:5173/admin`

Login with the email/password you created in step 1.

---

## 📁 Files Created

| File | Purpose |
|------|---------|
| `src/lib/firebase.ts` | Firebase initialization |
| `src/lib/firestore.ts` | CRUD helper functions |
| `src/lib/AuthContext.tsx` | Authentication context |
| `src/pages/Admin/Login.tsx` | Admin login page |
| `src/pages/Admin/Layout.tsx` | Admin sidebar layout |
| `src/pages/Admin/Dashboard.tsx` | Overview dashboard |
| `src/pages/Admin/HeroEditor.tsx` | Edit hero section |
| `src/pages/Admin/ServicesEditor.tsx` | CRUD for services |
| `src/pages/Admin/ProjectsEditor.tsx` | CRUD for projects |
| `src/pages/Admin/TechStackEditor.tsx` | Manage tech icons |
| `src/pages/Admin/SettingsEditor.tsx` | Site settings |
| `firestore.rules` | Firestore security rules |
| `storage.rules` | Storage security rules |

---

## 🔒 Security

- **Public users**: Can only read published content
- **Admins**: Full read/write access
- **Unpublished content**: Hidden from public
- **Images**: Public read, authenticated write

---

## 📝 Next Steps (Frontend Integration)

To make the frontend dynamic, update components to fetch from Firestore:

```tsx
// Example: Dynamic Hero
import { getHeroContent } from '@/lib/firestore';

const [hero, setHero] = useState(null);

useEffect(() => {
  getHeroContent().then(setHero);
}, []);
```
