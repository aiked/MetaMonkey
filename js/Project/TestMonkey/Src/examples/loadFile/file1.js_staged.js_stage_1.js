 {
    function importFile(filename) {
    var file = read(filename);
    var fileAst = Reflect.parse(file);
    return fileAst;
    }

}
inline( importFile("Src\\examples\\loadFile\\file2.js") );