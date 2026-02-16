let CURRENT_LANG = "en";

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

function setLang(lang){
  CURRENT_LANG = lang;
  document.getElementById("langStatus").innerHTML = LANG[lang].status;

  document.getElementById("t_risk_title").innerHTML = LANG[lang].riskTitle;
  document.getElementById("t_risk_sub").innerHTML = LANG[lang].riskSub;

  document.getElementById("t_season_label").innerHTML = LANG[lang].season;
  document.getElementById("t_crop_label").innerHTML = LANG[lang].crop;
  document.getElementById("t_soil_label").innerHTML = LANG[lang].soil;
  document.getElementById("t_water_label").innerHTML = LANG[lang].water;

  document.getElementById("t_check_btn").innerHTML = LANG[lang].analyze;
}

function openFarmCulture(){
  window.open("https://huggingface.co/spaces/Chaitu2121/farmculture-ai", "_blank");
}

function openWeather(){
  window.open("https://www.google.com/search?q=Daund+weather+tomorrow", "_blank");
}

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
    advice = "⚠️ Rainfed only: Choose drought-resistant crops and avoid long-duration crops.";
  }

  if(soil === "sandy"){
    advice = "⚠️ Sandy soil loses water fast. Use mulching + frequent irrigation. Avoid water-heavy crops.";
  }

  if(crop === "sugarcane" || crop === "banana" || crop === "rice"){
    if(water === "rain"){
      advice = "❌ High risk: This crop needs high water. Rainfed only is dangerous. Use canal/borewell/farm pond.";
    } else {
      advice = "✅ This crop needs high water. Ensure strong irrigation + fertilizer planning.";
    }
  }

  if(season === "summer" && water === "rain"){
    advice = "❌ Summer + Rainfed is extremely risky. Use irrigation or change crop.";
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
  let waterRisk = 20;
  let soilRisk = 20;
  let seasonRisk = 20;
  let cropRisk = 20;

  if(water === "rain"){ waterRisk = 75; score -= 25; }
  if(water === "farmpond"){ waterRisk = 45; score -= 10; }
  if(water === "drip"){ waterRisk = 15; score += 3; }

  if(soil === "sandy"){ soilRisk = 65; score -= 18; }
  if(soil === "loamy"){ soilRisk = 18; score += 2; }

  if(season === "summer"){ seasonRisk = 70; score -= 22; }
  if(season === "winter"){ seasonRisk = 25; score += 2; }

  if(crop === "rice"){ cropRisk = 70; score -= 18; }
  if(crop === "sugarcane"){ cropRisk = 80; score -= 25; }
  if(crop === "bajra" || crop === "jowar"){ cropRisk = 18; score += 5; }

  if(score > 100) score = 100;
  if(score < 0) score = 0;

  let rating = "Good";
  if(score < 70) rating = "Medium";
  if(score < 45) rating = "High Risk";

  out.innerHTML = `
    <b>Farmer Decision Score:</b> ${score}/100 (${rating})<br><br>
    💧 Water Risk: ${waterRisk}<br>
    🌱 Soil Risk: ${soilRisk}<br>
    🌦 Season Risk: ${seasonRisk}<br>
    🌾 Crop Risk: ${cropRisk}
  `;

  showQuickAdvice();
}

function checkSuitability(){
  const season = document.getElementById("s_season").value;
  const soil = document.getElementById("s_soil").value;
  const water = document.getElementById("s_water").value;
  const out = document.getElementById("suitabilityResult");

  if(!season || !soil || !water){
    out.innerHTML = "⚠️ Please select Season, Soil and Water to get suggestions.";
    return;
  }

  let crops = [];

  if(water === "low"){
    crops = ["Bajra", "Jowar", "Tur", "Moong", "Groundnut"];
  } else if(water === "medium"){
    crops = ["Soybean", "Maize", "Cotton", "Wheat", "Onion"];
  } else {
    crops = ["Rice", "Sugarcane", "Banana", "Vegetables", "Wheat"];
  }

  if(soil === "sandy"){
    crops = crops.filter(c => c !== "Rice" && c !== "Sugarcane");
  }

  out.innerHTML = "✅ Best crops:<br><br>🌱 " + crops.join("<br>🌱 ");
}

function downloadReport(){
  const season = document.getElementById("season").value || "Not selected";
  const crop = document.getElementById("crop").value || "Not selected";
  const soil = document.getElementById("soil").value || "Not selected";
  const water = document.getElementById("water").value || "Not selected";

  const riskHTML = document.getElementById("riskResult").innerHTML;
  const adviceHTML = document.getElementById("quickAdvice").innerHTML;

  const win = window.open("", "_blank");

  win.document.write(`
    <html>
    <head>
      <title>AgroSense Farmer Report</title>
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body{ font-family: Arial, sans-serif; padding: 20px; }
        h1{ margin:0; }
        .box{ border:1px solid #ddd; padding:14px; border-radius:12px; margin-top:14px; }
        .muted{ color:#555; }
      </style>
    </head>
    <body>
      <h1>🌾 AgroSense Farmer Report</h1>
      <p class="muted">Generated by AgroSense</p>

      <div class="box">
        <b>Selected Inputs</b><br><br>
        Season: ${season}<br>
        Crop: ${crop}<br>
        Soil: ${soil}<br>
        Water: ${water}<br>
      </div>

      <div class="box">
        <b>Risk Analysis</b><br><br>
        ${riskHTML}
      </div>

      <div class="box">
        <b>Quick Recommendation</b><br><br>
        ${adviceHTML}
      </div>

      <script>
        window.onload = function(){ window.print(); }
      </script>
    </body>
    </html>
  `);

  win.document.close();
    }
