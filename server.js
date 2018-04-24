const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
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
    .use(require('./routes/auth'))
    .use(require('./routes/tweets'))
    .use(require('./routes/users'))
    .get('/', (req, res, next) => {
        res.render('home', {
            session: JSON.stringify(req.session),
            user: JSON.stringify(req.user),
            authenticated: req.isAuthenticated(),
        })
    })
    .listen(3000)
