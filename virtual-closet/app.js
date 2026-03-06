/* ===== VIRTUALCLOSET WARDROBE — APP ===== */

// ===== HERO / LANDING =====
const hero = document.getElementById('hero');
const app = document.getElementById('app');
const enterBtn = document.getElementById('enter-app-btn');

enterBtn.addEventListener('click', () => {
    hero.style.opacity = '0';
    hero.style.transition = 'opacity 0.5s ease';
    setTimeout(() => {
        hero.style.display = 'none';
        app.style.display = 'block';
        app.style.opacity = '0';
        app.style.transition = 'opacity 0.4s ease';
        requestAnimationFrame(() => { app.style.opacity = '1'; });
    }, 500);
});

// ===== DATA LAYER =====
function loadItems() { return JSON.parse(localStorage.getItem('closet_items') || '[]'); }
function saveItems(items) { localStorage.setItem('closet_items', JSON.stringify(items)); }
function loadOutfits() { return JSON.parse(localStorage.getItem('closet_outfits') || '[]'); }
function saveOutfits(outfits) { localStorage.setItem('closet_outfits', JSON.stringify(outfits)); }
function loadPlans() { return JSON.parse(localStorage.getItem('closet_plans') || '[]'); }
function savePlans(plans) { localStorage.setItem('closet_plans', JSON.stringify(plans)); }
function loadSettings() {
    return JSON.parse(localStorage.getItem('closet_settings') || JSON.stringify({
        apiKey: '', proxyUrl: 'http://localhost:3000', location: ''
    }));
}
function saveSettings(s) { localStorage.setItem('closet_settings', JSON.stringify(s)); }
function loadComments() { return JSON.parse(localStorage.getItem('closet_comments') || '{}'); }
function saveComments(c) { localStorage.setItem('closet_comments', JSON.stringify(c)); }

function generateId() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 7); }
function escapeHtml(str) {
    const d = document.createElement('div');
    d.textContent = str;
    return d.innerHTML;
}

// ===== NAVIGATION =====
function switchView(viewName) {
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    const view = document.getElementById(viewName + '-view');
    const btn = document.querySelector(`.nav-btn[data-view="${viewName}"]`);
    if (view) view.classList.add('active');
    if (btn) btn.classList.add('active');

    if (viewName === 'closet') renderCloset();
    if (viewName === 'outfits') renderOutfits();
    if (viewName === 'planner') renderPlanner();
    if (viewName === 'stylist') initStylist();
    if (viewName === 'settings') loadSettingsForm();
}

document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', () => switchView(btn.dataset.view));
});

// ===== ADD ITEM — CAMERA & UPLOAD =====
let cameraStream = null;
let capturedImageData = null;

const startCameraBtn = document.getElementById('start-camera-btn');
const captureBtn = document.getElementById('capture-btn');
const retakeBtn = document.getElementById('retake-btn');
const fileUpload = document.getElementById('file-upload');
const cameraFeed = document.getElementById('camera-feed');
const snapCanvas = document.getElementById('snap-canvas');
const capturedPreview = document.getElementById('captured-preview');
const capturedImg = document.getElementById('captured-img');
const uploadPlaceholder = document.getElementById('upload-placeholder');
const itemForm = document.getElementById('item-form');

startCameraBtn.addEventListener('click', async () => {
    try {
        cameraStream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 960 } }
        });
        cameraFeed.srcObject = cameraStream;
        cameraFeed.style.display = 'block';
        uploadPlaceholder.style.display = 'none';
        capturedPreview.style.display = 'none';
        startCameraBtn.style.display = 'none';
        captureBtn.style.display = 'inline-flex';
    } catch (err) {
        alert('Could not access camera. Please upload an image instead.');
    }
});

captureBtn.addEventListener('click', () => {
    snapCanvas.width = cameraFeed.videoWidth;
    snapCanvas.height = cameraFeed.videoHeight;
    snapCanvas.getContext('2d').drawImage(cameraFeed, 0, 0);
    capturedImageData = compressImage(snapCanvas, 800);
    showCapturedImage(capturedImageData);
    stopCamera();
});

retakeBtn.addEventListener('click', () => {
    capturedImageData = null;
    capturedPreview.style.display = 'none';
    capturedImg.src = '';
    itemForm.style.display = 'none';
    uploadPlaceholder.style.display = 'flex';
    startCameraBtn.style.display = 'inline-flex';
    captureBtn.style.display = 'none';
    retakeBtn.style.display = 'none';
});

