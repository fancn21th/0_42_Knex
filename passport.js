const bcrypt = require('bcrypt-nodejs')
const passport = require('passport')
const LocalStrategy =  require('passport-local').Strategy
const GitHubStrategy = require('passport-github').Strategy
const db = require('./db')
const password = require('./config/password')

passport.use(new LocalStrategy(authenticate))
passport.use('local-register', new LocalStrategy({ passReqToCallback: true }, register))
passport.use(new GitHubStrategy({
    clientID: password.clientID,
    clientSecret: password.clientSecret,
    callbackURL: 'http://localhost:3000/auth/github/callback'
  },
  function(accessToken, refreshToken, profile, done) {
    db('users')
      .where('oauth_provider', 'github')
      .where('oauth_id', profile.username)
      .first()
      .then(user => {
        if(user) {
          return done(null, user)
        }
        const newUser = {
          oauth_provider: 'github',
          oauth_id: profile.username,
        }
        return db('users')
          .insert(newUser)
          .then(userIds => {
            newUser.id = userIds[0]
            done(null, newUser)
          })
      }, done)
  }
))

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

function register(req, email, password, done) {
    db('users')
        .where('email', email)
        .first()
        .then(user => {
            if(user) {
                return done(null, false, {
                    message: 'a account with that email has already been created '
                })
            }
            if(password !== req.body.password2) {
                return done(null, false, {
                    message: 'password do not match'
                })
            }
            const newUser = {
                username: req.body.name,
                email: email,
                password: bcrypt.hashSync(password)
            }
            db('users')
                .insert(newUser)
                .then(userIds => {
                    newUser.id = userIds[0]
                    done(null, newUser)
                })
        })
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
