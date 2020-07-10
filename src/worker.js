const https = require('https');
const {grade} = require('./gradeUser');
const badges = require('./badges');
const redis = require('redis');
const {GITHUB_TOKEN} = process.env;

const redisClient = redis.createClient({db: 2});

const getHeaders = () => ({
  'User-Agent': 'curl/7.64.1',
  authorization: `token ${GITHUB_TOKEN}`,
});

const getOptions = (path) => ({
  host: 'api.github.com',
  path,
  headers: getHeaders(),
});

const getRepos = ({username}) => {
  const options = getOptions(`/users/${username}/repos`);
  return new Promise((resolve, reject) => {
    https.get(options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => resolve(data));
    });
  });
};

const getLanguages = (repos) => {
  const options = {headers: getHeaders()};
  const promises = JSON.parse(repos).map((repo) => {
    return new Promise((resolve, reject) => {
      https.get(repo.languages_url, options, (res) => {
        let data = '';
        res.on('data', (chunk) => (data += chunk));
        res.on('end', () => resolve(JSON.parse(data)));
      });
    });
  });

  return Promise.all(promises);
};

const getJob = () => {
  return new Promise((resolve, reject) => {
    redisClient.brpop('badge_queue', 2, (err, res) => {
      if (res) {
        return resolve(res[1]);
      }
      reject('no job');
    });
  });
};

const catchNotFound = (username) => {
  const data = {
    badge: 'none',
    languages: {},
    topLanguage: 'none',
    repos: 0,
  };
  badges.completedGrading(redisClient, username, data).then(() => loop());
};

const loop = () => {
  getJob()
    .then((username) => {
      badges
        .get(redisClient, username)
        .then(getRepos)
        .then(getLanguages)
        .then(grade)
        .then((languages) =>
          badges.completedGrading(redisClient, username, languages)
        )
        .then(() => console.log('Finished job', username))
        .then(loop)
        .catch(() => catchNotFound(username));
    })
    .catch(() => loop());
};

loop();
