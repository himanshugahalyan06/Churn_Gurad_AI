import pandas as pd
import json

from churnguard.preprocessing.pipeline import build_pipeline
from churnguard.models.predict import Predictor
from churnguard.config import SCHEMA_DIR

def test_encoding_consistency(tmp_path, monkeypatch):
    """
    Test that inference-time DataFrame has identical columns (name and order)
    to the training-time DataFrame, even with an unseen combination of categories.
    """
    # 1. Create a synthetic training dataset
    train_data = pd.DataFrame({
        "CategoryA": ["cat", "dog", "bird"],
        "NumericB": [10.0, 20.0, 30.0]
    })
    
    # 2. Build the pipeline (simulating training time)
    # Monkeypatch the ENCODER_DIR so it doesn't overwrite real artifacts
    monkeypatch.setattr("churnguard.preprocessing.pipeline.ENCODER_DIR", tmp_path)
    monkeypatch.setattr("churnguard.preprocessing.encoder.ENCODER_DIR", tmp_path)
    
    pipeline = build_pipeline(train_data)
    train_transformed = pipeline.transform(train_data)
    
    train_columns = pipeline.named_steps["preprocessor"].get_feature_names_out().tolist()
    
    # Save schema as happens in train.py
    schema_file = tmp_path / "feature_schema.json"
    with open(schema_file, "w") as f:
        json.dump(train_columns, f)

    # 3. Create a synthetic inference dataset with an UNSEEN category
    inference_data = pd.DataFrame({
        "CategoryA": ["dragon"], # UNSEEN!
        "NumericB": [40.0]
    })
    
    # 4. Transform inference data
    inference_transformed = pipeline.transform(inference_data)
    inference_df = pd.DataFrame(inference_transformed, columns=train_columns)
    
    # 5. Load schema and reindex (simulating predict.py)
    with open(schema_file) as f:
        loaded_schema = json.load(f)
        
    final_df = inference_df.reindex(columns=loaded_schema, fill_value=0)
    
    # 6. Assertions
    assert list(final_df.columns) == train_columns
    
    # The 'dragon' category should be ignored, so all OneHot columns for CategoryA should be 0
    cat_cols = [col for col in final_df.columns if col.startswith("categorical__CategoryA")]
    for col in cat_cols:
        assert final_df[col].iloc[0] == 0.0