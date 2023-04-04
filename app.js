require('dotenv').config();

const express = require('express');
const line = require('@line/bot-sdk');
// const { Configuration, OpenAIApi } = require('openai');

//openai instance
// const configuration = new Configuration({
//   apiKey: process.env.OPENAI_API_KEY,
// });
// const openai = new OpenAIApi(configuration);

// create LINE SDK config from env variables
const config = {
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.CHANNEL_SECRET,
};

// create LINE SDK client
const client = new line.Client(config);

const app = express();

app.post('/callback', line.middleware(config), (req, res) => {
  Promise.all(req.body.events.map(handleEvent))
    .then((result) => res.json(result))
    .catch((err) => {
      console.error(err);
      res.status(500).end();
    });
});

async function handleEvent(event) {
  if (event.type !== 'message' || event.message.type !== 'text') {
    return Promise.resolve(null);
  }

  const echo = {
    type: 'text',
    text: '已加入事件排程',
  };

  const userInfo = {
    type: 'text',
    text: event.source.userId,
  };

  const pushMessage = {
    type: 'text',
    text: '處理事情了喔!',
  };
  client.pushMessage([event.source.userId], [userInfo]);
  if (echo) {
    setTimeout(() => {
      client.pushMessage([event.source.userId], [pushMessage]);
    }, 10000);
    return client.replyMessage(event.replyToken, echo);
  }
}

// listen on port
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`listening on ${port}`);
});
