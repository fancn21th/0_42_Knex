const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const db = require('./db')
const session = require('express-session')
const passport = require('passport')
require('./passport')

express()
    .set("views", path.join(__dirname, 'views'))
    .set('view engine', 'hbs')
    .use(bodyParser.json())
    .use(bodyParser.urlencoded({ extended: false }))
    .use(session({
        secret: 'knex demo',
        resave: false,
        saveUninitialized: false
    }))
    .use(passport.initialize())
    .use(passport.session())

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

    .get('/', (req, res, next) => {
        res.render('home', {
            session: JSON.stringify(req.session),
            user: JSON.stringify(req.user),
            authenticated: req.isAuthenticated(),
        })
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