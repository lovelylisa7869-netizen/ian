/* ============ Made with Love — app.js ============ */

const DAYS = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
const SLOTS = ['breakfast','lunch','dinner'];

const DEFAULT_RECIPES = [
  { id:'r1', name:'Honey Garlic Salmon', emoji:'🐟', category:'Mains', servings:4,
    note:'the one you loved at my place — flaky + sweet ♡',
    ingredients:[
      {amt:1.5, unit:'lb', item:'salmon'},
      {amt:3, unit:'tbsp', item:'honey'},
      {amt:4, unit:'clove', item:'garlic'},
      {amt:2, unit:'tbsp', item:'soy sauce'},
      {amt:1, unit:'tbsp', item:'olive oil'},
      {amt:1, unit:'tsp', item:'lemon juice'},
      {amt:0.5, unit:'tsp', item:'salt'},
    ],
    steps:['pat salmon dry, season with salt','mince garlic',
      'mix honey, soy, garlic, lemon','sear salmon skin-side down 4 min',
      'flip, pour sauce, cook 3 min, spoon glaze over'] },
  { id:'r2', name:'Cozy Chicken Rice Bowl', emoji:'🍚', category:'Mains', servings:4,
    note:'easy leftovers — reheats beautifully for lunch',
    ingredients:[
      {amt:1, unit:'lb', item:'chicken thigh'},
      {amt:2, unit:'cup', item:'jasmine rice'},
      {amt:3, unit:'cup', item:'chicken broth'},
      {amt:1, unit:'tbsp', item:'ginger'},
      {amt:2, unit:'tbsp', item:'soy sauce'},
      {amt:2, unit:'stalk', item:'green onion'},
      {amt:1, unit:'tbsp', item:'sesame oil'},
    ],
    steps:['rinse rice','simmer chicken in broth w ginger 20 min',
      'cook rice in broth','shred chicken, toss w soy + sesame',
      'top rice with chicken + green onion'] },
  { id:'r3', name:'Overnight Strawberry Oats', emoji:'🍓', category:'Breakfast', servings:3,
    note:'for mornings you don\'t want to think ♡',
    ingredients:[
      {amt:1.5, unit:'cup', item:'rolled oats'},
      {amt:1.5, unit:'cup', item:'milk'},
      {amt:0.5, unit:'cup', item:'yogurt'},
      {amt:3, unit:'tbsp', item:'honey'},
      {amt:1, unit:'cup', item:'strawberry'},
      {amt:1, unit:'tsp', item:'vanilla'},
      {amt:2, unit:'tbsp', item:'chia seed'},
    ],
    steps:['slice strawberries','mix oats, milk, yogurt, honey, vanilla, chia',
      'layer with strawberries in jars','fridge overnight'] },
  { id:'r4', name:'Creamy Tomato Pasta', emoji:'🍝', category:'Mains', servings:4,
    note:'the rainy day dinner — scales up so well',
    ingredients:[
      {amt:1, unit:'lb', item:'pasta'},
      {amt:1, unit:'can', item:'crushed tomatoes'},
      {amt:0.5, unit:'cup', item:'heavy cream'},
      {amt:3, unit:'clove', item:'garlic'},
      {amt:1, unit:'tbsp', item:'olive oil'},
      {amt:0.5, unit:'cup', item:'parmesan'},
      {amt:1, unit:'tsp', item:'salt'},
      {amt:1, unit:'pinch', item:'red pepper flake'},
    ],
    steps:['boil pasta','sauté garlic in oil','add tomatoes, simmer 10 min',
      'stir in cream + parmesan','toss with pasta'] },
  { id:'r5', name:'Lemon Herb Chickpeas', emoji:'🥗', category:'Lunch', servings:3,
    note:'meal-prep champion, stays good 4 days in the fridge',
    ingredients:[
      {amt:2, unit:'can', item:'chickpeas'},
      {amt:1, unit:'', item:'cucumber'},
      {amt:1, unit:'cup', item:'cherry tomato'},
      {amt:0.25, unit:'cup', item:'feta'},
      {amt:2, unit:'tbsp', item:'olive oil'},
      {amt:1, unit:'', item:'lemon'},
      {amt:1, unit:'tsp', item:'oregano'},
      {amt:0.5, unit:'tsp', item:'salt'},
    ],
    steps:['drain chickpeas','dice cucumber + tomato',
      'whisk oil + lemon juice + oregano + salt','toss everything with feta'] },
  { id:'r6', name:'Brown Butter Banana Bread', emoji:'🍌', category:'Sweets', servings:8,
    note:'a little treat for the week ♡',
    ingredients:[
      {amt:3, unit:'', item:'banana'},
      {amt:0.5, unit:'cup', item:'butter'},
      {amt:0.75, unit:'cup', item:'sugar'},
      {amt:2, unit:'', item:'egg'},
      {amt:1.5, unit:'cup', item:'flour'},
      {amt:1, unit:'tsp', item:'baking soda'},
      {amt:1, unit:'tsp', item:'vanilla'},
      {amt:0.5, unit:'tsp', item:'salt'},
    ],
    steps:['brown butter, cool','mash bananas','whisk w sugar, egg, vanilla',
      'fold in flour + soda + salt','bake 350° for 55 min'] },
];

