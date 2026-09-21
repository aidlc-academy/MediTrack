# MediTrack – Personal Medicine Tracker
## Design Specification

**Version:** 1.0.0
**Date:** 2026-09-21
**Status:** Approved

---

## 1. Architecture

MediTrack is a single-page application (SPA) with zero dependencies:

```
Browser
  └── index.html         ← entry point, full markup skeleton
        ├── style.css    ← all styles, layout, components, responsive
        └── script.js    ← all logic: data, UI, events, localStorage
```

No build step. No npm. No server. Open `index.html` directly.

---

## 2. File Structure

```
medivault/                    (workspace root)
├── .kiro/
│   └── specs/
│       └── meditrack/
│           ├── requirements.md
│           ├── design.md
│           └── tasks.md
├── index.html
├── style.css
├── script.js
└── README.md
```

---

## 3. localStorage Schema

**Key:** `meditrack_medicines`
**Value:** JSON array of medicine objects

```json
[
  {
    "id": "mt_1695000000000_a1b2c",
    "name": "Paracetamol",
    "type": "Tablet",
    "useCase": "Fever, headache, pain relief",
    "symptoms": "headache, fever, body ache, pain",
    "dosage": "500mg every 4–6 hours",
    "quantity": 24,
    "minimumStock": 5,
    "expiryDate": "2027-03-01",
    "notes": "",
    "createdAt": "2026-09-21T17:00:00.000Z"
  }
]
```

**ID format:** `mt_` + `Date.now()` + `_` + 5 random alphanumeric chars

---

## 4. Expiry Classification Algorithm

Computed client-side on every render:

```javascript
function classifyMedicine(medicine) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const expiry = new Date(medicine.expiryDate);
  expiry.setHours(0, 0, 0, 0);
  const daysLeft = Math.floor((expiry - today) / 86400000);

  if (daysLeft < 0)  return 'expired';
  if (daysLeft <= 30) return 'expiring_soon';
  return 'active';
}

function isLowStock(medicine) {
  return medicine.quantity <= medicine.minimumStock;
}
```

A medicine can be both `expiring_soon` AND `low_stock` simultaneously.

---

## 5. Symptom Search Algorithm

```javascript
const STOP_WORDS = new Set(['i','a','an','the','and','or','have','has',
  'am','is','feel','feeling','my','with','some','bit','very','really',
  'also','for','of','in','on','at','to','get','got','been','been']);

function extractTokens(query) {
  return query
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length >= 3 && !STOP_WORDS.has(w));
}

function scoreMatch(medicine, tokens) {
  const text = [medicine.name, medicine.symptoms, medicine.useCase]
    .join(' ').toLowerCase();
  return tokens.reduce((score, token) => {
    if (medicine.symptoms.toLowerCase().includes(token)) return score + 2;
    if (medicine.useCase.toLowerCase().includes(token))  return score + 2;
    if (text.includes(token)) return score + 1;
    return score;
  }, 0);
}
```

Results: score > 0, sorted descending, expired medicines excluded.

---

## 6. UI Structure (HTML sections)

```
<body>
  #app
  ├── #sidebar          (navigation: Dashboard, Medicines, Symptom Search, Add Medicine)
  ├── #mobile-header    (hamburger + logo, visible on mobile)
  ├── #overlay          (mobile sidebar backdrop)
  └── #main-content
      ├── #page-dashboard
      │   ├── .stats-grid         (5 stat cards)
      │   ├── #notification-area  (expiry warnings, dismissible)
      │   ├── #symptom-search-section
      │   └── .category-sections  (Active, Expiring Soon, Expired, Low Stock)
      ├── #page-medicines
      │   ├── #search-bar
      │   ├── #filter-bar         (status + type chips)
      │   └── #medicines-grid
      ├── #page-symptom-search
      │   ├── #symptom-input
      │   ├── .example-chips
      │   └── #symptom-results
      └── #page-add-edit          (shared form for add and edit)
          └── #medicine-form

  <!-- Modals -->
  #delete-modal           (confirmation dialog)
  #toast-container        (success/error toasts)
</body>
```

