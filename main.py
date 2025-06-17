from fastapi import FastAPI, Request, Form, WebSocket, UploadFile, File
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
import uvicorn
import os
import requests
import base64
from InterviewResponse import get_Response
import tempfile
from groq import Groq

from dotenv import load_dotenv
load_dotenv()

app = FastAPI()

# app.mount("/static", StaticFiles(directory="static"), name="static")
templates = Jinja2Templates(directory="templates")

GROQ_API_KEY = os.environ.get("GROQ_API_KEY")

def generate_speech(text):
    url = "https://api.groq.com/openai/v1/audio/speech"
    headers = {
        "Authorization": f"Bearer {GROQ_API_KEY}",
        "Content-Type": "application/json"
    }
    payload = {
        "model": "playai-tts",
        "voice": "Fritz-PlayAI",
        "input": text,
        "response_format": "wav"
    }
    response = requests.post(url, headers=headers, json=payload)

    if response.status_code == 200:
        return base64.b64encode(response.content).decode()
    else:
        print(f"Groq API error: {response.status_code}")
        print(f"Groq API response: {response.text}")
        return None

@app.get("/", response_class=HTMLResponse)
async def home(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()

    # Just greet — don't call the LLM
    greeting_text = "Hi my name is harsh. Hope you are doing well"
    greeting_audio = generate_speech(greeting_text)

    await websocket.send_json({
        "type": "greeting",
        "text": greeting_text,
        "audio": greeting_audio
    })

    while True:
        data = await websocket.receive_text()
        bot_reply = get_Response(data)
        bot_audio = generate_speech(bot_reply)
        await websocket.send_json({
            "type": "response",
            "text": bot_reply,
            "audio": bot_audio
        })

@app.post("/transcribe")
async def transcribe_audio(file: UploadFile = File(...)):
    # Save the uploaded file temporarily
    with tempfile.NamedTemporaryFile(delete=False, suffix=".wav") as temp_file:
        content = await file.read()
        temp_file.write(content)
        temp_path = temp_file.name

    # Transcribe the audio using Groq API
    client = Groq(api_key=GROQ_API_KEY)
    response_text = ""
    try:
        with open(temp_path, "rb") as f:
            transcription = client.audio.transcriptions.create(
                file=(os.path.basename(temp_path), f.read()),
                model="distil-whisper-large-v3-en",
                response_format="verbose_json",
                language="en",
                temperature=0.0
            )
            response_text = transcription.text if transcription else ""
    except Exception as e:
        print(f"Transcription error: {e}")
    finally:
        os.unlink(temp_path)  # Clean up the temporary file

    return {"text": response_text}

# if __name__ == "__main__":
#     uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
