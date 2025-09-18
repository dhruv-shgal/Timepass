from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine, Base
from config import settings
from routes import auth_routes, profile_routes, resume_routes, interview_routes
import logging
import sys

# Fix for Python 3.13 logging issue
class SafeStreamHandler(logging.StreamHandler):
    def flush(self):
        try:
            super().flush()
        except (OSError, ValueError):
            pass

# Configure logging to avoid the error
root_logger = logging.getLogger()
for handler in root_logger.handlers[:]:
    if isinstance(handler, logging.StreamHandler):
        root_logger.removeHandler(handler)

handler = SafeStreamHandler(sys.stdout)
handler.setLevel(logging.INFO)
formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
handler.setFormatter(formatter)
root_logger.addHandler(handler)
root_logger.setLevel(logging.INFO)

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



