const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const db = require('./db')
const session = require('express-session')
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
    .use(require('./routers/auth'))
    .use(require('./routers/tweets'))
    .use(require('./routers/users'))
    .get('/', (req, res, next) => {
        res.render('home', {
            session: JSON.stringify(req.session),
            user: JSON.stringify(req.user),
            authenticated: req.isAuthenticated(),
        })
    })
    .listen(3000)
