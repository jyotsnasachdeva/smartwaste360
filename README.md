# SmartWaste360

SmartWaste360 is a smart city waste management platform built for the AI Tool Development Challenge. It combines a citizen-facing sustainability assistant with a municipal operations dashboard to improve segregation, reporting, monitoring, route planning, and waste governance under SDG 11.

The platform is designed as a full-stack web application with:
- a React + Vite frontend
- a FastAPI + SQLite backend
- realistic mock AI inference for classification, detection, and prediction
- a Gemini-ready chatbot integration path

## Problem Statement

Urban waste systems often struggle with:
- poor waste segregation at source
- overflowing bins and delayed collection
- illegal dumping detection delays
- inefficient route planning
- low citizen engagement and weak transparency

SmartWaste360 addresses these issues through a single platform for both citizens and municipal teams.

## Solution Overview

SmartWaste360 provides two core operating modes:

### Citizen Dashboard
- Waste image scan and classification
- Disposal guidance with bin color recommendations
- Explainability heatmap for trust and transparency
- WasteBot assistant for recycling questions
- Complaint submission and tracking
- Green Points reward system
- Blockchain-style personal action ledger
- City leaderboard for engagement

### Municipal Dashboard
- Live city bin map with fill levels
- Smart bin status monitoring
- Fill-level prediction and urgency ranking
- Illegal dumping camera detection workflow
- Collection route optimization
- Operational analytics and charts
- Blockchain-style municipal event ledger

## Mock AI Modules

The system is intentionally demo-friendly while preserving a realistic product feel.

### 1. Waste Classifier
- Simulates a DenseNet-201 + MaxViT dual-stream classifier
- Returns class, confidence, recyclability, bin color, disposal instruction, processing time, and benchmark info
- Generates a Score-CAM style heatmap overlay

### 2. Waste Detector
- Simulates a GELAN-E / YOLO-style detector
- Returns 1-3 object detections with labels, confidence scores, and bounding boxes
- Produces an annotated image output
- Flags illegal dumping scenarios

### 3. Fill-Level Predictor
- Simulates an LSTM-based prediction model
- Estimates hours until a bin becomes full
- Returns prediction confidence interval, trend, fill rate, and expected timestamp

## Tech Stack

### Frontend
- React 18
- Vite
- Tailwind CSS
- React Router
- Leaflet
- Recharts
- Axios
- React Hot Toast

### Backend
- FastAPI
- SQLite
- SQLAlchemy
- python-dotenv
- Pillow
- google-generativeai

## Project Structure

```text
smartwaste360/
  frontend/
    src/
    public/
    package.json
    vercel.json
  backend/
    inference/
    routers/
    main.py
    database.py
    mock_data.py
    requirements.txt
  render.yaml
  package.json
  README.md
```

## Key Features

- Dual dashboard architecture for citizen and municipal workflows
- AI-powered waste scan experience with explainability output
- Smart complaints and civic participation layer
- Live camera alert simulation for dumping incidents
- Predictive monitoring for fill-level based collection planning
- Route generation for higher-priority bins
- Operational charts and SDG-aligned metrics
- Blockchain-style immutable activity presentation for demo transparency

## Local Setup

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd smartwaste360
```

### 2. Install root dependency

```bash
npm install
```

### 3. Install frontend dependencies

```bash
cd frontend
npm install
```

### 4. Install backend dependencies

```bash
cd ../backend
pip install -r requirements.txt
```

### 5. Configure environment files

Backend `.env`

```env
GEMINI_API_KEY=your_key_here
DATABASE_URL=sqlite:///./smartwaste360.db
ENVIRONMENT=development
```

Frontend `.env`

```env
VITE_API_URL=http://localhost:8000
```

### 6. Start the full application

```bash
cd ..
npm run dev
```

This starts:
- Frontend: `http://localhost:5173`
- Backend: `http://localhost:8000`

## Deployment

### Frontend
- Hosted on Vercel
- Production URL: [https://jyotsna-smartwaste360.vercel.app](https://jyotsna-smartwaste360.vercel.app)

Required Vercel environment variable:

```env
VITE_API_URL=https://smart-waste360-backend.onrender.com
```

### Backend
- Hosted on Render
- Production URL: [https://smart-waste360-backend.onrender.com](https://smart-waste360-backend.onrender.com)

Required Render environment variables:

```env
DATABASE_URL=sqlite:///./smartwaste360.db
ENVIRONMENT=production
GEMINI_API_KEY=your_key_here
FRONTEND_URL=https://jyotsna-smartwaste360.vercel.app
```

## API Highlights

Core backend routes include:

- `POST /api/classify`
- `POST /api/detect/camera`
- `GET /api/bins/status`
- `POST /api/routes/optimize`
- `GET /api/predict/all`
- `POST /api/chatbot`
- `POST /api/complaints`
- `GET /api/complaints/{user_id}`
- `GET /api/leaderboard`
- `GET /api/blockchain/all-records`
- `POST /api/blockchain/log-disposal`

## SDG Alignment

SmartWaste360 is aligned with **SDG 11: Sustainable Cities and Communities**, especially SDG 11.6, which focuses on reducing the environmental impact of cities through better municipal waste management.

## Team

- Team ID: `AITC-07-013`
- Team Name: `REAPERS`
- Project Title: `SMART WASTE MANAGEMENT SYSTEM`
- Product Name: `SmartWaste360`

## Demo Value

SmartWaste360 is built to demonstrate how AI-assisted citizen behavior, predictive municipal monitoring, and transparent operational logging can work together in a practical smart-city waste ecosystem.
