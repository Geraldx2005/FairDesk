// ================= SIDEBAR TOGGLE =================

const navToggle = document.querySelector(".nav-toggle");
const sideNav = document.querySelector(".side-nav");

navToggle.addEventListener("click", () => {
  navToggle.classList.toggle("active");
  sideNav.classList.toggle("nav-panel-toggle"); // FIXED (removed stray 'z')
});

// ================= GENERIC NAV GROUP TOGGLE =================
// Works for View, Datasheet, and any future groups

function toggleNavGroup(wrapper) {
  const menu = wrapper.querySelector(".nav-labels-opt");
  if (!menu) return;

  const isOpen = menu.style.height && menu.style.height !== "0px";

  if (isOpen) {
    menu.style.height = "0px";
  } else {
    menu.style.height = menu.scrollHeight + "px";
  }
}

window.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".nav-opt-wrap").forEach(wrapper => {
    const menu = wrapper.querySelector(".nav-labels-opt");
    if (!menu) return;

    // disable animation for initial open
    menu.classList.add("no-transition");

    if (menu.querySelector(".nav-items.active")) {
      menu.style.height = menu.scrollHeight + "px";
    }

    // re-enable animation AFTER paint
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        menu.classList.remove("no-transition");
      });
    });
  });
});


// Attach toggle to ALL nav groups
document.querySelectorAll(".nav-opt-wrap").forEach(wrapper => {
  const toggle = wrapper.querySelector(":scope > .nav-items");
  if (!toggle) return;

  toggle.addEventListener("click", (e) => {
    if (e.target.closest(".nav-labels-opt")) return; // 🔥 THE FIX

    e.stopPropagation();
    toggleNavGroup(wrapper);
  });
});

// Prevent option clicks from closing the dropdown
document.querySelectorAll(".nav-opt-wrap .nav-labels-opt").forEach(menu => {
  menu.addEventListener("click", (e) => {
    e.stopPropagation();
  });
});

// ================= AUTO-OPEN ON PAGE LOAD =================

// window.addEventListener("DOMContentLoaded", () => {
//   const currentPath = window.location.pathname;

//   document.querySelectorAll(".nav-opt-wrap").forEach(wrapper => {
//     const menu = wrapper.querySelector(".nav-labels-opt");
//     if (!menu) return;

//     // Auto-open when inside form or display pages
//     if (
//       currentPath.startsWith("/fairdesk/form/") ||
//       currentPath.startsWith("/fairdesk/disp/")
//     ) {
//       menu.style.height = menu.scrollHeight + "px";
//     }
//   });
// });

// ================= CARE SECTION =================

const navCareOpt = document.querySelector(".nav-care-opt");
const careToggle = document.querySelector(".care-toggle");

let isCareOpen = false;

function toggleCareHeight() {
  if (!navCareOpt) return;

  if (!isCareOpen) {
    navCareOpt.style.height = navCareOpt.scrollHeight + "px";
  } else {
    navCareOpt.style.height = "0px";
  }
  isCareOpen = !isCareOpen;
}

if (careToggle) {
  careToggle.addEventListener("click", toggleCareHeight);
}

// Auto-open Care pages
window.addEventListener("DOMContentLoaded", () => {
  if (!navCareOpt) return;

  const carePages = [
    "/fairdesk/form/systemid",
    "/fairdesk/form/carecallreport",
    "/fairdesk/form/careworkshopreport",
    "/fairdesk/form/carelead",
    "/fairdesk/form/carequote",
  ];

  if (carePages.includes(window.location.pathname)) {
    navCareOpt.style.height = navCareOpt.scrollHeight + "px";
    isCareOpen = true;
  }
});

// ================= CALC SECTION =================

const navCalcOpt = document.querySelector(".nav-calc-opt");
const calcToggle = document.querySelector(".calc-toggle");

let isCalcOpen = false;

function toggleCalcHeight() {
  if (!navCalcOpt) return;

  if (!isCalcOpen) {
    navCalcOpt.style.height = navCalcOpt.scrollHeight + "px";
  } else {
    navCalcOpt.style.height = "0px";
  }
  isCalcOpen = !isCalcOpen;
}

if (calcToggle) {
  calcToggle.addEventListener("click", toggleCalcHeight);
}

// Auto-open Calc pages
window.addEventListener("DOMContentLoaded", () => {
  if (!navCalcOpt) return;

  const calcPages = [
    "/fairdesk/form/salescalc",
    "/fairdesk/form/prodcalc",
  ];

  if (calcPages.includes(window.location.pathname)) {
    navCalcOpt.style.height = navCalcOpt.scrollHeight + "px";
    isCalcOpen = true;
  }
});

// ================= INPUT UPPERCASE =================

document.querySelectorAll("input").forEach(input => {
  input.addEventListener("input", function () {
    this.value = this.value.toUpperCase();
  });
});
