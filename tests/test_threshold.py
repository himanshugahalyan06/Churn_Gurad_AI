import numpy as np

from churnguard.models.threshold_optimizer import optimize_threshold
from churnguard.models.cost_matrix import calculate_cost

def test_threshold():
    """
    Test that the optimal threshold always produces a cost <= the naive 0.5 threshold cost.
    """
    y_true = np.array(
        [0, 1, 1, 0, 1, 0, 1, 0, 0, 1]
    )

    probabilities = np.array(
        [0.2, 0.7, 0.4, 0.1, 0.9, 0.6, 0.8, 0.3, 0.45, 0.55]
    )

    # Calculate optimal threshold
    best_threshold, optimal_cost, table = optimize_threshold(
        y_true,
        probabilities
    )

    # Calculate default threshold (0.5) cost
    default_preds = (probabilities >= 0.5).astype(int)
    default_cost = calculate_cost(y_true, default_preds)["Total Cost"]

    # The optimal cost must NEVER exceed the default cost
    assert optimal_cost <= default_cost
    assert best_threshold > 0
    assert optimal_cost >= 0