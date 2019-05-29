const axios = require('axios').default;

async function postToSlack(params) {
  return axios.post(process.env.WEBHOOK_URL, params);
}

module.exports = { postToSlack };
