import uvicorn
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import numpy as np
import cv2
import joblib
from skimage.feature import hog
from PIL import Image
import io
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MAX_UPLOAD_BYTES = 10 * 1024 * 1024
ALLOWED_ORIGINS = [
    origin.strip()
    for origin in os.environ.get(
        "ALLOWED_ORIGINS", "http://localhost:5173,http://127.0.0.1:5173"
    ).split(",")
    if origin.strip()
]

# =========================
# LOAD MODEL & SCALER
# =========================
try:
    model = joblib.load(os.path.join(BASE_DIR, "tomato_model.pkl"))
    scaler = joblib.load(os.path.join(BASE_DIR, "scaler.pkl"))
except Exception as e:
    print(f"Error loading model/scaler: {e}")
    # In a real app, you might want to exit or handle this gracefully
    model = None
    scaler = None

app = FastAPI(title="Tomato Leaf Health Detector API")

# Enable CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS, # Set ALLOWED_ORIGINS to your frontend URL in production
    allow_methods=["*"],
    allow_headers=["*"],
)

# =========================
# FEATURE EXTRACTION LOGIC
# =========================
def extract_features(img_np):
    # 1. Resize
    img = cv2.resize(img_np, (128, 128))
    
    # 2. Preprocessing CLAHE
    lab = cv2.cvtColor(img, cv2.COLOR_RGB2LAB)
    l, a, b = cv2.split(lab)
    clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8))
    cl = clahe.apply(l)
    img_enhanced = cv2.merge((cl, a, b))
    img_enhanced = cv2.cvtColor(img_enhanced, cv2.COLOR_LAB2RGB)
    
    # 3. Texture: HOG
    gray = cv2.cvtColor(img_enhanced, cv2.COLOR_RGB2GRAY)
    hog_features = hog(
        gray, orientations=9, pixels_per_cell=(8, 8),
        cells_per_block=(2, 2), transform_sqrt=True, block_norm="L2-Hys"
    )
    
    # 4. Color: HSV Histogram
    hsv = cv2.cvtColor(img_enhanced, cv2.COLOR_RGB2HSV)
    hist_h = cv2.calcHist([hsv], [0], None, [32], [0, 180])
    hist_s = cv2.calcHist([hsv], [1], None, [32], [0, 256])
    color_features = np.concatenate([hist_h, hist_s]).flatten()
    cv2.normalize(color_features, color_features)
    
    # Combine (8164 features)
    return np.hstack([hog_features, color_features])

@app.get("/")
async def root():
    return {"message": "Tomato Leaf Detector API is running"}

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    if model is None or scaler is None:
        raise HTTPException(status_code=500, detail="Model or Scaler not loaded on server.")
    
    # Read image
    contents = await file.read(MAX_UPLOAD_BYTES + 1)
    if len(contents) > MAX_UPLOAD_BYTES:
        raise HTTPException(status_code=413, detail="Image is too large. The maximum size is 10 MB.")

    try:
        image = Image.open(io.BytesIO(contents)).convert("RGB")
    except Exception:
        raise HTTPException(status_code=400, detail="The uploaded file is not a valid image.")

    try:
        img_np = np.array(image)

        # Extract features
        features = extract_features(img_np)
        
        # Scale features
        features_scaled = scaler.transform([features])
        
        # Prediction
        prediction = int(model.predict(features_scaled)[0])
        
        # Confidence
        if hasattr(model, "predict_proba"):
            prob = model.predict_proba(features_scaled)[0]
            confidence = float(prob[prediction])
        elif hasattr(model, "decision_function"):
            confidence = float(model.decision_function(features_scaled)[0])
        else:
            confidence = 1.0

        return {
            "prediction": "Healthy" if prediction == 0 else "Unhealthy",
            "prediction_code": prediction,
            "confidence": confidence,
            "confidence_percentage": round(confidence * 100, 2) if hasattr(model, "predict_proba") else confidence
        }
    except Exception as e:
        print(f"Prediction failed: {e}")
        raise HTTPException(status_code=500, detail="Prediction failed. Please try again.")

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
