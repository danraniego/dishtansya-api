process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-secret';
process.env.JWT_EXPIRES_IN = '1h';
// Keep hashing fast in tests; production uses the stronger default.
process.env.PASSWORD_HASH_ITERATIONS = '1000';
