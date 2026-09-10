module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          root: ['./src'],
          extensions: ['.ios.js', '.android.js', '.js', '.ts', '.tsx', '.json'],
          alias: {
            '@components': './src/components',
            '@screens': './src/screens',
            '@navigation': './src/navigation',
            '@hooks': './src/hooks',
            '@contexts': './src/contexts',
            '@services': './src/services',
            '@utils': './src/utils',
            '@constants': './src/constants',
            '@theme': './src/theme',
            '@types': './src/types',
          },
        },
      ],
      // Must stay last — Reanimated's plugin rewrites worklets.
      'react-native-reanimated/plugin',
    ],
  };
};
