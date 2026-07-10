"""
Data Drift Detector
"""

import pandas as pd
import logging
from typing import Dict, Any

from scipy.stats import ks_2samp

logger = logging.getLogger(__name__)

class DriftDetector:
    """
    Detects data drift between training and production data using KS Test.
    """

    def __init__(
        self,
        train_data: pd.DataFrame,
        production_data: pd.DataFrame
    ):
        self.train = train_data
        self.production = production_data
        logger.info("Initialized DriftDetector.")

    def detect(self) -> Dict[str, Dict[str, Any]]:
        """
        Detect drift for numeric columns.

        Returns
        -------
        Dict[str, Dict[str, Any]]
            Results of the Kolmogorov-Smirnov test for each column.
        """
        logger.info("Starting drift detection (KS Test)...")
        results = {}

        numeric_columns = self.train.select_dtypes(
            include="number"
        ).columns

        for column in numeric_columns:
            # Check if column is in production data
            if column not in self.production.columns:
                logger.warning(f"Column '{column}' not found in production data.")
                continue

            statistic, p_value = ks_2samp(
                self.train[column].dropna(),
                self.production[column].dropna()
            )

            results[column] = {
                "ks_statistic": float(statistic),
                "p_value": float(p_value),
                "drift": bool(p_value < 0.05)
            }
            if p_value < 0.05:
                logger.warning(f"Drift detected in column: {column} (p-value: {p_value:.4f})")

        logger.info("Drift detection completed.")
        return results