# Eduverse AI - Project Structure

This project has been reorganized into a standard structure with a separated frontend and backend.

## Project Structure
```
root/
├── backend/            # Flask Python Backend
│   ├── app.py          # Entry point for backend
│   └── routes/         # Backend API routes
│       ├── career.py
│       ├── roi.py      (stub)
│       └── ...
├── frontend/           # React Frontend
│   ├── public/         # Static assets
│   ├── src/            # Source code
│   │   ├── components/ # Reusable UI components
│   │   ├── pages/      # Page-level components
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
└── README.md
```

## How to Run

### 1. Run the Backend (Python)
Open a terminal and navigate to the `backend` folder:
```powershell
cd backend
pip install flask flask-cors
python app.py
```
The backend will run on `http://localhost:5000`.

### 2. Run the Frontend (React)
Open a **new** terminal and navigate to the `frontend` folder:
```powershell
cd frontend
npm install
npm start
```
The frontend will run on `http://localhost:3000`.

> [!NOTE]
> I have created stub files for some backend routes (`roi.py`, `loan.py`, `chatbot.py`, `timeline.py`) because only `career.py` was present in the initial download. You can implement the actual logic in these files as needed.
