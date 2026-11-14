
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
import pandas as pd
import joblib
import json
from pathlib import Path

# Project paths
BASE_DIR = Path(__file__).resolve().parent
MODEL_PATH = BASE_DIR / "models" / "churn_model.joblib"
METRICS_PATH = BASE_DIR / "models" / "metrics.json"

# Load trained model
model = joblib.load(MODEL_PATH)

# Create FastAPI application
app = FastAPI(
    title="ChurnGuard API",
    description="Customer Churn Prediction using Machine Learning",
    version="1.0"
)

# Allow React frontend to communicate with backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Customer input schema
class CustomerData(BaseModel):
    tenure: int = Field(ge=0, le=100)
    monthlyCharges: float = Field(ge=0)

    contract: str
    internet: str
    payment: str

    gender: str = "Male"
    seniorCitizen: int = Field(default=0, ge=0, le=1)
    partner: str = "No"
    dependents: str = "No"
    phoneService: str = "Yes"
    multipleLines: str = "No"
    onlineSecurity: str = "No"
    onlineBackup: str = "No"
    deviceProtection: str = "No"
    techSupport: str = "No"
    streamingTV: str = "No"
    streamingMovies: str = "No"
    paperlessBilling: str = "Yes"
    totalCharges: float | None = None


# Home endpoint
@app.get("/")
def home():
    return {
        "message": "Welcome to ChurnGuard API",
        "status": "Running",
        "model": "Random Forest"
    }


# Health check
@app.get("/health")
def health():
    return {
        "status": "healthy",
        "model_loaded": True
    }


# Model evaluation metrics
@app.get("/metrics")
def get_metrics():
    with open(METRICS_PATH, "r") as file:
        return json.load(file)


# Customer churn prediction
@app.post("/predict")
def predict_churn(customer: CustomerData):

    # Convert customer information into model format
    customer_data = pd.DataFrame([{
        "gender": customer.gender,
        "SeniorCitizen": customer.seniorCitizen,
        "Partner": customer.partner,
        "Dependents": customer.dependents,
        "tenure": customer.tenure,
        "PhoneService": customer.phoneService,
        "MultipleLines": customer.multipleLines,
        "InternetService": customer.internet,
        "OnlineSecurity": customer.onlineSecurity,
        "OnlineBackup": customer.onlineBackup,
        "DeviceProtection": customer.deviceProtection,
        "TechSupport": customer.techSupport,
        "StreamingTV": customer.streamingTV,
        "StreamingMovies": customer.streamingMovies,
        "Contract": customer.contract,
        "PaperlessBilling": customer.paperlessBilling,
        "PaymentMethod": customer.payment,
        "MonthlyCharges": customer.monthlyCharges,
        "TotalCharges": customer.totalCharges
    }])

    # Generate prediction
    prediction = int(model.predict(customer_data)[0])

    # Get churn probability
    probabilities = model.predict_proba(customer_data)[0]
    churn_probability = float(probabilities[1]) * 100

    # Determine risk category
    if churn_probability >= 70:
        risk = "High"
    elif churn_probability >= 40:
        risk = "Medium"
    else:
        risk = "Low"

    return {
        "prediction": "Churn" if prediction == 1 else "No Churn",
        "churn_probability": round(churn_probability, 2),
        "risk_level": risk,
        "recommendation": (
            "Contact customer and offer a retention plan."
            if prediction == 1
            else "Continue regular customer engagement."
        )
    }
