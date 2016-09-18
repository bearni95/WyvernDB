function in_array(array, element){
	try{
		if (array.indexOf(element) >= 0){
			return true;
		}
		return false;
	} catch (e){
		console.log(e);
	}
}

function extract(data, where) {
    for (var key in data) {
        where[key] = data[key];
    }
}

local_storage = function(database_name, database_object){
	try{
		var local_storage_prefix = 'WyvernDB-';
		if (database_object){
			localStorage.setItem(local_storage_prefix + database_name, JSON.stringify(database_object));
		} else {
			return JSON.parse( localStorage.getItem(local_storage_prefix + database_name) );
		}
	} catch (e){
		console.log(e);
	}
}


function WyvernDB (name){
	var tables = local_storage(name);
	if (tables){
		this.name = name;
		this.tables = tables;

		console.log('Database ' + name + ' imported.')
	} else {
		this.name = name;
		this.tables = {};
		console.log('Database ' + name + ' created.')
		local_storage(name, this.tables);
	}

	var database = this;

	this.add_table = function (name, columns){
		if (!database.tables){
			database.tables = {};
		}
		if (database.tables[name]){
			throw 'Table ' + name + ' already exists.';
			return null;
		}

		database.tables[name] = {
			columns : columns,
			rows : [],
		};
		console.log('Table ' + name + ' created.');
		local_storage(database.name, database.tables)
	}

	this.insert = function (table, rows){
		var columns = [];
		var index_columns = [];

		if (typeof rows != 'array'){
			rows = [rows]
		}

		for (var i = 0; i < database.tables[table]['columns'].length; i++){
			columns.push(database.tables[table]['columns'][i]['name']);

			if (database.tables[table]['columns'][i]['unique']){
				index_columns.push(database.tables[table]['columns'][i]['name'])
			}
		}

		
		for (var i = 0; i < rows.length; i++){
			var row = rows[i];
			for (var key in row){
				if (!in_array(columns, key)){
					throw 'Key ' + key + ' not in set of columns ' + columns + ' for table ' + table;
					return null;
				}

				if (in_array(index_columns, key)){
					var exists = database.tables[table].rows.filter(function (elem){
						if (elem[key] === row[key]){
							throw 'Row with indexed column ' + key +' already exists. Try update instead.';
							return null;
						}
					})
				}
			}
		}

		database.tables[table].rows = database.tables[table].rows.concat(rows);
		local_storage(database.name, database.tables);
		return (true, rows);			
	}
	
	this.select = function (table, where){
		var results = database.tables[table].rows.filter(function (row){
			extract(row, this)
			if (eval(where)){
				return row;
			}
		})

		return results;
	}

	this.remove = function (table, where){
		var results = [];
		database.tables[table].rows.forEach(function (row, i){
			extract(row, this);
			if (eval(where)){
				database.tables[table].rows.splice(i, 1);
				results.push(row);
			}
		})
		local_storage(database.name, database.tables)
		return results;
	}

	this.update = function (table, rows){
		var columns = [];
		var index_columns = [];

		if (typeof rows != 'array'){
			rows = [rows]
		}
		for (var i = 0; i < database.tables[table]['columns'].length; i++){
			columns.push(database.tables[table]['columns'][i]['name']);

			if (database.tables[table]['columns'][i]['unique']){
				index_columns.push(database.tables[table]['columns'][i]['name'])
			}
		}

		
		for (var i = 0; i < rows.length; i++){
			var row = rows[i];
			for (var key in row){
				if (!in_array(columns, key)){
					throw 'Key ' + key + ' not in set of columns ' + columns + ' for table ' + table;
					return null;
				}

				if (in_array(index_columns, key)){			
					for (var i = 0; i < database.tables[table].rows.length; i++){
						var elem = database.tables[table].rows[i];
						if (elem[key] === row[key]){
							database.tables[table].rows[i] = row;
						}
					}		
				}
			}
		}

		local_storage(database.name, database.tables);
		return (true, rows);			
	}




	return this;
}