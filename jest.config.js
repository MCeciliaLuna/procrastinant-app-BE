module.exports = {
  testEnvironment: "node",
  coverageDirectory: "coverage",
  collectCoverageFrom: [
    "src/**/*.js",
    "!src/**/*.test.js",
    "!src/__tests__/**",
  ],
  testMatch: ["**/__tests__/**/*.js", "**/*.test.js"],
  verbose: true,
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
  projects: [
    {
      displayName: "unit",
      testMatch: ["**/__tests__/unit/**/*.test.js"],
      setupFilesAfterEnv: ["<rootDir>/src/__tests__/setup.js"],
    },
    {
      displayName: "integration",
      testMatch: ["**/__tests__/integration/**/*.test.js"],
      setupFilesAfterEnv: [
        "<rootDir>/src/__tests__/integration/setup.integration.js",
      ],
      testTimeout: 30000,
    },
  ],
};
