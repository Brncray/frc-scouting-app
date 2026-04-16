# FRC Scouting App

Offline-first scouting app for FIRST Robotics Competition. Create custom forms, collect match data, and transfer everything via QR codes — no internet required.

## Features

- **Form Builder** — drag-and-drop builder with 8 field types: text, number, counter, checkbox, dropdown, rating, stopwatch, and image annotation (draw on imported images)
- **QR Data Transfer** — export forms and submissions as QR codes. Large payloads automatically split into multi-QR carousels with progress tracking
- **Data Dashboard** — view submissions in sortable tables, with auto-generated charts (histograms, pie charts, bar charts) per field
- **Two Modes** — Admin mode (create forms, view data, import submissions) and Scout mode (import forms, fill out data, export submissions)
- **Fully Offline** — SQLite local database, no server or internet needed. Data moves between devices via QR codes scanned with the webcam

## Tech Stack

- Electron + React 18 + TypeScript
- Vite build system
- Tailwind CSS v4
- better-sqlite3 (local persistence)
- @dnd-kit (drag-and-drop form builder)
- react-konva (image annotation canvas)
- pako + qrcode + html5-qrcode (QR codec with compression and chunking)
- recharts (data visualization)
- zustand (state management)

## Getting Started

```bash
npm install
npm run dev
```

## How It Works

1. **Admin** creates a scouting form with the desired fields
2. **Admin** exports the form as a QR code
3. **Scout** scans the QR code to import the form
4. **Scout** fills out the form for each match and generates a QR code per submission
5. **Admin** scans the submission QR codes to collect all the data
6. **Admin** views aggregated data in the dashboard

## Building

```bash
npm run build
```
