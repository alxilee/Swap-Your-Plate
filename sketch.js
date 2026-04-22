/*
ARTG2262
Name: Alexi Lee
Assignment: Final Project
Title: Swap Your Plate
*/
 
// --- INGREDIENT DATA ---
const ingredients = [
  {id: 'beef', name: 'Beef', file: 'beef.png', co2: 27.0, water: 1552, land: 164.0},
  {id: 'lamb', name: 'Lamb', file: 'lamb.png', co2: 24.0, water: 1245, land: 185.0},
  {id: 'chicken', name: 'Chicken', file: 'chicken.png', co2: 6.9, water: 300, land: 7.1},
  {id: 'salmon', name: 'Salmon', file: 'salmon.png', co2: 6.0,  water: 390, land: 3.7},
  {id: 'egg', name: 'Egg', file: 'egg.png', co2: 4.5,  water: 196,  land: 5.7},
  {id: 'cheese', name: 'Cheese', file: 'cheese.png', co2: 13.5, water: 381, land: 10.0},
  {id: 'milk', name: 'Whole milk',  file: 'whole milk.png',  co2: 3.2, water: 628, land: 8.9},
  {id: 'oatmilk', name: 'Almond milk', file: 'almond milk.png', co2: 0.9, water: 48, land: 0.76},
  {id: 'tofu', name: 'Tofu', file: 'tofu.png', co2: 3.0, water: 164, land: 2.2},
  {id: 'lentils', name: 'Lentils', file: 'lentils.png', co2: 0.9, water: 283, land: 3.4},
  {id: 'rice', name: 'White rice', file: 'rice.png', co2: 4.0, water: 270, land: 2.8},
  {id: 'bread', name: 'Bread', file: 'bread.png', co2: 1.3, water: 185, land: 1.4},
  {id: 'potato', name: 'Potatoes', file: 'potatoes.png', co2: 0.5, water: 56, land: 0.9},
  {id: 'tomato', name: 'Tomato', file: 'tomato.png', co2: 1.4, water: 63, land: 0.8},
  {id: 'broccoli', name: 'Broccoli', file: 'broccoli.png', co2: 0.4, water: 31, land: 0.2},
  {id: 'almonds',  name: 'Peanuts', file: 'peanuts.png', co2: 3.5, water: 371, land: 12.2},
];
 
const swaps = [
  {from: 'beef', to: 'chicken', label: 'Beef → Chicken'},
  {from: 'beef', to: 'tofu', label: 'Beef → Tofu'},
  {from: 'lamb', to: 'salmon', label: 'Lamb → Salmon'},
  {from: 'milk', to: 'oatmilk', label: 'Whole milk → Almond milk'},
  {from: 'cheese', to: 'tofu', label: 'Cheese → Tofu'},
];


// --- COLORS ---
const C = {
  bg: '#F5F0E8',
  green: '#1E4D0F',
  greenMed: '#4A9E2F',
  greenBtn: '#2D5A1B',
  terracotta: '#8B3A1A',
  blue: '#185FA5',
  textFaded: '#5F5E5A',
  textFaint: '#999790',
  border: '#D3D1C7',
  cardBg: '#E8E4DA',
  cardSel: '#D8EDCA',
  white: '#FFFFFF',
};
 

// --- STATE ---
let screen = 'landing page';
let selected = new Set();
let appliedSwaps = new Set(); // doesn't allow for same selection
 
// for the animation: target is actual, display is what is shown on screen
let displayCO2 = 0, targetCO2 = 0;
let displayWater = 0, targetWater = 0;
let displayLand = 0, targetLand = 0;

// for the saved CO2 popup
let floatText = '';
let floatY = 0;
let floatAlpha = 0;

let imgs = {};
let plateImg, plateBgImg;
 