/* ============ state ============ */
const LS_KEY = 'mwl_state_v1';
const state = loadState();

function loadState(){
  try{
    const s = JSON.parse(localStorage.getItem(LS_KEY) || 'null');
    if(s && s.recipes) return s;
  }catch(e){}
  return {
    recipes: DEFAULT_RECIPES,
    weeks: {},          // { 'YYYY-MM-DD': { 0:{breakfast:[], lunch:[], dinner:[]}, 1:{...}, ... } }
    checked: {},        // grocery check state per week
    saved: [],          // saved plans
    currentWeek: weekKey(new Date()),
  };
}
function save(){ localStorage.setItem(LS_KEY, JSON.stringify(state)); }

/* ============ helpers ============ */
function weekKey(d){
  // Sunday-start week
  const x = new Date(d); x.setHours(0,0,0,0);
  x.setDate(x.getDate() - x.getDay());
  return x.toISOString().slice(0,10);
}
function addDays(isoKey, n){
  const d = new Date(isoKey); d.setDate(d.getDate()+n); return d;
}
function fmtDate(d){
  return d.toLocaleDateString(undefined,{month:'short',day:'numeric'});
}
function ensureWeek(key){
  if(!state.weeks[key]){
    state.weeks[key] = {};
    for(let i=0;i<7;i++) state.weeks[key][i] = {breakfast:[], lunch:[], dinner:[]};
  }
  return state.weeks[key];
}
function scaleIngredients(recipe, targetServings){
  const factor = targetServings / recipe.servings;
  return recipe.ingredients.map(ing => ({
    ...ing,
    amt: +(ing.amt * factor).toFixed(2)
  }));
}
function fmtAmt(a){
  if(a === Math.floor(a)) return String(a);
  // nice fraction-ish rounding
  return (+a.toFixed(2)).toString();
}
function toast(msg){
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toast._t);
  toast._t = setTimeout(()=>t.classList.remove('show'), 1800);
}
function uid(){ return 'x'+Math.random().toString(36).slice(2,9); }

/* ============ tabs ============ */
document.querySelectorAll('.tab').forEach(btn=>{
  btn.addEventListener('click',()=>{
    document.querySelectorAll('.tab').forEach(b=>b.classList.remove('active'));
    document.querySelectorAll('.view').forEach(v=>v.classList.remove('active'));
    btn.classList.add('active');
    const id = btn.dataset.tab;
    document.getElementById(id).classList.add('active');
    if(id==='planner') renderWeek();
    if(id==='grocery') renderGrocery();
    if(id==='saved') renderSaved();
  });
});

