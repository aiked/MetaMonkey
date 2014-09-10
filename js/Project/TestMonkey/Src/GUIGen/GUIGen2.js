

function _element(){this.type="element",this.name=new String,this.attributes=new Array,this.contents=new Array,this.uid=_Xparse_count++,_Xparse_index[this.uid]=this}function _chardata(){this.type="chardata",this.value=new String}function _pi(){this.type="pi",this.value=new String}function _comment(){this.type="comment",this.value=new String}function _frag(){this.str=new String,this.ary=new Array,this.end=new String}function Xparse(t){var n=new _frag;n.str=_prolog(t);var r=new _element;return r.name="ROOT",n=_compile(n),r.contents=n.ary,r.index=_Xparse_index,_Xparse_index=new Array,r}function _compile(t){for(;;){if(0==t.str.length)return t;var n=t.str.indexOf("<");if(0!=n){var r=t.ary.length;t.ary[r]=new _chardata,-1==n?(t.ary[r].value=_entity(t.str),t.str=""):(t.ary[r].value=_entity(t.str.substring(0,n)),t.str=t.str.substring(n,t.str.length))}else if("?"==t.str.substring(1,2))t=_tag_pi(t);else if("!--"==t.str.substring(1,4))t=_tag_comment(t);else if("![CDATA["==t.str.substring(1,9))t=_tag_cdata(t);else{if(t.str.substring(1,t.end.length+3)=="/"+t.end+">"||_strip(t.str.substring(1,t.end.length+3))=="/"+t.end)return t.str=t.str.substring(t.end.length+3,t.str.length),t.end="",t;t=_tag_element(t)}}return""}function _tag_element(t){var n=t.str.indexOf(">"),r="/"==t.str.substring(n-1,n);r&&(n-=1);var e=_normalize(t.str.substring(1,n)),i=e.indexOf(" "),s=new String,a=new String;-1!=i?(a=e.substring(0,i),s=e.substring(i+1,e.length)):a=e;var u=t.ary.length;if(t.ary[u]=new _element,t.ary[u].name=_strip(a),s.length>0&&(t.ary[u].attributes=_attribution(s)),r)t.str=t.str.substring(n+2,t.str.length);else{var g=new _frag;g.str=t.str.substring(n+1,t.str.length),g.end=a,g=_compile(g),t.ary[u].contents=g.ary,t.str=g.str}return t}function _tag_pi(t){var n=t.str.indexOf("?>"),r=t.str.substring(2,n),e=t.ary.length;return t.ary[e]=new _pi,t.ary[e].value=r,t.str=t.str.substring(n+2,t.str.length),t}function _tag_comment(t){var n=t.str.indexOf("-->"),r=t.str.substring(4,n),e=t.ary.length;return t.ary[e]=new _comment,t.ary[e].value=r,t.str=t.str.substring(n+3,t.str.length),t}function _tag_cdata(t){var n=t.str.indexOf("]]>"),r=t.str.substring(9,n),e=t.ary.length;return t.ary[e]=new _chardata,t.ary[e].value=r,t.str=t.str.substring(n+3,t.str.length),t}function _attribution(t){for(var n=new Array;;){var r=t.indexOf("=");if(0==t.length||-1==r)return n;var e=t.indexOf("'"),i=t.indexOf('"'),s=new Number,a=new String;(i>e&&-1!=e||-1==i)&&(s=e,a="'"),(e>i||-1==e)&&-1!=i&&(s=i,a='"');var u=t.indexOf(a,s+1),g=t.substring(s+1,u),l=_strip(t.substring(0,r));n[l]=_entity(g),t=t.substring(u+1,t.length)}return""}function _prolog(t){var n=new Array;n=t.split("\r\n"),t=n.join("\n"),n=t.split("\r"),t=n.join("\n");var r=t.indexOf("<");if("<?x"==t.substring(r,r+3)||"<?X"==t.substring(r,r+3)){var e=t.indexOf("?>");t=t.substring(e+2,t.length)}var r=t.indexOf("<!DOCTYPE");if(-1!=r){var e=t.indexOf(">",r)+1,i=t.indexOf("[",r);e>i&&-1!=i&&(e=t.indexOf("]>",r)+2),t=t.substring(e,t.length)}return t}function _strip(t){var n=new Array;return n=t.split("\n"),t=n.join(""),n=t.split(" "),t=n.join(""),n=t.split("	"),t=n.join("")}function _normalize(t){var n=new Array;return n=t.split("\n"),t=n.join(" "),n=t.split("	"),t=n.join(" ")}function _entity(t){var n=new Array;return n=t.split("&lt;"),t=n.join("<"),n=t.split("&gt;"),t=n.join(">"),n=t.split("&quot;"),t=n.join('"'),n=t.split("&apos;"),t=n.join("'"),n=t.split("&amp;"),t=n.join("&")}var _Xparse_count=0,_Xparse_index=new Array;

var calculatorXrc = 

