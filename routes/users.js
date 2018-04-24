const router = require('express').Router()
const db = require('../db')

router
  .get('/users', (req, res, next) => {
      db('users').then(users => {
          res.render('users', { users })
      }, next)
  })
  .get('/users/:id', (req, res, next) => {
      const { id } = req.params
      db('users')
          .where('id', id)
          .first()
          .then(users => {
              if(!users){
                  return res.send(400)
              }
              res.render('user', users)
          }, next)
  })
  // .post('/users', (req, res, next) => {
  //     db('users')
  //         .insert(req.body)
  //         .then(userIds => {
  //             res.send(userIds)
  //         }, next)
  // })
  .put('/users/:id', (req, res, next) => {
      const { id } = req.params
      db('users')
          .where('id', id)
          .update(req.body)
          .then(result => {
              if(result === 0) {
                  return res.send(400)
              }
              res.send(200)
          }, next)
  })
  .delete('/users/:id', (req, res, next) => {
      const { id } = req.params
      db('users')
          .where('id', id)
          .delete()
          .then(result => {
              if(result === 0) {
                  return res.send(400)
              }
              res.send(200)
          }, next)
  })

module.exports = router
