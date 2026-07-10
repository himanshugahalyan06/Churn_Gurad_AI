"""
API Dependencies
"""

from churnguard.models.predict import Predictor

# Global Predictor instance to load models once on startup
predictor = Predictor()