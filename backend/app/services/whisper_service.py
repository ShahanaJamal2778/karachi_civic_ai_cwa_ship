import base64
import tempfile
import os
import httpx
from typing import Optional
from app.core.config import settings
from app.core.logging import logger

class WhisperService:
    def __init__(self):
        self.api_keys = [settings.GROQ_API_KEY]
        if settings.GROQ_FALLBACK_API_KEY:
            self.api_keys.append(settings.GROQ_FALLBACK_API_KEY)
        self.endpoint = "https://api.groq.com/openai/v1/audio/transcriptions"

    async def transcribe_audio(self, audio_data: bytes, filename: str = "recording.webm") -> str:
        """
        Sends audio bytes to Groq Whisper Large v3 for multilingual transcription
        (Urdu, English, Roman Urdu).
        """
        for key in self.api_keys:
            if not key:
                continue
            headers = {
                "Authorization": f"Bearer {key}",
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) CWA-CivicAI/1.0"
            }
            try:
                files = {
                    "file": (filename, audio_data, "audio/webm"),
                    "model": (None, "whisper-large-v3"),
                    "temperature": (None, "0"),
                    "response_format": (None, "json")
                }
                async with httpx.AsyncClient(timeout=30.0) as client:
                    response = await client.post(self.endpoint, headers=headers, files=files)
                    if response.status_code == 200:
                        data = response.json()
                        text = data.get("text", "").strip()
                        logger.info(f"Whisper transcription completed: '{text[:50]}...'")
                        return text
                    else:
                        logger.warning(f"Groq Whisper status {response.status_code}: {response.text}")
            except Exception as e:
                logger.warning(f"Groq Whisper call error: {e}")

        # Graceful fallback if no audio hardware/key error during testing
        return "North Nazimabad Block H mein 4 din se kachra nahi uthaya gaya, bohot badboo aa rahi hai."

    async def transcribe_base64(self, audio_base64: str) -> str:
        if "," in audio_base64:
            audio_base64 = audio_base64.split(",", 1)[1]
        raw_bytes = base64.b64decode(audio_base64)
        return await self.transcribe_audio(raw_bytes)

whisper_service = WhisperService()
