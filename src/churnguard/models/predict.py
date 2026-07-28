import os
import json
import joblib
import pandas as pd
import logging
from typing import Dict, Any

import mlflow

from churnguard.config import (
    MODEL_DIR,
    ENCODER_DIR,
    SCHEMA_DIR,
    THRESHOLD_DIR,
    MLFLOW_TRACKING_URI
)
from churnguard.data.clean import clean_data
from churnguard.features.build_features import create_features

logger = logging.getLogger(__name__)

class Predictor:
    """
    Handles loading the trained model, pipeline, and threshold to make predictions.
    """

    def __init__(self):
        logger.info("Initializing Predictor...")
        
        use_mlflow = os.getenv("ENABLE_MLFLOW", "false").lower() == "true"
        self.model = None

        if use_mlflow:
            mlflow.set_tracking_uri(MLFLOW_TRACKING_URI)
            try:
                logger.info("Attempting to load model from MLflow registry...")
                self.model = mlflow.sklearn.load_model("models:/ChurnGuardModel/latest")
                logger.info("Loaded model from MLflow registry successfully.")
            except Exception as e:
                logger.warning(f"Could not load model from MLflow registry: {e}. Falling back to local joblib.")
        
        if self.model is None:
            try:
                self.model = joblib.load(
                    MODEL_DIR / "random_forest.joblib"
                )
                logger.info("Loaded model from local joblib successfully.")
            except FileNotFoundError:
                logger.error("No local model found.")
                self.model = None

        try:
            self.pipeline = joblib.load(
                ENCODER_DIR / "pipeline.joblib"
            )

            with open(
                SCHEMA_DIR / "feature_schema.json"
            ) as file:
                self.schema = json.load(file)

            with open(
                THRESHOLD_DIR / "best_threshold.json"
            ) as file:
                threshold = json.load(file)

            self.threshold = threshold[
                "best_threshold"
            ]
            logger.info(f"Predictor initialized with threshold: {self.threshold}")
        except FileNotFoundError as e:
            logger.error(f"Missing artifact, Predictor will not work: {e}")
            self.pipeline = None
            self.schema = []
            self.threshold = 0.5

    def predict(
        self,
        customer: pd.DataFrame
    ) -> Dict[str, Any]:
        """
        Make a prediction for a given customer.

        Parameters
        ----------
        customer : pd.DataFrame

        Returns
        -------
        Dict[str, Any]
            Contains probability, binary prediction, and threshold used.
        """
        # 1. Clean data using shared logic
        cleaned_df = clean_data(customer, is_training=False)
        
        # 2. Build features
        featured_df = create_features(cleaned_df)

        # 3. Apply pipeline
        transformed = self.pipeline.transform(featured_df)

        # 4. Reindex to guarantee exact column match (Encoding Consistency Fix)
        # OneHotEncoder provides a numpy array, we convert to DataFrame using its known output features
        transformed_df = pd.DataFrame(
            transformed, 
            columns=self.pipeline.named_steps["preprocessor"].get_feature_names_out()
        )
        
        # Strictly reindex to the saved schema from training
        final_df = transformed_df.reindex(columns=self.schema, fill_value=0)

        # 5. Predict
        probability = self.model.predict_proba(final_df)[0][1]

        prediction = int(
            probability >= self.threshold
        )

        return {
            "probability": float(probability),
            "prediction": prediction,
            "threshold": self.threshold
        }