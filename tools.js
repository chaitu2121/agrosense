/* AgroSense Tools - STEP 4 (Profile + Report + Share + History) */

let CURRENT_LANG = "en";

/* -----------------------------
   Language
------------------------------*/
const LANG = {
  en: {
    status: "Current language: <b>English</b>",
    riskTitle: "🌱 Crop Failure Risk Predictor",
    riskSub: "Check risk before sowing to protect money and water.",
    season: "Season",
    crop: "Crop",
    soil: "Soil Type",
    water: "Water Source",
    analyze: "🚀 Analyze Risk"
  },
  mr: {
    status: "भाषा: <b>मराठी</b> (Basic)",
    riskTitle: "🌱 पिक नुकसान धोका तपासणी",
    riskSub: "पेरणी आधी धोका तपासा. पैसा आणि पाणी वाचवा.",
    season: "हंगाम",
    crop: "पीक",
    soil: "माती प्रकार",
    water: "पाण्याचा स्रोत",
    analyze: "🚀 धोका तपासा"
  }
};

function jumpTo(id){
  const el = document.getElementById(id);
  if(el) el.scrollIntoView({behavior:"smooth", block:"start"});
}

function setLang(lang){
  CURRENT_LANG = lang;
  document.getElementById("langStatus").innerHTML = LANG[lang].status;

  document.getElementById("t_risk_title").innerHTML = LANG[lang].riskTitle;
  document.getElementById("t_risk_sub").innerHTML = LANG[lang].riskSub;

  document.getElementById("t_season_label").innerHTML = LANG[lang].season;
  document.getElementById("t_crop_label").innerHTML = LANG[lang].crop;
  document.getElementById("t_soil_label").innerHTML = LANG[lang].soil;
  document.getElementById("t_water_label").innerHTML = LANG[lang].water;
}

function openFarmCulture(){
  window.open("https://huggingface.co/spaces/Chaitu2121/farmculture-ai", "_blank");
}

/* -----------------------------
   Crop Search
------------------------------*/
function filterCrops(){
  const search = document.getElementById("cropSearch").value.toLowerCase();
  const cropSelect = document.getElementById("crop");
  const options = cropSelect.options;

  for(let i=0; i<options.length; i++){
    const txt = options[i].text.toLowerCase();
    if(i === 0){
      options[i].style.display = "";
      continue;
    }
    options[i].style.display = txt.includes(search) ? "" : "none";
  }
}

/* -----------------------------
   Quick Advice
------------------------------*/
function showQuickAdvice(){
  const season = document.getElementById("season").value;
  const crop = document.getElementById("crop").value;
  const soil = document.getElementById("soil").value;
  const water = document.getElementById("water").value;
  const box = document.getElementById("quickAdvice");

  if(!season || !crop || !soil || !water){
    box.innerHTML = "Select season, crop, soil and water source to see quick advice.";
    return;
  }

  let advice = "✅ Good selection. Follow weather and soil moisture before sowing.";

  if(water === "rain"){
    advice = "⚠️ Rainfed only: Choose drought-resistant crops. Avoid long-duration crops.";
  }

  if(soil === "sandy"){
    advice = "⚠️ Sandy soil loses water fast. Use mulching + frequent irrigation.";
  }

  if(crop === "sugarcane" || crop === "banana" || crop === "rice"){
    if(water === "rain"){
      advice = "❌ High risk: This crop needs high water. Rainfed is dangerous.";
    } else {
      advice = "✅ High water crop. Ensure irrigation + fertilizer planning.";
    }
  }

  if(season === "summer" && water === "rain"){
    advice = "❌ Summer + Rainfed is extremely risky. Change crop or add irrigation.";
  }

  box.innerHTML = advice;
}

