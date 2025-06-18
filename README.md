# 🎙️ AI Interview Voice Bot

An interactive voice-based interview assistant built using **FastAPI**, **LangChain**, **Groq LLM + TTS**, and **WebSockets**. It responds to your questions with audio and text — simulating a real-time interview with *Harsh Wawa*, based on their actual CV.

---
**Deploy Link**
   ```
   https://voice-bot-5u0c.onrender.com/
   ```

## 🚀 Features

- 🎤 **Voice Input**: Speak your interview question, it gets transcribed and processed.
- 🧠 **LLM Response**: Replies are generated using Groq's LLaMA 3.1 via LangChain.
- 🔊 **TTS Audio Output**: Each response is returned with synthesized audio using Groq's PlayAI.
- 💬 **WebSocket-powered Chat**: Real-time, interactive messaging.
- 🧾 **Context-Aware Replies**: Responses are tailored based on a predefined CV/persona.

---

## 🛠️ Tech Stack

- **Backend**: FastAPI, WebSockets, Groq API (LLM + TTS)
- **Frontend**: HTML, CSS, JavaScript
- **Templating**: Jinja2
- **LLM Orchestration**: LangChain
- **Transcription**: Groq Whisper
- **Deployment-ready**: Uvicorn + FastAPI

---

## 📁 Project Structure

```
.
├── main.py                  # FastAPI server
├── InterviewResponse.py     # LangChain logic (LLM + prompt)
├── templates/
│   └── index.html           # Frontend HTML template
├── public/
│   ├── js/
│   │   └── main.js          # Frontend JavaScript
│   └── css/
│       └── style.css        # Stylesheet
├── .env                     # API keys and environment config
├── requirements.txt         # Python dependencies
└── README.md                # This file
```

---

## ⚙️ Setup Instructions

1. **Clone the Repository**
   ```bash
   git clone https://github.com/your-repo-url
   cd your-project
   ```

2. **Install Dependencies**
   ```bash
   pip install -r requirements.txt
   ```

3. **Add `.env` File**
   ```
   GROQ_API_KEY=your_groq_api_key
   ```

4. **Run the App**
   ```bash
   uvicorn main:app --reload
   ```

5. **Visit**
   ```
   http://127.0.0.1:8000
   ```

---

## 🔐 Environment Variables

| Variable       | Description                |
|----------------|----------------------------|
| `GROQ_API_KEY` | Your Groq API key          |

---

## 🧠 Persona

This bot answers as *Harsh Wawa*, a fresher AI/ML engineer with internship experience in Generative AI and full-stack development. The LLM is primed with his CV and will only answer questions relevant to that background.

---

## 🗣️ Example Use

1. Click **"Start Interview"**
2. Click **"Record"**, ask a question.
3. Bot responds with **audio + text**, powered by LLaMA and TTS.

---

## 📜 License

MIT License
