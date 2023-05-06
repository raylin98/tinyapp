const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const cookieSession = require('cookie-session');
const bcrypt = require('bcryptjs');

const urlDatabase = {
  "b2xVn2":{
    longURL: "http://www.lighthouselabs.ca",
    userID: "userRandomID",
  },
  "9sm5xK": {
    longURL:"http://www.google.com",
    userID: "user2RandomID",
  },
};

const {generateRandomString, getUserByEmail, urlsForUser } = require('./helpers.js');

const users = {
  userRandomID: {
    id: "userRandomID",
    email: "user@example.com",
    password: bcrypt.hashSync("purple-monkey-dinosaur", 10),
  },
  user2RandomID: {
    id: "user2RandomID",
    email: "user2@example.com",
    password: bcrypt.hashSync("dishwasher-funk", 10),
  },
};

app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));

app.use(cookieSession({
  name: "session",
  keys: ["arm", "leg", "awesome"],
  maxAge: 24 * 60 * 60 * 1000
}));

app.get("/", (req, res) => {
  if (req.session.user_id) {
		res.redirect('/urls');
	} else {
		res.redirect('/login');
	};
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/urls", (req, res) => {
  const userID = req.session.user_id;
  const userURLs = urlsForUser(urlDatabase, userID);

  const templateVars = {
    urls: userURLs,
    user: users[userID],
  };
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  const user = users[req.session.user_id];
  if (!user) {
    res.redirect('/login');
  }
  const templateVars = {
    user: users[req.session.user_id],
  };
  res.render("urls_new", templateVars);
});

app.get("/urls/:id", (req, res) => {
  const userID = req.session.user_id;
  const urlID = req.params.id;
  const url = urlDatabase[urlID];

  if (!url) {
    res.status(404).send("Error 404: This link does not exist");
    return;
  }
  if (url.userID !== userID) {
    res.status(403).send("Access denied, this link does not belong to you");
    return;
  }
  const templateVars = {
    id: urlID,
    longURL: url.longURL,
    user: users[userID],
  };
  res.render("urls_show", templateVars);
});

app.get("/u/:id", (req, res) => {
  const longURL = urlDatabase[req.params.id].longURL;
  res.redirect(longURL);
});

app.get('/register', (req, res) => {
  if (users[req.session.user_id]) {
    res.redirect('/urls');
  } else {
    const templateVars = { user: users[req.session.user_id] };
    res.render("urls_registration", templateVars);
  }
});

app.get('/login', (req, res) => {
  if (users[req.session.user_id]) {
    res.redirect('/urls');
  } else {
    const templateVars = { user: users[req.session.user_id] };
    res.render('urls_login', templateVars);
  }
});

app.post("/urls", (req, res) => {
  const user = users[req.session.user_id];
  if (!user) {
    res.status(401).send("You must be logged in to create a new URL");
  }

  const longURL = req.body.longURL;
  const shortId = generateRandomString();
  urlDatabase[shortId] = { longURL: longURL, userID: user.id };
  console.log(`Parsed request body: ${JSON.stringify(req.body)}`);
  console.log(`New short URL ID: ${shortId}`);
  res.redirect(`/urls/${shortId}`);
});

app.post('/urls/:shortURL/delete', (req, res) => {
  const userID = req.session.user_id;
  const urlID = req.params.shortURL;
  const url = urlDatabase[urlID];

  if (!userID) {
    res.status(403).send("Access denied: You need to be logged in to delete URLs");
    return;
  }
  if (!url) {
    res.status(404).send("Error 404: This link does not exist");
    return;
  }
  if (url.userID !== userID) {
    res.status(403).send("Access denied: You can only delete your own URLs");
    return;
  }
  delete urlDatabase[urlID];
  res.redirect("/urls");
});

app.post("/urls/:shortURL", (req, res) => {
  const userID = req.session.user_id;
  const urlID = req.params.id;
  const url = urlDatabase[urlID];

  if (!userID) {
    res.status(403).send("Access denied: You need to be logged in to edit URLs");
    return;
  }
  if (!url) {
    res.status(404).send("Error 404: This link does not exist");
    return;
  }
  if (url.userID !== userID) {
    res.status(403).send("Access denied: You can only edit your own URLs");
    return;
  }
  urlDatabase[urlID].longURL = req.body.longURL;
  res.redirect("/urls");
});

app.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  let foundUser = null;
  for (const user in users) {
    if (users[user].email === email) {
      foundUser = users[user];
      break;
    }
  }
  if (!foundUser) {
    return res.status(403).send('Account does not exist');
  }
  if (!bcrypt.compareSync(password, foundUser.password)) {
    return res.status(403).send('You have entered an incorrect password. Please check for any spelling errors');
  }
  req.session.user_id = foundUser.id;
  res.redirect('/urls');
});

app.post("/logout",(req,res) => {
  req.session = null;
  res.redirect('/urls');
});

app.post('/register', (req, res) => {
  const email = req.body.email;
  const password = bcrypt.hashSync(req.body.password, 10);

  if (email === "" || password === "") {
    return res.status(400).send("Email or password cannot be empty.");
  }

  if (getUserByEmail(email)) {
    return res.status(400).send("Email already exists.");
  }

  const newUserID = generateRandomString();
  const newUser = {
    id: newUserID,
    email: email,
    password: password,
  };
  users[newUserID] = newUser;

  req.session.user_id = newUserID;
  res.redirect('/urls');
});
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});