/* -----------------------------
   Risk Predictor
------------------------------*/
function analyzeRisk(){
  const season = document.getElementById("season").value;
  const crop = document.getElementById("crop").value;
  const soil = document.getElementById("soil").value;
  const water = document.getElementById("water").value;
  const out = document.getElementById("riskResult");

  if(!season || !crop || !soil || !water){
    out.innerHTML = "⚠️ Please select Season, Crop, Soil and Water Source.";
    return;
  }

  let score = 85;

  // water
  if(water === "rain") score -= 28;
  if(water === "farmpond") score -= 10;
  if(water === "drip") score += 4;

  // soil
  if(soil === "sandy") score -= 16;
  if(soil === "loamy") score += 2;

  // season
  if(season === "summer") score -= 20;
  if(season === "winter") score += 2;

  // crop
  if(crop === "sugarcane") score -= 25;
  if(crop === "rice") score -= 18;
  if(crop === "banana") score -= 20;
  if(crop === "bajra" || crop === "jowar" || crop === "ragi") score += 6;

  if(score > 100) score = 100;
  if(score < 0) score = 0;

  let tag = "Good";
  let cls = "good";
  if(score < 70){ tag = "Medium"; cls = "mid"; }
  if(score < 45){ tag = "High Risk"; cls = "bad"; }

  let rec = "✅ You can proceed, but check weather and soil moisture before sowing.";
  if(score < 70) rec = "⚠️ Risk is medium. Improve water plan, mulching, and choose safer crop.";
  if(score < 45) rec = "❌ High risk. Change crop OR improve irrigation before sowing.";

  out.innerHTML = `
    <b>Farmer Decision Score:</b> <span class="pill ${cls}">${score}/100 (${tag})</span><br><br>
    <b>Recommendation:</b><br>${rec}
  `;

  showQuickAdvice();
  saveHistory("Risk Predictor", `Score: ${score}/100 (${tag}) | Crop: ${crop} | Season: ${season}`);
  scrollToBox("riskResult");
}

/* -----------------------------
   Water Budget Tool
------------------------------*/
function calcWater(){
  const crop = document.getElementById("w_crop").value;
  const acres = parseFloat(document.getElementById("w_acres").value);
  const source = document.getElementById("w_source").value;
  const out = document.getElementById("waterResult");

  if(!crop || !acres || acres <= 0 || !source){
    out.innerHTML = "⚠️ Select crop, enter acres, and select water source.";
    return;
  }

  const cropNeed = {
    sugarcane: "Very High",
    rice: "Very High",
    banana: "High",
    onion: "Medium",
    tomato: "Medium",
    cotton: "Medium",
    wheat: "Medium",
    soybean: "Low",
    gram: "Low",
    bajra: "Low",
    jowar: "Low"
  };

  const need = cropNeed[crop] || "Medium";

  let risk = "Low";
  if(need === "Very High" && (source === "rain" || source === "well")) risk = "High";
  if(need === "High" && source === "rain") risk = "High";
  if(need === "Medium" && source === "rain") risk = "Medium";
  if(source === "drip") risk = "Low";

  let tip = "✅ Plan irrigation schedule and avoid overwatering.";
  if(risk === "Medium") tip = "⚠️ Add mulching + drip/sprinkler to reduce water loss.";
  if(risk === "High") tip = "❌ High risk. Change crop or arrange reliable irrigation.";

  out.innerHTML = `
    <b>Crop Water Need:</b> <span class="pill mid">${need}</span><br>
    <b>Water Source:</b> <span class="pill good">${source}</span><br>
    <b>Land:</b> ${acres} acre(s)<br><br>
    <b>Water Risk:</b> <span class="pill ${risk === "High" ? "bad" : (risk === "Medium" ? "mid" : "good")}">${risk}</span><br><br>
    <b>Tip:</b><br>${tip}
  `;

  saveHistory("Water Budget", `Crop: ${crop} | Need: ${need} | Risk: ${risk} | Acres: ${acres}`);
  scrollToBox("waterResult");
}

/* -----------------------------
   Seed Rate + Varieties
------------------------------*/
function calcSeed(){
  const crop = document.getElementById("seed_crop").value;
  const acres = parseFloat(document.getElementById("seed_acres").value);
  const out = document.getElementById("seedResult");

  if(!crop || !acres || acres <= 0){
    out.innerHTML = "⚠️ Select crop and enter acres.";
    return;
  }

  const seedRate = {
    wheat: {min: 35, max: 45, unit:"kg"},
    soybean: {min: 25, max: 35, unit:"kg"},
    gram: {min: 25, max: 35, unit:"kg"},
    tur: {min: 4, max: 6, unit:"kg"},
    bajra: {min: 3, max: 4, unit:"kg"},
    jowar: {min: 8, max: 10, unit:"kg"},
    rice: {min: 8, max: 12, unit:"kg (nursery)"},
    cotton: {min: 1.2, max: 2.0, unit:"kg"},
    maize: {min: 8, max: 10, unit:"kg"},
    onion: {min: 3, max: 4, unit:"kg (nursery)"},
    tomato: {min: 0.08, max: 0.12, unit:"kg (nursery)"}
  };

  const varieties = {
    wheat: ["HD 2967", "HD 3086", "Lok 1", "GW 322"],
    soybean: ["JS 335", "JS 9560", "MAUS 71", "RKS 18"],
    cotton: ["Bt Hybrid (local)", "RCH 2 Bt", "Bunny Bt"],
    rice: ["Swarna", "IR 64", "Indrayani", "Basmati (if market)"],
    gram: ["JG 11", "Vijay", "Digvijay"],
    tur: ["BSMR 736", "Asha", "Maruti"],
    maize: ["HQPM 1", "Deccan 103", "Hybrid (local)"],
    onion: ["N-53", "Bhima Super", "Bhima Shakti"],
    tomato: ["Arka Rakshak", "Pusa Rohini", "Hybrid (local)"],
    bajra: ["HHB 67", "ICTP 8203", "Hybrid (local)"],
    jowar: ["Maldandi", "CSV 15", "Hybrid (local)"]
  };

  const r = seedRate[crop];
  if(!r){
    out.innerHTML = "⚠️ Seed data not available for this crop yet.";
    return;
  }

  const minTotal = (r.min * acres).toFixed(2);
  const maxTotal = (r.max * acres).toFixed(2);

  const v = varieties[crop] || ["Local best variety"];

  out.innerHTML = `
    <b>Seed Needed:</b><br>
    🌱 ${minTotal} – ${maxTotal} ${r.unit}<br><br>

    <b>Recommended Seed Varieties:</b><br>
    ✅ ${v.slice(0,4).join("<br>✅ ")}<br><br>

    <b>Money-Saving Tip:</b><br>
    Buy seed only from trusted shop + check packing date.
  `;

  saveHistory("Seed Calculator", `Crop: ${crop} | Acres: ${acres} | Seed: ${minTotal}-${maxTotal} ${r.unit}`);
  scrollToBox("seedResult");
}

