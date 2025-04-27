function assert(condition, successMsg, failMsg) {
  if (condition) {
    console.log(`✅ ${successMsg}`);
  } else {
    console.error(`❌ ${failMsg}`);
    process.exit(1);
  }
}

module.exports = { assert };
