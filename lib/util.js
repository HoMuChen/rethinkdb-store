const util = exports = module.exports = {};

const DISABLE_LOGS = process.env['DISABLE_LOGS'] || false;

util.log = function() {
  if (DISABLE_LOGS) {
    return;
  }

  console.log.apply(
    console.log, 
    ['[rethinkdb-store]', new Date().toISOString()].concat(Object.values(arguments))
  );
}