/* -----------------------------
   Crop Calendar
------------------------------*/
function showCalendar(){
  const crop = document.getElementById("cal_crop").value;
  const out = document.getElementById("calendarResult");

  if(!crop){
    out.innerHTML = "⚠️ Select crop first.";
    return;
  }

  const cal = {
    rice: "🌧 Sowing: Jun–Jul<br>🌾 Harvest: Oct–Nov<br>⚠️ Critical: Water + pest in Aug–Sep",
    wheat: "❄️ Sowing: Nov–Dec<br>🌾 Harvest: Mar–Apr<br>⚠️ Critical: Irrigation in Jan–Feb",
    soybean: "🌧 Sowing: Jun–Jul<br>🌾 Harvest: Oct<br>⚠️ Critical: Fungus risk in Aug",
    cotton: "🌧 Sowing: Jun–Jul<br>🌾 Harvest: Nov–Feb<br>⚠️ Critical: Pest control in Aug–Oct",
    onion: "❄️ Nursery: Sep–Oct<br>🌱 Transplant: Nov<br>🌾 Harvest: Feb–Apr",
    gram: "❄️ Sowing: Oct–Nov<br>🌾 Harvest: Feb–Mar<br>⚠️ Critical: Avoid excess water",
    tur: "🌧 Sowing: Jun–Jul<br>🌾 Harvest: Dec–Feb<br>⚠️ Critical: Flowering stage",
    bajra: "🌧 Sowing: Jun–Jul<br>🌾 Harvest: Sep–Oct<br>✅ Best for low water",
    jowar: "🌧 Sowing: Jun–Jul<br>🌾 Harvest: Sep–Oct<br>✅ Best for drought",
    sugarcane: "🌱 Planting: Jan–Mar OR Oct–Nov<br>🌾 Harvest: 10–14 months<br>⚠️ Needs heavy water"
  };

  out.innerHTML = cal[crop] || "Calendar not available.";
  saveHistory("Crop Calendar", `Crop: ${crop}`);
  scrollToBox("calendarResult");
}

/* -----------------------------
   Rescue Mode
------------------------------*/
function rescue(type){
  const out = document.getElementById("rescueResult");

  const data = {
    yellow: `
      <b>🍂 Leaves Yellow (Safe steps)</b><br><br>
      1) Check water (overwatering also causes yellow).<br>
      2) Check soil moisture before irrigation.<br>
      3) Add organic compost if soil is weak.<br>
      4) If new leaves yellow → possible nitrogen deficiency.
    `,
    dry: `
      <b>🔥 Plant Drying</b><br><br>
      1) Irrigate immediately if soil is dry.<br>
      2) Use mulching to stop water loss.<br>
      3) Avoid fertilizer in dry soil.<br>
      4) Check for root rot if soil is wet but plant is dying.
    `,
    slow: `
      <b>🐌 Slow Growth</b><br><br>
      1) Check seed quality and spacing.<br>
      2) Check if soil is too hard (needs loosening).<br>
      3) Add compost + micro-nutrients.<br>
      4) Avoid too much urea.
    `,
    pest: `
      <b>🐛 Pest Attack</b><br><br>
      1) Identify pest (leaf curl, holes, insects).<br>
      2) Use neem spray first (safe).<br>
      3) Remove infected leaves.<br>
      4) If heavy attack → consult local agriculture officer.
    `
  };

  out.innerHTML = data[type] || "Select a problem.";
  saveHistory("Rescue Mode", `Problem: ${type}`);
  scrollToBox("rescueResult");
}

