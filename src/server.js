const express = require('express');
const redis = require('redis');
const badges = require('./badges');

const app = express();
const redisClient = redis.createClient({db: 2});

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

app.use(express.static('public'));

app.post('/grade/:username', (req, res) => {
  badges
    .get(redisClient, req.params.username)
    .then(() => res.json({username: req.params.username}))
    .catch(() => {
      badges.addBadge(redisClient, req.params.username).then((username) => {
        redisClient.lpush('badge_queue', username, () => {
          res.json({username});
        });
      });
    });
});

app.get('/status/:username', (req, res) => {
  badges.get(redisClient, req.params.username).then((job) => res.json(job));
});

app.listen(8000, () => console.log('listening at 8000..'));
