# Secret Santa - Multi-Version Setup Guide

This Secret Santa app supports multiple deployments with different configurations using the **same Firebase project** but **different Firestore collections**. Here's how to set it up and use it.

## 🎄 Features

- **Two separate versions** using the same Firebase project
- **Configurable giftees per santa** (1 or 2)
- **Custom titles** for each version
- **Independent data** via separate Firestore collections
- **Simplified management** - one Firebase console for both versions

## 📋 Setup Instructions

### 1. Configure Version 2

Edit `config.version2.js` to customize the title and collection name:

```javascript
module.exports = {
  appTitle: 'Your Custom Title Here',  // Change this to your desired title
  gifteesPerSanta: 2,                   // Keep as 2 for this version
  collectionName: 'santas-v2',          // Different collection name for separate data
  
  // Firebase Configuration (automatically shared with default version)
  firebase: {
    // ... same as default version
  }
};
```

The Firebase configuration is already set to use the same project as the default version.

### 2. Update Family Members (Optional)

If you want different family members for each version, edit `src/components/SecretSanta.vue` to modify the `familyMembers` array. You may want to load different lists based on the version/collection.

### 3. Configure Firebase Hosting Targets

Set up hosting targets for each version in your Firebase project:

```bash
# Create two hosting sites in Firebase Console first:
# 1. Your default site (already exists)
# 2. Add a new site for version 2

# Then apply the targets:
firebase target:apply hosting default secret-santa-e3f0f
firebase target:apply hosting version2 your-site-name-v2
```

### 4. Data Isolation

Each version uses a different Firestore collection:
- **Default version**: Uses `santas` collection
- **Version 2**: Uses `santas-v2` collection

This means both versions share the same Firebase project but have completely separate data.

## 🚀 Usage

### Development

```bash
# Run default version (1 giftee per santa)
yarn dev

# Run version 2 (2 giftees per santa)
yarn dev:v2
```

### Building

```bash
# Build default version
yarn build:default

# Build version 2
yarn build:v2
```

### Deployment

```bash
# Deploy default version
yarn deploy:default

# Deploy version 2
yarn deploy:v2
```

## 📁 Configuration Files

### `config.default.js`
- Contains settings for the default version
- 1 giftee per santa
- Uses `santas` Firestore collection
- Shared Firebase project configuration

### `config.version2.js`
- Contains settings for version 2
- 2 giftees per santa
- Uses `santas-v2` Firestore collection
- Same Firebase project as default

## 🔧 How It Works

1. **Environment Variables**: The `VERSION` environment variable determines which config file to load
2. **Quasar Config**: Reads the config file and injects values into the build
3. **Runtime Access**: Components access config via `process.env.APP_TITLE`, `process.env.GIFTEES_PER_SANTA`, `process.env.COLLECTION_NAME`
4. **Collection Isolation**: Different collection names keep data completely separate
5. **Firebase Hosting**: Multiple hosting targets allow deployment to different sites

## 🎁 Key Differences Between Versions

| Feature | Default Version | Version 2 |
|---------|----------------|-----------|
| Giftees per Santa | 1 | 2 |
| Firebase Project | secret-santa-e3f0f | secret-santa-e3f0f (same) |
| Firestore Collection | `santas` | `santas-v2` |
| Data Isolation | Independent | Independent |
| Title | Thomas Family Secret Santa | Your custom title |

## 📝 Notes

- Each version uses a **separate Firestore collection** in the same project
- Assignments are stored separately per version (different collections)
- Past assignments tracking is independent between versions
- You can customize family members differently per version (requires code changes)
- Both versions share the same Firebase project, making management simpler

## 🔐 Security

- Firebase client-side API keys are safe for public repositories (security is handled by Firestore Rules)
- Ensure proper Firestore security rules are set up to protect both collections
- Both versions use the same Firebase project and Firestore rules

## 🐛 Troubleshooting

**Problem**: Configuration not loading
- Solution: Check that `config.VERSION.js` exists and has valid JavaScript syntax

**Problem**: Firebase deployment fails
- Solution: Ensure Firebase hosting targets are properly configured with `firebase target:apply`

**Problem**: Wrong number of giftees assigned
- Solution: Verify `GIFTEES_PER_SANTA` in your config file

**Problem**: Data mixing between versions
- Solution: Verify that each config file has a different `collectionName`

**Problem**: Can't see data in Firebase Console
- Solution: Check the correct collection name in Firestore (e.g., `santas` or `santas-v2`)

## 📚 Additional Resources

- [Quasar Framework Docs](https://quasar.dev)
- [Firebase Hosting Docs](https://firebase.google.com/docs/hosting)
- [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/get-started)