---

## 7. JavaScript Module Structure (single script.js)

```
script.js
├── CONFIG               (constants: localStorage key, expiry warning days)
├── DATA LAYER
│   ├── loadMedicines()
│   ├── saveMedicines()
│   ├── addMedicine()
│   ├── updateMedicine()
│   ├── deleteMedicine()
│   └── seedDemoData()
├── CLASSIFICATION
│   ├── classifyMedicine()
│   ├── isLowStock()
│   └── enrichMedicine()     (adds .status, .isLowStock, .daysLeft)
├── RENDERING
│   ├── renderDashboard()
│   ├── renderStats()
│   ├── renderNotifications()
│   ├── renderCategorySection()
│   ├── renderMedicineCard()
│   ├── renderMedicinesPage()
│   └── renderSymptomResults()
├── NAVIGATION
│   ├── showPage()
│   └── initNav()
├── FORMS
│   ├── openAddForm()
│   ├── openEditForm()
│   ├── submitForm()
│   └── validateForm()
├── SEARCH & FILTER
│   ├── extractTokens()
│   ├── scoreMatch()
│   ├── applyFilters()
│   └── performSymptomSearch()
├── MODALS & TOASTS
│   ├── showDeleteModal()
│   ├── confirmDelete()
│   └── showToast()
└── INIT
    └── init()               (called on DOMContentLoaded)
```

---

## 8. Design System

### Colour Palette

```css
--color-primary:       #0284c7;   /* sky-600 — main brand */
--color-primary-light: #e0f2fe;   /* sky-100 — hover/bg tints */
--color-success:       #16a34a;   /* green-600 — active */
--color-warning:       #d97706;   /* amber-600 — expiring soon */
--color-danger:        #dc2626;   /* red-600   — expired */
--color-orange:        #ea580c;   /* orange-600 — low stock */
--color-bg:            #f8fafc;   /* slate-50  — page background */
--color-card:          #ffffff;
--color-border:        #e2e8f0;   /* slate-200 */
--color-text:          #1e293b;   /* slate-800 */
--color-text-muted:    #64748b;   /* slate-500 */
```

### Status Badge Classes

| Status        | Background  | Text colour     |
|---------------|-------------|-----------------|
| active        | #dcfce7     | #15803d         |
| expiring_soon | #fef9c3     | #a16207         |
| expired       | #fee2e2     | #b91c1c         |
| low_stock     | #ffedd5     | #c2410c         |

### Typography

- Font: system-ui, -apple-system, sans-serif (no external font load)
- Base size: 16px
- Headings: 600 weight

### Breakpoints

- Mobile: < 640px
- Tablet: 640px – 1023px
- Desktop: ≥ 1024px

---

## 9. Component Designs

### Medicine Card
```
┌─────────────────────────────────┐
│ [Name]              [Exp badge] │
│ [Type badge]  [Low Stock badge] │
│ Use case: ...                   │
│ ─────────────────────────────── │
│ Qty: 24    Exp: 01 Mar 2027     │
│                  [Edit][Delete] │
└─────────────────────────────────┘
```

### Stat Card
```
┌──────────────┐
│  [icon]      │
│  24          │
│  Total       │
└──────────────┘
```

### Delete Modal
```
┌─────────────────────────────────┐
│  ⚠ Delete Medicine              │
│  "Are you sure you want to      │
│   delete [Name]?"               │
│                                 │
│  [Cancel]          [Delete]     │
└─────────────────────────────────┘
```

---

## 10. Navigation Pages

| Page ID              | Nav label       | Description                    |
|----------------------|-----------------|--------------------------------|
| `page-dashboard`     | Dashboard       | Stats + categories + notifs    |
| `page-medicines`     | All Medicines   | Search + filter + full grid    |
| `page-symptom-search`| Symptom Search  | NLP search feature             |
| `page-add-edit`      | Add Medicine    | Add/edit form                  |