fileUpload.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement('canvas');
            capturedImageData = compressImage(drawImageToCanvas(img, canvas, 800));
            showCapturedImage(capturedImageData);
        };
        img.src = ev.target.result;
    };
    reader.readAsDataURL(file);
});

function compressImage(canvas, maxWidth) {
    if (canvas instanceof HTMLCanvasElement) {
        if (maxWidth && canvas.width > maxWidth) {
            const ratio = maxWidth / canvas.width;
            const tmpCanvas = document.createElement('canvas');
            tmpCanvas.width = maxWidth;
            tmpCanvas.height = canvas.height * ratio;
            tmpCanvas.getContext('2d').drawImage(canvas, 0, 0, tmpCanvas.width, tmpCanvas.height);
            return tmpCanvas.toDataURL('image/jpeg', 0.7);
        }
        return canvas.toDataURL('image/jpeg', 0.7);
    }
    return canvas;
}

function drawImageToCanvas(img, canvas, maxWidth) {
    let w = img.width, h = img.height;
    if (w > maxWidth) { h = h * (maxWidth / w); w = maxWidth; }
    canvas.width = w;
    canvas.height = h;
    canvas.getContext('2d').drawImage(img, 0, 0, w, h);
    return canvas;
}

function showCapturedImage(dataUrl) {
    capturedImg.src = dataUrl;
    capturedPreview.style.display = 'block';
    cameraFeed.style.display = 'none';
    uploadPlaceholder.style.display = 'none';
    startCameraBtn.style.display = 'none';
    captureBtn.style.display = 'none';
    retakeBtn.style.display = 'inline-flex';
    itemForm.style.display = 'block';
}

function stopCamera() {
    if (cameraStream) {
        cameraStream.getTracks().forEach(t => t.stop());
        cameraStream = null;
    }
}

// ===== ADD ITEM — COLOR PICKER =====
let selectedColors = [];

document.querySelectorAll('.color-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const color = btn.dataset.color;
        if (selectedColors.includes(color)) {
            selectedColors = selectedColors.filter(c => c !== color);
            btn.classList.remove('selected');
        } else {
            selectedColors.push(color);
            btn.classList.add('selected');
        }
        renderSelectedColors();
    });
});

function renderSelectedColors() {
    const container = document.getElementById('selected-colors');
    container.innerHTML = selectedColors.map(c =>
        `<span class="tag">${escapeHtml(c)} <span class="remove-tag" data-color="${escapeHtml(c)}">&times;</span></span>`
    ).join('');
    container.querySelectorAll('.remove-tag').forEach(el => {
        el.addEventListener('click', () => {
            const color = el.dataset.color;
            selectedColors = selectedColors.filter(c => c !== color);
            document.querySelector(`.color-btn[data-color="${color}"]`)?.classList.remove('selected');
            renderSelectedColors();
        });
    });
}

// ===== ADD ITEM — FORM SUBMIT =====
itemForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!capturedImageData) { alert('Please capture or upload a photo first.'); return; }
    const name = document.getElementById('item-name').value.trim();
    const category = document.getElementById('item-category').value;
    if (!name || !category) { alert('Please enter a name and select a category.'); return; }

    const seasons = [...document.querySelectorAll('input[name="season"]:checked')].map(c => c.value);
    const occasions = [...document.querySelectorAll('input[name="occasion"]:checked')].map(c => c.value);

    const item = {
        id: generateId(),
        image: capturedImageData,
        name: name,
        brand: document.getElementById('item-brand').value.trim(),
        category: category,
        colors: [...selectedColors],
        seasons: seasons,
        occasions: occasions,
        dateAdded: new Date().toISOString()
    };

    const items = loadItems();
    items.push(item);
    saveItems(items);

    // Reset form
    itemForm.reset();
    capturedImageData = null;
    capturedImg.src = '';
    capturedPreview.style.display = 'none';
    uploadPlaceholder.style.display = 'flex';
    startCameraBtn.style.display = 'inline-flex';
    retakeBtn.style.display = 'none';
    itemForm.style.display = 'none';
    selectedColors = [];
    document.querySelectorAll('.color-btn').forEach(b => b.classList.remove('selected'));
    renderSelectedColors();

    alert('Item saved to your closet!');
    switchView('closet');
});

