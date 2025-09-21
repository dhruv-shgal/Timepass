from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine, Base
from config import settings
from routes import auth_routes, profile_routes, resume_routes, interview_routes
import logging
import sys

# Configure logging for Python 3.13 compatibility
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[logging.StreamHandler(sys.stdout)]
)

# Create tables automatically
Base.metadata.create_all(bind=engine)

# Create FastAPI app
app = FastAPI(title=settings.APP_NAME, debug=settings.DEBUG)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for development
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods
    allow_headers=["*"],  # Allow all headers
)

# Include routers
app.include_router(auth_routes.router)
app.include_router(profile_routes.router)
app.include_router(resume_routes.router)
app.include_router(interview_routes.router)

@app.get("/")
def read_root():
    return {"message": "AI Career Toolkit API is running!"}

@app.get("/health")
def health_check():
    return {"status": "healthy", "app": settings.APP_NAME}



