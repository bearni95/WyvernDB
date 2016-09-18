# WyvernDB
##WyvernDB: Persistent, client side javascript database

WyvernDB is an SQL inspired database that runs on client-side javascript. 
The database engine stores it's values in localStorage at any change to keep a local and persistent copy of the database as well as the copy in memory.

##Usage:
######Including
```html
<script src="wyvern.js"></script>
```

##Creating a database
```javascript
var db = new WyvernDB('database_name');
```

##Creating tables
```javascript
var columns = [
  {
    name : 'id',
    unique : true,
  }, 
  {
    name : 'value',
  },
]
db.add_table('table_name', columns);
```
