# MediTrack – Personal Medicine Tracker
## Requirements Specification

**Version:** 1.0.0
**Date:** 2026-09-21
**Status:** Approved

---

## 1. Project Overview

MediTrack is a frontend-only personal medicine inventory and expiry tracking application. Users manage their medicine inventory, track expiry dates and stock levels, and search stored medicines by symptom or use case. All data is persisted exclusively in browser localStorage. No backend, database, server, or external API is used at any point.

---

## 2. Technical Constraints

- **Allowed:** HTML5, CSS3, Vanilla JavaScript, browser localStorage
- **Forbidden:** Any backend (Node.js, Express, etc.), any database (PostgreSQL, MySQL, MongoDB, etc.), any external API, any authentication system, any build tool (no package.json required)
- **Entry point:** The application must run by opening `index.html` in any modern browser

---

## 3. Functional Requirements

### FR-1: Dashboard
- FR-1.1: Display summary statistics: Total Medicines, Active, Expiring Soon, Expired, Low Stock counts.
- FR-1.2: Display medicines grouped into named categories: Active Medicines, Expiring Soon, Expired Medicines, Low Stock.
- FR-1.3: Each medicine card shows: name, type, use case, quantity, expiry date, status badge.
- FR-1.4: Status badges use colour coding: 🟢 Active, 🟡 Expiring Soon, 🔴 Expired, 🟠 Low Stock.
- FR-1.5: Show a friendly empty state when a category contains no medicines.

### FR-2: Add Medicine
- FR-2.1: Provide an Add Medicine form with the following fields:
  - Medicine Name (required)
  - Medicine Type — Tablet, Capsule, Syrup, Cream, Drops, Other (required)
  - Use Case / Purpose (required)
  - Symptoms (required)
  - Dosage (optional)
  - Quantity (required, non-negative integer)
  - Minimum Stock Level (required, non-negative integer)
  - Expiry Date (required, valid date)
  - Notes (optional)
- FR-2.2: Validate all required fields before saving; show inline error messages near the failing field.
- FR-2.3: On successful save, generate a unique ID and store the medicine in localStorage under key `meditrack_medicines`.
- FR-2.4: Each stored medicine record contains: id, name, type, useCase, symptoms, dosage, quantity, minimumStock, expiryDate, notes, createdAt.

### FR-3: Edit Medicine
- FR-3.1: Allow editing all fields of any existing medicine.
- FR-3.2: The edit form must pre-populate with the medicine's current values.
- FR-3.3: On save, update the record in localStorage and refresh the UI immediately.

### FR-4: Delete Medicine
- FR-4.1: Allow deleting any medicine.
- FR-4.2: Show a confirmation dialog before deletion: "Are you sure you want to delete [medicine name]?"
- FR-4.3: On confirmation, remove the record from localStorage and refresh the UI.

### FR-5: Expiry Classification
- FR-5.1: Classify each medicine's status automatically on every page load and UI refresh using the current date.
- FR-5.2: Classification rules:
  - **Expired**: expiry date has passed (today > expiryDate)
  - **Expiring Soon**: expiry date is within the next 30 days (0 ≤ days remaining ≤ 30)
  - **Active**: expiry date is more than 30 days away
- FR-5.3: Display an expiry warning for expired medicines: "⚠ [Name] has expired."
- FR-5.4: Expired medicines must not appear as available/active matches in symptom search results.
- FR-5.5: No server-side process is required; classification is purely client-side on every load.

### FR-6: Low Stock Tracking
- FR-6.1: If quantity <= minimumStock, classify the medicine as Low Stock.
- FR-6.2: Low Stock medicines appear in the Low Stock dashboard section.
- FR-6.3: Medicine cards for low-stock items show a visible Low Stock indicator.

### FR-7: General Search
- FR-7.1: Provide a search bar that filters medicines by name, use case, and symptoms (case-insensitive substring match).
- FR-7.2: Expired medicines must not appear as available matches in search results.

### FR-8: Symptom Search
- FR-8.1: Provide a dedicated "Search by Symptom" input.
- FR-8.2: Match search terms against the stored symptoms and useCase fields of each non-expired medicine.
- FR-8.3: Support simple natural language input such as "I have a headache and fever" by extracting keyword tokens.
- FR-8.4: Results are labelled "Matches your stored medicine information" — never a medical recommendation.
- FR-8.5: The application must NOT diagnose the user, recommend treatment, or claim medical suitability.
- FR-8.6: Provide example search chips: headache, fever, cough, cold, allergy, stomach pain.

### FR-9: Filters
- FR-9.1: Provide filter buttons: All, Active, Expiring Soon, Expired, Low Stock.
- FR-9.2: Provide a medicine type filter (All Types, Tablet, Capsule, Syrup, Cream, Drops, Other).
- FR-9.3: Filters and text search must work together (combined).

### FR-10: localStorage Persistence
- FR-10.1: All medicine data is stored in localStorage under key `meditrack_medicines` as a JSON array.
- FR-10.2: Data must survive page refresh.
- FR-10.3: On first load with no data, seed demo medicines automatically.
- FR-10.4: If localStorage data is present, skip seeding and load existing data.

### FR-11: Demo Data
- FR-11.1: On first launch (no existing localStorage data), seed at least 8 sample medicines.
- FR-11.2: Demo data must include: at least 2 active, 1 expiring soon, 1 expired, 1 low stock medicine.
- FR-11.3: Demo medicines are labelled "(Demo)" in their notes field.
- FR-11.4: Demo medicines can be deleted by the user like any other medicine.

### FR-12: Responsive UI
- FR-12.1: The application must be fully usable on desktop (≥1024px), tablet (640–1023px), and mobile (<640px).
- FR-12.2: Navigation adapts to smaller screens.
- FR-12.3: Forms, cards, and modals are usable on touch devices.

### FR-13: Data Validation
- FR-13.1: Medicine name must not be empty.
- FR-13.2: Use case must not be empty.
- FR-13.3: Quantity must be a non-negative integer.
- FR-13.4: Minimum stock must be a non-negative integer.
- FR-13.5: Expiry date must be a valid calendar date.
- FR-13.6: Validation errors are displayed inline near the relevant field, not as a single alert.

---

## 4. Non-Functional Requirements

### NFR-1: Safety
- NFR-1.1: The application must never tell the user to take a specific medicine.
- NFR-1.2: Symptom search results must carry the label "Matches your stored medicine information."
- NFR-1.3: Prescription status display is informational only.

### NFR-2: Usability
- NFR-2.1: Healthcare-style colour scheme (blues, greens, clean whites).
- NFR-2.2: All interactive elements must have visible focus/hover states.
- NFR-2.3: Empty states display friendly messages, not blank areas.
- NFR-2.4: Success and error feedback is shown to the user after actions.

### NFR-3: Performance
- NFR-3.1: The application must load and be interactive within 2 seconds on a modern browser.
- NFR-3.2: All UI updates happen synchronously; no loading spinners needed for localStorage reads.

### NFR-4: Compatibility
- NFR-4.1: Must work in Chrome, Firefox, Safari, and Edge (current versions).
- NFR-4.2: No build step required; plain `.html`, `.css`, `.js` files only.

---

## 5. Out of Scope

- User authentication or multi-user support
- Cloud sync or remote storage
- Push/browser notifications
- Barcode scanning
- Medical advice, diagnosis, or drug interaction checking
- Any server-side component
