"""
load.py

Loads the raw Telco Customer Churn dataset.
"""

from pathlib import Path
import pandas as pd
import logging

from churnguard.config import RAW_DATA_DIR, DATASET_NAME

logger = logging.getLogger(__name__)

def load_data() -> pd.DataFrame:
    """
    Load the raw dataset.

    Returns
    -------
    pd.DataFrame
        Raw customer churn dataset.
    """
    file_path = RAW_DATA_DIR / DATASET_NAME

    if not file_path.exists():
        logger.error(f"Dataset not found at: {file_path}")
        raise FileNotFoundError(
            f"Dataset not found at: {file_path}"
        )

    logger.info(f"Loading raw dataset from {file_path}")
    df = pd.read_csv(file_path)

    logger.info("=" * 50)
    logger.info("Dataset Loaded Successfully")
    logger.info("=" * 50)
    logger.info(f"Shape : {df.shape}")
    logger.info(f"Rows  : {df.shape[0]}")
    logger.info(f"Cols  : {df.shape[1]}")
    logger.info("=" * 50)

    return df

if __name__ == "__main__":
    data = load_data()
    print(data.head())