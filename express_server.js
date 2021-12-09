// OK A user can register
// OK A user cannot register with an email address that has already been used
// OK A user can log in with a correct email/password
// OK A user sees the correct information in the header
// OK user cannot log in with an incorrect email/password
// OK user can log out

const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const cookieParser = require('cookie-parser');

const users = {
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

function generateRandomString() {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  const charactersLength = characters.length;
  for (let i = 0; i < 6; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

function findUserByEmail(email) {
  for (const userId in users) {
    const user = users[userId];
    if (user.email === email) {
      console.log("user returned by findUserByEmail", user);
      return user;
    }
  }
  return null;
}

app.set("view engine", "ejs"); //This tells the Express app to use EJS as its templating engine.

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/urls", (req, res) => {

  let user_id = req.cookies.user_id;
  console.log("req.cookies.user_id in app.get('/urls')", user_id);
  console.log("req.cookies in app.get('/urls')",req.cookies);
  console.log("trouble here",users[user_id]);

  // let username;
  let email;
  if (user_id) {
    // username = users[id].username;
    email = users[user_id].email;
    // console.log('Cookies: ', req.cookies.username);
    // console.log("id:", id);
    // console.log("username:", username);
    // console.log("email:", email);
    
  }
  const templateVars = {
    // username: username,
    // id: id,
    email,
    user_id,
    urls: urlDatabase
  };

  res.render("urls_index", templateVars);



});

app.get("/urls/new", (req, res) => {
  
  const { user_id, email } = req.cookies;

  const templateVars = {
    user_id,
    urls: urlDatabase,
    email
  };
  
  res.render("urls_new", templateVars);
});

app.get("/urls/:shortURL", (req, res) => {

  let user_id = req.cookies.user_id;
  let email = users[user_id].email;
  const templateVars = {
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL],
    user_id: user_id,
    email: email
  };
  res.render("urls_show", templateVars);
});

app.post("/urls", (req, res) => {
  // console.log(req.body);  // Log the POST request body to the console
  let shortURL = generateRandomString();
  // console.log(shortURL);
  urlDatabase[shortURL] =  req.body.longURL;
  console.log(urlDatabase[shortURL]);
  res.redirect(`/urls/${shortURL}`);
  // res.send("Ok");         // Respond with 'Ok' (we will replace this)
});

app.get("/u/:shortURL", (req, res) => {
  // console.log(req.params.shortURL);
  // console.log(urlDatabase[req.params.shortURL]);
  res.redirect(urlDatabase[req.params.shortURL]);
});

app.post("/urls/:shortURL/delete", (req, res) => {
  let shortURL = req.params.shortURL;
  console.log(shortURL);
  delete urlDatabase[shortURL];
  res.redirect(`/urls`);
});

app.post("/urls/:shortURL/update", (req, res) => {
  let id = req.params.shortURL;
  // console.log(id);
  // console.log(`req: `,req.body.updatedURL);
  // console.log(`res: `,res.body);
  urlDatabase[id] = req.body.updatedURL;
  // console.log(urlDatabase[id]);
  res.redirect(`/urls/${id}`);
});

//the POST /login endpoint
app.post("/login", (req, res) => {
//   If a user with that e-mail cannot be found, return a response with a 403 status code.
// If a user with that e-mail address is located, compare the password given in the form with the existing user's password. If it does not match, return a response with a 403 status code.
// If both checks pass, set the user_id cookie with the matching user's random ID, then redirect to /urls.
  let email = req.body.email;
  let password = req.body.password;
  let id;
  // console.log("email:", email);
  // console.log("password:", password);

  if (!findUserByEmail(email)) {
    return res.status(403).send("that email is not in our file");
  } else if (findUserByEmail(email).password === password) {
    console.log("findUserByEmail(email).password:",findUserByEmail(email).password);
    console.log("findUserByEmail(email).id",findUserByEmail(email).id);
    id = findUserByEmail(email).id;
    //set a user_id cookie containing the user's newly generated ID
    res.cookie("user_id", id);
    // console.log(users);
    res.redirect("/urls");
  } else {
    return res.status(403).send("wrong password");
  }
});

app.post("/logout", (req, res) => {
  res.clearCookie("user_id");
  console.log("Cookie cleared, redirect to /urls");
  res.redirect(`/urls`);
});


//Route to register page
app.get('/register', (req, res) => {
  let user_id = req.cookies.user_id;
  if (user_id) {
    res.redirect("/urls");
  }
  
  res.render('register');
});

// The endpoint that handles the registration form data
app.post("/register", (req, res) => {
  const user_id = generateRandomString();
  // const email = req.body.email;
  // const password = req.body.password;
  const { email, password } = req.body;
  // console.log(email, password);
  //Add a new user object to the global users object so that it includes the user's id, email and password

  // If the e-mail or password are empty strings, send back a response with the 400 status code.
  if (!email || !password) {
    return res.status(400).send("email and password cannot be blank");
  }
  
  // If someone tries to register with an email that is already in the users object, send back a response with the 400 status code. Checking for an email in the users object is something we'll need to do in other routes as well. Consider creating an email lookup helper function to keep your code DRY

  if (findUserByEmail(email)) {
    return res.status(400).send("that email has been used to register");
  } else {
    users[user_id] =
    {
      user_id,
      email,
      password
    };
    //set a user_id cookie containing the user's newly generated ID
    res.cookie("user_id", user_id);
    // console.log("users",users);
    res.redirect("/urls");
  }
  // console.log(users);
});


//route to login page
app.get('/login', (req, res) => {



  let user_id = req.cookies.user_id;
  if (user_id) {
    res.redirect("/urls");
  }
  let email;
  if (user_id) {
    email = users[user_id].email;
  }
  const templateVars = {
    email,
    user_id,
    urls: urlDatabase
  };

  res.render('login',templateVars);
});

// app.get("/set", (req, res) => {
//   const a = 1;
//   res.send(`a = ${a}`);
// });
 
// app.get("/fetch", (req, res) => {
//   res.send(`a = ${a}`);
// });