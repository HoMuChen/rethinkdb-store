const r = require('rethinkdb');
const util = require('./util');
const queryHelper = require('./queryHelper');

const RTK_HOST    = process.env['RTK_HOST'] || 'localhost';

const RTK_PORT    = process.env['RTK_PORT'] || 28015;

const RTK_DB      = process.env['RTK_DB'] || 'test';

const AUTO_CREATE = process.env['AUTH_CREATE'] || false;

const ENABLE_LOGS = process.env['ENABLE_LOGS'] || true;

const store = exports = module.exports = {};

const config = {
  host: RTK_HOST,
  port: RTK_PORT,
  db: RTK_DB,
}

store.r = r;

store.setConfig = function(options) {
  config.host = options.host || RTK_HOST;
  config.port = options.port || RTK_PORT;
  config.db = options.db || RTK_DB;
}

store.getConn = function({ host, port, db }) {
  return r.connect({ host, port, db });
}

store.insert = async function({ host=config.host, port=config.port, db=config.db, table, docs }) {
  const conn = await store.getConn({ host, port, db });
  const res = await r.table(table).insert(docs).run(conn);
  await conn.close();

  util.log(`insert at ${db}.${table}@${host}:${port} with ${docs.length? docs.length: 1} docs`);

  return res;
}

store.upsert = async function({ host=config.host, port=config.port, db=config.db, table, docs, resolver }) {
  const conn = await store.getConn({ host, port, db });
  const res = await r.table(table).insert(docs, { conflict: typeof(resolver) === 'function'? resolver: 'update' }).run(conn);
  await conn.close();

  util.log(`upsert at ${db}.${table}@${host}:${port} with ${docs.length? docs.length: 1} docs`);

  return res;
}

store.delete = async function({ host=config.host, port=config.port, db=config.db, table, id }) {
  const conn = await store.getConn({ host, port, db });
  const res = await r.table(table).get(id).delete().run(conn);
  await conn.close();

  util.log(`delete at ${db}.${table}@${host}:${port} with id: ${id}`);

  return res;
}

store.getById = async function({ host=config.host, port=config.port, db=config.db, table, id, fields=[] }) {
  const conn = await store.getConn({ host, port, db });

  const query = queryHelper.pluck({ query: r.table(table).get(id), fields });
  const doc = await query.run(conn);
  await conn.close();

  util.log(`getById at ${db}.${table}@${host}:${port} with id: ${id}`);

  return doc;
}

store.sampleByIndex = async function({ host=config.host, port=config.port, db=config.db, table, index, value, sample=1, fields=[] }) {
  const conn = await store.getConn({ host, port, db });

  const query = queryHelper.pluck({ query: r.table(table).getAll(value, { index }).sample(sample), fields });
  const doc = await query.run(conn);
  await conn.close();

  util.log(`sampleById at ${db}.${table}@${host}:${port} with index/value: ${index/value} sample: ${sample}`);

  return doc;
}

store.getByIndex = async function({ host=config.host, port=config.port, db=config.db, table, index, value, page=1, size=50, fields=[] }) {
  const conn = await store.getConn({ host, port, db });

  const query = queryHelper.pluck({ query: queryHelper.paginate({ query: r.table(table).getAll(value, { index }), page, size }), fields })
  const cur = await query.run(conn);
  const docs = await cur.toArray();
  await conn.close();

  util.log(`getByIndex at ${db}.${table}@${host}:${port} with index/value: ${index}/${value}`);

  return docs;
}

store.getBetweenIndex = async function({ host=config.host, port=config.port, db=config.db, table, index, from, to, page=1, size=50, fields=[] }) {
  const conn = await store.getConn({ host, port, db });

  const query = queryHelper.pluck({ query: queryHelper.paginate({ query: r.table(table).between(from, to, { index }), page, size }), fields })
  const cur = await query.run(conn);
  const docs = await cur.toArray();
  await conn.close();

  util.log(`getBetweenIndex at ${db}.${table}@${host}:${port} with index/from~to: ${index}/${from}~${to}`);

  return docs;
}

store.filter = async function({ host=config.host, port=config.port, db=config.db, table, filter, page=1, size=50, fields=[] }) {
  const conn = await store.getConn({ host, port, db });

  const query = queryHelper.pluck({ query: queryHelper.paginate({ query: r.table(table).filter(filter), page, size }), fields })
  const cur = await query.run(conn);
  const docs = await cur.toArray();
  await conn.close();

  util.log(`filter at ${db}.${table}@${host}:${port} with keys: ${Object.keys(filter)} and values: ${Object.values(filter)}`);

  return docs;
}
