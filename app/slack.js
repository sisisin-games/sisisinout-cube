const dedent = require('dedent');
const axios = require('axios').default;

async function postToSlack(params) {
  return axios.post(process.env.WEBHOOK_URL, params);
}

async function postScore(score) {
  const time = getTimeText(score.time);
  return postToSlack({
    icon_emoji: ':new:',
    username: 'sisisinout-cube',
    text: dedent`
      ${score.name} さんが ${time} でクリアしました <https://sisisinout-cube.glitch.me/|sisisinout-cube>
    `,
  });
}

function getTimeText(time) {
  if (!time) {
    return '';
  }
  function pad(n, val) {
    return String(val).padStart(n, '0');
  }
  const ms = time % 1000;
  const seconds = (time / 1000) % 60 | 0;
  const minutes = (time / 1000 / 60) % 60 | 0;
  const hours = (time / 1000 / 60 / 60) | 0;
  let res = '';
  if (hours) {
    res += `${pad(2, hours)}時間`;
  }
  if (res || minutes) {
    res += `${pad(2, minutes)}分`;
  }
  if (res || seconds) {
    res += `${pad(2, seconds)}秒`;
  }
  res += pad(3, ms);
  return res;
}

module.exports = { postToSlack, postScore };
