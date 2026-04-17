/* ============ Made with Love — for Melissa Mae ♡ ============ */

const DAYS = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
const SLOTS = ['breakfast','lunch','dinner'];

const TIPS = {
  Breakfast: [
    'add cottage cheese to your eggs — extra fluffy + more protein, you will not taste it',
    'trust me — you will not taste the spinach. just add it',
    'always keep at least 5 breakfast sandwiches in the freezer for zero-energy mornings',
    'do not overcomplicate it — you literally just need eggs + a carb',
    'meal-prepped eggs can get weird after 3 days — eat those first or split into smaller batches',
  ],
  Lunch: [
    'just bare chicken is your best friend — air fry for 10 min, protein done',
    'use your air fryer for everything — chicken, potatoes, veggies all taste better',
    'snack boxes save you when busy — cheese, fruit, meat stops you from ordering out',
    'keep it simple: protein + carb + veggie = done',
    'rotisserie chicken is elite for lazy days — shred it into wraps, bowls, anything',
    'sauces carry meals — pesto, caesar, tzatziki, TJ dips = takeout vibes',
  ],
  Dinner: [
    "trader joe's pre-seasoned meats are your best friend — shawarma, lemon garlic, carne asada",
    'just bare chicken saves dinner every time — air fry and build anything around it',
    'always build: protein + carb + veggie + sauce. that is the whole formula',
    'use the air fryer for dinner — everything comes out better and faster',
  ],
};

