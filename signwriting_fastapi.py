from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import subprocess

app = FastAPI(title="SignWriting Translation Service")

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class TextToSignWritingRequest(BaseModel):
    text: str
    spoken_language: str = "en"
    signed_language: str = "ase"

class SignWritingToTextRequest(BaseModel):
    signwriting: str
    spoken_language: str = "en"
    signed_language: str = "ase"

@app.get("/health")
async def health():
    return {"status": "healthy"}

@app.post("/translate/text-to-signwriting")
async def text_to_signwriting(request: TextToSignWritingRequest):
    try:
        result = subprocess.run([
            'text_to_signwriting',
            f'--spoken-language={request.spoken_language}',
            f'--signed-language={request.signed_language}',
            f'--input={request.text}'
        ], capture_output=True, text=True, check=True)
        
        return {
            "signwriting": result.stdout.strip(),
            "spoken_language": request.spoken_language,
            "signed_language": request.signed_language
        }
    except subprocess.CalledProcessError as e:
        raise HTTPException(status_code=500, detail=e.stderr)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/translate/signwriting-to-text")
async def signwriting_to_text(request: SignWritingToTextRequest):
    try:
        result = subprocess.run([
            'signwriting_to_text',
            f'--spoken-language={request.spoken_language}',
            f'--signed-language={request.signed_language}',
            f'--input={request.signwriting}'
        ], capture_output=True, text=True, check=True)
        
        return {
            "text": result.stdout.strip(),
            "spoken_language": request.spoken_language,
            "signed_language": request.signed_language
        }
    except subprocess.CalledProcessError as e:
        raise HTTPException(status_code=500, detail=e.stderr)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))