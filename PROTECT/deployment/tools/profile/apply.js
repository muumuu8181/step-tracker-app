#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const PROFILES_FILE = 'profiles.json';
const PACKAGE_JSON = 'package.json';

function loadProfiles() {
  try {
    const content = fs.readFileSync(PROFILES_FILE, 'utf8');
    return JSON.parse(content);
  } catch (error) {
    console.error(`❌ Failed to load ${PROFILES_FILE}:`, error.message);
    process.exit(1);
  }
}

function loadPackageJson() {
  try {
    const content = fs.readFileSync(PACKAGE_JSON, 'utf8');
    return JSON.parse(content);
  } catch (error) {
    console.error(`❌ Failed to load ${PACKAGE_JSON}:`, error.message);
    process.exit(1);
  }
}

function savePackageJson(packageJson) {
  try {
    fs.writeFileSync(PACKAGE_JSON, JSON.stringify(packageJson, null, 2));
    console.log(`✅ Updated ${PACKAGE_JSON}`);
  } catch (error) {
    console.error(`❌ Failed to save ${PACKAGE_JSON}:`, error.message);
    process.exit(1);
  }
}

function createDirectories(directories) {
  directories.forEach(dir => {
    const fullPath = path.resolve(dir);
    if (!fs.existsSync(fullPath)) {
      fs.mkdirSync(fullPath, { recursive: true });
      console.log(`📁 Created directory: ${dir}`);
    } else {
      console.log(`📁 Directory already exists: ${dir}`);
    }
  });
}

function installDependencies(dependencies) {
  if (dependencies.dev && dependencies.dev.length > 0) {
    console.log(`📦 Installing dev dependencies: ${dependencies.dev.join(', ')}`);
    try {
      execSync(`npm install -D ${dependencies.dev.join(' ')}`, { stdio: 'inherit' });
    } catch (error) {
      console.error('❌ Failed to install dev dependencies:', error.message);
      process.exit(1);
    }
  }

  if (dependencies.prod && dependencies.prod.length > 0) {
    console.log(`📦 Installing prod dependencies: ${dependencies.prod.join(', ')}`);
    try {
      execSync(`npm install ${dependencies.prod.join(' ')}`, { stdio: 'inherit' });
    } catch (error) {
      console.error('❌ Failed to install prod dependencies:', error.message);
      process.exit(1);
    }
  }
}

function updateScripts(packageJson, scripts) {
  if (scripts) {
    packageJson.scripts = {
      ...packageJson.scripts,
      ...scripts
    };
    console.log(`📜 Updated package.json scripts`);
  }
}

function applyProfile(profileName) {
  const profiles = loadProfiles();
  
  if (!profiles[profileName]) {
    console.error(`❌ Profile '${profileName}' not found in ${PROFILES_FILE}`);
    console.log(`Available profiles: ${Object.keys(profiles).join(', ')}`);
    process.exit(1);
  }

  const profile = profiles[profileName];
  console.log(`🚀 Applying profile: ${profileName}`);
  console.log(`📝 Description: ${profile.description}`);

  // Create directories
  createDirectories(profile.directories);

  // Install dependencies
  if (profile.dependencies) {
    installDependencies(profile.dependencies);
  }

  // Update package.json scripts
  const packageJson = loadPackageJson();
  updateScripts(packageJson, profile.scripts);
  savePackageJson(packageJson);

  console.log(`✅ Profile '${profileName}' applied successfully!`);
  console.log(`📁 Created directories: ${profile.directories.join(', ')}`);
}

// Main execution
const args = process.argv.slice(2);
if (args.length === 0) {
  console.error('❌ Please specify a profile name');
  console.log('Usage: node tools/profile/apply.js <profile-name>');
  console.log('Example: node tools/profile/apply.js minimal');
  process.exit(1);
}

const profileName = args[0];
applyProfile(profileName);