const DEFAULT_RECIPES = [
  /* ================= BREAKFAST ================= */
  { id:'b1', name:'Scrambled Egg Hash Brown Breakfast', emoji:'🍳', image:'', category:'Breakfast', servings:5,
    note:'eggs + a crispy hash brown + fresh pico on top ♡',
    ingredients:[
      {amt:10, unit:'', item:'large egg'},
      {amt:0.25, unit:'cup', item:'shredded cheddar'},
      {amt:0.25, unit:'cup', item:'milk'},
      {amt:0.5, unit:'tsp', item:'salt'},
      {amt:0.5, unit:'tsp', item:'black pepper'},
      {amt:1, unit:'tsp', item:'olive oil'},
      {amt:5, unit:'', item:'frozen hash brown patty'},
      {amt:3, unit:'', item:'tomato (diced)'},
      {amt:0.25, unit:'cup', item:'white onion (diced)'},
      {amt:2, unit:'tbsp', item:'cilantro (chopped)'},
      {amt:1, unit:'tbsp', item:'lime juice'},
    ],
    steps:['cook hash brown patties until golden + crispy','mix tomato, onion, cilantro, lime, salt for the pico',
      'whisk eggs, milk, salt, pepper','scramble in olive oil until almost done',
      'fold in cheddar, cook until fluffy','box it: hash brown, eggs, pico on top']},

  { id:'b2', name:'Chick-fil-A Inspired Breakfast Bowl', emoji:'🐔', image:'', category:'Breakfast', servings:4,
    note:'no homophobia included — just crispy nuggets + eggs ♡',
    ingredients:[
      {amt:1, unit:'lb', item:'frozen chicken nugget (Just Bare or Real Good)'},
      {amt:8, unit:'', item:'large egg'},
      {amt:1, unit:'tbsp', item:'butter'},
      {amt:1, unit:'tsp', item:'salt'},
      {amt:0.5, unit:'tsp', item:'black pepper'},
      {amt:0.5, unit:'cup', item:'honey mustard or chick-fil-a sauce'},
    ],
    steps:['cook nuggets until hot + crispy','whisk eggs with salt + pepper',
      'melt butter, scramble eggs until fluffy','divide eggs into 4 containers',
      'add nuggets, portion sauce on the side']},

  { id:'b3', name:'Sheet Pan Egg Bake', emoji:'🥚', image:'', category:'Breakfast', servings:5,
    note:'one pan + 25 min = a week of breakfast',
    ingredients:[
      {amt:12, unit:'', item:'large egg'},
      {amt:0.25, unit:'cup', item:'milk'},
      {amt:1, unit:'cup', item:'baby spinach (chopped)'},
      {amt:0.5, unit:'cup', item:'sun-dried tomato (chopped)'},
      {amt:0.5, unit:'cup', item:'feta (crumbled)'},
      {amt:0.25, unit:'cup', item:'fresh basil (torn)'},
      {amt:1, unit:'tsp', item:'red pepper flake'},
      {amt:1, unit:'tsp', item:'salt'},
      {amt:0.5, unit:'tsp', item:'black pepper'},
    ],
    steps:['preheat 375°F, line a sheet pan','whisk eggs + milk + salt + pepper',
      'scatter spinach + sun-dried tomato on pan','pour eggs over',
      'top with feta, basil, pepper flake','bake 20–25 min until set, slice into portions']},

  { id:'b4', name:'Berry Breakfast Bake', emoji:'🫐', image:'', category:'Breakfast', servings:5,
    note:'baked oats but make it cozy ♡',
    ingredients:[
      {amt:2, unit:'cup', item:'old-fashioned oats'},
      {amt:1, unit:'tsp', item:'baking powder'},
      {amt:0.5, unit:'tsp', item:'cinnamon'},
      {amt:0.25, unit:'tsp', item:'salt'},
      {amt:1.75, unit:'cup', item:'milk'},
      {amt:1, unit:'', item:'egg'},
      {amt:2, unit:'tbsp', item:'butter (melted)'},
      {amt:1, unit:'tsp', item:'vanilla'},
      {amt:3, unit:'tbsp', item:'maple syrup or honey'},
      {amt:1, unit:'cup', item:'mixed raspberry + blueberry'},
    ],
    steps:['preheat 350°F, grease a baking dish','mix oats, baking powder, cinnamon, salt',
      'whisk milk, egg, butter, vanilla, maple syrup','combine wet + dry',
      'fold in berries, spread in dish','bake 30–35 min, let cool, slice']},

  { id:'b5', name:'Bacon Egg Bites', emoji:'🥓', image:'', category:'Breakfast', servings:5,
    note:'muffin tin magic — 2 per container',
    ingredients:[
      {amt:10, unit:'', item:'large egg'},
      {amt:5, unit:'slice', item:'bacon (cooked + crumbled)'},
      {amt:0.67, unit:'cup', item:'shredded cheddar'},
      {amt:0.25, unit:'cup', item:'bell pepper (diced)'},
      {amt:0.5, unit:'tsp', item:'salt'},
      {amt:0.25, unit:'tsp', item:'black pepper'},
    ],
    steps:['preheat 350°F, grease a muffin tin','whisk eggs + salt + pepper',
      'pour eggs into 10 muffin cups','sprinkle bacon, cheese, bell pepper into each',
      'bake 18–22 min until set','cool, pack 2 per container']},

  { id:'b6', name:'Freezer Breakfast Sandwiches', emoji:'🥪', image:'', category:'Breakfast', servings:10,
    note:'the zero-energy morning MVP — grab + microwave',
    ingredients:[
      {amt:10, unit:'', item:'english muffin (halved)'},
      {amt:10, unit:'', item:'egg'},
      {amt:10, unit:'slice', item:'bacon or sausage patty'},
      {amt:10, unit:'slice', item:'cheddar'},
      {amt:0.25, unit:'cup', item:'milk'},
      {amt:1, unit:'tsp', item:'salt'},
      {amt:0.5, unit:'tsp', item:'black pepper'},
    ],
    steps:['preheat 350°F, grease a baking dish','whisk eggs + milk + salt + pepper, pour in dish + bake',
      'cook bacon or sausage','slice baked eggs into 10 pieces',
      'toast muffins lightly if you want','build: muffin + egg + cheese + meat',
      'cool completely, wrap tight, freeze. reheat when ready']},

  { id:'b7', name:'Breakfast Quesadilla with Fruit', emoji:'🌮', image:'', category:'Breakfast', servings:5,
    note:'crispy tortilla + eggs + fruit side = girl dinner but breakfast',
    ingredients:[
      {amt:5, unit:'', item:'large flour tortilla'},
      {amt:10, unit:'', item:'large egg'},
      {amt:1.25, unit:'cup', item:'shredded cheddar'},
      {amt:0.75, unit:'cup', item:'spinach (chopped, optional)'},
      {amt:1, unit:'tbsp', item:'butter'},
      {amt:1.25, unit:'cup', item:'mixed berries'},
      {amt:3, unit:'', item:'mandarin orange'},
    ],
    steps:['scramble eggs (stir in spinach until wilted)','place tortilla in skillet, fill with eggs + cheddar',
      'fold, cook until golden + melted','repeat for all tortillas',
      'cut each quesadilla in half','box: quesadilla + berries + mandarin on the side']},

  { id:'b8', name:'Protein Oat Waffles with Sausage & Berries', emoji:'🧇', image:'', category:'Breakfast', servings:5,
    note:'aldi protein waffle mix saves the week',
    ingredients:[
      {amt:10, unit:'', item:'protein waffle (aldi protein waffle mix)'},
      {amt:10, unit:'', item:'breakfast sausage link'},
      {amt:1.25, unit:'cup', item:'blueberries'},
      {amt:1.25, unit:'cup', item:'raspberries'},
      {amt:5, unit:'tbsp', item:'maple syrup (optional)'},
    ],
    steps:['cook sausage links until browned','make waffle batter per package',
      'cook waffles until golden','cool slightly',
      'box: 2 waffles + 2 sausages + berries','syrup cup on the side']},

  { id:'b9', name:'Copycat McGriddles', emoji:'🥞', image:'', category:'Breakfast', servings:5,
    note:"TJ's dutch griddle cakes are literally the hack",
    ingredients:[
      {amt:10, unit:'', item:"mini griddle cake (TJ's dutch griddle cakes)"},
      {amt:5, unit:'', item:'chicken breakfast sausage patty'},
      {amt:5, unit:'', item:'large egg'},
      {amt:5, unit:'slice', item:'american cheese'},
      {amt:5, unit:'tbsp', item:'maple syrup'},
    ],
    steps:['cook sausage patties until browned','cook eggs (use a ring mold for cute shape)',
      'warm griddle cakes','stack: cake + sausage + cheese + egg + syrup drizzle',
      'top with the other griddle cake','cool slightly, wrap, fridge']},

  { id:'b10', name:"Copycat S'mores Yogurt Bowl", emoji:'🍫', image:'', category:'Breakfast', servings:5,
    note:'dessert breakfast who? you deserve it ♡',
    ingredients:[
      {amt:5, unit:'cup', item:'vanilla greek yogurt'},
      {amt:1, unit:'cup', item:'crushed graham cracker'},
      {amt:0.75, unit:'cup', item:'mini chocolate chip'},
      {amt:1.25, unit:'cup', item:'mini marshmallow'},
    ],
    steps:['divide yogurt into 5 containers','portion grahams, chips, marshmallows into baggies (keep dry!)',
      'when ready to eat: sprinkle all toppings on top','enjoy ♡']},

  /* ================= LUNCH ================= */
  { id:'l1', name:'Chicken Gyro Bowls', emoji:'🌯', image:'', category:'Lunch', servings:5,
    note:"TJ's shawarma chicken = the weeknight secret weapon",
    ingredients:[
      {amt:2, unit:'lb', item:"trader joe's shawarma chicken thigh"},
      {amt:2.2, unit:'lb', item:'potato (wedges or frozen wedges)'},
      {amt:2, unit:'tbsp', item:'olive oil'},
      {amt:2, unit:'tsp', item:'paprika'},
      {amt:1, unit:'tsp', item:'garlic powder'},
      {amt:1, unit:'tsp', item:'oregano'},
      {amt:5, unit:'cup', item:'shredded lettuce'},
      {amt:2, unit:'', item:'tomato (diced)'},
      {amt:0.5, unit:'', item:'red onion (sliced)'},
      {amt:5, unit:'', item:'pita bread (halved)'},
      {amt:1, unit:'cup', item:'tzatziki'},
    ],
    steps:['cook shawarma chicken per package until crispy','toss potato wedges with oil + spices',
      'air fry wedges at 400°F for 15–20 min','slice or shred chicken',
      'box: lettuce, chicken, potatoes, tomato, red onion','add half pita + tzatziki on side']},

  { id:'l2', name:'Chicken Caesar Wraps', emoji:'🥗', image:'', category:'Lunch', servings:5,
    note:'rotisserie chicken carries ♡',
    ingredients:[
      {amt:2, unit:'cup', item:'cooked chicken (rotisserie or just bare)'},
      {amt:0.5, unit:'cup', item:'caesar dressing'},
      {amt:0.5, unit:'cup', item:'parmesan (shredded)'},
      {amt:5, unit:'cup', item:'romaine (chopped)'},
      {amt:5, unit:'', item:'large flour tortilla'},
    ],
    steps:['mix chicken + dressing + parmesan','toss in romaine',
      'divide onto tortillas, wrap tight','slice in half, store in containers']},

  { id:'l3', name:'Turkey Pesto Sandwich Boxes', emoji:'🥖', image:'', category:'Lunch', servings:5,
    note:'store-bought pesto does ALL the work',
    ingredients:[
      {amt:10, unit:'slice', item:'deli turkey'},
      {amt:5, unit:'slice', item:'mozzarella'},
      {amt:5, unit:'', item:'sandwich roll or ciabatta'},
      {amt:0.25, unit:'cup', item:'pesto'},
      {amt:1, unit:'cup', item:'cherry tomato'},
      {amt:1, unit:'cup', item:'cucumber (sliced)'},
    ],
    steps:['slice rolls, spread pesto on both sides','layer turkey + mozzarella',
      'close + slice in half','box with cherry tomatoes + cucumber on side']},

  { id:'l4', name:'Buffalo Chicken Wrap Bowls', emoji:'🌶️', image:'', category:'Lunch', servings:5,
    note:'spicy + creamy = the balance ♡',
    ingredients:[
      {amt:2, unit:'cup', item:'cooked chicken (rotisserie or just bare)'},
      {amt:0.33, unit:'cup', item:'buffalo sauce'},
      {amt:0.25, unit:'cup', item:'ranch or blue cheese dressing'},
      {amt:5, unit:'cup', item:'romaine (chopped)'},
      {amt:1, unit:'cup', item:'shredded carrot'},
      {amt:0.5, unit:'cup', item:'celery (diced)'},
      {amt:5, unit:'', item:'flour tortilla'},
    ],
    steps:['toss chicken in buffalo sauce','warm chicken if you want it hot',
      'box: romaine + buffalo chicken + carrots + celery','add tortilla (or strips) + dressing on side']},

  { id:'l5', name:'Sub in a Tub (Italian Deli Style)', emoji:'🥗', image:'', category:'Lunch', servings:5,
    note:'all the sub, none of the bread heaviness',
    ingredients:[
      {amt:8, unit:'oz', item:'deli ham'},
      {amt:8, unit:'oz', item:'turkey or salami'},
      {amt:8, unit:'slice', item:'provolone'},
      {amt:1, unit:'cup', item:'pickle'},
      {amt:1, unit:'', item:'avocado (sliced)'},
      {amt:1, unit:'cup', item:'bell pepper (sliced)'},
      {amt:1, unit:'tsp', item:'italian seasoning'},
      {amt:2, unit:'tbsp', item:'olive oil'},
      {amt:1, unit:'tbsp', item:'red wine vinegar'},
    ],
    steps:['roll or fold deli meats + cheese','divide into 5 containers',
      'add pickles, avocado, bell pepper','sprinkle italian seasoning',
      'drizzle oil + vinegar when ready to eat']},

  { id:'l6', name:'Korean BBQ Beef Rice Bowls', emoji:'🍱', image:'', category:'Lunch', servings:5,
    note:'sweet + savory + glossy — and reheats like a dream',
    ingredients:[
      {amt:1, unit:'lb', item:'ground beef'},
      {amt:3, unit:'tbsp', item:'soy sauce'},
      {amt:2, unit:'tbsp', item:'brown sugar'},
      {amt:1, unit:'tbsp', item:'sesame oil'},
      {amt:2, unit:'clove', item:'garlic (minced)'},
      {amt:1, unit:'tsp', item:'ginger'},
      {amt:3, unit:'cup', item:'cooked rice'},
      {amt:1, unit:'cup', item:'shredded carrot'},
      {amt:0.5, unit:'', item:'cucumber (sliced)'},
      {amt:0.25, unit:'', item:'red onion (sliced)'},
      {amt:2, unit:'', item:'green onion'},
      {amt:1, unit:'tsp', item:'sesame seed'},
      {amt:0.25, unit:'cup', item:'sriracha mayo'},
    ],
    steps:['brown beef, drain fat','add soy, sugar, sesame, garlic, ginger — cook 2–3 min glossy',
      'divide rice into 5 containers','top with beef + carrot + cucumber + onion',
      'finish with green onion, sesame seeds, sriracha mayo']},

  { id:'l7', name:'Cheeseburger Bowls', emoji:'🍔', image:'', category:'Lunch', servings:5,
    note:"TJ's burger sauce is the cheat code",
    ingredients:[
      {amt:1, unit:'lb', item:'ground beef'},
      {amt:4, unit:'cup', item:'shredded lettuce'},
      {amt:1, unit:'pint', item:'cherry tomato (halved)'},
      {amt:1, unit:'cup', item:'shredded cheddar'},
      {amt:0.5, unit:'cup', item:'pickled red onion'},
      {amt:0.5, unit:'cup', item:'pickle (sliced)'},
      {amt:2, unit:'tbsp', item:'relish'},
      {amt:0.25, unit:'cup', item:'jalapeño'},
      {amt:0.5, unit:'cup', item:'bacon (crumbled)'},
      {amt:0.5, unit:'cup', item:"TJ's burger sauce"},
    ],
    steps:['brown beef 7–10 min, drain fat','divide lettuce into containers',
      'add beef, tomatoes, pickles, red onions, jalapeños, cheddar','sprinkle bacon',
      'drizzle burger sauce or keep on the side']},

  { id:'l8', name:'Adult Charcuterie Snack Boxes', emoji:'🧀', image:'', category:'Lunch', servings:4,
    note:'for busy days = zero cooking, fancy feeling',
    ingredients:[
      {amt:4, unit:'oz', item:'salami (sliced)'},
      {amt:4, unit:'oz', item:'pepperoni (sliced)'},
      {amt:4, unit:'oz', item:'cubed white cheddar or brie'},
      {amt:1, unit:'cup', item:'grape'},
      {amt:1, unit:'cup', item:'pretzel crisp or cracker'},
    ],
    steps:['add salami + pepperoni to each container','add cubed cheese next to meats',
      'add grapes on side','fill remaining space with crackers']},

  { id:'l9', name:'TJ Italian Focaccia Sandwich', emoji:'🥖', image:'', category:'Lunch', servings:5,
    note:'burrata + focaccia = game over ♡',
    ingredients:[
      {amt:2, unit:'', item:"TJ's roasted tomato + parmesan focaccia"},
      {amt:2, unit:'', item:'burrata container'},
      {amt:10, unit:'oz', item:'rosemary ham'},
      {amt:7, unit:'oz', item:'salami + prosciutto mix'},
      {amt:2, unit:'handful', item:'arugula'},
      {amt:3, unit:'', item:'tomato (sliced)'},
      {amt:5, unit:'tbsp', item:'pesto'},
      {amt:2, unit:'tbsp', item:'hot pepper sauce (bomba)'},
      {amt:2, unit:'tbsp', item:'balsamic glaze'},
    ],
    steps:['slice focaccia horizontally into 5 sandwich portions','spread pesto one side, bomba the other',
      'layer ham + deli meats','add tomato + burrata',
      'top with arugula + balsamic drizzle','press slightly, slice, wrap']},

  { id:'l10', name:'Goodles Mac & Cheese + Chicken + Veggies', emoji:'🧀', image:'', category:'Lunch', servings:5,
    note:'protein-packed mac — goodles sneaks in 14g per serving',
    ingredients:[
      {amt:2, unit:'box', item:'goodles mac and cheese'},
      {amt:1, unit:'lb', item:'just bare chicken (breaded or grilled)'},
      {amt:3, unit:'cup', item:'broccoli or frozen vegetable mix'},
      {amt:1, unit:'tbsp', item:'olive oil'},
      {amt:1, unit:'tsp', item:'salt'},
    ],
    steps:['cook goodles per box','air fry chicken 10 min at 400°F',
      'steam or roast veggies with olive oil + salt','slice chicken',
      'box: mac + chicken + veggies']},


  /* ================= DINNER ================= */
  { id:'d1', name:"Trader Joe's Dumpling Bake", emoji:'🥟', image:'', category:'Dinner', servings:5,
    note:'one pan, bubbly + saucy, TJ does the work',
    ingredients:[
      {amt:2, unit:'bag', item:"TJ's frozen dumplings"},
      {amt:1, unit:'cup', item:'coconut milk'},
      {amt:0.5, unit:'cup', item:"TJ's thai red curry sauce"},
      {amt:2, unit:'tbsp', item:'soy sauce or soyaki'},
      {amt:1, unit:'tsp', item:'garlic powder'},
      {amt:3, unit:'', item:'green onion (sliced)'},
    ],
    steps:['preheat 400°F','dumplings in even layer in a baking dish',
      'mix coconut milk + curry + soy + garlic','pour over dumplings',
      'foil + bake 20 min','uncover, bake 15–20 min until bubbly',
      'top with green onion, divide into 5']},

  { id:'d2', name:'Chicken Tikka Masala', emoji:'🍛', image:'', category:'Dinner', servings:5,
    note:"TJ's tikka sauce is the cheat code",
    ingredients:[
      {amt:2, unit:'pack', item:"TJ's chicken (grilled or diced)"},
      {amt:2, unit:'jar', item:"TJ's tikka masala sauce"},
      {amt:2, unit:'cup', item:'cooked rice'},
      {amt:1, unit:'cup', item:'frozen peas (optional)'},
      {amt:0.5, unit:'cup', item:'plain greek yogurt (optional)'},
      {amt:1, unit:'bag', item:"TJ's garlic naan"},
      {amt:2, unit:'tbsp', item:'cilantro'},
    ],
    steps:['cook chicken if raw','heat tikka sauce, add chicken, simmer 5–10 min',
      'stir in peas + yogurt','cook rice if needed',
      'box: rice + tikka chicken','add warm naan on the side',
      'top with cilantro']},

  { id:'d3', name:'Stuffed Shells with Garlic Bread', emoji:'🍝', image:'', category:'Dinner', servings:5,
    note:'the sunday night hug ♡',
    ingredients:[
      {amt:1, unit:'box', item:'jumbo pasta shell'},
      {amt:1, unit:'container', item:'ricotta'},
      {amt:1.5, unit:'cup', item:'mozzarella (shredded)'},
      {amt:0.5, unit:'cup', item:'parmesan'},
      {amt:1, unit:'', item:'egg'},
      {amt:1, unit:'jar', item:'marinara'},
      {amt:1, unit:'tsp', item:'garlic powder'},
      {amt:1, unit:'tsp', item:'italian seasoning'},
      {amt:0.5, unit:'tsp', item:'salt'},
      {amt:1, unit:'bag', item:"TJ's garlic bread"},
    ],
    steps:['cook shells per box, drain + cool','mix ricotta, mozzarella, parm, egg, spices',
      'marinara layer in baking dish','stuff shells, place in dish',
      'cover with remaining marinara','foil + bake 375°F for 25 min',
      'uncover, bake 10–15 min until bubbly','bake garlic bread per package']},

  { id:'d4', name:'Lemon Garlic Chicken & Roasted Potatoes', emoji:'🍗', image:'', category:'Dinner', servings:5,
    note:'sheet pan girl dinner = easiest clean up',
    ingredients:[
      {amt:2, unit:'pack', item:"TJ's lemon garlic chicken"},
      {amt:1, unit:'lb', item:'baby potato (halved)'},
      {amt:2, unit:'cup', item:'green beans or broccoli'},
      {amt:1, unit:'tbsp', item:'olive oil'},
      {amt:1, unit:'tsp', item:'salt'},
      {amt:0.5, unit:'tsp', item:'black pepper'},
    ],
    steps:['preheat 400°F','potatoes on sheet pan with oil + salt + pepper',
      'add chicken to the same pan','bake 25–30 min',
      'add veggies halfway through or cook separately','divide into 5 containers']},

  { id:'d5', name:'TJ Chicken Shawarma Bowls', emoji:'🌯', image:'', category:'Dinner', servings:5,
    note:'mediterranean girl in her meal prep era',
    ingredients:[
      {amt:2, unit:'pack', item:"TJ's chicken shawarma"},
      {amt:2, unit:'cup', item:'cooked rice'},
      {amt:1, unit:'cup', item:'cucumber (diced)'},
      {amt:1, unit:'cup', item:'cherry tomato (halved)'},
      {amt:0.5, unit:'cup', item:'red onion (sliced)'},
      {amt:0.5, unit:'cup', item:'hummus'},
      {amt:0.5, unit:'cup', item:'tzatziki'},
      {amt:0.25, unit:'cup', item:'feta'},
    ],
    steps:['cook shawarma in pan or air fryer until crispy','cook rice if needed',
      'box: rice + chicken','add cucumber, tomato, red onion',
      'scoop hummus + drizzle tzatziki','sprinkle feta']},

  { id:'d6', name:'Greek Chicken Meatball Bowls', emoji:'🥙', image:'', category:'Dinner', servings:5,
    note:"TJ's pre-cooked meatballs = dinner in 10 minutes",
    ingredients:[
      {amt:1, unit:'bag', item:"TJ's chicken meatball"},
      {amt:2, unit:'cup', item:'cooked rice or orzo'},
      {amt:1, unit:'cup', item:'cucumber (diced)'},
      {amt:1, unit:'cup', item:'cherry tomato'},
      {amt:0.5, unit:'cup', item:'red onion'},
      {amt:0.5, unit:'cup', item:'feta'},
      {amt:0.5, unit:'cup', item:'tzatziki'},
    ],
    steps:['heat meatballs (air fryer or microwave)','cook rice or orzo',
      'box: grain + meatballs','add cucumber, tomato, red onion',
      'top with feta + tzatziki']},

  { id:'d7', name:'Shrimp Mango Rice Bowls', emoji:'🍤', image:'', category:'Dinner', servings:5,
    note:'sweet chili + mango = summer in a bowl',
    ingredients:[
      {amt:1, unit:'lb', item:'shrimp (peeled + deveined)'},
      {amt:2, unit:'cup', item:'cooked jasmine rice'},
      {amt:1, unit:'', item:'mango (diced)'},
      {amt:0.5, unit:'cup', item:'cucumber (diced)'},
      {amt:0.5, unit:'cup', item:'shredded carrot'},
      {amt:0.25, unit:'cup', item:'red onion'},
      {amt:0.5, unit:'cup', item:'sweet chili sauce'},
      {amt:2, unit:'tbsp', item:'soy sauce'},
      {amt:1, unit:'tsp', item:'garlic powder'},
    ],
    steps:['cook shrimp 3–4 min until pink','toss in sweet chili + soy + garlic',
      'cook rice if needed','box: rice + shrimp',
      'top with mango, cucumber, carrots, red onion']},

  { id:'d8', name:'In-N-Out Animal Style Sliders', emoji:'🍔', image:'', category:'Dinner', servings:5,
    note:'hawaiian rolls + caramelized onions = dupe perfection',
    ingredients:[
      {amt:1, unit:'lb', item:'ground beef'},
      {amt:10, unit:'', item:'slider bun (hawaiian rolls)'},
      {amt:5, unit:'slice', item:'american cheese (halved)'},
      {amt:0.5, unit:'cup', item:'caramelized onion'},
      {amt:0.5, unit:'cup', item:'shredded lettuce'},
      {amt:0.5, unit:'cup', item:'mayo'},
      {amt:2, unit:'tbsp', item:'ketchup'},
      {amt:2, unit:'tbsp', item:'relish'},
      {amt:1, unit:'tbsp', item:'mustard'},
    ],
    steps:['mix mayo + ketchup + relish + mustard for sauce','brown beef into small pieces, season',
      'warm slider buns','assemble: bun + beef + cheese + onions + lettuce + sauce',
      'close and serve (or prep components separately)']},

  { id:'d9', name:'White Chicken Lazy Lasagna', emoji:'🍝', image:'', category:'Dinner', servings:5,
    note:'alfredo + rotisserie = lazy heaven',
    ingredients:[
      {amt:1, unit:'box', item:'lasagna noodle'},
      {amt:2, unit:'cup', item:'shredded chicken (rotisserie or just bare)'},
      {amt:1, unit:'jar', item:"TJ's alfredo"},
      {amt:1, unit:'cup', item:'ricotta'},
      {amt:1.5, unit:'cup', item:'mozzarella'},
      {amt:0.5, unit:'cup', item:'parmesan'},
      {amt:1, unit:'cup', item:'spinach'},
    ],
    steps:['preheat 375°F','mix chicken + alfredo',
      'layer: noodle + chicken mix + ricotta + moz + spinach','repeat until all used',
      'top with remaining moz + parm','foil + bake 30 min',
      'uncover, bake 10–15 min until bubbly','divide into 5']},

  { id:'d10', name:'TJ Flatbread Pizza', emoji:'🍕', image:'', category:'Dinner', servings:5,
    note:'12-min pizza night ♡',
    ingredients:[
      {amt:3, unit:'', item:"TJ's flatbread (naan or lavash)"},
      {amt:1, unit:'cup', item:'marinara or pizza sauce'},
      {amt:1.5, unit:'cup', item:'mozzarella'},
      {amt:0.5, unit:'cup', item:'pepperoni or cooked sausage'},
      {amt:0.5, unit:'cup', item:'veggies (peppers, mushrooms, onions)'},
    ],
    steps:['preheat 400°F','flatbreads on baking sheet',
      'spread sauce, add mozzarella','add toppings',
      'bake 10–12 min until crispy','slice, divide into 5']},

  { id:'d11', name:'Caesar Chicken Burgers with Fries', emoji:'🍔', image:'', category:'Dinner', servings:5,
    note:'caesar salad on a burger = try it, thank me later',
    ingredients:[
      {amt:5, unit:'', item:'just bare chicken filet or grilled patty'},
      {amt:5, unit:'', item:'burger bun'},
      {amt:1, unit:'bag', item:'frozen fries'},
      {amt:0.5, unit:'cup', item:'caesar dressing'},
      {amt:1, unit:'cup', item:'romaine'},
      {amt:0.25, unit:'cup', item:'parmesan'},
    ],
    steps:['air fry fries per package','air fry chicken until crispy',
      'toss romaine with caesar + parm','toast buns if you want',
      'build: bun + chicken + caesar salad + bun','serve with fries, divide into 5']},


  /* ================= QUICK / FAST FOOD SWAPS ================= */
  { id:'q1', name:'Chick-fil-A Sandwich Dupe', emoji:'🥪', image:'', category:'Quick', servings:1,
    note:'just bare + pickles + CFA sauce = you can stop the drive-thru',
    ingredients:[
      {amt:1, unit:'', item:'just bare crispy chicken filet'},
      {amt:1, unit:'', item:'brioche bun'},
      {amt:2, unit:'tbsp', item:'chick-fil-a sauce'},
      {amt:4, unit:'slice', item:'dill pickle'},
      {amt:1, unit:'tbsp', item:'butter (for toasting bun)'},
    ],
    steps:['air fry chicken 10 min at 400°F','butter-toast the bun',
      'spread CFA sauce on both sides','stack: bun + pickles + chicken + bun']},

  { id:'q2', name:'Copycat Crunchwrap Supreme', emoji:'🌯', image:'', category:'Quick', servings:4,
    note:'taco bell on a friday night but at home',
    ingredients:[
      {amt:1, unit:'lb', item:'ground beef'},
      {amt:1, unit:'packet', item:'taco seasoning'},
      {amt:4, unit:'', item:'large flour tortilla (burrito size)'},
      {amt:4, unit:'', item:'tostada shell'},
      {amt:1, unit:'cup', item:'nacho cheese sauce'},
      {amt:1, unit:'cup', item:'shredded lettuce'},
      {amt:1, unit:'', item:'tomato (diced)'},
      {amt:0.5, unit:'cup', item:'sour cream'},
      {amt:0.5, unit:'cup', item:'shredded cheddar'},
    ],
    steps:['brown beef, add taco seasoning + water per packet','center tortilla on flat surface',
      'layer: beef + cheese sauce + tostada + sour cream + lettuce + tomato + cheddar',
      'fold tortilla edges toward center (pleats)','pan-sear seam-side-down until golden, flip']},

  { id:'q3', name:'Chipotle Burrito Bowl', emoji:'🥙', image:'', category:'Quick', servings:4,
    note:'TJ pollo asado + rice = lunch solved',
    ingredients:[
      {amt:1, unit:'pack', item:"TJ's pollo asado"},
      {amt:2, unit:'cup', item:'cooked cilantro lime rice'},
      {amt:1, unit:'can', item:'black beans'},
      {amt:1, unit:'cup', item:'corn salsa'},
      {amt:1, unit:'cup', item:'shredded lettuce'},
      {amt:0.5, unit:'cup', item:'pico de gallo'},
      {amt:0.5, unit:'cup', item:'guacamole'},
      {amt:0.5, unit:'cup', item:'shredded cheese'},
    ],
    steps:['cook pollo asado per package, slice','warm rice + beans',
      'build bowl: rice + beans + chicken','top with corn salsa, lettuce, pico, guac, cheese']},

  { id:'q4', name:'Popeyes Spicy Chicken Sandwich', emoji:'🔥', image:'', category:'Quick', servings:1,
    note:'just bare spicy + brioche = chaos in a good way',
    ingredients:[
      {amt:1, unit:'', item:'just bare spicy crispy chicken filet'},
      {amt:1, unit:'', item:'brioche bun'},
      {amt:2, unit:'tbsp', item:'spicy mayo (mayo + sriracha)'},
      {amt:4, unit:'slice', item:'dill pickle'},
      {amt:1, unit:'tbsp', item:'butter'},
    ],
    steps:['air fry chicken 10 min at 400°F','toast bun in butter',
      'spicy mayo on both sides','stack: bun + pickles + chicken + bun']},

  { id:'q5', name:'5-Min Quesadilla', emoji:'🫓', image:'', category:'Quick', servings:1,
    note:"when you've got 5 minutes and a tortilla",
    ingredients:[
      {amt:1, unit:'', item:'large flour tortilla'},
      {amt:0.5, unit:'cup', item:'shredded cheese (mexican blend)'},
      {amt:0.5, unit:'cup', item:'rotisserie chicken or leftover meat (optional)'},
      {amt:1, unit:'tbsp', item:'butter'},
      {amt:2, unit:'tbsp', item:'sour cream'},
      {amt:2, unit:'tbsp', item:'salsa'},
    ],
    steps:['butter skillet, add tortilla','cheese on one half + meat if using',
      'fold, cook 2 min per side until golden','slice, serve with sour cream + salsa']},

  { id:'q6', name:'Starbucks Egg Bites at Home', emoji:'🥚', image:'', category:'Quick', servings:6,
    note:'cottage cheese is the fluffiness secret',
    ingredients:[
      {amt:6, unit:'', item:'large egg'},
      {amt:0.5, unit:'cup', item:'cottage cheese'},
      {amt:0.5, unit:'cup', item:'shredded gruyere or cheddar'},
      {amt:4, unit:'slice', item:'bacon (cooked + crumbled)'},
      {amt:0.5, unit:'tsp', item:'salt'},
    ],
    steps:['preheat 300°F','blend eggs + cottage cheese + cheese + salt',
      'grease silicone muffin mold','pour egg mix, top with bacon',
      'bake in water bath 30 min until set','cool, pop out of mold']},

  { id:'q7', name:'Panda Express Orange Chicken Bowl', emoji:'🍱', image:'', category:'Quick', servings:4,
    note:"TJ's mandarin orange chicken + scallion pancakes = takeout done",
    ingredients:[
      {amt:1, unit:'bag', item:"TJ's mandarin orange chicken"},
      {amt:2, unit:'cup', item:'cooked jasmine rice'},
      {amt:4, unit:'', item:"TJ's scallion pancake"},
      {amt:2, unit:'cup', item:'frozen stir-fry veggies'},
      {amt:1, unit:'tbsp', item:'soy sauce'},
      {amt:1, unit:'tsp', item:'sesame oil'},
    ],
    steps:['air fry orange chicken per package','cook scallion pancakes per package',
      'stir-fry veggies in soy + sesame 5 min','divide rice into bowls',
      'top with chicken, serve with pancake on side']},

  { id:'q8', name:'TJ Indian Dinner', emoji:'🍛', image:'', category:'Quick', servings:3,
    note:"butter chicken + naan + rice in 10 min — don't tell anyone",
    ingredients:[
      {amt:1, unit:'box', item:"TJ's butter chicken"},
      {amt:1, unit:'bag', item:"TJ's garlic naan"},
      {amt:1, unit:'bag', item:"TJ's basmati rice (frozen or microwave)"},
      {amt:0.25, unit:'cup', item:'cilantro'},
    ],
    steps:['microwave butter chicken per box','warm naan in oven 3 min',
      'microwave rice','plate: rice + chicken + cilantro',
      'naan on the side for scooping']},

  { id:'q9', name:'Biscuit Hack (Frozen Biscuits)', emoji:'🥐', image:'', category:'Quick', servings:8,
    note:'frozen biscuits + honey butter = fancy',
    ingredients:[
      {amt:1, unit:'bag', item:'frozen biscuit (pillsbury grands or aldi)'},
      {amt:4, unit:'tbsp', item:'butter (softened)'},
      {amt:2, unit:'tbsp', item:'honey'},
      {amt:0.25, unit:'cup', item:'jam (strawberry or raspberry)'},
    ],
    steps:['bake biscuits per package (usually 400°F for 20 min)','whip butter + honey',
      'split biscuits, spread honey butter','add jam if you want']},

  { id:'q10', name:'15-Min Pizza', emoji:'🍕', image:'', category:'Quick', servings:4,
    note:"TJ pizza dough = closest you'll get to fresh",
    ingredients:[
      {amt:1, unit:'', item:"TJ's pizza dough"},
      {amt:0.5, unit:'cup', item:'pizza sauce'},
      {amt:1.5, unit:'cup', item:'mozzarella'},
      {amt:0.5, unit:'cup', item:'toppings (pepperoni, veggies)'},
      {amt:1, unit:'tbsp', item:'olive oil'},
    ],
    steps:['preheat oven 450°F with pizza stone if you have','stretch dough on parchment',
      'brush with olive oil','sauce + cheese + toppings',
      'bake 10–12 min until golden + bubbly']},

  { id:'q11', name:'McGriddle Hack with TJ Dutch Pancakes', emoji:'🥞', image:'', category:'Quick', servings:4,
    note:"TJ dutch griddle cakes are the mcdonald's bun secret",
    ingredients:[
      {amt:8, unit:'', item:"TJ's dutch griddle cake"},
      {amt:4, unit:'', item:'chicken breakfast sausage patty'},
      {amt:4, unit:'', item:'egg'},
      {amt:4, unit:'slice', item:'american cheese'},
      {amt:4, unit:'tbsp', item:'maple syrup'},
      {amt:1, unit:'tbsp', item:'butter'},
    ],
    steps:['warm griddle cakes in toaster or pan','cook sausage patties until browned',
      'fry eggs over-hard in butter','drizzle syrup on griddle cakes',
      'stack: cake + sausage + cheese + egg + cake']},

  { id:'q12', name:'TJ Cauliflower Gnocchi Sheet Pan', emoji:'🥬', image:'', category:'Quick', servings:3,
    note:'pesto + gnocchi + tomatoes = dinner party energy',
    ingredients:[
      {amt:1, unit:'bag', item:"TJ's cauliflower gnocchi (frozen)"},
      {amt:2, unit:'cup', item:'cherry tomato'},
      {amt:0.25, unit:'cup', item:'pesto'},
      {amt:2, unit:'tbsp', item:'olive oil'},
      {amt:0.25, unit:'cup', item:'parmesan'},
      {amt:0.5, unit:'tsp', item:'salt'},
    ],
    steps:['preheat 425°F','spread frozen gnocchi + tomatoes on sheet pan',
      'drizzle oil + salt','roast 20 min until gnocchi golden',
      'toss hot gnocchi with pesto','top with parm']},

  { id:'q13', name:'Olive Garden-Style Chicken Alfredo', emoji:'🍝', image:'', category:'Quick', servings:4,
    note:'rotisserie + TJ alfredo = 15-min copycat',
    ingredients:[
      {amt:1, unit:'lb', item:'fettuccine'},
      {amt:2, unit:'cup', item:'rotisserie chicken (shredded)'},
      {amt:1, unit:'jar', item:"TJ's alfredo sauce"},
      {amt:0.25, unit:'cup', item:'parmesan'},
      {amt:1, unit:'tbsp', item:'fresh parsley'},
    ],
    steps:['boil fettuccine per box','heat alfredo in pan',
      'add chicken to alfredo, warm through','toss with pasta',
      'top with parm + parsley']},

  { id:'q14', name:'TJ Mandarin Chicken Wrap', emoji:'🌯', image:'', category:'Quick', servings:3,
    note:'sweet + crunchy + 10-min lunch',
    ingredients:[
      {amt:1, unit:'bag', item:"TJ's mandarin orange chicken"},
      {amt:3, unit:'', item:'large flour tortilla'},
      {amt:2, unit:'cup', item:'coleslaw mix'},
      {amt:0.25, unit:'cup', item:'extra mandarin sauce'},
      {amt:0.25, unit:'cup', item:'sriracha mayo'},
    ],
    steps:['air fry mandarin chicken per package','chop into bite-size',
      'warm tortillas','layer: slaw + chicken + mandarin + sriracha mayo',
      'roll tight, slice in half']},


  /* ================= BREAD MACHINE ================= */
  { id:'br1', name:'Classic White Sandwich Loaf', emoji:'🍞', image:'', category:'Bread', servings:12,
    note:'the everyday loaf — toast, sandwiches, all of it ♡',
    ingredients:[
      {amt:1.25, unit:'cup', item:'warm water'},
      {amt:2, unit:'tbsp', item:'butter (softened)'},
      {amt:3, unit:'cup', item:'bread flour'},
      {amt:2, unit:'tbsp', item:'sugar'},
      {amt:1.25, unit:'tsp', item:'salt'},
      {amt:2.25, unit:'tsp', item:'bread machine yeast'},
    ],
    steps:['add ingredients to bread pan in order per machine instructions',
      'select basic / white bread setting, 1.5 lb loaf, medium crust',
      'start machine (~3 hours)','cool 10 min before slicing','store in bread bag, best within 3 days']},

  { id:'br2', name:'Cinnamon Raisin Swirl', emoji:'🥖', image:'', category:'Bread', servings:12,
    note:'cozy breakfast bread = weekend vibes',
    ingredients:[
      {amt:1, unit:'cup', item:'warm milk'},
      {amt:3, unit:'tbsp', item:'butter (softened)'},
      {amt:1, unit:'', item:'egg'},
      {amt:3, unit:'cup', item:'bread flour'},
      {amt:3, unit:'tbsp', item:'sugar'},
      {amt:1, unit:'tsp', item:'salt'},
      {amt:2, unit:'tsp', item:'cinnamon'},
      {amt:2.25, unit:'tsp', item:'bread machine yeast'},
      {amt:0.75, unit:'cup', item:'raisins'},
    ],
    steps:['add ingredients to bread pan in order (raisins in the fruit/nut compartment if your machine has one)',
      'select sweet bread or basic setting, medium crust',
      'start machine','cool 10 min, slice',
      'toast + butter = best breakfast']},

  { id:'br3', name:'Honey Whole Wheat', emoji:'🌾', image:'', category:'Bread', servings:12,
    note:'healthier loaf, still soft ♡',
    ingredients:[
      {amt:1.25, unit:'cup', item:'warm water'},
      {amt:2, unit:'tbsp', item:'olive oil'},
      {amt:3, unit:'tbsp', item:'honey'},
      {amt:2, unit:'cup', item:'whole wheat flour'},
      {amt:1, unit:'cup', item:'bread flour'},
      {amt:1.25, unit:'tsp', item:'salt'},
      {amt:2.25, unit:'tsp', item:'bread machine yeast'},
    ],
    steps:['add ingredients to bread pan in order','select whole wheat setting, medium crust',
      'start machine (~4 hours for wheat cycle)','cool 10 min before slicing',
      'keep in bread bag, toast beautifully next day']},

  { id:'br4', name:'Dough-Mode Multi-Use', emoji:'🥐', image:'', category:'Bread', servings:8,
    note:'one dough → pizza, focaccia, or brioche buns ♡',
    ingredients:[
      {amt:1, unit:'cup', item:'warm water'},
      {amt:2, unit:'tbsp', item:'olive oil'},
      {amt:3, unit:'cup', item:'bread flour'},
      {amt:1, unit:'tbsp', item:'sugar'},
      {amt:1, unit:'tsp', item:'salt'},
      {amt:2.25, unit:'tsp', item:'bread machine yeast'},
    ],
    steps:['add ingredients to bread pan, select DOUGH cycle (~1.5 hours)',
      'when dough is done, punch down + choose your path:',
      'PIZZA: stretch on pan, top, bake 450°F for 12 min',
      'FOCACCIA: press into oiled pan, dimple with fingers, top with rosemary + flaky salt, bake 425°F for 22 min',
      'BRIOCHE BUNS: divide into 8, shape, egg wash, bake 375°F for 18 min']},


  /* ================= OCCASIONS ================= */
  { id:'o1', name:'Filet Mignon with Garlic Butter + Mashed Potatoes', emoji:'🥩', image:'', category:'Occasions', servings:2,
    note:'anniversary or payday girl — treat yourself',
    ingredients:[
      {amt:2, unit:'', item:'filet mignon (6 oz each)'},
      {amt:2, unit:'tbsp', item:'butter'},
      {amt:3, unit:'clove', item:'garlic'},
      {amt:2, unit:'sprig', item:'fresh thyme'},
      {amt:1.5, unit:'lb', item:'yukon gold potato'},
      {amt:0.5, unit:'cup', item:'heavy cream'},
      {amt:4, unit:'tbsp', item:'butter (for mash)'},
      {amt:1, unit:'tsp', item:'salt'},
      {amt:0.5, unit:'tsp', item:'black pepper'},
    ],
    steps:['bring steaks to room temp, pat dry, season heavy with salt + pepper',
      'boil potatoes 20 min until fork tender, drain',
      'mash with warm cream + butter + salt',
      'sear steaks in hot cast iron 3 min per side',
      'add butter, smashed garlic, thyme — baste for 1 min',
      'rest steaks 5 min, serve over mash, spoon garlic butter on top']},

  { id:'o2', name:'Homemade Sushi Night', emoji:'🍣', image:'', category:'Occasions', servings:4,
    note:'girls night in — cheaper + more fun than a sushi restaurant ♡',
    ingredients:[
      {amt:2, unit:'cup', item:'sushi rice'},
      {amt:3, unit:'tbsp', item:'rice vinegar'},
      {amt:2, unit:'tbsp', item:'sugar'},
      {amt:1, unit:'tsp', item:'salt'},
      {amt:8, unit:'sheet', item:'nori'},
      {amt:1, unit:'lb', item:'sushi-grade salmon or tuna'},
      {amt:1, unit:'', item:'cucumber'},
      {amt:1, unit:'', item:'avocado'},
      {amt:0.5, unit:'cup', item:'cream cheese (optional)'},
      {amt:0.25, unit:'cup', item:'soy sauce'},
      {amt:2, unit:'tbsp', item:'wasabi'},
      {amt:0.25, unit:'cup', item:'pickled ginger'},
    ],
    steps:['rinse rice until water runs clear, cook per package',
      'mix vinegar + sugar + salt, fold into warm rice, cool',
      'slice fish + veggies into long strips',
      'on a bamboo mat: nori shiny-side down, spread rice, add fillings',
      'roll tight with mat, slice with wet knife',
      'serve with soy sauce, wasabi, pickled ginger']},

  { id:'o3', name:'Shrimp Scampi Linguine', emoji:'🍤', image:'', category:'Occasions', servings:4,
    note:'date night 20-min meal that tastes expensive',
    ingredients:[
      {amt:1, unit:'lb', item:'linguine'},
      {amt:1, unit:'lb', item:'large shrimp (peeled + deveined)'},
      {amt:6, unit:'tbsp', item:'butter'},
      {amt:6, unit:'clove', item:'garlic (minced)'},
      {amt:0.5, unit:'cup', item:'white wine'},
      {amt:1, unit:'', item:'lemon (juice + zest)'},
      {amt:0.25, unit:'tsp', item:'red pepper flake'},
      {amt:0.25, unit:'cup', item:'parsley (chopped)'},
      {amt:0.5, unit:'cup', item:'parmesan'},
      {amt:1, unit:'tsp', item:'salt'},
    ],
    steps:['boil linguine per box, reserve 1 cup pasta water',
      'melt butter, sauté garlic 1 min',
      'add shrimp, cook 2 min per side until pink',
      'add wine, lemon juice + zest, pepper flakes, simmer 2 min',
      'toss with pasta + splash of pasta water',
      'finish with parsley + parmesan']},

  { id:'o4', name:'Chocolate Lava Cakes', emoji:'🍫', image:'', category:'Occasions', servings:4,
    note:'molten middles, ready in 12 min — actually impressive ♡',
    ingredients:[
      {amt:0.5, unit:'cup', item:'dark chocolate (chopped)'},
      {amt:0.5, unit:'cup', item:'butter'},
      {amt:1, unit:'cup', item:'powdered sugar'},
      {amt:2, unit:'', item:'whole egg'},
      {amt:2, unit:'', item:'egg yolk'},
      {amt:0.33, unit:'cup', item:'flour'},
      {amt:1, unit:'tsp', item:'vanilla'},
      {amt:1, unit:'pinch', item:'salt'},
    ],
    steps:['preheat 425°F, butter 4 ramekins + dust with cocoa',
      'melt chocolate + butter in microwave 1 min',
      'whisk in sugar, eggs, yolks, vanilla',
      'fold in flour + salt',
      'divide into ramekins, bake 12 min (edges set, center jiggly)',
      'invert onto plates, dust with powdered sugar',
      'serve immediately with vanilla ice cream']},

  { id:'o5', name:'Cheese & Wine Board', emoji:'🧀', image:'', category:'Occasions', servings:4,
    note:'no cooking — just assembly + your fancy plate',
    ingredients:[
      {amt:4, unit:'oz', item:'brie'},
      {amt:4, unit:'oz', item:'aged cheddar'},
      {amt:4, unit:'oz', item:'goat cheese or gorgonzola'},
      {amt:4, unit:'oz', item:'prosciutto'},
      {amt:4, unit:'oz', item:'salami'},
      {amt:1, unit:'cup', item:'grape'},
      {amt:1, unit:'cup', item:'fig jam or honey'},
      {amt:0.5, unit:'cup', item:'marcona almond'},
      {amt:1, unit:'', item:'baguette (sliced)'},
      {amt:1, unit:'box', item:'water cracker'},
    ],
    steps:['pull cheeses out 30 min before serving (room temp = flavor)',
      'arrange cheeses on opposite corners of a board',
      'fold + drape meats near cheeses',
      'fill gaps with grapes, almonds, jam in little bowls',
      'fan bread + crackers around edges',
      'pour wine, cancel all plans ♡']},

];

