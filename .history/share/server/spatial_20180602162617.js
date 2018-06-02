var Spatial = (function() {

    var index_results = []; // holds temporary emitted values during index
  
    function handleIndexError(err, doc) {
      if (err == "fatal_error") {
        throw(["error", "map_runtime_error", "function raised 'fatal_error'"]);
      } else if (err[0] == "fatal") {
        throw(err);
      }
      var message = "function raised exception " + err.toSource();
      if (doc) message += " with doc._id " + doc._id;
      log(message);
    };
  
    return {
      index: function(value, options) {
          index_results.push([value, options || {}]);
      },
  
      indexDoc: function(doc) {
        Couch.recursivelySeal(doc);
        var buf = [];
        for each (fun in State.funs) {
          index_results = [];
          try {
            fun(doc);
            buf.push(index_results);
          } catch (err) {
            handleIndexError(err, doc);
            buf.push([]);
          }
        }
        print(JSON.stringify(buf));
      }
  
    }
  })();