/* ============ cookbook ============ */
function renderCookbook(){
  const grid = document.getElementById('recipeGrid');
  grid.innerHTML = '';
  state.recipes.forEach(r=>{
    const card = document.createElement('div');
    card.className = 'recipe-card';
    card.innerHTML = `
      <span class="emoji">${r.emoji}</span>
      <span class="cat">${r.category}</span>
      <h3>${r.name}</h3>
      <p class="note">${r.note||''}</p>
      <div class="meta">
        <span>serves ${r.servings}</span>
        <span>${r.ingredients.length} ingredients</span>
      </div>`;
    card.addEventListener('click',()=>openRecipe(r.id));
    grid.appendChild(card);
  });
}

function openRecipe(id){
  const r = state.recipes.find(x=>x.id===id);
  if(!r) return;
  const body = document.getElementById('recipeModalBody');
  body.className = 'recipe-full';
  body.innerHTML = `
    <span class="emoji-big">${r.emoji}</span>
    <h3 style="text-align:center">${r.name}</h3>
    <p class="note-full">${r.note||''}</p>
    <div style="text-align:center;margin-bottom:10px">
      <span class="cat" style="display:inline-block;font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:var(--pink-500);background:var(--pink-50);border-radius:999px;padding:3px 10px">${r.category}</span>
      <span class="cat" style="display:inline-block;font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:var(--pink-500);background:var(--pink-50);border-radius:999px;padding:3px 10px;margin-left:4px">serves ${r.servings}</span>
    </div>
    <h4>Ingredients</h4>
    <ul>${r.ingredients.map(i=>`<li>${fmtAmt(i.amt)} ${i.unit} ${i.item}</li>`).join('')}</ul>
    <h4>Instructions</h4>
    <ol>${r.steps.map(s=>`<li>${s}</li>`).join('')}</ol>
    <div class="modal-actions">
      <button class="btn btn-ghost" id="editRecipeBtn">edit</button>
      <button class="btn btn-soft" id="addToWeekBtn">add to my week ♡</button>
    </div>`;
  document.getElementById('recipeModal').classList.remove('hidden');
  document.getElementById('addToWeekBtn').onclick = ()=>{
    closeModal('recipeModal');
    openAssign(r.id);
  };
  document.getElementById('editRecipeBtn').onclick = ()=>{
    closeModal('recipeModal');
    openEdit(r.id);
  };
}

function closeModal(id){ document.getElementById(id).classList.add('hidden'); }
document.querySelectorAll('[data-close]').forEach(b=>{
  b.addEventListener('click', e=> e.target.closest('.modal').classList.add('hidden'));
});
document.querySelectorAll('.modal').forEach(m=>{
  m.addEventListener('click', e=>{ if(e.target===m) m.classList.add('hidden'); });
});

/* ============ assign to week ============ */
let pendingRecipe = null;

function openAssign(id){
  pendingRecipe = state.recipes.find(r=>r.id===id);
  if(!pendingRecipe) return;
  document.getElementById('assignRecipeName').textContent = `${pendingRecipe.emoji} ${pendingRecipe.name} (base: serves ${pendingRecipe.servings})`;
  const sel = document.getElementById('assignStartDay');
  sel.innerHTML = DAYS.map((d,i)=>`<option value="${i}">${d}</option>`).join('');
  sel.value = new Date().getDay();
  document.getElementById('assignDays').value = 3;
  document.getElementById('assignSlot').value = 'lunch';
  document.getElementById('assignMealsPerDay').value = '2';
  updateScaledPreview();
  document.getElementById('assignModal').classList.remove('hidden');
}

function updateScaledPreview(){
  if(!pendingRecipe) return;
  const days = +document.getElementById('assignDays').value || 1;
  const meals = +document.getElementById('assignMealsPerDay').value || 1;
  const target = days * meals;
  const scaled = scaleIngredients(pendingRecipe, target);
  document.getElementById('scaledPreview').innerHTML = `
    <h5>Scaled for ${target} servings (${days} days × ${meals} meals)</h5>
    <ul>${scaled.map(i=>`<li>${fmtAmt(i.amt)} ${i.unit} ${i.item}</li>`).join('')}</ul>`;
}
['assignDays','assignMealsPerDay'].forEach(id=>
  document.getElementById(id).addEventListener('input', updateScaledPreview));

