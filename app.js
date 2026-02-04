// ============================================================
// CardStash - Business Card Scanner App
// All data stored in localStorage (no server needed)
// ============================================================

const STORAGE_KEY = 'cardstash_contacts';
const EXPENSES_KEY = 'cardstash_expenses';
const MILEAGE_KEY = 'cardstash_mileage';
const EVENTS_KEY = 'cardstash_events';

// IRS standard mileage rate (2024)
const MILEAGE_RATE = 0.67;

// ---- State ----
let contacts = loadContacts();
let expenses = loadExpenses();
let mileageTrips = loadMileage();
let plannerEvents = loadEvents();
let plannerDate = new Date();
let currentCardImage = null;
let currentReceiptImage = null;
let cameraStream = null;
let expenseCameraStream = null;
let map = null;
let mapMarkers = [];

// ---- DOM refs ----
const navBtns = document.querySelectorAll('.nav-btn');
const views = document.querySelectorAll('.view');

const cameraFeed = document.getElementById('camera-feed');
const snapCanvas = document.getElementById('snap-canvas');
const capturedImageContainer = document.getElementById('captured-image-container');
const capturedImage = document.getElementById('captured-image');
const startCameraBtn = document.getElementById('start-camera-btn');
const captureBtn = document.getElementById('capture-btn');
const retakeBtn = document.getElementById('retake-btn');
const fileUpload = document.getElementById('file-upload');
const ocrStatus = document.getElementById('ocr-status');
const extractedText = document.getElementById('extracted-text');
const ocrResult = document.getElementById('ocr-result');
const contactForm = document.getElementById('contact-form');

const searchInput = document.getElementById('search-input');
const filterTag = document.getElementById('filter-tag');
const contactsList = document.getElementById('contacts-list');
const noContacts = document.getElementById('no-contacts');

const contactModal = document.getElementById('contact-modal');
const modalBody = document.getElementById('modal-body');
const modalClose = document.querySelector('.modal-close');

// ============================================================
// Navigation
// ============================================================
navBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const viewName = btn.dataset.view;
        navBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        views.forEach(v => v.classList.remove('active'));
        document.getElementById(`${viewName}-view`).classList.add('active');

        if (viewName === 'contacts') renderContacts();
        if (viewName === 'map') initMap();
        if (viewName === 'expenses') renderExpenses();
        if (viewName === 'mileage') renderMileage();
        if (viewName === 'planner') renderPlanner();
    });
});

// ============================================================
// Camera & Image Capture
// ============================================================
startCameraBtn.addEventListener('click', async () => {
    try {
        cameraStream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } }
        });
        cameraFeed.srcObject = cameraStream;
        cameraFeed.style.display = 'block';
        startCameraBtn.style.display = 'none';
        captureBtn.style.display = 'inline-block';
    } catch (err) {
        alert('Could not access camera. You can still upload an image of the card.');
        console.error(err);
    }
});

captureBtn.addEventListener('click', () => {
    snapCanvas.width = cameraFeed.videoWidth;
    snapCanvas.height = cameraFeed.videoHeight;
    snapCanvas.getContext('2d').drawImage(cameraFeed, 0, 0);
    const dataUrl = snapCanvas.toDataURL('image/png');
    showCapturedImage(dataUrl);
    stopCamera();
});

retakeBtn.addEventListener('click', () => {
    resetScanView();
    startCameraBtn.click();
});

fileUpload.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
        showCapturedImage(ev.target.result);
        stopCamera();
    };
    reader.readAsDataURL(file);
});

function showCapturedImage(dataUrl) {
    currentCardImage = dataUrl;
    capturedImage.src = dataUrl;
    capturedImageContainer.style.display = 'block';
    cameraFeed.style.display = 'none';
    captureBtn.style.display = 'none';
    startCameraBtn.style.display = 'none';
    retakeBtn.style.display = 'inline-block';
    runOCR(dataUrl);
}

function stopCamera() {
    if (cameraStream) {
        cameraStream.getTracks().forEach(t => t.stop());
        cameraStream = null;
    }
}

function resetScanView() {
    capturedImageContainer.style.display = 'none';
    cameraFeed.style.display = 'none';
    startCameraBtn.style.display = 'inline-block';
    captureBtn.style.display = 'none';
    retakeBtn.style.display = 'none';
    ocrStatus.style.display = 'none';
    extractedText.style.display = 'none';
    contactForm.style.display = 'none';
    contactForm.reset();
    currentCardImage = null;
}

