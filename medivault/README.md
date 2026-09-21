# MediTrack – Personal Medicine Tracker

A lightweight, frontend-only personal medicine inventory and expiry tracking application.
No backend. No database. No installation. Just open `index.html` in your browser.

> ⚠️ **Safety Notice:** MediTrack is a personal inventory tool only. It does not provide
> medical advice, diagnoses, or treatment recommendations. Always consult a qualified
> healthcare professional before taking any medicine.

---

## Features

| Feature | Description |
|---|---|
| **Dashboard** | Summary stats (total, active, expiring, expired, low stock) + category sections |
| **Add Medicine** | Form with full validation to add medicines to your inventory |
| **Edit Medicine** | Pre-populated edit form for any existing medicine |
| **Delete Medicine** | Delete with confirmation dialog |
| **Expiry Classification** | Automatic: Active / Expiring Soon (≤30 days) / Expired |
| **Expiry Notifications** | Dismissible in-app alerts for expired and expiring-soon medicines |
| **Low Stock Tracking** | Per-medicine minimum stock threshold with visual warnings |
| **General Search** | Search by name, use case, or symptoms across All Medicines |
| **Symptom Search** | Match symptom keywords against your stored medicine records |
| **Natural Language Search** | "I have a headache and fever" → keyword extraction → matching results |
| **Filters** | Filter by status (active/expiring/expired/low stock) and medicine type |
| **Demo Data** | 10 sample medicines loaded on first run (covering all status types) |
| **Responsive** | Works on desktop, tablet, and mobile |

---

## Technologies Used

- **HTML5** — semantic markup, single `index.html` entry point
- **CSS3** — CSS custom properties, flexbox, grid, responsive media queries
- **Vanilla JavaScript (ES6+)** — no frameworks, no libraries, no build tools
- **Browser localStorage** — all data stored locally in the browser

No npm. No Node.js. No PostgreSQL. No external services.

---

## How to Run

1. Download or clone the project
2. Open `index.html` in any modern web browser (Chrome, Firefox, Safari, Edge)

That's it. No server, no install step, no configuration.

```
Double-click index.html
```

or right-click → "Open with" → your browser.

---

## How localStorage is Used

All medicine data is stored in the browser's localStorage under the key `meditrack_medicines`
as a JSON array.

**Storage key:** `meditrack_medicines`

**Each medicine record:**
```json
{
  "id":           "mt_1695000000000_a1b2c",
  "name":         "Paracetamol",
  "type":         "Tablet",
  "useCase":      "Fever, headache, pain relief",
  "symptoms":     "headache, fever, body ache, pain",
  "dosage":       "500mg every 4–6 hours",
  "quantity":     24,
  "minimumStock": 5,
  "expiryDate":   "2027-03-01",
  "notes":        "",
  "createdAt":    "2026-09-21T17:00:00.000Z"
}
```

Data persists across page refreshes and browser sessions on the same device.
Clearing browser data will reset the inventory.

---

## Demo Data

On first launch (empty localStorage), MediTrack loads 10 sample medicines:

| Medicine | Status | Note |
|---|---|---|
| Paracetamol | Active | headache, fever |
| Ibuprofen | Expiring Soon | ~18 days left |
| Cetirizine | Active | allergy, hay fever |
| Cough Syrup | Active | cough, cold |
| Omeprazole | Expired | acid reflux |
| Hydrocortisone Cream | Active | skin rash, eczema |
| Amoxicillin | Active + Low Stock | ear/throat infection |
| Vitamin D3 | Active | fatigue, immunity |
| Zinc Drops | Expiring Soon + Low Stock | cold, immunity |
| Loratadine | Expired | allergy |

All demo medicines have `(Demo)` in their notes. You can delete or edit them normally.

---

## Expiry Classification Rules

Computed entirely client-side on every page load:

| Status | Rule |
|---|---|
| **🔴 Expired** | Today's date is after the expiry date |
| **🟡 Expiring Soon** | Expiry date is within the next 30 days |
| **🟢 Active** | Expiry date is more than 30 days away |
| **🟠 Low Stock** | Current quantity ≤ minimum stock level (can combine with any status) |

---

## Symptom Search — Safety Disclaimer

The symptom search feature matches your entered keywords against the symptoms and use-case
text **you recorded** for each medicine in your inventory.

- It **does not** diagnose any medical condition.
- It **does not** recommend any medicine as a treatment.
- It **does not** access any medical database or external service.
- Results are labelled **"Matches your stored medicine information"**.
- **Expired medicines are excluded** from all search results.

Always consult a qualified healthcare professional before taking any medicine.

---

## Project Structure

```
medivault/
├── .kiro/
│   └── specs/
│       └── meditrack/
│           ├── requirements.md   ← Functional & non-functional requirements
│           ├── design.md         ← Architecture, data schema, algorithms
│           └── tasks.md          ← Implementation task list + traceability
├── index.html                    ← Full application markup
├── style.css                     ← All styles (responsive, no dependencies)
├── script.js                     ← All application logic (vanilla JS)
└── README.md                     ← This file
```