let LEFT_X, LEFT_W;
let MID_X, MID_W;
let RIGHT_X, RIGHT_W;
let PLATE_CX, PLATE_CY, PLATE_SIZE, PLATE_INNER_R;
let CARD_W, CARD_H, CARD_GAP;
let CARD_COLS = 8;
let GRID_Y, GRID_X_START;
let HEADER_H = 68;
let CONTENT_TOP;
let CONTENT_BOT;


// Preloading: had issues with images not being fully loaded so asked AI for solution
function preload() {
  ingredients.forEach(ing => {
    imgs[ing.id] = loadImage(ing.file);
  });
  plateImg = loadImage('Plate.png');
  plateBgImg = loadImage('Plate-bg.png');
}
 
function setup() {
  createCanvas(windowWidth, windowHeight);
  textFont('Arial');
  setLayout();
  noStroke();
}
 
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  setLayout();
}
 

// --- LAYOUT ---
function setLayout() {
  HEADER_H = 68;
  PAD = 80; 

  // Ingredient grid position
  COL_GAP = 10;
  CARD_GAP = 10;
  let gridH  = height * 0.28; // 28% of screen height
  CARD_H = (gridH - CARD_GAP) / 2;
  CARD_W = (width - PAD * 2 - CARD_GAP * (CARD_COLS - 1)) / CARD_COLS;
  GRID_Y = height - gridH - 44;
  GRID_X_START = PAD;
 
  CONTENT_TOP = HEADER_H + 60;
  CONTENT_BOT = GRID_Y - 12;
 
  LEFT_W = 312;  
  RIGHT_W = 312;  
  MID_W = width - LEFT_W - RIGHT_W - PAD * 2 - COL_GAP * 2;
 
  LEFT_X = PAD;
  MID_X = LEFT_X + LEFT_W + COL_GAP;
  RIGHT_X = MID_X + MID_W + COL_GAP;
 
  // Plate position
  let availH = CONTENT_BOT - CONTENT_TOP;
  PLATE_SIZE = min(MID_W * 0.95, availH * 0.95);
  PLATE_CX = MID_X + MID_W / 1.97;
  PLATE_CY = CONTENT_TOP + availH / 2 - 40;
  PLATE_INNER_R = PLATE_SIZE * 0.5;
}
 
 
// --- DRAW ---
function draw() {
  if (screen === 'landing page') {
    drawLanding();
  } else {
    background(C.bg);
    animateMetrics();
    drawHeader();
    drawMetrics();
    drawPlate();
    drawRightPanel();
    drawIngredientGrid();
    drawSavedCarbon();
  }
}
 
 
// --- LANDING PAGE ---
function drawLanding() {
  background(C.bg);
  image(plateBgImg, 0, 0, width, height);
 
  fill(C.green);
  textSize(72);
  textStyle(BOLD);
  textAlign(CENTER, CENTER);
  text('Swap Your Plate', width / 2, height / 2 - 80);
 
  fill(C.textFaded);
  textSize(18);
  textStyle(NORMAL);
  text('See how your meals affect the environment. Swap it.', width / 2, height / 2 - 18);
  text('See your ecological footprint fall.', width / 2, height / 2 + 12);
 
  const btnW = 180, btnH = 50;
  const btnX = width / 2 - btnW / 2;
  const btnY = height / 2 + 62;
 
  fill(C.greenBtn);
  noStroke();
  rect(btnX, btnY, btnW, btnH, 30);
  fill(C.white);
  textSize(16);
  textStyle(NORMAL);
  textAlign(CENTER, CENTER);
  text("Let's plate", width / 2, btnY + btnH / 2);
 
  fill(C.textFaint);
  textSize(11);
  textStyle(ITALIC);
  textAlign(CENTER, TOP);
  text('All values based on a 1kg serving. Source: Our World in Data.', width / 2, btnY + btnH + 25);
  textStyle(NORMAL);
}
 
 
// --- HEADER ---
function drawHeader() {
  fill(C.greenMed);
  rect(0, 0, width, 4);
 
  fill(C.green);
  textSize(14);
  textStyle(BOLD);
  textAlign(CENTER, TOP);
  text('Swap Your Plate', width / 2, 30);
 
  fill(C.textFaded);
  textSize(18);
  textStyle(NORMAL);
  textAlign(CENTER, TOP);
  text('Click ingredients to build your meal and watch your footprint update.', width / 2, 55);
}
 
 
// --- METRICS ---
function drawMetrics() {
  const cards = [
    {label: 'CO² emissions', value: displayCO2.toFixed(1), unit: 'kg', col: C.terracotta}, // 1 decimal point
    {label: 'Water usage', value: Math.round(displayWater).toLocaleString(), unit: 'liters', col: C.blue}, //round up
    {label: 'Land use', value: displayLand.toFixed(1), unit: 'm²',col: C.green}, // 1 decimal point
  ];
 
  const totalH = (CONTENT_BOT - CONTENT_TOP) * 0.85; // squish in 85%
  const cardGap = 10;
  const cardH = (totalH - cardGap * 2) / 3;
 
  cards.forEach((c, i) => {
    const y = CONTENT_TOP + i * (cardH + cardGap);
 
    fill(C.cardBg);
    noStroke();
    rect(LEFT_X, y, LEFT_W, cardH, 10);
 
    // metric title
    fill(C.textFaded);
    textSize(13);
    textStyle(NORMAL);
    textAlign(CENTER, TOP);
    text(c.label, LEFT_X + LEFT_W / 2, y + 12);
  
    // actual metric
    fill(c.col);
    textSize(min(cardH * 0.38, 40));
    textStyle(BOLD);
    textAlign(CENTER, TOP);
    text(c.value, LEFT_X + LEFT_W / 2, y + cardH * 0.35); // move down .35
 
    // metric unit
    fill(C.textFaint);
    textSize(11);
    textStyle(NORMAL);
    textAlign(CENTER, TOP);
    text(c.unit, LEFT_X + LEFT_W / 2, y + cardH * 0.8); // move down .8
  });
}
 
 
// --- PLATE ---
function drawPlate() {
  let plateW = PLATE_SIZE;
  let plateH = PLATE_SIZE * (plateImg.height / plateImg.width); // plate kept stretching out - asked AI how to keep dimensions
  image(plateImg,
    PLATE_CX - plateW / 2,
    PLATE_CY - plateH / 2,
    plateW, plateH);

  // grid of ingredients inside plate
  const items = [...selected];
  const cols = min(3, items.length);
  const rows = ceil(items.length / cols);
  const stepX = (PLATE_INNER_R * 0.8) / max(cols, 1);
  const stepY = (PLATE_INNER_R * 0.7) / max(rows, 1);
  const startX = PLATE_CX - (cols - 1) * stepX / 2;
  const startY = PLATE_CY - (rows - 1) * stepY / 2 - 20;
  const iconSz = min(stepX * 0.9, 52);

  // put ingredients on plate
  items.forEach((id, idx) => {
    const ing = ingredients.find(i => i.id === id); // finds id
    const col = idx % cols; // remainder to find column
    const row = Math.floor(idx / cols); // remainder to find row
    const ix = startX + col * stepX; // converts col # into coordinates
    const iy = startY + row * stepY; // converts row # into coordinates
    image(imgs[ing.id], ix - iconSz / 2, iy - iconSz / 2, iconSz, iconSz); // puts in icon
  });
}
 
 
// --- RIGHT PANEL ---
function drawRightPanel() {
  const totalH = CONTENT_BOT - CONTENT_TOP;
  const equivH = totalH * 0.26;
  const equivY = CONTENT_TOP;
 
// Equivalency statement
  fill(C.cardBg);
  noStroke();
  rect(RIGHT_X, equivY, RIGHT_W, equivH, 10);
 
  const miles = (targetCO2 / 0.404).toFixed(1); // 0.404 kg CO2 per mile
  const showers = Math.round(targetWater / 65); // 65 liters per shower
 
  fill(C.blue);
  textSize(16);
  textStyle(BOLD);
  textAlign(CENTER, CENTER);
  if (targetCO2 === 0) {
    text('Like driving 0 miles\nand using 0 showers\nworth of water',
      RIGHT_X + RIGHT_W / 2, equivY + equivH / 2);
  } else {
    text(`Like driving ${miles} miles\nand using ${showers} shower${showers !== 1 ? 's' : ''}\nworth of water`,
      RIGHT_X + RIGHT_W / 2, equivY + equivH / 2);
  }
 
// Swap suggestions
  const swapLabelY = equivY + equivH + 14;
  fill(C.green);
  textSize(14);
  textStyle(BOLD);
  textAlign(LEFT, TOP);
  text('Swap suggestions', RIGHT_X, swapLabelY);
  textStyle(NORMAL);
 
  const relevant = swaps.filter(s => selected.has(s.from)); // only chosen ingredients
 
  if (relevant.length === 0) {
    fill(C.textFaint);
    textSize(11);
    textStyle(ITALIC);
    textAlign(LEFT, TOP);
    text('Add beef, lamb, cheese,or whole milk to see swaps.', RIGHT_X, swapLabelY + 22);
    textStyle(NORMAL);
    return;
  }
 
  const swapH = 58;
  const swapGap = 8;
 
  relevant.forEach((swap, i) => {
    const y = swapLabelY + 22 + i * (swapH + swapGap);
    const fromIng = ingredients.find(ing => ing.id === swap.from);
    const toIng = ingredients.find(ing => ing.id === swap.to);
    const isApplied = appliedSwaps.has(swap.from + swap.to);

    fill(isApplied ? C.cardSel : C.white);
    stroke(isApplied ? C.greenMed : C.border);
    strokeWeight(isApplied ? 1.5 : 0.5);
    rect(RIGHT_X, y, RIGHT_W, swapH, 8);
    noStroke();

    // Swap suggestions icons
    if (imgs[fromIng.id]) image(imgs[fromIng.id], RIGHT_X + 16,  y + 9, 36, 36);
    if (imgs[toIng.id])   image(imgs[toIng.id],   RIGHT_X + 96, y + 9, 36, 36);

    // Swap suggestions arrow
    fill(C.textFaint);
    textSize(16);
    textAlign(LEFT, CENTER);
    text('→', RIGHT_X + 67, y + swapH / 2 - 2);

    // Click to apply
    fill(isApplied ? C.green : C.textFaint);
    textSize(10);
    textAlign(RIGHT, CENTER);
    text('click to swap', RIGHT_X + RIGHT_W - 6, y + swapH / 2);
  });
}
 
 
// --- INGREDIENT GRID ---
function drawIngredientGrid() {
 
  // position
  ingredients.forEach((ing, i) => {
    const col = i % CARD_COLS; // index divided by column remainder
    const row = Math.floor(i / CARD_COLS); // same logic as grid in plate
    const x = GRID_X_START + col * (CARD_W + CARD_GAP);
    const y = GRID_Y + row * (CARD_H + CARD_GAP);
    drawIngredientCard(ing, x, y);
  });
}
 
