let navToggle = document.querySelector(".nav-toggle");
let navCareOpt = document.querySelector(".nav-care-opt");
let navLabelsOpt = document.querySelector(".nav-labels-opt");
let navBar = document.querySelector(".side-nav");
let careToggle = document.querySelector(".care-toggle");
let datasheetToggle = document.querySelector(".datasheet-toggle");
let sideNav = document.querySelector(".side-nav");
let navItemsPara = document.querySelectorAll(".nav-items-para");

let navCalcOpt = document.querySelector(".nav-calc-opt");
let calcToggle = document.querySelector(".calc-toggle");

navToggle.addEventListener("click", () => {
  navToggle.classList.toggle("active");
});

navToggle.addEventListener("click", () => {
  sideNav.classList.toggle("nav-panel-toggle");z
});

let isDatasheetOpen = false;

// Check if the current page is always open
window.addEventListener("DOMContentLoaded", () => {
  const alwaysOpenPages = ["/fairdesk/form/labels", "/fairdesk/form/ttr", "/fairdesk/form/tape"];
  const currentPath = window.location.pathname;

  if (alwaysOpenPages.includes(currentPath)) {
    navLabelsOpt.style.height = "auto";
    isDatasheetOpen = true;
  }
});

// Toggle the datasheet options height
function toggleDatasheetHeight() {
  console.log("datasheet clicked");
  if (!isDatasheetOpen) {
    navLabelsOpt.style.height = navLabelsOpt.scrollHeight + "px";
  } else {
    navLabelsOpt.style.height = "0px";
  }
  isDatasheetOpen = !isDatasheetOpen;
}

let isCareOpen = false;

// Toggle the care options height
function toggleCareHeight() {
  if (!isCareOpen) {
    navCareOpt.style.height = navCareOpt.scrollHeight + "px";
  } else {
    navCareOpt.style.height = "0px";
  }
  isCareOpen = !isCareOpen;
}

// Keep it open by default on specific pages
window.addEventListener("DOMContentLoaded", () => {
  const alwaysOpenPages = ["/fairdesk/form/systemid", "/fairdesk/form/carecallreport", "/fairdesk/form/careworkshopreport", "/fairdesk/form/carelead", "/fairdesk/form/carequote"]; // Replace with your actual care-related paths
  const currentPath = window.location.pathname;

  if (alwaysOpenPages.includes(currentPath)) {
    navCareOpt.style.height = "auto";
    isCareOpen = true;
  }
});

let isCalcOpen = false;

// Keep it open by default on specific pages
window.addEventListener("DOMContentLoaded", () => {
  const alwaysOpenPages = ["/fairdesk/form/salescalc", "/fairdesk/form/prodcalc"];
  const currentPath = window.location.pathname;

  if (alwaysOpenPages.includes(currentPath)) {
    navCalcOpt.style.height = "auto";
    isCalcOpen = true;
  }
});

// Toggle the care options height
function toggleCalcHeight() {
  console.log("calc clicked");
  if (!isCalcOpen) {
    navCalcOpt.style.height = navCalcOpt.scrollHeight + "px";
  } else {
    navCalcOpt.style.height = "0px";
  }
  isCalcOpen = !isCalcOpen;
}

// Event listeners for toggling the care and datasheet options
datasheetToggle.addEventListener("click", () => toggleDatasheetHeight());
// calcToggle.addEventListener("click", toggleCalcHeight);
// careToggle.addEventListener("click", () => toggleCareHeight());


// Make input to uppercase
let input = document.querySelectorAll("input");
input.forEach((input) => {
  input.addEventListener("input", function () {
    this.value = this.value.toUpperCase();
  });
});