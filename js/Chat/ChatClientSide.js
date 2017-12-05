'use strict';
const ws = new WebSocket(webSocketUrl);
const chatWindow = document.getElementById('chat_window');
const openChatBtn = document.querySelector('.chat-btn');
const closeChatBtn = document.querySelector('.close-chat-btn');

openChatBtn.addEventListener('click', showHideChat);
closeChatBtn.addEventListener('click', showHideChat);

function showHideChat(event) {
  const chatOpenClassName = 'chat-open';
  openChatBtn.classList.toggle(chatOpenClassName);
  chatWindow.classList.toggle(chatOpenClassName);
}

const messagesContainer = document.getElementById('message-container');
const inputMessageField = document.getElementById('chat-input-field');
const sendMessageBtn = document.getElementById('send-message-btn');

sendMessageBtn.addEventListener('click', sendMessage);
inputMessageField.addEventListener('keypress', sendMessage);
inputMessageField.addEventListener('input', sendIsTyping);

function sendMessage(event) {
  const currentMessageText = inputMessageField.value.trim();

  if (!currentMessageText.length) {
    return;
  }

  if (event.type === 'click' && event.target !== sendMessageBtn) {
    return;
  } else if (event.type === 'keypress' && event.key !== "Enter") {
    return;
  }

  addMessageToChat(
    makeMessageBlock(currentMessageText, 'sent')
  );

  ws.sendMessage(currentMessageText);
  ws.stopTyping();
  inputMessageField.value = null;
}

function makeMessageBlock(messageText, status) {
  if (!messageText || !status) {
    console.log('Invalid arguments');
    return;
  } else if (status !== 'sent' && status !== 'receive') {
    console.log('Status must be a "sent" or "receive"');
    return;
  }

  const container = document.createElement('div');
  container.classList.add('row', 'msg_container'); // 'base_receive' || base_sent

  const columnsBlock = document.createElement('div');
  columnsBlock.classList.add('col-xs-10', 'col-md-10');

  const messageBlock = document.createElement('div');
  messageBlock.classList.add('messages');

  const messageTextBlock = document.createElement('p');
  messageTextBlock.innerText = messageText;

  if (status === 'sent') {
    container.classList.add('base_sent');
    messageBlock.classList.add('msg_sent');

  } else if (status === 'receive') {
    container.classList.add('base_receive');
    messageBlock.classList.add('msg_receive');
  }

  container
    .appendChild(columnsBlock)
    .appendChild(messageBlock)
    .appendChild(messageTextBlock);

  return container;
}

function addMessageToChat(message) {
  messagesContainer.appendChild(message);
  messagesContainer.parentNode.scrollTop = messagesContainer.clientHeight;
}

function sendIsTyping(event) {
  const currentValue = event.currentTarget.value;

  if (currentValue) {
    ws.startTyping();
  } else {
    ws.stopTyping();
  }
}

ws.addEventListener('message', function (wsEvent) {
  const incomingData = JSON.parse(wsEvent.data);

  if (incomingData.eventId === 'incomingMessage') {
    addMessageToChat(
      makeMessageBlock(incomingData.message, 'receive')
    )
  }

  if (incomingData.eventId === 'startTyping' || incomingData.eventId === 'stopTyping') {
    isTyping(incomingData.eventId);
  }
});

const typingBlock = chatWindow.querySelector('.typing');

function isTyping(eventId) {
  if (eventId === 'startTyping') {
    typingBlock.classList.remove('disabled');
  } else {
    typingBlock.classList.add('disabled');
  }
}

window.addEventListener('beforeunload', () => {
  ws.close();
});
