const getLangsHtml = (languages) => {
  return Object.keys(languages).reduce((html, lang) => {
    html += `<tr><td>${lang}</td><td class="lang">${languages[lang]}</td></tr>`;
    return html;
  }, '');
};

const render = ({repos, username, badge, topLanguage, languages}) => {
  document.querySelector(`#${username} p`).innerHTML = `${username} <span class="badge">${badge}`;
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
  document.querySelector(`#${username} .data`).innerHTML = html + table;
};

const getStatus = (username) => {
  fetch(`status/${username}`)
    .then((res) => res.json())
    .then((data) => {
      const div = document.querySelector(`#${username} .data`);
      if (data.status == 'scheduled') {
        div.innerHTML = '<p>Processing</p>';
        return setTimeout(getStatus, 2000, username);
      }
      if (data.badge === 'none') {
        div.innerText = 'No user found';
        return;
      }
      render(data);
    });
};

const grade = () => {
  const username = document.querySelector('#username').value.trim();
  if (!username || document.querySelector(`#${username}`)) return;
  fetch(`grade/${username}`, {method: 'POST'})
    .then((res) => res.json())
    .then(({username}) => {
      const div = document.createElement('div');
      div.id = username;
      div.className = 'status';
      const heading = document.createElement('p');
      heading.innerText = username;
      heading.className = 'name';
      const data = document.createElement('div');
      const hr = document.createElement('hr');
      data.className = 'data';
      div.appendChild(heading);
      div.appendChild(hr);
      div.appendChild(data);
      document.querySelector('#statuses').appendChild(div);
      getStatus(username);
    });
};

const main = () => {
  const button = document.querySelector('#grade-button');
  button.addEventListener('click', grade);
};

window.onload = main;
