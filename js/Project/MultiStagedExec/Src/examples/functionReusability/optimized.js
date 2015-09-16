// from http://backbonejs.org/backbone.js
//


// A difficult-to-believe, but optimized internal dispatch function for
// triggering events. Tries to keep the usual cases speedy (most internal
// Backbone events have 3 arguments).
//
// var triggerEvents = function(event, args) {
//   var ev, i = -1, a1 = args[0], a2 = args[1], a3 = args[2];
//   switch (args.length) {
//     case 0: event.callback.call(ev.ctx); return;
//     case 1:event.callback.call(ev.ctx, a1); return;
//     case 2:event.callback.call(ev.ctx, a1, a2); return;
//     case 3:event.callback.call(ev.ctx, a1, a2, a3); return;
//     default:event.callback.apply(ev.ctx, args); return;
//   }
// };

.& {
  function genMultiParameterOptimizer(argumentsLength){

    var optimizedAst = .< 

      (function(event, args) {
        var ev, i = -1;
        switch (args.length) {
          case 0: event.callback.call(ev.ctx); return;
          default: event.callback.apply(ev.ctx, args); return;
        }
      });

    >.;


    var switchAst = optimizedAst.body[0].expression.body.body[1];

    for(var i=0; i<argumentsLength; ++i){
      var newoptimizedFuncall = JSON.parse( JSON.stringify( switchAst.cases[i] ) );
      var argumentsAst = newoptimizedFuncall.consequent[0].expression.arguments;
      newoptimizedFuncall.test.value = i + 1;
      var argAst = (.< args[.@i]; >.).body[0].expression;
      argumentsAst.push( argAst );
      switchAst.cases.splice(i + 1, 0, newoptimizedFuncall);
    }
    
    return optimizedAst;
  }
};


var triggerEvents = .!genMultiParameterOptimizer(10);





///////////////////////


var triggerEvents = function(events, args) {
  var ev, i = -1, l = events.length, a1 = args[0], a2 = args[1], a3 = args[2];
  switch (args.length) {
    case 0: while (++i < l) (ev = events[i]).callback.call(ev.ctx); return;
    case 1: while (++i < l) (ev = events[i]).callback.call(ev.ctx, a1); return;
    case 2: while (++i < l) (ev = events[i]).callback.call(ev.ctx, a1, a2); return;
    case 3: while (++i < l) (ev = events[i]).callback.call(ev.ctx, a1, a2, a3); return;
    default: while (++i < l) (ev = events[i]).callback.apply(ev.ctx, args); return;
  }
};

function genMultiParameterOptimizer(argumentsLength){

  var casesArgsAst = .< ev.ctx >.;
  for(var i=0; i<argumentsLength; ++i){
    var caseArgsAst = .< .~casesArgsAst, args[.@i] >.;
    optimizedAst = .< .~optimizedAst;
      case .@i: event.callback.call(.~caseArgsAst); return;
    >.;
  }

  return .< 

    (function(event, args) {
      var ev, i = -1;
      switch (args.length) {
        case 0: event.callback.call(ev.ctx); return;
        .~casesArgsAst;
        default: event.callback.apply(ev.ctx, args); return;
      }
    });

  >.;
}