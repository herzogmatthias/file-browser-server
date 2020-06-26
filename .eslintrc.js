const { createFalse } = require("typescript");

module.exports = {
  env: {
    browser: false,
    es2020: true,
  },
  extends: ["google"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 11,
    sourceType: "module",
  },
  plugins: ["@typescript-eslint"],
  rules: {},
};
