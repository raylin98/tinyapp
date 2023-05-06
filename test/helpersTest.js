const { assert } = require('chai');

const { getUserByEmail } = require('../helpers.js');

const testUsers = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  }
};

describe('getUserByEmail', function() {
  it('should return a user with valid email', function() {
    const user = getUserByEmail('user@example.com', testUsers);
    const expectedOutput = {
      id: 'userRandomID',
      email: 'user@example.com',
      password: 'purple-monkey-dinosaur'
    };
    assert.deepEqual(user, expectedOutput);
  }),
  it('should return null if email is not found', function() {
    const user = getUserByEmail('notfound@example.com', testUsers);
    assert.strictEqual(user, null);
  });
  it('should return the first user with matching email', function() {
    const user = getUserByEmail('user2@example.com', testUsers);
    const expectedOutput = {
      id: 'user2RandomID',
      email: 'user2@example.com',
      password: 'dishwasher-funk'
    };
    assert.deepEqual(user, expectedOutput);
  });
});