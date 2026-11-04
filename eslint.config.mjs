import { defineConfig, globalIgnores } from "eslint/config";
import { FlatCompat } from "@eslint/eslintrc";

const compat = new FlatCompat({ baseDirectory: process.cwd() });

const eslintConfig = defineConfig([
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  globalIgnores([".next/**", "**/.next/**", ".test-out/**", "work/logo-render-test/**", "out/**", "build/**", "next-env.d.ts"]),
]);

export default eslintConfig;
