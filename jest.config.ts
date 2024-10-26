import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  testTimeout: 30000,  // Increase timeout to 30 seconds
  forceExit: true,
  detectOpenHandles: true,
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
    '^server/(.*)$': '<rootDir>/server/$1',
    '^src/(.*)$': '<rootDir>/src/$1'
  },
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {
      tsconfig: 'tests/tsconfig.test.json'
    }],
  },
  roots: ['<rootDir>/tests', '<rootDir>/server'],
  testMatch: ['**/__tests__/**/*.+(ts|tsx|js)', '**/?(*.)+(spec|test).+(ts|tsx|js)'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  setupFilesAfterEnv: ['<rootDir>/tests/setup.ts'],
  reporters: [
    'default',
    ['jest-junit', {
      outputDirectory: '.',
      outputName: 'junit.xml',
    }],
  ],
  coverageReporters: ['cobertura'],
};

export default config;