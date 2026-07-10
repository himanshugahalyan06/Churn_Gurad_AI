"""
Business Cost Matrix
"""

from typing import Dict, Any
import numpy as np
from sklearn.metrics import confusion_matrix

from churnguard.config import (
    FALSE_NEGATIVE_COST,
    FALSE_POSITIVE_COST,
)


def calculate_cost(y_true: np.ndarray, y_pred: np.ndarray) -> Dict[str, int]:
    """
    Calculate total business cost based on predictions.
    
    The cost is calculated using a cost matrix:
    - False Negatives (missed churn) cost FALSE_NEGATIVE_COST
    - False Positives (unnecessary retention offer) cost FALSE_POSITIVE_COST

    Parameters
    ----------
    y_true : np.ndarray or pd.Series
        True labels.
    y_pred : np.ndarray or pd.Series
        Predicted labels.

    Returns
    -------
    Dict[str, int]
        Dictionary containing confusion matrix metrics and total cost.
    """

    tn, fp, fn, tp = confusion_matrix(
        y_true,
        y_pred
    ).ravel()

    total_cost = (
        fn * FALSE_NEGATIVE_COST
        +
        fp * FALSE_POSITIVE_COST
    )

    return {
        "False Positive": int(fp),
        "False Negative": int(fn),
        "True Positive": int(tp),
        "True Negative": int(tn),
        "Total Cost": int(total_cost)
    }