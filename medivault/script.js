/* ═══════════════════════════════════════════════════════════
   MediTrack – script.js
   Vanilla JS SPA — localStorage only, no backend, no APIs
═══════════════════════════════════════════════════════════ */

'use strict';

/* ── 1. CONFIG ────────────────────────────────────────────── */
const STORAGE_KEY          = 'meditrack_medicines';
const EXPIRY_WARNING_DAYS  = 30;

/* ── 2. DATA LAYER ────────────────────────────────────────── */

function loadMedicines() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch (_) {
    return [];
  }
}

function saveMedicines(arr) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(arr));
}

function generateId() {
  const rand = Math.random().toString(36).slice(2, 7);
  return 'mt_' + Date.now() + '_' + rand;
}

function addMedicine(data) {
  const medicines = loadMedicines();
  const med = {
    id:           generateId(),
    name:         data.name.trim(),
    type:         data.type,
    useCase:      data.useCase.trim(),
    symptoms:     data.symptoms.trim(),
    dosage:       (data.dosage || '').trim(),
    quantity:     parseInt(data.quantity, 10),
    minimumStock: parseInt(data.minimumStock, 10),
    expiryDate:   data.expiryDate,
    notes:        (data.notes || '').trim(),
    createdAt:    new Date().toISOString(),
  };
  medicines.push(med);
  saveMedicines(medicines);
  return med;
}

function updateMedicine(id, data) {
  const medicines = loadMedicines();
  const idx = medicines.findIndex(m => m.id === id);
  if (idx === -1) return false;
  medicines[idx] = {
    ...medicines[idx],
    name:         data.name.trim(),
    type:         data.type,
    useCase:      data.useCase.trim(),
    symptoms:     data.symptoms.trim(),
    dosage:       (data.dosage || '').trim(),
    quantity:     parseInt(data.quantity, 10),
    minimumStock: parseInt(data.minimumStock, 10),
    expiryDate:   data.expiryDate,
    notes:        (data.notes || '').trim(),
  };
  saveMedicines(medicines);
  return true;
}

function deleteMedicine(id) {
  const medicines = loadMedicines().filter(m => m.id !== id);
  saveMedicines(medicines);
}

/* ── 3. DEMO DATA ────────────────────────────────────────── */

function addDays(n) {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.toISOString().split('T')[0];
}

