const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const { ensureAuthenticaed } = require('../helpers/auth')

const Chat = mongoose.model('chats')
const User = mongoose.model('users')

//routes
router.get('/', ensureAuthenticaed, (req, res) => {
    User.find({ _id: { $ne: req.user.id } })
        .then(users => {
            Chat.find()
                .populate('userFrom')
                .sort({ date: 'desc' })
                .then(chats => {
                    res.render('chats/index', {
                        chats: chats,
                        users: users,
                    })
                })
        });
})

module.exports = router;