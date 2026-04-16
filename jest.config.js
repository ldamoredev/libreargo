module.exports = {
  preset: "jest-expo",
  testMatch: ["<rootDir>/src/**/*.test.ts", "<rootDir>/src/**/*.test.tsx"],
  watchman: false,
  transformIgnorePatterns: [
    "node_modules/(?!((jest-)?react-native|@react-native|react-native|expo(nent)?|@expo(nent)?/.*|expo-.*|@expo/.*|@react-navigation/.*)/)",
  ],
};
