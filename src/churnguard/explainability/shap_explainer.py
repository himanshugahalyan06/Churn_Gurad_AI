"""
SHAP Explainability
"""

import json
import joblib
import shap
import pandas as pd
import logging
import numpy as np

from churnguard.config import (
    MODEL_DIR,
    ENCODER_DIR,
    SCHEMA_DIR
)
from churnguard.data.clean import clean_data
from churnguard.features.build_features import create_features

logger = logging.getLogger(__name__)

class ShapExplainer:
    """
    Provides local explainability using SHAP values.
    """

    def __init__(self):
        logger.info("Initializing ShapExplainer...")
        try:
            self.model = joblib.load(
                MODEL_DIR / "random_forest.joblib"
            )

            self.pipeline = joblib.load(
                ENCODER_DIR / "pipeline.joblib"
            )
            
            with open(
                SCHEMA_DIR / "feature_schema.json"
            ) as file:
                self.schema = json.load(file)

            self.explainer = shap.TreeExplainer(
                self.model
            )
            logger.info("ShapExplainer initialized.")
        except FileNotFoundError as e:
            logger.error(f"Missing artifact, ShapExplainer will not work: {e}")
            self.model = None
            self.pipeline = None
            self.schema = []
            self.explainer = None

    def explain(
        self,
        customer: pd.DataFrame
    ) -> pd.DataFrame:
        """
        Explain the prediction for a single customer.

        Parameters
        ----------
        customer : pd.DataFrame
            Customer data.

        Returns
        -------
        pd.DataFrame
            Top 3 features contributing to the prediction.
        """
        cleaned_df = clean_data(customer, is_training=False)
        featured_df = create_features(cleaned_df)

        transformed = self.pipeline.transform(featured_df)
        
        transformed_df = pd.DataFrame(
            transformed, 
            columns=self.pipeline.named_steps["preprocessor"].get_feature_names_out()
        )
        
        final_df = transformed_df.reindex(columns=self.schema, fill_value=0)

        shap_values = self.explainer.shap_values(final_df)

        # Handle different SHAP versions return types
        if isinstance(shap_values, list):
            values = shap_values[1][0]
        else:
            if len(shap_values.shape) == 3:
                values = shap_values[0, :, 1]
            else:
                values = shap_values[0]

        explanation = pd.DataFrame({
            "Feature": self.schema,
            "SHAP": values
        })

        explanation["Impact"] = explanation[
            "SHAP"
        ].abs()

        explanation = explanation.sort_values(
            by="Impact",
            ascending=False
        )

        return explanation.head(3)