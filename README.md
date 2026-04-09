# SmartWaste360

SmartWaste360 is a full-stack hackathon demo for smart city waste management. It pairs a React + Vite frontend with a FastAPI + SQLite backend and simulates three AI capabilities:

- Waste classification with explainability
- Waste detection for citizen uploads and camera alerts
- Bin fill forecasting and route planning

## Structure

```text
smartwaste360/
  frontend/
  backend/
  README.md
```

## Install

Frontend:

```bash
cd frontend
npm install
```

Backend:

```bash
cd backend
pip install -r requirements.txt
```

Root:

```bash
cd ..
npm install
```

## Run

```bash
npm run dev
```

This starts both services:

- Frontend on `http://localhost:5173`
- Backend on `http://localhost:8000`
