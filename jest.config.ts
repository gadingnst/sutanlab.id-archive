import nextJest from 'next/jest';
import type { Config } from '@jest/types';

const createConfig = nextJest({
  dir: './'
});

const customConfig: Config.InitialOptions = {
  verbose: true,
  preset: 'ts-jest',
  testEnvironment: 'jest-environment-jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleDirectories: ['<rootDir>/node_modules', '<rootDir>/src'],
  testPathIgnorePatterns: [
    '<rootDir>/.next',
    '<rootDir>/.husky',
    '<rootDir>/.vscode',
    '<rootDir>/.github',
    '<rootDir>/node_modules',
    '<rootDir>/coverage',
    '<rootDir>/dist'
  ],
  transform: {
    '^.+\\.ts?$': 'ts-jest'
  },
  globals: {
    'ts-jest': {
      tsconfig: {
        jsx: 'react-jsx'
      }
    }
  },
  moduleNameMapper: {
    'src/(.*)': '<rootDir>/src/$1',
    'components/(.*)': '<rootDir>/src/components/$1',
    'pages/(.*)': '<rootDir>/src/pages/$1',
    '\\.(scss|sass|css)$': 'identity-obj-proxy'
  },
  coverageDirectory: '<rootDir>/coverage',
  collectCoverageFrom: ['src/**/*.{js,jsx,ts,tsx}']
};

module.exports = createConfig(customConfig);
