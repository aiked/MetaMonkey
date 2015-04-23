// from http://underscorejs.org/underscore.js
//
// differences: computed (>|<) lastComputed, value (>|<) result, computed === (?-)Infinity


// Return the maximum element (or element-based computation).
// _.max = function(obj, iteratee, context) {
//   var result = -Infinity, lastComputed = -Infinity,
//       value, computed;
//   if (iteratee == null && obj != null) {
//     obj = obj.length === +obj.length ? obj : _.values(obj);
//     for (var i = 0, length = obj.length; i < length; i++) {
//       value = obj[i];
//       if (value > result) {
//         result = value;
//       }
//     }
//   } else {
//     iteratee = _.iteratee(iteratee, context);
//     _.each(obj, function(value, index, list) {
//       computed = iteratee(value, index, list);
//       if (computed > lastComputed || computed === -Infinity && result === -Infinity) {
//         result = value;
//         lastComputed = computed;
//       }
//     });
//   }
//   return result;
// };

// // Return the minimum element (or element-based computation).
// _.min = function(obj, iteratee, context) {
//   var result = Infinity, lastComputed = Infinity,
//       value, computed;
//   if (iteratee == null && obj != null) {
//     obj = obj.length === +obj.length ? obj : _.values(obj);
//     for (var i = 0, length = obj.length; i < length; i++) {
//       value = obj[i];
//       if (value < result) {
//         result = value;
//       }
//     }
//   } else {
//     iteratee = _.iteratee(iteratee, context);
//     _.each(obj, function(value, index, list) {
//       computed = iteratee(value, index, list);
//       if (computed < lastComputed || computed === Infinity && result === Infinity) {
//         result = value;
//         lastComputed = computed;
//       }
//     });
//   }
//   return result;
// };

.& {
  function genCompare( sign ){

    var arrayCompAst;
    var objCompAst;
    var infCompAst;
    if(sign){
      arrayCompAst = .< value < result; >.;
      objCompAst = .< computed < lastComputed; >.;
      infCompAst = .< Infinity; >.;
    }else{
      arrayCompAst = .< value > result; >.;
      objCompAst = .< computed > lastComputed; >.;
      infCompAst = .< -Infinity; >.;
    }

    return .<

      (function(obj, iteratee, context) {
        var result = Infinity, lastComputed = Infinity,
            value, computed;
        if (iteratee == null && obj != null) {
          obj = obj.length === +obj.length ? obj : _.values(obj);
          for (var i = 0, length = obj.length; i < length; i++) {
            value = obj[i];
            if (.~arrayCompAst) {
              result = value;
            }
          }
        } else {
          iteratee = _.iteratee(iteratee, context);
          _.each(obj, function(value, index, list) {
            computed = iteratee(value, index, list);
            if (.~objCompAst || computed === .~infCompAst && result === .~infCompAst) {
              result = value;
              lastComputed = computed;
            }
          });
        }
        return result;
      });

    >.;
  }
};

_.max = .!genCompare( true );
_.min = .!genCompare( false );