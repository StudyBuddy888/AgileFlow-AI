# main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

# Initialize the FastAPI app.
app = FastAPI()

# Configure CORS (Cross-Origin Resource Sharing).
# This is crucial for local development, allowing your frontend (on a different port)
# to communicate with this backend API.
origins = [
    "http://localhost",
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# This is the main endpoint that the frontend will call.
# It's a POST request because we're sending data (the user's message).
@app.post("/chat")
async def chat_with_agent(message: dict):
    # The 'message' dictionary will contain the user's message.
    user_message = message.get("message")
    
    # For now, we are just returning a hardcoded response.
    # In the next phase, we will replace this with the LangChain agent logic.
    response_message = f"You said: '{user_message}'. I received your message and am ready to process it!"
    
    return {"response": response_message}

# This is the code to run the server.
if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)

