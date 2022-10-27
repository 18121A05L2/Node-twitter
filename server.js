const express = require("express");  
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

const PORT = process.env.PORT || 5000;

// -----------------------------------   Mongo DB ---------------------------------------

mongoose
  .connect(
    "mongodb+srv://Lucky2892000:Lucky123@cluster0.pkzwryk.mongodb.net/?retryWrites=true&w=majority"
  )
  .then((value) => {
    // console.log(value);
    console.log("successfully connected with mongoose");
  })
  .catch((err) => {
    console.log("There is an error connecting to mongoose");
    console.log(err);
  });

// -------------------------------------   Tweets ----------------------------------
const commentSchema = mongoose.Schema(
  {
    postId: String,
    replyData: String,
    userImage: String,
    userId: String,
    tweetUserId: String,
    userName: String,
  },
  { timestamps: true }
);
const tweetSchema = mongoose.Schema(
  {
    userEmail: String,
    userId: String,
    userImage: String,
    userName: String,
    userInput: String,
    postimage : String,
    comments: [commentSchema],
    likes: Array,
    retweets: Array,
  },
  { timestamps: true }
);
const Tweet = mongoose.model("Tweet", tweetSchema);
// Tweet is the mongoose collection
app
  .route("/tweets")
  .get(async (req, res) => {
    res.send(await Tweet.find({}).sort({ createdAt: -1 }));
  })
  .post((req, res) => {
    const tweet = new Tweet({
      userEmail: req.body.userEmail,
      userId: req.body.userId,
      userImage: req.body.userImage,
      userName: req.body.userName,
      userInput: req.body.userInput,
      comments: [],
      likes: [],
      retweets: [],
    });
    tweet.save();
    res.send("successful");
  });

// ------------------------------------------- specific tweet --------------------------------
app.route("/tweet").post(async (req, res) => {
  res.send(await Tweet.findOne({ _id: req.body._id }));
  // console.log("tweet id "+req.body._id)
});

// ---------------------------------------  Comments ---------------------------------
app
  .route("/comments")
  .get(async (req, res) => {
    res.send(await Tweet.findOne({ _id: req.body._id }));
  })
  .post(async ({ body }, res) => {
    let postComments;
    let newComment = body;

    await Tweet.findOne({ _id: body.postId }).then((value) => {
      console.log("value in comment : " + value);
      postComments = value.comments;
      postComments.push(newComment);
    });
    await Tweet.updateOne(
      { _id: body.postId },
      { $set: { comments: postComments } }
    );
    res.send("successful");
  });

// --------------------------------  Likes -------------------------------

app.route("/likes").post(async (req, res) => {
  userId = req.body.userId;
  postId = req.body.postId;
  let allLikes = [];

  await Tweet.findOne({ _id: postId }).then((value) => {
    allLikes = value.likes;
    console.log("value : " + value);
  });
  let index;
  const userLiked = allLikes.filter((item, i) => {
    index = i
    return item.userId === userId;
  });
  console.log("index : " + index);

  if (userLiked.length) {
    allLikes.splice(index, 1);
    await Tweet.updateOne({ _id: postId }, { $set: { likes: allLikes } });
    console.log(allLikes)
    res.send("unliked")
    console.log("unliked");
  } else {
    allLikes.push({ userId: userId });
    await Tweet.updateOne({ _id: postId }, { $set: { likes: allLikes } });
  
    res.send("liked")
    console.log("liked");
  }

  // Tweet.updateOne({_id : })
});

// -------------------------------------- all Node js operations ---------------------

// const deleteSchema = mongoose.Schema({
//   name: String,
//   comments: Array,
// });
// const Del = mongoose.model("delete", deleteSchema);
// const del = new Del({
//   name: "charan",
// });
// // del.save()
// let com = ["1"]

// async function hel() {

//   await Del.findOne({ _id: "6357c761c723e69b59cb24bc" }).then((value) => {
//     console.log(value.comments);
//     com = value.comments;
//     com.push("sampath");
//     console.log(com);
//   });

//   await Del.updateOne(
//     { _id: "6357c761c723e69b59cb24bc" },
//     { $set: { comments: com } },
//     (err) => {
//       if (!err) {
//         console.log("updated successfully");
//       }
//     }
//   );
// }
// hel()

// Del.deleteMany((err) => {
//   if (!err) {
//     console.log("deleted successfully")
//   }
// });

app.listen(PORT, () => {
  console.log("listening on port 5000 ");
});
