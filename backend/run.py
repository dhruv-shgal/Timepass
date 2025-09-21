#!/usr/bin/env python3
"""
Short command to run the FastAPI server
"""
import uvicorn

if __name__ == "__main__":
    import os
    port = int(os.environ.get("PORT", 8000))
    print(f"🚀 Starting server on port {port}")
    print(f"🌐 Host: 0.0.0.0")
    print(f"📁 Working directory: {os.getcwd()}")
    
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=port,
        reload=False,
        log_level="info",
        access_log=True
    )


