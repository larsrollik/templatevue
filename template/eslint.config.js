import js from '@eslint/js'
import ts from 'typescript-eslint'
import pluginVue from 'eslint-plugin-vue'
import prettierConfig from 'eslint-config-prettier'

export default [
  js.configs.recommended,
  ...ts.configs.recommended,
  ...pluginVue.configs['flat/recommended'],
  // Must come last — disables ESLint rules that conflict with Prettier
  prettierConfig,
  {
    // Parser for <script lang="ts"> inside .vue files
    files: ['**/*.vue'],
    languageOptions: {
      parserOptions: {
        parser: ts.parser,
      },
    },
  },
  {
    ignores: ['dist/**', 'node_modules/**', 'docs/.vitepress/dist/**', 'docs/.vitepress/cache/**'],
  },
]