/* -----------------------------
   Fertilizer Guide
------------------------------*/
function fertGuide(){
  const crop = document.getElementById("f_crop").value;
  const out = document.getElementById("fertResult");

  if(!crop){
    out.innerHTML = "⚠️ Select crop first.";
    return;
  }

  const guide = {
    rice: "Use balanced NPK. Avoid excess urea. Split dose in 2–3 times.",
    wheat: "Apply basal dose at sowing + 2 irrigations with split urea.",
    cotton: "Too much nitrogen increases pests. Use balanced NPK.",
    soybean: "Do NOT overuse urea. Soybean fixes nitrogen naturally.",
    onion: "Needs potassium. Avoid heavy urea in early stage.",
    tomato: "Needs potassium + calcium. Avoid overwatering.",
    gram: "Avoid excess nitrogen. Focus on phosphorus.",
    tur: "Use compost + balanced fertilizer. Avoid waterlogging.",
    bajra: "Low fertilizer crop. Compost is enough for many cases.",
    jowar: "Low fertilizer crop. Avoid overuse."
  };

  out.innerHTML = `
    <b>🧪 Fertilizer Guide (${crop})</b><br><br>
    ${guide[crop] || "No guide available."}<br><br>
    <b>Safety:</b><br>
    ⚠️ Never apply fertilizer in dry soil. Irrigate first.
  `;

  saveHistory("Fertilizer Guide", `Crop: ${crop}`);
  scrollToBox("fertResult");
}

/* -----------------------------
   Notes (Local Storage)
------------------------------*/
function saveNotes(){
  const text = document.getElementById("notesBox").value;
  localStorage.setItem("agrosense_notes", text);
  document.getElementById("notesStatus").innerHTML = "✅ Notes saved on this phone.";
  saveHistory("Notes", "Saved notes");
}

function clearNotes(){
  localStorage.removeItem("agrosense_notes");
  document.getElementById("notesBox").value = "";
  document.getElementById("notesStatus").innerHTML = "🗑 Notes cleared.";
  saveHistory("Notes", "Cleared notes");
}

/* -----------------------------
   Step 4: Profile
------------------------------*/
function saveProfile(){
  const p = {
    name: document.getElementById("p_name").value.trim(),
    place: document.getElementById("p_place").value.trim(),
    acres: document.getElementById("p_acres").value.trim(),
    maincrop: document.getElementById("p_maincrop").value.trim(),
  };
  localStorage.setItem("agrosense_profile", JSON.stringify(p));
  document.getElementById("profileStatus").innerHTML = "✅ Profile saved on this phone.";
  saveHistory("Profile", `Saved: ${p.name || "Farmer"} (${p.place || "location"})`);
}

function loadProfile(){
  try{
    const raw = localStorage.getItem("agrosense_profile");
    if(!raw) return;
    const p = JSON.parse(raw);

    document.getElementById("p_name").value = p.name || "";
    document.getElementById("p_place").value = p.place || "";
    document.getElementById("p_acres").value = p.acres || "";
    document.getElementById("p_maincrop").value = p.maincrop || "";

    document.getElementById("profileStatus").innerHTML = "✅ Loaded saved profile from this phone.";
  }catch(e){}
}

/* -----------------------------
   Step 4: Report
------------------------------*/
function getSelectedText(selectId){
  const sel = document.getElementById(selectId);
  if(!sel) return "";
  const idx = sel.selectedIndex;
  if(idx < 0) return "";
  return sel.options[idx].text || sel.value || "";
}

