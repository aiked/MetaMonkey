y = "begin";
.&
    ;
;
.&
    if (1) {
    print("staging vol.1");
    }
;
.&
    ;
;
.&
    var stg = "stage 2";
;
.&
    y = {loc:null, type:"Program", body:[{loc:null, type:"VariableDeclaration", kind:"var", declarations:[{loc:null, type:"VariableDeclarator", id:{loc:null, type:"Identifier", name:"stg"}, init:{loc:null, type:"Literal", value:"stage 1"}}]}]};
;
.!y;
t = "finish";
