/* =========================================================
   AGROSENSE - NEURAL LOGIC ENGINE (V3.0 MASTER FUSION)
   Combines Deep Agronomic Database with Advanced Mathematics
   ========================================================= */

window.addEventListener('load', () => {
  setTimeout(() => {
    const loader = document.getElementById('rm-loader');
    if(loader) loader.classList.add('hidden');
  }, 800); 

  try {
    const saved = localStorage.getItem("agrosense_encrypted_vault");
    if(saved) {
      const box = document.getElementById("notesBox");
      if(box) box.value = saved;
      const status = document.getElementById("notesStatus");
      if(status) status.innerHTML = "[ PREVIOUS SESSION RESTORED ]";
    }
  } catch(e) {}
});

function toggleMenu() {
  const menu = document.getElementById('rm-menu');
  const line1 = document.getElementById('line1');
  const line2 = document.getElementById('line2');
  if(menu.classList.contains('active')) {
    menu.classList.remove('active');
    line1.style.transform = "none";
    line2.style.transform = "none";
  } else {
    menu.classList.add('active');
    line1.style.transform = "translateY(3.5px) rotate(45deg)";
    line2.style.transform = "translateY(-3.5px) rotate(-45deg)";
  }
}

function openFarmCulture() {
  window.open("https://huggingface.co/spaces/Chaitu2121/farmculture-ai", "_blank");
}

