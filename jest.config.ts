import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/tests'],
  moduleFileExtensions: ['ts', 'js'],
  extensionsToTreatAsEsm: ['.ts'], // ✅ treat TS files as ES modules
  globals: {
    'ts-jest': {
      useESM: true,
    },
  },
};

export default config;
