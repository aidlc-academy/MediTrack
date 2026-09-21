# MediTrack – Personal Medicine Tracker
## Implementation Tasks

**Version:** 1.0.0
**Date:** 2026-09-21
**Status:** Approved

---

## Phase 1: Specification

### TASK-1: Kiro Spec Files
- Create `.kiro/specs/meditrack/requirements.md`
- Create `.kiro/specs/meditrack/design.md`
- Create `.kiro/specs/meditrack/tasks.md`
- Traces to: all FRs and NFRs

---

## Phase 2: HTML Structure

### TASK-2: index.html Skeleton
- `<head>`: charset, viewport, title, link to style.css
- Sidebar with nav links (Dashboard, All Medicines, Symptom Search, Add Medicine)
- Mobile header with hamburger and logo
- Mobile overlay backdrop
- Main content area with four page divs: `#page-dashboard`, `#page-medicines`, `#page-symptom-search`, `#page-add-edit`
- Delete confirmation modal (`#delete-modal`)
- Toast container (`#toast-container`)
- `<script src="script.js">` at end of body
- Traces to: FR-1, FR-12

### TASK-3: Dashboard Page Markup
- Stats grid (5 cards: total, active, expiring-soon, expired, low-stock)
- Notification area div
- Symptom search widget (input + button + results)
- Four category sections (Active, Expiring Soon, Expired, Low Stock) each with header, count badge, and card container
- Traces to: FR-1, FR-5, FR-8

### TASK-4: All Medicines Page Markup
- Search input bar
- Status filter chips (All, Active, Expiring Soon, Expired, Low Stock)
- Type filter dropdown
- Medicine grid container
- Traces to: FR-7, FR-9

### TASK-5: Add/Edit Form Markup
- Form title (dynamically set to "Add Medicine" or "Edit Medicine")
- All fields: name, type (select), useCase, symptoms, dosage, quantity, minimumStock, expiryDate, notes
- Inline error message spans under each required field
- Submit and Cancel buttons
- Traces to: FR-2, FR-3, FR-13

---

## Phase 3: CSS

### TASK-6: CSS Variables and Reset
- Define all CSS custom properties (colours, spacing, radius, shadow)
- Minimal reset (box-sizing, margin, padding)
- Traces to: NFR-2

### TASK-7: Layout — Sidebar and Main
- Fixed sidebar on desktop (240px wide)
- Sidebar hidden off-canvas on mobile, slides in on hamburger click
- Main content offset by sidebar width on desktop
- Traces to: FR-12

### TASK-8: Navigation Styles
- Active nav link highlight
- Sidebar logo/brand area
- Mobile header bar
- Traces to: FR-12

### TASK-9: Dashboard Styles
- Responsive stats grid (5 cols desktop, 2–3 cols tablet, 2 cols mobile)
- Stat card with icon, number, label
- Notification banners (expired = red, expiring = amber, dismissible)
- Category section headers with count badge
- Traces to: FR-1, FR-5

### TASK-10: Medicine Card Styles
- Card with border, rounded corners, hover shadow
- Status badge colour variants (active, expiring_soon, expired, low_stock)
- Type badge (neutral)
- Expiry warning card border (amber for expiring, red for expired)
- Action buttons (edit icon, delete icon)
- Traces to: FR-1.3, FR-1.4

### TASK-11: Form Styles
- Field groups with label and input
- Inline error message styling (red, small)
- Toggle switch for prescription (if added)
- Submit/cancel button row
- Traces to: FR-2, FR-13

### TASK-12: Modal and Toast Styles
- Centered overlay modal with backdrop
- Delete confirmation modal
- Toast notifications (success green, error red, auto-dismiss)
- Traces to: FR-4, NFR-2.4

### TASK-13: Search and Filter Styles
- Search input with icon
- Filter chip buttons (active state highlighted)
- Symptom result cards with left accent border
- Example search chips
- Traces to: FR-7, FR-8, FR-9

### TASK-14: Responsive Overrides
- Tablet and mobile media queries
- Single-column card grid on mobile
- Full-width forms on mobile
- Traces to: FR-12

### TASK-15: Empty State Styles
- Centered empty state with icon and message
- Traces to: FR-1.5

---

## Phase 4: JavaScript — Data Layer

### TASK-16: Config and Constants
- `STORAGE_KEY = 'meditrack_medicines'`
- `EXPIRY_WARNING_DAYS = 30`
- Traces to: FR-10

### TASK-17: localStorage CRUD
- `loadMedicines()` — parse JSON from localStorage, return array
- `saveMedicines(arr)` — stringify and write to localStorage
- `addMedicine(data)` — generate ID, add createdAt, push, save
- `updateMedicine(id, data)` — find by id, merge, save
- `deleteMedicine(id)` — filter out, save
- Traces to: FR-2, FR-3, FR-4, FR-10

### TASK-18: ID Generator
- `generateId()` — returns `mt_${Date.now()}_${randomAlpha(5)}`
- Traces to: FR-2.3

### TASK-19: Expiry Classification
- `classifyMedicine(med)` — returns 'active' | 'expiring_soon' | 'expired'
- `isLowStock(med)` — returns boolean
- `enrichMedicine(med)` — attaches `.status`, `.isLowStock`, `.daysLeft`
- Traces to: FR-5, FR-6

### TASK-20: Demo Data Seed
- `seedDemoData()` — called only when localStorage is empty
- At least 8 medicines: 3 active, 1 expiring soon (≤30 days), 1 expired, 1 low stock, 1 both low+expiring, 1 prescription
- All have `"(Demo)"` in notes
- Traces to: FR-11

