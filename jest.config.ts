import type { Config } from '@jest/types'

const config: Config.InitialOptions = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  rootDir: './',
  modulePaths: ['<rootDir>'],
  testRegex: '.spec.ts$',
}

export default config
