/* AgroSense Tools - FIXED (Buttons Working) */

function jumpTo(id){
  const el = document.getElementById(id);
  if(el) el.scrollIntoView({behavior:"smooth", block:"start"});
}

function openFarmCulture(){
  window.open("https://huggingface.co/spaces/Chaitu2121/farmculture-ai", "_blank");
}

function filterCrops(){
  const search = document.getElementById("cropSearch").value.toLowerCase();
  const cropSelect = document.getElementById("crop");
  const options = cropSelect.options;

  for(let i=0; i<options.length; i++){
    if(i === 0) continue;
    const txt = options[i].text.toLowerCase();
    options[i].style.display = txt.includes(search) ? "" : "none";
  }
}

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

  let advice = "✅ Good selection. Check weather and soil moisture before sowing.";

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

  if(water === "rain") score -= 28;
  if(water === "farmpond") score -= 10;
  if(water === "drip") score += 4;

  if(soil === "sandy") score -= 16;
  if(soil === "loamy") score += 2;

  if(season === "summer") score -= 20;
  if(season === "winter") score += 2;

  if(crop === "sugarcane") score -= 25;
  if(crop === "rice") score -= 18;
  if(crop === "banana") score -= 20;
  if(crop === "bajra" || crop === "jowar" || crop === "ragi") score += 6;

  score = Math.max(0, Math.min(100, score));

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
}

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
}

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
    maize: ["HQPM 1", "Deccan 103", "Hybrid (local)"],
    wheat: ["HD 2967", "HD 3086", "Lok 1", "GW 322"],
    soybean: ["JS 335", "JS 9560", "MAUS 71", "RKS 18"],
    cotton: ["Bt Hybrid (local)", "RCH 2 Bt", "Bunny Bt"],
    rice: ["Swarna", "IR 64", "Indrayani", "Basmati (if market)"],
    gram: ["JG 11", "Vijay", "Digvijay"],
    tur: ["BSMR 736", "Asha", "Maruti"],
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
}

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
}

function rescue(type){
  const out = document.getElementById("rescueResult");

  const data = {
    yellow: `<b>🍂 Leaves Yellow</b><br><br>1) Check water.<br>2) Check soil moisture.<br>3) Add compost.<br>4) Nitrogen deficiency possible.`,
    dry: `<b>🔥 Plant Drying</b><br><br>1) Irrigate if dry.<br>2) Mulching.<br>3) Avoid fertilizer in dry soil.<br>4) Check root rot.`,
    slow: `<b>🐌 Slow Growth</b><br><br>1) Check spacing.<br>2) Soil too hard.<br>3) Compost + micronutrients.<br>4) Avoid too much urea.`,
    pest: `<b>🐛 Pest Attack</b><br><br>1) Identify pest.<br>2) Neem spray first.<br>3) Remove infected leaves.<br>4) Consult officer if heavy.`
  };

  out.innerHTML = data[type] || "Select a problem.";
}

function fertGuide(){
  const crop = document.getElementById("f_crop").value;
  const out = document.getElementById("fertResult");

  if(!crop){
    out.innerHTML = "⚠️ Select crop first.";
    return;
  }

  const guide = {
    rice: "Use balanced NPK. Avoid excess urea. Split dose in 2–3 times.",
    wheat: "Basal dose + split urea with irrigation.",
    cotton: "Too much nitrogen increases pests. Use balanced NPK.",
    soybean: "Do NOT overuse urea. Soybean fixes nitrogen naturally.",
    onion: "Needs potassium. Avoid heavy urea in early stage.",
    tomato: "Needs potassium + calcium. Avoid overwatering.",
    gram: "Avoid excess nitrogen. Focus on phosphorus.",
    tur: "Use compost + balanced fertilizer. Avoid waterlogging.",
    bajra: "Low fertilizer crop. Compost is enough in many cases.",
    jowar: "Low fertilizer crop. Avoid overuse."
  };

  out.innerHTML = `<b>🧪 Fertilizer Guide (${crop})</b><br><br>${guide[crop] || "No guide available."}<br><br><b>Safety:</b><br>⚠️ Never apply fertilizer in dry soil. Irrigate first.`;
}

function saveNotes(){
  const text = document.getElementById("notesBox").value;
  localStorage.setItem("agrosense_notes", text);
  document.getElementById("notesStatus").innerHTML = "✅ Notes saved on this phone.";
}

function clearNotes(){
  localStorage.removeItem("agrosense_notes");
  document.getElementById("notesBox").value = "";
  document.getElementById("notesStatus").innerHTML = "🗑 Notes cleared.";
}

window.onload = function(){
  try{
    const saved = localStorage.getItem("agrosense_notes");
    if(saved){
      document.getElementById("notesBox").value = saved;
      document.getElementById("notesStatus").innerHTML = "✅ Loaded saved notes from this phone.";
    }
  }catch(e){}
};
/* ===============================
   AGROSENSE DECISION INTELLIGENCE 2050
=================================*/

function generateIntelligenceReport() {

  const season = document.getElementById("season")?.value;
  const crop = document.getElementById("crop")?.value;
  const soil = document.getElementById("soil")?.value;
  const water = document.getElementById("water")?.value;

  if(!season || !crop || !soil || !water){
    alert("Complete Risk Predictor first.");
    return;
  }

  let climateScore = 80;
  let waterScore = 80;
  let soilScore = 80;
  let economicScore = 75;
  let resilienceScore = 70;

  if(season === "summer") climateScore -= 20;
  if(season === "monsoon") climateScore += 5;

  if(water === "rain") waterScore -= 25;
  if(water === "drip") waterScore += 10;

  if(soil === "sandy") soilScore -= 20;
  if(soil === "loamy") soilScore += 5;

  const droughtCrops = ["bajra","jowar","ragi","gram"];
  if(droughtCrops.includes(crop)) resilienceScore += 15;

  const waterHeavy = ["rice","sugarcane","banana"];
  if(waterHeavy.includes(crop)) resilienceScore -= 15;

  const finalScore = Math.round(
    (climateScore + waterScore + soilScore + economicScore + resilienceScore) / 5
  );

  let classification = "Stable";
  if(finalScore < 70) classification = "Moderate Risk";
  if(finalScore < 50) classification = "High Risk";

  const output = `
    <div style="margin-top:20px; padding:15px; border-radius:14px; background:#f4fff4; border:1px solid rgba(0,0,0,0.08);">
      <h3>🌍 AgroSense 2050 Intelligence Report</h3>
      🌡 Climate Layer: ${climateScore}/100 <br>
      💧 Water Layer: ${waterScore}/100 <br>
      🌱 Soil Layer: ${soilScore}/100 <br>
      💰 Economic Layer: ${economicScore}/100 <br>
      🛡 Resilience Layer: ${resilienceScore}/100 <br><br>
      <b>Final Strategic Score:</b> ${finalScore}/100 <br>
      <b>System Classification:</b> ${classification}
    </div>
  `;

  const box = document.getElementById("riskResult");
  box.innerHTML = box.innerHTML + output;
}
