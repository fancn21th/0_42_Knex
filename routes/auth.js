const router = require('express').Router()
const passport = require('passport')

router
  .get('/login', (req, res, next) => {
    res.render('login')
  })
  .post('/login', passport.authenticate('local', {
    successRedirect: '/tweets',
    failureRedirect: '/login'
  }))
  .get('/logout', (req, res) => {
    req.session.destroy(err => {
      res.redirect('/login')
    })
  })
  .get('/signup', (req, res, next) => {
    res.render('signup')
  })
  .post('/signup', passport.authenticate('local-register', {
    successRedirect: '/tweets',
    failureRedirect: '/signup'
  }))
  .get('/auth/github',
    passport.authenticate('github', { scope: [ 'user:email' ] }))
  .get('/auth/github/callback',
    passport.authenticate('github', { failureRedirect: '/login' }),
    function (req, res) {
      // Successful authentication, redirect home.
      res.redirect('/tweets')
    })

module.exports = router
