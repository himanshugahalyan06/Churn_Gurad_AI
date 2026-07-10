"""
Generate Drift Report
"""

import pandas as pd


def generate_report(results):

    df = pd.DataFrame(results).T

    df.to_csv(

        "monitoring/drift_report.csv",

        index=True

    )

    print("Drift Report Saved")