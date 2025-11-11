#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Generate a build version based on timestamp
const buildVersion = Date.now().toString();

// Create the version file content
const content = `// This file is auto-generated during build. Do not edit manually.
export const BUILD_VERSION = '${buildVersion}';
`;

// Write to src directory
const outputPath = path.join(__dirname, '..', 'src', 'build-version.ts');
fs.writeFileSync(outputPath, content, 'utf-8');

console.log(`Build version generated: ${buildVersion}`);
