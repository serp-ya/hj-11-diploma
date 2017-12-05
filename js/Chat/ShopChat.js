'use strict';
WebSocket.prototype.sendStringify = function(data) {
  try {
    this.send(JSON.stringify(data));
    return true;

  } catch (error) {
    console.error(error);
    return false;
  }
};

WebSocket.prototype.setIsAdmin = function () {
  const dataToSent = {
    eventId: 'setIsAdmin',
    setIsAdmin: true
  };

  this.sendStringify(dataToSent);
};

WebSocket.prototype.sendMessage = function (message, targetId) {
  const dataToSent = {
    eventId: 'newMessage',
    message: message
  };

  if (typeof targetId === 'number') {
    dataToSent.targetId = targetId;
  }

  this.sendStringify(dataToSent);
};

WebSocket.prototype.startTyping = function (targetId) {
  const dataToSent = {
    eventId: 'startTyping'
  };

  if (targetId) {
    dataToSent.targetId = targetId;
  }

  this.sendStringify(dataToSent);
};

WebSocket.prototype.stopTyping = function (targetId) {
  const dataToSent = {
    eventId: 'stopTyping'
  };

  if (targetId) {
    dataToSent.targetId = targetId;
  }

  this.sendStringify(dataToSent);
};