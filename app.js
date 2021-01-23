//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const lodash = require("lodash");
var _ = require("lodash");
const mongoose = require("mongoose");

const homeStartingContent =
  "What is up guys? Welcome to my blog! Have a read about all my daily activities and content here :)";
const aboutContent =
  "Information technology student, love to create apps and websites. ";
const contactContent =
  "E-mail: s.badrinarayanan791@gmail.com      Phone: 8939245810";

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect("mongodb+srv://admin-badri:test123@cluster0.t6shp.mongodb.net/blogDB?retryWrites=true&w=majority", { 
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
});


const postSchema = new mongoose.Schema({
  title: String,
  content: String,
});

const Post = mongoose.model("Post", postSchema); 

app.get("/", function (req, res) {

  Post.find(function(err, posts){
    if(err)
      console.log(err);
    else
      res.render("home", {
        homeStartingContent: homeStartingContent,
        posts: posts,
      });
  });

 
});

app.get("/about", function (req, res) {
  res.render("about", { aboutContent: aboutContent });
});

app.get("/contact", function (req, res) {
  res.render("contact", { contactContent: contactContent });
});

app.get("/compose", function (req, res) {
  res.render("compose");
});

app.get("/posts/:postId", function (req, res) {
  const requestedPostId = req.params.postId;

  Post.findOne({_id: requestedPostId}, function(err, post){

    if(err)
      console.log(err);
    else
      res.render("post", {
        title: post.title,
        content: post.content,
      });
  });
});

app.post("/compose", function (req, res) {
  const post = ({
    title: req.body.postTitle,
    content: req.body.postContent,
  });

  Post.insertMany(
    post,
    function(err){
      if(err)
        console.log(err);
      else
      res.redirect("/");
    }
  );
});

app.listen(process.env.PORT||3000, function () {
  console.log("Server started on port 3000");
});
