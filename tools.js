/* ===============================
   AGROSENSE TOOLS ENGINE
   FOUNDATION + ADVANCED CORE
=============================== */

function getEl(id){
  return document.getElementById(id);
}

function renderBox(id, html){
  const el = getEl(id);
  if(!el) return;
  el.innerHTML = html;
}

function jumpTo(id){
  const el = getEl(id);
  if(el) el.scrollIntoView({behavior:"smooth", block:"start"});
}

function openFarmCulture(){
  window.open("https://huggingface.co/spaces/Chaitu2121/farmculture-ai", "_blank");
}

/* ===============================
   CROP DATABASE
=============================== */

const cropData = {
  rice: {
    family: "cereal",
    waterNeed: "Very High",
    heatTolerance: "Low",
    droughtTolerance: "Low",
    storageStrength: "Medium",
    marketVolatility: "Medium",
    perishability: "Medium",
    demandElasticity: "Medium",
    inputCostIntensity: "High",
    cropDuration: "Medium",
    seed: { min: 8, max: 12, unit: "kg (nursery)" },
    varieties: ["Swarna", "IR 64", "Indrayani", "MTU 1010"],
    fertilizer: "Use balanced NPK. Avoid excess urea. Split nitrogen doses.",
    calendar: "🌧 Sowing: Jun–Jul<br>🌾 Harvest: Oct–Nov<br>⚠️ Monitor pests in Aug–Sep",
    soilTypes: ["loamy", "clay"],
    irrigationMethods: ["canal", "drip", "borewell"],
    investmentRisk: "High",
    expectedYield: "Medium",
    companionCrops: []
  },

  wheat: {
    family: "cereal",
    waterNeed: "Medium",
    heatTolerance: "Medium",
    droughtTolerance: "Medium",
    storageStrength: "High",
    marketVolatility: "Low",
    perishability: "Low",
    demandElasticity: "Low",
    inputCostIntensity: "Medium",
    cropDuration: "Medium",
    seed: { min: 35, max: 45, unit: "kg" },
    varieties: ["HD 2967", "HD 3086", "Lok 1", "GW 322"],
    fertilizer: "Apply basal fertilizer + split urea during irrigation.",
    calendar: "❄️ Sowing: Nov–Dec<br>🌾 Harvest: Mar–Apr",
    soilTypes: ["loamy", "black"],
    irrigationMethods: ["canal", "borewell", "drip"],
    investmentRisk: "Medium",
    expectedYield: "Medium",
    companionCrops: []
  },

  soybean: {
    family: "oilseed",
    waterNeed: "Medium",
    heatTolerance: "Medium",
    droughtTolerance: "Medium",
    storageStrength: "Medium",
    marketVolatility: "Medium",
    perishability: "Low",
    demandElasticity: "Medium",
    inputCostIntensity: "Medium",
    cropDuration: "Medium",
    seed: { min: 25, max: 35, unit: "kg" },
    varieties: ["JS 335", "JS 9560", "MAUS 71", "RKS 18"],
    fertilizer: "Avoid excess urea. Soybean naturally fixes nitrogen.",
    calendar: "🌧 Sowing: Jun–Jul<br>🌾 Harvest: Oct",
    soilTypes: ["black", "loamy"],
    irrigationMethods: ["rain", "borewell"],
    investmentRisk: "Medium",
    expectedYield: "Medium",
    companionCrops: ["maize"]
  },

  cotton: {
    family: "cash crop",
    waterNeed: "Medium",
    heatTolerance: "High",
    droughtTolerance: "Medium",
    storageStrength: "High",
    marketVolatility: "Medium",
    perishability: "Low",
    demandElasticity: "Medium",
    inputCostIntensity: "High",
    cropDuration: "Long",
    seed: { min: 1.2, max: 2.0, unit: "kg" },
    varieties: ["RCH 2 Bt", "Bunny Bt", "Bt Hybrid local"],
    fertilizer: "Too much nitrogen increases pests. Use balanced NPK.",
    calendar: "🌧 Sowing: Jun–Jul<br>🌾 Harvest: Nov–Feb",
    soilTypes: ["black", "loamy"],
    irrigationMethods: ["drip", "borewell", "rain"],
    investmentRisk: "High",
    expectedYield: "Medium",
    companionCrops: ["bajra"]
  },

  maize: {
    family: "cereal",
    waterNeed: "Medium",
    heatTolerance: "Medium",
    droughtTolerance: "Medium",
    storageStrength: "High",
    marketVolatility: "Low",
    perishability: "Low",
    demandElasticity: "Low",
    inputCostIntensity: "Medium",
    cropDuration: "Short",
    seed: { min: 8, max: 10, unit: "kg" },
    varieties: ["HQPM 1", "Deccan 103", "Hybrid local"],
    fertilizer: "Balanced NPK with proper irrigation timing.",
    calendar: "🌧 Sowing: Jun–Jul<br>🌾 Harvest: Sep–Oct",
    soilTypes: ["loamy", "black"],
    irrigationMethods: ["borewell", "canal", "rain"],
    investmentRisk: "Medium",
    expectedYield: "Medium",
    companionCrops: ["soybean"]
  },

  bajra: {
    family: "millet",
    waterNeed: "Low",
    heatTolerance: "High",
    droughtTolerance: "High",
    storageStrength: "Medium",
    marketVolatility: "Low",
    perishability: "Low",
    demandElasticity: "Low",
    inputCostIntensity: "Low",
    cropDuration: "Short",
    seed: { min: 3, max: 4, unit: "kg" },
    varieties: ["HHB 67", "ICTP 8203", "Hybrid local"],
    fertilizer: "Low fertilizer requirement crop.",
    calendar: "🌧 Sowing: Jun–Jul<br>🌾 Harvest: Sep–Oct",
    soilTypes: ["sandy", "loamy", "black"],
    irrigationMethods: ["rain", "limited irrigation"],
    investmentRisk: "Low",
    expectedYield: "Medium",
    companionCrops: ["gram", "tur"]
  },

  jowar: {
    family: "millet",
    waterNeed: "Low",
    heatTolerance: "High",
    droughtTolerance: "High",
    storageStrength: "Medium",
    marketVolatility: "Low",
    perishability: "Low",
    demandElasticity: "Low",
    inputCostIntensity: "Low",
    cropDuration: "Medium",
    seed: { min: 8, max: 10, unit: "kg" },
    varieties: ["Maldandi", "CSV 15", "Hybrid local"],
    fertilizer: "Avoid over-fertilization.",
    calendar: "🌧 Sowing: Jun–Jul<br>🌾 Harvest: Sep–Oct",
    soilTypes: ["sandy", "loamy", "black"],
    irrigationMethods: ["rain", "limited irrigation"],
    investmentRisk: "Low",
    expectedYield: "Medium",
    companionCrops: ["bajra"]
  },

  onion: {
    family: "vegetable",
    waterNeed: "Medium",
    heatTolerance: "Medium",
    droughtTolerance: "Low",
    storageStrength: "Medium",
    marketVolatility: "High",
    perishability: "High",
    demandElasticity: "High",
    inputCostIntensity: "Medium",
    cropDuration: "Medium",
    seed: { min: 3, max: 4, unit: "kg (nursery)" },
    varieties: ["N-53", "Bhima Super", "Bhima Shakti", "Red onion local"],
    fertilizer: "Needs potassium. Avoid heavy urea in early stage.",
    calendar: "❄️ Nursery: Sep–Oct<br>🌱 Transplant: Nov<br>🌾 Harvest: Feb–Apr",
    soilTypes: ["loamy", "black"],
    irrigationMethods: ["drip", "canal", "borewell"],
    investmentRisk: "High",
    expectedYield: "Medium",
    companionCrops: ["tomato"]
  },

  tomato: {
    family: "vegetable",
    waterNeed: "Medium",
    heatTolerance: "Medium",
    droughtTolerance: "Low",
    storageStrength: "Low",
    marketVolatility: "High",
    perishability: "Very High",
    demandElasticity: "High",
    inputCostIntensity: "High",
    cropDuration: "Short",
    seed: { min: 0.08, max: 0.12, unit: "kg (nursery)" },
    varieties: ["Arka Rakshak", "Pusa Rohini", "Hybrid local"],
    fertilizer: "Needs potassium + calcium. Avoid overwatering.",
    calendar: "Nursery: Aug–Sep<br>Transplant: Sep–Oct<br>Harvest: Dec–Feb",
    soilTypes: ["loamy", "black"],
    irrigationMethods: ["drip", "borewell"],
    investmentRisk: "High",
    expectedYield: "Medium",
    companionCrops: ["onion"]
  },

  gram: {
    family: "pulse",
    waterNeed: "Low",
    heatTolerance: "High",
    droughtTolerance: "High",
    storageStrength: "High",
    marketVolatility: "Low",
    perishability: "Low",
    demandElasticity: "Low",
    inputCostIntensity: "Low",
    cropDuration: "Medium",
    seed: { min: 25, max: 35, unit: "kg" },
    varieties: ["JG 11", "Vijay", "Digvijay"],
    fertilizer: "Avoid excess nitrogen. Focus on phosphorus.",
    calendar: "❄️ Sowing: Oct–Nov<br>🌾 Harvest: Feb–Mar",
    soilTypes: ["black", "loamy"],
    irrigationMethods: ["rain", "limited irrigation"],
    investmentRisk: "Low",
    expectedYield: "Medium",
    companionCrops: ["bajra"]
  },

  tur: {
    family: "pulse",
    waterNeed: "Low",
    heatTolerance: "High",
    droughtTolerance: "High",
    storageStrength: "High",
    marketVolatility: "Medium",
    perishability: "Low",
    demandElasticity: "Low",
    inputCostIntensity: "Low",
    cropDuration: "Long",
    seed: { min: 4, max: 6, unit: "kg" },
    varieties: ["BSMR 736", "Asha", "Maruti"],
    fertilizer: "Use compost + balanced fertilizer. Avoid waterlogging.",
    calendar: "🌧 Sowing: Jun–Jul<br>🌾 Harvest: Dec–Feb",
    soilTypes: ["black", "loamy"],
    irrigationMethods: ["rain", "limited irrigation"],
    investmentRisk: "Low",
    expectedYield: "Medium",
    companionCrops: ["bajra"]
  }
};