function drawIngredientCard(ing, x, y) {
  const sel = selected.has(ing.id);
 
  fill(sel ? C.cardSel : C.white);
  stroke(sel ? C.greenMed : C.border);
  strokeWeight(sel ? 1.5 : 0.5);
  rect(x, y, CARD_W, CARD_H, 8);
  noStroke();
  
  // ingredient icon
  const iconSz = CARD_W * 0.3;
  if (imgs[ing.id]) {
    image(imgs[ing.id], x + (CARD_W - iconSz) / 2, y + 16, iconSz, iconSz);
  }
 
  // ingredient name
  fill(sel ? C.green : C.textFaded);
  textSize(11);
  textStyle(sel ? BOLD : NORMAL);
  textAlign(CENTER, BOTTOM);
  text(ing.name, x + CARD_W / 2, y + CARD_H - 14);
  textStyle(NORMAL);
}
 
 
// --- CO2 SAVED ---
function drawSavedCarbon() {
  if (floatAlpha <= 0) return;
  floatY -= 1;
  floatAlpha -= 3;
  fill(red(C.greenBtn), green(C.greenBtn), blue(C.greenBtn), floatAlpha);
  textSize(20);
  textStyle(BOLD);
  textAlign(CENTER, TOP);
  text(floatText, width / 2, floatY);
  textStyle(NORMAL);
}
 
 
// --- INTERACTIONS ---
function mousePressed() {
  
  // mouse click on button triggers main page
  if (screen === 'landing page') {
    const btnW = 180, btnH = 50;
    const btnX = width / 2 - btnW / 2;
    const btnY = height / 2 + 62;
    if (mouseX > btnX && mouseX < btnX + btnW &&
        mouseY > btnY && mouseY < btnY + btnH) { // is mouse click in button
      screen = 'main';
    }
    return;
  }
 
  // detects when ingredient cards are clicked
  ingredients.forEach((ing, i) => {
    const col = i % CARD_COLS;
    const row = Math.floor(i / CARD_COLS);
    const x = GRID_X_START + col * (CARD_W + CARD_GAP);
    const y = GRID_Y + row * (CARD_H + CARD_GAP);
 
    if (mouseX > x && mouseX < x + CARD_W &&
        mouseY > y && mouseY < y + CARD_H) { 
      if (selected.has(ing.id)) {
        selected.delete(ing.id);
        appliedSwaps.forEach(key => {
          if (key.startsWith(ing.id) || key.endsWith(ing.id)) appliedSwaps.delete(key);
        });
      } else {
        selected.add(ing.id);
      }
      recalcTargets(); // resets all totals to 0
    }
  });
 
  // detects when swap buttons are clicked
  const relevant = swaps.filter(s => selected.has(s.from));
  const totalH = CONTENT_BOT - CONTENT_TOP;
  const equivH = totalH * 0.26;
  const swapLabelY = CONTENT_TOP + equivH + 14;
  const swapH = 58;
  const swapGap = 8;
 
  relevant.forEach((swap, i) => {
    const y = swapLabelY + 22 + i * (swapH + swapGap);
    const isApplied = appliedSwaps.has(swap.from + swap.to);
    if (!isApplied &&
        mouseX > RIGHT_X && mouseX < RIGHT_X + RIGHT_W &&
        mouseY > y && mouseY < y + swapH) {
      const oldCO2 = targetCO2;
      selected.delete(swap.from);
      selected.add(swap.to);
      appliedSwaps.add(swap.from + swap.to);
      recalcTargets();
      const saved = (oldCO2 - targetCO2).toFixed(1);
      floatText = `-${saved} kg CO2e saved`;
      floatY = height / 2;
      floatAlpha = 255;
    }
  });
}
 
 
// --- HELPERS ---

// animates frame by frame display going to target metrics
function recalcTargets() {
  targetCO2 = 0; targetWater = 0; targetLand = 0;
  selected.forEach(id => {
    const ing = ingredients.find(i => i.id === id);
    if (ing) {
      targetCO2 += ing.co2;
      targetWater += ing.water;
      targetLand += ing.land;
    }
  });
}

// animates frame by frame display going to target metrics
function animateMetrics() {
  const speed = 0.12; // 12% delay
  displayCO2 += (targetCO2 - displayCO2) * speed;
  displayWater += (targetWater - displayWater) * speed;
  displayLand += (targetLand - displayLand) * speed;

  // snap back to 0 when near
  if (abs(displayCO2 - targetCO2) < 0.01) displayCO2   = targetCO2;
  if (abs(displayWater - targetWater) < 0.5)  displayWater = targetWater;
  if (abs(displayLand - targetLand) < 0.01) displayLand  = targetLand;
}