/* ---- All 53 recipes done. Core logic next ---- */

/* ============ pantry defaults ============ */
const PANTRY_DEFAULTS = [
  'olive oil','salt','black pepper','garlic','onion','egg','butter','flour','sugar',
  'jasmine rice','pasta','soy sauce','canned diced tomatoes','canned chickpeas',
  'vanilla','baking powder','baking soda','paprika','oregano','italian seasoning',
  'milk','parmesan','cinnamon','honey','maple syrup',
];

/* ============ state ============ */
const LS_KEY = 'mwl_state_v2';
const LETTER_SEEN_KEY = 'mwl_letter_seen_v1';
const state = loadState();

function loadState(){
  try{
    const s = JSON.parse(localStorage.getItem(LS_KEY) || 'null');
    if(s && s.recipes) return migrate(s);
  }catch(e){}
  return freshState();
}
function freshState(){
  return {
    recipes: DEFAULT_RECIPES,
    weeks: {},
    checked: {},
    saved: [],
    pantry: PANTRY_DEFAULTS.map(n=>({id:uid(), item:n, haveIt:false})),
    currentWeek: weekKey(new Date()),
    currentCategory: 'All',
  };
}
function migrate(s){
  if(!s.pantry) s.pantry = PANTRY_DEFAULTS.map(n=>({id:uid(), item:n, haveIt:false}));
  if(!s.currentCategory) s.currentCategory = 'All';
  return s;
}
function save(){ localStorage.setItem(LS_KEY, JSON.stringify(state)); }

