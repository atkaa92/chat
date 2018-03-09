const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const jwt = require('jsonwebtoken');
const passport = require('passport');

const Chat = mongoose.model('chats')
const User = mongoose.model('users')


router.get('/', passport.authenticate('jwt', {
    session: false
}), (req, res, next) => {
    User.find({
            _id: {
                $ne: req.user.id
            }
        })
        .then(users => {
            Chat.find()
                .populate('userFrom')
                .sort({
                    date: 'desc'
                })
                .then(chats => {
                    res.json({
                        chats: chats,
                        users: users,
                    })
                })
        });

})

module.exports = router;