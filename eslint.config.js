export default [
  {
    ignores: [
      "node_modules/**",
      "dist/**",
      ".agents/**",
      ".claude/**",
      ".notes/**",
    ],
  },
  {
    files: ["src/**/*.js", "*.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        window: "readonly",
        document: "readonly",
        performance: "readonly",
        requestAnimationFrame: "readonly",
        cancelAnimationFrame: "readonly",
        console: "readonly",
        Set: "readonly",
        Math: "readonly",
      },
    },
    rules: {
      "no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
    },
  },
];
