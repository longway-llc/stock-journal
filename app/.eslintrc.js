module.exports = {
    extends: [
        'airbnb-typescript',
        'airbnb/hooks',
        // 'plugin:jest/recommended',
        'plugin:import/errors',
        'plugin:import/warnings',
        'plugin:import/typescript',
        'plugin:@next/next/recommended'
    ],
    plugins: [
        'react',
        '@typescript-eslint',
        // 'jest',
        'jsx-a11y',
        'import',
        'simple-import-sort',
    ],
    env: {
        browser: true,
        es6: true,
        // jest: true,
        'node': true, // Для серверной части в Next
    },
    settings: {
        'import/resolver': {
            typescript: {
                alwaysTryTypes: true,
            },
        },
    },
    globals: {
        Atomics: 'readonly',
        SharedArrayBuffer: 'readonly',
    },
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaFeatures: {
            jsx: true,
        },
        ecmaVersion: 12, //Next же 10, ранее с высокой версией нареканий не было
        sourceType: 'module',
        project: './tsconfig.json',
    },
    rules: {
        'import/imports-first': 1,
        'import/prefer-default-export': 'off', // хотим только именованные экспорты
        'react/prop-types': 'off', // не используем propTypes
        'react/jsx-props-no-spreading': ['error', { exceptions: ['Component'] }], // обёртки для страниц
        'semi': ['error', 'never'], // по возможности не используем точки с запятыми
        '@typescript-eslint/semi': 'off', // минимизируем точки с запятыми
        'react/react-in-jsx-scope': 'off', // Next нам помогает, поэтому не надо импортить React в каждый файл
        'no-param-reassign': [
            'error',
            { props: true, ignorePropertyModificationsFor: ['draft', 'acc'] }, // стейт в слайсах работает через immer,
            // acc - аккумулятор в reduce
        ],
        // TODO видимо отвалился max-len, нужно починить отдельной таской
        // 'max-len': ['warn', {
        //   'code': 100,
        //   'ignoreComments': true,
        //   'ignoreTrailingComments': true,
        //   'ignoreUrls': true
        // }],
    },
    overrides: [
        {
            files: ['*.ts', '*.tsx'],
            rules: {
                '@typescript-eslint/explicit-module-boundary-types': ['off'],
                'simple-import-sort/imports': [
                    'error',
                    {
                        groups: [
                            // Packages. `react` related packages come first.
                            // Things that start with a letter (or digit or underscore), or `@` followed by a letter.
                            ['^react', '^@?\\w+'],
                            // Absolute imports
                            [`^@/`],
                            // parent imports
                            ['^../*'],
                            // Relative imports
                            ['^./*'],
                        ],
                    },
                ],
            },
        },
    ],
}