document.getElementById('confirmAssign').addEventListener('click',()=>{
  const days = +document.getElementById('assignDays').value || 1;
  const meals = +document.getElementById('assignMealsPerDay').value || 1;
  const startDay = +document.getElementById('assignStartDay').value;
  const slot = document.getElementById('assignSlot').value;
  const target = days * meals;
  const scaled = scaleIngredients(pendingRecipe, target);

  const wk = ensureWeek(state.currentWeek);
  for(let i=0;i<days;i++){
    const d = (startDay + i) % 7;
    // if multiple meals/day, spread into additional slots
    const slotsForDay = meals === 1 ? [slot]
      : meals === 2 ? [slot, slot==='dinner'?'lunch':'dinner']
      : ['breakfast','lunch','dinner'];
    slotsForDay.forEach(s=>{
      wk[d][s].push({
        id: uid(),
        recipeId: pendingRecipe.id,
        name: pendingRecipe.name,
        emoji: pendingRecipe.emoji,
        servingsForMeal: target/days/slotsForDay.length,
        scaledIngredients: i===0 && s===slotsForDay[0] ? scaled : null, // store full scaled on the anchor only
        anchor: i===0 && s===slotsForDay[0],
      });
    });
  }
  save();
  closeModal('assignModal');
  toast('added to your week ♡');
  document.querySelector('.tab[data-tab="planner"]').click();
});

/* ============ week planner ============ */
function renderWeek(){
  const key = state.currentWeek;
  ensureWeek(key);
  const startDate = new Date(key);
  document.getElementById('weekLabel').textContent =
    `week of ${fmtDate(startDate)} – ${fmtDate(addDays(key,6))}`;

  const grid = document.getElementById('weekGrid');
  grid.innerHTML = '';
  const todayKey = new Date().toISOString().slice(0,10);
  for(let i=0;i<7;i++){
    const dDate = addDays(key,i);
    const col = document.createElement('div');
    col.className = 'day-col' + (dDate.toISOString().slice(0,10)===todayKey ? ' today':'');
    col.innerHTML = `
      <h4>${DAYS[i].slice(0,3)}</h4>
      <div class="date">${fmtDate(dDate)}</div>
      ${SLOTS.map(slot=>{
        const items = state.weeks[key][i][slot] || [];
        return `<div class="meal-slot">
          <span class="slot-label">${slot}</span>
          ${items.map(m=>`<div class="meal-item" data-day="${i}" data-slot="${slot}" data-id="${m.id}">
            <span>${m.emoji} ${m.name}</span>
            <button class="x" title="remove">×</button>
          </div>`).join('')}
        </div>`;
      }).join('')}`;
    grid.appendChild(col);
  }
  grid.querySelectorAll('.meal-item .x').forEach(btn=>{
    btn.addEventListener('click', e=>{
      const item = e.target.closest('.meal-item');
      const day = +item.dataset.day, slot = item.dataset.slot, id = item.dataset.id;
      const arr = state.weeks[key][day][slot];
      state.weeks[key][day][slot] = arr.filter(x=>x.id!==id);
      save(); renderWeek();
    });
  });
}

document.getElementById('prevWeek').addEventListener('click',()=>{
  state.currentWeek = weekKey(addDays(state.currentWeek,-7)); save(); renderWeek();
});
document.getElementById('nextWeek').addEventListener('click',()=>{
  state.currentWeek = weekKey(addDays(state.currentWeek,7)); save(); renderWeek();
});
document.getElementById('thisWeek').addEventListener('click',()=>{
  state.currentWeek = weekKey(new Date()); save(); renderWeek();
});
document.getElementById('clearWeekBtn').addEventListener('click',()=>{
  if(!confirm('clear all meals this week?')) return;
  delete state.weeks[state.currentWeek]; ensureWeek(state.currentWeek); save(); renderWeek();
});
document.getElementById('savePlanBtn').addEventListener('click',()=>{
  const name = prompt('name this plan ♡', 'week of ' + fmtDate(new Date(state.currentWeek)));
  if(!name) return;
  state.saved.push({
    id: uid(), name, date: new Date().toISOString(),
    weekKey: state.currentWeek,
    snapshot: JSON.parse(JSON.stringify(state.weeks[state.currentWeek]||{})),
  });
  save(); toast('saved ♡');
});

