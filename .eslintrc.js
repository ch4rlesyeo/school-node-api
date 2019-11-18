module.exports = {
  "parser": "@typescript-eslint/parser",
  "extends": ["plugin:@typescript-eslint/recommended"],
  "rules": {
    "indent": ["error", 2],
    "semi": ["error", "never"],
    "@typescript-eslint/indent": ["error", 2],
    "no-unused-vars": "off",
    "@typescript-eslint/no-unused-vars": "error",
    // "semi": ["error", "never"],
    "no-multi-spaces": "error",
    "no-trailing-spaces": "error",
    "object-curly-spacing": ["error", "always"],
    "no-multiple-empty-lines": ["error", { "max": 1 }],
    "key-spacing": ["error", { "beforeColon": false }],
    "@typescript-eslint/no-explicit-any": 0,
    "@typescript-eslint/member-delimiter-style": ["error", {
      "multiline": {
        "delimiter": "comma",
        "requireLast": false
      },
      "singleline": {
        "delimiter": "comma",
        "requireLast": false
      }
    }],
    "@typescript-eslint/no-var-requires": 0,
    "@typescript-eslint/explicit-member-accessibility": 0,
    "@typescript-eslint/explicit-function-return-type": 0
  }
}
