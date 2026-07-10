import time
import pandas as pd
from typing import Dict, Any

from fastapi import APIRouter, HTTPException

from api.dependencies import predictor
from api.schemas import CustomerRequest

from churnguard.monitoring.logger import PredictionLogger

router = APIRouter()

@router.post("/predict")
def predict(customer: CustomerRequest) -> Dict[str, Any]:
    """
    Predict churn probability for a customer.
    """
    try:
        start = time.time()

        # Handle Pydantic v1 vs v2
        customer_data = customer.model_dump() if hasattr(customer, 'model_dump') else customer.dict()
        df = pd.DataFrame([customer_data])

        result = predictor.predict(df)

        latency = time.time() - start

        logger = PredictionLogger()
        logger.log_prediction(
            probability=result["probability"],
            prediction=result["prediction"],
            latency=latency
        )
        logger.close()

        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))