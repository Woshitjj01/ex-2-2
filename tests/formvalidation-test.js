
const fs = require("fs");
const path = require("path");
const { assert } = require("./helpers");

const jsCode = fs.readFileSync(path.join(__dirname, "../script.js"), "utf-8");

// General check: is submit event being handled?
const hasSubmitListener =
  jsCode.includes('addEventListener("submit"') ||
  jsCode.includes(".addEventListener('submit'");

// Individual field validations
const validations = [
  {
    field: "name",
    selector: 'document.getElementById("name")',
    errorSpan: 'document.getElementById("nameError")',
    message: /name\s+is\s+required/i,
  },
  {
    field: "email",
    selector: 'document.getElementById("email")',
    errorSpan: 'document.getElementById("emailError")',
    message: /enter\s+a\s+valid\s+email/i,
  },
  {
    field: "dob",
    selector: 'document.getElementById("dob")',
    errorSpan: 'document.getElementById("dobError")',
    message: /birth\s+date/i,
  },
  {
    field: "gender",
    selector: 'document.querySelector(\'input[name="gender"]:checked\')',
    errorSpan: 'document.getElementById("genderError")',
    message: /select\s+your\s+gender/i,
  },
  {
    field: "ticket",
    selector: 'document.getElementById("ticket")',
    errorSpan: 'document.getElementById("ticketError")',
    message: /ticket\s+type/i,
  },
  {
    field: "no-of-visitors",
    selector: 'document.getElementById("no-of-visitors")',
    errorSpan: 'document.getElementById("visitorsError")',
    message: /number\s+of\s+visitors/i,
  },
  {
    field: "date-of-visit",
    selector: 'document.getElementById("date-of-visit")',
    errorSpan: 'document.getElementById("visitDateError")',
    message: /visit\s+date/i,
  },
];

// Run checks
let allValid = hasSubmitListener;

validations.forEach(({ field, selector, errorSpan, message }) => {
  const hasSelector = jsCode.includes(selector);
  const hasErrorSpan = jsCode.includes(errorSpan);
  const hasMessage = jsCode.match(message);

  const passed = hasSelector && hasErrorSpan && hasMessage;
  allValid = allValid && passed;

  assert(
    passed,
    `Validation for '${field}' is implemented correctly.`,
    `Validation for '${field}' is missing or incomplete.`
  );
});

// Final combined assert for GH Classroom
assert(
  allValid,
  "All form validations are implemented properly.",
  "Some validations are missing or incorrect."
);
