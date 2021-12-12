// OK A user can register
// OK A user cannot register with an email address that has already been used
// OK A user can log in with a correct email/password
// OK A user sees the correct information in the header
// OK user cannot log in with an incorrect email/password
// OK user can log out

const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
// const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session');
app.use(cookieSession({
  name: 'session',
  keys: [`alsdjf;lkajsd;lkfajsdklj`,`sadfasdfa`],

  // Cookie Options
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}));


const {showShortURLsOfUser,generateRandomString, getUserByEmail, authenticateUser} = require("./helpers/helpers");

//bcryptjs
const bcrypt = require('bcryptjs');


//users can be accessed using the following
//id: users[userID].id
//email: users[userID].email
//password: users[userID].password

const users = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: bcrypt.hashSync("abc", 10)
    // const hashedPassword = bcrypt.hashSync(password, 10);

  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: bcrypt.hashSync("abc", 10)
  }
};

const urlDatabase = {
  b6UTxQ: {
    longURL: "https://www.tsn.ca",
    userID: "aJ48lW"
  },
  i3BoGr: {
    longURL: "https://www.google.ca",
    userID: "aJ48lW"
  }
};

//This tells the Express app to use EJS as its templating engine.
app.set("view engine", "ejs");

//use cookieParser
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));
// app.use(cookieParser());

//old type of database for ref
// const urlDatabase = {
//   "b2xVn2": "http://www.lighthouselabs.ca",
//   "9sm5xK": "http://www.google.com"
// };

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

app.get("/", (req, res) => {
  let id = req.session.user_id;
  if (!id) {
    res.redirect("/login");
  }
  res.redirect("/urls");
});

//user click on TinyApp icon or My URLS leads here
app.get("/urls", (req, res) => {
  // console.log("get request /urls has cookie req.cookies:",req.cookies.user_id);
  let id = req.session.user_id;
  if (!id) {
    res.status(400).send("Please <a href=/login>log in</a> to see URLs");
   
  }
  //if user is logged in, show a list of his/her URLs, if not, redirect to login
  let email = users[id].email;
  const templateVars = {
    // username: username,
    // id: id,
    email,
    id,
    urls: showShortURLsOfUser(id, urlDatabase)

  };

  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  // console.log("HEY",req.cookies);
  let id = req.session.user_id;
  if (!id) {
    res.redirect("/login");
  }
  const email = users[id].email;
  // console.log(id, email);
  const templateVars = {
    id,
    // urls,
    email
  };
  res.render("urls_new", templateVars);
});



app.get("/urls/:shortURL", (req, res) => {
  
  let id = req.session.user_id;
  if (!id) {
    res.status('400').send("Please <a href='/login'>log in<a> to see URLs");
  }
  let email = users[id].email;
  let shortURL = req.params.shortURL;
  console.log("shortURL",req.params.shortURL);
  console.log("req.params",req.params);
  // console.log("The short URL that came with the get request req.params.shortURL:",shortURL);
  // console.log("now", urlDatabase[shortURL]);
  // console.log("HERE!",userID);
  // console.log("HERE!",email);
  // console.log(urlDatabase);
  // console.log("shortURL[shortURL]: ",urlDatabase[shortURL]);

  console.log("here it is", Object.keys(urlDatabase).includes(shortURL));
  let shortURLisInDatabase = Object.keys(urlDatabase).includes(shortURL);
  console.log("keys in database:",Object.keys(urlDatabase));
  console.log(shortURL);
  console.log("shortURLisInDatabase:", shortURLisInDatabase);
  if (shortURLisInDatabase) {
    const templateVars = {
      shortURL: shortURL,
      longURL: urlDatabase[shortURL].longURL,
      id: id,
      email: email
    };
    res.render("urls_show", templateVars);
  } else {
    res.status(400).send("That short URL doesn't exist. <a href='/urls/'>See your URLs.</a>");
  
  }
  


 
});
//POST /urls
app.post("/urls", (req, res) => {
  // console.log("req.cookies", req.cookies.user_id);
  const id  =  req.session.user_id;
  if (!id) {
    return res.status(400).send("Log in to make shortURL");
  }
  // console.log(req.body);  // Log the POST request body to the console
  let shortURL = generateRandomString();
  // console.log("hey",shortURL);
  // console.log("haa",req.body.longURL);
  urlDatabase[shortURL] = {
    longURL:req.body.longURL,
    userID: id
  };
  console.log(urlDatabase);
  res.redirect(`/urls/${shortURL}`);
  // res.send("Ok");         // Respond with 'Ok' (we will replace this)
});

//Anyone Can Visit Short URLs
app.get("/u/:shortURL", (req, res) => {
  // console.log("here it is",req.params);
  let shortURL = req.params.shortURL;
  let id = req.session.user_id;
  let email = users[id].email;

  console.log("shortURL in u/:shortURL:",shortURL);
  console.log(urlDatabase);
  let shortURLisInDatabase = Object.keys(urlDatabase).includes(shortURL);

  if (!shortURLisInDatabase) {
    res.status(400).send("That short URL doesn't exist. <a href='/urls'>See your URLs.</a>");

  }
  res.redirect(urlDatabase[shortURL].longURL);

});

