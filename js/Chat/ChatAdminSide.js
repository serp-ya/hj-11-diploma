'use strict';
const ws = new WebSocket(webSocketUrl);
const closedChatsList = document.getElementById('closedChats');
const chatsContainer = document.getElementById('chatsBlock');
const openChatsIds = [];

ws.addEventListener('open', () => {
  ws.setIsAdmin();
});

ws.addEventListener('message', function (wsEvent) {
  const incomingData = JSON.parse(wsEvent.data);
  const currentUserId = incomingData.currentId;

  if (incomingData.eventId === 'incomingMessage') {

    if (openChatsIds.indexOf(currentUserId) === -1) {
      const newChatBlock = addChatBlockByUserId(currentUserId);
      chatsContainer.appendChild(newChatBlock);
      openChatsIds.push(currentUserId);
    }

    acceptIncomingMessage(currentUserId, incomingData.message);
  }

  if (incomingData.eventId === 'closeСonnection') {
    const closedConnectionId = incomingData.targetId;
    const indexOfClosedConnection = openChatsIds.indexOf(closedConnectionId);

    if (indexOfClosedConnection !== -1) {
      const closedChatReport = document.createElement('li');
      closedChatReport.innerText = `Пользователь ID${closedConnectionId} закрыл чат`;
      closedChatsList.appendChild(closedChatReport);

      openChatsIds.splice(indexOfClosedConnection, 1);
      deleteChat(closedConnectionId);
    }
  }

  if (incomingData.eventId === 'startTyping' || incomingData.eventId === 'stopTyping') {
    isTyping(currentUserId, incomingData.eventId);
  }
});

function addChatBlockByUserId(userId) {
  const chatWindow = document.createElement('div');
  chatWindow.id = `chatId${userId}`;
  chatWindow.classList.add('row', 'chat-window', 'col-xs-4', 'col-md-4');

  const columnsWrapper = document.createElement('div');
  columnsWrapper.classList.add('col-xs-12', 'col-md-12');

  const panelDefault = document.createElement('div');
  panelDefault.classList.add('panel', 'panel-default');


  const panelHeading = document.createElement('div');
  panelHeading.classList.add('panel-heading', 'top-bar');

  const panelHeadingTitleContainer = document.createElement('div');
  panelHeadingTitleContainer.classList.add('col-md-8', 'col-xs-8');

  const panelHeadingTitle = document.createElement('h3');
  panelHeadingTitle.classList.add('panel-title');
  panelHeadingTitle.innerText = `Chat ID${userId}`;

  panelHeading
    .appendChild(panelHeadingTitleContainer)
    .appendChild(panelHeadingTitle);


  const panelBody = document.createElement('div');
  panelBody.classList.add('panel-body', 'msg_container_base');

  const messagesContainer = document.createElement('div');
  messagesContainer.classList.add('messages-container');

  panelBody
    .appendChild(messagesContainer);


  const typingBlock = document.createElement('div');
  typingBlock.classList.add('typing', 'disabled');

  const typingImage = document.createElement('img');
  typingImage.src = '../images/typing.gif';

  const typingMessage = document.createElement('span');
  typingMessage.innerText = 'Печатает...';

  typingBlock.appendChild(typingImage);
  typingBlock.appendChild(typingMessage);


  const panelFooter = document.createElement('div');
  panelFooter.classList.add('panel-footer');

  const inputGroup = document.createElement('div');
  inputGroup.classList.add('input-group');

  const chatInputField = document.createElement('input');
  chatInputField.type = 'text';
  chatInputField.placeholder = 'Введите сообщение...';
  chatInputField.classList.add('chat-input-field', 'form-control', 'input-sm', 'chat_input');

  const sendMessageWrapper = document.createElement('span');
  sendMessageWrapper.classList.add('input-group-btn', 'send-message-wrapper');

  const sendMessageBtn = document.createElement('button');
  sendMessageBtn.classList.add('btn', 'btn-primary', 'btn-sm');
  sendMessageBtn.innerText = 'Отправить';

  sendMessageWrapper.appendChild(sendMessageBtn);

  inputGroup.appendChild(chatInputField);
  inputGroup.appendChild(sendMessageWrapper);
  panelFooter.appendChild(inputGroup);


  panelDefault.appendChild(panelHeading);
  panelDefault.appendChild(panelBody);
  panelDefault.appendChild(typingBlock);
  panelDefault.appendChild(panelFooter);

  chatWindow
    .appendChild(columnsWrapper)
    .appendChild(panelDefault);

  chatWindow.addEventListener('click', chatEngine);
  chatWindow.addEventListener('keypress', chatEngine);
  chatWindow.addEventListener('input', chatEngine);

  return chatWindow;
}

function chatEngine(event) {
  const currentChat = event.currentTarget;
  const currentId = currentChat.id;
  const currentUserId = Number(currentId.replace('chatId', ''));
  const messagesContainer = currentChat.querySelector('.messages-container');
  const inputField = currentChat.querySelector('.chat-input-field');
  const currentInputText = inputField.value.trim();
  const sendBtn = currentChat.querySelector('.send-message-wrapper .btn');

  if (!currentInputText) {
    ws.stopTyping(currentUserId);
    return;
  }

  if (event.type === 'click' && event.target !== sendBtn) {
    return;
  } else if (event.type === 'keypress' && event.key !== "Enter") {
    return;
  }

  if (event.type === 'input') {
    ws.startTyping(currentUserId);

  } else {
    const outgoingData = {
      eventId: 'incomingMessage',
      message: currentInputText,
      targetId: currentUserId
    };

    messagesContainer.appendChild(
      makeMessageBlock(currentInputText, 'sent')
    );

    ws.sendStringify(outgoingData);
    ws.stopTyping(currentUserId);
    scrollToLastMessage(currentChat);
    inputField.value = null;
  }
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

function acceptIncomingMessage(userId, message) {
  const currentChat = document.getElementById(`chatId${userId}`);
  if (currentChat) {
    const currentChatMessagesContainer = currentChat.querySelector('.messages-container');
    currentChatMessagesContainer.appendChild(
      makeMessageBlock(message, 'receive')
    );

    scrollToLastMessage(currentChat);

  } else {
    throw new Error(`Have no User's ${userId} chat block!`);
  }
}

function scrollToLastMessage(chatBlock) {
  const chatMessagesContainer = chatBlock.querySelector('.messages-container');
  chatMessagesContainer.parentNode.scrollTop = chatMessagesContainer.clientHeight;
}

function deleteChat(chatId) {
  const currentChat = document.getElementById(`chatId${chatId}`);
  currentChat.remove();
}

function isTyping(userId, eventId) {
  const currentChat = document.getElementById(`chatId${userId}`);

  if (!currentChat) {
    return;
  }

  const typingBlock = currentChat.querySelector('.typing');

  if (eventId === 'startTyping') {
    typingBlock.classList.remove('disabled');
  } else {
    typingBlock.classList.add('disabled');
  }
}

window.addEventListener('beforeunload', () => {
  ws.close();
});
