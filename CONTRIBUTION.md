# <img loading="lazy" src="https://readme-typing-svg.demolab.com?font=Poppins&weight=700&size=24&duration=1&pause=1&color=EB008B&center=true&vCenter=true&repeat=false&width=182&height=40&lines=CONTRIBUTION" alt="CONTRIBUTION" />

First off, thank you so much for considering a contribution to our project. We welcome contributions from everyone!

## <img loading="lazy" src="https://readme-typing-svg.demolab.com?font=Poppins&weight=700&size=22&duration=1&pause=1&color=00B8B5&center=true&vCenter=true&repeat=false&width=245&height=40&lines=How can I contribute?" alt="How can I contribute?" />

Contributing is simple. Here's how you can do it:

1. **Identify an Issue**: Look for existing [Issues](https://github.com/{username}/{repo}/issues) or create your own explaining the feature or fix.
2. **Fork the Repository**: Click on the fork button in the top right corner.
3. **Clone the Repository**: After forking, clone the repo to your local machine to make changes.
4. **Set up Your Environment**: Set up the repository by following the instructions in the [setup section](README.md/#setup) of the [README.md](README.md).
5. **Create a New Branch**: Before making any changes, switch to a new branch:
    ```
    git checkout -b your-new-branch-name
    ```
6. **Make Changes**: Implement your feature or fix.
7. **Run Tests**: Ensure your changes do not break any existing functionality.
8. **Write Commit Messages**: Follow the [Conventional Commit Messages](https://gist.github.com/montasim/694610e53305bab2cf9070004bef81e6) format.
9. **Push to GitHub**: After committing your changes, push them to GitHub:
    ```
    git push origin your-new-branch-name
    ```
10. **Submit a Pull Request**: Go to your repository on GitHub and click the 'Compare & pull request' button. Fill in the details and submit.

## <img loading="lazy" src="https://readme-typing-svg.demolab.com?font=Poppins&weight=700&size=22&duration=1&pause=1&color=00B8B5&center=true&vCenter=true&repeat=false&width=120&height=40&lines=Guidelines" alt="Guidelines" />

### <img loading="lazy" src="https://readme-typing-svg.demolab.com?font=Poppins&weight=700&size=18&duration=1&pause=1&color=00B8B5&center=true&vCenter=true&repeat=false&width=202&height=40&lines=Git+commit+messages" alt="Git commit messages" />

We adhere to the [Conventional Commit Messages](https://gist.github.com/montasim/694610e53305bab2cf9070004bef81e6) standard to maintain a clear history.

### <img loading="lazy" src="https://readme-typing-svg.demolab.com?font=Poppins&weight=700&size=18&duration=1&pause=1&color=00B8B5&center=true&vCenter=true&repeat=false&width=172&height=40&lines=Coding+style+guide" alt="Coding style guide" />

We use [ESLint](https://eslint.org/docs/latest/use/getting-started) integrated with [Prettier](https://github.com/prettier/eslint-plugin-prettier) to enforce a consistent code style. Ensure your submissions are compliant by running ESLint checks locally:

-   .prettierrc configuration

    ```.prettierrc
    {
        "semi": true,
        "singleQuote": true,
        "arrowParens": "always",
        "trailingComma": "es5",
        "bracketSpacing": true,
        "tabWidth": 4,
        "useTabs": false,
        "endOfLine": "crlf",
        "overrides": [
            {
                "files": "*.json",
                "options": {
                    "tabWidth": 2
                }
            }
        ]
    }
    ```

-   eslint.config.mjs

    ```eslint.config.mjs
    export default {
        // Specifies the types of files ESLint will lint
        files: ['**/*.js', '**/*.jsx', '**/*.ts', '**/*.tsx'],

        // Language options define the ECMAScript features and global variables
        languageOptions: {
            ecmaVersion: 2020, // Allows parsing of modern ECMAScript features
            sourceType: 'module', // Treats files as ECMAScript modules
            globals: {
                jest: 'readonly', // Indicates global variables provided by Jest that should not be overwritten
            },
        },

        // Linter options for managing the linting process
        linterOptions: {
            reportUnusedDisableDirectives: true, // Reports unused eslint-disable comments
        },

        // Plugins extend ESLint with new settings, environments, rules, and so on
        plugins: {
            jest: {}, // Adds Jest testing support
            security: {}, // Adds additional rules for security
            prettier: {}, // Integrates Prettier for code formatting
        },

        // Rules define how ESLint applies linting to the code
        rules: {
            'no-console': 'warn', // Warns about console usage
            'func-names': 'off', // Turns off the requirement to name functions
            'no-underscore-dangle': 'off', // Allows dangling underscores in identifiers
            'consistent-return': 'off', // Does not require function return values to be consistent
            'jest/expect-expect': 'off', // Turns off a rule that expects a Jest test to have an assertion
            'security/detect-object-injection': 'off', // Disables a security rule about object injection that may not be applicable
            quotes: [
                'error', // Enforces the use of single quotes
                'single',
                { avoidEscape: true, allowTemplateLiterals: true },
            ],
            semi: ['error', 'always'], // Requires semicolons at the end of statements
            'prefer-arrow-callback': ['error', { allowNamedFunctions: false }], // Enforces the use of arrow functions for callbacks
            'prefer-const': 'error', // Requires use of const for variables that are never reassigned
            'arrow-spacing': ['error', { before: true, after: true }], // Enforces space around the arrow of arrow functions
            'no-var': 'error', // Requires let or const, not var
            'object-shorthand': ['error', 'always'], // Requires object literal shorthand syntax
            'prefer-template': 'error', // Prefers template literals over string concatenation
        },

        // Paths to ignore during linting
        ignores: [
            '.idea/**', // Ignores all files in the .idea folder
            'node_modules/**', // Ignores all files in node_modules
            'build/**', // Ignores all files in the build output directory
            'logs/**', // Ignores log files
            'yarn.lock', // Ignores the yarn lock file
        ],
    };
    ```

### <img loading="lazy" src="https://readme-typing-svg.demolab.com?font=Poppins&weight=700&size=18&duration=1&pause=1&color=00B8B5&center=true&vCenter=true&repeat=false&width=195&height=40&lines=Code+Review+Process" alt="Code Review Process" />

All submissions, including submissions by project maintainers, require review. We use GitHub pull requests for this process. The core team members review the pull requests regularly and provide feedback. We aim to respond to pull requests within one week. If your pull request is particularly urgent, please mention this in the request.

### <img loading="lazy" src="https://readme-typing-svg.demolab.com?font=Poppins&weight=700&size=18&duration=1&pause=1&color=00B8B5&center=true&vCenter=true&repeat=false&width=310&height=40&lines=Community+and+Communication" alt="Community and Communication" />

Follow discussions in the [GitHub Issues](https://github.com/{username}/{repo}/issues) section of our repository.
