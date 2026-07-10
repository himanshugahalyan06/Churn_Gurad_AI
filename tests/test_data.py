import pandas as pd
from churnguard.data.clean import clean_data

def test_clean_data_handles_totalcharges_and_target(tmp_path):
    """
    Verifies cleaning handles the TotalCharges blank-string quirk 
    and target encoding correctly.
    """
    # 1. Create a small synthetic dataset
    df = pd.DataFrame({
        "customerID": ["0001", "0002", "0003"],
        "TotalCharges": ["100.50", " ", "250.75"], # One is a blank string
        "Churn": ["Yes", "No", "Yes"],
        "OtherCol": ["A", "B", "C"]
    })
    
    # 2. Clean the data
    cleaned_df = clean_data(df, is_training=True)
    
    # 3. Assertions
    # customerID should be dropped
    assert "customerID" not in cleaned_df.columns
    
    # TotalCharges should be numeric
    assert pd.api.types.is_numeric_dtype(cleaned_df["TotalCharges"])
    
    # The blank string " " should be coerced to 0.0
    assert cleaned_df["TotalCharges"].iloc[1] == 0.0
    
    # Churn should be encoded to 1 and 0
    assert cleaned_df["Churn"].iloc[0] == 1
    assert cleaned_df["Churn"].iloc[1] == 0
    assert cleaned_df["Churn"].iloc[2] == 1
