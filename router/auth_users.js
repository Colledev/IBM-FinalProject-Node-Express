const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => { //returns boolean
  //write code to check is the username is valid
  const userMatches = users.filter((user) => user.username === username);
  return userMatches.length > 0;
}

const authenticatedUser = (username, password) => { //returns boolean
  //write code to check if username and password match the one we have in records.
  const matchingUsers = users.filter((user) => user.username === username && user.password === password);
  return matchingUsers.length > 0;
}



//only registered users can login
regd_users.post("/login", (req, res) => {
  console.log("login: ", req.body);
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(404).json({ message: "Error logging in" });
  }

  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign({
      data: password
    }, 'access', { expiresIn: 3600 });

    req.session.authorization = {
      accessToken, username
    }
    return res.status(200).send("User successfully logged in");
  } else {
    return res.status(208).json({ message: "Invalid Login. Check username and password" });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  let review = req.body.review;
  let ISBN = req.params.isbn;
  let bookReviews = books[ISBN].reviews;
  let loggedUser = req.session.authorization.username;

  if (review) {
    bookReviews.reviewsList = new Array();
    bookReviews.reviewsList.push({ id: loggedUser, review: review });
    return res
      .status(200)
      .send(
        `Your review "${review}" was added to the book with ISBN ${ISBN}!`
      );
  } else {
    return res.status(404).send("You have to write a review to submit it!");
  }
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  let review = req.body.review;
  let ISBN = req.params.isbn;
  let loggedUser = req.session.authorization.username;
  let bookReviews = books[ISBN].reviews.reviewsList;
  for (let i = 0; i < bookReviews.length; i++) {
    if (bookReviews[i].id == loggedUser) {
      bookReviews.splice(i, 1);
      return res
        .status(200)
        .send(`Your review on book with ISBN ${ISBN} was deleted`);
    }
  }
});


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
