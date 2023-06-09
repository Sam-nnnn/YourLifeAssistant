require('dotenv').config();

const express = require('express');
const line = require('@line/bot-sdk');
const { convertToMilliseconds, validateInput, getMessage } = require('./utils')

const config = {
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.CHANNEL_SECRET,
};
 
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
 
  const isValid = validateInput(event.message.text)
  if (isValid.state === false) {
    return client.replyMessage(event.replyToken, getMessage({state: false, errorReason: isValid.message}));
  }
 
  const time = convertToMilliseconds(event.message.text.split('/')[0])
  const eventName = event.message.text.split('/')[1]
  if (time <= 0) {
    return client.replyMessage(event.replyToken, getMessage({state: false, errorReason: "時間過期，請設定未來的時間"}));
  }
  if (!eventName) {
    return client.replyMessage(event.replyToken, getMessage({state: false, errorReason: "未設定事件名稱"}));
  }
 
  if (time > 0 && !!eventName) {
    setTimeout(() => {
      client.pushMessage(event.source.userId, [{
        type: 'text',
        text: `您設定的提醒時間已到。 \n\n事件名稱：${eventName}。 \n\n不要忘記了唷`,
      }]);
    }, time);
    return client.replyMessage(event.replyToken, getMessage({state: true}));
  }
  return client.replyMessage(event.replyToken, getMessage({state: false, errorReason: '抱歉，未知錯誤，請重新嘗試。'}));
}


// listen on port
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`listening on ${port}`);
});