// ============================================================
// OCR with Tesseract.js
// ============================================================
async function runOCR(imageData) {
    ocrStatus.style.display = 'flex';
    extractedText.style.display = 'none';
    contactForm.style.display = 'none';

    try {
        const result = await Tesseract.recognize(imageData, 'eng', {
            logger: m => {
                if (m.status === 'recognizing text') {
                    const pct = Math.round(m.progress * 100);
                    ocrStatus.querySelector('p').textContent = `Reading card text... ${pct}%`;
                }
            }
        });

        const text = result.data.text.trim();
        ocrResult.textContent = text || '(no text detected)';
        extractedText.style.display = 'block';
        ocrStatus.style.display = 'none';

        // Try to auto-fill form fields from OCR text
        autoFillForm(text);
        contactForm.style.display = 'block';
    } catch (err) {
        ocrStatus.querySelector('p').textContent = 'OCR failed. Please fill in details manually.';
        console.error(err);
        contactForm.style.display = 'block';
    }
}

// ============================================================
// Auto-fill heuristics from OCR text
// ============================================================
function autoFillForm(text) {
    const lines = text.split('\n').map(l => l.trim()).filter(Boolean);

    // Email
    const emailMatch = text.match(/[\w.+-]+@[\w-]+\.[\w.]+/);
    if (emailMatch) document.getElementById('input-email').value = emailMatch[0];

    // Phone — match common formats
    const phoneMatch = text.match(/(\+?\d[\d\s\-().]{7,}\d)/);
    if (phoneMatch) document.getElementById('input-phone').value = phoneMatch[1].trim();

    // Website
    const webMatch = text.match(/(https?:\/\/[^\s]+|www\.[^\s]+)/i);
    if (webMatch) document.getElementById('input-website').value = webMatch[0];

    // Name guess: first non-empty line that isn't an email/phone/url
    for (const line of lines) {
        if (line.match(/@|http|www\.|^\+?\d[\d\s\-().]{5,}/i)) continue;
        // Likely a name if it's short-ish and has letters
        if (line.length < 40 && /[a-zA-Z]{2,}/.test(line)) {
            document.getElementById('input-name').value = line;
            break;
        }
    }

    // Company guess: second qualifying line
    let foundName = false;
    for (const line of lines) {
        if (line.match(/@|http|www\.|^\+?\d[\d\s\-().]{5,}/i)) continue;
        if (line.length < 50 && /[a-zA-Z]{2,}/.test(line)) {
            if (!foundName) { foundName = true; continue; }
            document.getElementById('input-company').value = line;
            break;
        }
    }
}

// ============================================================
// Save Contact
// ============================================================
contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const contact = {
        id: Date.now().toString(36) + Math.random().toString(36).slice(2, 7),
        name: document.getElementById('input-name').value.trim(),
        company: document.getElementById('input-company').value.trim(),
        title: document.getElementById('input-title').value.trim(),
        email: document.getElementById('input-email').value.trim(),
        phone: document.getElementById('input-phone').value.trim(),
        address: document.getElementById('input-address').value.trim(),
        website: document.getElementById('input-website').value.trim(),
        notes: document.getElementById('input-notes').value.trim(),
        tags: document.getElementById('input-tags').value.split(',').map(t => t.trim()).filter(Boolean),
        followUpDate: document.getElementById('input-followup-date').value || null,
        followUpNote: document.getElementById('input-followup-note').value.trim() || null,
        cardImage: currentCardImage,
        createdAt: new Date().toISOString(),
        lat: null,
        lng: null
    };

    if (!contact.name) {
        alert('Please enter at least a name.');
        return;
    }

    contacts.push(contact);
    saveContacts();

    // If address exists, geocode it
    if (contact.address) {
        geocodeContact(contact);
    }

    alert('Contact saved!');
    resetScanView();
});

// ============================================================
// Storage
// ============================================================
function loadContacts() {
    try {
        return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch {
        return [];
    }
}

function saveContacts() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(contacts));
}

function loadExpenses() {
    try {
        return JSON.parse(localStorage.getItem(EXPENSES_KEY)) || [];
    } catch {
        return [];
    }
}

function saveExpenses() {
    localStorage.setItem(EXPENSES_KEY, JSON.stringify(expenses));
}

function loadMileage() {
    try {
        return JSON.parse(localStorage.getItem(MILEAGE_KEY)) || [];
    } catch {
        return [];
    }
}

function saveMileage() {
    localStorage.setItem(MILEAGE_KEY, JSON.stringify(mileageTrips));
}

function loadEvents() {
    try {
        return JSON.parse(localStorage.getItem(EVENTS_KEY)) || [];
    } catch {
        return [];
    }
}

function saveEvents() {
    localStorage.setItem(EVENTS_KEY, JSON.stringify(plannerEvents));
}

