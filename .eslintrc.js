module.exports = {
  globals: {
    React: true,
    JSX: true,
  },
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
    "react/jsx-no-useless-fragment": [2, { allowExpressions: true }],
    "no-alert": 0,
    "import/extensions": 0,
    "import/no-unresolved": 0,
    "react/jsx-filename-extension": [
      2,
      { extensions: [".js", ".jsx", ".ts", ".tsx"] },
    ],
  },
};
