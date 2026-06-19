# ATIN — AI Traffic Intelligence Network
### Flipkart Gridlock 2.0 Hackathon Build

ATIN is a city-scale traffic intelligence platform containing 4 key modules:
1. **Evidence Authenticity Engine (EAS)** — Filters & scores incoming citizen traffic photos using EXIF geo/time tags, OpenCV Laplacian blur checks, and perceptual uniqueness hashes.
2. **Enforcement Priority Engine** — Clusters traffic reports spatially (DBSCAN) and ranks hotspot deployment urgency.
3. **Congestion Prediction Layer** — A LightGBM model trained on spatio-temporal panel datasets predicting future demand/congestion.
4. **City Operations Dashboard** — A live interactive command center with AI-generated patrol deployment narratives.

---

## 🛠️ Project Structure
```text
Codebase/
├── backend/
│   ├── main.py            # FastAPI Application (EAS validation, Hotspots & predictions)
│   ├── ml_pipeline.py     # LightGBM training pipeline with OOF target encoding
│   ├── requirements.txt   # Python backend dependencies
│   └── model/             # Model training metadata & prediction outputs
├── frontend/
│   ├── src/               # React components, leaflet maps, charts & styling
│   ├── index.html         # HTML entry with Leaflet support
│   └── package.json       # Node frontend dependencies
└── README.md              # Instructions to run the application
```

---

## ⚡ Setup & Execution Instructions

Follow these steps to run both services on your local environment:

### Step 1: Start the Backend Server (FastAPI)
Open a new terminal and navigate to the backend directory:
```bash
cd backend
```
Install the Python dependencies:
```bash
pip install -r requirements.txt
```
Run the FastAPI application (served on port `8000`):
```bash
python main.py
```

### Step 2: Start the Frontend Server (Vite + React)
Open a separate terminal window and navigate to the frontend directory:
```bash
cd frontend
```
Install the Node modules:
```bash
npm install
```
Start the development server (served on port `5173`):
```bash
npm run dev
```

### Step 3: Access the Application
Once both services are running:
* **Interactive Dashboard:** Open your browser and navigate to `http://localhost:5173`
* **API Documentation (Swagger):** Open `http://localhost:8000/docs` to test endpoints interactively.

---

## 🧠 Optional: Retraining the LightGBM Pipeline
If you wish to retrain the LightGBM prediction model on the dataset:
1. Ensure the training CSV files (`train.csv`, `test.csv`, and `submission.csv`) are located in the parent directory (`../`).
2. Run the pipeline script from the backend directory:
   ```bash
   python ml_pipeline.py
   ```
3. The trained metrics and predictions will be saved directly inside the `backend/model/` directory and loaded by the API.

---

## 🚀 Cloud Deployment

We have configured the codebase to support seamless deployment using **Render Blueprints** (via the `render.yaml` file in the root).

### Deploying with Render (Recommended & Configured)
Render can build and run both the FastAPI backend and the React frontend static site, automatically linking them:

1. **Push your code to GitHub** (already completed).
2. Go to the [Render Dashboard](https://dashboard.render.com/) and sign in.
3. Click **New +** and select **Blueprint**.
4. Connect your GitHub repository (`Param24-byte/AINT`).
5. Render will automatically read the `render.yaml` configuration and set up:
   * **`atin-backend`** (Python Web Service running FastAPI)
   * **`atin-frontend`** (Static site hosting React/Vite)
6. Click **Apply** to start the automatic deployment.