/* ===============================
   FILTER CROPS
=============================== */

function filterCrops(){
  const search = getEl("cropSearch")?.value.toLowerCase().trim();
  const cropSelect = getEl("crop");
  if(!cropSelect) return;

  const options = cropSelect.options;
  for(let i = 0; i < options.length; i++){
    if(i === 0) continue;
    const txt = options[i].text.toLowerCase();
    options[i].hidden = !txt.includes(search || "");
  }
}

/* ===============================
   QUICK ADVICE
=============================== */

function showQuickAdvice(){
  const season = getEl("season")?.value;
  const crop = getEl("crop")?.value;
  const soil = getEl("soil")?.value;
  const water = getEl("water")?.value;

  if(!season || !crop || !soil || !water){
    renderBox("quickAdvice", "Select season, crop, soil and water source to receive guidance.");
    return;
  }

  let advice = "Current conditions look manageable. Monitor weather and soil moisture.";
  const profile = cropData[crop];

  if(water === "rain"){
    advice = "Rainfed farming increases uncertainty. Prefer drought-tolerant crops.";
  }

  if(soil === "sandy"){
    advice = "Sandy soil loses moisture faster. Use mulching and planned irrigation.";
  }

  if(profile && profile.waterNeed === "Very High" && water === "rain"){
    advice = "High water crop selected without reliable irrigation.";
  }

  renderBox("quickAdvice", advice);
}

