const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const router = express.Router();
const { 
    ensureAuthenticaed
} = require('../helpers/auth')

const Chat = mongoose.model('chats')
const User = mongoose.model('users')
const db = require('../config/database');


// router.post('/login', (req, res, next) => {
//     passport.authenticate('local', {
//         successRedirect: '/chats',
//         failureRedirect: '/users/login',
//         failureFlash: true
//     })(req, res, next);
// })

router.post('/login', (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    User.findOne({email: email}, (err, user) => {
        if (err) throw err;
        if (!user) {
            return res.json({
                success: false,
                msg: 'User not found'
            })
        }
        bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) throw err;
            if (isMatch) {
                const token = jwt.sign(user.toJSON(), db.secret, {
                    expiresIn: 604800
                });
                res.json({
                    success: true,
                    token: 'JWT ' + token,
                    user: {
                        id: user._id,
                        name: user.name,
                        email: user.email,
                    },
                    msg: 'You are loged in'
                })
            } else {
                return res.json({
                    success: false,
                    msg: 'Wrong Password'
                })
            }
        })
    })
})

router.post('/register', (req, res) => {
    if (req.body.password != req.body.password2) {
        return res.json({
            success: false,
            msg: 'Passwords do not match'
        });
    }
    if (req.body.password.length < 4) {
        return res.json({
            success: false,
            msg: 'Password mast be at least 4 characters'
        });
    }
    User.findOne({
            email: req.body.email
        })
        .then(user => {
            if (user) {
                return res.json({
                    success: false,
                    msg: 'Email already taken'
                });
            } else {
                const newUser = new User({
                    name: req.body.name,
                    email: req.body.email,
                    password: req.body.password
                })
                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if (err) throw err;
                        newUser.password = hash;
                        newUser.save()
                            .then(user => {
                                res.json({
                                    success: true,
                                    msg: 'You are registered and can log  in now'
                                });
                            })
                            .catch(err => {
                                res.json({
                                    success: false,
                                    msg: 'Server error'
                                });
                            })
                    })
                })
            }
        })
})

router.get('/profile', passport.authenticate('jwt', {
    session: false
}), (req, res, next) => {
    res.json({
        user: req.user
    });
})
module.exports = router;