// ===== MY CLOSET VIEW =====
function renderCloset() {
    const items = loadItems();
    const search = document.getElementById('closet-search').value.toLowerCase();
    const catFilter = document.getElementById('filter-category').value;
    const colorFilter = document.getElementById('filter-color').value;
    const seasonFilter = document.getElementById('filter-season').value;

    let filtered = items.filter(item => {
        if (search && !item.name.toLowerCase().includes(search) && !(item.brand || '').toLowerCase().includes(search)) return false;
        if (catFilter && item.category !== catFilter) return false;
        if (colorFilter && !item.colors.includes(colorFilter)) return false;
        if (seasonFilter && !item.seasons.includes(seasonFilter)) return false;
        return true;
    });

    document.getElementById('closet-count').textContent = filtered.length;
    const grid = document.getElementById('closet-grid');
    const empty = document.getElementById('closet-empty');

    if (filtered.length === 0) {
        grid.innerHTML = '';
        empty.style.display = 'block';
    } else {
        empty.style.display = 'none';
        grid.innerHTML = filtered.map(item => `
            <div class="closet-item" data-id="${item.id}" onclick="openItemModal('${item.id}')">
                <img src="${item.image}" alt="${escapeHtml(item.name)}" loading="lazy" />
                <div class="item-info">
                    <div class="item-title">${escapeHtml(item.name)}</div>
                    <div class="item-cat">${escapeHtml(item.category)}</div>
                </div>
            </div>
        `).join('');
    }
}

// Filter listeners
['closet-search', 'filter-category', 'filter-color', 'filter-season'].forEach(id => {
    document.getElementById(id).addEventListener('input', renderCloset);
    document.getElementById(id).addEventListener('change', renderCloset);
});

// ===== ITEM DETAIL MODAL =====
function openItemModal(itemId) {
    const items = loadItems();
    const item = items.find(i => i.id === itemId);
    if (!item) return;

    const modal = document.getElementById('item-modal');
    const body = document.getElementById('modal-body');
    body.innerHTML = `
        <img class="modal-img" src="${item.image}" alt="${escapeHtml(item.name)}" />
        <h3>${escapeHtml(item.name)}</h3>
        ${item.brand ? `<p style="color:var(--text-light);font-size:0.85rem;">${escapeHtml(item.brand)}</p>` : ''}
        <p style="text-transform:capitalize;font-size:0.9rem;margin-top:4px;">${escapeHtml(item.category)}</p>
        <div class="modal-tags">
            ${item.colors.map(c => `<span class="tag">${escapeHtml(c)}</span>`).join('')}
            ${item.seasons.map(s => `<span class="tag">${escapeHtml(s)}</span>`).join('')}
            ${item.occasions.map(o => `<span class="tag">${escapeHtml(o)}</span>`).join('')}
        </div>
        <p style="font-size:0.75rem;color:var(--text-light);">Added ${new Date(item.dateAdded).toLocaleDateString()}</p>
        <div class="modal-actions">
            <button class="btn btn-danger btn-sm" onclick="deleteItem('${item.id}')">Delete</button>
            <button class="btn btn-secondary btn-sm" onclick="closeModal('item-modal')">Close</button>
        </div>
    `;
    modal.style.display = 'flex';
}

function deleteItem(itemId) {
    if (!confirm('Delete this item from your closet?')) return;
    let items = loadItems();
    items = items.filter(i => i.id !== itemId);
    saveItems(items);
    // Also remove from outfits
    let outfits = loadOutfits();
    outfits = outfits.map(o => ({ ...o, itemIds: o.itemIds.filter(id => id !== itemId) }));
    outfits = outfits.filter(o => o.itemIds.length > 0);
    saveOutfits(outfits);
    closeModal('item-modal');
    renderCloset();
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

document.getElementById('close-item-modal').addEventListener('click', () => closeModal('item-modal'));
document.getElementById('close-planner-modal').addEventListener('click', () => closeModal('planner-modal'));

// Close modals on backdrop click
['item-modal', 'planner-modal'].forEach(id => {
    document.getElementById(id).addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) closeModal(id);
    });
});

// ===== OUTFITS VIEW =====
let outfitSelectedIds = [];

