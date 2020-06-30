const express = require('express');
const redis = require('redis');
const badges = require('./badges');

const app = express();
const redisClient = redis.createClient({db: 2});

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

app.post('/grade/:username', (req, res) => {
  badges.addBadge(redisClient, req.params.username).then((id) => {
    redisClient.lpush('badge_queue', id, () => {
      res.json({id});
    });
  });
});

app.listen(8000, () => console.log('listening at 8000..'));
