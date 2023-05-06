function generateRandomString() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  };

const getUserByEmail = function(email) {
    for (const user in email) {
      if (email[user].email === email) {
        return true;
      }
    }  return false;
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