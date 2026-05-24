/* =========================================
   AGROSENSE AI — TOOLS ENGINE
========================================= */

/* -----------------------------------------
   Shared Helpers
----------------------------------------- */

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

  if(!el) return;

  el.scrollIntoView({
    behavior: "smooth",
    block: "start"
  });

}

function openFarmCulture(){

  window.open(
    "https://huggingface.co/spaces/Chaitu2121/farmculture-ai",
    "_blank"
  );

}

/* =========================================
   CENTRAL CROP DATABASE
========================================= */

const cropData = {

  rice: {
    waterNeed: "Very High",
    seed: {min: 8, max: 12, unit: "kg (nursery)"},
    varieties: ["Swarna", "IR 64", "Indrayani"],
    fertilizer:
      "Use balanced NPK. Avoid excess urea. Split nitrogen doses.",
    calendar:
      "🌧 Sowing: Jun–Jul<br>🌾 Harvest: Oct–Nov<br>⚠️ Monitor pests in Aug–Sep"
  },

  wheat: {
    waterNeed: "Medium",
    seed: {min: 35, max: 45, unit: "kg"},
    varieties: ["HD 2967", "HD 3086", "Lok 1"],
    fertilizer:
      "Apply basal fertilizer + split urea during irrigation.",
    calendar:
      "❄️ Sowing: Nov–Dec<br>🌾 Harvest: Mar–Apr"
  },

  soybean: {
    waterNeed: "Low",
    seed: {min: 25, max: 35, unit: "kg"},
    varieties: ["JS 335", "JS 9560", "MAUS 71"],
    fertilizer:
      "Avoid excess urea. Soybean naturally fixes nitrogen.",
    calendar:
      "🌧 Sowing: Jun–Jul<br>🌾 Harvest: Oct"
  },

  cotton: {
    waterNeed: "Medium",
    seed: {min: 1.2, max: 2, unit: "kg"},
    varieties: ["RCH 2 Bt", "Bunny Bt"],
    fertilizer:
      "Too much nitrogen increases pest pressure.",
    calendar:
      "🌧 Sowing: Jun–Jul<br>🌾 Harvest: Nov–Feb"
  },

  maize: {
    waterNeed: "Medium",
    seed: {min: 8, max: 10, unit: "kg"},
    varieties: ["HQPM 1", "Deccan 103"],
    fertilizer:
      "Balanced NPK with proper irrigation timing.",
    calendar:
      "🌧 Sowing: Jun–Jul<br>🌾 Harvest: Sep–Oct"
  },

  bajra: {
    waterNeed: "Low",
    seed: {min: 3, max: 4, unit: "kg"},
    varieties: ["HHB 67", "ICTP 8203"],
    fertilizer:
      "Low fertilizer requirement crop.",
    calendar:
      "🌧 Sowing: Jun–Jul<br>🌾 Harvest: Sep–Oct"
  },

  jowar: {
    waterNeed: "Low",
    seed: {min: 8, max: 10, unit: "kg"},
    varieties: ["Maldandi", "CSV 15"],
    fertilizer:
      "Avoid over-fertilization.",
    calendar:
      "🌧 Sowing: Jun–Jul<br>🌾 Harvest: Sep–Oct"
  }

};

/* =========================================
   SEARCH FILTER
========================================= */

function filterCrops(){

  const search =
    getEl("cropSearch")
    ?.value
    .toLowerCase()
    .trim();

  const cropSelect =
    getEl("crop");

  if(!cropSelect || !search) return;

  const options = cropSelect.options;

  for(let i = 0; i < options.length; i++){

    if(i === 0) continue;

    const txt =
      options[i].text.toLowerCase();

    options[i].hidden =
      !txt.includes(search);

  }

}

/* =========================================
   QUICK ADVICE
========================================= */

function showQuickAdvice(){

  const season = getEl("season")?.value;
  const crop = getEl("crop")?.value;
  const soil = getEl("soil")?.value;
  const water = getEl("water")?.value;

  if(
    !season ||
    !crop ||
    !soil ||
    !water
  ){

    renderBox(
      "quickAdvice",
      "Select season, crop, soil and water source to receive guidance."
    );

    return;

  }

  let advice =
    "Current conditions appear manageable. Monitor weather and soil moisture.";

  if(water === "rain"){

    advice =
      "Rainfed farming increases uncertainty. Prefer drought-tolerant crops.";

  }

  if(soil === "sandy"){

    advice =
      "Sandy soil loses moisture faster. Use mulching and planned irrigation.";

  }

  if(
    crop === "rice" ||
    crop === "sugarcane"
  ){

    if(water === "rain"){

      advice =
        "High water crop selected without reliable irrigation.";

    }

  }

  renderBox(
    "quickAdvice",
    advice
  );

}

/* =========================================
   RISK ANALYSIS
========================================= */

