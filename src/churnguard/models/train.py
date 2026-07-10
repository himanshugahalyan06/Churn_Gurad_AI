"""
train.py

Train the ChurnGuard Random Forest model.
"""

import json
import joblib
import pandas as pd
import numpy as np
import logging
from pathlib import Path
from typing import Tuple, Dict, Any

from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    roc_auc_score,
    confusion_matrix,
    classification_report
)

from churnguard.data.load import load_data
from churnguard.data.clean import clean_data
from churnguard.data.split import split_data
from churnguard.features.build_features import create_features
from churnguard.preprocessing.pipeline import build_pipeline
from churnguard.models.cost_matrix import calculate_cost
from churnguard.models.threshold_optimizer import optimize_threshold
from churnguard.models.mlflow_logger import MLflowLogger

from churnguard.config import (
    MODEL_DIR,
    SCHEMA_DIR,
    THRESHOLD_DIR,
    RANDOM_STATE,
    N_ESTIMATORS,
    MAX_DEPTH,
    MLFLOW_TRACKING_URI,
    MLFLOW_EXPERIMENT
)

logger = logging.getLogger(__name__)


def train_model() -> Tuple[RandomForestClassifier, pd.DataFrame, pd.Series, np.ndarray, np.ndarray, Dict[str, float], float, float]:
    """
    Complete Training Pipeline
    """

    logger.info("=" * 60)
    logger.info("STEP 1 : Loading Dataset")
    logger.info("=" * 60)
    df = load_data()

    logger.info("=" * 60)
    logger.info("STEP 2 : Cleaning Dataset")
    logger.info("=" * 60)
    df = clean_data(df)

    logger.info("=" * 60)
    logger.info("STEP 3 : Feature Engineering")
    logger.info("=" * 60)
    df = create_features(df)

    logger.info("=" * 60)
    logger.info("STEP 4 : Train Test Split")
    logger.info("=" * 60)
    X_train, X_test, y_train, y_test = split_data(df)

    logger.info("=" * 60)
    logger.info("STEP 5 : Building Pipeline")
    logger.info("=" * 60)
    pipeline = build_pipeline(X_train)
    X_train_encoded = pipeline.transform(X_train)
    X_test_encoded = pipeline.transform(X_test)

    logger.info("=" * 60)
    logger.info("STEP 6 : Saving Feature Schema")
    logger.info("=" * 60)
    feature_names = pipeline.named_steps["preprocessor"].get_feature_names_out()
    schema_file = SCHEMA_DIR / "feature_schema.json"
    with open(schema_file, "w") as f:
        json.dump(feature_names.tolist(), f, indent=4)
    logger.info("Feature Schema Saved")

    logger.info("=" * 60)
    logger.info("STEP 7 : Building Random Forest")
    logger.info("=" * 60)
    model = RandomForestClassifier(
        n_estimators=N_ESTIMATORS,
        max_depth=MAX_DEPTH,
        random_state=RANDOM_STATE,
        n_jobs=-1
    )

    logger.info("=" * 60)
    logger.info("STEP 8 : Training Model")
    logger.info("=" * 60)
    model.fit(X_train_encoded, y_train)
    logger.info("Training Completed")
    
    logger.info("Saving Model locally...")
    joblib.dump(model, MODEL_DIR / "random_forest.joblib")

    logger.info("=" * 60)
    logger.info("STEP 9 : Prediction")
    logger.info("=" * 60)
    predictions = model.predict(X_test_encoded)
    probabilities = model.predict_proba(X_test_encoded)[:, 1]

    logger.info("=" * 60)
    logger.info("STEP 10 : Model Evaluation")
    logger.info("=" * 60)
    accuracy = accuracy_score(y_test, predictions)
    precision = precision_score(y_test, predictions)
    recall = recall_score(y_test, predictions)
    f1 = f1_score(y_test, predictions)
    roc_auc = roc_auc_score(y_test, probabilities)

    logger.info(f"Accuracy  : {accuracy:.4f}")
    logger.info(f"Precision : {precision:.4f}")
    logger.info(f"Recall    : {recall:.4f}")
    logger.info(f"F1 Score  : {f1:.4f}")
    logger.info(f"ROC AUC   : {roc_auc:.4f}")

    logger.info("=" * 60)
    logger.info("STEP 11 : Confusion Matrix")
    logger.info("=" * 60)
    cm = confusion_matrix(y_test, predictions)
    logger.info(f"\n{cm}")

    logger.info("=" * 60)
    logger.info("STEP 12 : Classification Report")
    logger.info("=" * 60)
    report = classification_report(y_test, predictions)
    logger.info(f"\n{report}")

    metrics = {
        "accuracy": accuracy,
        "precision": precision,
        "recall": recall,
        "f1_score": f1,
        "roc_auc": roc_auc
    }

    logger.info("=" * 60)
    logger.info("STEP 13 : Business Cost @ Threshold = 0.50")
    logger.info("=" * 60)
    default_cost = calculate_cost(y_test, predictions)
    logger.info(f"Default Cost: {default_cost}")

    logger.info("=" * 60)
    logger.info("STEP 14 : Threshold Optimization")
    logger.info("=" * 60)
    best_threshold, best_cost, threshold_table = optimize_threshold(y_test, probabilities)

    logger.info(f"Best Threshold : {best_threshold}")
    logger.info(f"Minimum Cost   : ₹{best_cost}")

    threshold_table.to_csv(THRESHOLD_DIR / "threshold_results.csv", index=False)
    logger.info("Threshold Table Saved")

    threshold_file = THRESHOLD_DIR / "best_threshold.json"
    with open(threshold_file, "w") as file:
        json.dump(
            {
                "best_threshold": float(best_threshold),
                "minimum_cost": int(best_cost)
            },
            file,
            indent=4
        )
    logger.info("Best Threshold Saved")

    logger.info("=" * 60)
    logger.info("STEP 15 : Cost Comparison")
    logger.info("=" * 60)
    logger.info(f"Default Threshold Cost : ₹{default_cost['Total Cost']}")
    logger.info(f"Optimized Threshold Cost : ₹{best_cost}")
    saved = default_cost["Total Cost"] - best_cost
    logger.info(f"Business Savings : ₹{saved}")

    logger.info("=" * 60)
    logger.info("STEP 16 : MLflow")
    logger.info("=" * 60)
    
    try:
        mlflow_logger = MLflowLogger(
            experiment_name=MLFLOW_EXPERIMENT,
            tracking_uri=MLFLOW_TRACKING_URI
        )

        mlflow_logger.log_model(
            model=model,
            metrics=metrics,
            params={
                "model": "RandomForest",
                "n_estimators": N_ESTIMATORS,
                "max_depth": MAX_DEPTH,
                "random_state": RANDOM_STATE
            },
            artifacts={
                "schema": str(SCHEMA_DIR / "feature_schema.json"),
                "threshold": str(THRESHOLD_DIR / "best_threshold.json"),
                "table": str(THRESHOLD_DIR / "threshold_results.csv")
            }
        )
        logger.info("MLflow Logging Completed")
    except Exception as e:
        logger.warning(f"Could not log to MLflow: {e}")

    return (
        model,
        X_test,
        y_test,
        predictions,
        probabilities,
        metrics,
        best_threshold,
        best_cost
    )

if __name__ == "__main__":
    import numpy as np
    train_model()