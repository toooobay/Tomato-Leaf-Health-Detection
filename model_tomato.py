import os
import cv2
import numpy as np
import joblib
from tqdm import tqdm
from sklearn.model_selection import train_test_split
from sklearn.svm import SVC
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
from sklearn.preprocessing import StandardScaler
from skimage.feature import hog

# Folders are relative to the project root. Each one holds a subfolder per class.
dataset_paths = [
    os.path.join("archive (3)", "plantvillage", "plantvillage"),
    os.path.join("TomatoDataset", "TomatoDataset")
]

def extract_features(img):
    img = cv2.resize(img, (128, 128))
    lab = cv2.cvtColor(img, cv2.COLOR_BGR2LAB)
    l, a, b = cv2.split(lab)
    clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8))
    cl = clahe.apply(l)
    img_enhanced = cv2.merge((cl, a, b))
    img_enhanced = cv2.cvtColor(img_enhanced, cv2.COLOR_LAB2BGR)
    
    gray = cv2.cvtColor(img_enhanced, cv2.COLOR_BGR2GRAY)
    hog_features = hog(
        gray, orientations=9, pixels_per_cell=(8, 8),
        cells_per_block=(2, 2), transform_sqrt=True, block_norm="L2-Hys"
    )
    
    hsv = cv2.cvtColor(img_enhanced, cv2.COLOR_BGR2HSV)
    hist_h = cv2.calcHist([hsv], [0], None, [32], [0, 180])
    hist_s = cv2.calcHist([hsv], [1], None, [32], [0, 256])
    color_features = np.concatenate([hist_h, hist_s]).flatten()
    cv2.normalize(color_features, color_features)
    
    return np.hstack([hog_features, color_features])

data = []
labels = []

for dataset_path in dataset_paths:
    if not os.path.exists(dataset_path):
        continue
    for folder in os.listdir(dataset_path):
        folder_path = os.path.join(dataset_path, folder)
        if not os.path.isdir(folder_path): continue
        
        label = 0 if "healthy" in folder.lower() else 1
        for img_name in tqdm(os.listdir(folder_path), desc=f"Folder: {folder[:20]}"):
            try:
                img = cv2.imread(os.path.join(folder_path, img_name))
                if img is None: continue
                data.append(extract_features(img))
                labels.append(label)
            except Exception as e:
                print(f"Skipping {img_name}: {e}")

if not data:
    raise SystemExit(f"No training images found. Checked: {dataset_paths}")

X = np.array(data)
y = np.array(labels)

# --- UNDERSAMPLING ---
indices_healthy = np.where(y == 0)[0]
indices_diseased = np.where(y == 1)[0]
n_samples = min(len(indices_healthy), len(indices_diseased))
np.random.seed(42)
new_indices_healthy = np.random.choice(indices_healthy, n_samples, replace=False)
new_indices_diseased = np.random.choice(indices_diseased, n_samples, replace=False)
final_indices = np.concatenate([new_indices_healthy, new_indices_diseased])
X_res = X[final_indices]
y_res = y[final_indices]

# --- TRAINING ---
X_train, X_test, y_train, y_test = train_test_split(
    X_res, y_res, test_size=0.2, random_state=42, stratify=y_res
)

scaler = StandardScaler()
X_train = scaler.fit_transform(X_train)
X_test = scaler.transform(X_test)
model = SVC(kernel='rbf', C=10, gamma='scale', probability=True)
model.fit(X_train, y_train)

y_pred = model.predict(X_test)
print("\nAccuracy:", accuracy_score(y_test, y_pred))
print("\nClassification Report:\n", classification_report(y_test, y_pred, target_names=['Healthy', 'Diseased']))

joblib.dump(model, "tomato_model.pkl")
joblib.dump(scaler, "scaler.pkl")
print("Selesai! Model disimpan.")