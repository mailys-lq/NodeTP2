const mongoose = require('mongoose');


const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        min: 5,
        max: 25
    },
    description: {
        type: String,
        required: true,
        min: 15,
        max: 1500
    },
    author: {
        type: String,
    },
    date: {
        type: Date,
        default: Date.now,
    },
    user: {
        all_user: {type: mongoose.Schema.Types.ObjectId, required: false, ref: "User"}
    },
    user_info: {

    }
});

module.exports = mongoose.model('Post', postSchema);

