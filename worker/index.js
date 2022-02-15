const keys = require("./keys");
const redis = require("redis");

const redisClient = redis.createClient({
  host: keys.redisHost,
  port: keys.redisPort,
  retry_strategy: () => 1000,
});

const sub = redisClient.duplicate();

function fib(index) {
  if (index < 2) return 1;
  return fib(index - 1) + fib(index - 2);
}


// every time a new value is inserted in redis
// insert an entry in a hash set by calculating the fibonacci for certain index
sub.on('message', (channel, message) => {
  console.log("New value for redis............+++++++++++++++");
  console.log("Message ...", message)
    redisClient.hset('values', message, fib(parseInt(message)))
})


// subscribe to insert on redis
sub.subscribe('insert')
