/* =========================================
   AGROSENSE — MAIN SCRIPT
========================================= */

/* =========================================
   INTRO
========================================= */

window.addEventListener("load", () => {

  const intro =
    document.getElementById("intro");

  if(intro){

    setTimeout(() => {

      intro.classList.add("hide");

    }, 2200);

  }

  initializeReveal();

  initializeNavbar();

});

/* =========================================
   REVEAL ANIMATION
========================================= */

function initializeReveal(){

  const elements =
    document.querySelectorAll(
      ".section-card, .tool-card, .form-card"
    );

  const observer =
    new IntersectionObserver((entries) => {

      entries.forEach((entry) => {

        if(entry.isIntersecting){

          entry.target.classList.add("show");

        }

      });

    }, {
      threshold:0.12
    });

  elements.forEach((el) => {
    observer.observe(el);
  });

}

/* =========================================
   NAVBAR EFFECT
========================================= */

function initializeNavbar(){

  const navbar =
    document.querySelector(".topbar");

  if(!navbar) return;

  window.addEventListener("scroll", () => {

    if(window.scrollY > 40){

      navbar.classList.add("scrolled");

    }else{

      navbar.classList.remove("scrolled");

    }

  });

}

/* =========================================
   SMOOTH SCROLL
========================================= */

document.querySelectorAll('a[href^="#"]')
.forEach((anchor) => {

  anchor.addEventListener("click", function(e){

    const targetId =
      this.getAttribute("href");

    if(targetId === "#") return;

    const target =
      document.querySelector(targetId);

    if(!target) return;

    e.preventDefault();

    target.scrollIntoView({
      behavior:"smooth",
      block:"start"
    });

  });

});

/* =========================================
   BUTTON INTERACTION
========================================= */

document.querySelectorAll(".btn")
.forEach((button) => {

  button.addEventListener("mouseenter", () => {

    button.style.transform =
      "translateY(-2px)";

  });

  button.addEventListener("mouseleave", () => {

    button.style.transform =
      "translateY(0)";

  });

});

/* =========================================
   TOOL CARD HOVER
========================================= */

document.querySelectorAll(".tool-card")
.forEach((card) => {

  card.addEventListener("mousemove", (e) => {

    const rect =
      card.getBoundingClientRect();

    const x =
      e.clientX - rect.left;

    const y =
      e.clientY - rect.top;

    card.style.background = `
      radial-gradient(
        circle at ${x}px ${y}px,
        rgba(255,255,255,0.10),
        rgba(255,255,255,0.03)
      )
    `;

  });

  card.addEventListener("mouseleave", () => {

    card.style.background =
      "rgba(255,255,255,0.04)";

  });

});
