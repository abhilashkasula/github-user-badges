const https = require('https');
const { grade } = require('./gradeUser');
const {GITHUB_TOKEN} = process.env;

const getOptions = () => ({
  host: 'api.github.com',
  path: '/users/__USER__/repos',
  headers: {
    'User-Agent': 'curl/7.64.1',
    authorization: `token ${GITHUB_TOKEN}`,
  },
});

const getRepos = (username) => {
  const options = getOptions();
  options.path = options.path.replace('__USER__', username);
  console.log(options, username);
  return new Promise((resolve, reject) => {
    https.get(options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => resolve(data));
    });
  });
};

const getLanguages = (repos) => {
  const options = {
    headers: {
      'User-Agent': 'curl/7.64.1',
      authorization: `token ${GITHUB_TOKEN}`,
    },
  };
  const promises = JSON.parse(repos).map((repo) => {
    return new Promise((resolve, reject) => {
      https.get(repo.languages_url, options, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => resolve(JSON.parse(data)))
      });
    });
  });

  return Promise.all(promises);
};

const main = (name) => {
  getRepos(name)
    .then(getLanguages)
    .then(grade)
    .then((badge) => console.log(badge));
};

main(process.argv[2]);
