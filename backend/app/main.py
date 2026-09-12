from contextlib import asynccontextmanager
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from app.core.config import settings
from app.core.logging import logger
from app.api.routes import complaints, authorities, location, health

@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("==================================================")
    logger.info(" Karachi Civic AI — 'The City Around You' started ")
    logger.info(f" Host: {settings.HOST}, Port: {settings.PORT}")
    logger.info("==================================================")
    yield

app = FastAPI(
    title="The City Around You — Karachi Civic AI",
    description="Intelligent browser-based civic reporting and authority routing for Karachi.",
    version="1.0.0",
    lifespan=lifespan
)

# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Exception handlers for user-friendly errors
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled exception on {request.url.path}: {exc}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={
            "error": "server_error",
            "message": "We're having trouble analyzing this report right now. Please try again in a moment."
        }
    )

# Register routers
app.include_router(health.router)
app.include_router(authorities.router)
app.include_router(location.router)
app.include_router(complaints.router)

