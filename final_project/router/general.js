const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const axios = require('axios');
const public_users = express.Router();

const findBooks = function(keyword, by) {
  return Object.values(books).filter((value) => value[by] === keyword);
}

public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if(!username || !password) {
    return res.send("Error register, username or password is empty");
  }

  if(!isValid(username)) {
    return res.send("Username already use");
  }

  users.push({
    username,
    password
  });

  return res.send("Register succesfully, please login " + username);
  
  // return res.status(300).json({message: "Yet to be implemented"});
});
const BASE_URL = "http://localhost:5000";

public_users.get('/api/books', (req, res) => {
  res.json(books);
});

// Get the book list available in the shop
public_users.get('/', async function (req, res) {
  try {
    const response = await axios.get(BASE_URL + "/api/books");
    res.send(response.data);
  } catch(e) {
    res.send(e);
  }
});

// public_users.get('/',function (req, res) {
//   //Write your code here
//   res.send(JSON.stringify(books));
//   // return res.status(300).json({message: "Yet to be implemented"});
// });

public_users.get('/api/isbn/:isbn', (req, res) => {
  const isbn = req.params.isbn;
  const book = books[isbn];

  if(book) {
    return res.json(book);
  }

  return res.send("Book not found");
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
  //Write your code here
  try{
    const isbn = req.params.isbn;
    const response = await axios.get(BASE_URL + "/api/isbn/" + isbn);
    res.send(response.data);
  } catch(e) {
    res.send(e);
  }
  // return res.status(300).json({message: "Yet to be implemented"});
});

public_users.get('/api/author/:author', (req, res) => {
  const author = req.params.author;
  const find = findBooks(author, 'author');

  if(find) {
    return res.json(find);
  }

  return res.send("Author not found");
});

// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
  //Write your code here
  try {
    const author = req.params.author;
    const response = await axios.get(BASE_URL + "/api/author/" + author);
    res.send(response.data);
  } catch(e) {
    res.send(e);
  }
  // return res.status(300).json({message: "Yet to be implemented"});
});

public_users.get('/api/title/:title', (req, res) => {
  const title = req.params.title;
  const find = findBooks(title, 'title');
  console.log(title);

  if(find) {
    return res.send(JSON.stringify(find));
  }

  return res.send("Title not found");
});

// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
  //Write your code here
  try {
    const title = req.params.title;
    const response = await axios.get(BASE_URL + "/api/title/" + title);
    res.send(response.data);
  } catch(e) {
    res.send(e);
  }
  // return res.status(300).json({message: "Yet to be implemented"});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  const review = books[isbn].reviews;
  
  if(review) {
    return res.send(JSON.stringify(review));
  }
  
  return res.send("Books not found");

  // return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
