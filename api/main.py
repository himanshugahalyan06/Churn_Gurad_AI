from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from api.routes.health import router as health_router
from api.routes.predict import router as predict_router
from api.routes.metrics import router as metrics_router
from api.routes.explain import router as explain_router

from churnguard.database.db import engine
from churnguard.database.models import Base

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="ChurnGuard API",
    description="Cost Sensitive Customer Churn Prediction System API",
    version="1.0.0"
)

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health_router, tags=["Health"])
app.include_router(predict_router, tags=["Predict"])
app.include_router(metrics_router, tags=["Metrics"])
app.include_router(explain_router, tags=["Explain"])