"""
Explain Prediction
"""

import pandas as pd

from churnguard.explainability.shap_explainer import ShapExplainer


explainer = ShapExplainer()

customer = pd.read_csv(

    "sample_customer.csv"

)

result = explainer.explain(customer)

print(result)