// ============================================================
// Contacts List
// ============================================================
function renderContacts() {
    const query = searchInput.value.toLowerCase();
    const tagFilter = filterTag.value;

    // Rebuild tag filter options
    const allTags = [...new Set(contacts.flatMap(c => c.tags))].sort();
    const currentTag = filterTag.value;
    filterTag.innerHTML = '<option value="">All Tags</option>';
    allTags.forEach(tag => {
        const opt = document.createElement('option');
        opt.value = tag;
        opt.textContent = tag;
        if (tag === currentTag) opt.selected = true;
        filterTag.appendChild(opt);
    });

    let filtered = contacts;
    if (query) {
        filtered = filtered.filter(c =>
            (c.name + c.company + c.email + c.notes + c.tags.join(' ')).toLowerCase().includes(query)
        );
    }
    if (tagFilter) {
        filtered = filtered.filter(c => c.tags.includes(tagFilter));
    }

    // Sort newest first
    filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    if (filtered.length === 0) {
        contactsList.innerHTML = '';
        noContacts.style.display = 'block';
        return;
    }
    noContacts.style.display = 'none';

    contactsList.innerHTML = filtered.map(c => `
        <div class="contact-card" data-id="${c.id}">
            <div class="contact-card-header">
                <strong>${escapeHtml(c.name)}</strong>
                ${c.company ? `<span class="company">${escapeHtml(c.company)}</span>` : ''}
            </div>
            <div class="contact-card-meta">
                ${c.title ? `<span>${escapeHtml(c.title)}</span>` : ''}
                ${c.phone ? `<span>${escapeHtml(c.phone)}</span>` : ''}
                ${c.email ? `<span>${escapeHtml(c.email)}</span>` : ''}
            </div>
            ${c.tags.length ? `<div class="contact-tags">${c.tags.map(t => `<span class="tag">${escapeHtml(t)}</span>`).join('')}</div>` : ''}
            ${c.notes ? `<div class="contact-notes-preview">${escapeHtml(c.notes.substring(0, 80))}${c.notes.length > 80 ? '...' : ''}</div>` : ''}
            ${c.followUpDate ? `<div class="contact-followup ${new Date(c.followUpDate + 'T23:59:59') < new Date() ? 'overdue' : ''}">Follow up ${c.followUpDate}${c.followUpNote ? ': ' + escapeHtml(c.followUpNote) : ''}</div>` : ''}
        </div>
    `).join('');

    // Click to open detail
    contactsList.querySelectorAll('.contact-card').forEach(el => {
        el.addEventListener('click', () => openContactModal(el.dataset.id));
    });
}

searchInput.addEventListener('input', renderContacts);
filterTag.addEventListener('change', renderContacts);

// ============================================================
// Contact Detail Modal
// ============================================================
function openContactModal(id) {
    const c = contacts.find(x => x.id === id);
    if (!c) return;

    modalBody.innerHTML = `
        ${c.cardImage ? `<img src="${c.cardImage}" class="modal-card-image" alt="Business card" />` : ''}
        <h2>${escapeHtml(c.name)}</h2>
        ${c.title ? `<p class="modal-title">${escapeHtml(c.title)}</p>` : ''}
        ${c.company ? `<p class="modal-company">${escapeHtml(c.company)}</p>` : ''}
        <div class="modal-details">
            ${c.phone ? `<p><strong>Phone:</strong> <a href="tel:${escapeHtml(c.phone)}">${escapeHtml(c.phone)}</a></p>` : ''}
            ${c.email ? `<p><strong>Email:</strong> <a href="mailto:${escapeHtml(c.email)}">${escapeHtml(c.email)}</a></p>` : ''}
            ${c.website ? `<p><strong>Web:</strong> <a href="${escapeHtml(c.website)}" target="_blank">${escapeHtml(c.website)}</a></p>` : ''}
            ${c.address ? `<p><strong>Address:</strong> ${escapeHtml(c.address)}</p>` : ''}
        </div>
        ${c.notes ? `<div class="modal-notes"><h4>Notes</h4><p>${escapeHtml(c.notes)}</p></div>` : ''}
        ${c.followUpDate ? `<div class="modal-followup ${new Date(c.followUpDate + 'T23:59:59') < new Date() ? 'overdue' : ''}"><h4>Follow-up: ${c.followUpDate}</h4>${c.followUpNote ? `<p>${escapeHtml(c.followUpNote)}</p>` : ''}<button class="btn btn-secondary btn-sm" onclick="markFollowUpDone('${c.id}')">Mark Done</button></div>` : ''}
        ${c.tags.length ? `<div class="modal-tags">${c.tags.map(t => `<span class="tag">${escapeHtml(t)}</span>`).join('')}</div>` : ''}
        <p class="modal-date">Added ${new Date(c.createdAt).toLocaleDateString()}</p>
        <div class="modal-actions">
            <button class="btn btn-secondary" onclick="editContact('${c.id}')">Edit</button>
            <button class="btn btn-danger" onclick="deleteContact('${c.id}')">Delete</button>
        </div>
    `;
    contactModal.style.display = 'flex';
}

modalClose.addEventListener('click', () => contactModal.style.display = 'none');
contactModal.addEventListener('click', (e) => {
    if (e.target === contactModal) contactModal.style.display = 'none';
});

function deleteContact(id) {
    if (!confirm('Delete this contact?')) return;
    contacts = contacts.filter(c => c.id !== id);
    saveContacts();
    contactModal.style.display = 'none';
    renderContacts();
}

