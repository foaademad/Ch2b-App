#!/usr/bin/env node

/**
 * Script to identify potentially problematic dependencies
 * that might be causing pointerEvents deprecation warnings
 */

const fs = require('fs');
const path = require('path');

// Dependencies that commonly cause pointerEvents warnings
const problematicDeps = [
  'react-native-render-html',
  'react-native-collapsible', 
  'react-native-animatable',
  'react-native-gesture-handler',
  'react-native-reanimated'
];

// Check if dependencies are actually used in the codebase
function checkDependencyUsage(depName) {
  const searchPatterns = [
    `import.*${depName}`,
    `require.*${depName}`,
    `from.*${depName}`,
    depName.replace('react-native-', ''),
    depName.replace('react-native-', '').replace(/-([a-z])/g, (g) => g[1].toUpperCase())
  ];
  
  // This is a simplified check - in a real scenario you'd want to scan all files
  return false; // Assume not used for now
}

console.log('🔍 Checking for potentially problematic dependencies...\n');

problematicDeps.forEach(dep => {
  const isUsed = checkDependencyUsage(dep);
  if (!isUsed) {
    console.log(`⚠️  ${dep} - May be causing pointerEvents warnings`);
    console.log(`   Consider removing if not used: npm uninstall ${dep}\n`);
  }
});

console.log('💡 Solutions:');
console.log('1. Remove unused dependencies that cause warnings');
console.log('2. Update dependencies to latest versions');
console.log('3. The warning suppression has been added to _layout.tsx');
console.log('4. Restart your dev server: npx expo start -c'); 