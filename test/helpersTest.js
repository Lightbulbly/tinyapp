const { assert } = require('chai');

const { getUserByEmail } = require('../helpers/helpers.js');

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
    const user = getUserByEmail("user@example.com", testUsers);
    const expectedUserID = "userRandomID";
    // Write your assert statement here
    // Write a unit test that confirms our getUserByEmail function returns a user object when it's provided with an email that exists in the database.
    assert.strictEqual(user.email, testUsers[expectedUserID].email, 'Passed.');

  });

  it('should return undefined if we pass in an email that is not in our users database,', function() {
    const user = getUserByEmail("userHa@example.com", testUsers);
    const expectedUserID = undefined;
    // Write your assert statement here
    // Write a unit test that confirms our getUserByEmail function returns a user object when it's provided with an email that exists in the database.
    assert.strictEqual(user, undefined, 'Passed.');

  });

});