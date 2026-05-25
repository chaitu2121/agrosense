/* =========================================================
   AGROSENSE - NEURAL LOGIC ENGINE (V2.1 TARGETED DIAGNOSTICS)
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

// =========================================================
// 1. RISK PREDICTOR
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

  let riskScore = 0; 
  let alerts = [];

  if (water === "rain") { riskScore += 35; alerts.push("Rainfed dependence limits yield consistency."); }
  else if (water === "borewell") { riskScore += 15; }
  
  if (soil === "sandy") { riskScore += 25; alerts.push("Sandy soil: High percolation rate. Evaporation risk."); }
  else if (soil === "red") { riskScore += 10; }

  if (season === "summer" && water !== "drip") { riskScore += 30; alerts.push("Summer cultivation without precision irrigation is critical."); }
  else if (season === "monsoon") { riskScore += 10; }
  else if (season === "winter") { riskScore += 5; }

  if (crop === "sugarcane" && water === "rain") { riskScore += 40; alerts.push("CRITICAL: Sugarcane requires continuous hydration."); }
  if (crop === "pomegranate" && soil === "black" && season === "monsoon") { riskScore += 20; alerts.push("WARNING: High moisture in black soil risks bacterial blight."); }

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
      ${alerts.map(a => `/// ${a}`).join("<br>")}
    </div>
  `;
}

// =========================================================
// 2. WATER BUDGET
// =========================================================
function calcWater() {
  const crop = document.getElementById("w_crop").value;
  const acres = parseFloat(document.getElementById("w_acres").value);
  const source = document.getElementById("w_source").value;
  const out = document.getElementById("waterResult");

  if(!crop) { out.innerHTML = "<span style='color:#ef4444;'>[ ERROR ] CROP NOT SELECTED</span>"; return; }
  if(!acres || acres <= 0) { out.innerHTML = "<span style='color:#ef4444;'>[ ERROR ] ACREAGE INPUT REQUIRED</span>"; return; }
  if(!source) { out.innerHTML = "<span style='color:#ef4444;'>[ ERROR ] WATER SOURCE NOT SELECTED</span>"; return; }

  const cropData = {
    sugarcane: { kc: 1.25, days: 365, need: "EXTREME" }, 
    wheat: { kc: 1.15, days: 120, need: "MODERATE" },
    cotton: { kc: 1.20, days: 160, need: "HIGH" },
    onion: { kc: 1.05, days: 110, need: "MODERATE" }
  };

  const c = cropData[crop];
  const eTc = 5.0 * c.kc * c.days; 
  const totalLiters = (eTc * 4046.86 * acres);

  let risk = "LOW"; 
  if(c.need === "EXTREME" && (source === "rain" || source === "borewell")) { risk = "HIGH (DEPLETION IMMINENT)"; } 
  else if (c.need === "HIGH" && source === "rain") { risk = "MODERATE (MONSOON DEPENDENT)"; }

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
// 3. SEED MATRIX
// =========================================================
function calcSeed() {
  const crop = document.getElementById("seed_crop").value;
  const acres = parseFloat(document.getElementById("seed_acres").value);
  const out = document.getElementById("seedResult");

  if(!crop) { out.innerHTML = "<span style='color:#ef4444;'>[ ERROR ] CROP NOT SELECTED</span>"; return; }
  if(!acres || acres <= 0) { out.innerHTML = "<span style='color:#ef4444;'>[ ERROR ] ACREAGE INPUT REQUIRED</span>"; return; }

  const geometricData = {
    wheat: { spacing: "22.5cm x 10cm", plantsPerAcre: 180000, seedWeightGrams: 40, unit: "KG" },
    cotton: { spacing: "90cm x 90cm", plantsPerAcre: 5000, seedWeightGrams: 100, unit: "KG" }, 
    onion: { spacing: "15cm x 10cm", plantsPerAcre: 270000, seedWeightGrams: 4, unit: "KG (Nursery)" },
    sugarcane: { spacing: "120cm row", plantsPerAcre: 12000, seedWeightGrams: null, unit: "SETTS" }
  };

  const g = geometricData[crop];
  let seedOutput = "";

  if(g.seedWeightGrams) {
    const calcKg = ((g.plantsPerAcre * acres * g.seedWeightGrams) / 100000) / 0.85; 
    seedOutput = `${calcKg.toFixed(2)} ${g.unit}`;
  } else {
    seedOutput = `${(g.plantsPerAcre * acres).toLocaleString('en-IN')} ${g.unit}`;
  }

  out.innerHTML = `
    <div style="color: #ffffff; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 10px; margin-bottom: 10px;">
      [ OPTIMIZATION COMPLETE ]<br>
      GEOMETRY: ${g.spacing}<br>
      POPULATION: ${(g.plantsPerAcre * acres).toLocaleString('en-IN')} PLANTS<br>
      REQUIRED MASS: ${seedOutput}
    </div>
  `;
}

// =========================================================
// 4. YIELD ECONOMICS
// =========================================================
function calcEconomics() {
  const crop = document.getElementById("eco_crop").value;
  const acres = parseFloat(document.getElementById("eco_acres").value);
  const out = document.getElementById("ecoResult");

  if(!crop) { out.innerHTML = "<span style='color:#ef4444;'>[ ERROR ] CROP NOT SELECTED</span>"; return; }
  if(!acres || acres <= 0) { out.innerHTML = "<span style='color:#ef4444;'>[ ERROR ] ACREAGE INPUT REQUIRED</span>"; return; }

  const marketData = {
    sugarcane: { yield: 45, unit: "TONS", price: 3200, inputCost: 55000 },
    onion: { yield: 120, unit: "QUINTALS", price: 1800, inputCost: 65000 },
    cotton: { yield: 12, unit: "QUINTALS", price: 7200, inputCost: 35000 },
    soybean: { yield: 10, unit: "QUINTALS", price: 4600, inputCost: 22000 }
  };

  const m = marketData[crop];
  const totalYield = m.yield * acres;
  const grossRev = totalYield * m.price;
  const totalInputCost = m.inputCost * acres;
  const netProfit = grossRev - totalInputCost;
  const roi = ((netProfit / totalInputCost) * 100).toFixed(1);

  let color = netProfit > 0 ? "#22c55e" : "#ef4444";

  out.innerHTML = `
    <div style="color: #ffffff; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 10px; margin-bottom: 10px;">
      [ FINANCIAL PROJECTION ]<br>
      EST. HARVEST: ${totalYield.toLocaleString('en-IN')} ${m.unit}<br>
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
// 5. CHEMICAL MATRIX
// =========================================================
function calcFertilizer() {
  const crop = document.getElementById("chem_crop").value;
  const acres = parseFloat(document.getElementById("chem_acres").value);
  const out = document.getElementById("chemResult");

  if(!crop) { out.innerHTML = "<span style='color:#ef4444;'>[ ERROR ] CROP NOT SELECTED</span>"; return; }
  if(!acres || acres <= 0) { out.innerHTML = "<span style='color:#ef4444;'>[ ERROR ] ACREAGE INPUT REQUIRED</span>"; return; }

  const reqNPK = {
    sugarcane: { N: 100, P: 46, K: 46 }, 
    wheat: { N: 48, P: 24, K: 16 },
    cotton: { N: 40, P: 20, K: 20 },
    onion: { N: 40, P: 20, K: 20 }
  };

  const target = reqNPK[crop];
  const nReq = target.N * acres;
  const pReq = target.P * acres;
  const kReq = target.K * acres;

  const dapKg = (pReq / 0.46);
  const nFromDap = dapKg * 0.18;
  const ureaKg = ((nReq - nFromDap) / 0.46);
  const mopKg = (kReq / 0.60);

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
      /// BASE NPK TARGET: ${target.N}-${target.P}-${target.K} KG/ACRE
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
   
