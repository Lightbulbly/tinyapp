//helper function to get user's URLs out of a urlDatabase
function showShortURLsOfUser(userID, urlDatabase) {
  let result = {};
  for (const userRandomID in urlDatabase) {
    console.log(urlDatabase[userRandomID].userID);
    if (urlDatabase[userRandomID].userID === userID) {
      console.log("hey");
      result[userRandomID] = urlDatabase[userRandomID];
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