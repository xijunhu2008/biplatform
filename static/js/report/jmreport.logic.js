/**
 * 数据二次处理逻辑类
 * 每个逻辑类都依赖iniData函数接入
 */
jmreport.logic = {
	//所有逻辑类
	logics: {},
	reg: function(name, logic) {
		this.logics[name] = logic;
	},
	run: function(config, data) {
		if(Object.prototype.toString.call(config) == '[object Array]') {
			for(var i=0;i<config.length;i++) {
				data = this.run(config[i], data);
			}
		}
		else {
			var logic = this.logics[config.name];
			if(logic && logic.initData) {
				data = logic.initData(config, data);
			}
		}
		return data;
	},
	//从已有的行中找出值一样的行
	getItem: function(rows, row) {
		for(var i=0;i<rows.length;i++) {
			var isequal = true;
			for(var k in row) {
				if(typeof row[k] == 'function') continue;
				if(row[k] != rows[i][k]) {
					isequal = false;
					break;
				}
			}
			if(isequal) {
				return rows[i];
			}
		}
		return null;
	}
};

//行转列逻辑类
jmreport.logic.reg('RowToColumn', {
	initData: function(config, data) {
		if(!config || !config.keys || !config.toColumn || !config.subColumns) {
			console.info('行转列逻辑类配置错误');
			console.info(config);
			return data;
		}
		var tocolumns = [];
		var subcolumns = [];
		var othercolumns = [];

		var rows = [];
		var columns = [];

		for(var i=0;i<data.fields.length;i++) {
			var c = data.fields[i];
			//行转为列的可能有多个，并用/分开，表示父子关系
			if(c.name == config.toColumn || 
				config.toColumn.indexOf(c.name + '/') === 0 || 
				config.toColumn.indexOf('/' + c.name + '/') > 0 ||
				(config.toColumn.indexOf('/' + c.name) > 0 && config.toColumn.indexOf('/' + c.name) == config.toColumn.length - c.name.length - 1)) {
				tocolumns.push(c);
				continue;
			}
			if(config.subColumns.contain(c.name)) {
				subcolumns.push(c);
				continue;
			}
			othercolumns.push(c);
			columns.push(c);
		}
		//一行一行处理，先用关健列做唯一合并
		for(var i=0;i<data.data.length;i++) {
			var row = data.data[i];
			var newrow = {};//新行
			for(var k=0;k<config.keys.length;k++) {
				var key = config.keys[k];
				newrow[key] = row[key];//当前关健值
			}
			var tmprow = jmreport.logic.getItem(rows, newrow);
			if(tmprow) newrow = tmprow;
			else {
				 //关健值和其它值直接放进来
				for(var c=0;c<othercolumns.length;c++) {
					if(!newrow[othercolumns[c].name]) newrow[othercolumns[c].name] = row[othercolumns[c].name];
				}
				rows.push(newrow);
			}

			//生成列转为列的列名和当前行的行转列数据项
			var tocolumnname = '';
			for(var c=0;c<tocolumns.length;c++) {
				var ck = tocolumns[c];
				tocolumnname += (tocolumnname?'/':'') + row[ck.name];
			}
			//需要显示为值的列
			for(var c=0;c<subcolumns.length;c++) {
				var newcolumn = {
					name: tocolumnname
				};
				
				var sc = subcolumns[c];
				if(subcolumns.length > 1) {
					newcolumn.name += '/' + sc.name;
				}
				//处理新增的列
				var tmpcolumn = jmreport.logic.getItem(columns, newcolumn);
				if(!tmpcolumn) {
					newcolumn.datatype = sc.datatype;
					newcolumn.description = sc.description;
					columns.push(newcolumn);
				}
				else newcolumn = tmpcolumn;
				//赋原列的值
				newrow[newcolumn.name] = row[sc.name];
			}
		}
		data.data = rows;
		data.fields = columns;
		return data;
	}
});
