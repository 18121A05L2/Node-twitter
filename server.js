const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

const PORT = process.env.PORT || 5000;


// -----------------------------------   Mongo DB ---------------------------------------

mongoose.connect(
  "mongodb+srv://Lucky2892000:Lucky123@cluster0.pkzwryk.mongodb.net/?retryWrites=true&w=majority"
).then((value) => {
    // console.log(value);
        console.log("successfully connected with mongoose");
}).catch((err) => {
    console.log(err);
});

// -------------------------------------   Tweets ---------------------------------- 

const tweetSchema = mongoose.Schema({
    // timeStamp: DataTransfer,
  userEmail: String,
  userId: String,
  userImage: String,
  userName: String,
  userInput: String,
},{timestamps:true})
const Tweet = mongoose.model('Tweet', tweetSchema);

app.post("/tweet", (req, res) => {
    console.log(req.body)
    const tweet = new Tweet({
    //   timeStamp: new Date(),
      userEmail: req.body.userEmail,
      userId: req.body.userId,
      userImage: req.body.userImage,
      userName: req.body.userName,
        userInput: req.body.userInput,
      
    });
    tweet.save()
    res.send(tweet);
})
app.get("/tweet", async (req, res) => {
  res.send(await Tweet.find({}));
});


// ---------------------------------------  Comments ---------------------------------



const commentSchema = mongoose.Schema({
    name: String,
    email: String,
    message: String,
    timeStamp : Date,
    image : String,
})

const Comment = mongoose.model('Comment', commentSchema);
// Comment is the mongoose collection

const comment = new Comment({
    name: 'Lucky',
    email: "Lucky2892000@gmail.com",
    message: "This is a comment",
    date: new Date(),
})

// comment.save()

app.get("/", async (req, res) => { 
    res.send(await Comment.find({}));
})


// -------------------------------------- all Node js operations ---------------------



app.get("/", (req, res) => {
    res.send("HELLO")
})

app.get("/contact", (req,res) => {
    res.send("contact")
})
app.listen(PORT, () => {
    console.log('listening on port 5000 ');
})
