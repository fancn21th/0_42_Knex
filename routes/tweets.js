const router = require('express').Router()

router
  .get('/tweets', (req, res, next) => {
      db('tweets')
        .where('user_id', req.user.id)
        .then(tweets => {
            res.send(tweets)
        }, next)
  })

module.exports = router
