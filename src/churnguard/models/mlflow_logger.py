"""
MLflow Logger
"""

import mlflow
import mlflow.sklearn


class MLflowLogger:

    def __init__(
        self,
        experiment_name: str,
        tracking_uri: str
    ):

        mlflow.set_tracking_uri(tracking_uri)

        mlflow.set_experiment(experiment_name)

    def log_model(
        self,
        model,
        metrics,
        params,
        artifacts=None
    ):

        with mlflow.start_run():
            mlflow.log_params(params)
            mlflow.log_metrics(metrics)

            if artifacts:
                for name, path in artifacts.items():
                    mlflow.log_artifact(path)

            mlflow.sklearn.log_model(
                sk_model=model,
                artifact_path="model",
                registered_model_name="ChurnGuardModel"
            )