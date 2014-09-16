// from http://backbonejs.org/backbone.js
//


// A difficult-to-believe, but optimized internal dispatch function for
// triggering events. Tries to keep the usual cases speedy (most internal
// Backbone events have 3 arguments).
//
// var triggerEvents = function(events, args) {
//   var ev, i = -1, l = events.length, a1 = args[0], a2 = args[1], a3 = args[2];
//   switch (args.length) {
//     case 0: while (++i < l) (ev = events[i]).callback.call(ev.ctx); return;
//     case 1: while (++i < l) (ev = events[i]).callback.call(ev.ctx, a1); return;
//     case 2: while (++i < l) (ev = events[i]).callback.call(ev.ctx, a1, a2); return;
//     case 3: while (++i < l) (ev = events[i]).callback.call(ev.ctx, a1, a2, a3); return;
//     default: while (++i < l) (ev = events[i]).callback.apply(ev.ctx, args); return;
//   }
// };


function genMultiParameterOptimizer(){

  var optimizedAst = .< 

    (function(events, args) {
      var ev, i = -1, l = events.length;
      switch (args.length) {
        case 0: while (++i < l) (ev = events[i]).callback.call(ev.ctx); return;
        default: while (++i < l) (ev = events[i]).callback.apply(ev.ctx, args); return;
      }
    });

  >.;


  var switchAst = optimizedAst.body[0].expression.body.body[1];

  for(var i=1; i<6; ++i){
    var lastCase = JSON.parse( JSON.stringify( switchAst.cases[i-1] ) );
    var newoptimizedFuncall = JSON.parse( JSON.stringify( switchAst.cases[0] ) );
    newoptimizedFuncall.test.value = i;
    newoptimizedFuncall.consequent[0].body.expression.arguments
    switchAst.cases.splice(i, 0, newoptimizedFuncall);
  }
  
  return optimizedAst;
}


var triggerEvents = .!genMultiParameterOptimizer();