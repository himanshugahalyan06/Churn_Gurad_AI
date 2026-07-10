from churnguard.models.cost_matrix import calculate_cost
from churnguard.config import FALSE_NEGATIVE_COST, FALSE_POSITIVE_COST

def test_cost():
    y_true = [1, 1, 0, 0]
    y_pred = [1, 0, 1, 0]

    result = calculate_cost(
        y_true,
        y_pred
    )

    assert result["Total Cost"] > 0
    assert result["False Negative"] == 1
    assert result["False Positive"] == 1
    
def test_cost_constants():
    """
    Assert that a False Negative always costs more than a False Positive.
    """
    assert FALSE_NEGATIVE_COST > FALSE_POSITIVE_COST
    assert FALSE_NEGATIVE_COST == 5000
    assert FALSE_POSITIVE_COST == 500