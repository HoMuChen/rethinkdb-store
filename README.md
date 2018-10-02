# rethinkdb-store
A high level nodejs library for accessing rethinkdb data.

## Install
``` bash 
$ npm install rethinkdb-store
```

## Usage
```javascript
const store = require('rethinkdb-store');

//Or config througth environment vars `RTK_HOST`, `RTK_PORT`, `RTK_DB`
store.setConfig({
  host: 'localhost',
  port: 28015,
  db: 'test'
})
```
