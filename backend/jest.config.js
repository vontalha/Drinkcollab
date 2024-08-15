module.exports = {
    moduleDirectories: ['node_modules', 'src'],
    moduleNameMapper: {
        '^src/(.*)$': '<rootDir>/src/$1',
    },
    rootDir: '.',
    testEnvironment: 'node',
    testRegex: '.*\\.spec\\.ts$',
    transform: {
        '^.+\\.(t|j)s$': 'ts-jest',
    },
};
