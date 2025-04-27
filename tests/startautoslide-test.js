const fs = require("fs");
const path = require("path");
const { JSDOM } = require("jsdom");
const { assert } = require("./helpers");

// Setup
const html = fs.readFileSync(path.resolve(__dirname, "../index.html"), "utf-8");
const js = fs.readFileSync(path.resolve(__dirname, "../script.js"), "utf-8");

const dom = new JSDOM(html, { runScripts: "dangerously", resources: "usable" });
const { window } = dom;
global.window = window;
global.document = window.document;

// SPY on setInterval
let called = false;
window.setInterval = function (fn, delay) {
  called = true;
  return 12345; // fake interval ID
};

const scriptEl = window.document.createElement("script");
scriptEl.textContent = js;
window.document.body.appendChild(scriptEl);

setTimeout(() => {
  try {
    window.startAutoSlide();
    assert(called, "startAutoSlide() sets up interval");
  } catch (e) {
    console.error("❌ startAutoSlide() test failed");
    console.error(e);
    process.exit(1);
  }
}, 200);
