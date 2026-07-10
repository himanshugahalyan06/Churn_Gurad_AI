import pytest
from fastapi.testclient import TestClient

@pytest.fixture
def client(monkeypatch):
    # Mock the predictor dependency
    class MockPredictor:
        def predict(self, df):
            return {"probability": 0.8, "prediction": 1, "threshold": 0.5}
            
    class MockExplainer:
        def explain(self, df):
            import pandas as pd
            return pd.DataFrame([{"Feature": "A", "SHAP": 0.1, "Impact": 0.1}])
            
    monkeypatch.setattr("api.routes.predict.predictor", MockPredictor())
    monkeypatch.setattr("api.routes.explain.explainer", MockExplainer())
    
    from api.main import app
    return TestClient(app)

def test_health(client):
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "running"}