# Boot Files Configuration

## register-configs.ts

This file manually registers both configurations for testing mode.

**⚠️ Important**: When you update `config.default.js` or `config.version2.js`, you must also update the values in `register-configs.ts` to keep testing mode in sync.

### Why Manual Registration?

The config files (`config.default.js` and `config.version2.js`) use CommonJS (`module.exports`) because they need to be imported by `quasar.config.js` (which runs in Node.js).

However, browser code can't directly import CommonJS modules, so we manually register the configurations here for testing mode.

### When to Update

Update `register-configs.ts` whenever you change:

- `appTitle` in config files
- `gifteesPerSanta` in config files
- `collectionName` in config files

### Example

If you change `config.version2.js`:

```javascript
// config.version2.js
module.exports = {
  appTitle: 'New Family Name', // ← Changed this
  gifteesPerSanta: 3, // ← Changed this
  collectionName: 'new-collection', // ← Changed this
  // ...
};
```

Then update `register-configs.ts`:

```typescript
// register-configs.ts
registerConfig('version2', {
  appTitle: 'New Family Name', // ← Update here too
  gifteesPerSanta: 3, // ← Update here too
  collectionName: 'new-collection', // ← Update here too
});
```

### Production Builds

In production builds (`yarn build:default` or `yarn build:v2`), only one configuration is compiled into the bundle, so this manual registration doesn't affect production.
