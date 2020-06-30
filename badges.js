const getId = (client) => {
  return new Promise((resolve, reject) => {
    client.incr('badges_curr_id', (err, res) => {
      resolve(res);
    });
  });
};

const createBadge = (client, id, username) => {
  return new Promise((resolve, reject) => {
    const status = ['status', 'scheduled'];
    const receivedAt = ['receivedAt', new Date()];
    const name = ['username', username];
    const badge = ['badge', 'none'];
    const languages = ['languages', 'none'];
    const data = status.concat(receivedAt, name, badge, languages);
    client.hmset(`user_badge_${id}`, data, (err, res) => {
      resolve(id);
    });
  });
};

const addBadge = (client, username) => {
  console.log(username);
  return getId(client).then((id) => createBadge(client, id, username));
};

const get = (client, id) => {
  return new Promise((resolve, reject) => {
    client.hgetall(`user_badge_${id}`, (err, res) => {
      resolve(res);
    });
  });
};

const completedGrading = (client, id, badge, languages) => {
  return new Promise((resolve, reject) => {
    const status = ['status', 'completed'];
    const badgeDetail = ['badge', badge];
    const details = status.concat(badgeDetail, [
      'languages',
      JSON.stringify(languages),
    ]);
    client.hmset(`user_badge_${id}`, details, (err, res) => {
      resolve(res);
    });
  });
};

module.exports = {addBadge, get, completedGrading};
