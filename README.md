# Sunnah Timetable App

A location-aware Islamic prayer times application built with **React Native (Expo)** and **Django**.

## Features
* **Smart Geolocation:** Automatically detects user location (Lat/Lng) to fetch accurate times.
* **Theological Precision:** Backend engine implements ISNA (15°) and custom "Islamic Midnight" calculations.
* **Dynamic Madhab Toggle:** Switches instantly between Hanafi and Shafi calculation standards.
* **Offline Resilience:** Caches data locally using AsyncStorage for travel reliability.
* **Travel Tech:** Handles timezone adjustments and high-latitude calculations (London/UK).

## Tech Stack
* **Frontend:** React Native, Expo, TypeScript, Linear Gradient
* **Backend:** Python, Django, Django REST Framework (DRF)
* **State Management:** React Hooks
* **Persistence:** AsyncStorage

## How to Run Locally

This project uses a split architecture: **Django** (Backend) and **React Native** (Frontend). You need to run both terminals simultaneously.

### 1. Backend Setup (Django)
Navigate to the root directory and set up the Python environment.

```bash
# 1. Create a virtual environment
python3 -m venv venv

# 2. Activate the virtual environment
# Mac/Linux:
source venv/bin/activate
# Windows:
venv\Scripts\activate

# 3. Install dependencies
pip install -r requirements.txt

# 4. Initialize the database
python manage.py migrate

# 5. Run the server
python manage.py runserver 0.0.0.0:8000
2. Frontend Setup (React Native)
Open a new terminal window for the frontend.

Bash

# 1. Install Node modules
npm install

# 2. IMPORTANT: Configure API Connection
# Open 'app/index.tsx' and locate the BASE_URL variable.
# Replace '[http://127.0.0.1:8000](http://127.0.0.1:8000)' with your machine's local LAN IP (e.g., 192.168.1.XX)
# so your phone can talk to your laptop.

# 3. Start the application
npx expo start
3. View on Your Phone
Download the Expo Go app from the App Store or Play Store.

Scan the QR code shown in the frontend terminal.