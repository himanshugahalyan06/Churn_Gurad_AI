"""
pipeline.py

Creates and saves the complete preprocessing pipeline.
"""

import joblib
import pandas as pd
import logging

from sklearn.pipeline import Pipeline

from churnguard.preprocessing.encoder import build_encoder
from churnguard.config import ENCODER_DIR

logger = logging.getLogger(__name__)

def build_pipeline(X_train: pd.DataFrame) -> Pipeline:
    """
    Build complete preprocessing pipeline.

    Parameters
    ----------
    X_train : pd.DataFrame

    Returns
    -------
    sklearn.pipeline.Pipeline
    """
    logger.info("Building preprocessing pipeline.")
    encoder = build_encoder(X_train)

    pipeline = Pipeline(
        steps=[
            ("preprocessor", encoder)
        ]
    )

    pipeline.fit(X_train)

    pipeline_path = ENCODER_DIR / "pipeline.joblib"
    logger.info(f"Saving pipeline to {pipeline_path}")
    joblib.dump(
        pipeline,
        pipeline_path
    )

    logger.info("=" * 50)
    logger.info("Pipeline Saved Successfully")
    logger.info("=" * 50)

    return pipeline