const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//create schema
const ChatSchema = new Schema({
    message: {
        type: String,
        required: true
    },
    userFrom: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    },
    // userTo: {
    //     type: Schema.Types.ObjectId,
    //     ref: 'users',
    // },
    date: {
        type: Date,
        default: Date.now
    },
});

mongoose.model('chats', ChatSchema);