function generateRandomString() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  };

  const getUserByEmail = function(email, users) {
    for (const user in users) {
      if (users[user].email === email) {
        return users[user];
      }
    }
    return null;
  };

 const urlsForUser = function(urlDatabase, userID) {
    let userURLS = {};
    for (let key in urlDatabase) {
      if (urlDatabase[key].userID === userID) {
        userURLS[key] = urlDatabase[key];
      }
    }
    return userURLS;
};

module.exports = { generateRandomString, getUserByEmail, urlsForUser };