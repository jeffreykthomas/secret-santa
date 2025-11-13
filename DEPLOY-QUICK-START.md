# Quick Start: Deploy Your Secret Santa Apps

## ✅ Setup Complete!

You now have **two separate Firebase hosting sites** ready for deployment:

| Site          | Family         | URL                                  |
| ------------- | -------------- | ------------------------------------ |
| 🎅 **Site 1** | Thomas Family  | https://secret-santa-e3f0f.web.app   |
| 🎁 **Site 2** | Leinert Family | https://secret-santa-leinert.web.app |

## 🚀 Deploy Now

### Deploy Thomas Family

```bash
yarn deploy:default
```

### Deploy Leinert Family

```bash
yarn deploy:v2
```

### Deploy Both

```bash
yarn deploy:default && yarn deploy:v2
```

## ✨ What Happens When You Deploy

Each site gets its own independent configuration:

**Thomas Family Site:**

- Title: "Thomas Family Secret Santa"
- 1 giftee per santa
- Data stored in `santas` collection
- ❌ Config switcher is HIDDEN in production

**Leinert Family Site:**

- Title: "Leinert Family Secret Santa"
- 2 giftees per santa
- Data stored in `leinert-santas` collection
- ❌ Config switcher is HIDDEN in production

## 🧪 Testing Locally

The config switcher **only appears** when running locally:

```bash
yarn dev       # Test both configs with switcher
yarn dev:v2    # Start with Leinert config
```

## 📋 First Deployment Checklist

Before deploying to production:

- [ ] Test both configs locally with `yarn dev`
- [ ] Verify Firestore security rules are set correctly
- [ ] Add family members in admin panel for each config
- [ ] Test Secret Santa assignment for both configs
- [ ] Build and deploy Thomas Family: `yarn deploy:default`
- [ ] Verify Thomas site works: https://secret-santa-e3f0f.web.app
- [ ] Build and deploy Leinert Family: `yarn deploy:v2`
- [ ] Verify Leinert site works: https://secret-santa-leinert.web.app
- [ ] Confirm config switcher is NOT visible on either site
- [ ] Share the appropriate URL with each family

## 🆘 Need Help?

See the full **[DEPLOYMENT-GUIDE.md](./DEPLOYMENT-GUIDE.md)** for:

- Detailed configuration explanations
- Troubleshooting steps
- Firebase hosting management
- Security notes

## 🎯 Quick Tips

1. **Each site is completely independent** - they don't share data
2. **Different URLs for different families** - send the right URL to each family
3. **Config switcher auto-hides in production** - no manual changes needed
4. **Test locally first** - use `yarn dev` before deploying
5. **Deploy often** - it only takes a few minutes

---

**Ready to go?** Run `yarn deploy:default` to deploy your first site! 🎄
