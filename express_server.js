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
      return user;
    }
  }
  return null;
}

app.set("view engine", "ejs");//This tells the Express app to use EJS as its templating engine.

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
  let id = req.cookies.id;
  console.log("here",id);
  let username;
  let email;
  if (id) {
    username = users[id].username;
    email = users[id].email;
    // console.log('Cookies: ', req.cookies.username);
    // console.log("id:", id);
    // console.log("username:", username);
    // console.log("email:", email);
    
  }
  const templateVars = {
    username: username,
    email: email,
    urls: urlDatabase

  };

  res.render("urls_index", templateVars);



});

app.get("/urls/new", (req, res) => {
  
  let id = req.cookies.id;

  const templateVars = {
    id: id,
    username: username,
    urls: urlDatabase
  };
  
  res.render("urls_new", templateVars);



});

// app.get("/urls/:shortURL", (req, res) => {

//   let username = req.cookies.username;

//   const templateVars = {
//     id:id
//     shortURL: req.params.shortURL,
//     longURL: urlDatabase[req.params.shortURL],
//     username: username,
//   };
//   res.render("urls_show", templateVars);
// });

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
  console.log(urlDatabase[id]);
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
  console.log("password",password);
  console.log("password:", password);
  // && password === users[id].password
  if (!findUserByEmail(email)) {
    return res.status(403).send("that email is not in our file");
  } else if (findUserByEmail(email).password === password) {
    console.log(findUserByEmail(email).id);
    id = findUserByEmail(email).id;
    //set a user_id cookie containing the user's newly generated ID
    res.cookie("id", id);
    // console.log(users);
    res.redirect("/urls");
  } else {
    return res.status(403).send("wrong password");
  }
  // console.log(users);

  // const username = req.body;
  // res.cookie("username", username);
  // res.redirect(`/urls`);
});

app.post("/logout", (req, res) => {
  res.clearCookie("id");
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

  // If the e-mail or password are empty strings, send back a response with the 400 status code.
  if (!email || !password) {
    return res.status(400).send("email and password cannot be blank");
  }
  
  // If someone tries to register with an email that is already in the users object, send back a response with the 400 status code. Checking for an email in the users object is something we'll need to do in other routes as well. Consider creating an email lookup helper function to keep your code DRY

  if (findUserByEmail(email)) {
    return res.status(400).send("that email has been used to register");
  } else {
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
  }
  // console.log(users);
});


//route to login page
app.get('/login', (req, res) => {

  res.render('login');
});

// app.get("/set", (req, res) => {
//   const a = 1;
//   res.send(`a = ${a}`);
// });
 
// app.get("/fetch", (req, res) => {
//   res.send(`a = ${a}`);
// });