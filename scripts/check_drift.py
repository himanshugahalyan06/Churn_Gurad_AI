"""
Check Data Drift
"""

import pandas as pd

from churnguard.monitoring.drift_detector import DriftDetector


train = pd.read_csv(

    "data/processed/train.csv"

)

production = pd.read_csv(

    "data/processed/test.csv"

)

detector = DriftDetector(

    train,

    production

)

result = detector.detect()

print(result)