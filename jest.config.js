module.exports = {
  verbose: true,
  testEnvironment: "node",
  setupFilesAfterEnv: ["./src/tests/setupTests.ts", "dotenv/config"],
  transform: {
    "^.+\\.jsx?$": "babel-jest",
    "^.+\\.(ts|tsx)?$": "ts-jest",
  },
};