function renderOutfits() {
    const outfits = loadOutfits();
    const items = loadItems();
    const list = document.getElementById('outfits-list');
    const empty = document.getElementById('outfits-empty');
    const builder = document.getElementById('outfit-builder');

    if (outfits.length === 0 && builder.style.display === 'none') {
        empty.style.display = 'block';
        list.innerHTML = '';
    } else {
        empty.style.display = 'none';
        list.innerHTML = outfits.map(outfit => {
            const outfitItems = outfit.itemIds.map(id => items.find(i => i.id === id)).filter(Boolean);
            const comments = loadComments()[outfit.id] || [];
            return `
                <div class="outfit-card">
                    <h3>
                        ${escapeHtml(outfit.name)}
                        <button class="fav-btn ${outfit.favorite ? 'favorited' : ''}" onclick="toggleFavorite('${outfit.id}')">
                            ${outfit.favorite ? '&#10084;' : '&#9825;'}
                        </button>
                    </h3>
                    <div class="outfit-items">
                        ${outfitItems.map(i => `<img src="${i.image}" alt="${escapeHtml(i.name)}" title="${escapeHtml(i.name)}" />`).join('')}
                    </div>
                    <div class="outfit-actions">
                        <button class="btn btn-secondary btn-sm" onclick="shareOutfit('${outfit.id}')">Share</button>
                        <button class="btn btn-danger btn-sm" onclick="deleteOutfit('${outfit.id}')">Delete</button>
                    </div>
                    <div id="share-section-${outfit.id}"></div>
                    <div class="comments-section" id="comments-${outfit.id}">
                        ${renderCommentsHTML(outfit.id, comments)}
                    </div>
                </div>
            `;
        }).join('');
    }
}

function renderCommentsHTML(outfitId, comments) {
    if (!comments) comments = [];
    return `
        <div class="share-section" style="margin-top:10px;">
            <details>
                <summary style="cursor:pointer;font-size:0.85rem;font-weight:600;color:var(--text-light);">
                    Comments (${comments.length})
                </summary>
                <div class="comments-list">
                    ${comments.map(c => `
                        <div class="comment">
                            <span class="comment-author">${escapeHtml(c.author)}</span>
                            <span class="comment-time">${new Date(c.time).toLocaleString()}</span>
                            <p class="comment-text">${escapeHtml(c.text)}</p>
                        </div>
                    `).join('')}
                </div>
                <div class="comment-form">
                    <input type="text" id="comment-author-${outfitId}" placeholder="Your name" style="max-width:100px;" />
                    <input type="text" id="comment-text-${outfitId}" placeholder="Add a comment..." />
                    <button class="btn btn-primary btn-sm" onclick="addComment('${outfitId}')">Post</button>
                </div>
            </details>
        </div>
    `;
}

function addComment(outfitId) {
    const authorEl = document.getElementById('comment-author-' + outfitId);
    const textEl = document.getElementById('comment-text-' + outfitId);
    const author = authorEl.value.trim() || 'Anonymous';
    const text = textEl.value.trim();
    if (!text) return;

    const allComments = loadComments();
    if (!allComments[outfitId]) allComments[outfitId] = [];
    allComments[outfitId].push({ author, text, time: new Date().toISOString() });
    saveComments(allComments);
    renderOutfits();
}

function shareOutfit(outfitId) {
    const outfits = loadOutfits();
    const items = loadItems();
    const outfit = outfits.find(o => o.id === outfitId);
    if (!outfit) return;

    const outfitItems = outfit.itemIds.map(id => items.find(i => i.id === id)).filter(Boolean);

    // Build shareable text
    const shareText = `Check out my outfit "${outfit.name}"!\n\nItems:\n${outfitItems.map(i => `- ${i.name} (${i.category})`).join('\n')}\n\nCreated with Virtual Closet AI`;

    if (navigator.share) {
        navigator.share({ title: outfit.name, text: shareText }).catch(() => {});
    } else {
        // Fallback: copy to clipboard
        navigator.clipboard.writeText(shareText).then(() => {
            alert('Outfit details copied to clipboard! Share it with your friends.');
        }).catch(() => {
            prompt('Copy this to share:', shareText);
        });
    }
}

document.getElementById('create-outfit-btn').addEventListener('click', () => {
    outfitSelectedIds = [];
    document.getElementById('outfit-builder').style.display = 'block';
    document.getElementById('outfits-empty').style.display = 'none';
    document.getElementById('outfit-name').value = '';
    renderOutfitPicker();
    renderOutfitSelected();
});

document.getElementById('cancel-outfit-btn').addEventListener('click', () => {
    document.getElementById('outfit-builder').style.display = 'none';
    renderOutfits();
});

document.getElementById('outfit-filter-category').addEventListener('change', renderOutfitPicker);

function renderOutfitPicker() {
    const items = loadItems();
    const catFilter = document.getElementById('outfit-filter-category').value;
    let filtered = catFilter ? items.filter(i => i.category === catFilter) : items;
    const grid = document.getElementById('outfit-item-picker');
    grid.innerHTML = filtered.map(item => `
        <div class="closet-item ${outfitSelectedIds.includes(item.id) ? 'selected' : ''}"
             data-id="${item.id}" onclick="toggleOutfitItem('${item.id}')">
            <img src="${item.image}" alt="${escapeHtml(item.name)}" loading="lazy" />
            <div class="item-info">
                <div class="item-title">${escapeHtml(item.name)}</div>
            </div>
        </div>
    `).join('');
}

