const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = []; // this is where the registered users will be stored. It is an empty array that will hold user objects containing their username and password. When a new user registers, their credentials will be added to this array, allowing the application to keep track of registered users and authenticate them during login.

const isValid = (username) => {
  // this function checks if a given username is already taken by any registered user.
  return users.some((user) => user.username === username);
};

const authenticatedUser = (username, password) => {
  // this function checks if a given username and password combination matches any registered user.
  return users.some(
    (user) => user.username === username && user.password === password,
  );
};

//only registered users can login
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body; // this line of code is used to extract the username and password from the request body. The request body is expected to be in JSON format, and it should contain the username and password fields.

  if (!username || !password) {
    // this line of code checks if either the username or password is missing (i.e., undefined, null, or an empty string).
    return res.status(400).json({
      message: "Username and password are required",
    });
  }

  if (!authenticatedUser(username, password)) {
    // this line of code checks if the provided username and password combination is valid by calling the `authenticatedUser` function.
    return res.status(401).json({
      message: "Invalid username or password",
    });
  }

  const accessToken = jwt.sign({ username }, "access", {
    // The `jwt.sign` function is used to create a JSON Web Token (JWT) for the authenticated user. It takes three parameters: the payload (in this case, an object containing the username), a secret key ("access") used to sign the token, and an options object that specifies the token's expiration time. In this case, the token will expire in 1 hour (`expiresIn: "1h"`). This token can be used for subsequent requests to authenticate the user without requiring them to log in again.
    expiresIn: "1h",
  });

  req.session.authorization = {
    accessToken,
    username,
  }; // This line of code stores the generated access token and the username in the session object. The `req.session` object is used to store data that persists across multiple requests from the same user. By storing the access token and username in the session, the server can later verify the user's identity and grant access to protected routes without requiring them to log in again.

  return res.status(200).json({
    message: "User successfully logged in",
    accessToken,
  });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.query.review;
  const username = req.session.authorization.username;

  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found" });
  }

  if (!review) {
    return res.status(400).json({ message: "Review is required" });
  }

  books[isbn].reviews[username] = review;

  return res.status(200).json({
    message: "Review added successfully",
  });
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.session.authorization.username;

  if (!books[isbn]) {
    return res.status(404).json({
      message: "Book not found",
    });
  }

  if (!books[isbn].reviews[username]) {
    return res.status(404).json({
      message: "Review not found for this user",
    });
  }

  delete books[isbn].reviews[username];

  return res.status(200).json({
    message: "Review deleted successfully",
  });
});

module.exports.authenticated = regd_users; // in one line explaination. this is exporting the `regd_users` router as a module so that it can be imported and used in other parts of the application, allowing the defined routes and functionality to be accessible to other files.
module.exports.isValid = isValid;
module.exports.users = users;
