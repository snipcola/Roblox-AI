import globals from "globals";
import tsParser from "@typescript-eslint/parser";
import eslintJs from "@eslint/js";
import eslintTs from "typescript-eslint";
import robloxTsPlugin from "isentinel-eslint-plugin-roblox-ts";

const files = ["src/**/*.{ts,d.ts,tsx,js,jsx,json}"];
const config = {
  files,
  plugins: {
    "roblox-ts": robloxTsPlugin,
  },
  languageOptions: {
    ecmaVersion: 2023,
    sourceType: "module",
    globals: {
      ...globals.node,
    },
    parser: tsParser,
    parserOptions: {
      project: ["tsconfig.json"],
      ecmaFeatures: {
        jsx: true,
      },
    },
  },
  rules: {
    "@typescript-eslint/array-type": [
      "warn",
      {
        default: "generic",
        readonly: "generic",
      },
    ],
    "@typescript-eslint/no-unused-vars": "warn",
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/no-namespace": "off",
    "@typescript-eslint/no-non-null-assertion": "off",
    "@typescript-eslint/no-empty-function": "warn",
    ...robloxTsPlugin.configs.recommended.rules,
    "roblox-ts/lua-truthiness": "off",
    "prefer-const": [
      "warn",
      {
        destructuring: "all",
      },
    ],
    "no-undef-init": "error",
  },
};

export default [
  eslintJs.configs.recommended,
  ...eslintTs.configs.recommended.map((c) => ({ ...c, files })),
  config,
];
