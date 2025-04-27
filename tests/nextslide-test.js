const { assert } = require("./helpers");
const fs = require("fs");
const path = require("path");
const { JSDOM } = require("jsdom");

const html = fs.readFileSync(path.resolve(__dirname, "../index.html"), "utf-8");
const js = fs.readFileSync(path.resolve(__dirname, "../script.js"), "utf-8");

const dom = new JSDOM(html, {
  runScripts: "dangerously",
  resources: "usable"
});

const { window } = dom;
global.window = window;
global.document = window.document;

const scriptEl = window.document.createElement("script");
scriptEl.textContent = js;
window.document.body.appendChild(scriptEl);

setTimeout(() => {
  try {
    const slides = window.document.querySelectorAll(".slide");
    if (slides.length < 2) throw new Error("❌ Not enough slides to test");

    
    let wasCalled = false;
    let calledWith = null;

    
    window.showSlide = function (index) {
      wasCalled = true;
      calledWith = index;
    };

    
    window.currentSlide = slides.length - 1;

    
    if (typeof window.nextSlide !== "function") {
      throw new Error("❌ nextSlide is not defined");
    }

    window.nextSlide();

    assert(
      wasCalled,
      "nextSlide() calls showSlide()", "nextSlide() doesn't call showSlide()"
    );


  } catch (err) {
    console.error(err.message || "❌ nextSlide() test failed");
    process.exit(1);
  }

  setTimeout(() => process.exit(0), 50);
}, 200);