function analyzeRisk(){

  const season = getEl("season")?.value;
  const crop = getEl("crop")?.value;
  const soil = getEl("soil")?.value;
  const water = getEl("water")?.value;

  if(
    !season ||
    !crop ||
    !soil ||
    !water
  ){

    renderBox(
      "riskResult",
      "Please select season, crop, soil and water source."
    );

    return;

  }

  let score = 85;

  /* Water */

  if(water === "rain") score -= 28;
  if(water === "farmpond") score -= 10;
  if(water === "drip") score += 4;

  /* Soil */

  if(soil === "sandy") score -= 16;
  if(soil === "loamy") score += 2;

  /* Season */

  if(season === "summer") score -= 20;
  if(season === "winter") score += 2;

  /* Crop */

  if(crop === "sugarcane") score -= 25;
  if(crop === "rice") score -= 18;

  if(
    crop === "bajra" ||
    crop === "jowar"
  ){

    score += 6;

  }

  score =
    Math.max(
      0,
      Math.min(100, score)
    );

  let tag = "Good";
  let cls = "good";

  if(score < 70){
    tag = "Medium";
    cls = "mid";
  }

  if(score < 45){
    tag = "High Risk";
    cls = "bad";
  }

  let recommendation =
    "Conditions are acceptable. Continue monitoring.";

  if(score < 70){

    recommendation =
      "Moderate exposure. Improve irrigation and soil planning.";

  }

  if(score < 45){

    recommendation =
      "High exposure. Consider changing crop or irrigation strategy.";

  }

  renderBox(
    "riskResult",
    `
    <b>Farmer Decision Score:</b>
    <span class="pill ${cls}">
      ${score}/100 (${tag})
    </span>

    <br><br>

    <b>Recommendation:</b><br>
    ${recommendation}
    `
  );

  showQuickAdvice();

}

/* =========================================
   WATER BUDGET
========================================= */

function calcWater(){

  const crop =
    getEl("w_crop")?.value;

  const acres =
    parseFloat(
      getEl("w_acres")?.value
    );

  const source =
    getEl("w_source")?.value;

  if(
    !crop ||
    !acres ||
    !source
  ){

    renderBox(
      "waterResult",
      "Complete all water analysis fields."
    );

    return;

  }

  const need =
    cropData[crop]?.waterNeed || "Medium";

  let risk = "Low";

  if(
    need === "Very High" &&
    (
      source === "rain" ||
      source === "well"
    )
  ){

    risk = "High";

  }

  if(
    need === "Medium" &&
    source === "rain"
  ){

    risk = "Medium";

  }

  renderBox(
    "waterResult",
    `
    <b>Crop Water Need:</b>
    ${need}

    <br><br>

    <b>Land:</b>
    ${acres} acre(s)

    <br><br>

    <b>Water Risk:</b>
    ${risk}
    `
  );

}

/* =========================================
   SEED CALCULATOR
========================================= */

function calcSeed(){

  const crop =
    getEl("seed_crop")?.value;

  const acres =
    parseFloat(
      getEl("seed_acres")?.value
    );

  if(
    !crop ||
    !acres
  ){

    renderBox(
      "seedResult",
      "Select crop and enter land area."
    );

    return;

  }

  const seed =
    cropData[crop]?.seed;

  if(!seed){

    renderBox(
      "seedResult",
      "Seed information unavailable."
    );

    return;

  }

  const min =
    (seed.min * acres).toFixed(2);

  const max =
    (seed.max * acres).toFixed(2);

  const varieties =
    cropData[crop]?.varieties || [];

  renderBox(
    "seedResult",
    `
    <b>Estimated Seed Requirement:</b><br>
    ${min} – ${max} ${seed.unit}

    <br><br>

    <b>Suggested Varieties:</b><br>
    ${varieties.join("<br>")}
    `
  );

}

/* =========================================
   CROP CALENDAR
========================================= */

function showCalendar(){

  const crop =
    getEl("cal_crop")?.value;

  if(!crop){

    renderBox(
      "calendarResult",
      "Select crop first."
    );

    return;

  }

  renderBox(
    "calendarResult",
    cropData[crop]?.calendar ||
    "Calendar unavailable."
  );

}

/* =========================================
   RESCUE MODE
========================================= */

function rescue(type){

  const rescueData = {

    yellow:
      "Check irrigation and nitrogen balance.",

    dry:
      "Check soil moisture and root condition.",

    slow:
      "Inspect spacing, nutrients and soil compaction.",

    pest:
      "Inspect pest type and isolate affected area."

  };

  renderBox(
    "rescueResult",
    rescueData[type] ||
    "Select a problem type."
  );

}

/* =========================================
   FERTILIZER GUIDE
========================================= */

function fertGuide(){

  const crop =
    getEl("f_crop")?.value;

  if(!crop){

    renderBox(
      "fertResult",
      "Select crop first."
    );

    return;

  }

  renderBox(
    "fertResult",
    `
    <b>Fertilizer Guidance:</b><br><br>

    ${cropData[crop]?.fertilizer ||
    "Guide unavailable."}

    <br><br>

    <b>Important:</b><br>
    Avoid fertilizer application in dry soil.
    `
  );

}

/* =========================================
   NOTES SYSTEM
========================================= */

function saveNotes(){

  const notes =
    getEl("notesBox")?.value || "";

  localStorage.setItem(
    "agrosense_notes",
    notes
  );

  renderBox(
    "notesStatus",
    "Notes saved locally on this device."
  );

}

function clearNotes(){

  localStorage.removeItem(
    "agrosense_notes"
  );

  const box =
    getEl("notesBox");

  if(box){
    box.value = "";
  }

  renderBox(
    "notesStatus",
    "Saved notes removed."
  );

}

/* =========================================
   INITIALIZATION
========================================= */

window.addEventListener(
  "load",
  () => {

    try{

      const saved =
        localStorage.getItem(
          "agrosense_notes"
        );

      const box =
        getEl("notesBox");

      if(saved && box){

        box.value = saved;

        renderBox(
          "notesStatus",
          "Loaded saved notes from this device."
        );

      }

    }
    catch(error){

      console.error(error);

    }

  }
);
