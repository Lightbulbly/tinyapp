//helper function to get user's URLs out of a urlDatabase

// const urlDatabase = {
//   b6UTxQ: {
//     longURL: "https://www.tsn.ca",
//     userID: "aJ48lW"
//   },
//   i3BoGr: {
//     longURL: "https://www.google.ca",
//     userID: "aJ48lW"
//   }
// };

function showShortURLsOfUser(userID, urlDatabase) {
  let result = {};
  for (const key in urlDatabase) {
    console.log(urlDatabase[key].userID);
    if (urlDatabase[key].userID === userID) {
      // console.log("hey");
      result[key] = urlDatabase[key];
    }
  }
  return result;
}


const authenticateUser = (email, password, db) => {

};




//generate a 6 digit random string
function generateRandomString() {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  const charactersLength = characters.length;
  for (let i = 0; i < 6; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

//find and return a user in the users object
function getUserByEmail(email, userDB) {
  for (const userId in userDB) {
    const user = userDB[userId];
    if (user.email === email) {
      // console.log("user returned by findUserByEmail", user);
      return user;
    }
  }
  return undefined;
}

// const urlDatabase = {
//   b6UTxQ: {
//     longURL: "https://www.tsn.ca",
//     userID: "aJ48lW"
//   },
//   i3BoGr: {
//     longURL: "https://www.google.ca",
//     userID: "aJ48lN"
//   },
//   i3BoGK: {
//     longURL: "https://www.goo.com",
//     userID: "aJ48lN"
//   }
// };
// console.log(showShortURLsOfUser("aJ48lW",urlDatabase));
// console.log(showShortURLsOfUser("aJ48lN",urlDatabase));
module.exports = {showShortURLsOfUser,generateRandomString, getUserByEmail, authenticateUser};