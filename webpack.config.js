const createExpoWebpackConfigAsync = require('@expo/webpack-config');
const path = require('path');
const webpack = require('webpack');

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(env, argv);

  // Add fallback for is-core-module for browser
  config.resolve.fallback = {
    ...config.resolve.fallback,
    'is-core-module': path.resolve(__dirname, 'web-polyfills/is-core-module.js'),
  };

  // Also add as alias for double coverage - this takes precedence
  config.resolve.alias = {
    ...config.resolve.alias,
    'is-core-module': path.resolve(__dirname, 'web-polyfills/is-core-module.js'),
    // Replace /macro imports with regular imports for web builds
    // The /macro imports require babel plugin at runtime which causes errors
    '@emotion/styled/macro': '@emotion/styled',
  };

  // Use NormalModuleReplacementPlugin as a final fallback to replace the package
  config.plugins.push(
    new webpack.NormalModuleReplacementPlugin(
      /^is-core-module$/,
      path.resolve(__dirname, 'web-polyfills/is-core-module.js')
    )
  );

  // Replace /macro imports with regular imports to avoid bundling babel plugin
  config.plugins.push(
    new webpack.NormalModuleReplacementPlugin(
      /@emotion\/styled\/macro/,
      '@emotion/styled'
    )
  );

  // Add DefinePlugin to define process.version and process.versions for browser
  // Also include Expo environment variables (EXPO_PUBLIC_*)
  const expoPublicEnvVars = {};
  Object.keys(process.env).forEach((key) => {
    if (key.startsWith('EXPO_PUBLIC_')) {
      expoPublicEnvVars[`process.env.${key}`] = JSON.stringify(process.env[key]);
    }
  });

  config.plugins = [
    ...config.plugins,
    new webpack.DefinePlugin({
      'process.version': JSON.stringify('v16.0.0'),
      'process.versions': JSON.stringify({ node: '16.0.0' }),
      ...expoPublicEnvVars,
    }),
  ];

  // Ignore babel plugin from being bundled (it should only run at build time)
  config.plugins.push(
    new webpack.IgnorePlugin({
      resourceRegExp: /^@emotion\/babel-plugin/,
    })
  );

  return config;
};
