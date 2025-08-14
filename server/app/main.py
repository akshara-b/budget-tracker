from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routers import auth, transactions, budgets, reports, ai
from .db import connect_to_mongo, close_mongo_connection, init_db
from .config import settings

app = FastAPI(title="Budget AI API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup_event():
    await connect_to_mongo()
    await init_db()

@app.on_event("shutdown")
async def shutdown_event():
    await close_mongo_connection()

@app.get("/health")
def health():
    return {"status": "ok", "message": "Budget AI API is running"}

@app.get("/")
def root():
    return {
        "message": "Welcome to Budget AI API",
        "version": "0.1.0",
        "docs": "/docs",
        "health": "/health"
    }

app.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(transactions.router, prefix="/transactions", tags=["transactions"])
app.include_router(budgets.router, prefix="/budgets", tags=["budgets"])
app.include_router(reports.router, prefix="/reports", tags=["reports"])
app.include_router(ai.router, prefix="/ai", tags=["ai"])
