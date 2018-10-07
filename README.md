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

### Writing data
```javascript
store.insert({host, port, db, table, docs}) -> object
```

```javascript
store.upsert({host, port, db, table, docs, resolver}) -> object
```

``` javascript
store.delete({host, port, db, table, id}) -> object
```

### Selecting data
```javascript
store.getById({host, port, db, table, id, fields}) -> object
```

```javascript
store.getAll({host, port, db, table, fields}) -> object
```

```javascript
store.getByIndex({host, port, db, table, index, value, page, size, fields}) -> object
```

``` javascript
store.sampleByIndex({host, port, db, table, index, value, sample, fields}) -> object
```

``` javascript
store.getByIndex({host, port, db, table, index, value, page, size, fields}) -> object
```

``` javascript
store.betweenByIndex({host, port, db, table, index, from, to, page, size, fields}) -> object
```
