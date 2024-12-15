const fs = require('fs');
const path = require('path');

const modules = [
  'vscode-ws-jsonrpc',
  'ws',
  'express',
  'cors',
  'http',
  'vscode-languageserver',
  'winreg',
  'sudo-prompt'
];

const outputFileName = 'dependencies.yaml';
const outputLines = [];
const collectedDependencies = new Set();

function getDependencies(moduleName, nodeModulesPath = 'node_modules', visited = new Set()) {
  const modulePath = path.join(nodeModulesPath, moduleName);
  const packageJsonPath = path.join(modulePath, 'package.json');

  if (!fs.existsSync(packageJsonPath)) {
    console.error(`No package.json found for ${moduleName}`);
    return;
  }

  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));

  if (visited.has(moduleName)) {
    return;
  }
  visited.add(moduleName);

  collectedDependencies.add(moduleName);

  Object.keys(packageJson.dependencies || {}).forEach(dep => {
    getDependencies(dep, nodeModulesPath, visited);
  });
}

modules.forEach(moduleName => {
  getDependencies(moduleName);
});

const sortedDependencies = Array.from(collectedDependencies).sort();

sortedDependencies.forEach(moduleName => {
  outputLines.push(`  - from: node_modules/${moduleName}`);
  outputLines.push(`    to: node_modules/${moduleName}`);
});

const fileContent = `extraResources:\n${outputLines.join('\n')}`;
fs.writeFileSync(outputFileName, fileContent);