/* ===============================
   RISK ANALYSIS
=============================== */

function analyzeRisk(){
  const season = getEl("season")?.value;
  const crop = getEl("crop")?.value;
  const soil = getEl("soil")?.value;
  const water = getEl("water")?.value;

  if(!season || !crop || !soil || !water){
    renderBox("riskResult", "Please select season, crop, soil and water source.");
    return;
  }

  let score = 85;
  const profile = cropData[crop];

  if(water === "rain") score -= 28;
  if(water === "farmpond") score -= 10;
  if(water === "drip") score += 4;
  if(water === "canal") score += 2;

  if(soil === "sandy") score -= 16;
  if(soil === "loamy") score += 2;

  if(season === "summer") score -= 20;
  if(season === "winter") score += 2;

  if(profile?.investmentRisk === "High") score -= 12;
  if(profile?.investmentRisk === "Low") score += 8;

  if(profile?.waterNeed === "Very High" && water === "rain") score -= 20;

  score = Math.max(0, Math.min(100, score));

  let tag = "Good";
  let cls = "good";
  if(score < 70){ tag = "Medium"; cls = "mid"; }
  if(score < 45){ tag = "High Risk"; cls = "bad"; }

  let rec = "Conditions are acceptable. Continue monitoring.";
  if(score < 70) rec = "Moderate exposure. Improve irrigation and soil planning.";
  if(score < 45) rec = "High exposure. Consider changing crop or irrigation strategy.";

  renderBox(
    "riskResult",
    `
    <b>Farmer Decision Score:</b>
    <span class="pill ${cls}">${score}/100 (${tag})</span>
    <br><br>
    <b>Recommendation:</b><br>${rec}
    `
  );

  showQuickAdvice();
}

/* ===============================
   WATER BUDGET
=============================== */

