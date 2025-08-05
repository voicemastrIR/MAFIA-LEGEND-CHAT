# MAFIA-LEGEND-CHAT
const express = require('express');
const WebSocket = require('ws');
const http = require('http');
const { generateResponse } = require('./ai/chatbot');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// دیتابیس موقت
const users = new Map();
const messages = [];

wss.on('connection', (ws) => {
  const userId = Date.now().toString();

  ws.on('message', (data) => {
    const msg = JSON.parse(data);
    
    // ثبت کاربر
    if (msg.type === 'register') {
      users.set(userId, { 
        name: msg.name, 
        isAdmin: msg.isAdmin || false 
      });
      broadcastUsers();
      return;
    }

    // پردازش هوش مصنوعی
    const aiReply = generateResponse(msg.text);
    if (aiReply) {
      ws.send(JSON.stringify({ type: 'ai', text: aiReply }));
    }

    // ذخیره پیام
    messages.push({
      id: messages.length + 1,
      sender: userId,
      text: msg.text,
      timestamp: new Date()
    });
    broadcastMessages();
  });

  ws.on('close', () => {
    users.delete(userId);
    broadcastUsers();
  });
});

// توابع کمکی
function broadcastUsers() {
  wss.clients.forEach(client => {
    client.send(JSON.stringify({
      type: 'users',
      data: Array.from(users.values())
    }));
  });
}

function broadcastMessages() {
  wss.clients.forEach(client => {
    client.send(JSON.stringify({
      type: 'messages',
      data: messages.slice(-50)
    }));
  });
}

server.listen(3001, () => {
  console.log('سرور فعال در پورت 3001');
});
