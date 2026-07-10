from fastapi import APIRouter, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func

from churnguard.database.db import SessionLocal
from churnguard.database.models import PredictionLog

router = APIRouter()

@router.get("/metrics")
def metrics():
    """
    Get system metrics including prediction count, average latency, and churn distribution.
    """
    db: Session = SessionLocal()
    try:
        total_predictions = db.query(func.count(PredictionLog.id)).scalar() or 0
        
        avg_latency = db.query(func.avg(PredictionLog.latency)).scalar() or 0.0
        
        churn_count = db.query(func.count(PredictionLog.id)).filter(PredictionLog.prediction == 1).scalar() or 0
        non_churn_count = total_predictions - churn_count
        
        return {
            "total_predictions": total_predictions,
            "average_latency_seconds": round(avg_latency, 4),
            "predictions_distribution": {
                "churn": churn_count,
                "non_churn": non_churn_count
            }
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        db.close()