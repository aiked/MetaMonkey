var UIGenerators = {};
UIGenerators["basicLayout"] = function () {
    var divroot = document.createElement("div");
    divroot.setAttribute("class", "wx-resource");
    (function (parent) {
    var divroot = document.createElement("div");
    divroot.setAttribute("class", (divroot.getAttribute("class") || "") + " " + "wx-panel ltm-container");
    parent.appendChild(divroot);
    (function (parent) {
    var divroot = document.createElement("div");
    divroot.setAttribute("class", (divroot.getAttribute("class") || "") + " " + "wx-wxBoxSizer ");
    parent.appendChild(divroot);
    var elProportions = [];
    divroot.setAttribute("class", (divroot.getAttribute("class") || "") + " " + "wx-vertical");
    var divItem = document.createElement("div");
    (function (parent) {
    var divroot = document.createElement("div");
    divroot.setAttribute("class", (divroot.getAttribute("class") || "") + " " + "wx-panel ltm-header-container");
    parent.appendChild(divroot);
    ;
    divroot.style.width = "850px";
    divroot.style.height = "100px";
    ;
    divroot.style.display = "block";
    divroot.style.padding = 5 + "px";
    }
)(divItem);
    divItem.setAttribute("class", "wx-wxBoxSizer-item");
    divroot.appendChild(divItem);
    elProportions.push(divItem);
    var divItem = document.createElement("div");
    (function (parent) {
    var divroot = document.createElement("div");
    divroot.setAttribute("class", (divroot.getAttribute("class") || "") + " " + "wx-wxBoxSizer ");
    parent.appendChild(divroot);
    var elProportions = [];
    divroot.setAttribute("class", (divroot.getAttribute("class") || "") + " " + "wx-horizontal");
    var divItem = document.createElement("div");
    (function (parent) {
    var divroot = document.createElement("div");
    divroot.setAttribute("class", (divroot.getAttribute("class") || "") + " " + "wx-panel ltm-left-menu-container");
    parent.appendChild(divroot);
    ;
    divroot.style.width = "200px";
    divroot.style.height = "600px";
    ;
    divroot.style.display = "block";
    divroot.style.paddingTop = 20 + "px";
    }
)(divItem);
    divItem.setAttribute("class", "wx-wxBoxSizer-item");
    divroot.appendChild(divItem);
    elProportions.push(divItem);
    var divItem = document.createElement("div");
    (function (parent) {
    var divroot = document.createElement("div");
    divroot.setAttribute("class", (divroot.getAttribute("class") || "") + " " + "wx-panel ltm-email-body-container");
    parent.appendChild(divroot);
    ;
    divroot.style.width = "650px";
    divroot.style.height = "600px";
    ;
    divroot.style.display = "block";
    divroot.style.paddingTop = 20 + "px";
    }
)(divItem);
    divItem.setAttribute("class", "wx-wxBoxSizer-item");
    divroot.appendChild(divItem);
    elProportions.push(divItem);
    var divClear = document.createElement("div");
    divClear.setAttribute("class", "wx-clearfix");
    divroot.appendChild(divClear);
    ;
    ;
    ;
    ;
    divroot.style.display = "block";
    }
)(divItem);
    divItem.setAttribute("class", "wx-wxBoxSizer-item");
    divroot.appendChild(divItem);
    elProportions.push(divItem);
    ;
    ;
    ;
    ;
    }
)(divroot);
    divroot.style.width = "850px";
    divroot.style.height = "700px";
    ;
    }
)(divroot);
    return divroot;
}
;
UIGenerators["leftMenu"] = function () {
    var divroot = document.createElement("div");
    divroot.setAttribute("class", "wx-resource");
    (function (parent) {
    var divroot = document.createElement("div");
    divroot.setAttribute("class", (divroot.getAttribute("class") || "") + " " + "wx-panel MyPanel2");
    parent.appendChild(divroot);
    (function (parent) {
    var divroot = document.createElement("div");
    divroot.setAttribute("class", (divroot.getAttribute("class") || "") + " " + "wx-wxFlexGridSizer ");
    parent.appendChild(divroot);
    ;
    var divClear = document.createElement("div");
    divClear.setAttribute("class", "wx-clearfix");
    divroot.appendChild(divClear);
    var divRow = document.createElement("div");
    divRow.setAttribute("class", "wx-wxFlexGridSizer-row");
    divroot.appendChild(divRow);
    var divCol = document.createElement("div");
    (function (parent) {
    var divroot = document.createElement("div");
    divroot.setAttribute("class", (divroot.getAttribute("class") || "") + " " + "wx-wxBoxSizer ");
    parent.appendChild(divroot);
    var elProportions = [];
    divroot.setAttribute("class", (divroot.getAttribute("class") || "") + " " + "wx-vertical");
    var divItem = document.createElement("div");
    (function (parent) {
    var divroot = document.createElement("button");
    divroot.setAttribute("class", (divroot.getAttribute("class") || "") + " " + "wx-wxButton ltm-compose-mail");
    parent.appendChild(divroot);
    var textNode = document.createTextNode("Compose");
    divroot.appendChild(textNode);
    ;
    divroot.style.fontSize = "20px";
    divroot.style.textDecoration = "initial";
    ;
    divroot.style.width = "140px";
    divroot.style.height = "30px";
    ;
    }
)(divItem);
    divItem.setAttribute("class", "wx-wxBoxSizer-item");
    divroot.appendChild(divItem);
    elProportions.push(divItem);
    ;
    ;
    ;
    divroot.style.padding = 9 + "px";
    }
)(divCol);
    divCol.setAttribute("class", "wx-wxFlexGridSizer-col");
    divRow.appendChild(divCol);
    divroot.appendChild(divRow);
    var divClear = document.createElement("div");
    divClear.setAttribute("class", "wx-clearfix");
    divroot.appendChild(divClear);
    var divRow = document.createElement("div");
    divRow.setAttribute("class", "wx-wxFlexGridSizer-row");
    divroot.appendChild(divRow);
    var divCol = document.createElement("div");
    (function (parent) {
    var divroot = document.createElement("div");
    divroot.setAttribute("class", (divroot.getAttribute("class") || "") + " " + "wx-wxBoxSizer ");
    parent.appendChild(divroot);
    var elProportions = [];
    divroot.setAttribute("class", (divroot.getAttribute("class") || "") + " " + "wx-vertical");
    var divItem = document.createElement("div");
    (function (parent) {
    var divroot = document.createElement("a");
    divroot.setAttribute("class", (divroot.getAttribute("class") || "") + " " + "wx-wxHyperlinkCtrl ltm-menu-link-open-inbox");
    parent.appendChild(divroot);
    var textNode = document.createTextNode("Inbox");
    divroot.appendChild(textNode);
    ;
    divroot.style.fontSize = "22px";
    divroot.style.textDecoration = "initial";
    divroot.setAttribute("href", "http://www.wxformbuilder.org");
    ;
    ;
    divroot.style.padding = 5 + "px";
    divroot.style.display = "block";
    }
)(divItem);
    divItem.setAttribute("class", "wx-wxBoxSizer-item");
    divroot.appendChild(divItem);
    elProportions.push(divItem);
    var divItem = document.createElement("div");
    (function (parent) {
    var divroot = document.createElement("a");
    divroot.setAttribute("class", (divroot.getAttribute("class") || "") + " " + "wx-wxHyperlinkCtrl ltm-menu-link-open-sent");
    parent.appendChild(divroot);
    var textNode = document.createTextNode("Sent");
    divroot.appendChild(textNode);
    ;
    divroot.style.fontSize = "22px";
    divroot.style.textDecoration = "initial";
    divroot.setAttribute("href", "http://www.wxformbuilder.org");
    ;
    ;
    divroot.style.padding = 5 + "px";
    divroot.style.display = "block";
    }
)(divItem);
    divItem.setAttribute("class", "wx-wxBoxSizer-item");
    divroot.appendChild(divItem);
    elProportions.push(divItem);
    var divItem = document.createElement("div");
    (function (parent) {
    var divroot = document.createElement("a");
    divroot.setAttribute("class", (divroot.getAttribute("class") || "") + " " + "wx-wxHyperlinkCtrl ltm-menu-link-open-trash");
    parent.appendChild(divroot);
    var textNode = document.createTextNode("Trash");
    divroot.appendChild(textNode);
    ;
    divroot.style.fontSize = "22px";
    divroot.style.textDecoration = "initial";
    divroot.setAttribute("href", "http://www.wxformbuilder.org");
    ;
    ;
    divroot.style.padding = 5 + "px";
    divroot.style.display = "block";
    }
)(divItem);
    divItem.setAttribute("class", "wx-wxBoxSizer-item");
    divroot.appendChild(divItem);
    elProportions.push(divItem);
    var divItem = document.createElement("div");
    (function (parent) {
    var divroot = document.createElement("a");
    divroot.setAttribute("class", (divroot.getAttribute("class") || "") + " " + "wx-wxHyperlinkCtrl ltm-menu-link-open-draft");
    parent.appendChild(divroot);
    var textNode = document.createTextNode("Draft");
    divroot.appendChild(textNode);
    ;
    divroot.style.fontSize = "22px";
    divroot.style.textDecoration = "initial";
    divroot.setAttribute("href", "http://www.wxformbuilder.org");
    ;
    ;
    divroot.style.padding = 5 + "px";
    divroot.style.display = "block";
    }
)(divItem);
    divItem.setAttribute("class", "wx-wxBoxSizer-item");
    divroot.appendChild(divItem);
    elProportions.push(divItem);
    ;
    ;
    ;
    ;
    ;
    ;
    divroot.style.padding = 5 + "px";
    divroot.style.display = "block";
    }
)(divCol);
    divCol.setAttribute("class", "wx-wxFlexGridSizer-col");
    divRow.appendChild(divCol);
    ;
    ;
    }
)(divroot);
    divroot.style.width = "200px";
    divroot.style.height = "600px";
    ;
    }
)(divroot);
    return divroot;
}
;
UIGenerators["emailList"] = function () {
    var divroot = document.createElement("div");
    divroot.setAttribute("class", "wx-resource");
    (function (parent) {
    var divroot = document.createElement("div");
    divroot.setAttribute("class", (divroot.getAttribute("class") || "") + " " + "wx-panel MyPanel2");
    parent.appendChild(divroot);
    (function (parent) {
    var divroot = document.createElement("div");
    divroot.setAttribute("class", (divroot.getAttribute("class") || "") + " " + "wx-wxFlexGridSizer ");
    parent.appendChild(divroot);
    ;
    var divClear = document.createElement("div");
    divClear.setAttribute("class", "wx-clearfix");
    divroot.appendChild(divClear);
    var divRow = document.createElement("div");
    divRow.setAttribute("class", "wx-wxFlexGridSizer-row");
    divroot.appendChild(divRow);
    var divCol = document.createElement("div");
    (function (parent) {
    var divroot = document.createElement("div");
    divroot.setAttribute("class", (divroot.getAttribute("class") || "") + " " + "wx-wxBoxSizer ");
    parent.appendChild(divroot);
    var elProportions = [];
    divroot.setAttribute("class", (divroot.getAttribute("class") || "") + " " + "wx-horizontal");
    var divItem = document.createElement("div");
    (function (parent) {
    var divroot = document.createElement("label");
    divroot.setAttribute("class", (divroot.getAttribute("class") || "") + " " + "wx-wxStaticText ");
    parent.appendChild(divroot);
    var textNode = document.createTextNode("Mark as");
    divroot.appendChild(textNode);
    ;
    divroot.style.display = "block";
    ;
    ;
    divroot.style.padding = 5 + "px";
    }
)(divItem);
    divItem.setAttribute("class", "wx-wxBoxSizer-item");
    divroot.appendChild(divItem);
    elProportions.push(divItem);
    var divItem = document.createElement("div");
    (function (parent) {
    var divroot = document.createElement("select");
    divroot.setAttribute("class", (divroot.getAttribute("class") || "") + " " + "wx-wxChoice ltm-email-list-markas");
    parent.appendChild(divroot);
    ;
    var option = document.createElement("option");
    var textNode = document.createTextNode("read");
    option.appendChild(textNode);
    divroot.appendChild(option);
    var option = document.createElement("option");
    var textNode = document.createTextNode("unread");
    option.appendChild(textNode);
    divroot.appendChild(option);
    var option = document.createElement("option");
    var textNode = document.createTextNode("spam");
    option.appendChild(textNode);
    divroot.appendChild(option);
    ;
    ;
    divroot.style.padding = 5 + "px";
    }
)(divItem);
    divItem.setAttribute("class", "wx-wxBoxSizer-item");
    divroot.appendChild(divItem);
    elProportions.push(divItem);
    var divItem = document.createElement("div");
    (function (parent) {
    var divroot = document.createElement("label");
    divroot.setAttribute("class", (divroot.getAttribute("class") || "") + " " + "wx-wxStaticText ");
    parent.appendChild(divroot);
    var textNode = document.createTextNode("Sortby");
    divroot.appendChild(textNode);
    ;
    divroot.style.display = "block";
    ;
    ;
    divroot.style.padding = 5 + "px";
    }
)(divItem);
    divItem.setAttribute("class", "wx-wxBoxSizer-item");
    divroot.appendChild(divItem);
    elProportions.push(divItem);
    var divItem = document.createElement("div");
    (function (parent) {
    var divroot = document.createElement("select");
    divroot.setAttribute("class", (divroot.getAttribute("class") || "") + " " + "wx-wxChoice ltm-email-list-sortby");
    parent.appendChild(divroot);
    ;
    var option = document.createElement("option");
    var textNode = document.createTextNode("123");
    option.appendChild(textNode);
    divroot.appendChild(option);
    var option = document.createElement("option");
    var textNode = document.createTextNode("234");
    option.appendChild(textNode);
    divroot.appendChild(option);
    ;
    ;
    divroot.style.padding = 5 + "px";
    }
)(divItem);
    divItem.setAttribute("class", "wx-wxBoxSizer-item");
    divroot.appendChild(divItem);
    elProportions.push(divItem);
    var divItem = document.createElement("div");
    (function (parent) {
    var divroot = document.createElement("button");
    divroot.setAttribute("class", (divroot.getAttribute("class") || "") + " " + "wx-wxButton ltm-email-list-delete");
    parent.appendChild(divroot);
    var textNode = document.createTextNode("Delete");
    divroot.appendChild(textNode);
    ;
    ;
    ;
    ;
    divroot.style.padding = 5 + "px";
    }
)(divItem);
    divItem.setAttribute("class", "wx-wxBoxSizer-item");
    divroot.appendChild(divItem);
    elProportions.push(divItem);
    var divClear = document.createElement("div");
    divClear.setAttribute("class", "wx-clearfix");
    divroot.appendChild(divClear);
    ;
    ;
    ;
    ;
    ;
    ;
    ;
    divroot.style.display = "block";
    }
)(divCol);
    divCol.setAttribute("class", "wx-wxFlexGridSizer-col");
    divRow.appendChild(divCol);
    divroot.appendChild(divRow);
    var divClear = document.createElement("div");
    divClear.setAttribute("class", "wx-clearfix");
    divroot.appendChild(divClear);
    var divRow = document.createElement("div");
    divRow.setAttribute("class", "wx-wxFlexGridSizer-row");
    divroot.appendChild(divRow);
    var divCol = document.createElement("div");
    (function (parent) {
    var divroot = document.createElement("div");
    divroot.setAttribute("class", (divroot.getAttribute("class") || "") + " " + "wx-wxCheckBox ltm-email-list-container");
    parent.appendChild(divroot);
    ;
    divroot.style.width = "630px";
    divroot.style.height = "500px";
    ;
    divroot.style.paddingTop = 5 + "px";
    }
)(divCol);
    divCol.setAttribute("class", "wx-wxFlexGridSizer-col");
    divRow.appendChild(divCol);
    ;
    ;
    }
)(divroot);
    divroot.style.width = "650px";
    divroot.style.height = "600px";
    ;
    }
)(divroot);
    return divroot;
}
;
UIGenerators["emailListItem"] = function () {
    var divroot = document.createElement("div");
    divroot.setAttribute("class", "wx-resource");
    (function (parent) {
    var divroot = document.createElement("div");
    divroot.setAttribute("class", (divroot.getAttribute("class") || "") + " " + "wx-panel ltm-email-list-item");
    parent.appendChild(divroot);
    (function (parent) {
    var divroot = document.createElement("div");
    divroot.setAttribute("class", (divroot.getAttribute("class") || "") + " " + "wx-wxBoxSizer ");
    parent.appendChild(divroot);
    var elProportions = [];
    divroot.setAttribute("class", (divroot.getAttribute("class") || "") + " " + "wx-horizontal");
    var divItem = document.createElement("div");
    (function (parent) {
    var divroot = document.createElement("div");
    divroot.setAttribute("class", (divroot.getAttribute("class") || "") + " " + "wx-wxCheckBox-container ltm-email-list-item-select");
    parent.appendChild(divroot);
    ;
    var input = document.createElement("input");
    input.type = "checkbox";
    input.setAttribute("class", (input.getAttribute("class") || "") + " " + "wx-wxCheckBox ltm-email-list-item-select");
    divroot.appendChild(input);
    ;
    ;
    divroot.style.textAlign = "center";
    divroot.style.padding = 5 + "px";
    }
)(divItem);
    divItem.setAttribute("class", "wx-wxBoxSizer-item");
    divroot.appendChild(divItem);
    elProportions.push(divItem);
    var divItem = document.createElement("div");
    (function (parent) {
    var divroot = document.createElement("div");
    divroot.setAttribute("class", (divroot.getAttribute("class") || "") + " " + "wx-wxBoxSizer ");
    parent.appendChild(divroot);
    var elProportions = [];
    divroot.setAttribute("class", (divroot.getAttribute("class") || "") + " " + "wx-horizontal");
    var divItem = document.createElement("div");
    (function (parent) {
    var divroot = document.createElement("div");
    divroot.setAttribute("class", (divroot.getAttribute("class") || "") + " " + "wx-wxBoxSizer ");
    parent.appendChild(divroot);
    var elProportions = [];
    divroot.setAttribute("class", (divroot.getAttribute("class") || "") + " " + "wx-vertical");
    var divItem = document.createElement("div");
    (function (parent) {
    var divroot = document.createElement("label");
    divroot.setAttribute("class", (divroot.getAttribute("class") || "") + " " + "wx-wxStaticText ltm-email-list-item-senter");
    parent.appendChild(divroot);
    var textNode = document.createTextNode("senter email");
    divroot.appendChild(textNode);
    ;
    divroot.style.display = "block";
    ;
    ;
    divroot.style.padding = 5 + "px";
    }
)(divItem);
    divItem.setAttribute("class", "wx-wxBoxSizer-item");
    divroot.appendChild(divItem);
    elProportions.push(divItem);
    var divItem = document.createElement("div");
    (function (parent) {
    var divroot = document.createElement("label");
    divroot.setAttribute("class", (divroot.getAttribute("class") || "") + " " + "wx-wxStaticText ltm-email-list-item-title");
    parent.appendChild(divroot);
    var textNode = document.createTextNode("title");
    divroot.appendChild(textNode);
    ;
    divroot.style.display = "block";
    ;
    ;
    divroot.style.padding = 5 + "px";
    }
)(divItem);
    divItem.setAttribute("class", "wx-wxBoxSizer-item");
    divroot.appendChild(divItem);
    elProportions.push(divItem);
    ;
    ;
    ;
    ;
    divroot.style.display = "block";
    }
)(divItem);
    divItem.setAttribute("class", "wx-wxBoxSizer-item");
    divroot.appendChild(divItem);
    elProportions.push(divItem);
    var divItem = document.createElement("div");
    (function (parent) {
    var divroot = document.createElement("label");
    divroot.setAttribute("class", (divroot.getAttribute("class") || "") + " " + "wx-wxStaticText ltm-email-list-item-date");
    parent.appendChild(divroot);
    var textNode = document.createTextNode("date");
    divroot.appendChild(textNode);
    ;
    divroot.style.display = "block";
    ;
    ;
    divroot.style.padding = 5 + "px";
    }
)(divItem);
    divItem.setAttribute("class", "wx-wxBoxSizer-item");
    divroot.appendChild(divItem);
    elProportions.push(divItem);
    var divClear = document.createElement("div");
    divClear.setAttribute("class", "wx-clearfix");
    divroot.appendChild(divClear);
    var elStyle = elProportions[0].style;
    if (!elStyle.width) {
    elStyle.width = "83.33333333333334%";
    }
    ;
    ;
    ;
    divroot.style.display = "block";
    }
)(divItem);
    divItem.setAttribute("class", "wx-wxBoxSizer-item");
    divroot.appendChild(divItem);
    elProportions.push(divItem);
    var divClear = document.createElement("div");
    divClear.setAttribute("class", "wx-clearfix");
    divroot.appendChild(divClear);
    ;
    var elStyle = elProportions[1].style;
    if (!elStyle.width) {
    elStyle.width = "85.71428571428571%";
    }
    ;
    ;
    }
)(divroot);
    divroot.style.width = "620px";
    divroot.style.height = "60px";
    ;
    }
)(divroot);
    return divroot;
}
;
UIGenerators["composeEmail"] = function () {
    var divroot = document.createElement("div");
    divroot.setAttribute("class", "wx-resource");
    (function (parent) {
    var divroot = document.createElement("div");
    divroot.setAttribute("class", (divroot.getAttribute("class") || "") + " " + "wx-panel MyPanel2");
    parent.appendChild(divroot);
    (function (parent) {
    var divroot = document.createElement("div");
    divroot.setAttribute("class", (divroot.getAttribute("class") || "") + " " + "wx-wxFlexGridSizer ");
    parent.appendChild(divroot);
    ;
    var divClear = document.createElement("div");
    divClear.setAttribute("class", "wx-clearfix");
    divroot.appendChild(divClear);
    var divRow = document.createElement("div");
    divRow.setAttribute("class", "wx-wxFlexGridSizer-row");
    divroot.appendChild(divRow);
    var divCol = document.createElement("div");
    (function (parent) {
    var divroot = document.createElement("div");
    divroot.setAttribute("class", (divroot.getAttribute("class") || "") + " " + "wx-wxBoxSizer ");
    parent.appendChild(divroot);
    var elProportions = [];
    divroot.setAttribute("class", (divroot.getAttribute("class") || "") + " " + "wx-horizontal");
    var divItem = document.createElement("div");
    (function (parent) {
    var divroot = document.createElement("label");
    divroot.setAttribute("class", (divroot.getAttribute("class") || "") + " " + "wx-wxStaticText ");
    parent.appendChild(divroot);
    var textNode = document.createTextNode("To");
    divroot.appendChild(textNode);
    ;
    divroot.style.display = "block";
    divroot.style.width = "60px";
    divroot.style.height = "-1px";
    ;
    divroot.style.padding = 5 + "px";
    }
)(divItem);
    divItem.setAttribute("class", "wx-wxBoxSizer-item");
    divroot.appendChild(divItem);
    elProportions.push(divItem);
    var divItem = document.createElement("div");
    (function (parent) {
    var divroot = document.createElement("input");
    divroot.setAttribute("class", (divroot.getAttribute("class") || "") + " " + "wx-wxTextCtrl ltm-compose-to");
    parent.appendChild(divroot);
    ;
    divroot.style.width = "300px";
    divroot.style.height = "-1px";
    ;
    divroot.style.padding = 5 + "px";
    }
)(divItem);
    divItem.setAttribute("class", "wx-wxBoxSizer-item");
    divroot.appendChild(divItem);
    elProportions.push(divItem);
    var divClear = document.createElement("div");
    divClear.setAttribute("class", "wx-clearfix");
    divroot.appendChild(divClear);
    ;
    ;
    ;
    ;
    divroot.style.display = "block";
    divroot.style.paddingLeft = 20 + "px";
    }
)(divCol);
    divCol.setAttribute("class", "wx-wxFlexGridSizer-col");
    divRow.appendChild(divCol);
    divroot.appendChild(divRow);
    var divClear = document.createElement("div");
    divClear.setAttribute("class", "wx-clearfix");
    divroot.appendChild(divClear);
    var divRow = document.createElement("div");
    divRow.setAttribute("class", "wx-wxFlexGridSizer-row");
    divroot.appendChild(divRow);
    var divCol = document.createElement("div");
    (function (parent) {
    var divroot = document.createElement("div");
    divroot.setAttribute("class", (divroot.getAttribute("class") || "") + " " + "wx-wxBoxSizer ");
    parent.appendChild(divroot);
    var elProportions = [];
    divroot.setAttribute("class", (divroot.getAttribute("class") || "") + " " + "wx-horizontal");
    var divItem = document.createElement("div");
    (function (parent) {
    var divroot = document.createElement("label");
    divroot.setAttribute("class", (divroot.getAttribute("class") || "") + " " + "wx-wxStaticText ");
    parent.appendChild(divroot);
    var textNode = document.createTextNode("From");
    divroot.appendChild(textNode);
    ;
    divroot.style.display = "block";
    divroot.style.width = "60px";
    divroot.style.height = "-1px";
    ;
    divroot.style.padding = 5 + "px";
    }
)(divItem);
    divItem.setAttribute("class", "wx-wxBoxSizer-item");
    divroot.appendChild(divItem);
    elProportions.push(divItem);
    var divItem = document.createElement("div");
    (function (parent) {
    var divroot = document.createElement("input");
    divroot.setAttribute("class", (divroot.getAttribute("class") || "") + " " + "wx-wxTextCtrl ltm-compose-from");
    parent.appendChild(divroot);
    ;
    divroot.style.width = "300px";
    divroot.style.height = "-1px";
    ;
    divroot.style.padding = 5 + "px";
    }
)(divItem);
    divItem.setAttribute("class", "wx-wxBoxSizer-item");
    divroot.appendChild(divItem);
    elProportions.push(divItem);
    var divClear = document.createElement("div");
    divClear.setAttribute("class", "wx-clearfix");
    divroot.appendChild(divClear);
    ;
    ;
    ;
    ;
    divroot.style.display = "block";
    divroot.style.paddingLeft = 20 + "px";
    }
)(divCol);
    divCol.setAttribute("class", "wx-wxFlexGridSizer-col");
    divRow.appendChild(divCol);
    divroot.appendChild(divRow);
    var divClear = document.createElement("div");
    divClear.setAttribute("class", "wx-clearfix");
    divroot.appendChild(divClear);
    var divRow = document.createElement("div");
    divRow.setAttribute("class", "wx-wxFlexGridSizer-row");
    divroot.appendChild(divRow);
    var divCol = document.createElement("div");
    (function (parent) {
    var divroot = document.createElement("div");
    divroot.setAttribute("class", (divroot.getAttribute("class") || "") + " " + "wx-wxBoxSizer ");
    parent.appendChild(divroot);
    var elProportions = [];
    divroot.setAttribute("class", (divroot.getAttribute("class") || "") + " " + "wx-horizontal");
    var divItem = document.createElement("div");
    (function (parent) {
    var divroot = document.createElement("label");
    divroot.setAttribute("class", (divroot.getAttribute("class") || "") + " " + "wx-wxStaticText m_staticText6");
    parent.appendChild(divroot);
    var textNode = document.createTextNode("Subject");
    divroot.appendChild(textNode);
    ;
    divroot.style.display = "block";
    divroot.style.width = "60px";
    divroot.style.height = "-1px";
    ;
    divroot.style.padding = 5 + "px";
    }
)(divItem);
    divItem.setAttribute("class", "wx-wxBoxSizer-item");
    divroot.appendChild(divItem);
    elProportions.push(divItem);
    var divItem = document.createElement("div");
    (function (parent) {
    var divroot = document.createElement("input");
    divroot.setAttribute("class", (divroot.getAttribute("class") || "") + " " + "wx-wxTextCtrl ltm-compose-subject");
    parent.appendChild(divroot);
    ;
    divroot.style.width = "300px";
    divroot.style.height = "-1px";
    ;
    divroot.style.padding = 5 + "px";
    }
)(divItem);
    divItem.setAttribute("class", "wx-wxBoxSizer-item");
    divroot.appendChild(divItem);
    elProportions.push(divItem);
    var divClear = document.createElement("div");
    divClear.setAttribute("class", "wx-clearfix");
    divroot.appendChild(divClear);
    ;
    ;
    ;
    ;
    divroot.style.display = "block";
    divroot.style.paddingLeft = 20 + "px";
    }
)(divCol);
    divCol.setAttribute("class", "wx-wxFlexGridSizer-col");
    divRow.appendChild(divCol);
    divroot.appendChild(divRow);
    var divClear = document.createElement("div");
    divClear.setAttribute("class", "wx-clearfix");
    divroot.appendChild(divClear);
    var divRow = document.createElement("div");
    divRow.setAttribute("class", "wx-wxFlexGridSizer-row");
    divroot.appendChild(divRow);
    var divCol = document.createElement("div");
    (function (parent) {
    var divroot = document.createElement("div");
    divroot.setAttribute("class", (divroot.getAttribute("class") || "") + " " + "wx-spacer ");
    parent.appendChild(divroot);
    ;
    divroot.style.width = "0px";
    divroot.style.height = "20px";
    ;
    divroot.style.display = "block";
    divroot.style.paddingLeft = 20 + "px";
    }
)(divCol);
    divCol.setAttribute("class", "wx-wxFlexGridSizer-col");
    divRow.appendChild(divCol);
    divroot.appendChild(divRow);
    var divClear = document.createElement("div");
    divClear.setAttribute("class", "wx-clearfix");
    divroot.appendChild(divClear);
    var divRow = document.createElement("div");
    divRow.setAttribute("class", "wx-wxFlexGridSizer-row");
    divroot.appendChild(divRow);
    var divCol = document.createElement("div");
    (function (parent) {
    var divroot = document.createElement("textarea");
    divroot.setAttribute("class", (divroot.getAttribute("class") || "") + " " + "wx-wxTextCtrl ltm-compose-body");
    parent.appendChild(divroot);
    ;
    divroot.style.width = "600px";
    divroot.style.height = "400px";
    ;
    divroot.style.paddingTop = 20 + "px";
    divroot.style.paddingRight = 20 + "px";
    divroot.style.paddingLeft = 20 + "px";
    }
)(divCol);
    divCol.setAttribute("class", "wx-wxFlexGridSizer-col");
    divRow.appendChild(divCol);
    divroot.appendChild(divRow);
    var divClear = document.createElement("div");
    divClear.setAttribute("class", "wx-clearfix");
    divroot.appendChild(divClear);
    var divRow = document.createElement("div");
    divRow.setAttribute("class", "wx-wxFlexGridSizer-row");
    divroot.appendChild(divRow);
    var divCol = document.createElement("div");
    (function (parent) {
    var divroot = document.createElement("div");
    divroot.setAttribute("class", (divroot.getAttribute("class") || "") + " " + "wx-wxBoxSizer ");
    parent.appendChild(divroot);
    var elProportions = [];
    divroot.setAttribute("class", (divroot.getAttribute("class") || "") + " " + "wx-horizontal");
    var divItem = document.createElement("div");
    (function (parent) {
    var divroot = document.createElement("div");
    divroot.setAttribute("class", (divroot.getAttribute("class") || "") + " " + "wx-spacer ");
    parent.appendChild(divroot);
    ;
    divroot.style.width = "520px";
    divroot.style.height = "1px";
    ;
    divroot.style.display = "block";
    }
)(divItem);
    divItem.setAttribute("class", "wx-wxBoxSizer-item");
    divroot.appendChild(divItem);
    elProportions.push(divItem);
    var divItem = document.createElement("div");
    (function (parent) {
    var divroot = document.createElement("button");
    divroot.setAttribute("class", (divroot.getAttribute("class") || "") + " " + "wx-wxButton ltm-compose-sent");
    parent.appendChild(divroot);
    var textNode = document.createTextNode("Sent");
    divroot.appendChild(textNode);
    ;
    ;
    divroot.style.width = "100px";
    divroot.style.height = "30px";
    ;
    }
)(divItem);
    divItem.setAttribute("class", "wx-wxBoxSizer-item");
    divroot.appendChild(divItem);
    elProportions.push(divItem);
    var divClear = document.createElement("div");
    divClear.setAttribute("class", "wx-clearfix");
    divroot.appendChild(divClear);
    ;
    ;
    ;
    ;
    divroot.style.display = "block";
    divroot.style.paddingTop = 5 + "px";
    }
)(divCol);
    divCol.setAttribute("class", "wx-wxFlexGridSizer-col");
    divRow.appendChild(divCol);
    ;
    ;
    }
)(divroot);
    divroot.style.width = "650px";
    divroot.style.height = "600px";
    ;
    }
)(divroot);
    return divroot;
}
;
UIGenerators["header"] = function () {
    var divroot = document.createElement("div");
    divroot.setAttribute("class", "wx-resource");
    (function (parent) {
    var divroot = document.createElement("div");
    divroot.setAttribute("class", (divroot.getAttribute("class") || "") + " " + "wx-panel MyPanel3");
    parent.appendChild(divroot);
    (function (parent) {
    var divroot = document.createElement("div");
    divroot.setAttribute("class", (divroot.getAttribute("class") || "") + " " + "wx-wxBoxSizer ");
    parent.appendChild(divroot);
    var elProportions = [];
    divroot.setAttribute("class", (divroot.getAttribute("class") || "") + " " + "wx-horizontal");
    var divItem = document.createElement("div");
    (function (parent) {
    var divroot = document.createElement("label");
    divroot.setAttribute("class", (divroot.getAttribute("class") || "") + " " + "wx-wxStaticText m_staticText6");
    parent.appendChild(divroot);
    var textNode = document.createTextNode("Litemail");
    divroot.appendChild(textNode);
    ;
    divroot.style.fontSize = "35px";
    divroot.style.textDecoration = "initial";
    divroot.style.display = "block";
    ;
    ;
    divroot.style.textAlign = "center";
    divroot.style.padding = 5 + "px";
    }
)(divItem);
    divItem.setAttribute("class", "wx-wxBoxSizer-item");
    divroot.appendChild(divItem);
    elProportions.push(divItem);
    var divItem = document.createElement("div");
    (function (parent) {
    var divroot = document.createElement("div");
    divroot.setAttribute("class", (divroot.getAttribute("class") || "") + " " + "wx-spacer ");
    parent.appendChild(divroot);
    ;
    divroot.style.width = "650px";
    divroot.style.height = "10px";
    ;
    divroot.style.display = "block";
    }
)(divItem);
    divItem.setAttribute("class", "wx-wxBoxSizer-item");
    divroot.appendChild(divItem);
    elProportions.push(divItem);
    var divItem = document.createElement("div");
    (function (parent) {
    var divroot = document.createElement("a");
    divroot.setAttribute("class", (divroot.getAttribute("class") || "") + " " + "wx-wxHyperlinkCtrl m_hyperlink3");
    parent.appendChild(divroot);
    var textNode = document.createTextNode("?");
    divroot.appendChild(textNode);
    ;
    divroot.style.fontSize = "30px";
    divroot.style.textDecoration = "initial";
    divroot.setAttribute("href", "http://www.wxformbuilder.org");
    ;
    ;
    divroot.style.textAlign = "center";
    divroot.style.padding = 5 + "px";
    }
)(divItem);
    divItem.setAttribute("class", "wx-wxBoxSizer-item");
    divroot.appendChild(divItem);
    elProportions.push(divItem);
    var divClear = document.createElement("div");
    divClear.setAttribute("class", "wx-clearfix");
    divroot.appendChild(divClear);
    ;
    ;
    ;
    ;
    ;
    }
)(divroot);
    divroot.style.width = "850px";
    divroot.style.height = "100px";
    ;
    }
)(divroot);
    return divroot;
}
;
tmplBasicLayout = UIGenerators.basicLayout();
tmplLeftMenu = UIGenerators.leftMenu();
tmplEmailList = UIGenerators.emailList();
tmplEmailListItem = UIGenerators.emailListItem();
tmplComposeEmail = UIGenerators.composeEmail();
tmplHeader = UIGenerators.header();