const DEMO_MEDICINES = [
  {
    name: 'Paracetamol', type: 'Tablet',
    useCase: 'Fever, headache, mild pain relief',
    symptoms: 'headache, fever, body ache, pain, migraine',
    dosage: '500mg–1000mg every 4–6 hours', quantity: 24, minimumStock: 5,
    expiryDate: addDays(400), notes: '(Demo)',
  },
  {
    name: 'Ibuprofen', type: 'Tablet',
    useCase: 'Pain, inflammation, fever',
    symptoms: 'pain, inflammation, fever, headache, joint pain, toothache, back pain',
    dosage: '200–400mg every 6–8 hours with food', quantity: 12, minimumStock: 6,
    expiryDate: addDays(18), notes: '(Demo) Expiring soon demo',
  },
  {
    name: 'Cetirizine', type: 'Tablet',
    useCase: 'Allergies, hay fever, hives',
    symptoms: 'allergy, hay fever, sneezing, runny nose, itchy eyes, hives, watery eyes',
    dosage: '10mg once daily', quantity: 30, minimumStock: 5,
    expiryDate: addDays(500), notes: '(Demo)',
  },
  {
    name: 'Cough Syrup', type: 'Syrup',
    useCase: 'Dry cough, wet cough, throat irritation',
    symptoms: 'cough, dry cough, wet cough, sore throat, throat irritation, cold',
    dosage: '10ml every 4–6 hours', quantity: 150, minimumStock: 50,
    expiryDate: addDays(300), notes: '(Demo)',
  },
  {
    name: 'Omeprazole', type: 'Capsule',
    useCase: 'Acid reflux, heartburn, stomach ulcers',
    symptoms: 'acid reflux, heartburn, indigestion, stomach pain, bloating',
    dosage: '20mg once daily before breakfast', quantity: 0, minimumStock: 5,
    expiryDate: addDays(-15), notes: '(Demo) Expired demo',
  },
  {
    name: 'Hydrocortisone Cream', type: 'Cream',
    useCase: 'Skin inflammation, eczema, insect bites',
    symptoms: 'skin rash, eczema, itching, insect bite, dermatitis, skin inflammation',
    dosage: 'Apply thin layer 2–4 times daily', quantity: 2, minimumStock: 1,
    expiryDate: addDays(450), notes: '(Demo)',
  },
  {
    name: 'Amoxicillin', type: 'Capsule',
    useCase: 'Bacterial infections — ear, throat, chest',
    symptoms: 'ear infection, throat infection, chest infection, sinusitis',
    dosage: '250–500mg every 8 hours', quantity: 3, minimumStock: 4,
    expiryDate: addDays(180), notes: '(Demo) Low stock demo',
  },
  {
    name: 'Vitamin D3', type: 'Tablet',
    useCase: 'Vitamin D deficiency, bone health, immune support',
    symptoms: 'vitamin D deficiency, fatigue, bone pain, muscle weakness, low immunity',
    dosage: '1000 IU once daily', quantity: 90, minimumStock: 10,
    expiryDate: addDays(700), notes: '(Demo)',
  },
  {
    name: 'Zinc Drops', type: 'Drops',
    useCase: 'Zinc deficiency, immune support',
    symptoms: 'zinc deficiency, low immunity, cold, slow wound healing, fatigue',
    dosage: '10–20 drops once daily', quantity: 1, minimumStock: 1,
    expiryDate: addDays(22), notes: '(Demo) Expiring + low stock demo',
  },
  {
    name: 'Loratadine', type: 'Tablet',
    useCase: 'Allergic rhinitis, seasonal allergies',
    symptoms: 'allergy, runny nose, sneezing, itchy eyes, hives, hay fever',
    dosage: '10mg once daily', quantity: 20, minimumStock: 5,
    expiryDate: addDays(-40), notes: '(Demo) Expired demo',
  },
];

function seedDemoData() {
  const existing = loadMedicines();
  if (existing.length > 0) return; // only seed when empty
  const seeded = DEMO_MEDICINES.map(d => ({
    id:        generateId(),
    createdAt: new Date().toISOString(),
    ...d,
    dosage:    d.dosage || '',
    notes:     d.notes  || '',
  }));
  saveMedicines(seeded);
}

/* ── 4. CLASSIFICATION ───────────────────────────────────── */

function classifyMedicine(med) {
  const today  = new Date(); today.setHours(0,0,0,0);
  const expiry = new Date(med.expiryDate); expiry.setHours(0,0,0,0);
  const daysLeft = Math.floor((expiry - today) / 86400000);
  if (daysLeft < 0)             return 'expired';
  if (daysLeft <= EXPIRY_WARNING_DAYS) return 'expiring_soon';
  return 'active';
}

function isLowStock(med) {
  return med.quantity <= med.minimumStock;
}

function enrichMedicine(med) {
  const today  = new Date(); today.setHours(0,0,0,0);
  const expiry = new Date(med.expiryDate); expiry.setHours(0,0,0,0);
  return {
    ...med,
    status:     classifyMedicine(med),
    isLowStock: isLowStock(med),
    daysLeft:   Math.floor((expiry - today) / 86400000),
  };
}

/* ── 5. DATE FORMATTING ──────────────────────────────────── */

function formatDate(dateStr) {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

/* ── 6. NAVIGATION ───────────────────────────────────────── */

function showPage(pageId) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const target = document.getElementById(pageId);
  if (target) target.classList.add('active');

  document.querySelectorAll('.nav-link').forEach(l => {
    l.classList.toggle('active', l.dataset.page === pageId);
  });

  // Close mobile sidebar
  document.getElementById('sidebar').classList.remove('open');
  document.getElementById('overlay').classList.remove('active');

  // Trigger page-specific render
  if (pageId === 'page-dashboard')    renderDashboard();
  if (pageId === 'page-medicines')    renderMedicinesPage();
}

