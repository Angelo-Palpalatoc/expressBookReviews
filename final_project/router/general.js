const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require("axios");
const BASE_URL = "http://localhost:5000";

function getAllBooks(callback) {
  axios
    .get(`${BASE_URL}/`) //this line of code is used to make a GET request to the specified URL
    .then((response) => callback(null, response.data)) //this line of code is used to handle the successful response from the GET request. It takes the response object as a parameter and calls the callback function with two arguments: null (indicating no error) and the data received from the response (response.data).
    .catch((error) => callback(error, null));
}

function getBookByISBN(isbn) {
  return axios
    .get(`${BASE_URL}/isbn/${isbn}`)
    .then((response) => response.data);
}

async function getBooksByAuthor(author) {
  const response = await axios.get(
    `${BASE_URL}/author/${encodeURIComponent(author)}`,
  );
  return response.data;
}

async function getBooksByTitle(title) {
  const response = await axios.get(
    `${BASE_URL}/title/${encodeURIComponent(title)}`,
  );
  return response.data;
}

public_users.post("/register", (req, res) => {
  const { username, password } = req.body;
  //needs to extract the username and password from the request body. The request body is expected to be in JSON format, and it should contain the username and password fields. This line of code uses destructuring assignment to extract these fields from the req.body object.

  if (!username || !password) {
    //needs to check if either the username or password is missing (i.e., undefined, null, or an empty string). If either of them is missing, it will return a 400 Bad Request response with a message indicating that both fields are required.
    return res.status(400).json({
      message: "Username and password are required",
    });
  }

  if (isValid(username)) {
    //needs to check if the username already exists in the users array. The isValid function is expected to return true if the username is already taken, and false otherwise. If the username is already taken, it will return a 409 Conflict response with a message indicating that the username already exists.
    return res.status(409).json({
      message: "Username already exists",
    });
  }

  users.push({ username, password }); // it means that if the username is valid (i.e., it does not already exist in the users array), the new user object containing the username and password will be added to the users array. This effectively registers the new user by storing their credentials in memory.

  return res.status(201).json({
    message: "User successfully registered",
  });
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
  let title = req.params.title;
  let booksByTitle = [];
  let keys = Object.keys(books);

  keys.forEach((key) => {
    if (books[key].title === title) {
      booksByTitle.push(books[key]);
    }
  });

  res.send(booksByTitle);
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  let isbn = req.params.isbn;
  res.send(books[isbn].reviews);
});

module.exports.getAllBooks = getAllBooks;
module.exports.getBookByISBN = getBookByISBN;
module.exports.getBooksByAuthor = getBooksByAuthor;
module.exports.getBooksByTitle = getBooksByTitle;
module.exports.general = public_users;
