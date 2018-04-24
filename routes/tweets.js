const router = require('express').Router()
const db = require('../db')

function loginRequired(req, res, next) {
  if (!req.isAuthenticated()) {
    return res.redirect('/login')
  }
  next()
}

function adminRequired(req, res, next) {
  if (!req.user.is_admin) {
    return res.render('403')
  }
  next()
}

router
  .get('/tweets', loginRequired, (req, res, next) => {
    db('tweets')
      .where('user_id', req.user.id)
      .then(tweets => {
        res.render('tweets', {
          tweets
        })
      }, next)
  })
  .get('/allTweets', loginRequired, adminRequired, (req, res, next) => {
    db('tweets')
      .then(tweets => {
        res.render('tweets', {
          tweets
        })
      }, next)
  })

module.exports = router