function markFollowUpDone(id) {
    const c = contacts.find(x => x.id === id);
    if (!c) return;
    c.followUpDate = null;
    c.followUpNote = null;
    saveContacts();
    contactModal.style.display = 'none';
    renderContacts();
}

function editContact(id) {
    const c = contacts.find(x => x.id === id);
    if (!c) return;
    contactModal.style.display = 'none';

    // Switch to scan view and populate form
    navBtns.forEach(b => b.classList.remove('active'));
    document.querySelector('[data-view="scan"]').classList.add('active');
    views.forEach(v => v.classList.remove('active'));
    document.getElementById('scan-view').classList.add('active');

    // Show form
    contactForm.style.display = 'block';
    document.getElementById('input-name').value = c.name;
    document.getElementById('input-company').value = c.company;
    document.getElementById('input-title').value = c.title;
    document.getElementById('input-email').value = c.email;
    document.getElementById('input-phone').value = c.phone;
    document.getElementById('input-address').value = c.address;
    document.getElementById('input-website').value = c.website;
    document.getElementById('input-notes').value = c.notes;
    document.getElementById('input-tags').value = c.tags.join(', ');
    document.getElementById('input-followup-date').value = c.followUpDate || '';
    document.getElementById('input-followup-note').value = c.followUpNote || '';

    if (c.cardImage) {
        currentCardImage = c.cardImage;
        capturedImage.src = c.cardImage;
        capturedImageContainer.style.display = 'block';
    }

    // Remove old version — new save will create fresh entry
    contacts = contacts.filter(x => x.id !== id);
    saveContacts();
}

// ============================================================
// Map View (Leaflet + OpenStreetMap)
// ============================================================
function initMap() {
    const mapContainer = document.getElementById('map');
    const mapNoContacts = document.getElementById('map-no-contacts');

    const geoContacts = contacts.filter(c => c.lat && c.lng);

    if (geoContacts.length === 0 && contacts.filter(c => c.address).length === 0) {
        mapContainer.style.display = 'none';
        mapNoContacts.style.display = 'block';
        return;
    }
    mapContainer.style.display = 'block';
    mapNoContacts.style.display = 'none';

    if (!map) {
        map = L.map('map').setView([39.8283, -98.5795], 4); // Center on US
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; OpenStreetMap contributors'
        }).addTo(map);
    }

    // Clear old markers
    mapMarkers.forEach(m => map.removeLayer(m));
    mapMarkers = [];

    // Try geocoding any contacts that have address but no lat/lng
    contacts.filter(c => c.address && !c.lat).forEach(c => geocodeContact(c));

    // Add markers
    geoContacts.forEach(c => {
        const marker = L.marker([c.lat, c.lng]).addTo(map);
        marker.bindPopup(`
            <strong>${escapeHtml(c.name)}</strong><br>
            ${c.company ? escapeHtml(c.company) + '<br>' : ''}
            ${c.address ? escapeHtml(c.address) : ''}
        `);
        mapMarkers.push(marker);
    });

    if (geoContacts.length > 0) {
        const group = L.featureGroup(mapMarkers);
        map.fitBounds(group.getBounds().pad(0.2));
    }

    // Leaflet needs a resize kick when container becomes visible
    setTimeout(() => map.invalidateSize(), 200);
}

