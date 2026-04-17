import js from '@eslint/js'
import globals from 'globals'
import { defineConfig } from 'eslint/config'
import prettier from 'eslint-config-prettier'

export default defineConfig([
  {
    // 👈 ADICIONA ISSO PRIMEIRO
    ignores: [
      'node_modules/**',
      '.postgres/**',
      'dist/**',
      'build/**',
      'coverage/**',
      '*.log',
      '.env*'
    ]
  },
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: globals.node
    }
  },
  js.configs.recommended,
  prettier,
  {
    rules: {
      'no-console': 'off'
    }
  }
])
