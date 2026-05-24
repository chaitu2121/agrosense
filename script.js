/* =========================================
   AGROSENSE AI — CORE SCRIPT
========================================= */

/* -----------------------------------------
   Intro Loader
----------------------------------------- */

window.addEventListener("load", () => {

  const intro = document.getElementById("intro");

  if (intro) {

    setTimeout(() => {
      intro.classList.add("hide");
    }, 900);

  }

  initializeRevealSystem();
  initializeFooterYear();
  initializeNotes();

});

/* -----------------------------------------
   Footer Year
----------------------------------------- */

function initializeFooterYear(){

  const year = document.getElementById("year");

  if(year){
    year.textContent = new Date().getFullYear();
  }

}

/* -----------------------------------------
   Scroll Reveal System
----------------------------------------- */

function initializeRevealSystem(){

  const revealElements =
    document.querySelectorAll(".reveal");

  if(!revealElements.length) return;

  const observer =
    new IntersectionObserver((entries) => {

      entries.forEach((entry) => {

        if(entry.isIntersecting){

          entry.target.classList.add("is-visible");

          observer.unobserve(entry.target);

        }

      });

    }, {
      threshold: 0.12
    });

  revealElements.forEach((el) => {
    observer.observe(el);
  });

}

/* -----------------------------------------
   Smooth Section Jump
----------------------------------------- */

function jumpTo(id){

  const target = document.getElementById(id);

  if(!target) return;

  target.scrollIntoView({
    behavior: "smooth",
    block: "start"
  });

}

/* =========================================
   CROP RISK ENGINE
========================================= */

function checkRisk(){

  const season =
    document.getElementById("season").value;

  const crop =
    document.getElementById("crop").value;

  const soil =
    document.getElementById("soil").value;

  const water =
    document.getElementById("water").value;

  const result =
    document.getElementById("result");

  const quickAdvice =
    document.getElementById("quickAdvice");

  if(
    !season ||
    !crop ||
    !soil ||
    !water
  ){

    renderResult(
      result,
      "Please complete all fields before analysis."
    );

    return;

  }

  let risk = "Low";
  let reason = "";
  let suggestions = [];
  let waterNeed = "";
  let investment = "";

  /* -----------------------------------------
     Water Logic
  ----------------------------------------- */

  if(
    crop === "rice" ||
    crop === "sugarcane"
  ){

    waterNeed = "High water requirement";

  }
  else if(
    crop === "wheat" ||
    crop === "maize" ||
    crop === "soybean"
  ){

    waterNeed = "Moderate water requirement";

  }
  else{

    waterNeed = "Lower water requirement";

  }

  /* -----------------------------------------
     Risk Logic
  ----------------------------------------- */

  if(
    (crop === "rice" || crop === "sugarcane")
    && water === "rain"
  ){

    risk = "High";

    reason =
      "The selected crop requires stable irrigation support.";

  }

  if(
    soil === "sandy" &&
    (crop === "rice" || crop === "sugarcane")
  ){

    risk = "High";

    reason =
      "Sandy soil has weak water retention for this crop.";

  }

  if(
    crop === "wheat" &&
    season !== "winter"
  ){

    risk = "Medium";

    reason =
      "Wheat performs best during winter season.";

  }

  if(
    crop === "onion" &&
    season === "summer" &&
    water === "rain"
  ){

    risk = "High";

    reason =
      "Summer onion farming without irrigation has elevated risk.";

  }

  /* -----------------------------------------
     Safer Suggestions
  ----------------------------------------- */

  if(risk !== "Low"){

    if(soil === "sandy"){

      suggestions = [
        "Bajra",
        "Jowar",
        "Groundnut"
      ];

    }
    else if(soil === "black"){

      suggestions = [
        "Soybean",
        "Cotton"
      ];

    }
    else{

      suggestions = [
        "Maize",
        "Soybean",
        "Bajra"
      ];

    }

  }

  /* -----------------------------------------
     Investment Logic
  ----------------------------------------- */

  if(risk === "High"){

    investment =
      "High loss exposure. Avoid heavy investment.";

  }
  else if(risk === "Medium"){

    investment =
      "Moderate risk. Invest carefully.";

  }
  else{

    investment =
      "Conditions are currently supportive.";

  }

  /* -----------------------------------------
     Final Output
  ----------------------------------------- */

  const html = `
    <strong>Risk Level:</strong> ${risk}<br><br>

    <strong>Reason:</strong><br>
    ${reason || "Current conditions are acceptable."}<br><br>

    <strong>Water Profile:</strong><br>
    ${waterNeed}<br><br>

    <strong>Investment Outlook:</strong><br>
    ${investment}<br><br>

    ${
      suggestions.length
      ? `
      <strong>Suggested Alternatives:</strong><br>
      ${suggestions.join(", ")}
      `
      : ""
    }
  `;

  result.innerHTML = html;

  if(quickAdvice){

    quickAdvice.innerHTML = `
      <strong>${risk} Risk</strong><br><br>
      ${investment}
    `;

  }

}

