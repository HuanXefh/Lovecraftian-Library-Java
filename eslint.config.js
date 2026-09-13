import JS from "@eslint/js";
import NoDefaultParameters from "eslint-plugin-no-default-parameters";


export default [
    {
        name: "base-config",
        ...JS.configs.recommended,

        plugins: {
            "no-default-parameters": NoDefaultParameters,
        },
        files: ["assets/scripts/**/*.js"],
        ignores: ["dist/**", "node_modules/**"],
        languageOptions: {
            ecmaVersion: 2017,
            sourceType: "commonjs",
        },
        rules: {
            "no-var": "warn",
            "no-unused-vars": "off",
            "prefer-const": "off",

            "comma-dangle": [
                "error",
                {
                    arrays: "always-multiline",
                    objects: "always-multiline",
                    functions: "ignore",
                },
            ],

            "no-console": "off",

            "no-default-parameters/enforce": "error",

            "no-restricted-syntax": [
                "error",
                // class
                {
                    selector: "ClassDeclaration",
                    message: "Rhino does not support `class`!",
                },
                {
                    selector: "ClassExpression",
                    message: "Rhino does not support `class`!",
                },
                {
                    selector: "Super",
                    message: "Rhino does not support `super`!",
                },
                // spread operator
                {
                    selector: "RestElement",
                    message: "Rhino does not support `...`!",
                },
                {
                    selector: "SpreadElement",
                    message: "Rhino does not support `...`!",
                },
                // generator
                {
                    selector: "FunctionDeclaration[generator=true]",
                    message: "Rhino does not support `function*`!",
                },
                // async
                {
                    selector: "FunctionDeclaration[async=true]",
                    message: "Rhino does not support `async`!",
                },
                {
                    selector: "FunctionExpression[async=true]",
                    message: "Rhino does not support `async`!",
                },
                {
                    selector: "ArrowFunctionExpression[async=true]",
                    message: "Rhino does not support `async`!",
                },
                // Promise
                {
                    selector: "NewExpression[callee.name='Promise']",
                    message: "Rhino does not support `Promise`!",
                },
                {
                    selector: "CallExpression[callee.object.name='Promise']",
                    message: "Rhino does not support `Promise`!",
                },
                {
                    selector: "CallExpression[callee.property.name=/^(then|catch|finally)$/]",
                    message: "Rhino does not support `Promise`!",
                },
                // export/import
                {
                    selector: "ExportAllDeclaration",
                    message: "Rhino does not support `export`!",
                },
                {
                    selector: "ExportDefaultDeclaration",
                    message: "Rhino does not support `export`!",
                },
                {
                    selector: "ExportNamedDeclaration",
                    message: "Rhino does not support `export`!",
                },
                {
                    selector: "ImportDeclaration",
                    message: "Rhino does not support `import`!",
                },
            ],
        },
    },
];
