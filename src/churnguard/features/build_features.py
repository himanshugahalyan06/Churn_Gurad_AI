"""
build_features.py

Feature Engineering Module
"""

import pandas as pd
import logging

logger = logging.getLogger(__name__)

def create_features(df: pd.DataFrame) -> pd.DataFrame:
    """
    Create additional useful features.

    Parameters
    ----------
    df : pd.DataFrame

    Returns
    -------
    pd.DataFrame
    """
    logger.info("Starting feature engineering.")
    df = df.copy()

    # -----------------------------------
    # Average Monthly Charge
    # -----------------------------------
    df["AverageChargePerMonth"] = (
        df["TotalCharges"] /
        (df["tenure"] + 1)
    )

    # -----------------------------------
    # Senior Citizen Flag
    # -----------------------------------
    df["IsSeniorCitizen"] = (
        df["SeniorCitizen"]
    )

    # -----------------------------------
    # Long Term Customer
    # -----------------------------------
    df["LongTermCustomer"] = (
        df["tenure"] >= 24
    ).astype(int)

    # -----------------------------------
    # High Bill Customer
    # -----------------------------------
    median_bill = df["MonthlyCharges"].median()

    df["HighMonthlyCharges"] = (
        df["MonthlyCharges"] > median_bill
    ).astype(int)

    logger.info("Feature engineering completed.")
    return df