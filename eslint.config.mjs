import tseslint from 'typescript-eslint';
import prettier from 'eslint-config-prettier';

export default tseslint.config(
    {
        ignores: ['lib/**', 'node_modules/**', 'example/**', 'docs/**', 'src/webRTC.js']
    },
    ...tseslint.configs.recommended,
    {
        files: ['src/**/*.ts'],
        languageOptions: {
            globals: {
                window: 'readonly',
                document: 'readonly',
                navigator: 'readonly'
            }
        },
        rules: {
            '@typescript-eslint/no-explicit-any': 'off',
            '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
            '@typescript-eslint/ban-ts-comment': 'off',
            '@typescript-eslint/no-empty-object-type': 'off',
            'no-var': 'warn',
            'prefer-const': 'warn'
        }
    },
    prettier
);
