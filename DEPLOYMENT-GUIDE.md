# Deployment Guide

## Overview

This project has **two separate configurations** that deploy to **two different Firebase hosting sites**:

| Configuration | Family         | Site ID                | URL                                  | Deploy Command        |
| ------------- | -------------- | ---------------------- | ------------------------------------ | --------------------- |
| **Default**   | Thomas Family  | `secret-santa-e3f0f`   | https://secret-santa-e3f0f.web.app   | `yarn deploy:default` |
| **Version 2** | Leinert Family | `secret-santa-leinert` | https://secret-santa-leinert.web.app | `yarn deploy:v2`      |

## Key Features

### Production Builds

- **Config Toggle Hidden**: In production builds, the configuration switcher in the Admin page is automatically hidden because only one config is compiled into each build.
- **Dynamic Browser Title**: The browser tab title is dynamically set to match each configuration (e.g., "Thomas Family Secret Santa" or "Leinert Family Secret Santa") via JavaScript when the app loads.
- **Separate Data**: Each configuration uses a different Firestore collection:
  - Thomas Family: `santas`
  - Leinert Family: `leinert-santas`
- **No Cross-Contamination**: Each site is completely independent with its own data and settings.

### Development Mode

- When running locally (`yarn dev`), BOTH configurations are loaded via `register-configs.ts`
- The config switcher appears in the Admin page, allowing you to test both configurations
- You can switch between configs using the toggle or by adding `?version=version2` to the URL

## Deployment Commands

### Deploy Thomas Family (Default)

```bash
yarn deploy:default
```

This will:

1. Build with `VERSION=default` environment variable
2. Compile only the Thomas Family configuration
3. Deploy to `secret-santa-e3f0f` site

### Deploy Leinert Family (Version 2)

```bash
yarn deploy:v2
```

This will:

1. Build with `VERSION=version2` environment variable
2. Compile only the Leinert Family configuration
3. Deploy to `secret-santa-leinert` site

### Deploy Both Sites

To deploy both configurations at once:

```bash
yarn deploy:default && yarn deploy:v2
```

## Build-Only Commands

If you want to build without deploying:

```bash
# Build Thomas Family
yarn build:default

# Build Leinert Family
yarn build:v2
```

## Firebase Hosting Configuration

The `.firebaserc` file maps hosting targets to sites:

```json
{
  "targets": {
    "secret-santa-e3f0f": {
      "hosting": {
        "default": ["secret-santa-e3f0f"],
        "version2": ["secret-santa-leinert"]
      }
    }
  }
}
```

The `firebase.json` defines two hosting targets:

```json
{
  "hosting": [
    {
      "target": "default",
      "public": "dist/spa"
    },
    {
      "target": "version2",
      "public": "dist/spa"
    }
  ]
}
```

## Verification Steps

After deployment, verify each site:

### Thomas Family Site

1. Visit: https://secret-santa-e3f0f.web.app
2. Check title shows: "Thomas Family Secret Santa"
3. Admin page should NOT show config switcher
4. Verify data comes from `santas` collection

### Leinert Family Site

1. Visit: https://secret-santa-leinert.web.app
2. Check title shows: "Leinert Family Secret Santa"
3. Admin page should NOT show config switcher
4. Verify data comes from `leinert-santas` collection

## Troubleshooting

### Config Switcher Still Visible in Production

This should NOT happen, but if it does:

- Check that you built with the correct VERSION env variable
- Verify that `quasar.config.js` is loading the correct config
- Ensure `register-configs.ts` is only loading one config in production

### Wrong Configuration Deployed

If the wrong config was deployed to a site:

1. Run the correct deploy command
2. Clear browser cache
3. Force refresh the site (Cmd+Shift+R on Mac, Ctrl+Shift+F5 on Windows)

### Deploy to Wrong Site

To fix a mistaken deployment:

1. Run the correct deploy command for that site
2. Example: If you accidentally deployed version2 to the default site, run `yarn deploy:default`

## Firebase Hosting Sites Management

### List All Sites

```bash
firebase hosting:sites:list
```

### Create a New Site

```bash
firebase hosting:sites:create <site-id>
```

### Link Target to Site

```bash
firebase target:apply hosting <target-name> <site-id>
```

## Environment Variables

Each configuration compiles different environment variables into the build:

| Variable            | Thomas (Default)             | Leinert (Version 2)           |
| ------------------- | ---------------------------- | ----------------------------- |
| `APP_TITLE`         | "Thomas Family Secret Santa" | "Leinert Family Secret Santa" |
| `GIFTEES_PER_SANTA` | 1                            | 2                             |
| `COLLECTION_NAME`   | "santas"                     | "leinert-santas"              |

These are set in `quasar.config.js` based on the config files.

## Local Development

### Run with Default Config

```bash
yarn dev
```

### Run with Version 2 Config

```bash
yarn dev:v2
```

**Note:** In development mode, you'll see the config switcher because `register-configs.ts` loads both configurations for testing purposes.

## Updating Configurations

If you need to modify a configuration:

1. **Update the config file:**

   - `config.default.js` for Thomas Family
   - `config.version2.js` for Leinert Family

2. **Update `register-configs.ts`** (for local testing):

   ```typescript
   registerConfig('default', {
     appTitle: 'New Title',
     gifteesPerSanta: 1,
     collectionName: 'santas',
   });
   ```

3. **Deploy the updated config:**
   ```bash
   yarn deploy:default   # or yarn deploy:v2
   ```

## Security Notes

- Both configurations use the same Firebase project
- Firestore security rules apply to both collections
- Admin access is controlled by the same security rules
- Each family's data is isolated in separate collections

## Quick Reference

```bash
# Development
yarn dev              # Local dev with config switcher
yarn dev:v2           # Local dev with version2 as default

# Build
yarn build:default    # Build Thomas Family
yarn build:v2         # Build Leinert Family

# Deploy
yarn deploy:default   # Deploy Thomas Family
yarn deploy:v2        # Deploy Leinert Family

# Firebase
firebase hosting:sites:list                       # List sites
firebase target:apply hosting <target> <site-id>  # Link target
```

## Support

If you encounter any issues:

1. Check the Firebase console for deployment errors
2. Verify Firestore rules are set correctly
3. Ensure both config files are up to date
4. Check that `.firebaserc` has the correct target mappings
