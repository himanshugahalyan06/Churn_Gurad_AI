import os
import pytest
import joblib

from churnguard.config import MODEL_DIR

@pytest.mark.skipif(not os.path.exists(MODEL_DIR / "random_forest.joblib"), reason="Model not trained yet")
def test_model_exists():
    model = joblib.load(
        MODEL_DIR / "random_forest.joblib"
    )
    assert model is not None