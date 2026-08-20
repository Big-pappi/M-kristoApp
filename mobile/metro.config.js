const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const projectRoot = __dirname;

const config = getDefaultConfig(projectRoot);

// This Expo app lives inside a larger repo (a Next.js web app at the root with
// its own node_modules, plus a Django backend). Without isolation, Metro can
// climb up the directory tree and pull in a SECOND copy of React/React Native
// from the root node_modules. In bridgeless (New Architecture) mode, two copies
// of React break native runtime init and every native module — including
// `PlatformConstants` — resolves to empty, crashing the app on launch.
//
// Only watch this project so Metro never bundles files from the root web app.
config.watchFolders = [projectRoot];

// Force the React singletons to THIS project's copies. Hierarchical lookup stays
// enabled (npm keeps some deps like @expo/metro-runtime nested under
// expo-router/node_modules), but any `react` / `react-native` import — no matter
// where it originates — is pinned here, so a hoisted root copy can never sneak in.
config.resolver.extraNodeModules = {
  ...(config.resolver.extraNodeModules || {}),
  react: path.resolve(projectRoot, 'node_modules/react'),
  'react-native': path.resolve(projectRoot, 'node_modules/react-native'),
};

// Add support for JSON imports
config.resolver.sourceExts = [...config.resolver.sourceExts, 'json'];

module.exports = config;
