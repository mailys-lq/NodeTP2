const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        min: 2,
        max: 30
    },
    email: {
        type: String,
        required: true,
        min: 5,
        max: 40
    },
    password: {
        type: String,
        required: true,
        min: 6,
        max: 30
    },
    date: {
        type: Date,
        default: Date.now
    },
    posts: [
        {
            all_post: { type: mongoose.Types.ObjectId, required: false, ref: "Post" }
        }  
    ],
    teams: [
        {
            all_team: { type: mongoose.Types.ObjectId, required: false, ref: "Team" }
        }  
    ],
    
})


module.exports = mongoose.model('User', userSchema);

