const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const cookieParser = require('cookie-parser');
const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com",
};

function generateRandomString() {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

const users = {
  userRandomID: {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur",
  },
  user2RandomID: {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk",
  },
};

const existingUser = function(email) {
  for (const user in users) {
    if (users[user].email === email) {
      return true;
    }
  }  return false;
};

app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.get("/urls", (req, res) => {
  const templateVars = {
    urls: urlDatabase,
    user: users[req.cookies["user_id"]],
  };
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  const templateVars = {
    user: users[req.cookies["user_id"]],
  };
  res.render("urls_new", templateVars);
});

app.get("/urls/:id", (req, res) => {
  const templateVars = {
    id: req.params.id,
    longURL: urlDatabase[req.params.id],
    user: req.cookies["user_id"],
  };
  res.render("urls_show", templateVars);
});

app.get("/u/:id", (req, res) => {
  const longURL = urlDatabase[req.params.id];
  res.redirect(longURL);
});

app.get('/register', (req, res) => {
  const templateVars = {user: req.cookies["user_id"]};
  res.render("urls_registration", templateVars);
});

app.get('/login', (req, res) => {
  let templateVars = {
    user:users[req.cookies['user_id']],
  };
  res.render('urls_login', templateVars);
});

app.post("/urls", (req, res) => {
  const longURL = req.body.longURL;
  const shortId = generateRandomString();
  urlDatabase[shortId] = longURL;
  console.log(`Parsed request body: ${JSON.stringify(req.body)}`);
  console.log(`New short URL ID: ${shortId}`);
  res.redirect(`/urls/${shortId}`);
});

app.post('/urls/:shortURL/delete', (req, res) => {
  delete urlDatabase[req.params.shortURL];
  res.redirect('/urls');
});

app.post("/urls/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  const longURL = req.body.longURL;
  urlDatabase[shortURL] = longURL;
  res.redirect(`/urls/${shortURL}`);
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
  if (foundUser === null) {
    return res.status(403).send('Account does not exist');
  }
  if (foundUser.password !== password) {
    return res.status(403).send('You have entered an incorrect password. Please check for any spelling errors');
  }
  res.cookie("user_id", foundUser.id);
  res.redirect('/urls');
});

app.post("/logout",(req,res) => {
  res.clearCookie('user_id');
  res.redirect('/urls');
});

app.post('/register', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  if (email === "" || password === "") {
    return res.status(400).send("Email or password cannot be empty.");
  }

  if (existingUser(email)) {
    return res.status(400).send("Email already exists.");
  }

  const newUserID = generateRandomString();
  const newUser = {
    id: newUserID,
    email: email,
    password: password,
  };
  users[newUserID] = newUser;
  console.log(users);

  res.cookie("user_id", newUserID);
  res.redirect('/urls');
});


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});