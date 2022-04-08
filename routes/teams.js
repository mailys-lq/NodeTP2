const router = require('express').Router();
const verify = require('../lib/verifyToken')
const ObjectID = require('mongoose').Types.ObjectId;
const Team = require('../models/Teams');
const User = require('../models/User');
const jwt = require('jsonwebtoken')


router.get('/', async (req, res) => {
      Team.find((err, content) => {
        !err ? res.send(content) : res.send(err)
    });
})

router.get('/:id', async (req, res) => {
    // const tokenFromFront = req.body.user; 
    // const current_user = jwt.verify(tokenFromFront, process.env.TOKEN_SECRET)
    // console.log(current_user)
    const id = req.params.id;

    Team.findById(id)
      .exec()
      .then(doc => {
        console.log("From database", doc);
        if (doc) {
          res.status(200).json({
              teams: doc,
              request: {
                  type: 'GET',
                  url: 'http://localhost:3000/api/teams'
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

})



router.post('/new', async (req, res) => {
  const tokenFromFront = req.body.user; 
//   const current_token = req.header('auth-token');
  const current_user = jwt.verify(tokenFromFront, process.env.TOKEN_SECRET)
  console.log(current_user)

  const newRecord = new Team({
      name: req.body.name,
      user_creator: current_user.user
  });

  const checkIfNameTeamExists = await Team.findOne({name: req.body.name});
  if(checkIfNameTeamExists) return res.status(400).send('Team already exists');

  const user = await User.findById(current_user.user.id)
  const savedTeam = await newRecord.save();
  user.teams = (savedTeam);
  await user.save()


  newRecord.save((err, content) => {
      !err ? res.send(content) : res.send('Team new record : ' + err)
  });
});


router.put('/join/:id', async (req, res) => {

  const tokenFromFront = req.body.user;
  // const current_token = req.header('auth-token');
  const current_user = jwt.verify(tokenFromFront, process.env.TOKEN_SECRET);

  const team = await Team.findById(req.params.id);

  let teamUsers = team.users;
  let teamUserCreator = team.user_creator;

  if (Object.values(teamUserCreator).indexOf(current_user.user.id) > -1) {
      return res.status(400).send('You\'re already the creator team !');
  }

  teamUsers.push(current_user.user.id);
  await Team.updateOne({ _id:req.params.id }, { users: teamUsers }, function(err, content) {
    !err ? res.send(content) : res.send('error : ' + err)   
  });

});

router.delete('/delete/:id', async (req, res) => {
    const tokenFromFront = req.body.user; 
    // const current_token = req.header('auth-token');
    const current_user = jwt.verify(tokenFromFront, process.env.TOKEN_SECRET);
    
    try{
        const team = await Team.findById(req.params.id);

        let teamUserCreator = team.user_creator;
      if (Object.values(teamUserCreator).indexOf(current_user.user.id) > -1) {
          await Team.findByIdAndRemove({ _id:req.params.id }, function(err, content) {
              !err ? res.send(content) : res.send('error : ' + err)   
          });
      } else {
          res.send('You\'re not team creator');
      }
    } catch(err) {
        return res.status(400).send("Team doesn't exist : " . err);
    }
});

router.post('/leave/:id', async (req, res) => {
    const tokenFromFront = req.body.user; 
    // const current_token = req.header('auth-token');
    const current_user = jwt.verify(tokenFromFront, process.env.TOKEN_SECRET);

    const team = await Team.findById(req.params.id);

    let teamUsers = team.users;
    let teamUserCreator = team.user_creator;

    if (Object.values(teamUserCreator).indexOf(current_user.user.id) > -1) {
        return res.status(400).send("You can't leave the team that you're the creator!");
    }

    // On récupère la position de l'id de l'utilisateur qui veut leave dans le tableau users
    let teamUsersIndex = teamUsers.indexOf(current_user.user.id);

    // Si on a trouvé quelque chose, on supprimer cet id du tableau
    if (teamUsersIndex !== -1) {
        teamUsers.splice(teamUsersIndex, 1);
    }

    // et on update...
    await Team.updateOne({ _id:req.params.id }, { users: teamUsers }, function(err, content) {
      !err ? res.send(content) : res.send('error : ' + err)   
    });
});


module.exports = router; 

