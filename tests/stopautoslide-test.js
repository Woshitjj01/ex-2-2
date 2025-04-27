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

let clearedId = null;
window.clearInterval = function (id) {
  clearedId = id;
};

window.setInterval = function () {
  return 99999; 
};

const scriptEl = window.document.createElement("script");
scriptEl.textContent = js;
window.document.body.appendChild(scriptEl);

setTimeout(() => {
  try {
    window.startAutoSlide();  
    window.stopAutoSlide();   
    assert(clearedId === 99999, "stopAutoSlide() clears the interval");
  } catch (e) {
    console.error("❌ stopAutoSlide() test failed");
    console.error(e);
    process.exit(1);
  }
}, 200);
