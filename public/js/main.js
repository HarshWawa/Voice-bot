function setupWebSocket() {
    const protocol = window.location.protocol === "https:" ? "wss" : "ws";
    ws = new WebSocket(`${protocol}://${window.location.host}/ws`);

    ws.onmessage = function(event) {
        const data = JSON.parse(event.data);
        console.log('Received:', data);
        if (data.type === 'greeting') {
            if (data.audio) {
                playAudio(data.audio, function() {
                    addMessage(data.text);
                });
            } else {
                addMessage(data.text);
            }
        } else if (data.type === 'response') {
            if (data.audio) {
                playAudio(data.audio, function() {
                    addMessage(data.text);
                });
            } else {
                addMessage(data.text);
            }
        }
    };
    ws.onclose = function() {
        addMessage('Connection closed. Please refresh the page.', false);
    };
}
