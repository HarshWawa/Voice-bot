// WebSocket connection
let ws;
const chatMessages = document.getElementById('chat-messages');
const sendButton = document.getElementById('send-button');
const startBtn = document.getElementById('start-interview-btn');
const chatContainer = document.getElementById('chat-container');

let allowAudio = false;
let mediaRecorder;
let audioChunks = [];
let isRecording = false;

// Function to play audio and then call a callback
function playAudio(base64Audio, callback) {
    const audio = new Audio(`data:audio/wav;base64,${base64Audio}`);
    audio.onended = function() {
        if (callback) callback();
    };
    audio.play();
}

// Function to add message to chat
function addMessage(text, isUser = false) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${isUser ? 'user-message' : 'bot-message'}`;
    messageDiv.textContent = text;
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// WebSocket event handlers
function setupWebSocket() {
    ws = new WebSocket(`ws://${window.location.host}/ws`);
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

// Function to start recording
async function startRecording() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorder = new MediaRecorder(stream);
        audioChunks = [];
        mediaRecorder.ondataavailable = (event) => {
            audioChunks.push(event.data);
        };
        mediaRecorder.onstop = async () => {
            const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
            const formData = new FormData();
            formData.append('file', audioBlob, 'recording.wav');
            // Send the audio file to the server for transcription
            const response = await fetch('/transcribe', {
                method: 'POST',
                body: formData
            });
            const result = await response.json();
            if (result.text) {
                addMessage(result.text, true);
                ws.send(result.text);
            }
        };
        mediaRecorder.start();
        isRecording = true;
        sendButton.textContent = 'Stop Recording';
    } catch (err) {
        console.error('Error accessing microphone:', err);
    }
}

// Function to stop recording
function stopRecording() {
    if (mediaRecorder && isRecording) {
        mediaRecorder.stop();
        isRecording = false;
        sendButton.textContent = 'Record';
    }
}

// Event listeners
sendButton.addEventListener('click', function() {
    if (isRecording) {
        stopRecording();
    } else {
        startRecording();
    }
});

startBtn.addEventListener('click', function() {
    startBtn.style.display = 'none';
    chatContainer.style.display = 'block';
    allowAudio = true;
    setupWebSocket();
});
