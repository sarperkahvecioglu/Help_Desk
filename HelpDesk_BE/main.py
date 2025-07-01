from database import Base, engine
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.supportUserRoute import router as user_router
from routes.clientRoute import router as client_router
from routes.authRoute import router as auth_router
from database import session

Base.metadata.create_all(bind=engine)

app = FastAPI(title="HelpDesk API", description="HelpDesk System with JWT Authorization")

# Add CORS middleware to allow requests from React app
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173", "http://127.0.0.1:3000", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(user_router)
app.include_router(client_router)