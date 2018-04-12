const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const knex = require('knex')

const db = knex({
    client: 'mysql',
    connection: {
        host: '127.0.0.1',
        user: 'root',
        database: 'test',
        port: '3307'
    }
})

express()
    .use(bodyParser.json())
    .set("views", path.join(__dirname, 'views'))
    .set('view engine', 'hbs')
    .get('/', (req, res, next) => {
        res.render('home')
    })


    .get('/tweets', (req, res, next) => {
        db('tweets').then(tweets => {
            res.send(tweets)
        }, next)
    })


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
    .post('/users', (req, res, next) => {
        db('users')
            .insert(req.body)
            .then(userIds => {
                res.send(userIds)
            }, next)
    })
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
    .listen(3000)