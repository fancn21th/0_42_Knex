const knex = require('knex')

const db = knex({
    client: 'mysql',
    // connection: {
    //     host: '127.0.0.1',
    //     user: 'root',
    //     database: 'test',
    //     port: '3307'
    // },
    connection: {
        host: '127.0.0.1',
        user: 'root',
        password: 'fyj805YWF!',
        database: 'test',
        port: '3306'
    }
})

module.exports = db