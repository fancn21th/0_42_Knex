const router = require('express').Router()

router
  .get('/set/:username', (req, res) => {
      const { username } = req.params
      req.session.username = username
      if(username) {
          return res.render('session', {
              session: JSON.stringify(req.session)
          })
      }
      res.send(401)
  })

  module.exports = router
