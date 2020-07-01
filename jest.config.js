module.exports = {
  verbose: true,
  testEnvironment: "node",
  setupFilesAfterEnv: ["./tests/setupTests.ts"],
  transform: {
    "^.+\\.jsx?$": "babel-jest",
    "^.+\\.(ts|tsx)?$": "ts-jest",
  },
};
