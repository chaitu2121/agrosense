/* =========================================================
   AGROSENSE - NEURAL LOGIC ENGINE (RM MASTER BUILD)
   ========================================================= */

// --- 1. CORE SYSTEM LOGIC ---

window.addEventListener('load', () => {
  // 1A. Remove Loader
  setTimeout(() => {
    const loader = document.getElementById('rm-loader');
    if(loader) loader.classList.add('hidden');
  }, 800); 

  // 1B. Restore Secure Notes
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

// Menu Toggle Logic
const menu = document.getElementById('rm-menu');
const line1 = document.getElementById('line1');
const line2 = document.getElementById('line2');
let menuOpen = false;

function toggleMenu() {
  menuOpen = !menuOpen;
  if(menuOpen) {
    menu.classList.add('active');
    line1.style.transform = "translateY(3.5px) rotate(45deg)";
    line2.style.transform = "translateY(-3.5px) rotate(-45deg)";
  } else {
    menu.classList.remove('active');
    line1.style.transform = "none";
    line2.style.transform = "none";
  }
}

function openFarmCulture() {
  window.open("https://huggingface.co/spaces/Chaitu2121/farmculture-ai", "_blank");
}

// --- 2. INSTRUMENT LOGIC ---

function analyzeRisk() {
  const season = document.getElementById("season").value;
  const crop = document.getElementById("crop").value;
  const soil = document.getElementById("soil").value;
  const water = document.getElementById("water").value;
  const out = document.getElementById("riskResult");

  if(!season || !crop || !soil || !water) {
    out.innerHTML = "<span style='color:#ef4444;'>[ ERROR ] INCOMPLETE PARAMETERS</span>";
    return;
  }

  let score = 85;
  let warnings = [];

  if(water === "rain") { score -= 35; warnings.push("Rainfed dependence flagged. High vulnerability."); }
  if(water === "drip") score += 10;
  if(soil === "sandy") { score -= 15; warnings.push("Sandy soil detected. Rapid moisture loss imminent."); }
  if(soil === "black") score += 8; 
  if(season === "summer") {
    score -= 25;
    if(water === "rain") warnings.push("CRITICAL: Summer cultivation without irrigation is fatal.");
  }

  const cropProfiles = {
    sugarcane: { risk: 30, warning: "Sugarcane demands extreme hydration. Monitor reserves strictly." },
    cotton: { risk: 10, warning: "Black soil highly recommended for Bt Cotton." },
    onion: { risk: 15, warning: "Sensitive to waterlogging. Ensure proper bed drainage." },
    pomegranate: { risk: 5, warning: "Bacterial blight monitoring required." }
  };

  if(cropProfiles[crop]) {
    score -= cropProfiles[crop].risk;
    if(cropProfiles[crop].risk > 15 && water === "rain") warnings.push(cropProfiles[crop].warning);
  }

  score = Math.max(0, Math.min(100, score));
  let status = "OPTIMAL"; let color = "#22c55e"; 
  if(score < 75) { status = "ELEVATED RISK"; color = "#eab308"; }
  if(score < 45) { status = "CRITICAL WARNING"; color = "#ef4444"; }

  let outputHTML = `
    <div style="color: ${color}; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 10px; margin-bottom: 10px;">
      [ DIAGNOSTIC COMPLETE ]<br>
      SYSTEM SCORE: ${score}/100<br>
      STATUS: ${status}
    </div>
  `;
  if(warnings.length > 0) {
    outputHTML += `<div style="color: #a1a1a1; font-size: 11px; line-height: 1.6;">`;
    warnings.forEach(w => outputHTML += `/// ${w}<br>`);
    outputHTML += `</div>`;
  }
  out.innerHTML = outputHTML;
}

function calcWater() {
  const crop = document.getElementById("w_crop").value;
  const acres = parseFloat(document.getElementById("w_acres").value);
  const source = document.getElementById("w_source").value;
  const out = document.getElementById("waterResult");

  if(!crop || !acres || acres <= 0 || !source) {
    out.innerHTML = "<span style='color:#ef4444;'>[ ERROR ] MISSING DATA</span>"; return;
  }

  const hydrationData = {
    sugarcane: { need: "EXTREME", mm: 1500 },
    cotton: { need: "MODERATE", mm: 700 },
    wheat: { need: "MODERATE", mm: 500 },
    onion: { need: "MODERATE", mm: 450 }
  };

  const data = hydrationData[crop] || { need: "MODERATE", mm: 600 };
  const totalWaterEst = (data.mm * acres * 4046.86).toLocaleString('en-IN'); 

  let risk = "LOW"; let color = "#22c55e";
  if(data.need === "EXTREME" && (source === "rain" || source === "borewell")) { risk = "HIGH (DEPLETION IMMINENT)"; color = "#ef4444"; } 
  else if (data.need === "HIGH" && source === "rain") { risk = "MODERATE (MONSOON DEPENDENT)"; color = "#eab308"; }

  out.innerHTML = `
    <div style="color: ${color}; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 10px; margin-bottom: 10px;">
      [ HYDRATION MATRIX ]<br>
      CROP REQUIREMENT: ${data.need}<br>
      EST. CYCLE VOLUME: ${totalWaterEst} LITERS
    </div>
    <div style="color: #a1a1a1; font-size: 11px; line-height: 1.6;">
      /// SOURCE RISK: ${risk}<br>
      /// NOTE: Deploy drip infrastructure to reduce evaporation losses.
    </div>
  `;
}

function calcSeed() {
  const crop = document.getElementById("seed_crop").value;
  const acres = parseFloat(document.getElementById("seed_acres").value);
  const out = document.getElementById("seedResult");

  if(!crop || !acres || acres <= 0) { out.innerHTML = "<span style='color:#ef4444;'>[ ERROR ] INVALID ACREAGE</span>"; return; }

  const seedMatrix = {
    wheat: { min: 40, max: 50, unit: "KG", spacing: "22 cm x 10 cm", vars: ["HD 2967", "Lok 1", "GW 322"] },
    cotton: { min: 1.5, max: 2.0, unit: "KG", spacing: "90 cm x 90 cm", vars: ["RCH 2 Bt", "Ajeet 155"] },
    onion: { min: 3.5, max: 4.5, unit: "KG (Nursery)", spacing: "15 cm x 10 cm", vars: ["N-53", "Bhima Super"] },
    sugarcane: { min: 10000, max: 12000, unit: "SETTS", spacing: "120 cm row", vars: ["Co 86032", "Phule 265"] }
  };

  const r = seedMatrix[crop];
  if(!r) { out.innerHTML = "<span style='color:#eab308;'>[ NOTICE ] METRICS UNAVAILABLE</span>"; return; }

  const minTotal = (r.min * acres).toLocaleString('en-IN');
  const maxTotal = (r.max * acres).toLocaleString('en-IN');

  out.innerHTML = `
    <div style="color: #ffffff; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 10px; margin-bottom: 10px;">
      [ OPTIMIZATION COMPLETE ]<br>
      REQUIRED MASS: ${minTotal} – ${maxTotal} ${r.unit}<br>
      GEOMETRIC SPACING: ${r.spacing}
    </div>
    <div style="color: #22c55e; font-size: 11px; line-height: 1.6;">
      /// APPROVED STRAINS:<br>${r.vars.map(v => `> ${v}`).join("<br>")}
    </div>
  `;
}

function calcEconomics() {
  const crop = document.getElementById("eco_crop").value;
  const acres = parseFloat(document.getElementById("eco_acres").value);
  const out = document.getElementById("ecoResult");

  if(!crop || !acres || acres <= 0) { out.innerHTML = "<span style='color:#ef4444;'>[ ERROR ] INVALID METRICS</span>"; return; }

  const marketData = {
    sugarcane: { yield: 40, unit: "TONS", price: 3000, priceUnit: "PER TON" },
    onion: { yield: 120, unit: "QUINTALS", price: 1500, priceUnit: "PER QUINTAL" },
    cotton: { yield: 10, unit: "QUINTALS", price: 7000, priceUnit: "PER QUINTAL" },
    soybean: { yield: 8, unit: "QUINTALS", price: 4500, priceUnit: "PER QUINTAL" }
  };

  const data = marketData[crop];
  const projectedYield = (data.yield * acres).toLocaleString('en-IN');
  const projectedRevenue = (data.yield * acres * data.price).toLocaleString('en-IN');

  out.innerHTML = `
    <div style="color: #ffffff; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 10px; margin-bottom: 10px;">
      [ FINANCIAL PROJECTION ]<br>
      EST. HARVEST: ${projectedYield} ${data.unit}<br>
      GROSS REVENUE: ₹${projectedRevenue} INR
    </div>
    <div style="color: #a1a1a1; font-size: 11px; line-height: 1.6;">
      /// BASELINE RATE: ₹${data.price.toLocaleString('en-IN')} ${data.priceUnit}<br>
      /// NOTE: ROI DEPENDENT ON CLIMATE VOLATILITY
    </div>
  `;
}

function calcFertilizer() {
  const crop = document.getElementById("chem_crop").value;
  const acres = parseFloat(document.getElementById("chem_acres").value);
  const out = document.getElementById("chemResult");

  if(!crop || !acres || acres <= 0) { out.innerHTML = "<span style='color:#ef4444;'>[ ERROR ] INVALID METRICS</span>"; return; }

  const chemData = {
    sugarcane: { urea: 6, dap: 3, mop: 3, split: "4 Stages (Basal, 45d, 90d, 120d)" },
    onion: { urea: 2, dap: 2, mop: 1.5, split: "2 Stages (Basal, 30d)" },
    cotton: { urea: 3, dap: 1.5, mop: 1, split: "3 Stages (Basal, 30d, 60d)" },
    wheat: { urea: 2.5, dap: 1.5, mop: 0.5, split: "2 Stages (Basal, 21d CRI Stage)" }
  };

  const data = chemData[crop];
  const totalUrea = Math.ceil(data.urea * acres);
  const totalDap = Math.ceil(data.dap * acres);
  const totalMop = Math.ceil(data.mop * acres);

  out.innerHTML = `
    <div style="color: #ffffff; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 10px; margin-bottom: 10px;">
      [ CHEMICAL ALLOCATION (50KG BAGS) ]<br>
      UREA (N): ${totalUrea} BAGS<br>
      DAP (P): ${totalDap} BAGS<br>
      MOP (K): ${totalMop} BAGS
    </div>
    <div style="color: #22c55e; font-size: 11px; line-height: 1.6;">
      /// APPLICATION PROTOCOL:<br>
      > SPLIT FREQUENCY: ${data.split}
    </div>
  `;
}

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
