import pandas as pd
from typing import List, Dict, Any

from fastapi import APIRouter, HTTPException

from api.schemas import CustomerRequest
from churnguard.explainability.shap_explainer import ShapExplainer

router = APIRouter()
explainer = ShapExplainer()

@router.post("/explain")
def explain(customer: CustomerRequest) -> List[Dict[str, Any]]:
    """
    Provide local explanation for customer churn prediction using SHAP.
    """
    try:
        customer_data = customer.model_dump() if hasattr(customer, 'model_dump') else customer.dict()
        df = pd.DataFrame([customer_data])

        explanation = explainer.explain(df)

        return explanation.to_dict(orient="records")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))