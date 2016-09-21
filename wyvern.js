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
	var database = this;

	this.guid = function() {
		function s4(){
			return Math.floor((1 + Math.random()) * 0x100000).toString(16).substring(1);
		}
		return s4() + s4() + '-' + s4() + s4() + '-' + s4() + s4() + '-' + s4() + s4()
	}

	this.size = function (){
		var result = {
			wyvern_total_count : 0,
		}
		for (var table in database.tables){
			result[table] = JSON.stringify(database.tables[table]).length;
			result['wyvern_total_count'] += result[table]
		}

		return result;
	}

	this.create_table = function (name, columns, options){
		if (!database.tables){
			database.tables = {};
		}
		if (database.tables[name]){
			throw 'Table ' + name + ' already exists.';
			return null;
		}

		if (!options.autoincrement_index){
			options.autoincrement_index = 0;
		}

		database.tables[name] = {
			columns : columns,
			rows : [],
			options : options,
		};
		console.log('Table ' + name + ' created.');
		local_storage(database.name, database.tables)
	}

	this.insert = function (table, rows){
		var columns = database.tables[table]['columns'];
		var index_columns = [];

		if (typeof rows != 'array'){
			rows = [rows]
		}

		if (database.tables[table]['unique']){
			index_columns = database.tables[table]['unique']
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

				rows[i]['create_timestamp'] = new Date().getTime();
				rows[i]['last_modified_timestamp'] = new Date().getTime();

				if (database.tables[table]['options']['guid']){
					for (var j = 0; j < database.tables[table]['options']['guid'].length; j++){
						row[database.tables[table]['options']['guid'][j]] = database.guid();
					}
				}

				if (database.tables[table]['options']['autoincrement']){
					for (var j = 0; j < database.tables[table]['options']['autoincrement'].length; j++){
						row[database.tables[table]['options']['autoincrement'][j]] = database.tables[table]['options']['autoincrement_index'];
					}
					
				}
			}

			if (database.tables[table]['options']['autoincrement']){
				database.tables[table]['options']['autoincrement_index']++;
			}
		}

		database.tables[table].rows = database.tables[table].rows.concat(rows);
		local_storage(database.name, database.tables);
		return (true, rows);			
	}
	
	this.select = function (table, where){
		
		var results = database.tables[table].rows.filter(function (row){			
			extract(row, this)
			if (typeof eval(where) === 'boolean'){
				if (eval(where)){
					return row;
				}
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
			row[i]['last_modified_timestamp'] = new Date().getTime();
		}

		local_storage(database.name, database.tables);
		return (true, rows);			
	}




	return this;
}