function initNav() {
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      showPage(link.dataset.page);
    });
  });

  // Hamburger
  document.getElementById('hamburger').addEventListener('click', () => {
    document.getElementById('sidebar').classList.toggle('open');
    document.getElementById('overlay').classList.toggle('active');
  });

  // Overlay click closes sidebar
  document.getElementById('overlay').addEventListener('click', () => {
    document.getElementById('sidebar').classList.remove('open');
    document.getElementById('overlay').classList.remove('active');
  });

  // Stat card clicks → navigate to All Medicines with filter
  document.querySelectorAll('.stat-card').forEach(card => {
    card.addEventListener('click', () => {
      const filter = card.dataset.filter;
      setStatusFilter(filter);
      showPage('page-medicines');
    });
  });

  // Sidebar Add button
  document.getElementById('sidebar-add-btn').addEventListener('click', openAddForm);
  document.getElementById('mobile-add-btn').addEventListener('click', openAddForm);
}

/* ── 7. MEDICINE CARD HTML ───────────────────────────────── */

function renderMedicineCard(med) {
  const statusLabels = {
    active:        '🟢 Active',
    expiring_soon: '🟡 Expiring Soon',
    expired:       '🔴 Expired',
  };
  const cardBorderClass = med.status === 'expiring_soon' ? 'card-expiring'
                        : med.status === 'expired'       ? 'card-expired' : '';
  const qtyClass = med.isLowStock ? ' low-qty' : '';

  return `
    <div class="medicine-card ${cardBorderClass}" data-id="${med.id}">
      <div class="card-body">
        <div class="card-name-row">
          <div class="card-name">${escHtml(med.name)}</div>
        </div>
        <div class="card-badges">
          <span class="badge badge-${med.status}">${statusLabels[med.status]}</span>
          <span class="badge badge-type">${escHtml(med.type)}</span>
          ${med.isLowStock ? '<span class="badge badge-low_stock">🟠 Low Stock</span>' : ''}
        </div>
        <div class="card-usecase">${escHtml(med.useCase)}</div>
      </div>
      <div class="card-footer">
        <div class="card-meta">
          Qty: <span class="${qtyClass}">${med.quantity}</span>
          &nbsp;·&nbsp;
          Exp: <span>${formatDate(med.expiryDate)}</span>
        </div>
        <div class="card-actions">
          <button class="card-btn" onclick="openEditForm('${med.id}')" title="Edit" aria-label="Edit ${escHtml(med.name)}">✏️</button>
          <button class="card-btn delete-btn" onclick="showDeleteModal('${med.id}','${escAttr(med.name)}')" title="Delete" aria-label="Delete ${escHtml(med.name)}">🗑️</button>
        </div>
      </div>
    </div>`;
}

