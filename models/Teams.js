const mongoose = require('mongoose');
const User = require('./User');

const teamSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        min: 2,
        max: 30
    },
    date: {
        type: Date,
        default: Date.now
    },
    user_creator: {
        type: Object, 
        required: true, 
        ref: "User" 
    },
    users: {
        all_users: { type: Array, required: false, ref: "Team" }
    }
    
})


module.exports = mongoose.model('Team', teamSchema);
