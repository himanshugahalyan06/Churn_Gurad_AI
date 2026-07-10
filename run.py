"""
Run ChurnGuard
"""

import subprocess
import os

print("=" * 60)
print("STARTING CHURNGUARD API")
print("=" * 60)

env = os.environ.copy()
env["PYTHONPATH"] = "src"

subprocess.run(
    [
        "uvicorn",
        "api.main:app",
        "--reload"
    ],
    env=env
)