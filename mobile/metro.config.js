const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Add support for JSON imports
config.resolver.sourceExts = [...config.resolver.sourceExts, 'json'];

module.exports = config;
