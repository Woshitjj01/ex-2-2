const fs = require("fs");
const path = require("path");
const { JSDOM } = require("jsdom");
const { assert } = require("./helpers");

const html = fs.readFileSync(path.resolve(__dirname, "../index.html"), "utf-8");
const js = fs.readFileSync(path.resolve(__dirname, "../script.js"), "utf-8");

const dom = new JSDOM(html, { runScripts: "dangerously", resources: "usable" });
const { window } = dom;
global.window = window;
global.document = window.document;

const scriptEl = window.document.createElement("script");
scriptEl.textContent = js;
window.document.body.appendChild(scriptEl);

setTimeout(() => {
  const slides = window.document.querySelectorAll(".slide");
  slides.forEach(slide => slide.classList.remove("active"));
  slides[0].classList.add("active"); 

  const before = slides[0];
  window.prevSlide();

  const after = slides[slides.length - 1];
  const passed = before.classList.contains("active") === false &&
                 after.classList.contains("active") === true;

  assert(passed, "prevSlide cycles from first to last", "prevSlide doesn't cycle correctly");
    setTimeout(() => process.exit(0), 50);
}, 200);

