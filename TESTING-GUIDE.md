# Testing Mode Guide

## 🧪 What is Testing Mode?

Testing mode allows you to switch between different configurations (Default vs Version2) **without restarting the development server**. This makes it incredibly easy to:

- Test both versions side-by-side
- Verify different configurations work correctly
- Manage family members for both versions
- See how different settings affect the UI

## 🚀 How to Enable Testing Mode

Testing mode is **automatically enabled** when you run:

```bash
yarn dev
```

Both `config.default.js` and `config.version2.js` are loaded at startup, giving you access to both configurations.

## 🔄 Switching Configurations

### Via Admin Interface

1. Navigate to `/admin` or click the ⚙️ settings icon
2. Look for the blue **"🧪 Testing Mode"** card at the top
3. Use the toggle buttons to switch between:
   - **Default**: Thomas Family Secret Santa (1 giftee per santa)
   - **Version2**: Leinert Family Secret Santa (2 giftees per santa)

### What Happens When You Switch?

When you toggle between configurations:

- ✅ **Title** in header updates immediately
- ✅ **Collection name** changes (shows in admin banner)
- ✅ **Giftees per santa** setting updates
- ✅ **Family members** reload from the new collection
- ✅ **Your choice is saved** to localStorage
- ✅ **Persists across page refreshes**

## 📊 Current Configuration Display

The testing mode card shows:

- Current configuration name (Default/Version2)
- App title
- Number of giftees per santa
- Firestore collection being used

Example:

```
🧪 Testing Mode
Switch between configurations
[Default] [Version2]

Thomas Family Secret Santa • 1 giftee(s) per santa • Collection: santas
```

## 🎯 Testing Workflow

### Initial Setup

1. Start dev server: `yarn dev`
2. Go to admin page (`/admin`)
3. Select **Default** configuration
4. Add your family members for the default version
5. Switch to **Version2** configuration
6. Add family members for the Leinert family
7. Test both versions!

### Testing Assignments

1. Switch to **Default** configuration
2. Go to home page (`/`)
3. Pick a name and see assignment (1 giftee)
4. Go back to admin
5. Switch to **Version2** configuration
6. Go to home page
7. Pick a name and see assignment (2 giftees!)

### Testing Data Isolation

1. Add a family member in **Default** config
2. Switch to **Version2** config
3. Verify that family member doesn't appear (separate collections!)
4. Each configuration has its own independent data

## 🏗️ Production Builds

**Important**: Testing mode is designed for development only.

For production builds:

```bash
# Build ONLY the default configuration
yarn build:default

# Build ONLY the version2 configuration
yarn build:v2
```

Production builds include only the specified configuration, reducing bundle size.

## 🔧 How It Works Technically

1. **Boot File**: `src/boot/register-configs.ts` registers both configurations
2. **Config Manager**: `src/boot/config.ts` manages the active configuration
3. **LocalStorage**: Saves your selection as `secretSantaConfigVersion`
4. **Reactive**: All components use `activeConfig` which updates in real-time
5. **Collection Switching**: Firestore queries automatically use the active collection name

### ⚠️ Important: Keeping Configs in Sync

The configurations in `src/boot/register-configs.ts` are **manually defined** because:

- Root config files use CommonJS (`module.exports`)
- Browser code can't import CommonJS modules
- We manually duplicate the settings for testing mode

**When you update `config.default.js` or `config.version2.js`, you MUST also update `src/boot/register-configs.ts`** to keep testing mode in sync!

See `src/boot/README.md` for more details.

## 📝 Configuration Files

### Default Configuration (`config.default.js`)

```javascript
{
  appTitle: 'Thomas Family Secret Santa',
  gifteesPerSanta: 1,
  collectionName: 'santas',
  // ... firebase config
}
```

### Version 2 Configuration (`config.version2.js`)

```javascript
{
  appTitle: 'Leinert Family Secret Santa',
  gifteesPerSanta: 2,
  collectionName: 'leinert-santas',
  // ... same firebase config
}
```

## 🐛 Troubleshooting

### Testing mode card doesn't appear

**Problem**: The blue testing mode card is not visible in admin
**Solution**:

- Make sure you're running `yarn dev` (not a production build)
- Check that both `config.default.js` and `config.version2.js` exist
- Check browser console for errors loading config files

### Changes don't take effect

**Problem**: Switching configurations doesn't update the data
**Solution**:

- Refresh the page after switching
- Check browser console for errors
- Verify you're looking at the correct collection in Firebase Console

### Wrong collection is being used

**Problem**: Data from wrong version appears
**Solution**:

- Check the testing mode card to see active configuration
- Clear localStorage: `localStorage.removeItem('secretSantaConfigVersion')`
- Refresh page and select correct configuration

### Can't see my changes

**Problem**: Added family members in one config don't appear
**Solution**:

- This is expected! Each configuration uses a separate collection
- Make sure you're viewing the correct configuration
- Check Firebase Console to verify data is in the right collection

## 💡 Best Practices

### During Development

- ✅ Use testing mode to quickly test both versions
- ✅ Keep both configurations up to date
- ✅ Test switching between configs regularly
- ✅ Verify data isolation works correctly

### Before Deployment

- ✅ Test each configuration independently
- ✅ Build and deploy each version separately
- ✅ Verify production builds work without testing mode
- ✅ Check Firebase security rules apply to both collections

## 🎁 Benefits

1. **Faster Testing**: No need to restart dev server
2. **Easy Comparison**: Switch between versions instantly
3. **Data Safety**: Each version has isolated data
4. **Developer Experience**: Smooth workflow for testing
5. **Confidence**: Test thoroughly before deploying

## 📚 Related Documentation

- See `QUICK-START.md` for quick commands
- See `ADMIN-GUIDE.md` for admin interface details
- See `SETUP-GUIDE.md` for initial setup instructions
