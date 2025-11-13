# Security Guide

This guide explains the security measures in place for your Secret Santa app and additional steps you can take to protect your data.

## Current Security Measures

### 1. **Firestore Security Rules**

The app uses Firestore security rules to control data access:

✅ **Reads are open** - Anyone can view participants and gift ideas (necessary for the app to function)
✅ **Writes are validated** - Updates must maintain data structure integrity
✅ **No member deletion** - Rules prevent removing existing members
✅ **Structure validation** - All writes must follow the expected data format

**Limitations:**

- Anyone with your Firebase config can still read all data
- The "secret" in Secret Santa relies on participants not looking at the Firestore console
- No authentication means no user-level access control

### 2. **Environment Variables**

Firebase credentials are stored in environment variables (`.env` files) rather than hardcoded:

```javascript
apiKey: process.env.FIREBASE_API_KEY;
```

**Important:**

- `.env` files are in `.gitignore` and won't be committed
- Never commit actual Firebase credentials to git

### 3. **API Key Protection**

Your Firebase API keys are in environment variables, but remember:

- Firebase web API keys are designed to be public
- Real security comes from Firestore rules, not hidden API keys
- Firebase API keys identify your project, not authorize access

## Additional Security Measures (Recommended)

### Option 1: Firebase App Check (Recommended) ⭐

Firebase App Check helps ensure requests come from your legitimate app, not bots or scrapers.

**Setup Steps:**

1. Enable App Check in Firebase Console
2. Install App Check:

```bash
npm install firebase/app-check
```

3. Update `src/boot/firebase.ts`:

```typescript
import { initializeAppCheck, ReCaptchaV3Provider } from 'firebase/app-check';

// After initializeApp
const appCheck = initializeAppCheck(firebaseApp, {
  provider: new ReCaptchaV3Provider('YOUR_RECAPTCHA_SITE_KEY'),
  isTokenAutoRefreshEnabled: true,
});
```

4. Update Firestore rules to require App Check:

```javascript
allow read, write: if request.auth.token.firebase.sign_in_provider != null ||
                      request.app.check.appId == 'YOUR_APP_ID';
```

### Option 2: Domain Restrictions

Restrict your Firebase API keys to only work from your domain:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project
3. Navigate to **APIs & Services > Credentials**
4. Click on your Browser key
5. Under **Application restrictions**, select **HTTP referrers**
6. Add your domains:
   - `localhost:9000` (for development)
   - `https://yourdomain.com` (for production)

### Option 3: Admin Secret Key

Add a secret key requirement for sensitive admin operations.

**Implementation:**

1. Add to `.env`:

```bash
VITE_ADMIN_SECRET=your-secure-random-string-here
```

2. Update `src/pages/AdminPage.vue` to prompt for admin password
3. Update Firestore rules:

```javascript
function isAdmin() {
  return request.resource.data.adminSecret == 'your-secure-secret';
}

allow delete: if isAdmin();
allow create: if isAdmin();
```

**Warning:** This exposes the secret in client code. Better to use Cloud Functions.

### Option 4: Firebase Cloud Functions (Most Secure)

Move admin operations to server-side Cloud Functions:

**Benefits:**

- Complete control over who can perform admin actions
- Secrets stay on the server
- Can add email verification, rate limiting, etc.

**Setup:**

```bash
firebase init functions
```

Example function:

```javascript
exports.createEvent = functions.https.onCall(async (data, context) => {
  // Verify admin secret server-side
  if (data.adminSecret !== process.env.ADMIN_SECRET) {
    throw new functions.https.HttpsError(
      'permission-denied',
      'Invalid admin secret'
    );
  }

  // Create event
  await admin
    .firestore()
    .collection('secret-santa-2024')
    .doc(data.year)
    .set(data.eventData);
});
```

### Option 5: Firebase Authentication (Most Comprehensive)

Add proper user authentication:

**Benefits:**

- Proper user identification
- Granular permissions per user
- Secure by design

**Implementation:**

1. Enable Firebase Authentication (Email/Password or Google Sign-In)
2. Update Firestore rules to use `request.auth.uid`
3. Add login/signup UI

Example rules:

```javascript
match /{collection}/{year} {
  allow read: if request.auth != null;
  allow write: if request.auth != null &&
                  request.auth.token.admin == true;
}
```

## Best Practices

### 1. **Regular Security Audits**

- Review Firestore rules regularly
- Check Firebase Console for unusual activity
- Monitor read/write metrics

### 2. **Environment Management**

- Use different Firebase projects for dev/staging/production
- Rotate API keys periodically
- Never commit `.env` files

### 3. **Data Minimization**

- Only store necessary data
- Don't store sensitive personal information
- Consider encrypting sensitive fields client-side

### 4. **Monitoring**

Set up Firebase monitoring:

- Cloud Firestore usage metrics
- Security rules logs
- Performance monitoring

## Security Checklist

- [x] Firestore security rules implemented
- [x] Firebase credentials in environment variables
- [x] `.env` files in `.gitignore`
- [ ] Firebase App Check enabled
- [ ] Domain restrictions configured
- [ ] Admin secret implementation (optional)
- [ ] Cloud Functions for admin ops (optional)
- [ ] Firebase Authentication (optional)
- [ ] Regular security audits scheduled

## What About the Exposed API Keys in Git?

Since Firebase web API keys are designed to be public and your security relies on Firestore rules, the exposed keys in git history are **low risk** for this application. However:

**If you want to be extra cautious:**

1. Rotate your Firebase API key in the Firebase Console
2. Update your `.env` file with the new key
3. Optionally scrub git history (see `SECURITY-SCRUB-GUIDE.md` if needed)

**Reality check:**

- Your Firestore rules are the real security boundary
- Firebase API keys in web apps are visible in browser network requests anyway
- Domain restrictions + Firestore rules provide adequate protection

## Questions?

For Firebase security best practices, see:

- [Firebase Security Rules Documentation](https://firebase.google.com/docs/firestore/security/get-started)
- [Firebase App Check](https://firebase.google.com/docs/app-check)
- [Firebase Security Checklist](https://firebase.google.com/support/guides/security-checklist)
