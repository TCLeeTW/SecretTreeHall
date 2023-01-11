//jshint esversion:6
const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const app = express();
const mongoose = require("mongoose")
const encrypt=require("mongoose-encryption")

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

var secret = "Thisisthesecretstringthatencriptedthepassword";
userSchema.plugin(encrypt, { secret: secret,encryptedFields: ['password'] });


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
  const newUser = new User({
    email: req.body.username,
    password: req.body.password
  });
  newUser.save(function(err) {
    if (!err) {
      res.render("secrets")
    } else {
      res.send(err)
    }
  })

})

app.post("/login", function(req, res) {
  const inputAccount = req.body.username;
  const inputPassword = req.body.password;
  User.findOne({
    email: inputAccount
  }, function(err, foundUser) {
    if (foundUser) {
      if (inputPassword === foundUser.password) {
        res.render("secrets")
      } else {
        res.send("Incorrect password")
      }

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