function escHtml(str) {
  return String(str)
    .replace(/&/g,'&amp;').replace(/</g,'&lt;')
    .replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
function escAttr(str) {
  return String(str).replace(/'/g, '&#39;').replace(/"/g, '&quot;');
}

/* ── 8. EMPTY STATE HTML ─────────────────────────────────── */

function emptyState(icon, title, desc) {
  return `
    <div class="empty-state">
      <div class="empty-icon">${icon}</div>
      <div class="empty-title">${title}</div>
      <div class="empty-desc">${desc}</div>
    </div>`;
}

/* ── 9. RENDER DASHBOARD ─────────────────────────────────── */

function renderDashboard() {
  const raw = loadMedicines();
  const medicines = raw.map(enrichMedicine);
  renderStats(medicines);
  renderNotifications(medicines);
  renderCategorySection('grid-active',   'count-active',
    medicines.filter(m => m.status === 'active' && !m.isLowStock),
    '🌿', 'No active medicines', 'Add a medicine to get started.');
  renderCategorySection('grid-expiring', 'count-expiring',
    medicines.filter(m => m.status === 'expiring_soon'),
    '⏳', 'No medicines expiring soon', 'Great — nothing expiring in the next 30 days!');
  renderCategorySection('grid-expired',  'count-expired',
    medicines.filter(m => m.status === 'expired'),
    '✅', 'No expired medicines', 'No expired medicines in your inventory.');
  renderCategorySection('grid-lowstock', 'count-lowstock',
    medicines.filter(m => m.isLowStock),
    '📦', 'No low stock medicines', 'All medicines are well stocked.');
}

function renderStats(medicines) {
  const total    = medicines.length;
  const active   = medicines.filter(m => m.status === 'active').length;
  const expiring = medicines.filter(m => m.status === 'expiring_soon').length;
  const expired  = medicines.filter(m => m.status === 'expired').length;
  const lowStock = medicines.filter(m => m.isLowStock).length;
  document.getElementById('stat-total-num').textContent    = total;
  document.getElementById('stat-active-num').textContent   = active;
  document.getElementById('stat-expiring-num').textContent = expiring;
  document.getElementById('stat-expired-num').textContent  = expired;
  document.getElementById('stat-lowstock-num').textContent = lowStock;
}

function renderNotifications(medicines) {
  const area = document.getElementById('notification-area');
  // Keep any previously dismissed IDs in memory
  const dismissed = window._dismissedNotifs || new Set();
  const expired  = medicines.filter(m => m.status === 'expired'       && !dismissed.has(m.id));
  const expiring = medicines.filter(m => m.status === 'expiring_soon' && !dismissed.has(m.id));

  let html = '';
  expired.slice(0, 5).forEach(m => {
    html += `<div class="notif-banner notif-expired" data-notif-id="${m.id}">
      <span class="notif-icon">❌</span>
      <span class="notif-text">⚠ <strong>${escHtml(m.name)}</strong> has expired.
        Please check the medicine packaging and do not use expired medicine.</span>
      <button class="notif-dismiss" onclick="dismissNotif('${m.id}')" aria-label="Dismiss">✕</button>
    </div>`;
  });
  expiring.slice(0, 5).forEach(m => {
    const d = m.daysLeft;
    const when = d === 0 ? 'today' : d === 1 ? 'tomorrow' : `in ${d} days`;
    html += `<div class="notif-banner notif-expiring" data-notif-id="${m.id}">
      <span class="notif-icon">⚠️</span>
      <span class="notif-text"><strong>${escHtml(m.name)}</strong> expires ${when}
        (${formatDate(m.expiryDate)}). Please check your stock.</span>
      <button class="notif-dismiss" onclick="dismissNotif('${m.id}')" aria-label="Dismiss">✕</button>
    </div>`;
  });
  area.innerHTML = html;
}

function dismissNotif(id) {
  if (!window._dismissedNotifs) window._dismissedNotifs = new Set();
  window._dismissedNotifs.add(id);
  const el = document.querySelector(`.notif-banner[data-notif-id="${id}"]`);
  if (el) el.remove();
}

function renderCategorySection(gridId, countId, medicines, emptyIcon, emptyTitle, emptyDesc) {
  const grid  = document.getElementById(gridId);
  const count = document.getElementById(countId);
  if (!grid) return;
  count.textContent = medicines.length;
  if (medicines.length === 0) {
    grid.innerHTML = emptyState(emptyIcon, emptyTitle, emptyDesc);
  } else {
    grid.innerHTML = medicines.map(renderMedicineCard).join('');
  }
}

/* ── 10. RENDER ALL MEDICINES PAGE ───────────────────────── */

// Active filter state
let _statusFilter = '';
let _typeFilter   = '';

function setStatusFilter(val) {
  _statusFilter = val;
  // Update chips UI
  document.querySelectorAll('#status-filters .filter-chip').forEach(chip => {
    chip.classList.toggle('active', chip.dataset.status === val);
  });
  // Set select too
  const sel = document.getElementById('type-filter');
  if (sel) sel.value = _typeFilter;
}

function renderMedicinesPage() {
  const raw       = loadMedicines();
  const medicines = raw.map(enrichMedicine);
  const search    = (document.getElementById('medicines-search')?.value || '').toLowerCase().trim();
  const typeFilter= document.getElementById('type-filter')?.value || '';
  _typeFilter = typeFilter;

  let filtered = medicines;

  // Text search (name, useCase, symptoms)
  if (search) {
    filtered = filtered.filter(m =>
      m.name.toLowerCase().includes(search)    ||
      m.useCase.toLowerCase().includes(search) ||
      m.symptoms.toLowerCase().includes(search)
    );
  }

  // Status filter
  if (_statusFilter) {
    if (_statusFilter === 'low_stock') {
      filtered = filtered.filter(m => m.isLowStock);
    } else {
      filtered = filtered.filter(m => m.status === _statusFilter);
    }
  }

  // Type filter
  if (typeFilter) {
    filtered = filtered.filter(m => m.type === typeFilter);
  }

  const grid = document.getElementById('grid-all');
  const label = document.getElementById('medicines-count-label');
  if (label) {
    label.textContent = `${filtered.length} medicine${filtered.length !== 1 ? 's' : ''}` +
      (search || _statusFilter || typeFilter ? ' (filtered)' : '');
  }

  if (filtered.length === 0) {
    grid.innerHTML = emptyState('💊', 'No medicines found',
      search || _statusFilter || typeFilter
        ? 'Try adjusting your search or filters.'
        : 'Add your first medicine using the button above.');
  } else {
    grid.innerHTML = filtered.map(renderMedicineCard).join('');
  }
}

function applyFilters() {
  renderMedicinesPage();
}

function initFilterChips() {
  document.querySelectorAll('#status-filters .filter-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      _statusFilter = chip.dataset.status;
      document.querySelectorAll('#status-filters .filter-chip')
        .forEach(c => c.classList.toggle('active', c === chip));
      renderMedicinesPage();
    });
  });
}