/* ============ helpers ============ */
function weekKey(d){
  const x = new Date(d); x.setHours(0,0,0,0);
  x.setDate(x.getDate() - x.getDay());
  return x.toISOString().slice(0,10);
}
function addDays(isoKey, n){ const d=new Date(isoKey); d.setDate(d.getDate()+n); return d; }
function fmtDate(d){ return d.toLocaleDateString(undefined,{month:'short',day:'numeric'}); }
function ensureWeek(key){
  if(!state.weeks[key]){
    state.weeks[key] = {};
    for(let i=0;i<7;i++) state.weeks[key][i] = {breakfast:[], lunch:[], dinner:[]};
  }
  return state.weeks[key];
}
function scaleIngredients(recipe, targetServings){
  const factor = targetServings / recipe.servings;
  return recipe.ingredients.map(ing => ({...ing, amt: +(ing.amt * factor).toFixed(2)}));
}
function fmtAmt(a){
  if(a === Math.floor(a)) return String(a);
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
function esc(s){ return String(s||'').replace(/[&<>"]/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c])); }

/* ============ tabs ============ */
document.querySelectorAll('.tab').forEach(btn=>{
  btn.addEventListener('click',()=>{
    document.querySelectorAll('.tab').forEach(b=>b.classList.remove('active'));
    document.querySelectorAll('.view').forEach(v=>v.classList.remove('active'));
    btn.classList.add('active');
    const id = btn.dataset.tab;
    document.getElementById(id).classList.add('active');
    if(id==='planner') renderWeek();
    if(id==='pantry') renderPantry();
    if(id==='grocery') renderGrocery();
    if(id==='saved') renderSaved();
  });
});

/* ============ welcome modal ============ */
function showWelcome(){
  document.getElementById('welcomeModal').classList.remove('hidden');
  document.getElementById('envelopeStage').classList.remove('hidden');
  document.getElementById('letterStage').classList.add('hidden');
}
function openLetter(){
  document.getElementById('envelopeStage').classList.add('hidden');
  document.getElementById('letterStage').classList.remove('hidden');
}
function hideWelcome(){
  document.getElementById('welcomeModal').classList.add('hidden');
}
document.getElementById('startCookingBtn')?.addEventListener('click', hideWelcome);
document.getElementById('reopenLetter')?.addEventListener('click', showWelcome);
document.getElementById('envelope')?.addEventListener('click', openLetter);

/* ============ close-modal wiring ============ */
function closeModal(id){ document.getElementById(id).classList.add('hidden'); }
document.querySelectorAll('[data-close]').forEach(b=>{
  b.addEventListener('click', e=> e.target.closest('.modal').classList.add('hidden'));
});
document.querySelectorAll('.modal').forEach(m=>{
  m.addEventListener('click', e=>{ if(e.target===m) m.classList.add('hidden'); });
});

/* ============ cookbook + filters + tips ============ */
function renderCookbook(){
  const grid = document.getElementById('recipeGrid');
  const tipBox = document.getElementById('tipBox');
  const cat = state.currentCategory;

  // tips
  if(TIPS[cat]){
    tipBox.innerHTML = `<div class="sticky-note">
      <h4>${cat.toLowerCase()} tips ♡</h4>
      <ul>${TIPS[cat].map(t=>`<li>${esc(t)}</li>`).join('')}</ul>
    </div>`;
  } else tipBox.innerHTML = '';

  // sweets empty state
  if(cat === 'Sweets'){
    grid.innerHTML = `<div class="empty-state sweets">
      <span class="big">💅</span>
      <h3>you don't need dessert</h3>
      <p>love, lisa ♡</p>
    </div>`;
    return;
  }

  // filter
  let list = state.recipes;
  if(cat !== 'All') list = list.filter(r => r.category === cat);

  if(!list.length){
    grid.innerHTML = `<div class="empty-state"><span class="big">🍳</span>
      <h3>no recipes in this category yet</h3></div>`;
    return;
  }

  grid.innerHTML = '';
  list.forEach(r=>{
    const card = document.createElement('div');
    card.className = 'recipe-card';
    const thumb = r.image
      ? `<img class="card-img" src="${esc(r.image)}" alt="${esc(r.name)}" onerror="this.outerHTML='<span class=emoji>${esc(r.emoji)}</span>'">`
      : `<span class="emoji">${r.emoji}</span>`;
    card.innerHTML = `
      ${thumb}
      <span class="cat">${r.category}</span>
      <h3>${esc(r.name)}</h3>
      <p class="note">${esc(r.note||'')}</p>
      <div class="meta">
        <span>serves ${r.servings}</span>
        <span>${r.ingredients.length} ingredients</span>
      </div>`;
    card.addEventListener('click',()=>openRecipe(r.id));
    grid.appendChild(card);
  });
}

// chip row
document.querySelectorAll('#chipRow .chip').forEach(chip=>{
  chip.addEventListener('click',()=>{
    document.querySelectorAll('#chipRow .chip').forEach(c=>c.classList.remove('active'));
    chip.classList.add('active');
    state.currentCategory = chip.dataset.cat;
    save();
    renderCookbook();
  });
});

/* ============ recipe modal ============ */
function openRecipe(id){
  const r = state.recipes.find(x=>x.id===id);
  if(!r) return;
  const body = document.getElementById('recipeModalBody');
  body.className = 'recipe-full';
  const hero = r.image
    ? `<img class="hero-img" src="${esc(r.image)}" alt="" onerror="this.outerHTML='<span class=emoji-big>${esc(r.emoji)}</span>'">`
    : `<span class="emoji-big">${r.emoji}</span>`;
  body.innerHTML = `
    ${hero}
    <h3 style="text-align:center">${esc(r.name)}</h3>
    <p class="note-full">${esc(r.note||'')}</p>
    <div style="text-align:center;margin-bottom:10px">
      <span class="pill">${r.category}</span>
      <span class="pill">serves ${r.servings}</span>
    </div>
    <h4>Ingredients</h4>
    <ul>${r.ingredients.map(i=>`<li>${fmtAmt(i.amt)} ${esc(i.unit)} ${esc(i.item)}</li>`).join('')}</ul>
    <h4>Instructions</h4>
    <ol>${r.steps.map(s=>`<li>${esc(s)}</li>`).join('')}</ol>
    <div class="modal-actions">
      <button class="btn btn-ghost" id="editRecipeBtn">edit</button>
      <button class="btn btn-soft" id="addToWeekBtn">add to my week ♡</button>
    </div>`;
  document.getElementById('recipeModal').classList.remove('hidden');
  document.getElementById('addToWeekBtn').onclick = ()=>{ closeModal('recipeModal'); openAssign(r.id); };
  document.getElementById('editRecipeBtn').onclick = ()=>{ closeModal('recipeModal'); openEdit(r.id); };
}

/* ============ assign to week ============ */
let pendingRecipe = null;

function openAssign(id){
  pendingRecipe = state.recipes.find(r=>r.id===id);
  if(!pendingRecipe) return;
  document.getElementById('assignRecipeName').textContent =
    `${pendingRecipe.emoji} ${pendingRecipe.name} (base: serves ${pendingRecipe.servings})`;
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
    <h5>scaled for ${target} servings (${days} days × ${meals} meals)</h5>
    <ul>${scaled.map(i=>`<li>${fmtAmt(i.amt)} ${esc(i.unit)} ${esc(i.item)}</li>`).join('')}</ul>`;
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
        scaledIngredients: i===0 && s===slotsForDay[0] ? scaled : null,
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
            <span>${m.emoji} ${esc(m.name)}</span>
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

/* ============ pantry ============ */
function renderPantry(){
  const grid = document.getElementById('pantryGrid');
  if(!state.pantry.length){
    grid.innerHTML = `<div class="empty-state"><span class="big">🌿</span>
      <h3>your pantry is empty</h3>
      <p>add things you always have stocked!</p></div>`;
    return;
  }
  grid.innerHTML = state.pantry
    .slice()
    .sort((a,b)=>a.item.localeCompare(b.item))
    .map(p=>`
      <label class="pantry-item ${p.haveIt?'have':''}" data-id="${p.id}">
        <input type="checkbox" ${p.haveIt?'checked':''}/>
        <span class="name">${esc(p.item)}</span>
        <button class="rm" title="remove">×</button>
      </label>`).join('');
  grid.querySelectorAll('.pantry-item').forEach(el=>{
    const id = el.dataset.id;
    el.querySelector('input').addEventListener('change', e=>{
      const it = state.pantry.find(x=>x.id===id);
      if(it){ it.haveIt = e.target.checked; el.classList.toggle('have', it.haveIt); save(); }
    });
    el.querySelector('.rm').addEventListener('click', e=>{
      e.preventDefault(); e.stopPropagation();
      state.pantry = state.pantry.filter(x=>x.id!==id);
      save(); renderPantry();
    });
  });
}

document.getElementById('addPantryForm').addEventListener('submit', e=>{
  e.preventDefault();
  const inp = document.getElementById('addPantryInput');
  const val = inp.value.trim();
  if(!val) return;
  state.pantry.push({id:uid(), item:val.toLowerCase(), haveIt:true});
  inp.value = ''; save(); renderPantry();
});

function inPantry(itemName){
  const n = (itemName||'').toLowerCase();
  return state.pantry.some(p => p.haveIt && (
    n.includes(p.item) || p.item.includes(n)
  ));
}

/* ============ grocery list ============ */
function renderGrocery(){
  const key = state.currentWeek;
  const week = state.weeks[key] || {};
  const bucket = {};
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
  const items = Object.entries(bucket).map(([k,v])=>({k,...v, for:[...v.for], haveIt: inPantry(v.item)}));
  const list = document.getElementById('groceryList');
  if(!items.length){
    list.innerHTML = `<div class="empty-state"><span class="big">🛒</span>
      <h3>no meals planned this week yet</h3>
      <p>head to the cookbook and add some!</p></div>`;
    return;
  }
  items.sort((a,b)=>{
    if(a.haveIt !== b.haveIt) return a.haveIt ? 1 : -1;
    return a.item.localeCompare(b.item);
  });
  state.checked[key] = state.checked[key] || {};

  const toBuy = items.filter(i=>!i.haveIt);
  const alreadyHave = items.filter(i=>i.haveIt);

  list.innerHTML = `
    <div class="grocery-cat">
      <h4>to buy — week of ${fmtDate(new Date(key))}</h4>
      ${toBuy.map(it=>{
        const checked = state.checked[key][it.k] ? 'checked' : '';
        return `<div class="grocery-item ${checked}" data-k="${it.k}">
          <div class="check"></div>
          <div class="text">${fmtAmt(it.amt)} ${esc(it.unit)} ${esc(it.item)}</div>
          <div class="for">for ${esc(it.for.join(', '))}</div>
        </div>`;
      }).join('') || '<p class="sub">all set ♡</p>'}
    </div>
    ${alreadyHave.length ? `<div class="grocery-cat pantry">
      <h4>🌿 already in your pantry</h4>
      ${alreadyHave.map(it=>`<div class="grocery-item in-pantry" data-k="${it.k}">
        <div class="check">🌿</div>
        <div class="text">${fmtAmt(it.amt)} ${esc(it.unit)} ${esc(it.item)}</div>
      </div>`).join('')}
    </div>` : ''}
  `;
  list.querySelectorAll('.grocery-item:not(.in-pantry)').forEach(el=>{
    el.addEventListener('click',()=>{
      const k = el.dataset.k;
      state.checked[key][k] = !state.checked[key][k];
      el.classList.toggle('checked');
      save();
    });
  });
}

document.getElementById('copyList').addEventListener('click',()=>{
  const items = [...document.querySelectorAll('#groceryList .grocery-item:not(.in-pantry) .text')]
    .map(t=>t.textContent.trim());
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
      <h3>no saved plans yet</h3>
      <p>save a week from the planner tab!</p></div>`;
    return;
  }
  el.innerHTML = state.saved.map(p=>`
    <div class="saved-card" data-id="${p.id}">
      <h4>${esc(p.name)}</h4>
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
  document.getElementById('editTitle').textContent = r ? 'edit recipe' : 'new recipe';
  document.getElementById('edName').value = r?.name || '';
  document.getElementById('edNote').value = r?.note || '';
  document.getElementById('edServings').value = r?.servings || 4;
  document.getElementById('edCategory').value = r?.category || 'Dinner';
  document.getElementById('edEmoji').value = r?.emoji || '🍲';
  const edImage = document.getElementById('edImage');
  if(edImage) edImage.value = r?.image || '';
  updateImagePreview();
  document.getElementById('edIngredients').value = r
    ? r.ingredients.map(i=>`${fmtAmt(i.amt)} ${i.unit} ${i.item}`.trim().replace(/\s+/g,' ')).join('\n')
    : '';
  document.getElementById('edSteps').value = r ? r.steps.join('\n') : '';
  document.getElementById('deleteRecipeBtn').style.display = r ? '' : 'none';
  document.getElementById('editModal').classList.remove('hidden');
}

function parseIngredientLine(line){
  const parts = line.trim().split(/\s+/);
  if(!parts.length) return null;
  const amt = parseFloat(parts[0]);
  if(isNaN(amt)) return {amt:1, unit:'', item:line.trim()};
  const UNITS = ['cup','cups','tbsp','tsp','lb','lbs','oz','g','kg','ml','l','clove','cloves',
    'can','cans','stalk','pinch','dash','slice','slices','sprig','sprigs','handful','container',
    'containers','bag','bags','jar','jars','box','boxes','pack','packs','packet','pint','pints','sheet','sheets'];
  let unit = '', rest;
  if(parts[1] && UNITS.includes(parts[1].toLowerCase())){
    unit = parts[1].replace(/s$/,'');
    rest = parts.slice(2).join(' ');
  } else {
    rest = parts.slice(1).join(' ');
  }
  return {amt, unit, item: rest};
}

function updateImagePreview(){
  const input = document.getElementById('edImage');
  const box = document.getElementById('edImagePreview');
  if(!input || !box) return;
  const url = input.value.trim();
  if(!url){ box.innerHTML = ''; return; }
  box.innerHTML = `<img src="${url.replace(/"/g,'&quot;')}" alt="preview" onerror="this.outerHTML='<div class=err>that link didn\\'t load as an image — try a direct .jpg, .png, or .webp URL (right-click → copy image address)</div>'">`;
}
document.getElementById('edImage')?.addEventListener('input', ()=>{
  clearTimeout(window._mwlImgT);
  window._mwlImgT = setTimeout(updateImagePreview, 400);
});

document.getElementById('saveRecipeBtn').addEventListener('click',()=>{
  const name = document.getElementById('edName').value.trim();
  if(!name){ toast('name please ♡'); return; }
  const ingredients = document.getElementById('edIngredients').value
    .split('\n').map(l=>l.trim()).filter(Boolean).map(parseIngredientLine).filter(Boolean);
  const steps = document.getElementById('edSteps').value
    .split('\n').map(l=>l.trim()).filter(Boolean);
  const edImage = document.getElementById('edImage');
  const data = {
    id: editingId || uid(),
    name,
    emoji: document.getElementById('edEmoji').value || '🍲',
    image: edImage ? edImage.value.trim() : '',
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
// sync chip with saved category
document.querySelectorAll('#chipRow .chip').forEach(c=>{
  c.classList.toggle('active', c.dataset.cat === state.currentCategory);
});
renderCookbook();
showWelcome();
