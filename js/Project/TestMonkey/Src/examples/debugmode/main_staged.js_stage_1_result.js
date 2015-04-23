var handlers = {plus: function (x, y) {
    return (x + y);
}
,minus: function (x, y) {
    return (x - y);
}
,call: function (funcName) {
    var fun = this[funcName];
    if (fun) {
    alert("oops!, an error occurred!, " + ("cannot find (" + funcName + ") method") + ", pleaze contact us.");
    }
    ;
    return fun.apply(this, arguments);
}
};
handlers.call("plus", 1, 2);
