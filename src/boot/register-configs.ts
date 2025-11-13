// Register all configurations for testing mode
import { registerConfig } from './config';

// Manually register both configurations for testing mode
// These are hardcoded here since we can't import CommonJS modules in the browser
// Update these when you change your config files

registerConfig('default', {
  appTitle: 'Thomas Family Secret Santa',
  gifteesPerSanta: 1,
  collectionName: 'santas',
});

registerConfig('version2', {
  appTitle: 'Leinert Family Secret Santa',
  gifteesPerSanta: 2,
  collectionName: 'leinert-santas',
});

console.log('🎅 Testing mode enabled: All configurations loaded');
