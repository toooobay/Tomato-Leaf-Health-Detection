# Tomato Leaf Health Detection

  Tomato Leaf Health Detection is a computer vision web application for checking whether a tomato leaf image is
  **Healthy** or **Unhealthy**. The project combines a FastAPI backend, a trained machine learning model, and a React +
  Vite frontend for uploading leaf images, viewing prediction confidence, and reviewing recent scan history.

  ## Project Overview

  The application performs binary tomato leaf health classification. Users upload a JPG or PNG tomato leaf image through
  the frontend. The image is sent to the backend API, processed with computer vision feature extraction, and classified
  by a trained SVM model.

  The current deployed behavior only returns two classes:

  - Healthy
  - Unhealthy

  The model does not identify the exact disease type, although the frontend includes educational reference sections for
  several tomato leaf diseases and pests.

  ## Main Features

  - Upload tomato leaf images in JPG or PNG format
  - Drag-and-drop scan interface
  - FastAPI prediction endpoint
  - Binary Healthy / Unhealthy result
  - Confidence percentage display
  - Session-based scan history
  - Model information page
  - Image capture guide
  - Tomato disease reference section with example images and prevention notes

  ## Technology Stack

  ### Backend

  - Python
  - FastAPI
  - Uvicorn
  - OpenCV
  - NumPy
  - scikit-image
  - scikit-learn
  - Joblib
  - Pillow

  ### Frontend

  - React
  - TypeScript
  - Vite
  - Axios
  - Lucide React icons
  - CSS modules/files for page and component styling

  ## Machine Learning Pipeline

  The model uses a traditional computer vision pipeline instead of a CNN.

  1. Input image is resized to `128x128`
  2. CLAHE is applied to improve image contrast
  3. HOG features are extracted for texture information
  4. HSV color histograms are extracted for color information
  5. Features are combined and scaled with `StandardScaler`
  6. An SVM classifier with RBF kernel predicts the class

  The trained model and scaler are saved as:

  - `tomato_model.pkl`
  - `scaler.pkl`

  ## Dataset

  The training dataset is not included in this repository. It uses tomato leaf folders with 10 classes:

  - Bacterial spot
  - Early blight
  - Healthy
  - Late blight
  - Leaf Mold
  - Septoria leaf spot
  - Spider mites / Two-spotted spider mite
  - Target Spot
  - Tomato mosaic virus
  - Tomato Yellow Leaf Curl Virus

  The training script converts these folders into binary labels:

  - Folders containing `healthy` are labeled `0`
  - All other disease folders are labeled `1`

  The script balances the dataset using undersampling before training.

  ## Backend API

  ### Health Check

  ```http
  GET /
  ```

  Returns a simple message confirming that the API is running.

  ### Prediction

  ```http
  POST /predict
  ```

  Accepts an uploaded image file of up to 10 MB using multipart form data.

  Example response:

  ```json
  {
    "prediction": "Healthy",
    "prediction_code": 0,
    "confidence": 0.914,
    "confidence_percentage": 91.4
  }
  ```

  ## Running the Project

  Install backend dependencies:

  ```bash
  pip install -r requirements.txt
  ```

  Install frontend dependencies:

  ```bash
  cd frontend
  npm install
  ```

  Run both backend and frontend from the project root:

  ```bash
  python run_app.py
  ```

  Default local URLs:

  - Backend: http://localhost:8000
  - Frontend: http://localhost:5173

  ## Configuration

  No environment variables are needed to run the project locally. For a deployment, set:

  - `VITE_API_URL` (frontend): URL of the deployed backend. See `frontend/.env.example`.
  - `ALLOWED_ORIGINS` (backend): comma-separated list of frontend URLs allowed to call the API.

  ## Notes and Limitations

  - The current model is a binary classifier only.
  - It does not predict the exact tomato disease name.
  - Prediction quality depends on image clarity, lighting, and leaf visibility.
  - The result should be used as AI assistance, not as a final agricultural diagnosis.
  - If retraining the model, check the dataset paths in model_tomato.py and update them to match your local folder
    structure.
