const router = require('express').Router()
const passport = require('passport')

router
  .get('/login', (req, res, next) => {
      res.render('login')
  })
  .post('/login', passport.authenticate('local', {
      successRedirect: '/',
      failureRedirect: '/login'
  }))
  .get('/logout', (req, res) => {
      req.session.destroy( err => {
          res.redirect('/login')
      })
  })
  .get('/signup', (req, res, next) => {
      res.render('signup')
  })
  .post('/signup', passport.authenticate('local-register', {
      successRedirect: '/',
      failureRedirect: '/signup'
  }))

  module.exports = router
