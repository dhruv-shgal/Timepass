#!/usr/bin/env python3
"""
Short command to run the FastAPI server
"""
import uvicorn

if __name__ == "__main__":
    import os
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=port,
        reload=False,  # Disable auto-reload to avoid logging conflicts
        log_level="info"
    )


