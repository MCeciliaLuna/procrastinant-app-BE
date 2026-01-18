const globals = require("globals");
const js = require("@eslint/js");
const prettier = require("eslint-config-prettier");

module.exports = [
  {
    ignores: [
      "node_modules/**",
      "coverage/**",
      "dist/**",
      "build/**",
      ".git/**",
    ],
  },
  {
    files: ["**/*.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "commonjs",
      globals: {
        ...globals.node,
        ...globals.es2021,
      },
    },
    rules: {
      ...js.configs.recommended.rules,
      ...prettier.rules,
      "no-console": "off",
      "no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
        },
      ],
    },
  },
  {
    files: ["**/__tests__/**/*.js", "**/*.test.js"],
    languageOptions: {
      globals: {
        ...globals.jest,
      },
    },
    rules: {
      "no-undef": "off",
      "no-unused-vars": "warn",
    },
  },
];