/* ── 11. SYMPTOM SEARCH ──────────────────────────────────── */

const STOP_WORDS = new Set([
  'i','a','an','the','and','or','have','has','had','am','is','are','was',
  'feel','feeling','felt','my','me','we','you','with','some','bit','very',
  'really','also','for','of','in','on','at','to','get','got','been',
  'this','that','these','do','did','can','its','it',
]);

function extractTokens(query) {
  return query
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length >= 3 && !STOP_WORDS.has(w));
}

function scoreMatch(med, tokens) {
  const sympLow    = med.symptoms.toLowerCase();
  const useCaseLow = med.useCase.toLowerCase();
  const nameLow    = med.name.toLowerCase();
  return tokens.reduce((score, token) => {
    if (sympLow.includes(token))    return score + 2;
    if (useCaseLow.includes(token)) return score + 2;
    if (nameLow.includes(token))    return score + 1;
    return score;
  }, 0);
}

function performSymptomSearch(query) {
  const tokens = extractTokens(query);
  if (tokens.length === 0) return [];
  const raw = loadMedicines().map(enrichMedicine);
  // Exclude expired from results
  const available = raw.filter(m => m.status !== 'expired');
  return available
    .map(m => ({ ...m, _score: scoreMatch(m, tokens) }))
    .filter(m => m._score > 0)
    .sort((a, b) => b._score - a._score);
}

