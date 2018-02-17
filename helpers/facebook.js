const axios = require('axios');

const url = 'https://graph.facebook.com/v2.6/me/messages';

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
// Some bugs :(
function showMenu(id) {
  const menu = ['Kargo ekle', 'Kargo Sil', 'Kargolarımı listele', 'geri'];

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
      id,
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
const asd = id =>
  callSendAPI({
    recipient: {
      id,
    },
    message: {
      attachment: {
        type: 'template',
        payload: {
          template_type: 'generic',
          elements: [
            {
              title: 'Daha fazla seçenek için kaydır',
              buttons: [
                {
                  type: 'postback',
                  title: 'Kargo ekle',
                  payload: 'ADD_CARGO',
                },
                {
                  type: 'postback',
                  title: 'Kargo çıkar',
                  payload: 'REMOVE_CARGO',
                },
                {
                  type: 'postback',
                  title: 'Kargolarım',
                  payload: 'LIST_CARGO',
                },
              ],
            },
          ],
        },
      },
    },
  });

function sendButton(user, title) {
  return callSendAPI({
    recipient: {
      id: user,
    },
    message: {
      attachment: {
        type: 'template',
        payload: {
          template_type: 'generic',
          elements: [
            {
              title,
              buttons: [
                {
                  type: 'postback',
                  title: 'Vazgeç',
                  payload: 'Cancel',
                },
              ],
            },
          ],
        },
      },
    },
  });
}

module.exports = {
  sendTextMessage,
  showMenu,
  sendButton,
  asd,
};
