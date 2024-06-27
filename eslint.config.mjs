export default {
    files: ['**/*.js', '**/*.jsx', '**/*.ts', '**/*.tsx'],
    languageOptions: {
        ecmaVersion: 2020, // Updated for more ES6+ features
        sourceType: 'module',
        globals: {
            jest: 'readonly',
        },
    },
    linterOptions: {
        reportUnusedDisableDirectives: true,
    },
    plugins: {
        jest: {},
        security: {},
        prettier: {},
    },
    rules: {
        'no-console': 'warn',
        'func-names': 'off',
        'no-underscore-dangle': 'off',
        'consistent-return': 'off',
        'jest/expect-expect': 'off',
        'security/detect-object-injection': 'off',
        quotes: [
            'error',
            'single',
            { avoidEscape: true, allowTemplateLiterals: true },
        ],
        semi: ['error', 'always'],
        'prefer-arrow-callback': ['error', { allowNamedFunctions: false }],
        'prefer-const': 'error',
        'arrow-spacing': ['error', { before: true, after: true }],
        'no-var': 'error',
        'object-shorthand': ['error', 'always'],
        'prefer-template': 'error',
    },
    ignores: [
        '.idea/**',
        'node_modules/**',
        'build/**',
        'logs/**',
        'yarn.lock',
    ],
};