function renderSymptomResults(results, query, containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  if (!query.trim()) { container.innerHTML = ''; return; }

  const disclaimer = `
    <div class="symptom-disclaimer">
      ℹ️ <strong>Matches your stored medicine information</strong> — not a medical recommendation.
      This only shows medicines from your inventory tagged with the searched symptom.
      Always consult a qualified healthcare professional before taking any medicine.
    </div>`;

  if (results.length === 0) {
    container.innerHTML = disclaimer +
      `<div class="symptom-no-results">
        No medicines in your inventory are tagged with "<strong>${escHtml(query)}</strong>".
        <br>Try different keywords or add a medicine with that symptom.
      </div>`;
    return;
  }

  const cards = results.map(med => {
    const statusLabels = { active: '🟢 Available', expiring_soon: '🟡 Expiring Soon' };
    return `
      <div class="symptom-result-card">
        <div class="symptom-result-name">
          ${escHtml(med.name)}
          <span class="badge badge-${med.status}" style="margin-left:8px;font-size:11px;">
            ${statusLabels[med.status] || ''}
          </span>
          <span class="badge badge-type" style="margin-left:4px;font-size:11px;">${escHtml(med.type)}</span>
        </div>
        <div class="symptom-result-meta">
          <strong>Use case:</strong> ${escHtml(med.useCase)}<br>
          <strong>Tagged symptoms:</strong> ${escHtml(med.symptoms)}
          ${med.dosage ? `<br><strong>Dosage:</strong> ${escHtml(med.dosage)}` : ''}
        </div>
        <div class="symptom-result-tag">
          This medicine in your inventory is tagged with this symptom.
        </div>
      </div>`;
  }).join('');

  container.innerHTML = disclaimer +
    `<p style="font-size:13px;color:#64748b;margin-bottom:10px;">
      ${results.length} match${results.length !== 1 ? 'es' : ''} for "<strong>${escHtml(query)}</strong>"
    </p>` + cards;
}

// Dashboard symptom search
function runDashSymptomSearch() {
  const query = document.getElementById('dash-symptom-input').value;
  const results = performSymptomSearch(query);
  renderSymptomResults(results, query, 'dash-symptom-results');
}
function dashChipSearch(term) {
  document.getElementById('dash-symptom-input').value = term;
  runDashSymptomSearch();
}

// Full-page symptom search
function runSymptomPageSearch() {
  const query = document.getElementById('symptom-page-input').value;
  const results = performSymptomSearch(query);
  renderSymptomResults(results, query, 'symptom-page-results');
}
function symptomPageChip(term) {
  document.getElementById('symptom-page-input').value = term;
  runSymptomPageSearch();
}

// Support Enter key on symptom inputs
function initSymptomEnter() {
  document.getElementById('dash-symptom-input').addEventListener('keydown', e => {
    if (e.key === 'Enter') runDashSymptomSearch();
  });
  document.getElementById('symptom-page-input').addEventListener('keydown', e => {
    if (e.key === 'Enter') runSymptomPageSearch();
  });
}

/* ── 12. ADD / EDIT FORM ─────────────────────────────────── */

let _editingId = null; // null = add mode, id string = edit mode

function openAddForm() {
  _editingId = null;
  document.getElementById('form-page-title').textContent = 'Add Medicine';
  document.getElementById('form-submit-btn').textContent = 'Add Medicine';
  document.getElementById('medicine-form').reset();
  document.getElementById('form-id').value = '';
  clearFormErrors();
  showPage('page-add-edit');
}

function openEditForm(id) {
  const medicine = loadMedicines().find(m => m.id === id);
  if (!medicine) { showToast('Medicine not found.', 'error'); return; }
  _editingId = id;
  document.getElementById('form-page-title').textContent = 'Edit Medicine';
  document.getElementById('form-submit-btn').textContent = 'Save Changes';
  document.getElementById('form-id').value = id;

  document.getElementById('f-name').value         = medicine.name;
  document.getElementById('f-type').value         = medicine.type;
  document.getElementById('f-useCase').value      = medicine.useCase;
  document.getElementById('f-symptoms').value     = medicine.symptoms;
  document.getElementById('f-dosage').value       = medicine.dosage || '';
  document.getElementById('f-quantity').value     = medicine.quantity;
  document.getElementById('f-minimumStock').value = medicine.minimumStock;
  document.getElementById('f-expiryDate').value   = medicine.expiryDate;
  document.getElementById('f-notes').value        = medicine.notes || '';
  clearFormErrors();
  showPage('page-add-edit');
}

function cancelForm() {
  showPage('page-dashboard');
}

/* ── 13. FORM VALIDATION ─────────────────────────────────── */

function setError(fieldId, msg) {
  const el = document.getElementById('err-' + fieldId);
  if (el) el.textContent = msg;
  const input = document.getElementById('f-' + fieldId);
  if (input) input.classList.toggle('error', !!msg);
}
function clearFormErrors() {
  ['name','type','useCase','symptoms','quantity','minimumStock','expiryDate'].forEach(f => setError(f, ''));
}

