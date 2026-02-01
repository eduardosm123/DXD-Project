import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import react from 'eslint-plugin-react'
import jsxA11y from 'eslint-plugin-jsx-a11y'
import importPlugin from 'eslint-plugin-import'
import tseslint from 'typescript-eslint'
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended'

export default tseslint.config(
  // Global ignores
  {
    ignores: ['dist', 'dist-ssr', 'build', 'coverage', '.vite', 'node_modules'],
  },

  // Base config for all files
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    extends: [js.configs.recommended],
    languageOptions: {
      ecmaVersion: 2020,
      globals: {
        ...globals.browser,
        ...globals.es2020,
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    settings: {
      react: {
        version: 'detect',
      },
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
          project: './tsconfig.json',
        },
        node: true,
      },
    },
  },

  // TypeScript files
  {
    files: ['**/*.{ts,tsx}'],
    extends: [...tseslint.configs.recommended],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      react,
      'jsx-a11y': jsxA11y,
      import: importPlugin,
    },
    rules: {
      // ===== React Hooks Rules =====
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],

      // ===== TypeScript Rules =====
      // Warn on any (non-autofixable, but good to know)
      '@typescript-eslint/no-explicit-any': 'warn',
      // Allow unused vars with underscore prefix
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
      // Prefer type imports (autofixable)
      '@typescript-eslint/consistent-type-imports': [
        'error',
        {
          prefer: 'type-imports',
          fixStyle: 'separate-type-imports',
        },
      ],
      // No unnecessary type assertions
      '@typescript-eslint/no-unnecessary-type-assertion': 'error',

      // ===== Import Rules =====
      // Error on unresolved imports (critical), but ignore Vite public assets
      'import/no-unresolved': [
        'error',
        {
          ignore: ['^/'], // Ignore absolute paths (Vite public directory)
        },
      ],
      // Prevent default exports (prefer named exports)
      'import/no-default-export': 'off', // Allow for now, can enable later
      // Enforce import order (autofixable, opinionated)
      'import/order': [
        'error',
        {
          groups: [
            'builtin', // Node built-ins
            'external', // npm packages
            'internal', // Internal imports
            ['parent', 'sibling', 'index'], // Relative imports
            'type', // Type imports
          ],
          pathGroups: [
            {
              pattern: 'react',
              group: 'external',
              position: 'before',
            },
            {
              pattern: 'react-dom',
              group: 'external',
              position: 'before',
            },
          ],
          pathGroupsExcludedImportTypes: ['react', 'react-dom'],
          'newlines-between': 'always',
          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },
        },
      ],
      // No duplicate imports
      'import/no-duplicates': 'error',
      // Prefer named exports
      'import/prefer-default-export': 'off',
      // No circular dependencies (warn, as they can be intentional sometimes)
      'import/no-cycle': 'warn',

      // ===== React Rules =====
      // Enforce React best practices
      'react/jsx-uses-react': 'off', // Not needed in React 19
      'react/react-in-jsx-scope': 'off', // Not needed in React 19
      'react/prop-types': 'off', // We use TypeScript
      'react/jsx-no-target-blank': 'error', // Security
      'react/jsx-key': 'error', // Important for lists
      'react/no-array-index-key': 'warn', // Warn but don't block
      'react/self-closing-comp': 'error', // Autofixable
      'react/jsx-curly-brace-presence': [
        'error',
        { props: 'never', children: 'never' },
      ], // Autofixable
      'react/jsx-boolean-value': ['error', 'never'], // Autofixable
      'react/jsx-fragments': ['error', 'syntax'], // Prefer <> over <Fragment>
      'react/function-component-definition': [
        'error',
        {
          namedComponents: 'arrow-function',
          unnamedComponents: 'arrow-function',
        },
      ],

      // ===== Accessibility Rules (all warnings) =====
      'jsx-a11y/alt-text': 'warn',
      'jsx-a11y/anchor-has-content': 'warn',
      'jsx-a11y/anchor-is-valid': 'warn',
      'jsx-a11y/aria-props': 'warn',
      'jsx-a11y/aria-role': 'warn',
      'jsx-a11y/click-events-have-key-events': 'warn',
      'jsx-a11y/img-redundant-alt': 'warn',
      'jsx-a11y/no-static-element-interactions': 'warn',
      'jsx-a11y/role-has-required-aria-props': 'warn',

      // ===== General JavaScript/TypeScript Best Practices =====
      // Prefer const (autofixable)
      'prefer-const': 'error',
      // Prefer destructuring
      'prefer-destructuring': [
        'error',
        {
          array: false,
          object: true,
        },
        {
          enforceForRenamedProperties: false,
        },
      ],
      // Prefer template literals (autofixable)
      'prefer-template': 'error',
      // No var (autofixable)
      'no-var': 'error',
      // Object shorthand (autofixable)
      'object-shorthand': ['error', 'always'],
      // No console (warn only, useful in dev)
      'no-console': 'warn',
      // No debugger (warn only)
      'no-debugger': 'warn',
      // Eqeqeq (require === and !==)
      eqeqeq: ['error', 'always'],
      // No unused expressions
      'no-unused-expressions': [
        'error',
        {
          allowShortCircuit: true,
          allowTernary: true,
        },
      ],
      // Curly braces for multi-line
      curly: ['error', 'multi-line'],
    },
  },

  // Test files - relax some rules
  {
    files: ['**/*.test.{ts,tsx}', '**/*.spec.{ts,tsx}', '**/__tests__/**'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      'no-console': 'off',
    },
  },

  // Config files - allow default exports
  {
    files: ['*.config.{js,ts}', 'vite.config.ts', 'vitest.config.ts'],
    rules: {
      'import/no-default-export': 'off',
    },
  },

  // Prettier must be last to override formatting rules
  eslintPluginPrettierRecommended,
)
