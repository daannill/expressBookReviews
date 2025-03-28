const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
  //write code to check is the username is valid
  const find = users.find((value) => value.username === username);
  
  if(find) {
    return false;
  }

  return true;
}

const authenticatedUser = (username,password)=>{ //returns boolean
  //write code to check if username and password match the one we have in records.
  const find = users.find((value) => value.username === username);

  if(!find) {
    return false;
  }

  if(find.username === username && find.password === password) {
    return true;
  }

  return false;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if(!username || !password) {
    return res.send("Error logging in, username or password is empty");
  }

  if(authenticatedUser(username, password)) {
    let accessToken = jwt.sign({ data: password }, "access", { expiresIn: 60 * 60 });

    req.session.authorization = {
      accessToken,
      username
    }

    return res.send("User " + username + " succesfully login");
  }

  return res.send("Something went wrong");

  // return res.status(300).json({message: "Yet to be implemented"});
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const isbn = req.params.isbn;
  const book = books[isbn];
  const review = req.body.review;
  const username = req.session.authorization['username'];

  if(book) {
    book.reviews[username] = review;

    return res.send("Review successfully added");
  }

  return res.send("Something went wrong");

  // return res.status(300).json({message: "Yet to be implemented"});
});

regd_users.delete('/auth/review/:isbn', (req, res) => {
  const isbn = req.params.isbn;
  const book = books[isbn];
  const username = req.session.authorization['username'];

  if(book.reviews[username]) {
    let message = book.reviews[username];
    delete book.reviews[username];
    return res.send(`Delete review: ${message}, Success`);
  }

  res.send("Something went wrong");
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