function validateForm() {
  clearFormErrors();
  let valid = true;
  const name     = document.getElementById('f-name').value.trim();
  const type     = document.getElementById('f-type').value;
  const useCase  = document.getElementById('f-useCase').value.trim();
  const symptoms = document.getElementById('f-symptoms').value.trim();
  const qtyStr   = document.getElementById('f-quantity').value;
  const minStr   = document.getElementById('f-minimumStock').value;
  const expiry   = document.getElementById('f-expiryDate').value;

  if (!name)    { setError('name', 'Medicine name is required.'); valid = false; }
  if (!type)    { setError('type', 'Please select a medicine type.'); valid = false; }
  if (!useCase) { setError('useCase', 'Use case / purpose is required.'); valid = false; }
  if (!symptoms){ setError('symptoms', 'Symptoms are required.'); valid = false; }

  const qty = parseInt(qtyStr, 10);
  if (qtyStr === '' || isNaN(qty)) {
    setError('quantity', 'Quantity is required.'); valid = false;
  } else if (qty < 0) {
    setError('quantity', 'Quantity cannot be negative.'); valid = false;
  }

  const min = parseInt(minStr, 10);
  if (minStr === '' || isNaN(min)) {
    setError('minimumStock', 'Minimum stock level is required.'); valid = false;
  } else if (min < 0) {
    setError('minimumStock', 'Minimum stock cannot be negative.'); valid = false;
  }

  if (!expiry) {
    setError('expiryDate', 'Expiry date is required.'); valid = false;
  } else if (isNaN(new Date(expiry).getTime())) {
    setError('expiryDate', 'Please enter a valid date.'); valid = false;
  }

  return valid;
}

function submitForm(e) {
  e.preventDefault();
  if (!validateForm()) return;

  const data = {
    name:         document.getElementById('f-name').value,
    type:         document.getElementById('f-type').value,
    useCase:      document.getElementById('f-useCase').value,
    symptoms:     document.getElementById('f-symptoms').value,
    dosage:       document.getElementById('f-dosage').value,
    quantity:     document.getElementById('f-quantity').value,
    minimumStock: document.getElementById('f-minimumStock').value,
    expiryDate:   document.getElementById('f-expiryDate').value,
    notes:        document.getElementById('f-notes').value,
  };

  if (_editingId) {
    updateMedicine(_editingId, data);
    showToast(data.name + ' updated successfully.', 'success');
  } else {
    addMedicine(data);
    showToast(data.name + ' added to your inventory.', 'success');
  }

  _editingId = null;
  showPage('page-dashboard');
}

/* ── 14. DELETE MODAL ────────────────────────────────────── */

let _pendingDeleteId = null;

function showDeleteModal(id, name) {
  _pendingDeleteId = id;
  document.getElementById('delete-medicine-name').textContent = '"' + name + '"';
  document.getElementById('delete-modal').classList.add('active');
}
function closeDeleteModal() {
  _pendingDeleteId = null;
  document.getElementById('delete-modal').classList.remove('active');
}
function confirmDelete() {
  if (!_pendingDeleteId) return;
  deleteMedicine(_pendingDeleteId);
  closeDeleteModal();
  showToast('Medicine deleted.', 'success');
  renderAll();
}

/* ── 15. TOASTS ──────────────────────────────────────────── */

function showToast(message, type) {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = 'toast toast-' + (type || 'success');
  toast.textContent = message;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 3200);
}

/* ── 16. RENDER ALL ──────────────────────────────────────── */

function renderAll() {
  renderDashboard();
  // Only re-render medicines page if it's currently visible
  if (document.getElementById('page-medicines').classList.contains('active')) {
    renderMedicinesPage();
  }
}

/* ── 17. INIT ─────────────────────────────────────────────── */

document.addEventListener('DOMContentLoaded', () => {
  seedDemoData();
  initNav();
  initFilterChips();
  initSymptomEnter();
  renderDashboard();
});
