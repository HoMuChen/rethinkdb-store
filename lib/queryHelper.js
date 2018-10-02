const r = require('rethinkdb');

function paginate({ query, page, size }) {
  if(page === 0) {
    return query;
  }

  return query.skip((page-1) * size).limit(size);
}

function pluck({ query, fields }) {
  if(fields.length === 0 ) {
    return query;
  }

  return query.pluck( r.args(fields) );
}

module.exports = {
  paginate,
  pluck,
}
