const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// SVG assets are compiled to React components, so a glyph can be tinted with
// the `fill` prop instead of shipping one file per colour.
config.transformer = {
  ...config.transformer,
  babelTransformerPath: require.resolve('react-native-svg-transformer'),
};

config.resolver = {
  ...config.resolver,
  assetExts: config.resolver.assetExts.filter((ext) => ext !== 'svg'),
  sourceExts: [...config.resolver.sourceExts, 'svg'],
  // React Query 4 declares no `react-native` condition in its exports map, so
  // resolving through it picks the browser build, which imports react-dom —
  // absent since the web dependencies were dropped, and wrong here regardless.
  // Falling back to main fields lets the platform extensions do their job and
  // pick the `.native` variant sitting next to it.
  unstable_enablePackageExports: false,
};

module.exports = config;
