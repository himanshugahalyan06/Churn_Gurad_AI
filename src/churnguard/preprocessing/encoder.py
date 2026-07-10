"""
encoder.py

Creates preprocessing pipeline for categorical and numerical features.
"""

import joblib
import pandas as pd
import logging

from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import OneHotEncoder

from churnguard.config import ENCODER_DIR

logger = logging.getLogger(__name__)

def build_encoder(X_train: pd.DataFrame) -> ColumnTransformer:
    """
    Build OneHotEncoder pipeline.

    Parameters
    ----------
    X_train : pd.DataFrame

    Returns
    -------
    ColumnTransformer
    """
    logger.info("Building OneHotEncoder pipeline.")
    categorical_columns = X_train.select_dtypes(
        include=["object"]
    ).columns.tolist()

    numerical_columns = X_train.select_dtypes(
        exclude=["object"]
    ).columns.tolist()

    preprocessor = ColumnTransformer(
        transformers=[
            (
                "categorical",
                OneHotEncoder(
                    handle_unknown="ignore",
                    sparse_output=False
                ),
                categorical_columns
            ),
            (
                "numerical",
                "passthrough",
                numerical_columns
            )
        ]
    )

    preprocessor.fit(X_train)

    encoder_path = ENCODER_DIR / "encoder.joblib"
    logger.info(f"Saving encoder to {encoder_path}")
    joblib.dump(
        preprocessor,
        encoder_path
    )

    logger.info("=" * 50)
    logger.info("Encoder Saved Successfully")
    logger.info("=" * 50)

    return preprocessor