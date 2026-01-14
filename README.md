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
