"""
Prediction Logger
"""

import time
import logging

from churnguard.database.db import SessionLocal
from churnguard.database.models import PredictionLog

logger = logging.getLogger(__name__)

class PredictionLogger:
    """
    Logs prediction results to the database for monitoring.
    """

    def __init__(self):
        self.db = SessionLocal()

    def log_prediction(
        self,
        probability: float,
        prediction: int,
        latency: float
    ) -> None:
        """
        Log a single prediction event.

        Parameters
        ----------
        probability : float
            Predicted probability of churn.
        prediction : int
            Binary prediction (0 or 1).
        latency : float
            Time taken to process the prediction request.
        """
        try:
            record = PredictionLog(
                probability=probability,
                prediction=prediction,
                latency=latency
            )

            self.db.add(record)
            self.db.commit()
            logger.info("Prediction logged successfully.")
        except Exception as e:
            self.db.rollback()
            logger.error(f"Failed to log prediction: {e}")

    def close(self):
        """
        Close the database session.
        """
        self.db.close()