# Secret Santa Application

A modern, configurable Secret Santa gift exchange application built with Vue 3, Quasar Framework, and Firebase. This application supports multiple independent versions, allowing you to run separate Secret Santa exchanges with different configurations using a single Firebase project.

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture Overview](#-architecture-overview)
- [Quick Start](#-quick-start)
- [Installation](#-installation)
- [Development](#-development)
- [Configuration System](#-configuration-system)
- [Admin Interface](#-admin-interface)
- [Testing Mode](#-testing-mode)
- [Deployment](#-deployment)
- [Project Structure](#-project-structure)
- [Key Components](#-key-components)
- [Firebase Setup](#-firebase-setup)
- [Security](#-security)
- [Troubleshooting](#-troubleshooting)
- [Contributing](#-contributing)
- [Additional Documentation](#-additional-documentation)

## ✨ Features

### Core Functionality

- **Secret Santa Assignment**: Automatically assign Secret Santa relationships with smart logic to prevent partners being matched together
- **Multiple Giftees**: Configure 1 or 2 giftees per Santa
- **Gift Ideas Management**: Family members can add and view gift ideas
- **Past Assignments Tracking**: Avoids repeating the same assignments from previous years
- **Randomized Assignments**: Fair and random distribution of Secret Santa assignments

### Multi-Version Support

- **Multiple Configurations**: Run different Secret Santa exchanges with independent settings
- **Separate Data Collections**: Each version stores data in its own Firestore collection
- **Shared Firebase Project**: All versions use the same Firebase project for simplified management
- **Version-Specific Titles**: Customize the app title for each version

### Admin Features

- **Family Member Management**: Add, edit, and delete family members via UI
- **Partner Relationships**: Define couples to prevent partner-to-partner assignments
- **Reset Functionality**: Clear all assignments to start fresh
- **Testing Mode**: Switch between configurations in development without restarting

### User Experience

- **Mobile-First Design**: Responsive layout works on all devices
- **Modern UI**: Clean, festive design with Quasar Material Design components
- **Real-Time Updates**: Changes sync with Firestore in real-time
- **Persistent State**: Remembers your selections across sessions

## 🛠 Tech Stack

- **Frontend Framework**: [Vue 3](https://vuejs.org/) (Composition API with TypeScript)
- **UI Framework**: [Quasar v2](https://quasar.dev/) (Material Design components)
- **Build Tool**: [Vite](https://vitejs.dev/) (via Quasar CLI)
- **Backend**: [Firebase](https://firebase.google.com/)
  - Firestore (NoSQL database)
  - Hosting (static site hosting)
- **Language**: TypeScript
- **State Management**: Vue 3 Composition API with reactive refs
- **Routing**: Vue Router 4

## 🏗 Architecture Overview

### Multi-Configuration Architecture

The application uses a unique multi-configuration system that allows multiple independent Secret Santa exchanges:

```
┌─────────────────────────────────────────────┐
│         Firebase Project                    │
│         (secret-santa-e3f0f)               │
│                                             │
│  ┌──────────────┐      ┌──────────────┐   │
│  │ Collection:  │      │ Collection:  │   │
│  │ santas       │      │ santas-v2    │   │
│  │              │      │              │   │
│  │ (Version 1)  │      │ (Version 2)  │   │
│  │ 1 giftee     │      │ 2 giftees    │   │
│  └──────────────┘      └──────────────┘   │
│                                             │
│  ┌──────────────┐      ┌──────────────┐   │
│  │ Hosting:     │      │ Hosting:     │   │
│  │ default      │      │ version2     │   │
│  └──────────────┘      └──────────────┘   │
└─────────────────────────────────────────────┘
```

### Data Flow

```
User Action → Vue Component → Firestore API → Firebase Firestore
                   ↓                              ↓
            Local State Update              Data Persistence
                   ↓                              ↓
              UI Update  ←──────────────── Real-time Sync
```

### Key Design Decisions

1. **Separate Collections**: Each version uses a different Firestore collection for complete data isolation
2. **Shared Configuration**: Firebase credentials are shared but collection names differ
3. **Build-Time Injection**: Configuration values are injected at build time via environment variables
4. **Runtime Switching** (Dev Only): Testing mode allows switching configurations without rebuilding

## 🚀 Quick Start

```bash
# Install dependencies
yarn install

# Run development server (with testing mode)
yarn dev

# Open browser to http://localhost:9000
# Navigate to /admin to set up family members
```

## 📦 Installation

### Prerequisites

- **Node.js**: v16, v18, or v20
- **Yarn**: >= 1.21.1 (or npm >= 6.13.4)
- **Firebase Account**: Free tier is sufficient

### Steps

1. **Clone the repository**:

   ```bash
   git clone <repository-url>
   cd secret-santa
   ```

2. **Install dependencies**:

   ```bash
   yarn install
   ```

3. **Configure Firebase** (see [Firebase Setup](#firebase-setup) for details):

   - Create a Firebase project
   - Update `config.default.js` with your Firebase credentials

4. **Set up Firestore**:

   ```bash
   # Deploy Firestore rules
   firebase deploy --only firestore:rules
   ```

5. **Run the development server**:

   ```bash
   yarn dev
   ```

6. **Set up family members**:
   - Navigate to `http://localhost:9000/admin`
   - Add family members and configure partners

## 💻 Development

### Available Commands

```bash
# Development
yarn dev              # Run default version with testing mode (both configs loaded)
yarn dev:v2           # Same as dev - testing mode enabled

# Building
yarn build            # Build with default configuration
yarn build:default    # Explicitly build default version
yarn build:v2         # Build version 2

# Code Quality
yarn lint             # Run ESLint
yarn format           # Format code with Prettier

# Deployment
yarn deploy:default   # Build and deploy default version
yarn deploy:v2        # Build and deploy version 2
```

### Development Workflow

1. **Start the dev server**:

   ```bash
   yarn dev
   ```

2. **Access the application**:

   - Main page: `http://localhost:9000`
   - Admin page: `http://localhost:9000/admin`

3. **Make changes**:

   - Edit Vue components in `src/`
   - Vite provides hot module replacement (HMR)
   - Changes appear instantly in the browser

4. **Test both versions** (see [Testing Mode](#testing-mode)):

   - Go to `/admin`
   - Use the testing mode toggle to switch configurations
   - Verify both versions work correctly

5. **Format and lint**:
   ```bash
   yarn format && yarn lint
   ```

### Development Tips

- **Hot Reload**: Changes to `.vue`, `.ts`, and `.scss` files trigger automatic reload
- **TypeScript**: Full TypeScript support with type checking
- **Vue Devtools**: Install the Vue Devtools browser extension for debugging
- **Firebase Emulator** (Optional): Use Firebase emulators for local testing

## ⚙️ Configuration System

### Overview

The application supports multiple independent configurations, each with its own:

- App title
- Number of giftees per Santa (1 or 2)
- Firestore collection name
- Firebase hosting target

### Configuration Files

#### `config.default.js` - Version 1

```javascript
module.exports = {
  appTitle: 'Thomas Family Secret Santa',
  gifteesPerSanta: 1,
  collectionName: 'santas',
  firebase: {
    /* Firebase credentials */
  },
};
```

#### `config.version2.js` - Version 2

```javascript
module.exports = {
  appTitle: 'Leinert Family Secret Santa',
  gifteesPerSanta: 2,
  collectionName: 'santas-v2',
  firebase: {
    /* Same Firebase credentials */
  },
};
```

### How Configuration Works

1. **Build Time**:

   - `VERSION` environment variable determines which config to use
   - Quasar config loads the appropriate file
   - Values are injected as `process.env.APP_TITLE`, etc.

2. **Runtime** (Production):

   - Configuration is baked into the build
   - Cannot be changed without rebuilding

3. **Runtime** (Development/Testing Mode):
   - Both configurations are loaded
   - Can switch between them via admin UI
   - Selection persists in localStorage

### Creating a New Version

1. **Create configuration file**:

   ```bash
   cp config.default.js config.version3.js
   ```

2. **Edit the new config**:

   ```javascript
   module.exports = {
     appTitle: 'My Custom Secret Santa',
     gifteesPerSanta: 2,
     collectionName: 'santas-v3', // Must be unique!
     firebase: {
       /* Same as other versions */
     },
   };
   ```

3. **Add build/deploy scripts** in `package.json`:

   ```json
   {
     "scripts": {
       "build:v3": "VERSION=version3 quasar build",
       "deploy:v3": "VERSION=version3 yarn build && firebase deploy --only hosting:version3"
     }
   }
   ```

4. **For testing mode**, update `src/boot/register-configs.ts`:

   ```typescript
   registerConfig('version3', {
     appTitle: 'My Custom Secret Santa',
     gifteesPerSanta: 2,
     collectionName: 'santas-v3',
   });
   ```

5. **Configure Firebase hosting**:
   ```bash
   firebase target:apply hosting version3 your-site-name
   ```

## 🔧 Admin Interface

The admin interface provides full control over family members and assignments.

### Accessing Admin

Navigate to `/admin` in your browser:

- Development: `http://localhost:9000/admin`
- Production: `https://your-domain.com/admin`

**Note**: The admin link is intentionally hidden from the main UI to prevent accidental access.

### Features

#### 1. Family Member Management

**Add a Member**:

- Fill in the "Name" field
- Optionally select a "Partner" from existing members
- Click "Add Member"
- Member is immediately saved to Firestore

**Edit a Member**:

- Click the ✏️ Edit button
- Update name or partner relationship
- Click "Save"

**Delete a Member**:

- Click the 🗑️ Delete button
- Confirm deletion
- Member is removed from database

**Partner Relationships**:

- Partners prevent being matched together as Secret Santa
- Relationships are mutual (A's partner is B, B's partner is A)
- Partners can still receive gifts from each other

#### 2. Reset Functionality

**Reset All Assignments**:

- Clears all Secret Santa assignments
- Preserves family members
- Preserves gift ideas
- Useful for starting a new year or fixing mistakes

**When to Reset**:

- Starting a new Secret Santa season
- Need to reassign everyone
- Changed partner relationships
- Added/removed family members

#### 3. Testing Mode (Development Only)

**Switch Configurations**:

- Toggle between Default and Version2
- See immediate changes to title, collection, and giftees
- Selection persists across page refreshes
- Each configuration has separate family members

### Admin Best Practices

1. **Initial Setup**:

   - Add all family members first
   - Set partner relationships
   - Then go to main page for assignments

2. **During the Season**:

   - Users add their own gift ideas on main page
   - Use admin only for adding/removing people

3. **Starting Fresh**:
   - Reset all assignments
   - Family members and gift ideas remain
   - Users can pick names again

## 🧪 Testing Mode

Testing mode is a powerful development feature that allows switching between configurations without restarting the server.

### Enabling Testing Mode

Testing mode is **automatically enabled** when running:

```bash
yarn dev
```

Both `config.default.js` and `config.version2.js` are loaded at startup.

### How to Use

1. **Start development server**:

   ```bash
   yarn dev
   ```

2. **Navigate to admin page**:

   ```
   http://localhost:9000/admin
   ```

3. **Look for the blue "🧪 Testing Mode" card** at the top

4. **Toggle between configurations**:

   - Click "Default" or "Version2" buttons
   - Watch the title update immediately
   - Collection name changes
   - Giftees per Santa updates

5. **Your selection is saved** in localStorage and persists

### What Changes When Switching

When you switch configurations:

- ✅ App title updates in header
- ✅ Collection name changes (shown in banner)
- ✅ Giftees per Santa setting updates
- ✅ Family members reload from new collection
- ✅ Choice persists across refreshes

### Testing Workflow

```bash
# Example: Testing both versions

# 1. Start dev server
yarn dev

# 2. Set up Version 1
#    - Go to /admin
#    - Select "Default" config
#    - Add family members
#    - Test assignments

# 3. Set up Version 2
#    - Go to /admin
#    - Select "Version2" config
#    - Add different family members
#    - Test assignments with 2 giftees

# 4. Switch back and forth
#    - Toggle configurations
#    - Verify data isolation
#    - Confirm both work correctly
```

### Important Note

**Keep Configs in Sync**: The configurations in `src/boot/register-configs.ts` must match your config files. When you update `config.default.js` or `config.version2.js`, also update `register-configs.ts` for testing mode to work properly.

See `src/boot/README.md` for technical details.

## 🚀 Deployment

### Prerequisites

1. **Create Firebase hosting sites**:

   - Default site is created automatically
   - For additional versions, add sites in Firebase Console

2. **Configure hosting targets**:
   ```bash
   firebase target:apply hosting default secret-santa-e3f0f
   firebase target:apply hosting version2 your-v2-site-name
   ```

### Deploy a Version

#### Default Version

```bash
yarn deploy:default
```

This will:

1. Build the app with default configuration
2. Deploy to the default hosting site

#### Version 2

```bash
yarn deploy:v2
```

This will:

1. Build the app with version2 configuration
2. Deploy to the version2 hosting site

### Manual Deployment

```bash
# Build
yarn build:default

# Deploy
firebase deploy --only hosting:default

# Or deploy specific target
firebase deploy --only hosting:version2
```

### Deployment Checklist

- [ ] Test locally with `yarn dev`
- [ ] Verify both configurations work in testing mode
- [ ] Build the version: `yarn build:default` or `yarn build:v2`
- [ ] Test the production build locally
- [ ] Deploy: `yarn deploy:default` or `yarn deploy:v2`
- [ ] Verify deployment at hosting URL
- [ ] Test functionality in production
- [ ] Check Firestore data is writing to correct collection

### Rollback

If you need to rollback a deployment:

```bash
firebase hosting:clone your-site-id:previous-version-id your-site-id:live
```

## 📁 Project Structure

```
secret-santa/
├── src/
│   ├── boot/                  # Boot files (run before app starts)
│   │   ├── firebase.ts        # Firebase initialization
│   │   ├── config.ts          # Configuration management
│   │   └── register-configs.ts # Testing mode config registration
│   ├── components/
│   │   ├── SecretSanta.vue    # Main Secret Santa component
│   │   ├── ConfirmDialog.vue  # Confirmation dialog
│   │   └── models.ts          # TypeScript interfaces
│   ├── layouts/
│   │   └── MainLayout.vue     # Main app layout with header
│   ├── pages/
│   │   ├── IndexPage.vue      # Home page (uses SecretSanta component)
│   │   ├── AdminPage.vue      # Admin interface
│   │   └── ErrorNotFound.vue  # 404 page
│   ├── router/
│   │   ├── index.ts           # Router setup
│   │   └── routes.ts          # Route definitions
│   ├── css/
│   │   ├── app.scss           # Global styles
│   │   └── quasar.variables.scss # Quasar theme variables
│   ├── assets/                # Static assets (images, etc.)
│   └── App.vue                # Root component
├── public/                    # Static files (copied to dist/)
│   ├── favicon.ico
│   └── icons/
├── config.default.js          # Default version configuration
├── config.version2.js         # Version 2 configuration
├── quasar.config.js           # Quasar framework configuration
├── firebase.json              # Firebase project configuration
├── firestore.rules            # Firestore security rules
├── firestore.indexes.json     # Firestore indexes
├── package.json               # Dependencies and scripts
├── tsconfig.json              # TypeScript configuration
└── README.md                  # This file
```

## 🔑 Key Components

### `SecretSanta.vue`

The main component that handles:

- Family member selection
- Secret Santa assignment logic
- Gift ideas display and management
- Firestore data synchronization

**Key Features**:

- Prevents partner-to-partner assignments
- Avoids repeating past year assignments
- Handles multiple giftees per Santa
- Real-time gift idea updates

### `AdminPage.vue`

Administrative interface for:

- Adding/editing/deleting family members
- Setting partner relationships
- Resetting assignments
- Switching configurations (testing mode)

**Key Features**:

- Full CRUD operations for family members
- Visual display of assignments
- Testing mode toggle
- Collection name display

### `MainLayout.vue`

App layout wrapper that provides:

- Header with app title
- Navigation structure
- Responsive layout
- Settings icon (links to admin)

### Configuration System (`src/boot/`)

**`config.ts`**:

- Manages active configuration
- Provides reactive refs for config values
- Handles configuration switching
- Saves selection to localStorage

**`register-configs.ts`**:

- Registers configurations for testing mode
- Loads both default and version2 configs
- Makes them available at runtime

**`firebase.ts`**:

- Initializes Firebase
- Sets up Firestore connection
- Exports Firestore instance

## 🔥 Firebase Setup

### 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Follow the setup wizard
4. Enable Firestore Database
5. Enable Hosting

### 2. Get Firebase Configuration

1. In Firebase Console, go to Project Settings
2. Scroll to "Your apps"
3. Click "Web" icon to add a web app
4. Copy the Firebase configuration object

### 3. Update Configuration Files

Update `config.default.js` with your Firebase credentials:

```javascript
module.exports = {
  appTitle: 'Your Secret Santa',
  gifteesPerSanta: 1,
  collectionName: 'santas',
  firebase: {
    apiKey: 'your-api-key',
    authDomain: 'your-project.firebaseapp.com',
    projectId: 'your-project-id',
    storageBucket: 'your-project.appspot.com',
    messagingSenderId: 'your-sender-id',
    appId: 'your-app-id',
    measurementId: 'your-measurement-id',
  },
};
```

Copy the same Firebase config to `config.version2.js` (only change `appTitle`, `gifteesPerSanta`, and `collectionName`).

### 4. Set Up Firestore

1. **Create database**:

   - In Firebase Console, go to Firestore Database
   - Click "Create database"
   - Start in test mode (we'll update rules next)

2. **Deploy security rules**:

   ```bash
   firebase deploy --only firestore:rules
   ```

3. **Structure** (created automatically):

   ```
   santas/
   └── 2024/
       └── members/
           ├── [member-id-1]
           ├── [member-id-2]
           └── ...

   santas-v2/
   └── 2024/
       └── members/
           ├── [member-id-1]
           └── ...
   ```

### 5. Set Up Firebase Hosting

1. **Install Firebase CLI**:

   ```bash
   npm install -g firebase-tools
   ```

2. **Login**:

   ```bash
   firebase login
   ```

3. **Initialize** (if not done):

   ```bash
   firebase init hosting
   ```

4. **Create additional hosting sites** (for version 2):

   - Go to Firebase Console → Hosting
   - Click "Add another site"
   - Give it a name (e.g., `your-project-v2`)

5. **Configure hosting targets**:
   ```bash
   firebase target:apply hosting default your-default-site
   firebase target:apply hosting version2 your-v2-site
   ```

### 6. Deploy

```bash
# Deploy default version
yarn deploy:default

# Deploy version 2
yarn deploy:v2
```

### Firebase CLI Commands

```bash
# View hosting sites
firebase hosting:sites:list

# View active targets
firebase target:list

# Deploy only Firestore rules
firebase deploy --only firestore:rules

# Deploy only hosting
firebase deploy --only hosting

# View deployment history
firebase hosting:releases:list
```

## 🔒 Security

### Current Security Model

**⚠️ Important**: The current Firestore rules allow read/write access to all documents. This is suitable for trusted family use but should be enhanced for broader deployments.

Current rules (`firestore.rules`):

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

### Recommended Security Enhancements

For production use, consider implementing:

1. **Authentication**:

   ```javascript
   // Require authentication
   match /{document=**} {
     allow read, write: if request.auth != null;
   }
   ```

2. **Collection-Specific Rules**:

   ```javascript
   // Only allow reading own assignment
   match /santas/{year}/members/{memberId} {
     allow read: if request.auth.uid == memberId;
     allow write: if request.auth != null;
   }
   ```

3. **Admin-Only Operations**:
   ```javascript
   // Require admin claim for member management
   match /santas/{year}/members/{memberId} {
     allow create, delete: if request.auth.token.admin == true;
   }
   ```

### Firebase API Keys

**Note**: Firebase client-side API keys can be safely committed to version control. They are not secret and security is enforced by Firestore Security Rules, not API keys.

However, ensure:

- Firestore rules are properly configured
- Hosting security is set appropriately
- Consider authentication for sensitive deployments

### Admin Access

Currently, the admin interface is "security by obscurity" (not linked in UI). For enhanced security:

1. Add authentication
2. Implement admin user roles
3. Use Firebase Auth and custom claims
4. Restrict admin routes in code
5. Update Firestore rules accordingly

## 🐛 Troubleshooting

### Common Issues

#### 1. Configuration Not Loading

**Symptoms**: Wrong title, wrong collection name, or default values showing

**Solutions**:

```bash
# Check that config file exists
ls config.default.js config.version2.js

# Rebuild with explicit version
yarn build:default

# In development, check browser console for errors
```

#### 2. Firebase Connection Issues

**Symptoms**: Data not loading, console errors about Firebase

**Solutions**:

```bash
# Verify Firebase credentials in config files
# Check that Firebase project is accessible
firebase projects:list

# Ensure Firestore is enabled in Firebase Console
# Check browser network tab for failed requests
```

#### 3. Testing Mode Not Working

**Symptoms**: Can't switch configurations, testing mode card not showing

**Solutions**:

- Ensure running `yarn dev` (not production build)
- Check that both config files exist
- Verify `register-configs.ts` has both configurations
- Check browser console for errors
- Clear localStorage: `localStorage.clear()`

#### 4. Data Not Saving to Firestore

**Symptoms**: Changes don't persist, data disappears on refresh

**Solutions**:

```bash
# Check Firestore rules allow writes
firebase deploy --only firestore:rules

# Verify network tab shows successful requests
# Check correct collection name in config
# Ensure Firebase is initialized (check console logs)
```

#### 5. Wrong Collection Being Used

**Symptoms**: Data from wrong version appears, mixed data

**Solutions**:

- Check active configuration in admin page
- Verify collection name in config file
- Clear localStorage and select correct version
- Check Firebase Console to see which collection has data

#### 6. Deployment Fails

**Symptoms**: `firebase deploy` errors

**Solutions**:

```bash
# Check Firebase CLI is installed and logged in
firebase login
firebase projects:list

# Verify hosting targets are set
firebase target:list

# Check that build completed successfully
ls dist/spa/

# Try deploying without target
firebase deploy --only hosting
```

#### 7. Build Errors

**Symptoms**: `yarn build` fails with TypeScript or Vite errors

**Solutions**:

```bash
# Clear node_modules and reinstall
rm -rf node_modules yarn.lock
yarn install

# Check Node version
node --version  # Should be 16, 18, or 20

# Try running linter first
yarn lint
yarn format
```

### Getting Help

1. **Check browser console** for error messages
2. **Check terminal** for build/deploy errors
3. **Review Firebase Console** for Firestore errors
4. **Check documentation files**:
   - `QUICK-START.md` - Quick reference
   - `SETUP-GUIDE.md` - Initial setup
   - `ADMIN-GUIDE.md` - Admin interface
   - `TESTING-GUIDE.md` - Testing mode details

### Debug Mode

Enable verbose logging:

```javascript
// In src/boot/firebase.ts
console.log('Firebase initialized:', app);
console.log('Firestore instance:', db);

// In src/boot/config.ts
console.log('Active config:', activeConfig.value);
console.log('Available configs:', configurations);
```

## 🤝 Contributing

### Development Setup

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Make changes and test thoroughly
4. Format and lint: `yarn format && yarn lint`
5. Commit changes: `git commit -m "Add my feature"`
6. Push to branch: `git push origin feature/my-feature`
7. Open a Pull Request

### Code Style

- **TypeScript**: Use strict typing
- **Vue 3**: Composition API with `<script setup>`
- **Formatting**: Run `yarn format` before committing
- **Linting**: Ensure `yarn lint` passes
- **Comments**: Add comments for complex logic

### Testing

Before submitting:

- [ ] Test in development mode with both configurations
- [ ] Test production build locally
- [ ] Verify admin interface works
- [ ] Test on mobile device/viewport
- [ ] Check browser console for errors
- [ ] Verify Firestore data is correct

## 📚 Additional Documentation

This repository includes several focused documentation files:

- **[QUICK-START.md](QUICK-START.md)** - Quick reference for common tasks and commands
- **[SETUP-GUIDE.md](SETUP-GUIDE.md)** - Detailed initial setup instructions
- **[ADMIN-GUIDE.md](ADMIN-GUIDE.md)** - Complete admin interface documentation
- **[TESTING-GUIDE.md](TESTING-GUIDE.md)** - In-depth testing mode guide

### External Resources

- [Quasar Framework Documentation](https://quasar.dev/)
- [Vue 3 Documentation](https://vuejs.org/)
- [Firebase Documentation](https://firebase.google.com/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/)
- [Vite Documentation](https://vitejs.dev/)

## 📄 License

This project is private and intended for family use.

## 👤 Author

**Jeffrey Thomas**

- Email: jeffreykthomas@gmail.com

---

## 🎄 Happy Secret Santa! 🎅

Need help? Check the documentation files or open an issue in the repository.
