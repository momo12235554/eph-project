const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Limiter le nombre de workers peut aider à résoudre les problèmes de SHA-1/verrouillage sur Windows
config.maxWorkers = 1;

module.exports = config;
