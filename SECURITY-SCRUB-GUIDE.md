# Git History Scrubbing Guide

This guide explains how to remove sensitive data (Firebase credentials) from your git history.

## ⚠️ WARNING

**This is a destructive operation that rewrites git history!**

- Anyone who has cloned your repository will need to re-clone
- All commit hashes will change
- Force push is required
- **Backup your repository first**

## Should You Scrub?

**For Firebase Web API Keys: Probably NO**
- Firebase web API keys are designed to be public
- They're visible in browser network requests anyway
- Your Firestore security rules are the real protection
- The keys only identify your project, they don't authorize access

**Consider scrubbing if:**
- You accidentally committed actual secrets (database passwords, private keys)
- You want to practice good security hygiene
- You're required to by compliance regulations

## Alternative: Just Rotate the Keys

**Easier and safer option:**

1. Go to Firebase Console
2. Go to Project Settings > General
3. Under "Your apps", click the config (gear) icon
4. Regenerate your Web API Key
5. Update your `.env` file with new key
6. Old keys in git history become useless

## Method 1: Using BFG Repo-Cleaner (Recommended)

BFG is faster and simpler than git-filter-branch.

### Step 1: Install BFG

```bash
# On macOS
brew install bfg

# Or download from https://reps.io/BFG-repo-cleaner
```

### Step 2: Create a backup

```bash
cd /Users/jeffreythomas/Documents/secret-santa
cd ..
cp -r secret-santa secret-santa-backup
```

### Step 3: Create a file with strings to remove

Create `secrets.txt` with the credentials to remove:

```
AIzaSyCRw9sh1OmWJTL_b2HDeQXEbBDSpsz9F_w
secret-santa-e3f0f.firebaseapp.com
secret-santa-e3f0f
1050830077055
1:1050830077055:web:ddf62bc6fe809d3b09534a
G-2JEGNHVQ8B
```

### Step 4: Run BFG

```bash
cd secret-santa
bfg --replace-text secrets.txt
```

### Step 5: Clean up refs

```bash
git reflog expire --expire=now --all
git gc --prune=now --aggressive
```

### Step 6: Force push

```bash
git push --force origin main
```

## Method 2: Using git-filter-repo

### Step 1: Install git-filter-repo

```bash
brew install git-filter-repo
```

### Step 2: Create a backup

```bash
cd /Users/jeffreythomas/Documents/secret-santa
cd ..
cp -r secret-santa secret-santa-backup
```

### Step 3: Create replacements file

Create `replacements.txt`:

```
AIzaSyCRw9sh1OmWJTL_b2HDeQXEbBDSpsz9F_w==>REDACTED_API_KEY
secret-santa-e3f0f.firebaseapp.com==>REDACTED_AUTH_DOMAIN
secret-santa-e3f0f==>REDACTED_PROJECT_ID
1050830077055==>REDACTED_SENDER_ID
1:1050830077055:web:ddf62bc6fe809d3b09534a==>REDACTED_APP_ID
G-2JEGNHVQ8B==>REDACTED_MEASUREMENT_ID
```

### Step 4: Run filter-repo

```bash
cd secret-santa
git filter-repo --replace-text replacements.txt --force
```

### Step 5: Re-add remote and force push

```bash
git remote add origin git@github.com:jeffreykthomas/secret-santa.git
git push --force origin main
```

## Method 3: Using git-filter-branch (Legacy)

**Note:** git-filter-branch is deprecated. Use BFG or git-filter-repo instead.

```bash
git filter-branch --tree-filter '
  if [ -f src/boot/firebase.ts ]; then
    sed -i "" "s/AIzaSyCRw9sh1OmWJTL_b2HDeQXEbBDSpsz9F_w/REDACTED_API_KEY/g" src/boot/firebase.ts
  fi
' --all
```

## After Scrubbing

### 1. Verify the scrub worked

```bash
git log --all --full-history -p -- src/boot/firebase.ts | grep -i "AIzaSyC"
```

Should return nothing.

### 2. Rotate Firebase credentials

Even after scrubbing, rotate your keys:
1. Firebase Console > Project Settings
2. Regenerate Web API Key
3. Update `.env` with new credentials

### 3. Update GitHub repository

```bash
git push --force origin main
```

### 4. Notify collaborators

Tell anyone who has cloned the repo to:

```bash
cd secret-santa
git fetch origin
git reset --hard origin/main
# Or just delete and re-clone
```

### 5. Consider making repo private

If it's currently public, make it private in GitHub settings.

## Verification Checklist

After scrubbing, verify:

- [ ] Old credentials don't appear in git log
- [ ] New credentials are in `.env` (not committed)
- [ ] `.env` is in `.gitignore`
- [ ] Force push completed successfully
- [ ] App still works with new credentials
- [ ] Collaborators notified
- [ ] Old credentials rotated in Firebase

## If Something Goes Wrong

Restore from backup:

```bash
cd /Users/jeffreythomas/Documents
rm -rf secret-santa
mv secret-santa-backup secret-santa
cd secret-santa
git push --force origin main
```

## Prevention

To prevent future accidents:

### 1. Use git hooks

Create `.git/hooks/pre-commit`:

```bash
#!/bin/bash
if git diff --cached --name-only | grep -q "firebase.ts"; then
  if git diff --cached src/boot/firebase.ts | grep -q "apiKey:.*AIza"; then
    echo "ERROR: Attempting to commit hardcoded API key!"
    exit 1
  fi
fi
```

Make it executable:
```bash
chmod +x .git/hooks/pre-commit
```

### 2. Use git-secrets

```bash
brew install git-secrets
cd /Users/jeffreythomas/Documents/secret-santa
git secrets --install
git secrets --register-aws
```

### 3. Enable GitHub secret scanning

GitHub automatically scans for known secret patterns. Enable it:
- Go to repository Settings > Security > Code security
- Enable "Secret scanning"

## Resources

- [BFG Repo-Cleaner](https://reps.io/BFG-repo-cleaner)
- [git-filter-repo](https://github.com/newren/git-filter-repo)
- [Removing sensitive data from GitHub](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/removing-sensitive-data-from-a-repository)
- [Firebase Security Best Practices](https://firebase.google.com/support/guides/security-checklist)

