require('dotenv').config();

const express = require('express');
const line = require('@line/bot-sdk');
const { convertToMilliseconds, validateInput } = require('./utils')

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
  const event = event.message.text.split('/')[1]
  if (time <= 0) {
    return client.replyMessage(event.replyToken, getMessage({state: false, errorReason: "時間過期，請設定未來的時間"}));
  }
  if (!!event) {
    return client.replyMessage(event.replyToken, getMessage({state: false, errorReason: "未設定事件名稱"}));
  }

  if (time > 0 && !!event) {
    // setTimeout(() => {
    //   client.pushMessage(event.source.userId, [pushMessage]);
    // }, time);
    return client.replyMessage(event.replyToken, getMessage({state: true}));
  }

}

const getMessage = ({state, errorReason}) => {
  const successMsg = {
    type: 'text',
    text: "成功！！ \n 已經紀錄事件，時間到時將為您發送提醒通知",
  };
  const errorMsg = {
    type: 'text',
    text: `事件記錄失敗。 \n 失敗原因：${errorReason} \n 嘗試以此範例格式輸入：2023-2-20-22-10-10/範例事件`,
  }
  return state ? successMsg : errorMsg
}

// listen on port
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`listening on ${port}`);
});




