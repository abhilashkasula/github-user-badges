const https = require('https');
const {GITHUB_TOKEN} = process.env;

const options = {
  host: 'api.github.com',
  path: '/users/abhilashkasula/repos',
  headers: {
    'User-Agent': 'curl/7.64.1',
    authorization: `${GITHUB_TOKEN}`,
  },
};

https.get(options, (res) => {
  let data = '';
  res.on('data', (chunk) => (data += chunk));
  res.on('end', () => console.log(data));
});
