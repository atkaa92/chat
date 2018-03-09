// const LocalStrategy = require('passport-local').Strategy;
// const mongoose = require('mongoose');
// const bcrypt = require('bcryptjs');

// //load modals
// const User = mongoose.model('users')

// module.exports = function (passport) {
// 	passport.use(new LocalStrategy({
// 		usernameField: 'email'
// 	}, (email, password, done) => {
// 		User.findOne({
// 			email: email
// 		}).then(user => {
// 			if (!user) {
// 				return done(null, false, { message: 'No user found' })
// 			}
// 			bcrypt.compare(password, user.password, (err, isMatch) => {
// 				if (err) throw err;
// 				if (isMatch) {
// 					return done(null, user);
// 				} else {
// 					return done(null, false, { message: 'Password incorect' })
// 				}
// 			})
// 		})
// 	}))
// 	passport.serializeUser(function (user, done) {
// 		done(null, user.id);
// 	});

// 	passport.deserializeUser(function (id, done) {
// 		User.findById(id, function (err, user) {
// 			done(err, user);
// 		});
// 	});
// }

const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const db = require('../config/database');
const User = require('../models/User');

module.exports = function (passport) {
    let opts = {};
    opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme('jwt');
    opts.secretOrKey = db.secret;
    passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
        User.getUserById(jwt_payload._id, (err, user) => {
            if (err) {
                return done(err, false)
            }
            if (user) { 
                return done(null, user)
            }
            if (!user) {
                return done(null, false)
            }
        })
    }))
}