# Secret Santa Application

Multi-version Secret Santa gift exchange app built with Vue 3, Quasar, and Firebase. Run multiple independent Secret Santa exchanges with different configurations using a single Firebase project.

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Quick Start](#-quick-start)
- [Configuration System](#-configuration-system)
- [Development](#-development)
- [Testing Mode](#-testing-mode)
- [Admin Interface](#-admin-interface)
- [Deployment](#-deployment)
- [Firebase Setup](#-firebase-setup)
- [Project Structure](#-project-structure)
- [Security](#-security)
- [Troubleshooting](#-troubleshooting)

## ✨ Features

- **Smart Assignment Logic**: Prevents partner-to-partner matches and repeating past year assignments
- **Configurable Giftees**: 1 or 2 giftees per Santa
- **Multi-Version Support**: Run multiple Secret Santa exchanges with separate data collections
- **Admin Interface**: Manage family members, partners, and reset assignments via UI
- **Testing Mode**: Switch between configurations in development without rebuilding
- **Gift Ideas**: Members can add and view gift ideas
- **Responsive Design**: Works on all devices

## 🛠 Tech Stack

- **Frontend**: Vue 3 (Composition API + TypeScript), Quasar v2, Vue Router 4
- **Build**: Vite via Quasar CLI
- **Backend**: Firebase (Firestore + Hosting)

### Architecture

Each version uses a separate Firestore collection but shares the same Firebase project:

```
Firebase Project (secret-santa-e3f0f)
├── Collection: santas (Version 1, 1 giftee)
├── Collection: santas-v2 (Version 2, 2 giftees)
├── Hosting: default
└── Hosting: version2
```

**Key Points**:

- Configuration values injected at build time via environment variables
- Complete data isolation between versions
- Dev mode supports runtime switching between configs

## 🚀 Quick Start

```bash
yarn install                          # Install dependencies
yarn dev                              # Start dev server with testing mode
# Open http://localhost:9000/admin to set up family members
```

**Prerequisites**: Node.js v16/18/20, Yarn >= 1.21.1, Firebase account (free tier)

## 💻 Development

### Commands

```bash
# Development
yarn dev                  # Dev server with testing mode (both configs)
yarn dev:v2               # Same as dev

# Building
yarn build:default        # Build version 1
yarn build:v2             # Build version 2

# Code Quality
yarn lint                 # ESLint
yarn format               # Prettier

# Deployment
yarn deploy:default       # Build + deploy version 1
yarn deploy:v2            # Build + deploy version 2
```

### Workflow

1. Run `yarn dev`
2. Main app: `http://localhost:9000`, Admin: `http://localhost:9000/admin`
3. Edit components in `src/` (HMR enabled)
4. Switch configs in admin UI to test both versions
5. Run `yarn format && yarn lint` before committing

## ⚙️ Configuration System

Each version has its own: app title, giftees per Santa (1-2), Firestore collection, and hosting target.

### Config Files

**`config.default.js`**:

```javascript
module.exports = {
  appTitle: 'Thomas Family Secret Santa',
  gifteesPerSanta: 1,
  collectionName: 'santas',
  firebase: {
    /* credentials */
  },
};
```

**`config.version2.js`**:

```javascript
module.exports = {
  appTitle: 'Leinert Family Secret Santa',
  gifteesPerSanta: 2,
  collectionName: 'santas-v2', // Must be unique
  firebase: {
    /* same credentials */
  },
};
```

### How It Works

- **Build Time**: `VERSION` env var determines which config loads → values injected as `process.env.APP_TITLE`, etc.
- **Production**: Config baked into build, cannot change without rebuilding
- **Development**: Both configs loaded, switch via admin UI, selection persists in localStorage

### Add New Version

1. Copy config: `cp config.default.js config.version3.js`
2. Edit: change `appTitle`, `gifteesPerSanta`, `collectionName` (must be unique)
3. Add to `package.json` scripts:
   ```json
   "build:v3": "VERSION=version3 quasar build",
   "deploy:v3": "VERSION=version3 yarn build && firebase deploy --only hosting:version3"
   ```
4. Update `src/boot/register-configs.ts` for testing mode
5. Set Firebase target: `firebase target:apply hosting version3 your-site-name`

## 🧪 Testing Mode

Development feature that allows switching between configurations without restarting.

**Enable**: Run `yarn dev` (both configs auto-loaded)

**Usage**:

1. Start dev server: `yarn dev`
2. Go to `http://localhost:9000/admin`
3. Find blue "🧪 Testing Mode" card
4. Toggle between "Default" and "Version2"
5. Selection saves to localStorage

**What Changes**: App title, collection name, giftees per Santa, family members all update instantly.

**Important**: Keep `src/boot/register-configs.ts` in sync with config files. See `src/boot/README.md` for details.

## 🔧 Admin Interface

Access at `/admin` (hidden from main UI to prevent accidental access).

### Features

**Family Members**:

- Add: Fill name + optional partner → Click "Add Member"
- Edit: Click ✏️ → Update → Save
- Delete: Click 🗑️ → Confirm
- Partners prevent being matched together (mutual relationship)

**Reset All Assignments**:

- Clears Secret Santa assignments
- Preserves family members and gift ideas
- Use when starting new season or after roster changes

**Testing Mode** (dev only):

- Toggle between configs
- Immediate title/collection/giftees updates
- Separate family members per config

## 🚀 Deployment

### Setup

1. Create hosting sites (default auto-created, add others in Firebase Console)
2. Configure targets:
   ```bash
   firebase target:apply hosting default secret-santa-e3f0f
   firebase target:apply hosting version2 your-v2-site-name
   ```

### Deploy

```bash
yarn deploy:default    # Build + deploy version 1
yarn deploy:v2         # Build + deploy version 2
```

Manual: `yarn build:default` then `firebase deploy --only hosting:default`

**Checklist**: Test locally → Build → Deploy → Verify URL → Test production → Check Firestore collection

**Rollback**: `firebase hosting:clone your-site-id:previous-version-id your-site-id:live`

## 📁 Project Structure

```
src/
├── boot/                    # Bootstrap files
│   ├── firebase.ts          # Firebase init
│   ├── config.ts            # Config management
│   └── register-configs.ts  # Testing mode config registration
├── components/
│   ├── SecretSanta.vue      # Main component (assignment logic, gift ideas)
│   ├── ConfirmDialog.vue    # Confirmation dialog
│   └── models.ts            # TypeScript interfaces
├── pages/
│   ├── IndexPage.vue        # Home (uses SecretSanta)
│   ├── AdminPage.vue        # Admin interface (CRUD, reset, testing mode)
│   └── ErrorNotFound.vue    # 404
├── layouts/
│   └── MainLayout.vue       # Header + layout
├── router/                  # Vue Router setup
├── css/                     # Global styles
└── App.vue                  # Root component

config.default.js            # Version 1 config
config.version2.js           # Version 2 config
firebase.json                # Firebase project config
firestore.rules              # Security rules
quasar.config.js             # Quasar framework config
```

### Key Files

- **`SecretSanta.vue`**: Assignment logic, prevents partner matches, avoids repeating past years, handles multiple giftees
- **`AdminPage.vue`**: Family member CRUD, partner relationships, reset functionality, testing mode toggle
- **`boot/config.ts`**: Manages active config, reactive refs, localStorage persistence
- **`boot/register-configs.ts`**: Loads both configs for testing mode
- **`boot/firebase.ts`**: Firebase/Firestore initialization

## 🔥 Firebase Setup

### Initial Setup

1. [Firebase Console](https://console.firebase.google.com/) → Add project → Enable Firestore + Hosting
2. Project Settings → Add web app → Copy config object
3. Update `config.default.js` and `config.version2.js` with Firebase credentials:
   ```javascript
   firebase: {
     apiKey: 'your-api-key',
     authDomain: 'your-project.firebaseapp.com',
     projectId: 'your-project-id',
     // ... etc
   }
   ```

### Firestore Setup

1. Create database in test mode
2. Deploy rules: `firebase deploy --only firestore:rules`
3. Structure (auto-created):
   ```
   santas/2024/members/...
   santas-v2/2024/members/...
   ```

### Hosting Setup

```bash
npm install -g firebase-tools
firebase login
firebase init hosting  # If not done
```

For multiple versions:

1. Firebase Console → Hosting → Add another site
2. Configure targets:
   ```bash
   firebase target:apply hosting default your-default-site
   firebase target:apply hosting version2 your-v2-site
   ```

### Useful Commands

```bash
firebase hosting:sites:list        # View sites
firebase target:list                # View targets
firebase deploy --only firestore    # Deploy rules only
firebase hosting:releases:list      # View history
```

## 🔒 Security

**Current Security Measures**:

✅ **Firestore Security Rules**: Validates data structure and prevents unauthorized deletions
✅ **Environment Variables**: Firebase credentials stored in `.env` files (not committed)
✅ **Read Restrictions**: Rules prevent malicious data manipulation
✅ **Structure Validation**: All writes must maintain proper data format

**Security Model**:
- Reads are open (necessary for participants to see gift ideas)
- Writes are validated (can't delete members or corrupt data structure)
- Firebase API keys in environment variables
- No authentication required for participants (by design for ease of use)

**Important Notes**:
- Firebase web API keys are designed to be public and visible in browser requests
- Real security comes from Firestore rules, not hidden API keys
- Domain restrictions can be added for production use

**For Enhanced Security**:

See **[SECURITY-GUIDE.md](./SECURITY-GUIDE.md)** for detailed security options including:
- 🔐 Firebase App Check (recommended)
- 🌐 Domain restrictions
- 🔑 Admin secret keys
- ⚡ Cloud Functions for admin operations
- 👤 Firebase Authentication

**Git History Note**:

If you previously committed Firebase credentials and want to remove them from git history, see **[SECURITY-SCRUB-GUIDE.md](./SECURITY-SCRUB-GUIDE.md)**. 

However, for Firebase web apps, this is typically **not necessary** since:
- Firebase API keys are designed to be public
- Security is enforced by Firestore rules
- Keys are visible in browser network requests anyway

## 🐛 Troubleshooting

| Issue                          | Solution                                                                                                 |
| ------------------------------ | -------------------------------------------------------------------------------------------------------- |
| **Config not loading**         | Check config file exists, rebuild with explicit version, check console                                   |
| **Firebase connection issues** | Verify credentials, run `firebase projects:list`, check network tab                                      |
| **Testing mode not working**   | Ensure `yarn dev` (not prod), check both configs exist, verify `register-configs.ts`, clear localStorage |
| **Data not saving**            | Check Firestore rules, verify collection name in config, check console logs                              |
| **Wrong collection**           | Check active config in admin, verify collection name, clear localStorage                                 |
| **Deploy fails**               | Check `firebase login`, verify targets with `firebase target:list`, check build output                   |
| **Build errors**               | Clear `node_modules` and reinstall, check Node version (16/18/20), run lint/format                       |

**Debug Mode**: Add console.logs in `src/boot/firebase.ts` and `src/boot/config.ts`

**More Help**: See `QUICK-START.md`, `SETUP-GUIDE.md`, `ADMIN-GUIDE.md`, `TESTING-GUIDE.md`

## 📚 Additional Documentation

- **[QUICK-START.md](QUICK-START.md)** - Quick reference and commands
- **[SETUP-GUIDE.md](SETUP-GUIDE.md)** - Initial setup instructions
- **[ADMIN-GUIDE.md](ADMIN-GUIDE.md)** - Admin interface documentation
- **[TESTING-GUIDE.md](TESTING-GUIDE.md)** - Testing mode guide

**External**: [Quasar](https://quasar.dev/) • [Vue 3](https://vuejs.org/) • [Firebase](https://firebase.google.com/docs) • [TypeScript](https://www.typescriptlang.org/)

---

**Author**: Jeffrey Thomas (jeffreykthomas@gmail.com) • **License**: Private/Family Use
