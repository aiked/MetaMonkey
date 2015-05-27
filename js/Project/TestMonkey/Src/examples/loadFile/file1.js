

.& {
	function importFile(filename){
		var file = read( filename );
		var fileAst = Reflect.parse(file);
		return fileAst;
	}
};

console.log( "file 1 content" );
.! importFile( "Src\\examples\\loadFile\\file2.js" );