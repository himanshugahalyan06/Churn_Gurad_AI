"""
Threshold Optimizer
"""

import numpy as np
import pandas as pd
from typing import Tuple, Union
import logging

from churnguard.models.cost_matrix import calculate_cost

logger = logging.getLogger(__name__)

def optimize_threshold(
    y_true: Union[np.ndarray, pd.Series],
    probabilities: np.ndarray
) -> Tuple[float, float, pd.DataFrame]:
    """
    Find threshold with minimum business cost.

    Evaluates thresholds from 0.05 to 0.95 with a step size of 0.01.
    For each threshold, calculates total business loss based on false negatives 
    and false positives.

    Parameters
    ----------
    y_true : np.ndarray or pd.Series
        True labels.
    probabilities : np.ndarray
        Predicted probabilities for the positive class.

    Returns
    -------
    Tuple[float, float, pd.DataFrame]
        best_threshold : Threshold that minimizes business cost.
        lowest_cost : The minimized cost at the best threshold.
        result_df : DataFrame containing cost at each tested threshold.
    """
    logger.info("Starting threshold optimization (0.05 to 0.95)...")
    results = []

    best_threshold = 0.50
    lowest_cost = float("inf")

    # The user request said "0.05 to 0.95 (step=0.01)". np.arange stops before 0.96.
    for threshold in np.arange(
        0.05,
        0.96,
        0.01
    ):
        predictions = (
            probabilities >= threshold
        ).astype(int)

        cost = calculate_cost(
            y_true,
            predictions
        )

        results.append(
            {
                "Threshold": round(threshold, 2),
                "Cost": cost["Total Cost"]
            }
        )

        if cost["Total Cost"] < lowest_cost:
            lowest_cost = cost["Total Cost"]
            best_threshold = threshold

    result_df = pd.DataFrame(results)
    
    logger.info(f"Best threshold found: {best_threshold:.2f} with cost: {lowest_cost}")

    return (
        round(best_threshold, 2),
        lowest_cost,
        result_df
    )