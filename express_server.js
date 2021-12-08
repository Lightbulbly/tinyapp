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

app.set("view engine", "ejs");//This tells the Express app to use EJS as its templating engine.

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

app.use(cookieParser());

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.get("/urls", (req, res) => {
  // const templateVars = { greeting: 'Hello World!' };
  // res.render("urls_index", templateVars);
  
  // const username = req.headers.cookie.split("=")[1];

  let username = req.cookies.username;
  // console.log('Cookies: ', req.cookies.username);

  // console.log(username);
  // res.cookie("username", username);
  const templateVars = {
    username: username,
    urls: urlDatabase
  };
 

  res.render("urls_index", templateVars);



});

app.get("/urls/new", (req, res) => {
  
  let username = req.cookies.username;

  const templateVars = {
    username: username,
    urls: urlDatabase
  };
  
  res.render("urls_new", templateVars);



});

app.get("/urls/:shortURL", (req, res) => {

  let username = req.cookies.username;

  const templateVars = {
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL],
    username: username
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
  console.log(req.params.shortURL);
  console.log(urlDatabase[req.params.shortURL]);
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
  console.log(urlDatabase[id]);
  res.redirect(`/urls/${id}`);
});

app.post("/login", (req, res) => {
  // let id = req.params.shortURL;
  // console.log(id);
  // console.log(`req:`,req.body.username);
  const username = req.body.username;
  res.cookie("username", username);
  res.redirect(`/urls`);
});

app.post("/logout", (req, res) => {
  res.clearCookie("username");
  res.redirect(`/urls`);
});


//route to register page
app.get('/register', (req, res) => {
  res.render('register');
});

// The endpoint that handles the registration form data
app.post("/register", (req, res) => {
  const id = generateRandomString();
  const email = req.body.email;
  const password = req.body.password;
  //add a new user object to the global users object so that it includes the user's id, email and password

  users[id] =
  {
    id,
    email,
    password
  };
  
  //set a user_id cookie containing the user's newly generated ID
  res.cookie("id", id);
  // console.log(users);
  res.redirect("/urls");
});

// app.get("/set", (req, res) => {
//   const a = 1;
//   res.send(`a = ${a}`);
// });
 
// app.get("/fetch", (req, res) => {
//   res.send(`a = ${a}`);
// });