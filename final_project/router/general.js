const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  //Write your code here
  return res.status(300).json({ message: "Yet to be implemented" });
});

// Get the book list available in the shop
public_users.get("/", function (req, res) {
  // a GET route for the root path ("/") of the public_users router. When a GET request is made to this path, the callback function is executed, which takes two parameters: req (the request object) and res (the response object). The purpose of this route is to retrieve and send the list of books available in the shop as a JSON response.
  return res.send(JSON.stringify(books, null, 2));
  // this line of code is used to send the response back to the client. It converts the books object into a JSON string and sends it as the response. The second parameter (null) is used to specify a replacer function, which can be used to filter or modify the properties of the object being stringified. In this case, it is set to null, which means that all properties of the books object will be included in the JSON string. The third parameter (2) is used to specify the number of spaces to use for indentation in the resulting JSON string. This makes the JSON string more readable by adding whitespace and indentation.
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  let isbn = req.params.isbn;
  res.send(books[isbn]);
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  let author = req.params.author;
  let booksByAuthor = [];
  let keys = Object.keys(books);

  keys.forEach((key) => {
    if (books[key].author === author) {
      booksByAuthor.push(books[key]);
    }
  });

  res.send(booksByAuthor);
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  //Write your code here
  return res.status(300).json({ message: "Yet to be implemented" });
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  //Write your code here
  return res.status(300).json({ message: "Yet to be implemented" });
});

module.exports.general = public_users;