'<resource xmlns="http://www.wxwindows.org/wxxrc" version="2.3.0.1">'+
'	<object class="wxPanel" name="MyPanel2">'+
'		<style>wxTAB_TRAVERSAL</style>'+
'		<size>582,394</size>'+
'		<object class="wxBoxSizer">'+
'			<orient>wxVERTICAL</orient>'+
'			<object class="sizeritem">'+
'				<option>0</option>'+
'				<flag>wxALL|wxEXPAND</flag>'+
'				<border>5</border>'+
'				<object class="wxTextCtrl" name="m_textCtrl1">'+
'					<size>-1,50</size>'+
'					<value></value>'+
'					<maxlength>0</maxlength>'+
'				</object>'+
'			</object>'+
'			<object class="sizeritem">'+
'				<option>0</option>'+
'				<flag></flag>'+
'				<border>5</border>'+
'				<object class="wxBoxSizer">'+
'					<orient>wxHORIZONTAL</orient>'+
'					<object class="sizeritem">'+
'						<option>0</option>'+
'						<flag>wxALL</flag>'+
'						<border>5</border>'+
'						<object class="wxButton" name="m_button3">'+
'							<label>MyButton</label>'+
'							<default>0</default>'+
'						</object>'+
'					</object>'+
'					<object class="sizeritem">'+
'						<option>0</option>'+
'						<flag>wxALL</flag>'+
'						<border>5</border>'+
'						<object class="wxButton" name="m_button4">'+
'							<label>MyButton</label>'+
'							<default>0</default>'+
'						</object>'+
'					</object>'+
'				</object>'+
'			</object>'+
'			<object class="sizeritem">'+
'				<option>1</option>'+
'				<flag>wxEXPAND</flag>'+
'				<border>5</border>'+
'				<object class="wxBoxSizer">'+
'					<orient>wxHORIZONTAL</orient>'+
'					<object class="sizeritem">'+
'						<option>0</option>'+
'						<flag>wxALL</flag>'+
'						<border>5</border>'+
'						<object class="wxButton" name="m_button11">'+
'							<label>MyButton</label>'+
'							<default>0</default>'+
'						</object>'+
'					</object>'+
'					<object class="sizeritem">'+
'						<option>0</option>'+
'						<flag>wxALL</flag>'+
'						<border>5</border>'+
'						<object class="wxButton" name="m_button12">'+
'							<label>MyButton</label>'+
'							<default>0</default>'+
'						</object>'+
'					</object>'+
'				</object>'+
'			</object>'+
'		</object>'+
'	</object>'+
'</resource>';



function assert(cond, msg){
	if(!cond){ console.log("assertion fail " + msg ? " : \"" + msg + "\"" : "");
		//print("assertion fail " + msg ? " : \"" + msg + "\"" : "" );
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

var doc = Xparse( calculatorXrc );
var resourceObj = getElemByName(doc, 'resource');

var xrcToAst = {

	parseItems: {
		parent: null,
		wxBoxSizer: function(obj, elem){
			var orient = getElemByName(obj, "orient");
			var sizeritems = obj.childElements;
			
			for (var i=0; i<sizeritems.length; ++i) {
				var sizeritem = sizeritems[i];
				if(sizeritem.name = "object"){
					elem.push(" divChild = document.createElement('div'); " +
						"  divChild.setAttribute('class','"+ orient.text +"'); ");
					this.parent.parseSizerItem(sizeritem, elem);
				}
			}
			return items
		},
		wxTextCtrl: function(obj, elem){
			var size = getElemByName(obj, "size");
			var value = getElemByName(obj, "value");
			var maxlength = getElemByName(obj, "maxlength");
			elem.push( "  textarea = document.createElement('textarea'); " +
					"  textarea.setAttribute('value','"+ value.text +"'); " +
					" divChild.appendChild( textarea ); " ) ;

		},
		wxButton: function(obj, elem){
			var label = getElemByName(obj, "label");
			elem.push( "  button = document.createElement('button'); " +
					"  textNode = document.createTextNode('" + label.text + "''); " +
					" button.appendChild( textNode ); " +
					" divChild.appendChild( button ); " ) ;
		},

		callParser: function(obj, elem){
			var classType = obj.attribute("class");
			var func = this[classType];
			assert(func, "function does not exist");
			this[classType](obj, elem);
		}
	}, 

	parseSizerItem: function (obj, elem){
		var option = getElemByName(obj, "option");
		var flag = getElemByName(obj, "flag");
		var border = getElemByName(obj, "border");
		var object = getElemByName(obj, "object");
		this.parseItems.callParser(object, elem);
	},

	parsePanel: function(obj, elem){
		var style = getElemByName(obj, "style")
		var size = getElemByName(obj, "size");
		var object = getElemByName(obj, "object");
		elem.push( "div = document.createElement('div'); ");
		var items = this.parseItems.callParser(object, elem);
	},

	startParser: function(obj){
		this.parseItems.parent = this;
		var parsed = [];
		this.parsePanel(obj, parsed);
		return parsed;
	}
};

var parsed = xrcToAst.startParser(resourceObj);


// var json = {};
// var rootName = rootElem.getName(); // the name of the root element is "songs"

// now, create the root property of our JSON object, and set its value to a new array,
// which will result in JSON that looks like this:
// { songs: [ ] }
// json[rootName] = [ ];  

// // loop through the child XML elements and create a JSON object for each one;
// // within each of those child JSON objects, we'll also convert the child element's
// // attributes to JSON properties
// for (var i=0; i<childElements.length; i++) {

//         var elem = childElements[i];
//         var attributes = elem.getAttributes();
        
//         var child = {}; // a song

//         for (var j=0; j<attributes.length; j++) { // add the attributes of the song as properties
//                 var attribute = attributes[j];
//                 child[attribute.getName()] = attribute.getValue(); // { attName: attValue }     
//         }

//         // attach the new child JSON object to the parent array
//         json[rootName].push(child); // { songs: [ { attName: attValue, attName: attValue, ... }, ... ] } 
        
// }