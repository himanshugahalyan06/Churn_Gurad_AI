"""
split.py

Split the cleaned dataset into training and testing sets.
"""

import pandas as pd
import logging
from typing import Tuple
from sklearn.model_selection import train_test_split

from churnguard.config import (
    TARGET_COLUMN,
    TEST_SIZE,
    RANDOM_STATE,
    PROCESSED_DATA_DIR,
)

logger = logging.getLogger(__name__)

def split_data(df: pd.DataFrame) -> Tuple[pd.DataFrame, pd.DataFrame, pd.Series, pd.Series]:
    """
    Split dataset into train and test sets.

    Parameters
    ----------
    df : pd.DataFrame

    Returns
    -------
    X_train, X_test, y_train, y_test
    """
    logger.info("Starting train-test split.")

    X = df.drop(columns=[TARGET_COLUMN])
    y = df[TARGET_COLUMN]

    X_train, X_test, y_train, y_test = train_test_split(
        X,
        y,
        test_size=TEST_SIZE,
        random_state=RANDOM_STATE,
        stratify=y
    )

    train = X_train.copy()
    train[TARGET_COLUMN] = y_train

    test = X_test.copy()
    test[TARGET_COLUMN] = y_test

    logger.info(f"Saving train data to {PROCESSED_DATA_DIR / 'train.csv'}")
    train.to_csv(
        PROCESSED_DATA_DIR / "train.csv",
        index=False
    )

    logger.info(f"Saving test data to {PROCESSED_DATA_DIR / 'test.csv'}")
    test.to_csv(
        PROCESSED_DATA_DIR / "test.csv",
        index=False
    )

    logger.info("=" * 50)
    logger.info("Train Test Split Completed")
    logger.info("=" * 50)
    logger.info(f"Train Shape : {train.shape}")
    logger.info(f"Test Shape  : {test.shape}")
    logger.info("=" * 50)

    return X_train, X_test, y_train, y_test