/* ============ grocery list ============ */
function renderGrocery(){
  const key = state.currentWeek;
  const week = state.weeks[key] || {};
  // aggregate ingredients by unit+item
  const bucket = {}; // "item|unit" -> { amt, item, unit, for:Set }
  for(let d=0; d<7; d++){
    SLOTS.forEach(slot=>{
      (week[d]?.[slot]||[]).forEach(m=>{
        if(!m.anchor || !m.scaledIngredients) return;
        m.scaledIngredients.forEach(ing=>{
          const k = `${ing.item}|${ing.unit}`;
          if(!bucket[k]) bucket[k] = {amt:0, item:ing.item, unit:ing.unit, for:new Set()};
          bucket[k].amt += ing.amt;
          bucket[k].for.add(m.name);
        });
      });
    });
  }
  const items = Object.entries(bucket).map(([k,v])=>({k,...v, for:[...v.for]}));
  const list = document.getElementById('groceryList');
  if(!items.length){
    list.innerHTML = `<div class="empty-state"><span class="big">🛒</span>
      no meals planned for this week yet — head to the cookbook!</div>`;
    return;
  }
  items.sort((a,b)=>a.item.localeCompare(b.item));
  state.checked[key] = state.checked[key] || {};
  list.innerHTML = `<div class="grocery-cat">
    <h4>for the week of ${fmtDate(new Date(key))}</h4>
    ${items.map(it=>{
      const checked = state.checked[key][it.k] ? 'checked' : '';
      return `<div class="grocery-item ${checked}" data-k="${it.k}">
        <div class="check"></div>
        <div class="text">${fmtAmt(it.amt)} ${it.unit} ${it.item}</div>
        <div class="for">for ${it.for.join(', ')}</div>
      </div>`;
    }).join('')}
  </div>`;
  list.querySelectorAll('.grocery-item').forEach(el=>{
    el.addEventListener('click',()=>{
      const k = el.dataset.k;
      state.checked[key][k] = !state.checked[key][k];
      el.classList.toggle('checked');
      save();
    });
  });
}
document.getElementById('copyList').addEventListener('click',()=>{
  const items = [...document.querySelectorAll('#groceryList .grocery-item .text')].map(t=>t.textContent.trim());
  if(!items.length){ toast('nothing to copy'); return; }
  navigator.clipboard.writeText(items.join('\n')).then(()=>toast('copied ♡'));
});
document.getElementById('uncheckAll').addEventListener('click',()=>{
  state.checked[state.currentWeek] = {}; save(); renderGrocery();
});

/* ============ saved plans ============ */
function renderSaved(){
  const el = document.getElementById('savedList');
  if(!state.saved.length){
    el.innerHTML = `<div class="empty-state"><span class="big">💌</span>
      no saved plans yet — save a week from the planner tab!</div>`;
    return;
  }
  el.innerHTML = state.saved.map(p=>`
    <div class="saved-card" data-id="${p.id}">
      <h4>${p.name}</h4>
      <div class="s-sub">saved ${new Date(p.date).toLocaleDateString()}</div>
      <div class="s-sub">originally week of ${fmtDate(new Date(p.weekKey))}</div>
      <div class="acts">
        <button class="btn btn-soft" data-act="load">load here</button>
        <button class="btn btn-ghost" data-act="delete">delete</button>
      </div>
    </div>`).join('');
  el.querySelectorAll('.saved-card').forEach(card=>{
    const id = card.dataset.id;
    card.querySelector('[data-act="load"]').onclick = ()=>{
      const p = state.saved.find(x=>x.id===id);
      state.weeks[state.currentWeek] = JSON.parse(JSON.stringify(p.snapshot));
      save(); toast('loaded into current week ♡');
      document.querySelector('.tab[data-tab="planner"]').click();
    };
    card.querySelector('[data-act="delete"]').onclick = ()=>{
      if(!confirm('delete this plan?')) return;
      state.saved = state.saved.filter(x=>x.id!==id); save(); renderSaved();
    };
  });
}

