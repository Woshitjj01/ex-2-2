const fs = require("fs");
const path = require("path");
const { assert } = require("./helpers");

const css = fs.readFileSync(path.join(__dirname, "../styles.css"), "utf-8");
const js = fs.readFileSync(path.join(__dirname, "../script.js"), "utf-8");


const hasStickyNav = css.includes("#mainNav") && css.includes("position: sticky");
assert(hasStickyNav, "Sticky navbar style is present", "Sticky navbar style is missing");


const menuIconHidden = /\.menu-icon\s*{[^}]*display\s*:\s*none/i.test(css);
assert(menuIconHidden, "Menu icon is hidden by default", "Menu icon is not hidden by default");


const togglesNavLinks = js.includes('navLinks.classList.toggle("show")');
assert(togglesNavLinks, "JS toggles `.show` class on navLinks", "JS does not toggle `.show` class on navLinks");

console.log("All sticky nav + responsive menu tests passed.");
