const router = require('express').Router();
const verify = require('../lib/verifyToken')
const ObjectID = require('mongoose').Types.ObjectId;
const Post = require('../models/Posts');
const User = require('../models/User');
const jwt = require('jsonwebtoken')


router.get('/', async (req, res) => {
      Post.find((err, content) => {
        !err ? res.send(content) : res.send(err)
    });
})



router.post('/new', async (req, res) => {
    const tokenFromFront = req.body.user;
    // const current_token = req.header('auth-token');
    const current_user = jwt.verify(tokenFromFront, process.env.TOKEN_SECRET)
    console.log(current_user)

    const newRecord = new Post({
        user_info: current_user.user,
        author: current_user.user.name,
        title: req.body.title,
        description: req.body.description
    });

    const user = await User.findById(current_user.user.id)
    const savedPost = await newRecord.save();
    user.posts = (savedPost);
    await user.save()


    newRecord.save((err, content) => {
        !err ? res.send(content) : res.send('Post new record : ' + err)
    });
 });

 router.get("/:id", (req, res, next) => {
    const id = req.params.id;
    Post.findById(id)
      .exec()
      .then(doc => {
        console.log("From database", doc);
        if (doc) {
          res.status(200).json({
              posts: doc,
              request: {
                  type: 'GET',
                  url: 'http://localhost:3000/api/posts'
              }
          });
        } else {
          res
            .status(404)
            .json({ message: "No valid entry found for provided ID" });
        }
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({ error: err });
      });
  });
  

module.exports = router; 
