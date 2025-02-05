module.exports = {
  env: {
    browser: true,
    es6: true,
    commonjs: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 6,
    sourceType: "module",
  },
  plugins: ["react", "@typescript-eslint", "prettier"],
  rules: {
    semi: ["error", "always"],
    indent: 0,
    "no-console": ["error", { allow: ["log", "warn", "error"] }],
    "no-tabs": "off",
    "no-var": "error",
    "react/react-in-jsx-scope": "off",
    //缺少返回值
    "@typescript-eslint/explicit-module-boundary-types": ["error"],
    //声明但未使用
    "@typescript-eslint/no-unused-vars": ["error"],
    //禁止使用any
    "@typescript-eslint/no-explicit-any": ["error"],
    //未修改的变量改为const
    "prefer-const": ["error"],
    "@typescript-eslint/no-namespace": ["error"],
    "@typescript-eslint/ban-types": ["error"],
    "@typescript-eslint/adjacent-overload-signatures": ["error"],
  },
};