function toggleOutfitItem(itemId) {
    if (outfitSelectedIds.includes(itemId)) {
        outfitSelectedIds = outfitSelectedIds.filter(id => id !== itemId);
    } else {
        outfitSelectedIds.push(itemId);
    }
    renderOutfitPicker();
    renderOutfitSelected();
}

function renderOutfitSelected() {
    const items = loadItems();
    const container = document.getElementById('outfit-selected');
    container.innerHTML = outfitSelectedIds.map(id => {
        const item = items.find(i => i.id === id);
        if (!item) return '';
        return `
            <div class="mini-item">
                <img src="${item.image}" alt="${escapeHtml(item.name)}" />
                <button class="remove-item" onclick="toggleOutfitItem('${item.id}')">&times;</button>
            </div>
        `;
    }).join('');
}

document.getElementById('save-outfit-btn').addEventListener('click', () => {
    const name = document.getElementById('outfit-name').value.trim();
    if (!name) { alert('Please name your outfit.'); return; }
    if (outfitSelectedIds.length < 2) { alert('Select at least 2 items for an outfit.'); return; }

    const outfit = {
        id: generateId(),
        name: name,
        itemIds: [...outfitSelectedIds],
        favorite: false,
        dateCreated: new Date().toISOString()
    };

    const outfits = loadOutfits();
    outfits.push(outfit);
    saveOutfits(outfits);
    document.getElementById('outfit-builder').style.display = 'none';
    renderOutfits();
});

function toggleFavorite(outfitId) {
    const outfits = loadOutfits();
    const outfit = outfits.find(o => o.id === outfitId);
    if (outfit) { outfit.favorite = !outfit.favorite; saveOutfits(outfits); renderOutfits(); }
}

function deleteOutfit(outfitId) {
    if (!confirm('Delete this outfit?')) return;
    let outfits = loadOutfits();
    outfits = outfits.filter(o => o.id !== outfitId);
    saveOutfits(outfits);
    renderOutfits();
}

// ===== AI STYLIST =====
let currentWeather = null;

function initStylist() {
    const settings = loadSettings();
    const noKey = document.getElementById('stylist-no-key');
    const panel = document.getElementById('stylist-panel');

    if (settings.apiKey) {
        noKey.style.display = 'none';
        panel.style.display = 'block';
        fetchWeather();
    } else {
        noKey.style.display = 'block';
        panel.style.display = 'none';
    }
}

async function fetchWeather() {
    const settings = loadSettings();
    if (!settings.location) return;

    try {
        // Geocode location
        const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(settings.location)}&count=1`);
        const geoData = await geoRes.json();
        if (!geoData.results || !geoData.results.length) return;

        const { latitude, longitude } = geoData.results[0];
        const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weathercode&daily=temperature_2m_max,temperature_2m_min,weathercode&temperature_unit=fahrenheit&timezone=auto&forecast_days=7`);
        const weatherData = await weatherRes.json();

        currentWeather = {
            temp: Math.round(weatherData.current.temperature_2m),
            code: weatherData.current.weathercode,
            daily: weatherData.daily
        };

        const weatherInfo = document.getElementById('weather-info');
        const weatherIcon = document.getElementById('weather-icon');
        const weatherTemp = document.getElementById('weather-temp');
        const weatherDesc = document.getElementById('weather-desc');

        weatherIcon.textContent = getWeatherEmoji(currentWeather.code);
        weatherTemp.textContent = currentWeather.temp + '°F';
        weatherDesc.textContent = getWeatherDescription(currentWeather.code) + ' in ' + settings.location;
        weatherInfo.style.display = 'flex';
    } catch (err) {
        console.error('Weather fetch failed:', err);
    }
}

function getWeatherEmoji(code) {
    if (code === 0) return '☀️';
    if (code <= 3) return '⛅';
    if (code <= 48) return '🌫️';
    if (code <= 67) return '🌧️';
    if (code <= 77) return '🌨️';
    if (code <= 82) return '🌧️';
    if (code <= 86) return '❄️';
    return '⛈️';
}

function getWeatherDescription(code) {
    if (code === 0) return 'Clear sky';
    if (code <= 3) return 'Partly cloudy';
    if (code <= 48) return 'Foggy';
    if (code <= 55) return 'Drizzle';
    if (code <= 67) return 'Rain';
    if (code <= 77) return 'Snow';
    if (code <= 82) return 'Rain showers';
    if (code <= 86) return 'Snow showers';
    return 'Thunderstorm';
}

