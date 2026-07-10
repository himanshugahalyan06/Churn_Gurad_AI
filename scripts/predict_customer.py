"""
Predict Single Customer
"""

import pandas as pd

from churnguard.models.predict import Predictor


predictor = Predictor()

customer = pd.read_csv(

    "sample_customer.csv"

)

prediction = predictor.predict(customer)

print(prediction)