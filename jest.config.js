export default {
  testEnvironment: "node",
  transform: {},
  moduleNameMapper: {
    "^\\.\\./src/(.*)\\.js$": "<rootDir>/dist/$1.js",
  },
};