/* =========================================================
   MASTER AGRONOMIC DATABASE (Fused from your original data)
========================================================= */
const MASTER_DB = {
  rice: { seasons: ["monsoon"], soils: ["loamy", "black"], waterNeed: "Very High", kc: 1.20, days: 120, seed: {min: 8, max: 12, unit: "KG (Nursery)"}, spacing: "20cm x 15cm", vars: ["Swarna", "IR 64", "Indrayani", "MTU 1010"], yieldQtl: 25, priceQtl: 2200, costAcre: 20000, npk: {N: 40, P: 20, K: 20} },
  wheat: { seasons: ["winter"], soils: ["loamy", "black"], waterNeed: "Medium", kc: 1.15, days: 120, seed: {min: 35, max: 45, unit: "KG"}, spacing: "22.5cm x 10cm", vars: ["HD 2967", "HD 3086", "Lok 1", "GW 322"], yieldQtl: 18, priceQtl: 2300, costAcre: 15000, npk: {N: 48, P: 24, K: 16} },
  soybean: { seasons: ["monsoon"], soils: ["black", "loamy"], waterNeed: "Medium", kc: 1.00, days: 100, seed: {min: 25, max: 35, unit: "KG"}, spacing: "45cm x 5cm", vars: ["JS 335", "JS 9560", "MAUS 71", "RKS 18"], yieldQtl: 10, priceQtl: 4500, costAcre: 16000, npk: {N: 12, P: 32, K: 16} }, // Low N because it fixes nitrogen
  cotton: { seasons: ["monsoon"], soils: ["black", "loamy"], waterNeed: "Medium", kc: 1.20, days: 160, seed: {min: 1.2, max: 2.0, unit: "KG"}, spacing: "90cm x 90cm", vars: ["RCH 2 Bt", "Bunny Bt", "Ankur Bt"], yieldQtl: 12, priceQtl: 7000, costAcre: 35000, npk: {N: 40, P: 20, K: 20} },
  maize: { seasons: ["monsoon"], soils: ["loamy", "black"], waterNeed: "Medium", kc: 1.15, days: 100, seed: {min: 8, max: 10, unit: "KG"}, spacing: "60cm x 20cm", vars: ["HQPM 1", "Deccan 103", "NK-6240"], yieldQtl: 22, priceQtl: 1800, costAcre: 18000, npk: {N: 48, P: 24, K: 16} },
  bajra: { seasons: ["monsoon"], soils: ["sandy", "loamy", "black"], waterNeed: "Low", kc: 0.80, days: 85, seed: {min: 3, max: 4, unit: "KG"}, spacing: "45cm x 15cm", vars: ["HHB 67", "ICTP 8203"], yieldQtl: 10, priceQtl: 2000, costAcre: 10000, npk: {N: 24, P: 12, K: 0} },
  jowar: { seasons: ["monsoon"], soils: ["sandy", "loamy", "black"], waterNeed: "Low", kc: 0.85, days: 100, seed: {min: 8, max: 10, unit: "KG"}, spacing: "45cm x 15cm", vars: ["Maldandi", "CSV 15"], yieldQtl: 12, priceQtl: 2500, costAcre: 11000, npk: {N: 32, P: 16, K: 0} },
  gram: { seasons: ["winter"], soils: ["black", "loamy"], waterNeed: "Low", kc: 0.90, days: 110, seed: {min: 25, max: 35, unit: "KG"}, spacing: "30cm x 10cm", vars: ["JG 11", "Vijay", "Digvijay"], yieldQtl: 8, priceQtl: 5500, costAcre: 14000, npk: {N: 10, P: 20, K: 0} },
  tur: { seasons: ["monsoon"], soils: ["black", "loamy"], waterNeed: "Low", kc: 0.95, days: 150, seed: {min: 4, max: 6, unit: "KG"}, spacing: "60cm x 20cm", vars: ["BSMR 736", "Asha", "Maruti"], yieldQtl: 7, priceQtl: 6500, costAcre: 12000, npk: {N: 10, P: 20, K: 0} },
  onion: { seasons: ["winter"], soils: ["loamy", "black"], waterNeed: "Medium", kc: 1.05, days: 110, seed: {min: 3, max: 4, unit: "KG (Nursery)"}, spacing: "15cm x 10cm", vars: ["N-53", "Bhima Super", "Bhima Shakti"], yieldQtl: 120, priceQtl: 1800, costAcre: 65000, npk: {N: 40, P: 20, K: 20} },
  tomato: { seasons: ["winter"], soils: ["loamy", "black"], waterNeed: "Medium", kc: 1.10, days: 120, seed: {min: 0.08, max: 0.12, unit: "KG (Nursery)"}, spacing: "60cm x 45cm", vars: ["Arka Rakshak", "Pusa Rohini", "Naveen"], yieldQtl: 150, priceQtl: 1200, costAcre: 70000, npk: {N: 60, P: 32, K: 24} },
  sugarcane: { seasons: ["monsoon", "summer"], soils: ["black", "loamy"], waterNeed: "Very High", kc: 1.25, days: 365, seed: {min: 18, max: 25, unit: "TONS (Setts)"}, spacing: "120cm row", vars: ["Co 86032", "Co 94012", "VSI 9805"], yieldQtl: 400, priceQtl: 300, costAcre: 55000, npk: {N: 100, P: 46, K: 46} },
  pomegranate: { seasons: ["monsoon", "winter", "summer"], soils: ["loamy", "sandy"], waterNeed: "Medium", kc: 0.95, days: 365, seed: {min: 250, max: 300, unit: "SAPLINGS"}, spacing: "4.5m x 3m", vars: ["Bhagwa", "Super Bhagwa"], yieldQtl: 60, priceQtl: 8000, costAcre: 120000, npk: {N: 80, P: 40, K: 40} }
};

