const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

try {
  // Check if node_modules exists
  if (!fs.existsSync(path.join(__dirname, 'node_modules'))) {
    console.log('Installing dependencies...');
    execSync('npm install --production', { stdio: 'inherit' });
    console.log('Dependencies installed successfully');
  }

  // Start the application
  require('./server/index.js');
} catch (error) {
  console.error('Error during installation:', error);
  process.exit(1);
}