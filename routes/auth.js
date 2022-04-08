const router = require('express').Router();
const User = require('../models/User');
const Joi = require('@hapi/joi');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const { registerValidation, loginValidation } = require('../lib/validation');
const res = require('express/lib/response');
const Posts = require('../models/Posts');


router.post('/register', async (req, res) => {
    const { error } = registerValidation(req.body)
    if(error) return res.status(400).send(error.details[0].message)

    const checkIfEmailExist = await User.findOne({email: req.body.email});
    if(checkIfEmailExist) return res.status(400).send('Email already exists');

    const checkIfNameExists = await User.findOne({name: req.body.name});
    if(checkIfNameExists) return res.status(400).send('Name already exists');

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt)

    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword
    });
    try{
        const savedUser = await user.save();

        const token = jwt.sign({user: {
          id: user._id,
          name: user.name,
          email: user.email
        }}, process.env.TOKEN_SECRET);
        res.send({savedUser, token})

    } catch(err){
        res.status(400).send(err)
    }
    
});


router.post('/login', async (req, res) => {
    const { error } = loginValidation(req.body)
    if(error) return res.status(400).send(error.details[0].message)


    let user = await User.findOne({email: req.body.email});
    if (!user) return res.status(400).send('Invalid Email.')
  
    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) return res.status(400).send('Invalid Password.')
    const token = jwt.sign({user: {
        id: user._id,
        name: user.name,
        email: user.email
    }}, process.env.TOKEN_SECRET);
    res.send({user, token})
})


router.get('/all', async (request, response) => {
  console.log('coucou2')
    const users = await User.find()
    .populate({
        path: 'posts.all_post',
        model: 'User',
    });

    // const postId = users[0].posts[0]._id
    // const postFind = await Posts.findById(postId.toString())
    // response.send(postFind)
    response.send(users)
})

router.get('/all/post', (req, res, next) => {
    User.find()
    .select("name email")
    .populate('posts', 'name')
    .exec()
    .then(posts => {
      res.status(200).json({
        posts: posts.map(post => {
          return {
            _id: post._id,
            title: post.title,
            description: post.description,
            request: {
              type: "GET",
              url: "http://localhost:8000/api/posts/" + post._id
            }
          };
        })
      });
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
})

module.exports = router;




  