/* ============ new / edit recipe ============ */
let editingId = null;

document.getElementById('addRecipeBtn').addEventListener('click',()=>openEdit(null));

function openEdit(id){
  editingId = id;
  const r = id ? state.recipes.find(x=>x.id===id) : null;
  document.getElementById('editTitle').textContent = r ? 'Edit Recipe' : 'New Recipe';
  document.getElementById('edName').value = r?.name || '';
  document.getElementById('edNote').value = r?.note || '';
  document.getElementById('edServings').value = r?.servings || 4;
  document.getElementById('edCategory').value = r?.category || 'Mains';
  document.getElementById('edEmoji').value = r?.emoji || '🍲';
  document.getElementById('edIngredients').value = r
    ? r.ingredients.map(i=>`${fmtAmt(i.amt)} ${i.unit} ${i.item}`.trim().replace(/\s+/g,' ')).join('\n')
    : '';
  document.getElementById('edSteps').value = r ? r.steps.join('\n') : '';
  document.getElementById('deleteRecipeBtn').style.display = r ? '' : 'none';
  document.getElementById('editModal').classList.remove('hidden');
}

function parseIngredientLine(line){
  // "2 tbsp olive oil" or "1 lemon" or "0.5 cup rice"
  const parts = line.trim().split(/\s+/);
  if(!parts.length) return null;
  const amt = parseFloat(parts[0]);
  if(isNaN(amt)) return {amt:1, unit:'', item:line.trim()};
  const UNITS = ['cup','cups','tbsp','tsp','lb','lbs','oz','g','kg','ml','l','clove','cloves','can','cans','stalk','pinch','dash','slice'];
  let unit = '', rest;
  if(parts[1] && UNITS.includes(parts[1].toLowerCase())){
    unit = parts[1].replace(/s$/,'');
    rest = parts.slice(2).join(' ');
  } else {
    rest = parts.slice(1).join(' ');
  }
  return {amt, unit, item: rest};
}

document.getElementById('saveRecipeBtn').addEventListener('click',()=>{
  const name = document.getElementById('edName').value.trim();
  if(!name){ toast('name please ♡'); return; }
  const ingredients = document.getElementById('edIngredients').value
    .split('\n').map(l=>l.trim()).filter(Boolean).map(parseIngredientLine).filter(Boolean);
  const steps = document.getElementById('edSteps').value
    .split('\n').map(l=>l.trim()).filter(Boolean);
  const data = {
    id: editingId || uid(),
    name,
    emoji: document.getElementById('edEmoji').value || '🍲',
    category: document.getElementById('edCategory').value,
    servings: +document.getElementById('edServings').value || 1,
    note: document.getElementById('edNote').value.trim(),
    ingredients, steps,
  };
  if(editingId){
    const i = state.recipes.findIndex(r=>r.id===editingId);
    if(i>=0) state.recipes[i] = data;
  } else {
    state.recipes.push(data);
  }
  save(); closeModal('editModal'); renderCookbook(); toast('saved ♡');
});

document.getElementById('deleteRecipeBtn').addEventListener('click',()=>{
  if(!editingId) return;
  if(!confirm('delete this recipe?')) return;
  state.recipes = state.recipes.filter(r=>r.id!==editingId);
  save(); closeModal('editModal'); renderCookbook(); toast('deleted');
});

/* ============ init ============ */
renderCookbook();
