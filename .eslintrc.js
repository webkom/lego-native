module.exports = {
  env: {
    browser: true,
    node: true,
    es2022: true,
    "react-native/react-native": true,
  },
  extends: [
    "plugin:react/recommended",
    "airbnb",
    "plugin:react-native/all",
    "plugin:prettier/recommended",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 13,
    sourceType: "module",
  },
  plugins: ["react", "react-native", "@typescript-eslint", "prettier"],
  rules: {
    "import/extensions": 0,
    "import/no-unresolved": 0,
    "react/jsx-filename-extension": [
      2,
      { extensions: [".js", ".jsx", ".ts", ".tsx"] },
    ],
  },
};
