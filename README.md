# WyvernDB :dragon_face:
##WyvernDB: Persistent, client side javascript database

WyvernDB is an SQL inspired database that runs on client-side javascript. 
The database engine stores it's values in localStorage at any change to keep a local and persistent copy of the database as well as the copy in memory.

It is developed as an implementation of Android's SQLite for the web, specially for hybrid mobile apps that require persisten client storage.

##Usage:
######Including
```html
<script src="wyvern.js"></script>
```

######Creating a database
```javascript
var db = new WyvernDB('database_name');
```

######Creating tables
Tables require the column object to be added as a second parameter. 
The "unique" field guarantees that the value of the column is unique accross the table.

```javascript
var columns = [
  'id',
  'value',
]

```
The options parameter contains the index information and is optional.
If passed to the table creator function it must contain the *unique* key referencing an array of columns.

If no more options are added the indexes will have to be generated from client. 
For automatic index generation use *autoincrement* to a MySQL-like automatic counter or *guid* to assign random Guids to indexed fields.

```javascript
var options = {
	unique : ['id'],
	//autoincrement : ['id'],
	//guid : ['id'],
}
db.create_table('table_name', columns, options);
```
######Inserting rows
```javascript
var result = db.insert('table_name', {id:3, value:'value3'})
```

######Updating rows
```javascript
var result = db.update('table_name', {id:1, value:'value1_mod'})
```
######Selecting rows
The second parameter must be a valid javascript boolean operation between columns.
```javascript
var result = db.select('table_name', 'id < 50')
```
######Removing rows
The second parameter must be a valid javascript boolean operation between columns.
```javascript
var result = db.remove('table_name', 'id === 0')
```

##License
The MIT License (MIT)

Copyright (c) 2016 - bernatcanal

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
