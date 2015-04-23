var calculatorLogic = {textArea: null};
var calculatorUI = (function () {
    var divroot = document.createElement("div");
    (function (parent) {
    var divPanel = document.createElement("div");
    (function (parent) {
    var divChild = document.createElement("div");
    divChild.setAttribute("class", "c-col");
    parent.appendChild(divChild);
    (function (parent) {
    var elem = document.createElement("textarea");
    elem.setAttribute("id", "c_input");
    elem.setAttribute("value", null);
    (function (elem) {
    calculatorLogic.textArea = elem;
    }
)(elem);
    elem.readOnly = true;
    parent.appendChild(elem);
    }
)(divChild);
    (function (parent) {
    var divChild = document.createElement("div");
    divChild.setAttribute("class", "c-row");
    parent.appendChild(divChild);
    (function (parent) {
    var elem = document.createElement("button");
    elem.setAttribute("id", "c_1");
    var textNode = document.createTextNode("1");
    elem["onclick"] = function () {
    calculatorLogic.textArea.value += "1";
    }
;
    elem.appendChild(textNode);
    parent.appendChild(elem);
    }
)(divChild);
    (function (parent) {
    var elem = document.createElement("button");
    elem.setAttribute("id", "c_2");
    var textNode = document.createTextNode("2");
    elem["onclick"] = function () {
    calculatorLogic.textArea.value += "2";
    }
;
    elem.appendChild(textNode);
    parent.appendChild(elem);
    }
)(divChild);
    (function (parent) {
    var elem = document.createElement("button");
    elem.setAttribute("id", "c_3");
    var textNode = document.createTextNode("3");
    elem["onclick"] = function () {
    calculatorLogic.textArea.value += "3";
    }
;
    elem.appendChild(textNode);
    parent.appendChild(elem);
    }
)(divChild);
    (function (parent) {
    var elem = document.createElement("button");
    elem.setAttribute("id", "c_clear");
    var textNode = document.createTextNode("C");
    elem["onclick"] = function (elem) {
    calculatorLogic.textArea.value = "";
    }
;
    elem.appendChild(textNode);
    parent.appendChild(elem);
    }
)(divChild);
    }
)(divChild);
    (function (parent) {
    var divChild = document.createElement("div");
    divChild.setAttribute("class", "c-row");
    parent.appendChild(divChild);
    (function (parent) {
    var elem = document.createElement("button");
    elem.setAttribute("id", "c_4");
    var textNode = document.createTextNode("4");
    elem["onclick"] = function () {
    calculatorLogic.textArea.value += "4";
    }
;
    elem.appendChild(textNode);
    parent.appendChild(elem);
    }
)(divChild);
    (function (parent) {
    var elem = document.createElement("button");
    elem.setAttribute("id", "c_5");
    var textNode = document.createTextNode("5");
    elem["onclick"] = function () {
    calculatorLogic.textArea.value += "5";
    }
;
    elem.appendChild(textNode);
    parent.appendChild(elem);
    }
)(divChild);
    (function (parent) {
    var elem = document.createElement("button");
    elem.setAttribute("id", "c_6");
    var textNode = document.createTextNode("6");
    elem["onclick"] = function () {
    calculatorLogic.textArea.value += "6";
    }
;
    elem.appendChild(textNode);
    parent.appendChild(elem);
    }
)(divChild);
    }
)(divChild);
    (function (parent) {
    var divChild = document.createElement("div");
    divChild.setAttribute("class", "c-row");
    parent.appendChild(divChild);
    (function (parent) {
    var elem = document.createElement("button");
    elem.setAttribute("id", "c_7");
    var textNode = document.createTextNode("7");
    elem["onclick"] = function () {
    calculatorLogic.textArea.value += "7";
    }
;
    elem.appendChild(textNode);
    parent.appendChild(elem);
    }
)(divChild);
    (function (parent) {
    var elem = document.createElement("button");
    elem.setAttribute("id", "c_8");
    var textNode = document.createTextNode("8");
    elem["onclick"] = function () {
    calculatorLogic.textArea.value += "8";
    }
;
    elem.appendChild(textNode);
    parent.appendChild(elem);
    }
)(divChild);
    (function (parent) {
    var elem = document.createElement("button");
    elem.setAttribute("id", "c_9");
    var textNode = document.createTextNode("9");
    elem["onclick"] = function () {
    calculatorLogic.textArea.value += "9";
    }
;
    elem.appendChild(textNode);
    parent.appendChild(elem);
    }
)(divChild);
    }
)(divChild);
    (function (parent) {
    var divChild = document.createElement("div");
    divChild.setAttribute("class", "c-row");
    parent.appendChild(divChild);
    (function (parent) {
    var elem = document.createElement("button");
    elem.setAttribute("id", "c_plus");
    var textNode = document.createTextNode("+");
    elem["onclick"] = function () {
    calculatorLogic.textArea.value += "+";
    }
;
    elem.appendChild(textNode);
    parent.appendChild(elem);
    }
)(divChild);
    (function (parent) {
    var elem = document.createElement("button");
    elem.setAttribute("id", "c_minus");
    var textNode = document.createTextNode("-");
    elem["onclick"] = function () {
    calculatorLogic.textArea.value += "-";
    }
;
    elem.appendChild(textNode);
    parent.appendChild(elem);
    }
)(divChild);
    (function (parent) {
    var elem = document.createElement("button");
    elem.setAttribute("id", "c_multi");
    var textNode = document.createTextNode("*");
    elem["onclick"] = function () {
    calculatorLogic.textArea.value += "*";
    }
;
    elem.appendChild(textNode);
    parent.appendChild(elem);
    }
)(divChild);
    (function (parent) {
    var elem = document.createElement("button");
    elem.setAttribute("id", "c_div");
    var textNode = document.createTextNode("/");
    elem["onclick"] = function () {
    calculatorLogic.textArea.value += "/";
    }
;
    elem.appendChild(textNode);
    parent.appendChild(elem);
    }
)(divChild);
    }
)(divChild);
    (function (parent) {
    var divChild = document.createElement("div");
    divChild.setAttribute("class", "c-row");
    parent.appendChild(divChild);
    (function (parent) {
    var elem = document.createElement("button");
    elem.setAttribute("id", "c_result");
    var textNode = document.createTextNode("=");
    elem["onclick"] = function () {
    var result;
    try {
    result = eval(calculatorLogic.textArea.value);
    } catch (e) {
    result = calculatorLogic.textArea.value = "Error";
    }
    calculatorLogic.textArea.value += " = " + result;
    }
;
    elem.appendChild(textNode);
    parent.appendChild(elem);
    }
)(divChild);
    }
)(divChild);
    }
)(divPanel);
    parent.appendChild(divPanel);
    }
)(divroot);
    return divroot;
}
)();
var calIdSelector = document.getElementById("calContent");
calIdSelector.appendChild(calculatorUI);