// ============================================================
// Geocoding (free Nominatim API)
// ============================================================
async function geocodeContact(contact) {
    if (!contact.address) return;
    try {
        const resp = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(contact.address)}&limit=1`,
            { headers: { 'User-Agent': 'CardStash/1.0' } }
        );
        const data = await resp.json();
        if (data.length > 0) {
            contact.lat = parseFloat(data[0].lat);
            contact.lng = parseFloat(data[0].lon);
            saveContacts();
        }
    } catch (err) {
        console.error('Geocoding failed for', contact.address, err);
    }
}

// ============================================================
// Utility
// ============================================================
function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

// ============================================================
// EXPENSES — Receipt Scanning & Tracking
// ============================================================
const expenseCameraFeed = document.getElementById('expense-camera-feed');
const expenseSnapCanvas = document.getElementById('expense-snap-canvas');
const expenseCapturedContainer = document.getElementById('expense-captured-container');
const expenseCapturedImage = document.getElementById('expense-captured-image');
const expenseStartCamera = document.getElementById('expense-start-camera');
const expenseCaptureBtn = document.getElementById('expense-capture-btn');
const expenseRetakeBtn = document.getElementById('expense-retake-btn');
const expenseFileUpload = document.getElementById('expense-file-upload');
const expenseOcrStatus = document.getElementById('expense-ocr-status');
const expenseExtracted = document.getElementById('expense-extracted');
const expenseOcrResult = document.getElementById('expense-ocr-result');
const expenseForm = document.getElementById('expense-form');
const expenseFilterCategory = document.getElementById('expense-filter-category');
const expenseFilterMonth = document.getElementById('expense-filter-month');

// Set default date to today
document.getElementById('expense-date').valueAsDate = new Date();

// -- Expense Camera --
expenseStartCamera.addEventListener('click', async () => {
    try {
        expenseCameraStream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } }
        });
        expenseCameraFeed.srcObject = expenseCameraStream;
        expenseCameraFeed.style.display = 'block';
        expenseStartCamera.style.display = 'none';
        expenseCaptureBtn.style.display = 'inline-block';
    } catch (err) {
        alert('Could not access camera. You can upload a receipt image instead.');
        console.error(err);
    }
});

expenseCaptureBtn.addEventListener('click', () => {
    expenseSnapCanvas.width = expenseCameraFeed.videoWidth;
    expenseSnapCanvas.height = expenseCameraFeed.videoHeight;
    expenseSnapCanvas.getContext('2d').drawImage(expenseCameraFeed, 0, 0);
    const dataUrl = expenseSnapCanvas.toDataURL('image/png');
    showExpenseImage(dataUrl);
    stopExpenseCamera();
});

expenseRetakeBtn.addEventListener('click', () => {
    resetExpenseScan();
    expenseStartCamera.click();
});

expenseFileUpload.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
        showExpenseImage(ev.target.result);
        stopExpenseCamera();
    };
    reader.readAsDataURL(file);
});

function showExpenseImage(dataUrl) {
    currentReceiptImage = dataUrl;
    expenseCapturedImage.src = dataUrl;
    expenseCapturedContainer.style.display = 'block';
    expenseCameraFeed.style.display = 'none';
    expenseCaptureBtn.style.display = 'none';
    expenseStartCamera.style.display = 'none';
    expenseRetakeBtn.style.display = 'inline-block';
    runExpenseOCR(dataUrl);
}

function stopExpenseCamera() {
    if (expenseCameraStream) {
        expenseCameraStream.getTracks().forEach(t => t.stop());
        expenseCameraStream = null;
    }
}

function resetExpenseScan() {
    expenseCapturedContainer.style.display = 'none';
    expenseCameraFeed.style.display = 'none';
    expenseStartCamera.style.display = 'inline-block';
    expenseCaptureBtn.style.display = 'none';
    expenseRetakeBtn.style.display = 'none';
    expenseOcrStatus.style.display = 'none';
    expenseExtracted.style.display = 'none';
    currentReceiptImage = null;
}

async function runExpenseOCR(imageData) {
    expenseOcrStatus.style.display = 'flex';
    expenseExtracted.style.display = 'none';

    try {
        const result = await Tesseract.recognize(imageData, 'eng', {
            logger: m => {
                if (m.status === 'recognizing text') {
                    const pct = Math.round(m.progress * 100);
                    expenseOcrStatus.querySelector('p').textContent = `Reading receipt... ${pct}%`;
                }
            }
        });

        const text = result.data.text.trim();
        expenseOcrResult.textContent = text || '(no text detected)';
        expenseExtracted.style.display = 'block';
        expenseOcrStatus.style.display = 'none';

        // Try to extract amount from receipt
        autoFillExpense(text);
    } catch (err) {
        expenseOcrStatus.querySelector('p').textContent = 'Could not read receipt. Enter details manually.';
        console.error(err);
    }
}

function autoFillExpense(text) {
    // Try to find a total amount — look for patterns like "Total $12.34" or "$45.67"
    const totalPatterns = [
        /total[:\s]*\$?([\d,]+\.?\d{0,2})/i,
        /amount[:\s]*\$?([\d,]+\.?\d{0,2})/i,
        /due[:\s]*\$?([\d,]+\.?\d{0,2})/i,
        /charge[:\s]*\$?([\d,]+\.?\d{0,2})/i,
    ];

    for (const pattern of totalPatterns) {
        const match = text.match(pattern);
        if (match) {
            const amount = parseFloat(match[1].replace(',', ''));
            if (amount > 0) {
                document.getElementById('expense-amount').value = amount.toFixed(2);
                break;
            }
        }
    }

    // If no total found, try to find the largest dollar amount
    if (!document.getElementById('expense-amount').value) {
        const allAmounts = [...text.matchAll(/\$?([\d,]+\.\d{2})/g)]
            .map(m => parseFloat(m[1].replace(',', '')))
            .filter(n => n > 0 && n < 100000);
        if (allAmounts.length > 0) {
            const largest = Math.max(...allAmounts);
            document.getElementById('expense-amount').value = largest.toFixed(2);
        }
    }

    // Try to find a store/vendor name from first line
    const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
    if (lines.length > 0 && lines[0].length < 50) {
        document.getElementById('expense-description').value = lines[0];
    }
}

// -- Save Expense --
expenseForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const amount = parseFloat(document.getElementById('expense-amount').value);
    if (!amount || amount <= 0) {
        alert('Please enter a valid amount.');
        return;
    }

    const expense = {
        id: Date.now().toString(36) + Math.random().toString(36).slice(2, 7),
        description: document.getElementById('expense-description').value.trim() || 'Untitled expense',
        amount: amount,
        category: document.getElementById('expense-category').value,
        date: document.getElementById('expense-date').value || new Date().toISOString().split('T')[0],
        notes: document.getElementById('expense-notes').value.trim(),
        receiptImage: currentReceiptImage,
        createdAt: new Date().toISOString()
    };

    expenses.push(expense);
    saveExpenses();

    // Reset form
    expenseForm.reset();
    document.getElementById('expense-date').valueAsDate = new Date();
    resetExpenseScan();
    renderExpenses();
    alert('Expense saved!');
});

// -- Render Expenses --
function renderExpenses() {
    // Update summary
    const now = new Date();
    const thisMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

    const total = expenses.reduce((sum, e) => sum + e.amount, 0);
    const monthTotal = expenses
        .filter(e => e.date && e.date.startsWith(thisMonth))
        .reduce((sum, e) => sum + e.amount, 0);

    document.getElementById('total-expenses').textContent = `$${total.toFixed(2)}`;
    document.getElementById('month-expenses').textContent = `$${monthTotal.toFixed(2)}`;
    document.getElementById('receipt-count').textContent = expenses.length;

    // Build month filter
    const months = [...new Set(expenses.map(e => e.date ? e.date.substring(0, 7) : ''))].filter(Boolean).sort().reverse();
    const currentMonthFilter = expenseFilterMonth.value;
    expenseFilterMonth.innerHTML = '<option value="">All Time</option>';
    months.forEach(m => {
        const opt = document.createElement('option');
        opt.value = m;
        const [y, mo] = m.split('-');
        opt.textContent = new Date(y, parseInt(mo) - 1).toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
        if (m === currentMonthFilter) opt.selected = true;
        expenseFilterMonth.appendChild(opt);
    });

    // Filter
    let filtered = expenses;
    const catFilter = expenseFilterCategory.value;
    const monthFilter = expenseFilterMonth.value;

    if (catFilter) filtered = filtered.filter(e => e.category === catFilter);
    if (monthFilter) filtered = filtered.filter(e => e.date && e.date.startsWith(monthFilter));

    filtered.sort((a, b) => new Date(b.date) - new Date(a.date));

    const expensesList = document.getElementById('expenses-list');
    const noExpenses = document.getElementById('no-expenses');

    if (filtered.length === 0) {
        expensesList.innerHTML = '';
        noExpenses.style.display = 'block';
        return;
    }
    noExpenses.style.display = 'none';

    const filteredTotal = filtered.reduce((sum, e) => sum + e.amount, 0);

    expensesList.innerHTML = `
        <div class="expense-filtered-total">
            Showing ${filtered.length} expense${filtered.length !== 1 ? 's' : ''} &mdash; <strong>$${filteredTotal.toFixed(2)}</strong>
        </div>
        ${filtered.map(e => `
            <div class="expense-item" data-id="${e.id}">
                <div class="expense-item-left">
                    <span class="expense-category-badge cat-${e.category}">${e.category}</span>
                    <div>
                        <strong>${escapeHtml(e.description)}</strong>
                        <span class="expense-date">${e.date}</span>
                    </div>
                </div>
                <div class="expense-item-right">
                    <span class="expense-amount">$${e.amount.toFixed(2)}</span>
                    <button class="btn-icon delete-expense" data-id="${e.id}" title="Delete">&times;</button>
                </div>
            </div>
        `).join('')}
    `;

    // Delete handlers
    expensesList.querySelectorAll('.delete-expense').forEach(btn => {
        btn.addEventListener('click', (ev) => {
            ev.stopPropagation();
            if (confirm('Delete this expense?')) {
                expenses = expenses.filter(e => e.id !== btn.dataset.id);
                saveExpenses();
                renderExpenses();
            }
        });
    });

    // Click to view receipt
    expensesList.querySelectorAll('.expense-item').forEach(el => {
        el.addEventListener('click', () => {
            const e = expenses.find(x => x.id === el.dataset.id);
            if (!e) return;
            modalBody.innerHTML = `
                ${e.receiptImage ? `<img src="${e.receiptImage}" class="modal-card-image" alt="Receipt" />` : ''}
                <h2>${escapeHtml(e.description)}</h2>
                <p class="modal-company">$${e.amount.toFixed(2)} &mdash; ${e.category}</p>
                <p>${e.date}</p>
                ${e.notes ? `<div class="modal-notes"><h4>Notes</h4><p>${escapeHtml(e.notes)}</p></div>` : ''}
            `;
            contactModal.style.display = 'flex';
        });
    });
}

expenseFilterCategory.addEventListener('change', renderExpenses);
expenseFilterMonth.addEventListener('change', renderExpenses);

// ============================================================
// MILEAGE TRACKER
// ============================================================
const mileageForm = document.getElementById('mileage-form');

// Set default date to today
document.getElementById('mileage-date').valueAsDate = new Date();

mileageForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const distance = parseFloat(document.getElementById('mileage-distance').value);
    if (!distance || distance <= 0) {
        alert('Please enter valid mileage.');
        return;
    }

    const trip = {
        id: Date.now().toString(36) + Math.random().toString(36).slice(2, 7),
        from: document.getElementById('mileage-from').value.trim(),
        to: document.getElementById('mileage-to').value.trim(),
        distance: distance,
        date: document.getElementById('mileage-date').value || new Date().toISOString().split('T')[0],
        purpose: document.getElementById('mileage-purpose').value,
        notes: document.getElementById('mileage-notes').value.trim(),
        createdAt: new Date().toISOString()
    };

    mileageTrips.push(trip);
    saveMileage();

    mileageForm.reset();
    document.getElementById('mileage-date').valueAsDate = new Date();
    renderMileage();
    alert('Trip logged!');
});

function renderMileage() {
    const now = new Date();
    const thisMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

    const totalMiles = mileageTrips.reduce((sum, t) => sum + t.distance, 0);
    const monthMiles = mileageTrips
        .filter(t => t.date && t.date.startsWith(thisMonth))
        .reduce((sum, t) => sum + t.distance, 0);
    const deduction = totalMiles * MILEAGE_RATE;

    document.getElementById('total-miles').textContent = totalMiles.toFixed(1);
    document.getElementById('month-miles').textContent = monthMiles.toFixed(1);
    document.getElementById('mileage-deduction').textContent = `$${deduction.toFixed(2)}`;

    const mileageList = document.getElementById('mileage-list');
    const noMileage = document.getElementById('no-mileage');

    const sorted = [...mileageTrips].sort((a, b) => new Date(b.date) - new Date(a.date));

    if (sorted.length === 0) {
        mileageList.innerHTML = '';
        noMileage.style.display = 'block';
        return;
    }
    noMileage.style.display = 'none';

    mileageList.innerHTML = sorted.map(t => `
        <div class="mileage-item">
            <div class="mileage-item-left">
                <div class="mileage-route">
                    ${t.from ? escapeHtml(t.from) : 'Start'} &rarr; ${t.to ? escapeHtml(t.to) : 'End'}
                </div>
                <div class="mileage-meta">
                    <span>${t.date}</span>
                    <span class="tag">${t.purpose}</span>
                    ${t.notes ? `<span>${escapeHtml(t.notes)}</span>` : ''}
                </div>
            </div>
            <div class="mileage-item-right">
                <span class="mileage-distance">${t.distance.toFixed(1)} mi</span>
                <span class="mileage-value">$${(t.distance * MILEAGE_RATE).toFixed(2)}</span>
                <button class="btn-icon delete-mileage" data-id="${t.id}" title="Delete">&times;</button>
            </div>
        </div>
    `).join('');

    mileageList.querySelectorAll('.delete-mileage').forEach(btn => {
        btn.addEventListener('click', () => {
            if (confirm('Delete this trip?')) {
                mileageTrips = mileageTrips.filter(t => t.id !== btn.dataset.id);
                saveMileage();
                renderMileage();
            }
        });
    });
}

// ============================================================
// DAILY PLANNER
// ============================================================
const eventForm = document.getElementById('event-form');

function formatDateKey(date) {
    return date.toISOString().split('T')[0];
}

function formatDisplayDate(date) {
    return date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
}

document.getElementById('planner-prev').addEventListener('click', () => {
    plannerDate.setDate(plannerDate.getDate() - 1);
    renderPlanner();
});

document.getElementById('planner-next').addEventListener('click', () => {
    plannerDate.setDate(plannerDate.getDate() + 1);
    renderPlanner();
});

document.getElementById('planner-today').addEventListener('click', () => {
    plannerDate = new Date();
    renderPlanner();
});

function renderPlanner() {
    const dateKey = formatDateKey(plannerDate);
    const todayKey = formatDateKey(new Date());

    // Title
    document.getElementById('planner-date-title').textContent = formatDisplayDate(plannerDate);

    // Week strip
    const weekContainer = document.getElementById('planner-week');
    const startOfWeek = new Date(plannerDate);
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());

    let weekHtml = '';
    for (let i = 0; i < 7; i++) {
        const d = new Date(startOfWeek);
        d.setDate(d.getDate() + i);
        const dk = formatDateKey(d);
        const isToday = dk === todayKey;
        const isSelected = dk === dateKey;
        const hasEvents = plannerEvents.some(e => e.date === dk) ||
            contacts.some(c => c.followUpDate === dk);
        weekHtml += `
            <button class="week-day ${isSelected ? 'selected' : ''} ${isToday ? 'today' : ''}" data-date="${dk}">
                <span class="week-day-name">${d.toLocaleDateString('en-US', { weekday: 'short' })}</span>
                <span class="week-day-num">${d.getDate()}</span>
                ${hasEvents ? '<span class="week-day-dot"></span>' : ''}
            </button>
        `;
    }
    weekContainer.innerHTML = weekHtml;

    weekContainer.querySelectorAll('.week-day').forEach(btn => {
        btn.addEventListener('click', () => {
            plannerDate = new Date(btn.dataset.date + 'T12:00:00');
            renderPlanner();
        });
    });

    // Populate contact dropdown in event form
    const contactSelect = document.getElementById('event-contact');
    contactSelect.innerHTML = '<option value="">None</option>';
    contacts.forEach(c => {
        const opt = document.createElement('option');
        opt.value = c.id;
        opt.textContent = c.name + (c.company ? ` (${c.company})` : '');
        contactSelect.appendChild(opt);
    });

    // Reminders due on this day
    const remindersContainer = document.getElementById('planner-reminders');
    const dueReminders = contacts.filter(c => c.followUpDate === dateKey);
    if (dueReminders.length > 0) {
        remindersContainer.innerHTML = `
            <div class="reminders-section">
                <h3>Follow-ups Due</h3>
                ${dueReminders.map(c => `
                    <div class="reminder-item">
                        <div class="reminder-info">
                            <strong>${escapeHtml(c.name)}</strong>
                            ${c.followUpNote ? `<span>${escapeHtml(c.followUpNote)}</span>` : ''}
                        </div>
                        <div class="reminder-actions">
                            ${c.phone ? `<a href="tel:${escapeHtml(c.phone)}" class="btn btn-secondary btn-sm">Call</a>` : ''}
                            ${c.email ? `<a href="mailto:${escapeHtml(c.email)}" class="btn btn-secondary btn-sm">Email</a>` : ''}
                            <button class="btn btn-primary btn-sm" onclick="markFollowUpDone('${c.id}'); renderPlanner();">Done</button>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    } else {
        remindersContainer.innerHTML = '';
    }

    // Day events
    const dayEvents = plannerEvents
        .filter(e => e.date === dateKey)
        .sort((a, b) => (a.time || '').localeCompare(b.time || ''));

    const eventsContainer = document.getElementById('planner-events');
    const noEvents = document.getElementById('no-events');

    if (dayEvents.length === 0 && dueReminders.length === 0) {
        eventsContainer.innerHTML = '';
        noEvents.style.display = 'block';
    } else {
        noEvents.style.display = 'none';
        eventsContainer.innerHTML = dayEvents.map(ev => {
            const linkedContact = ev.contactId ? contacts.find(c => c.id === ev.contactId) : null;
            return `
                <div class="planner-event">
                    <div class="event-time-col">
                        ${ev.time ? `<span class="event-time">${formatTime(ev.time)}</span>` : '<span class="event-time">All day</span>'}
                        ${ev.endTime ? `<span class="event-end-time">to ${formatTime(ev.endTime)}</span>` : ''}
                    </div>
                    <div class="event-details">
                        <strong>${escapeHtml(ev.title)}</strong>
                        ${ev.location ? `<span class="event-location">${escapeHtml(ev.location)}</span>` : ''}
                        ${linkedContact ? `<span class="event-contact-link">${escapeHtml(linkedContact.name)}</span>` : ''}
                        ${ev.notes ? `<span class="event-notes">${escapeHtml(ev.notes)}</span>` : ''}
                    </div>
                    <button class="btn-icon delete-event" data-id="${ev.id}" title="Delete">&times;</button>
                </div>
            `;
        }).join('');

        eventsContainer.querySelectorAll('.delete-event').forEach(btn => {
            btn.addEventListener('click', () => {
                if (confirm('Delete this event?')) {
                    plannerEvents = plannerEvents.filter(e => e.id !== btn.dataset.id);
                    saveEvents();
                    renderPlanner();
                }
            });
        });
    }
}

function formatTime(time24) {
    const [h, m] = time24.split(':');
    const hr = parseInt(h);
    const ampm = hr >= 12 ? 'PM' : 'AM';
    const hr12 = hr % 12 || 12;
    return `${hr12}:${m} ${ampm}`;
}

eventForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const title = document.getElementById('event-title').value.trim();
    if (!title) return;

    const event = {
        id: Date.now().toString(36) + Math.random().toString(36).slice(2, 7),
        title: title,
        date: formatDateKey(plannerDate),
        time: document.getElementById('event-time').value || null,
        endTime: document.getElementById('event-end-time').value || null,
        contactId: document.getElementById('event-contact').value || null,
        location: document.getElementById('event-location').value.trim(),
        notes: document.getElementById('event-notes').value.trim(),
        createdAt: new Date().toISOString()
    };

    plannerEvents.push(event);
    saveEvents();
    eventForm.reset();
    renderPlanner();
});

// ============================================================
// Initial render
// ============================================================
renderContacts();
