const keys = require("./keys");

// Express App Setup

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express()

app.use(cors());
app.use(bodyParser.json());

// create and connect to postgres

const { Pool } = require("pg");

const pgClient = new Pool({
    user: keys.pgUser,
    host: keys.phHost,
    database: keys.pgDatabase,
    password: keys.pgPassword,
    port: keys.pgPort
})

pgClient.on('error', () => console.log("Lost PG connection"));

pgClient.on("connect", (client) => {
    client
      .query("CREATE TABLE IF NOT EXISTS values (number INT)")
      .catch((err) => console.error(err));
  });

// Redis Client Setup

const redis = require("redis");
const redisClient = redis.createClient({
    host: keys.redisHost,
    port: keys.redisPort,
    retry_strategy: () => 1000
});

const redisPublisher = redisClient.duplicate()

// express routes handlers

app.get('/', (req, res) => {
    res.send('Hi');
})

app.get('/values/all', async (req,res) => {
    const values = await pgClient.query('SELECT number FROM values');
    res.send(values.rows);
})

app.get('/values/current', async (req, res) => {
    // hgetall -> get all values from a hash
    redisClient.hgetall('values', (err, values) => {
        res.send(values);
    })
});

app.post('/values', (req, res) => {
    const index = req.body.index;

    if (parseInt(index) > 40) {
        return res.status(422).send('Index too high');
    }
    /*
        The worker will process and calculate the fibonacci and it will save the value in redis.
        Calculating fibonacci is not work of this server
     */
    redisClient.hset('values', index, 'Nothing yet!')
    redisPublisher.publish('insert', index); 
    pgClient.query('INSERT INTO values(number) VALUES($1)', [index]);

    res.send({working: true});
});

app.listen(5000, err => {
    console.log('Listening');
})