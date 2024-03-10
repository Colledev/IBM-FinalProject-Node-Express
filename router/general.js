const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!isValid(username)) {
      users.push({ username: username, password: password });
      return res.status(200).json({ message: "User created" });
    } else {
      return res.status(400).json({ message: "User already exists" });
    }
  }
  return res.status(404).json({ message: "Unable to register user" });
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
  return res.status(200).json(books);
});

// Task 10
// public_users.get('/', async (req, res) => {
//   try {
//     await new Promise((resolve) => setTimeout(resolve, 100));
//     res.send(books);
//   } catch (err) {
//     res.status(500).json(err);
//   }
// });

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  let isbn = req.params.isbn;
  if (books[isbn]) {
    return res.status(200).json(books[isbn]);
  } else {
    return res.status(404).json({ message: "Book with ISBN not found" });
  }
});

// Task 11
// public_users.get('/isbn/:isbn', async (req, res) => {
//   try {
//     const isbn = req.params.isbn;
//     await new Promise((resolve) => setTimeout(resolve, 100));
//     if (books.hasOwnProperty(isbn)) {
//       const book = books[isbn];
//       res.json(book);
//     } else {
//       res.status(404).json({ error: 'Book not found' });
//     }
//   } catch (err) {
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  let author = req.params.author;
  let book = Object.values(books).filter((book) =>
  book.author.toLowerCase() === author.toLowerCase()
  );
  if (author && book.length > 0) {
    return res.status(200).send(JSON.stringify(book));
  }
  return res.status(404).send(`No book found with this author ${author}`);
});

// Task 12
// public_users.get('/author/:author', async (req, res) => {
//   try {
//     const author = req.params.author;
//     await new Promise((resolve) => setTimeout(resolve, 100));
//     const booksByAuthor = Object.values(books).filter((book) => book.author === author);
//     if (booksByAuthor.length > 0) {
//       res.json(booksByAuthor);
//     } else {
//       res.status(404).json({ error: 'No books found for the given author' });
//     }
//   } catch (err) {
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;
  let book = Object.values(books).filter((book) =>
    book.title.toLowerCase() === title.toLowerCase()
  )
  if (book && book.length > 0) {
    return res.status(200).send(JSON.stringify(book));
  }
  return res.status(404).send(`No book found with this title ${title}`);
});

// Task 13
// public_users.get('/title/:title', async (req, res) => {
//   try {
//     const title = req.params.title;
//     await new Promise((resolve) => setTimeout(resolve, 100));
//     const booksByTitle = Object.values(books).filter((book) => book.title === title);
//     if (booksByTitle.length > 0) {
//       res.json(booksByTitle);
//     } else {
//       res.status(404).json({ error: 'No books found for the given title' });
//     }
//   } catch (err) {
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  let isbn = req.params.isbn;
  if (books[isbn]) {
    return res.status(200).send(books[isbn].reviews);
  } 
  return res.status(404).send(`No book found with this isbn ${isbn}`);
});

module.exports.general = public_users;
