
===================RUNNING========================
function importFile(filename) {
    var file = read(filename);
    var fileAst = Reflect.parse(file);
    return fileAst;
}

inline( importFile("Src\\loadFile\\file2.js") );
===================RESULT==========================
print("hello world");

==================================================