function generateReport(){
  const box = document.getElementById("reportBox");

  const profile = getProfile();

  const season = getSelectedText("season");
  const crop = getSelectedText("crop");
  const soil = getSelectedText("soil");
  const water = getSelectedText("water");

  const risk = document.getElementById("riskResult").innerText.trim();
  const quick = document.getElementById("quickAdvice").innerText.trim();

  const waterRes = document.getElementById("waterResult").innerText.trim();
  const seedRes = document.getElementById("seedResult").innerText.trim();
  const calRes = document.getElementById("calendarResult").innerText.trim();
  const fertRes = document.getElementById("fertResult").innerText.trim();

  const date = new Date().toLocaleString();

  box.innerHTML = `
    <b>🧾 AgroSense Farmer Report</b><br>
    <span style="color:#51605a;">Generated: ${date}</span><br><br>

    <b>👤 Farmer:</b> ${escapeHtml(profile.name)}<br>
    <b>📍 Location:</b> ${escapeHtml(profile.place)}<br>
    <b>🌾 Land:</b> ${escapeHtml(profile.acres)} acres<br>
    <b>🌱 Main Crop:</b> ${escapeHtml(profile.maincrop)}<br><br>

    <b>🔎 Current Selection:</b><br>
    Season: ${escapeHtml(season)}<br>
    Crop: ${escapeHtml(crop)}<br>
    Soil: ${escapeHtml(soil)}<br>
    Water: ${escapeHtml(water)}<br><br>

    <b>🌱 Risk Result:</b><br>
    <pre style="white-space:pre-wrap;margin:0;">${escapeHtml(risk)}</pre><br>

    <b>⚡ Quick Advice:</b><br>
    <pre style="white-space:pre-wrap;margin:0;">${escapeHtml(quick)}</pre><br>

    <b>💧 Water Tool:</b><br>
    <pre style="white-space:pre-wrap;margin:0;">${escapeHtml(waterRes)}</pre><br>

    <b>🌾 Seed Tool:</b><br>
    <pre style="white-space:pre-wrap;margin:0;">${escapeHtml(seedRes)}</pre><br>

    <b>📅 Calendar:</b><br>
    <pre style="white-space:pre-wrap;margin:0;">${escapeHtml(calRes)}</pre><br>

    <b>🧪 Fertilizer:</b><br>
    <pre style="white-space:pre-wrap;margin:0;">${escapeHtml(fertRes)}</pre><br>

    <br><b>⚠️ Note:</b> This report is guidance. Final decision depends on local weather and soil test.
  `;

  saveHistory("Report", `Generated report for ${profile.name || "Farmer"}`);
  scrollToBox("reportBox");
}

function downloadReport(){
  generateReport();
  alert("Now press: Share/Print → Save as PDF");
  window.print();
}

function shareReport(){
  generateReport();
  const text = getReportText();
  navigator.clipboard.writeText(text).then(()=>{
    alert("✅ Report copied. Now open WhatsApp and paste.");
  }).catch(()=>{
    alert("⚠️ Copy failed. Please manually copy from report box.");
  });
}

function getReportText(){
  const box = document.getElementById("reportBox");
  return box.innerText || "AgroSense report";
}

/* -----------------------------
   Step 4: History
------------------------------*/
function saveHistory(tool, summary){
  try{
    const raw = localStorage.getItem("agrosense_history");
    let arr = raw ? JSON.parse(raw) : [];
    arr.unshift({
      time: new Date().toLocaleString(),
      tool,
      summary
    });
    arr = arr.slice(0,5);
    localStorage.setItem("agrosense_history", JSON.stringify(arr));
    renderHistory();
  }catch(e){}
}

function renderHistory(){
  const box = document.getElementById("historyBox");
  if(!box) return;

  try{
    const raw = localStorage.getItem("agrosense_history");
    const arr = raw ? JSON.parse(raw) : [];

    if(!arr.length){
      box.innerHTML = "No history yet.";
      return;
    }

    box.innerHTML = arr.map((x, i)=>`
      <div style="padding:10px;border-bottom:1px solid rgba(0,0,0,0.08);">
        <b>${i+1}) ${escapeHtml(x.tool)}</b><br>
        <span style="color:#51605a;">${escapeHtml(x.time)}</span><br>
        <span>${escapeHtml(x.summary)}</span>
      </div>
    `).join("");
  }catch(e){
    box.innerHTML = "History error.";
  }
}

function clearHistory(){
  localStorage.removeItem("agrosense_history");
  renderHistory();
  alert("🗑 History cleared.");
}

/* -----------------------------
   Helpers
------------------------------*/
function scrollToBox(id){
  setTimeout(()=> jumpTo(id), 250);
}

function escapeHtml(str){
  if(!str) return "";
  return String(str)
    .replaceAll("&","&amp;")
    .replaceAll("<","&lt;")
    .replaceAll(">","&gt;");
}

function getProfile(){
  try{
    const raw = localStorage.getItem("agrosense_profile");
    if(!raw) return {name:"", place:"", acres:"", maincrop:""};
    return JSON.parse(raw);
  }catch(e){
    return {name:"", place:"", acres:"", maincrop:""};
  }
}

/* Auto Report refresh (optional) */
function autoReport(){
  // only update if report already generated once
  const box = document.getElementById("reportBox");
  if(box && box.innerText && box.innerText.includes("AgroSense Farmer Report
