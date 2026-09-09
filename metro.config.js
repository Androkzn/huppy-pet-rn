const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

// Add resolver configuration for web compatibility
config.resolver = {
  ...config.resolver,
  extraNodeModules: {
    ...config.resolver.extraNodeModules,
    // Polyfill is-core-module for web
    'is-core-module': path.resolve(__dirname, 'web-polyfills/is-core-module.js'),
  },
};

module.exports = config;
