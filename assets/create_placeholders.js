const fs = require('fs');
const path = require('path');

// Create a simple 1024x1024 PNG (icon.png) - Minimal valid PNG
const icon = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8DwHwAFBQIAX8jx0gAAAABJRU5ErkJggg==',
  'base64'
);

// Create files
fs.writeFileSync(path.join(__dirname, 'icon.png'), icon);
fs.writeFileSync(path.join(__dirname, 'splash.png'), icon);
fs.writeFileSync(path.join(__dirname, 'adaptive-icon.png'), icon);
fs.writeFileSync(path.join(__dirname, 'favicon.png'), icon);

console.log('Placeholder assets created successfully!');
