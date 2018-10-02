const util = exports = module.exports = {};

const ENABLE_LOGS = process.env['ENABLE_LOGS'] || true;

util.log = function() {
  if (ENABLE_LOGS) {
    console.log.apply(
      console.log, 
      ['[rethinkdb-store]', new Date().toISOString()].concat(Object.values(arguments))
    );
  }
}
