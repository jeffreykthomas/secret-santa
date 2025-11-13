# Quick Start - Two Versions in One Firebase Project

## ✨ What's Different Between Versions?

|                          | Default                      | Version 2                |
| ------------------------ | ---------------------------- | ------------------------ |
| **Title**                | "Thomas Family Secret Santa" | "Version 2 Secret Santa" |
| **Giftees per Santa**    | 1                            | 2                        |
| **Firestore Collection** | `santas`                     | `santas-v2`              |
| **Firebase Project**     | Same                         | Same ✅                  |

## 🚀 Quick Commands

```bash
# Development
yarn dev        # Run with access to BOTH versions (testing mode)
yarn dev:v2     # Same as dev - both versions available

# Build (for production)
yarn build:default  # Build version 1 only
yarn build:v2       # Build version 2 only

# Deploy
yarn deploy:default # Deploy version 1
yarn deploy:v2      # Deploy version 2
```

## 🧪 Testing Mode

When running in development (`yarn dev`), **both configurations are loaded automatically**!

You can switch between them in the admin page:

1. Go to `/admin`
2. Look for the blue **"🧪 Testing Mode"** card
3. Use the toggle to switch between "Default" and "Version2"
4. The title, giftees per santa, and collection all change instantly
5. No need to restart the dev server!

**Your selection is saved** in localStorage, so it persists between page refreshes.

## ⚙️ How to Customize Version 2

Edit `config.version2.js`:

```javascript
module.exports = {
  appTitle: 'Your Custom Title', // ← Change this
  gifteesPerSanta: 2, // ← Keep as 2
  collectionName: 'santas-v2', // ← Different collection for separate data
  // ... rest stays the same
};
```

## 🎯 Before Deploying

1. **Create a second hosting site** in Firebase Console:

   - Go to Hosting section
   - Click "Add another site"
   - Name it (e.g., `secret-santa-v2`)

2. **Configure hosting targets**:

```bash
firebase target:apply hosting default secret-santa-e3f0f
firebase target:apply hosting version2 your-new-site-name
```

3. **Deploy!**

```bash
yarn deploy:default  # Deploys to first site
yarn deploy:v2       # Deploys to second site
```

## 📊 Data Isolation

Both versions use the **same Firebase project** but store data in **different collections**:

```
Firebase Project: secret-santa-e3f0f
├── Collection: santas (Version 1 data)
│   └── 2024
└── Collection: santas-v2 (Version 2 data)
    └── 2024
```

Data is completely isolated - no mixing!

## 👥 Managing Family Members

**NEW**: You can now add/edit/remove family members through the UI!

1. Navigate to `/admin` in your browser
2. Add, edit, or remove family members
3. Set partner relationships
4. Reset assignments if needed

**Note**:

- The admin interface is hidden by design - access it by going to `/admin`
- Each version (collection) has its own separate family member list

## 💡 Tips

- View both collections in one Firebase Console
- Same security rules apply to both
- Easy to manage and maintain
- No need for multiple Firebase projects
- Use the admin interface to manage family members without editing code!
- **Testing mode** makes it super easy to test both versions without restarting
- Switch configurations and see changes immediately
