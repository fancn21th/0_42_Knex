const router = require('express').Router()

router.
  .get('/tweets', (req, res, next) => {
      db('tweets').then(tweets => {
          res.send(tweets)
      }, next)
  })