document.getElementById('get-recommendations-btn').addEventListener('click', getRecommendations);

async function getRecommendations() {
    const settings = loadSettings();
    const items = loadItems();

    if (items.length < 3) { alert('Add at least 3 items to your closet first!'); return; }

    const occasion = document.getElementById('stylist-occasion').value;
    const notes = document.getElementById('stylist-notes').value.trim();
    const loading = document.getElementById('stylist-loading');
    const results = document.getElementById('stylist-results');

    loading.style.display = 'block';
    results.innerHTML = '';

    // Build wardrobe summary
    const wardrobeSummary = items.map(i =>
        `- "${i.name}" (${i.category}, colors: ${i.colors.join('/')}, seasons: ${i.seasons.join('/')}, occasions: ${i.occasions.join('/')})`
    ).join('\n');

    // Select up to 8 items to send as images (prioritize matching occasion)
    let relevantItems = items.filter(i => i.occasions.includes(occasion));
    if (relevantItems.length < 8) {
        const remaining = items.filter(i => !i.occasions.includes(occasion));
        relevantItems = [...relevantItems, ...remaining].slice(0, 8);
    } else {
        relevantItems = relevantItems.slice(0, 8);
    }

    // Build weather context
    let weatherContext = '';
    if (currentWeather) {
        weatherContext = `\nCurrent weather: ${currentWeather.temp}°F, ${getWeatherDescription(currentWeather.code)}.`;
    }

    const systemPrompt = `You are an expert fashion stylist and wardrobe consultant. You help people create stylish, cohesive outfits from their existing wardrobe. You understand color theory, pattern mixing, seasonal dressing, and occasion-appropriate styling. Be enthusiastic but practical. Reference specific items by their exact names.`;

    const userPrompt = `Here is my wardrobe:
${wardrobeSummary}
${weatherContext}

I need outfit suggestions for: ${occasion}${notes ? '\nMy preferences: ' + notes : ''}

Please suggest exactly 3 complete outfits. For each outfit:
1. Give it a creative name
2. List the specific items to wear (use exact item names from my wardrobe)
3. Explain WHY this combination works (colors, style, weather-appropriateness)
4. Rate it on a vibe scale (e.g., "Casual Cool 8/10")

Format your response as JSON array with this structure:
[{"name": "Outfit Name", "items": ["item name 1", "item name 2"], "explanation": "Why it works...", "vibe": "Vibe Rating"}]

IMPORTANT: Only use items that exist in my wardrobe list above. Return ONLY the JSON array, no other text.`;

    // Build content with images
    const content = [
        { type: 'text', text: userPrompt },
        ...relevantItems.map(item => ({
            type: 'image',
            source: {
                type: 'base64',
                media_type: 'image/jpeg',
                data: item.image.replace(/^data:image\/\w+;base64,/, '')
            }
        }))
    ];

    try {
        const response = await fetch(settings.proxyUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                apiKey: settings.apiKey,
                model: 'claude-sonnet-4-20250514',
                max_tokens: 1500,
                system: systemPrompt,
                messages: [{ role: 'user', content: content }]
            })
        });

        if (!response.ok) {
            const errText = await response.text();
            throw new Error(errText || 'API request failed');
        }

        const data = await response.json();
        const aiText = data.content?.[0]?.text || data.text || '';

        // Parse JSON from response
        let recommendations;
        try {
            const jsonMatch = aiText.match(/\[[\s\S]*\]/);
            recommendations = jsonMatch ? JSON.parse(jsonMatch[0]) : JSON.parse(aiText);
        } catch {
            // Fallback: display raw text
            results.innerHTML = `<div class="recommendation-card"><p>${escapeHtml(aiText)}</p></div>`;
            loading.style.display = 'none';
            return;
        }

        results.innerHTML = recommendations.map((rec, idx) => {
            const matchedItems = rec.items.map(name => {
                const lower = name.toLowerCase();
                return items.find(i => i.name.toLowerCase() === lower || i.name.toLowerCase().includes(lower) || lower.includes(i.name.toLowerCase()));
            }).filter(Boolean);

            return `
                <div class="recommendation-card">
                    <h3>Outfit ${idx + 1}: ${escapeHtml(rec.name)}</h3>
                    <div class="recommendation-items">
                        ${matchedItems.map(i => `<img src="${i.image}" alt="${escapeHtml(i.name)}" title="${escapeHtml(i.name)}" />`).join('')}
                    </div>
                    <p>${escapeHtml(rec.explanation)}</p>
                    <p><strong>${escapeHtml(rec.vibe)}</strong></p>
                    <div class="recommendation-actions">
                        <button class="btn btn-primary btn-sm" onclick="saveAIOutfit('${escapeHtml(rec.name)}', ${JSON.stringify(matchedItems.map(i => i.id)).replace(/"/g, '&quot;')})">
                            Save Outfit
                        </button>
                    </div>
                </div>
            `;
        }).join('');

    } catch (err) {
        results.innerHTML = `<div class="recommendation-card" style="border-left-color:var(--danger);">
            <h3>Oops!</h3>
            <p>Could not get recommendations: ${escapeHtml(err.message)}</p>
            <p style="font-size:0.8rem;">Make sure the proxy server is running: <code>node proxy.js</code></p>
        </div>`;
    }

    loading.style.display = 'none';
}

