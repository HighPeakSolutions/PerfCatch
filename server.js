require('dotenv').config();
const http = require('http');

const hostname = 'localhost';
const port = 5050;

// Database Configuration
const Sequelize = require('sequelize');
const sequelize = new Sequelize(process.env.DBNAME, process.env.DBUSER, process.env.DBPASS, {
    host: process.env.DBHOST,
    dialect: 'postgres',
    operatorsAliases: false,

    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    },

});

// Test Connection
sequelize
    .authenticate()
    .then(() => {
        console.log('Connection has been established successfully.');
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });


// first define the model
const PerfRecord = sequelize.define('performance', {
    url: Sequelize.STRING,
    perfobj: Sequelize.JSON,
    date: Sequelize.TIME
})

const server = http.createServer((req, res) => {
    const task = PerfRecord.build(
        {
            url: 'testurl',
            perfobj: {},
            date: new Date()
        }
    )
    task.save().then(function () {
        console.log('here')
    })
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Hello Performance World\n');
});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});