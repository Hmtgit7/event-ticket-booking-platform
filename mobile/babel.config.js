module.exports = function (api) {
  api.cache(true);
  return {
    // jsxImportSource wires NativeWind's className -> style transform into
    // every JSX file; nativewind/babel does the actual class extraction.
    // react-native-reanimated/plugin MUST stay last - see Reanimated docs.
    presets: [["babel-preset-expo", { jsxImportSource: "nativewind" }], "nativewind/babel"],
    plugins: ["react-native-reanimated/plugin"],
  };
};
