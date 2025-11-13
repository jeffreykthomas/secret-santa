# Deployment Setup Summary

## ✅ What Was Completed

Your Secret Santa project is now fully configured for production deployment with **two separate Firebase hosting sites**!

### 1. Firebase Hosting Sites Created

| Site       | Family         | URL                                  | Target     |
| ---------- | -------------- | ------------------------------------ | ---------- |
| **Site 1** | Thomas Family  | https://secret-santa-e3f0f.web.app   | `default`  |
| **Site 2** | Leinert Family | https://secret-santa-leinert.web.app | `version2` |

### 2. Configuration Files

- `.firebaserc` - Updated with hosting target mappings
- `firebase.json` - Already configured with both hosting targets
- `package.json` - Deploy scripts already in place

### 3. Browser Title Fix

**Problem**: The browser tab title was showing "Secret Santa" from `package.json` instead of the configuration-specific title.

**Solution**: The document title is now **dynamically set via JavaScript** in `MainLayout.vue`:

- When the app loads, it reads `activeConfig.appTitle`
- Thomas Family site → "Thomas Family Secret Santa"
- Leinert Family site → "Leinert Family Secret Santa"
- The title updates automatically if the config changes (dev mode only)

### 4. Production Features

✨ **Config Toggle Auto-Hides**: The config switcher in the Admin page is automatically hidden in production because only one config is compiled per build.

✨ **Dynamic Title**: Browser tab title changes based on which configuration is deployed.

✨ **Separate Data**: Each site uses its own Firestore collection - no data mixing!

## 🚀 Ready to Deploy!

### Deploy Both Sites

```bash
# Deploy Thomas Family
yarn deploy:default

# Deploy Leinert Family
yarn deploy:v2

# Or deploy both at once
yarn deploy:default && yarn deploy:v2
```

### Verify Deployment

After deploying, visit each site and verify:

**Thomas Family (https://secret-santa-e3f0f.web.app)**

- ✅ Browser tab shows "Thomas Family Secret Santa"
- ✅ Header shows "🎅 Thomas Family Secret Santa"
- ✅ Config switcher is NOT visible in admin
- ✅ Uses `santas` Firestore collection

**Leinert Family (https://secret-santa-leinert.web.app)**

- ✅ Browser tab shows "Leinert Family Secret Santa"
- ✅ Header shows "🎅 Leinert Family Secret Santa"
- ✅ Config switcher is NOT visible in admin
- ✅ Uses `leinert-santas` Firestore collection

## 📝 Technical Details

### How the Dynamic Title Works

The title is set in `src/layouts/MainLayout.vue`:

```typescript
import { watchEffect } from 'vue';
import { activeConfig } from 'src/boot/config';

watchEffect(() => {
  document.title = activeConfig.value.appTitle;
});
```

This approach:

- ✅ Works reliably across all build configurations
- ✅ Doesn't require build-time template processing
- ✅ Updates automatically if config changes (dev mode)
- ✅ Simple and maintainable

### Build Process

When you run `yarn build:default`:

1. Quasar reads `config.default.js`
2. Only ONE configuration is compiled into the bundle
3. `isTestingMode()` returns `false` (hides config switcher)
4. App loads with Thomas Family config
5. `MainLayout` sets `document.title` to "Thomas Family Secret Santa"

Same process for `yarn build:v2` but with Leinert Family config.

## 📚 Documentation

All documentation has been updated:

- **DEPLOYMENT-GUIDE.md** - Comprehensive deployment guide
- **DEPLOY-QUICK-START.md** - Quick reference for deploying
- **README.md** - Project overview (if applicable)

## 🎯 Next Steps

1. **Test Locally First**:

   ```bash
   yarn dev
   ```

   Verify both configs work with the switcher.

2. **Build Both Configurations**:

   ```bash
   yarn build:default
   yarn build:v2
   ```

3. **Deploy to Firebase**:

   ```bash
   yarn deploy:default
   yarn deploy:v2
   ```

4. **Share URLs with Families**:
   - Thomas Family → https://secret-santa-e3f0f.web.app
   - Leinert Family → https://secret-santa-leinert.web.app

## 🐛 Troubleshooting

### Wrong Title Showing

- Clear browser cache and hard refresh (Cmd+Shift+R / Ctrl+Shift+F5)
- Verify you deployed the correct build to the correct site
- Check browser console for any JavaScript errors

### Config Switcher Still Visible

- This should NOT happen in production
- Verify you ran `yarn build:default` or `yarn build:v2` (not `yarn dev`)
- Check that only one config is in the compiled bundle

### Wrong Data Showing

- Verify Firestore security rules are correct
- Check that each config is using the right `collectionName`
- Make sure you're logged into the correct Firebase project

## 🎄 Success!

Your Secret Santa application is now production-ready with:

- ✅ Two independent hosting sites
- ✅ Dynamic browser titles per configuration
- ✅ Auto-hidden config toggle in production
- ✅ Separate data collections per family
- ✅ Simple deployment workflow

**You're ready to deploy and share with your families!**

---

For detailed deployment instructions, see [DEPLOYMENT-GUIDE.md](./DEPLOYMENT-GUIDE.md)

For quick reference, see [DEPLOY-QUICK-START.md](./DEPLOY-QUICK-START.md)
