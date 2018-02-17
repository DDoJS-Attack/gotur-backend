const axios = require('axios');

const url = 'https://graph.facebook.com/v2.6/me/messages';
const menu = ['Kargo ekle', 'Kargo Sil', 'Kargolarımı listele'];

function callSendAPI(messageData) {
  return axios
    .post(`${url}?access_token=${process.env.MESSENGER_ACCESS_TOKEN}`, messageData)
    .then(res => res.data)
    .catch(err => err);
}

function sendTextMessage(recipientId, messageText) {
  const messageData = {
    recipient: {
      id: recipientId,
    },
    message: {
      text: messageText,
      metadata: 'DEVELOPER_DEFINED_METADATA',
    },
  };

  return callSendAPI(messageData);
}
function showMenu(user) {
  const buttonDiv = { title: 'Hosgeldiniz', buttons: [] };
  const elements = [];
  for (let i = 0; i < menu; i++) {
    buttonDiv.buttons.push({
      type: 'postback',
      title: menu[i],
      payload: menu[i],
    });
    if (i % 3 === 2 && i !== menu.length - 1) {
      const toPush = { ...buttonDiv };
      elements.push(toPush);
      buttonDiv.buttons = [];
    }
  }
  elements.push(buttonDiv);
  const payload = {
    recipient: {
      id: user,
    },
    message: {
      attachment: {
        type: 'template',
        payload: {
          template_type: 'generic',
          elements,
        },
      },
    },
  };
  return callSendAPI(payload);
}
module.exports = { sendTextMessage, showMenu };
