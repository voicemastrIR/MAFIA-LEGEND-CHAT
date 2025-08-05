const ws = new WebSocket('ws://localhost:3001');

ws.onopen = () => {
    const name = prompt("نام کاربری خود را وارد کنید:");
    ws.send(JSON.stringify({
        type: 'register',
        name: name
    }));
};

ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    const chatBox = document.getElementById('chat-box');
    
    if (data.type === 'messages') {
        data.data.forEach(msg => {
            chatBox.innerHTML += `<div><strong>${msg.sender}:</strong> ${msg.text}</div>`;
        });
    }
    chatBox.scrollTop = chatBox.scrollHeight;
};

function sendMessage() {
    const input = document.getElementById('message-input');
    ws.send(JSON.stringify({
        type: 'message',
        text: input.value
    }));
    input.value = '';
}
