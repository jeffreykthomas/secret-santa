// Configuration management for switching between versions at runtime
import { ref } from 'vue';

// Configuration type
export interface AppConfig {
  appTitle: string;
  gifteesPerSanta: number;
  collectionName: string;
}

// Available configurations (injected at build time)
export const configurations: Record<string, AppConfig> = {
  default: {
    appTitle: process.env.APP_TITLE || 'Secret Santa',
    gifteesPerSanta: Number(process.env.GIFTEES_PER_SANTA) || 1,
    collectionName: process.env.COLLECTION_NAME || 'santas',
  },
  // You can manually add version2 config here for testing
  // When built with VERSION=version2, this will have those values
};

// Get the initial config version from URL query params, localStorage, or env
const getInitialVersion = (): string => {
  if (typeof window !== 'undefined') {
    // First check URL query parameter
    const urlParams = new URLSearchParams(window.location.search);
    const versionParam = urlParams.get('version');
    if (versionParam && configurations[versionParam]) {
      // Save to localStorage for persistence
      localStorage.setItem('secretSantaConfigVersion', versionParam);
      return versionParam;
    }

    // Then check localStorage
    const stored = localStorage.getItem('secretSantaConfigVersion');
    if (stored && configurations[stored]) {
      return stored;
    }
  }
  // Default to 'default' version
  return 'default';
};

// Current active configuration version
export const activeConfigVersion = ref<string>(getInitialVersion());

// Current active configuration
export const activeConfig = ref<AppConfig>(
  configurations[activeConfigVersion.value] || configurations.default
);

// Switch configuration
export const switchConfig = (version: string) => {
  if (configurations[version]) {
    activeConfigVersion.value = version;
    activeConfig.value = configurations[version];
    if (typeof window !== 'undefined') {
      localStorage.setItem('secretSantaConfigVersion', version);
    }
    console.log(`🎅 Switched to configuration: ${version}`, activeConfig.value);
  } else {
    console.warn(`Configuration version "${version}" not found`);
  }
};

// For development/testing: manually register configurations
export const registerConfig = (version: string, config: AppConfig) => {
  configurations[version] = config;
  console.log(`📝 Registered configuration: ${version}`);
};

// Check if testing mode is enabled (both configs available)
export const isTestingMode = () => {
  return Object.keys(configurations).length > 1;
};
