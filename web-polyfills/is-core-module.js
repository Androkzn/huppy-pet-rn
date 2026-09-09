// Polyfill for is-core-module for web platform
// This module always returns false since there are no Node.js core modules in the browser

// Ensure process.version exists and is properly formatted for compatibility
if (typeof process === 'undefined') {
  global.process = { 
    version: 'v16.0.0',
    versions: {
      node: '16.0.0'
    }
  };
} else {
  if (!process.version) {
    process.version = 'v16.0.0';
  }
  if (!process.versions) {
    process.versions = { node: '16.0.0' };
  } else if (!process.versions.node) {
    process.versions.node = '16.0.0';
  }
}

// The is-core-module package exports a function that takes a module name
function isCoreModule(moduleName) {
  return false;
}

// The package internally uses versionIncluded which tries to parse process.version
// We need to provide a versionIncluded function that handles version strings properly
function versionIncluded(version) {
  // Always return false since we're in a browser (no core modules)
  // But we need to handle the version string parsing to avoid errors
  if (!version) {
    return false;
  }
  // The actual is-core-module tries to parse version strings
  // We'll just return false to indicate no version matching needed
  return false;
}

// Export the main function
module.exports = isCoreModule;

// Also attach versionIncluded to prevent errors from internal calls
module.exports.versionIncluded = versionIncluded;