app.post("/urls/:shortURL/delete", (req, res) => {
  let shortURL = req.params.shortURL;
  console.log(shortURL);
  delete urlDatabase[shortURL];
  res.redirect(`/urls`);
});

// app.get("/urls/:shortURL/update", (req, res) => {
//   let id = req.session.user_id;
//   const shortURL = req.params.shortURL;
//   console.log("here is id from req.session.user_id", id);
//   // console.log(`req: `,req.body.updatedURL);
//   // console.log(`res: `,res.body);
//   // urlDatabase[id].longURL = req.body.updatedURL;
//   // console.log(urlDatabase[id]);
//   res.redirect(`/urls/${shortURL}`);
// });

app.post("/urls/:shortURL/update", (req, res) => {

  let id = req.session.user_id;
  const shortURL = req.params.shortURL;
  // let id = req.params.shortURL;
  // console.log("here", id);
  console.log(shortURL);
  console.log(`req: `,req.body.updatedURL);
  // console.log(`res: `,res.body);
  urlDatabase[shortURL].longURL = req.body.updatedURL;
  // console.log(urlDatabase[id]);
  res.redirect(`/urls/${shortURL}`);
});

//the POST /login endpoint
app.post("/login", (req, res) => {
//   If a user with that e-mail cannot be found, return a response with a 403 status code.
// If a user with that e-mail address is located, compare the password given in the form with the existing user's password. If it does not match, return a response with a 403 status code.
// If both checks pass, set the userID cookie with the matching user's random ID, then redirect to /urls.
  let email = req.body.email;
  let password = req.body.password;
  const user = getUserByEmail(email,users);
  // console.log("email:", email);
  // console.log("password:", password);
  if (user === null) {
    return res.status(403).send("Can not find a user with that email");
  }
  if (!bcrypt.compareSync(password, user.password))
  // if (user.password !== password)
  {
    return res.status(403).send("wrong password");
  }

  // console.log("getUserByEmail(email,users).password:",getUserByEmail(email,users).password);
  // console.log("getUserByEmail(email,users).id",getUserByEmail(email,users).id);
  //set a user_id cookie containing the user's newly generated ID
  // res.cookie("user_id", user.id);
  req.session.user_id = user.id;

  // console.log(users);
  res.redirect("/urls");
  
});

app.post("/logout", (req, res) => {
  // res.clearCookie("user_id");
  req.session = null;
  // console.log("Cookie cleared, redirect to /urls");
  console.log("Cookie session cleared, redirect to /urls");

  res.redirect(`/urls`);
});


//Route to register page
app.get('/register', (req, res) => {
  let id = req.session.user_id;
  if (id) {
    res.redirect("/urls");
  }
  res.render('register');
});

// The endpoint that handles the registration form data
app.post("/register", (req, res) => {
  
  // If the e-mail or password are empty strings, send back a response with the 400 status code.
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).send("Missing email or password, please <a href='/register'>try again</a>");
    return;
  }
  // If someone tries to register with an email that is already in the users object, send back a response with the 400 status code. Checking for an email in the users object is something we'll need to do in other routes as well. Consider creating an email lookup helper function to keep your code DRY
  let user = getUserByEmail(email,users);
  // console.log("user:",user);
  if (user) {
    return res.status(400).send("That email has been used to register");
  }

  
  // console.log(email, password);
  //Add a new user object to the global users object so that it includes the user's id, email and password
  const userRandomID = generateRandomString();
  // const email = req.body.email;
  // const password = req.body.password;
  const hashedPassword = bcrypt.hashSync(password, 10);

  if (!user) {
    // console.log(user, userRandomID);
    users[userRandomID] =
    {
      id: userRandomID,
      email,
      password: hashedPassword
    };
    user = users[userRandomID];
    //set a userID cookie containing the user's newly generated ID
    // res.cookie("user_id", user.id);
    req.session.user_id = user.id;


    // console.log("users",users);
    res.redirect("/urls");
  
  // console.log(users);
  }
  
  
});


//route to login page
app.get('/login', (req, res) => {

  // console.log("get /login req.cookies",req.cookies);
  let id = req.session.user_id;
  if (id) {
    res.redirect("/urls");
  }

  // console.log(users[id]);
  let email;
  // if (!userID) {
  //   // console.log("here", userID);
  // email = users[userID].email;
  // }
  const templateVars = {
    email,
    id,
    urls: urlDatabase
  };

  res.render('login', templateVars);
});

// app.get("/set", (req, res) => {
//   const a = 1;
//   res.send(`a = ${a}`);
// });
 
// app.get("/fetch", (req, res) => {
//   res.send(`a = ${a}`);
// });