const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');

const defaultConfig = getDefaultConfig(__dirname);
const {assetExts, sourceExts} = defaultConfig.resolver;

const config = {
  transformer: {
    getTransformOptions: async () => ({
      transform: {experimentalImportSupport: false, inlineRequires: true},
    }),
    babelTransformerPath: require.resolve('react-native-svg-transformer'), // remove if no SVG support needed
  },
  resolver: {
    assetExts: assetExts.filter(ext => ext !== 'svg'), // if using SVG
    sourceExts: [...sourceExts, 'svg'], // if using SVG
  },
};

module.exports = mergeConfig(defaultConfig, config);
