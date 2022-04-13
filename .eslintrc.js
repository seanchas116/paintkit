module.exports = {
  root: true,
  env: {
    browser: true,
    es6: true,
    node: true,
  },
  parser: "@typescript-eslint/parser",
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: ["./tsconfig.json"],
  },
  plugins: ["@typescript-eslint", "import"],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking",
    "plugin:import/errors",
    "plugin:import/typescript",
  ],
  rules: {
    eqeqeq: ["error", "always", { null: "ignore" }],
    "no-inner-declarations": ["off"],
    "@typescript-eslint/no-parameter-properties": ["error"],
    "@typescript-eslint/no-unused-vars": ["error", { args: "none" }],
    "@typescript-eslint/ban-ts-comment": ["off"],
    "@typescript-eslint/ban-types": ["off"],
    "@typescript-eslint/no-empty-function": ["off"],
    "@typescript-eslint/no-this-alias": ["off"],
    "@typescript-eslint/no-explicit-any": ["off"],
    "@typescript-eslint/explicit-module-boundary-types": [
      "error",
      { allowArgumentsExplicitlyTypedAsAny: true },
    ],
    "@typescript-eslint/no-empty-interface": ["off"],
    "@typescript-eslint/no-misused-promises": [
      "error",
      {
        checksVoidReturn: false,
      },
    ],
    "@typescript-eslint/require-await": ["off"],
    "import/order": ["error"],
    "import/namespace": ["off"],
    "import/no-extraneous-dependencies": ["error"],
  },
};
