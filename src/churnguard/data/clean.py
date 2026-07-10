"""
clean.py

Performs data cleaning on the Telco Customer Churn dataset.
"""

import pandas as pd
import logging

from churnguard.config import (
    ID_COLUMN,
    TARGET_COLUMN,
    PROCESSED_DATA_DIR,
)

logger = logging.getLogger(__name__)

def clean_data(df: pd.DataFrame, is_training: bool = True) -> pd.DataFrame:
    """
    Clean the dataset.

    Parameters
    ----------
    df : pd.DataFrame
        The data to clean.
    is_training : bool, optional
        Whether this is during training. If true, target columns are encoded 
        and data is saved. Default is True.

    Returns
    -------
    pd.DataFrame
    """
    logger.info("Starting data cleaning process...")
    df = df.copy()

    # Remove customer ID
    if ID_COLUMN in df.columns:
        logger.info(f"Dropping {ID_COLUMN} column.")
        df = df.drop(columns=[ID_COLUMN])

    # Convert TotalCharges to numeric
    if "TotalCharges" in df.columns:
        logger.info("Converting TotalCharges to numeric.")
        df["TotalCharges"] = pd.to_numeric(
            df["TotalCharges"],
            errors="coerce"
        )
        # Fill missing values
        missing = df["TotalCharges"].isnull().sum()
        if missing > 0:
            logger.info(f"Filling {missing} missing values in TotalCharges with 0.")
        df["TotalCharges"] = df["TotalCharges"].fillna(0)

    if is_training:
        # Remove duplicate rows only in training
        duplicates = df.duplicated().sum()
        if duplicates > 0:
            logger.info(f"Removing {duplicates} duplicate rows.")
        df = df.drop_duplicates()

        # Encode target
        if TARGET_COLUMN in df.columns:
            logger.info(f"Encoding target column {TARGET_COLUMN}.")
            df[TARGET_COLUMN] = df[TARGET_COLUMN].map({"Yes": 1, "No": 0})

        # Save cleaned data
        output_file = PROCESSED_DATA_DIR / "cleaned_data.csv"
        logger.info(f"Saving cleaned data to {output_file}")
        df.to_csv(output_file, index=False)
        
        logger.info("=" * 50)
        logger.info("Cleaning Completed")
        logger.info("=" * 50)
        logger.info(f"Final shape: {df.shape}")
        logger.info("=" * 50)

    return df