var fs = require('fs'); 
var jsp = require("./uglify-js/uglify-js").parser; 
var pro = require("./uglify-js/uglify-js").uglify; 

function build(files, fileOut) { 
	var code = '';
	for(var i=0;i<files.length;i++) {
		var origCode = fs.readFileSync(files[i], 'utf8'); 
		code += origCode;
	}
	
	var ast = jsp.parse(code); 
	ast = pro.ast_mangle(ast); 
	ast = pro.ast_squeeze(ast);
	var mincode = pro.gen_code(ast); 
	fs.writeFileSync(fileOut + '.min.js', mincode, 'utf8'); 
	fs.writeFileSync(fileOut + '.debug.js', code, 'utf8'); 
	console.log('build to ' +fileOut + ' complete');
}

var base = __dirname + '/../';
var js = [
			base + 'jmreport.js',
			base + 'jmreport.lan.js',
            base + 'jmreport.serverProxy.js',
            base + 'jmreport.toolbarControls.js',
            base + 'toolbarcontrols/checkBoxList.js',
            base + 'toolbarcontrols/comboBoxOne.js',
			base + 'toolbarcontrols/dateTimeOne.js',
			base + 'toolbarcontrols/dateTimeTwo.js',
			base + 'toolbarcontrols/dateTimePickerOne.js',
			base + 'toolbarcontrols/horizontalListBox.js',
			base + 'toolbarcontrols/monthOne.js',
			base + 'toolbarcontrols/halfaYearOne.js',
			base + 'toolbarcontrols/textBox.js',
			base + 'jmreport.reportControls.js',
			base + 'reportcontrols/gridViewData.js',
			base + 'reportcontrols/eprChart.js',
			base + 'reportcontrols/gridSparkLine.js',
			base + 'reportcontrols/itemCompareList.js',
			base + 'reportcontrols/label.js',
			base + 'reportcontrols/imageBox.js',
			base + 'reportcontrols/dataViewDatePick.js'
			]; 
build(js,__dirname + '/../report');