---

## Phase 5: JavaScript — Rendering

### TASK-21: Navigation and Page Switching
- `showPage(pageId)` — hide all pages, show target, update nav active state
- `initNav()` — attach click handlers to nav links
- Mobile sidebar open/close (hamburger, overlay click)
- Traces to: FR-12

### TASK-22: Stats Panel
- `renderStats(medicines)` — count totals and update stat card numbers
- Stat card click navigates to All Medicines with relevant filter pre-applied
- Traces to: FR-1.1

### TASK-23: Notification Banners
- `renderNotifications(medicines)` — build dismissible banners for expired/expiring-soon
- Expired: "⚠ [Name] has expired."
- Expiring: "[Name] expires in X days."
- Dismiss button removes banner from DOM (not from data)
- Traces to: FR-5.3

### TASK-24: Category Sections
- `renderCategorySection(containerId, medicines, emptyMsg)` — populate card grid
- Four sections: active (non-low-stock), expiring soon, expired, low stock
- Each section shows count in heading badge
- Traces to: FR-1.2, FR-1.5

### TASK-25: Medicine Card
- `renderMedicineCard(med)` — returns HTML string for a card
- Includes: name, status badge, type badge, low-stock badge, use case, quantity, expiry date, edit button, delete button
- Traces to: FR-1.3, FR-1.4

### TASK-26: All Medicines Page
- `renderMedicinesPage()` — render full grid with active search/filter state
- Traces to: FR-7, FR-9

### TASK-27: Render All (top-level refresh)
- `renderAll()` — calls renderDashboard + renderMedicinesPage
- Called after every data mutation (add, edit, delete)
- Traces to: all render tasks

---

## Phase 6: JavaScript — Forms

### TASK-28: Open Add Form
- `openAddForm()` — clear form, set title to "Add Medicine", show page
- Traces to: FR-2

### TASK-29: Open Edit Form
- `openEditForm(id)` — load medicine by id, populate all fields, set title, show page
- Traces to: FR-3

### TASK-30: Form Validation
- `validateForm()` — check all required fields, display inline errors, return boolean
- Traces to: FR-13

### TASK-31: Form Submission
- `submitForm()` — validate, then call addMedicine or updateMedicine, show toast, navigate to dashboard
- Traces to: FR-2, FR-3

---

## Phase 7: JavaScript — Search and Filter

### TASK-32: General Search
- Text input listener on All Medicines page — filter by name, useCase, symptoms (case-insensitive)
- Traces to: FR-7

### TASK-33: Status and Type Filters
- Filter chip click handlers — set active filter, re-render medicines page
- Type dropdown change handler
- Combined with text search
- Traces to: FR-9

### TASK-34: Symptom Search
- `extractTokens(query)` — lowercase, strip punctuation, split, remove stop words, keep length ≥ 3
- `scoreMatch(med, tokens)` — score symptoms (+2) and useCase (+2) and name (+1) matches
- `performSymptomSearch(query)` — get non-expired medicines, score, filter > 0, sort desc
- Display results with disclaimer label
- Example chips trigger search
- Traces to: FR-8

---

## Phase 8: JavaScript — Modals and Toasts

### TASK-35: Delete Modal
- `showDeleteModal(id, name)` — populate modal with medicine name, store pending id
- `confirmDelete()` — call deleteMedicine, close modal, show toast, renderAll
- Cancel button closes modal
- Traces to: FR-4

### TASK-36: Toast Notifications
- `showToast(message, type)` — create toast div, auto-dismiss after 3s
- Types: success (green), error (red)
- Traces to: NFR-2.4

---

## Phase 9: Documentation

### TASK-37: README.md
- Project name and description
- Feature list
- Technologies used
- How localStorage is used
- How to run (open index.html)
- Safety disclaimer for symptom search
- Traces to: FR-16

---

## Phase 10: Testing and Verification

### TASK-38: Test All Flows
- Add medicine → appears on dashboard
- Edit medicine → changes persist after refresh
- Delete medicine → removed, confirmed via modal
- General search → name/useCase/symptom match
- Symptom search → keyword match, NLP input
- Expired medicines excluded from search results
- Expiry classification (active/expiring/expired)
- Low stock detection
- Filters (status + type combined)
- localStorage persists on page refresh
- Empty state shows when no matches
- Responsive layout at mobile width

### TASK-39: Fix Errors
- Resolve any JS console errors
- Verify all event listeners are attached
- Verify form validation fires correctly
- Verify delete modal opens and closes cleanly

---

## Traceability Matrix

| Requirement | Tasks                          |
|-------------|--------------------------------|
| FR-1        | TASK-22, 23, 24, 25            |
| FR-2        | TASK-17, 28, 30, 31            |
| FR-3        | TASK-17, 29, 30, 31            |
| FR-4        | TASK-17, 35                    |
| FR-5        | TASK-19, 23, 24                |
| FR-6        | TASK-19, 24, 25                |
| FR-7        | TASK-32                        |
| FR-8        | TASK-34                        |
| FR-9        | TASK-33                        |
| FR-10       | TASK-16, 17                    |
| FR-11       | TASK-20                        |
| FR-12       | TASK-7, 8, 14, 21              |
| FR-13       | TASK-30                        |
| NFR-1       | TASK-34 (disclaimer)           |
| NFR-2       | TASK-6, 36                     |
| NFR-4       | TASK-2 (no build required)     |