function calcWater(){
  const crop = getEl("w_crop")?.value;
  const acres = parseFloat(getEl("w_acres")?.value);
  const source = getEl("w_source")?.value;
  const out = getEl("waterResult");

  if(!crop || !acres || acres <= 0 || !source){
    renderBox("waterResult", "Select crop, enter acres, and select water source.");
    return;
  }

  const need = cropData[crop]?.waterNeed || "Medium";
  let risk = "Low";

  if(need === "Very High" && (source === "rain" || source === "well")) risk = "High";
  if(need === "High" && source === "rain") risk = "High";
  if(need === "Medium" && source === "rain") risk = "Medium";
  if(source === "drip") risk = "Low";

  renderBox(
    "waterResult",
    `
    <b>Crop Water Need:</b>
    <span class="pill mid">${need}</span>
    <br><br>

    <b>Water Source:</b>
    <span class="pill good">${source}</span>
    <br><br>

    <b>Land:</b> ${acres} acre(s)
    <br><br>

    <b>Water Risk:</b>
    <span class="pill ${risk === "High" ? "bad" : (risk === "Medium" ? "mid" : "good")}">${risk}</span>
    <br><br>

    <b>Tip:</b><br>
    Plan irrigation carefully and avoid overwatering.
    `
  );
}

/* ===============================
   SEED CALCULATOR
=============================== */

function calcSeed(){
  const crop = getEl("seed_crop")?.value;
  const acres = parseFloat(getEl("seed_acres")?.value);
  const out = getEl("seedResult");

  if(!crop || !acres || acres <= 0){
    renderBox("seedResult", "Select crop and enter acres.");
    return;
  }

  const seed = cropData[crop]?.seed;
  if(!seed){
    renderBox("seedResult", "Seed information unavailable.");
    return;
  }

  const min = (seed.min * acres).toFixed(2);
  const max = (seed.max * acres).toFixed(2);
  const varieties = cropData[crop]?.varieties || ["Local best variety"];

  renderBox(
    "seedResult",
    `
    <b>Estimated Seed Requirement:</b><br>
    ${min} – ${max} ${seed.unit}
    <br><br>

    <b>Suggested Varieties:</b><br>
    ${varieties.map(v => `✅ ${v}`).join("<br>")}
    `
  );
}

/* ===============================
   CROP CALENDAR
=============================== */

function showCalendar(){
  const crop = getEl("cal_crop")?.value;
  if(!crop){
    renderBox("calendarResult", "Select crop first.");
    return;
  }

  renderBox("calendarResult", cropData[crop]?.calendar || "Calendar unavailable.");
}

/* ===============================
   RESCUE MODE
=============================== */

function rescue(type){
  const rescueData = {
    yellow: `<b>🍂 Leaves Yellow</b><br><br>1) Check irrigation.<br>2) Check soil moisture.<br>3) Add compost.<br>4) Nitrogen deficiency possible.`,
    dry: `<b>🔥 Plant Drying</b><br><br>1) Irrigate if dry.<br>2) Use mulching.<br>3) Avoid fertilizer in dry soil.<br>4) Check root health.`,
    slow: `<b>🐌 Slow Growth</b><br><br>1) Check spacing.<br>2) Soil compaction may exist.<br>3) Add compost + micronutrients.<br>4) Avoid excess urea.`,
    pest: `<b>🐛 Pest Attack</b><br><br>1) Identify pest.<br>2) Neem spray first.<br>3) Remove infected leaves.<br>4) Seek local expert if heavy.`
  };

  renderBox("rescueResult", rescueData[type] || "Select a problem type.");
}

/* ===============================
   FERTILIZER GUIDE
=============================== */

function fertGuide(){
  const crop = getEl("f_crop")?.value;
  if(!crop){
    renderBox("fertResult", "Select crop first.");
    return;
  }

  renderBox(
    "fertResult",
    `
    <b>Fertilizer Guidance:</b><br><br>
    ${cropData[crop]?.fertilizer || "Guide unavailable."}
    <br><br>
    <b>Important:</b><br>
    Avoid fertilizer application in dry soil.
    `
  );
}

/* ===============================
   NOTES
=============================== */

function saveNotes(){
  const notes = getEl("notesBox")?.value || "";
  localStorage.setItem("agrosense_notes", notes);
  renderBox("notesStatus", "Notes saved locally on this device.");
}

function clearNotes(){
  localStorage.removeItem("agrosense_notes");
  const box = getEl("notesBox");
  if(box) box.value = "";
  renderBox("notesStatus", "Saved notes removed.");
}

/* ===============================
   INIT
=============================== */

window.addEventListener("load", () => {
  try{
    const saved = localStorage.getItem("agrosense_notes");
    const box = getEl("notesBox");
    if(saved && box){
      box.value = saved;
      renderBox("notesStatus", "Loaded saved notes from this device.");
    }
  }catch(e){
    console.error(e);
  }
});