function saveAIOutfit(name, itemIds) {
    const outfit = {
        id: generateId(),
        name: name,
        itemIds: itemIds,
        favorite: false,
        dateCreated: new Date().toISOString()
    };
    const outfits = loadOutfits();
    outfits.push(outfit);
    saveOutfits(outfits);
    alert('Outfit saved!');
}

// ===== PLANNER =====
let plannerWeekStart = getMonday(new Date());

function getMonday(date) {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    d.setDate(diff);
    d.setHours(0, 0, 0, 0);
    return d;
}

function formatDateKey(date) {
    return date.toISOString().split('T')[0];
}

function renderPlanner() {
    const label = document.getElementById('planner-week-label');
    const grid = document.getElementById('planner-grid');
    const plans = loadPlans();
    const items = loadItems();
    const outfits = loadOutfits();
    const today = formatDateKey(new Date());
    const settings = loadSettings();

    const weekEnd = new Date(plannerWeekStart);
    weekEnd.setDate(weekEnd.getDate() + 6);
    label.textContent = `${plannerWeekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${weekEnd.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;

    let daysHtml = '';
    for (let i = 0; i < 7; i++) {
        const d = new Date(plannerWeekStart);
        d.setDate(d.getDate() + i);
        const key = formatDateKey(d);
        const dayName = d.toLocaleDateString('en-US', { weekday: 'long' });
        const dayDate = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        const isToday = key === today;

        const plan = plans.find(p => p.date === key);
        let outfitHtml = '<div class="no-outfit">No outfit planned — tap to add</div>';
        let weatherHtml = '';

        if (plan) {
            let planItems = [];
            if (plan.outfitId) {
                const outfit = outfits.find(o => o.id === plan.outfitId);
                if (outfit) planItems = outfit.itemIds.map(id => items.find(it => it.id === id)).filter(Boolean);
            } else if (plan.itemIds) {
                planItems = plan.itemIds.map(id => items.find(it => it.id === id)).filter(Boolean);
            }
            if (planItems.length) {
                outfitHtml = `<div class="planner-day-outfit">
                    ${planItems.map(it => `<img src="${it.image}" alt="${escapeHtml(it.name)}" title="${escapeHtml(it.name)}" />`).join('')}
                </div>`;
            }
        }

        // Weather for this day
        if (currentWeather && currentWeather.daily) {
            const dailyDates = currentWeather.daily.time;
            const dayIdx = dailyDates.indexOf(key);
            if (dayIdx >= 0) {
                const hi = Math.round(currentWeather.daily.temperature_2m_max[dayIdx]);
                const lo = Math.round(currentWeather.daily.temperature_2m_min[dayIdx]);
                const code = currentWeather.daily.weathercode[dayIdx];
                weatherHtml = `<span class="day-weather">${getWeatherEmoji(code)} ${hi}°/${lo}°</span>`;
            }
        }

        daysHtml += `
            <div class="planner-day ${isToday ? 'today' : ''}" onclick="openPlannerModal('${key}')">
                <div class="planner-day-header">
                    <span class="day-label">${dayName}</span>
                    <span class="day-date">${dayDate}</span>
                    ${weatherHtml}
                </div>
                ${outfitHtml}
            </div>
        `;
    }
    grid.innerHTML = daysHtml;
}

document.getElementById('prev-week').addEventListener('click', () => {
    plannerWeekStart.setDate(plannerWeekStart.getDate() - 7);
    renderPlanner();
});
document.getElementById('next-week').addEventListener('click', () => {
    plannerWeekStart.setDate(plannerWeekStart.getDate() + 7);
    renderPlanner();
});

function openPlannerModal(dateKey) {
    const modal = document.getElementById('planner-modal');
    const body = document.getElementById('planner-modal-body');
    const outfits = loadOutfits();
    const plans = loadPlans();
    const currentPlan = plans.find(p => p.date === dateKey);
    const d = new Date(dateKey + 'T12:00:00');
    const dateLabel = d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

    body.innerHTML = `
        <h3>Plan for ${dateLabel}</h3>
        ${outfits.length ? `
            <div class="form-group">
                <label>Choose a saved outfit:</label>
                <select id="plan-outfit-select">
                    <option value="">Select outfit...</option>
                    ${outfits.map(o => `<option value="${o.id}" ${currentPlan && currentPlan.outfitId === o.id ? 'selected' : ''}>${escapeHtml(o.name)}</option>`).join('')}
                </select>
            </div>
            <button class="btn btn-primary btn-full" onclick="savePlan('${dateKey}')">Save Plan</button>
            ${currentPlan ? `<button class="btn btn-danger btn-full" style="margin-top:8px;" onclick="removePlan('${dateKey}')">Remove Plan</button>` : ''}
        ` : `
            <p class="empty-state">No saved outfits yet. Create one in the Outfits tab or use the AI Stylist!</p>
        `}
    `;
    modal.style.display = 'flex';
}

function savePlan(dateKey) {
    const outfitId = document.getElementById('plan-outfit-select').value;
    if (!outfitId) { alert('Select an outfit.'); return; }

    let plans = loadPlans();
    plans = plans.filter(p => p.date !== dateKey);
    plans.push({ id: generateId(), date: dateKey, outfitId: outfitId });
    savePlans(plans);
    closeModal('planner-modal');
    renderPlanner();
}

function removePlan(dateKey) {
    let plans = loadPlans();
    plans = plans.filter(p => p.date !== dateKey);
    savePlans(plans);
    closeModal('planner-modal');
    renderPlanner();
}

// ===== SETTINGS =====
function loadSettingsForm() {
    const s = loadSettings();
    document.getElementById('api-key-input').value = s.apiKey;
    document.getElementById('proxy-url-input').value = s.proxyUrl;
    document.getElementById('location-input').value = s.location;
}

document.getElementById('save-settings-btn').addEventListener('click', () => {
    const s = {
        apiKey: document.getElementById('api-key-input').value.trim(),
        proxyUrl: document.getElementById('proxy-url-input').value.trim() || 'http://localhost:3000',
        location: document.getElementById('location-input').value.trim()
    };
    saveSettings(s);
    showSettingsStatus('Settings saved!', 'success');
});

document.getElementById('toggle-key-btn').addEventListener('click', () => {
    const input = document.getElementById('api-key-input');
    const btn = document.getElementById('toggle-key-btn');
    if (input.type === 'password') { input.type = 'text'; btn.textContent = 'Hide'; }
    else { input.type = 'password'; btn.textContent = 'Show'; }
});

document.getElementById('test-connection-btn').addEventListener('click', async () => {
    const settings = loadSettings();
    if (!settings.apiKey) { showSettingsStatus('Enter an API key first.', 'error'); return; }

    try {
        const res = await fetch(settings.proxyUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                apiKey: settings.apiKey,
                model: 'claude-sonnet-4-20250514',
                max_tokens: 50,
                messages: [{ role: 'user', content: 'Say "Connected!" in one word.' }]
            })
        });
        if (res.ok) {
            showSettingsStatus('Connection successful!', 'success');
        } else {
            const errText = await res.text();
            showSettingsStatus('Connection failed: ' + errText, 'error');
        }
    } catch (err) {
        showSettingsStatus('Could not connect. Is the proxy running? Run: node proxy.js', 'error');
    }
});

function showSettingsStatus(msg, type) {
    const el = document.getElementById('settings-status');
    el.textContent = msg;
    el.className = type;
}

document.getElementById('export-data-btn').addEventListener('click', () => {
    const data = {
        items: loadItems(),
        outfits: loadOutfits(),
        plans: loadPlans(),
        comments: loadComments(),
        settings: { ...loadSettings(), apiKey: '***' }
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'virtual-closet-backup.json';
    a.click();
});

document.getElementById('clear-data-btn').addEventListener('click', () => {
    if (!confirm('This will delete ALL your closet data. Are you sure?')) return;
    if (!confirm('Really? This cannot be undone!')) return;
    localStorage.removeItem('closet_items');
    localStorage.removeItem('closet_outfits');
    localStorage.removeItem('closet_plans');
    localStorage.removeItem('closet_comments');
    alert('All data cleared.');
    switchView('add');
});

// ===== INIT =====
// Load initial view data
renderCloset();
