const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

// SVG assets are imported as React components (same as SVGR on web, so the
// `fill`/`width`/`height` props the ported screens pass keep working).
config.transformer = {
  ...config.transformer,
  babelTransformerPath: require.resolve('react-native-svg-transformer'),
};

config.resolver = {
  ...config.resolver,
  assetExts: config.resolver.assetExts.filter((ext) => ext !== 'svg'),
  sourceExts: [...config.resolver.sourceExts, 'svg'],
  extraNodeModules: {
    ...config.resolver.extraNodeModules,
    // Polyfill is-core-module for web
    'is-core-module': path.resolve(__dirname, 'web-polyfills/is-core-module.js'),
  },
};

module.exports = config;