/* =========================================
   WATER CALCULATOR
========================================= */

function calcWater(){

  const crop =
    document.getElementById("w_crop").value;

  const acres =
    parseFloat(
      document.getElementById("w_acres").value
    );

  const source =
    document.getElementById("w_source").value;

  const output =
    document.getElementById("waterResult");

  if(
    !crop ||
    !acres ||
    !source
  ){

    renderResult(
      output,
      "Please complete all water analysis fields."
    );

    return;

  }

  let waterPerAcre = 0;

  switch(crop){

    case "rice":
      waterPerAcre = 120;
      break;

    case "wheat":
      waterPerAcre = 70;
      break;

    case "cotton":
      waterPerAcre = 85;
      break;

    case "soybean":
      waterPerAcre = 55;
      break;

    default:
      waterPerAcre = 50;

  }

  const total =
    waterPerAcre * acres;

  let risk = "Moderate";

  if(
    source === "rain" &&
    crop === "rice"
  ){

    risk = "High";

  }
  else if(
    source === "canal"
  ){

    risk = "Lower";

  }

  output.innerHTML = `
    <strong>Estimated Water Need:</strong><br>
    ${total} units<br><br>

    <strong>Water Source Risk:</strong><br>
    ${risk}<br><br>

    <strong>Recommendation:</strong><br>
    Monitor seasonal water availability before expansion.
  `;

}

/* =========================================
   SEED CALCULATOR
========================================= */

function calcSeed(){

  const crop =
    document.getElementById("seed_crop").value;

  const acres =
    parseFloat(
      document.getElementById("seed_acres").value
    );

  const result =
    document.getElementById("seedResult");

  if(
    !crop ||
    !acres
  ){

    renderResult(
      result,
      "Please complete all seed fields."
    );

    return;

  }

  let seedRate = 0;
  let variety = "";

  switch(crop){

    case "rice":
      seedRate = 12;
      variety = "Medium duration hybrid";
      break;

    case "wheat":
      seedRate = 40;
      variety = "HD series";
      break;

    case "soybean":
      seedRate = 30;
      variety = "JS series";
      break;

    case "maize":
      seedRate = 8;
      variety = "Single cross hybrid";
      break;

    default:
      seedRate = 10;

  }

  const totalSeed =
    seedRate * acres;

  result.innerHTML = `
    <strong>Estimated Seed Requirement:</strong><br>
    ${totalSeed} kg<br><br>

    <strong>Suggested Variety Direction:</strong><br>
    ${variety}
  `;

}

/* =========================================
   NOTES SYSTEM
========================================= */

function initializeNotes(){

  const notesBox =
    document.getElementById("notesBox");

  if(!notesBox) return;

  const saved =
    localStorage.getItem("agrosense_notes");

  if(saved){
    notesBox.value = saved;
  }

}

function saveNotes(){

  const notes =
    document.getElementById("notesBox");

  const status =
    document.getElementById("notesStatus");

  if(!notes) return;

  localStorage.setItem(
    "agrosense_notes",
    notes.value
  );

  renderResult(
    status,
    "Notes saved successfully."
  );

}

function clearNotes(){

  const notes =
    document.getElementById("notesBox");

  const status =
    document.getElementById("notesStatus");

  if(notes){
    notes.value = "";
  }

  localStorage.removeItem(
    "agrosense_notes"
  );

  renderResult(
    status,
    "Notes cleared."
  );

}

/* =========================================
   SHARED RESULT HELPER
========================================= */

function renderResult(element, message){

  if(!element) return;

  element.innerHTML = `
    <strong>Status</strong><br><br>
    ${message}
  `;

}
