function checkRisk() {
  let season = document.getElementById("season").value;
  let crop = document.getElementById("crop").value;
  let soil = document.getElementById("soil").value;
  let water = document.getElementById("water").value;
  let result = document.getElementById("result");

  if (!season || !crop || !soil || !water) {
    result.style.background = "#ffebee";
    result.innerHTML = "❗ Please fill all details.";
    return;
  }

  let risk = "Low";
  let reason = "";
  let suggestions = "";
  let waterNeed = "";
  let investmentSafety = "";

  // 💧 Water Requirement
  if (crop === "rice" || crop === "sugarcane") {
    waterNeed = "🚰 High Water Requirement";
  } 
  else if (crop === "wheat" || crop === "maize" || crop === "soybean") {
    waterNeed = "💦 Medium Water Requirement";
  } 
  else {
    waterNeed = "💧 Low Water Requirement";
  }

  // 🔴 High Risk conditions
  if ((crop === "rice" || crop === "sugarcane") && water === "rain") {
    risk = "High";
    reason = "This crop needs assured water. Rain is risky.";
  }

  if (soil === "sandy" && (crop === "rice" || crop === "sugarcane")) {
    risk = "High";
    reason = "Sandy soil cannot hold enough water for this crop.";
  }

  // 🟡 Medium Risk condition
  if (crop === "wheat" && season !== "rabi") {
    risk = "Medium";
    reason = "Wheat grows best in Rabi season.";
  }

  // 🟢 Safe condition
  if ((crop === "bajra" || crop === "jowar") && soil === "sandy") {
    risk = "Low";
    reason = "This crop suits sandy soil and low water.";
  }

  // 🔁 Crop Suggestions
  if (risk !== "Low") {
    if (soil === "sandy") {
      suggestions = "Try: Bajra, Jowar, Groundnut (less water, safer)";
    } 
    else if (soil === "black") {
      suggestions = "Try: Soybean, Cotton (best for black soil)";
    } 
    else if (soil === "loamy") {
      suggestions = "Try: Maize, Wheat, Vegetables (balanced soil)";
    } 
    else {
      suggestions = "Try: Maize, Bajra, Soybean";
    }
  }

  // 💰 Investment Safety Meter
  if (risk === "High") {
    investmentSafety = "🔴 High Loss Risk – Avoid heavy investment";
  } 
  else if (risk === "Medium") {
    investmentSafety = "🟡 Moderate Risk – Invest carefully";
  } 
  else {
    investmentSafety = "🟢 Safe Investment – Conditions are favorable";
  }

  // 📊 Final Output
  if (risk === "High") {
    result.style.background = "#ffcdd2";
    result.innerHTML = `
      🔴 High Risk<br>
      ${reason}<br><br>
      ${waterNeed}<br>
      ${investmentSafety}<br><br>
      🔁 <b>Safer Crop Suggestions:</b><br>
      ${suggestions}
    `;
  } 
  else if (risk === "Medium") {
    result.style.background = "#fff9c4";
    result.innerHTML = `
      🟡 Medium Risk<br>
      ${reason}<br><br>
      ${waterNeed}<br>
      ${investmentSafety}<br><br>
      🔁 <b>Safer Crop Suggestions:</b><br>
      ${suggestions}
    `;
  } 
  else {
    result.style.background = "#c8e6c9";
    result.innerHTML = `
      🟢 Low Risk<br>
      This combination is safe for farming.<br><br>
      ${waterNeed}<br>
      ${investmentSafety}
    `;
  }
}