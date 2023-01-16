//jshint esversion:6
require('dotenv').config();
const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const app = express();
const mongoose = require("mongoose")
const bcrypt = require("bcrypt")
const saltRounds = 10;


app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({
  extended: true
}));

mongoose.set("strictQuery", false);
mongoose.connect("mongodb://127.0.0.1:27017/userDB", {
  useNewUrlParser: true
});

const userSchema = new mongoose.Schema({
  email: String,
  password: String
});


const User = mongoose.model("user", userSchema);


app.get("/", function(req, res) {
  res.render("home")
})

app.get("/login", function(req, res) {
  res.render("login")
})
app.get("/register", function(req, res) {
  res.render("register")
})

//
app.post("/register", function(req, res) {
  bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
    // Store hash in your password DB.
    const newUser = new User({
      email: req.body.username,
      password: hash
    });
    newUser.save(function(err) {
      if (!err) {
        res.render("secrets")
      } else {
        res.send(err)
      }
    })
  });




})

app.post("/login", function(req, res) {
  const inputAccount = req.body.username;
  const inputPassword = req.body.password;
  User.findOne({
    email: inputAccount
  }, function(err, foundUser) {
    if (foundUser) {
      bcrypt.compare(inputPassword, foundUser.password, function(err, result) {
        if (result === true) {
          res.render("secrets")
        } else {
          res.send("Incorrect password")
        }
      });
    } else {
      res.send("User not found")
    };

    // if(!err){
    //   if(password===result.password){
    //     res.send("User Found")
    //   }else{
    //     res.send("User Not found")
    //   }
    // }else{
    //   res.send(err)
    // }
  })
})



app.listen(3000, function() {
  console.log("Server started on port 3000");
})
