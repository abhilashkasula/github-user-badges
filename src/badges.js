const addBadge = (client, username) => {
  return new Promise((resolve, reject) => {
    const status = ['status', 'scheduled'];
    const receivedAt = ['receivedAt', new Date()];
    const name = ['username', username];
    const badge = ['badge', 'none'];
    const languages = ['languages', 'none'];
    const data = status.concat(receivedAt, name, badge, languages);
    client.hmset(username, data, (err, res) => {
      client.expire(username, 300, (err, res) => {
        resolve(username);
      });
    });
  });
};

const get = (client, username) => {
  return new Promise((resolve, reject) => {
    client.hgetall(username, (err, res) => {
      if (res) {
        resolve(res);
      }
      reject('No badge found');
    });
  });
};

const completedGrading = (client, username, badge, languages) => {
  return new Promise((resolve, reject) => {
    const status = ['status', 'completed'];
    const badgeDetail = ['badge', badge];
    const details = status.concat(badgeDetail, [
      'languages',
      JSON.stringify(languages),
    ]);
    client.hmset(username, details, (err, res) => {
      resolve(res);
    });
  });
};

module.exports = {addBadge, get, completedGrading};
