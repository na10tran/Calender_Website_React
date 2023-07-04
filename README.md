![example workflow](https://github.com/lannh/todolist/actions/workflows/node.js.yml/badge.svg)


Styling Standards

Naming: snake case

Tabs: 4 spaces

Spacing and alignment: no space after opening parenthesis, no space before closing parenthesis in function's parameter list,
                       opening curly brace on new line
                       
Line length: 80 columns

Using ESLint with the following configuration:

{

    "env": {
        "browser": true,
        "node": true,
        "es2021": true
    },
    "extends": [
        "eslint:recommended",
        "plugin:react/recommended"
    ],
    "parserOptions": {
        "ecmaFeatures": {
            "jsx": true
        },
        "ecmaVersion": "latest",
        "sourceType": "module"
    },
    "plugins": [
        "react"
    ],
    "rules": {
        "indent": [
            "error",
            4
        ],
        "linebreak-style": [
            "error",
            "windows"
        ],
        "quotes": [
            "error",
            "double"
        ],
        "semi": [
            "error",
            "always"
        ],
        "camelcase": [
            "error",
            "always"
        ]
    }
    
}
