//load("F:\\japostol\\projects\\not\\not\\js\\Project\\TestMonkey\\Src\\GUIGen\\GUIGen.js");
// a = read("F:\\japostol\\projects\\not\\not\\js\\Project\\TestMonkey\\Src\\GUIGen\\GUIGen.js"); b = Reflect.parse(a); u = unparse(b);



function xmlToAst(xrcFileName, handlers){
	function Ast_esc(ast, isStmt){
		return isStmt? ast.body[0] : ast.body[0].expression;
	}

	function Ast_GetBody(root){
		return root.body[0].expression.callee.body.body;
	}

	function Ast_PushArg(root, arg){
		return root.body[0].expression.arguments.push(arg);
	}

	function Ast_appendHandlerToBody(root, handlers, id){
			var actionAst;
			var handler = handlers[id];
			if(handler){
				if( handler.evt ){
					actionAst = .< elem[.@handler.evt] = .~handler.action; >.;
				}else{
					actionAst = .< ( .~handler.action )(elem); >.;
				}
				root.splice(root.length-2, 0, Ast_esc(actionAst, true) );
			}
	} 

	load("Src\\examples\\GUIGen\\xparse.js");

	var calculatorXrc = read(xrcFileName);

	var doc = Xparse( calculatorXrc );

	function assert(cond, msg){
		if(!cond){ 
			print("assertion fail " + msg ? " : \"" + msg + "\"" : "" );
		}
	}

	function getElemByName( doc, name ){
		for(var i=0; i<doc.contents.length; ++i){
			var elem = doc.contents[i];
			if( elem.type == "element" && elem.name == name ){
				return elem;
			}
		}
		return null;
	}

	function getAttrByName( doc, name ){
		return doc.attributes[name];
	}

	function getElemValue( doc ){
		if( doc.contents 
			&& doc.contents.length>0 
			&& doc.contents[0].type==="chardata"
			&& doc.contents[0].value) {
			return doc.contents[0].value.trim();
		}
		return null;
	}


	var resourceObj = getElemByName(doc, 'resource');
	var panelObj = getElemByName(resourceObj, 'object');

	var xrcToAst = {

		parseItems: {
			wxBoxSizer: function(obj, parent){
				var orient = getElemByName(obj, "orient");
				var sizeritems = obj.contents;

				var retVal = .< 

					(function(parent){
						var divChild = document.createElement('div');
						divChild.setAttribute('class', .@(getElemValue(orient) === 'wxHORIZONTAL' ? 'c-row' : 'c-col'));
						parent.appendChild(divChild);
					})(.~parent);

				 >.;

			var retValBody = Ast_GetBody(retVal);
			for (var i=0; i<sizeritems.length; ++i) {
				var sizeritem = sizeritems[i];
				if( sizeritem.type == "element" && sizeritem.name == "object"){
					var item = this.parseSizerItem(sizeritem, .< divChild; >. );
					retValBody.splice(2 + i, 0, Ast_esc(item, true) ); 			
				}
			}

			return retVal;
			},
			wxTextCtrl: function(obj, parent){
				var size = getElemByName(obj, "size");
				var value = getElemByName(obj, "value");
				var maxlength = getElemByName(obj, "maxlength");
				var id = getAttrByName(obj, "name");

				var retVal = .< 
						(function(parent){
							var elem = document.createElement('textarea');
							elem.setAttribute('id', .@id);
				 			elem.setAttribute('value', .@getElemValue(value)); 
				 			elem.readOnly = true;
				 			parent.appendChild( elem );
				 		})(.~parent);
					>.;
			
				Ast_appendHandlerToBody(Ast_GetBody(retVal), handlers, id);

				return retVal;
			},
			wxButton: function(obj, parent){
				var label = getElemByName(obj, "label");
				var id = getAttrByName(obj, "name");

				var retVal = .< 
						(function(parent){
							var elem = document.createElement('button');
							elem.setAttribute('id', .@id);
							var textNode = document.createTextNode(.@getElemValue(label));
							elem.appendChild( textNode );
							parent.appendChild( elem );
						})(.~parent);
					>.;
	
				Ast_appendHandlerToBody(Ast_GetBody(retVal), handlers, id);

				return retVal;
			},

			parseSizerItem: function (obj, parent){
				var option = getElemByName(obj, "option");
				var flag = getElemByName(obj, "flag");
				var border = getElemByName(obj, "border");
				var object = getElemByName(obj, "object");
				var item = this.callParser(object, parent);
				return item; //+ ".setAttribute('flag','"+ getElemValue(flag) +"');";
			},

			callParser: function(obj, parent){
				var classType = getAttrByName(obj, "class");
				var func = this[classType];
				assert(func, "function does not exist");
				var items = this[classType](obj, parent);
				return items;
			}
		}, 

		parsePanel: function(obj, parent){
			var style = getElemByName(obj, "style")
			var size = getElemByName(obj, "size");
			var object = getElemByName(obj, "object");

			return .< 

				(function(parent){
					var divPanel = document.createElement('div');
					.~this.parseItems.callParser(object, .< divPanel; >.);
					parent.appendChild(divPanel);
				})(.~parent);

			 >.;
		},

		startParser: function(obj){
			return .< 

				(function(){
					var divroot = document.createElement('div');
					.~this.parsePanel(obj, .< divroot; >.);
					return divroot;
				})();

		 	>.;
		}
	};

	return xrcToAst.startParser(panelObj);
}

var calculatorLogic = {
	textArea: null
};

function generateNumberHandlers( handlers ){
	for(var i=0; i<10; ++i){
		var astprops = .< 
				({ 'k': { evt: 'onclick', action: 
						.< 

						( function(){
							calculatorLogic.textArea.value += .@( i + "");
						} ); 

						>. }
		 		}); 
			>.;
		var astprop = astprops.body[0].expression.properties[0];
		astprop.key.value = "c_" + i;

 		handlers.body[0].expression.properties.push(
 			astprop
 		);
	}
}

function getHandlers(){
	var handlers =  .< ({
		'c_clear' : { evt: 'onclick', action: .< ( function(elem){
			calculatorLogic.textArea.value = "";
		} ); >. } ,
		'c_input' : { action: .< ( function(elem){
			calculatorLogic.textArea = elem;
		} ); >. } ,

		'c_plus' : { evt: 'onclick', action: .< ( function(){
			calculatorLogic.textArea.value += '+';
		} ); >. } ,

		'c_minus' : { evt: 'onclick', action: .< ( function(){
			calculatorLogic.textArea.value += '-';
		} ); >. } ,

		'c_multi' : { evt: 'onclick', action: .< ( function(){
			calculatorLogic.textArea.value += '*';
		} ); >. } ,

		'c_div' : { evt: 'onclick', action: .< ( function(){
			calculatorLogic.textArea.value += '/';
		} ); >. } ,

		'c_result' : { evt: 'onclick', action: .< ( function(){

			var result;
			try{
				result = eval( calculatorLogic.textArea.value );
			}catch(e){
				result = calculatorLogic.textArea.value = "Error";
			}
			calculatorLogic.textArea.value += ' = ' + result; 

		} ); >. }
	}); 

	>.;

	generateNumberHandlers(handlers);

	return handlers;
}

function generateHandlers(){
	return .!getHandlers();
}

var calculatorUI = .!xmlToAst(
		"Src\\examples\\GUIGen\\calculator.xrc",
		generateHandlers()
	);

var calIdSelector = document.getElementById('calContent');
calIdSelector.appendChild(calculatorUI);

