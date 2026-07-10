import pandas as pd

from churnguard.monitoring.drift_detector import DriftDetector


def test_drift():

    train = pd.DataFrame(

        {

            "A": [1, 2, 3, 4]

        }

    )

    prod = pd.DataFrame(

        {

            "A": [1, 2, 2, 4]

        }

    )

    detector = DriftDetector(

        train,

        prod

    )

    result = detector.detect()

    assert "A" in result