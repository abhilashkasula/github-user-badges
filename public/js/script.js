const getLangsHtml = (languages) => {
  return Object.keys(languages).reduce((html, lang) => {
    html += `<tr><td>${lang}</td><td class="lang">${languages[lang]}</td></tr>`;
    return html;
  }, '');
};

const render = ({repos, username, badge, topLanguage, languages}) => {
  const name = `<p class="name">${username} <span class="badge">${badge}</span></p>`;
  const html = `<table class="info">
  <tr>
    <td>Total Public Repos</td>
    <td>:  ${repos}</td>
  </tr>
  <tr>
    <td>Language used in most repos</td>
    <td>:  ${topLanguage}</td>
  </tr>
  </table>`;
  const table = `<table class="languages">
    <tr>
      <th>Language</th>
      <th>Number of repos</th>
    </tr>
    ${getLangsHtml(JSON.parse(languages))}
  </table>`;
  document.querySelector(`#${username}`).innerHTML = name + html + table;
};

const getStatus = (username) => {
  fetch(`status/${username}`)
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      const div = document.querySelector(`#${username}`);
      if (data.status == 'scheduled') {
        div.innerText = 'Processing';
        return setTimeout(getStatus, 2000, username);
      }
      if(data.badge === 'none') {
        div.innerText = 'No user found';
        return;
      }
      render(data);
    });
};

const grade = () => {
  document.querySelector('#statuses').innerHTML = '';
  const username = document.querySelector('#username').value.trim();
  if (!username) return;
  fetch(`grade/${username}`, {method: 'POST'})
    .then((res) => res.json())
    .then(({username}) => {
      const div = document.createElement('div');
      div.id = username;
      document.querySelector('#statuses').appendChild(div);
      getStatus(username);
    });
};

const main = () => {
  const button = document.querySelector('#grade-button');
  button.addEventListener('click', grade);
};

window.onload = main;