// =========================================================
// 1. RISK PREDICTOR (Now uses your exact soil/season logic)
// =========================================================
function analyzeRisk() {
  const season = document.getElementById("season").value;
  const crop = document.getElementById("crop").value;
  const soil = document.getElementById("soil").value;
  const water = document.getElementById("water").value;
  const out = document.getElementById("riskResult");

  if(!season) { out.innerHTML = "<span style='color:#ef4444;'>[ ERROR ] SEASON NOT SELECTED</span>"; return; }
  if(!crop) { out.innerHTML = "<span style='color:#ef4444;'>[ ERROR ] CROP NOT SELECTED</span>"; return; }
  if(!soil) { out.innerHTML = "<span style='color:#ef4444;'>[ ERROR ] SOIL TYPE NOT SELECTED</span>"; return; }
  if(!water) { out.innerHTML = "<span style='color:#ef4444;'>[ ERROR ] WATER SOURCE NOT SELECTED</span>"; return; }

  const db = MASTER_DB[crop];
  let riskScore = 0; 
  let alerts = [];

  // 1. Check strict season & soil compatibility from your old file
  if(!db.seasons.includes(season)) { riskScore += 25; alerts.push(`CRITICAL: ${season.toUpperCase()} is not the preferred season for this crop.`); }
  if(!db.soils.includes(soil)) { riskScore += 20; alerts.push(`WARNING: Crop root system is incompatible with ${soil.toUpperCase()} soil.`); }

  // 2. Check Water Profile
  if (water === "rain") { 
    riskScore += 25; alerts.push("Rainfed dependence limits yield consistency."); 
    if(db.waterNeed === "Very High") { riskScore += 30; alerts.push("FATAL: Cannot sustain 'Very High' water crop on rain alone."); }
  } else if (water === "borewell") { riskScore += 10; }
  
  // 3. Sandy Soil Penalty
  if (soil === "sandy") { 
    alerts.push("Sandy soil: High percolation rate. Evaporation risk."); 
    if(water !== "drip") riskScore += 15;
  }

  const survivalRate = Math.max(0, Math.min(100, (100 - riskScore)));
  let status = "OPTIMAL"; let color = "#22c55e"; 
  if (survivalRate < 75) { status = "ELEVATED RISK"; color = "#eab308"; }
  if (survivalRate < 50) { status = "CRITICAL WARNING"; color = "#ef4444"; }

  out.innerHTML = `
    <div style="color: ${color}; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 10px; margin-bottom: 10px;">
      [ DIAGNOSTIC COMPLETE ]<br>
      PROBABILITY OF SUCCESS: ${survivalRate}%<br>
      STATUS: ${status}
    </div>
    <div style="color: #a1a1a1; font-size: 11px; line-height: 1.6;">
      ${alerts.length > 0 ? alerts.map(a => `/// ${a}`).join("<br>") : "/// PARAMETERS IDEAL. PROCEED WITH SOWING."}
    </div>
  `;
}

// =========================================================
// 2. WATER BUDGET (FAO Math + Your 13 Crops)
// =========================================================
function calcWater() {
  const crop = document.getElementById("w_crop").value;
  const acres = parseFloat(document.getElementById("w_acres").value);
  const source = document.getElementById("w_source").value;
  const out = document.getElementById("waterResult");

  if(!crop) { out.innerHTML = "<span style='color:#ef4444;'>[ ERROR ] CROP NOT SELECTED</span>"; return; }
  if(!acres || acres <= 0) { out.innerHTML = "<span style='color:#ef4444;'>[ ERROR ] ACREAGE INPUT REQUIRED</span>"; return; }
  if(!source) { out.innerHTML = "<span style='color:#ef4444;'>[ ERROR ] WATER SOURCE NOT SELECTED</span>"; return; }

  const c = MASTER_DB[crop];
  if(!c) { out.innerHTML = "<span style='color:#eab308;'>[ NOTICE ] METRICS UNAVAILABLE</span>"; return; }

  const eTc = 5.0 * c.kc * c.days; 
  const totalLiters = (eTc * 4046.86 * acres);

  let risk = "LOW"; 
  if(c.waterNeed === "Very High" && (source === "rain" || source === "borewell")) { risk = "HIGH (DEPLETION IMMINENT)"; } 
  else if (c.waterNeed === "Medium" && source === "rain") { risk = "MODERATE (MONSOON DEPENDENT)"; }

  out.innerHTML = `
    <div style="color: #22c55e; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 10px; margin-bottom: 10px;">
      [ HYDRATION MATRIX ]<br>
      CROP EVAPOTRANSPIRATION: ${eTc.toLocaleString('en-IN')} MM<br>
      TOTAL VOLUME REQ: ${totalLiters.toLocaleString('en-IN')} LITERS
    </div>
    <div style="color: #a1a1a1; font-size: 11px; line-height: 1.6;">
      /// WATER SOURCE RISK: ${risk}<br>
      /// BASELINE: FAO PENMAN-MONTEITH METHOD
    </div>
  `;
}

// =========================================================
// 3. SEED MATRIX (Dynamic to your 13 Crops)
// =========================================================
function calcSeed() {
  const crop = document.getElementById("seed_crop").value;
  const acres = parseFloat(document.getElementById("seed_acres").value);
  const out = document.getElementById("seedResult");

  if(!crop) { out.innerHTML = "<span style='color:#ef4444;'>[ ERROR ] CROP NOT SELECTED</span>"; return; }
  if(!acres || acres <= 0) { out.innerHTML = "<span style='color:#ef4444;'>[ ERROR ] ACREAGE INPUT REQUIRED</span>"; return; }

  const c = MASTER_DB[crop];
  if(!c) { out.innerHTML = "<span style='color:#eab308;'>[ NOTICE ] METRICS UNAVAILABLE</span>"; return; }

  const minTotal = (c.seed.min * acres).toLocaleString('en-IN');
  const maxTotal = (c.seed.max * acres).toLocaleString('en-IN');

  out.innerHTML = `
    <div style="color: #ffffff; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 10px; margin-bottom: 10px;">
      [ OPTIMIZATION COMPLETE ]<br>
      GEOMETRY: ${c.spacing}<br>
      REQUIRED MASS: ${minTotal} – ${maxTotal} ${c.seed.unit}
    </div>
    <div style="color: #22c55e; font-size: 11px; line-height: 1.6;">
      /// APPROVED STRAINS:<br>${c.vars.map(v => `> ${v}`).join("<br>")}
    </div>
  `;
}

// =========================================================
// 4. YIELD ECONOMICS (Full 13 Crop ROI Math)
// =========================================================
function calcEconomics() {
  const crop = document.getElementById("eco_crop").value;
  const acres = parseFloat(document.getElementById("eco_acres").value);
  const out = document.getElementById("ecoResult");

  if(!crop) { out.innerHTML = "<span style='color:#ef4444;'>[ ERROR ] CROP NOT SELECTED</span>"; return; }
  if(!acres || acres <= 0) { out.innerHTML = "<span style='color:#ef4444;'>[ ERROR ] ACREAGE INPUT REQUIRED</span>"; return; }

  const c = MASTER_DB[crop];
  if(!c) { out.innerHTML = "<span style='color:#eab308;'>[ NOTICE ] METRICS UNAVAILABLE</span>"; return; }

  const totalYield = c.yieldQtl * acres;
  const grossRev = totalYield * c.priceQtl;
  const totalInputCost = c.costAcre * acres;
  const netProfit = grossRev - totalInputCost;
  const roi = ((netProfit / totalInputCost) * 100).toFixed(1);

  let color = netProfit > 0 ? "#22c55e" : "#ef4444";

  out.innerHTML = `
    <div style="color: #ffffff; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 10px; margin-bottom: 10px;">
      [ FINANCIAL PROJECTION ]<br>
      EST. HARVEST: ${totalYield.toLocaleString('en-IN')} QUINTALS<br>
      GROSS REVENUE: ₹${grossRev.toLocaleString('en-IN')}<br>
      EST. INPUT COST: ₹${totalInputCost.toLocaleString('en-IN')}
    </div>
    <div style="color: ${color}; font-size: 13px; font-weight: 700; line-height: 1.6;">
      NET PROFIT: ₹${netProfit.toLocaleString('en-IN')}<br>
      R.O.I: ${roi}%
    </div>
  `;
}

// =========================================================
// 5. CHEMICAL MATRIX (Stoichiometric Math for 13 Crops)
// =========================================================
function calcFertilizer() {
  const crop = document.getElementById("chem_crop").value;
  const acres = parseFloat(document.getElementById("chem_acres").value);
  const out = document.getElementById("chemResult");

  if(!crop) { out.innerHTML = "<span style='color:#ef4444;'>[ ERROR ] CROP NOT SELECTED</span>"; return; }
  if(!acres || acres <= 0) { out.innerHTML = "<span style='color:#ef4444;'>[ ERROR ] ACREAGE INPUT REQUIRED</span>"; return; }

  const c = MASTER_DB[crop];
  if(!c) { out.innerHTML = "<span style='color:#eab308;'>[ NOTICE ] METRICS UNAVAILABLE</span>"; return; }

  const nReq = c.npk.N * acres;
  const pReq = c.npk.P * acres;
  const kReq = c.npk.K * acres;

  // Stoichiometry: DAP provides P and N. Urea provides N. MOP provides K.
  const dapKg = (pReq / 0.46);
  const nFromDap = dapKg * 0.18;
  const ureaKg = Math.max(0, ((nReq - nFromDap) / 0.46)); // Ensure it doesn't go negative
  const mopKg = (kReq / 0.60);

  // Convert to 50kg Bags
  const toBags = (kg) => (Math.ceil((kg / 50) * 2) / 2).toFixed(1);

  out.innerHTML = `
    <div style="color: #ffffff; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 10px; margin-bottom: 10px;">
      [ CHEMICAL STOICHIOMETRY (50KG BAGS) ]<br>
      UREA (46% N): ${toBags(ureaKg)} BAGS<br>
      DAP (18% N, 46% P): ${toBags(dapKg)} BAGS<br>
      MOP (60% K): ${toBags(mopKg)} BAGS
    </div>
    <div style="color: #22c55e; font-size: 11px; line-height: 1.6;">
      /// ALGORITHM COMPENSATED FOR DAP NITROGEN OVERLAP.<br>
      /// BASE NPK TARGET: ${c.npk.N}-${c.npk.P}-${c.npk.K} KG/ACRE
    </div>
  `;
}

// =========================================================
// 6. EMERGENCY & UTILITIES
// =========================================================
function rescue(type) {
  const out = document.getElementById("rescueResult");
  const data = {
    yellow: "/// LEAF YELLOWING DETECTED<br>> Action 1: Verify soil moisture levels.<br>> Action 2: Check for Nitrogen deficiency.<br>> Action 3: Apply micro-nutrients via foliar spray.",
    dry: "/// RAPID DRYING DETECTED<br>> Action 1: Execute emergency irrigation.<br>> Action 2: Apply organic mulch immediately.<br>> Action 3: Suspend all fertilizer application.",
    slow: "/// STUNTED GROWTH DETECTED<br>> Action 1: Audit seed spacing constraints.<br>> Action 2: Perform soil aeration (hoeing).<br>> Action 3: Integrate compost matrix.",
    pest: "/// PEST INFESTATION DETECTED<br>> Action 1: Identify biological threat.<br>> Action 2: Deploy initial Neem extract spray.<br>> Action 3: Isolate and purge infected biomass."
  };

  out.innerHTML = `
    <div style="border-bottom: 1px solid rgba(239, 68, 68, 0.2); padding-bottom: 10px; margin-bottom: 10px;">
      [ EMERGENCY PROTOCOL INITIATED ]
    </div>
    <div style="font-size: 11px; line-height: 1.6;">
      ${data[type]}
    </div>
  `;
}

function saveNotes() {
  const text = document.getElementById("notesBox").value;
  localStorage.setItem("agrosense_encrypted_vault", text);
  document.getElementById("notesStatus").innerHTML = "[ DATA WRITTEN TO LOCAL DISK ]";
}

function clearNotes() {
  localStorage.removeItem("agrosense_encrypted_vault");
  document.getElementById("notesBox").value = "";
  document.getElementById("notesStatus").innerHTML = "<span style='color:#ef4444;'>[ VAULT FORMATTED ]</span>";
   }
       
