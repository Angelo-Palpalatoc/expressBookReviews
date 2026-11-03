const express = require("express"); // needed to import the express module for creating the server and handling routes
const jwt = require("jsonwebtoken"); // needed to import the jsonwebtoken module for handling JWT authentication
const session = require("express-session"); // needed to import the express-session module for handling user sessions
const customer_routes = require("./router/auth_users.js").authenticated; // needed to import the authenticated routes for customer users
const genl_routes = require("./router/general.js").general; // needed to import the general routes for all users

const app = express(); // needed to create an instance of the express application. instance means that we are creating a new object of the express application which will be used to handle requests and responses.

app.use(express.json()); // needed to parse incoming requests with JSON payloads.
// It is a built-in middleware function in Express. It parses incoming requests with JSON payloads and is based on body-parser.
// parse means converting the JSON string into a JavaScript object

app.use(
  "/customer",
  session({
    secret: "fingerprint_customer",
    resave: true,
    saveUninitialized: true,
  }),
);
// needed to set up session management for the customer routes.

app.use("/customer/auth/*", function auth(req, res, next) {
  if (!req.session.authorization) {
    return res.status(401).json({
      message: "User not authenticated",
    });
  }

  const token = req.session.authorization.accessToken;

  jwt.verify(token, "access", (err, decoded) => {
    if (err) {
      return res.status(403).json({
        message: "Invalid or expired token",
      });
    }

    req.user = decoded;
    next();
  });
});
// needed to set up authentication for the customer routes.

const PORT = 5000; // needed to define the port number on which the server will listen for incoming requests. In this case, the server will listen on port 5000.

app.use("/customer", customer_routes); // needed to set up the customer routes for the application.
app.use("/", genl_routes); // needed to set up the general routes for the application.

app.listen(PORT, () => console.log("Server is running")); // needed to start the server and listen for incoming requests on the specified port.
