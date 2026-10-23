import eslint from "@eslint/js";
import globals from "globals";

export default [
    // Global ignores
    {
        ignores: ["**/vendor/**", "_site/**", "dist/**", "coverage/**"],
    },
    eslint.configs.recommended,
    {
        // Main configuration
        files: ["**/*.{js,jsx,mjs,cjs,ts,tsx}"],
        plugins: {
        },
        settings: {
        },
        languageOptions: {
            parserOptions: {
                ecmaFeatures: {
                    jsx: true,
                },
            },
            ecmaVersion: "latest",
            sourceType: "module",
            globals: {
                ...globals.browser,
                introJs: "readonly", // TODO: remove this when we have it in the build process
                $: "readonly", // TODO: remove this when we have it in the build process
            },
        },
        rules: {
            // sparse arrays can be a subtle error, but often
            // I want to use them.
            "no-sparse-arrays": "off",
            "no-undef": ["error", { typeof: true }],
            "no-unused-vars": [
                "error",
                {
                    varsIgnorePattern: "^(React|h)$",
                },
            ],
            // generators without a yield are perfectly fine and  the behavior is well defined
            "require-yield": "off",
        },
    },
];
