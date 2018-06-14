require('dotenv').config();
const bodyParser = require('body-parser');

const hostname = 'localhost';

const express = require('express')
const app = express()

app.use(bodyParser.json());

app.post('/', (req, res) => {
    const task = PerfRecord.build(
        {
            url: req.body.url,
            perfobj: req.body.perfobj,
            date: new Date()
        }
    )
    task.save().then(function () {
    })
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.send('Perf Data Saved');
})

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

// first define the model
const PerfRecord = sequelize.define('performance', {
    url: Sequelize.STRING,
    perfobj: Sequelize.JSON,
    date: Sequelize.TIME
})

// Test Connection
sequelize
    .authenticate()
    .then(() => {
        console.log('Connection has been established successfully.');
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });

app.listen(process.env.PORT, () => console.log('Example app listening on port 3000!'))