import baseConfig from "@swardify/eslint-config/base";
import nextjsConfig from "@swardify/eslint-config/nextjs";
import reactConfig from "@swardify/eslint-config/react";

/** @type {import('typescript-eslint').Config} */
export default [
  {
    ignores: [".next/**"],
  },
  ...baseConfig,
  ...reactConfig,
  ...nextjsConfig,
];
