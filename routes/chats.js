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
                        // ioURI: ioURI
                    })
                })
        });
})
// router.post('/', ensureAuthenticaed, (req, res) => {
//     let errors = [];
//     if (!req.body.title) {
//         errors.push({ text: 'Please add a title' })
//     }
//     if (!req.body.details) {
//         errors.push({ text: 'Please add some details' })
//     }
//     if (errors.length > 0) {
//         res.render('ideas/add', {
//             errors: errors,
//             title: req.body.title,
//             details: req.body.details,
//         })
//     } else {
//         const newIdea = {
//             title: req.body.title,
//             details: req.body.details,
//             user: req.user.id
//         }
//         new Idea(newIdea)
//             .save()
//             .then(idea => {
//                 req.flash('success_msg', 'Video Idea added');
//                 res.redirect('/ideas');
//             })
//     }
// })

module.exports = router;