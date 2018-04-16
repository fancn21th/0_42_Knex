const bcrypt = require('bcrypt-nodejs')
const passport = require('passport')
const LocalStrategy =  require('passport-local').Strategy
const db = require('./db')

passport.use(new LocalStrategy(authenticate))

function authenticate(email, password, done) {
    db('users')
        .where('email', email)
        .first()
        .then(user => {
            if(!user || !bcrypt.compareSync(password, user.password)) {
                return done(null, false, {
                    message: 'invalid user and password combination'
                })
            }
            done(null, user)
        }, done)
}

passport.serializeUser(function (user, done) {
    done(null, user.id)
})

passport.deserializeUser(function (id, done) {
    db('users')
        .where('id', id)
        .first()
        .then(user => {
            done(null, user)
        }, done)
})

module.exports = passport