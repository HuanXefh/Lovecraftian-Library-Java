/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * Utility methods.
   * ---------------------------------------- */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- object ----------> */


  var cls = Object;


  /* ----------------------------------------
   * NOTE:
   *
   * Gets a random key in {obj}.
   * ---------------------------------------- */
  cls.randKey = function(obj) {
    return Object.keys(obj).readRand();
  };


  /* ----------------------------------------
   * NOTE:
   *
   * Converts array to object.
   * This also works on function arguments.
   * ---------------------------------------- */
  cls.arrToObj = function(arr) {
    const obj = {};

    let i = 0, iCap = arr.iCap();
    while(i < iCap) {
      obj[i] = arr[i];
      i++;
    };

    return obj;
  };


  /* ----------------------------------------
   * NOTE:
   *
   * Converts object to array (loses all keys).
   * ---------------------------------------- */
  cls.objToArr = function(obj) {
    const arr = [];

    let i = 0;
    for(let key in obj) {
      arr[i] = obj[key];
      i++;
    };

    return arr;
  };


  /* ----------------------------------------
   * NOTE:
   *
   * Converts object to 2-array.
   * ---------------------------------------- */
  cls.objTo2Arr = function(obj) {
    const arr = [];
    if(obj == null) return arr;

    let i = 0;
    for(let key in obj) {
      arr[i] = key;
      arr[i + 1] = obj[key];
      i += 2;
    };

    return arr;
  };


  /* ----------------------------------------
   * NOTE:
   *
   * @ARGS: obj1, obj2, obj3, ...
   * Simply merges a series of objects.
   * Properties defined later will overwrite the ones defined before.
   * ---------------------------------------- */
  cls.mergeObj = function() {
    const obj0 = {};

    for(let obj of arguments) {
      for(let key in obj) {
        obj0[key] = obj[key];
      };
    };

    return obj0;
  };


  /* ----------------------------------------
   * NOTE:
   *
   * @ARGS: obj1, obj2, obj3, ...
   * A variant of {mergeObj} that tries merging methods.
   * Mostly used for modification of objects built by content templates.
   *
   * {addSuper} is used to call {super$xxx} on rare occassions.
   * ---------------------------------------- */
  cls.mergeObjMixin = function() {
    const obj0 = {};

    for(let obj of arguments) {
      for(let key in obj) {
        if(typeof obj[key] !== "function" || typeof obj0[key] !== "function") {
          obj0[key] = obj[key];
        } else {
          let funPrev = obj0[key];
          let funCur = obj[key];
          let argLen = Math.max(tryVal(funPrev.argLen, -1), tryVal(funCur.argLen, -1));
          let fun = !funCur.override ?
            (
              funPrev.final ?
                funPrev :
                funCur.boolMode === "and" ?
                  function() {
                    return funPrev.apply(this, arguments) && funCur.apply(this, arguments);
                  }.wrapLen(argLen) :
                  funCur.boolMode === "or" ?
                    function() {
                      return funPrev.apply(this, arguments) || funCur.apply(this, arguments);
                    }.wrapLen(argLen) :
                    funCur.mergeMode === "object" ?
                      function() {
                        return Object.mergeObj(funPrev.apply(this, arguments), funCur.apply(this, arguments));
                      }.wrapLen(argLen) :
                      funCur.mergeMode === "array" ?
                        function() {
                          return funPrev.apply(this, arguments).pushAll(funCur.apply(this, arguments));
                        }.wrapLen(argLen) :
                        typeof funCur.mergeMode === "function" ?
                          function() {
                            return funCur.mergeMode(funPrev.apply(this, arguments), funCur.apply(this, arguments));
                          }.wrapLen(argLen) :
                          function() {
                            funPrev.apply(this, arguments);
                            return funCur.apply(this, arguments);
                          }.wrapLen(argLen)
            ) :
            !funCur.addSuper ?
              funCur.wrapLen(argLen) :
              (
                tryVal(funCur.superBoolMode, funCur.boolMode) === "and" ?
                  function() {
                    return this["super$" + key].apply(this, arguments) && funCur.apply(this, arguments);
                  }.wrapLen(argLen) :
                  tryVal(funCur.superBoolMode, funCur.boolMode) === "or" ?
                    function() {
                      return this["super$" + key].apply(this, arguments) || funCur.apply(this, arguments);
                    }.wrapLen(argLen) :
                    funCur.mergeMode === "object" ?
                      function() {
                        return Object.mergeObj(this["super$" + key].apply(this, arguments), funCur.apply(this, arguments));
                      }.wrapLen(argLen) :
                      funCur.mergeMode === "array" ?
                        function() {
                          return this["super$" + key].apply(this, arguments).pushAll(funCur.apply(this, arguments));
                        }.wrapLen(argLen) :
                        typeof funCur.mergeMode === "function" ?
                          function() {
                            return funCur.mergeMode(this["super$" + key].apply(this, arguments), funCur.apply(this, arguments));
                          }.wrapLen(argLen) :
                          function() {
                            this["super$" + key].apply(this, arguments);
                            return funCur.apply(this, arguments);
                          }.wrapLen(argLen)
              );
          fun.setProp({
            noSuper: tryVal(funCur.noSuper, false),
            addSuper: tryVal(funCur.addSuper, false),
            override: false,
            final: tryVal(funCur.final, false),
            boolMode: tryVal(funCur.boolMode, "none"),
            superBoolMode: tryVal(funCur.superBoolMode, tryVal(funCur.boolMode, "none")),
            mergeMode: tryVal(funCur.mergeMode, "none"),
            argLen: Math.max(tryVal(funPrev.argLen, -1), tryVal(funCur.argLen, -1)),
            funPrev: funPrev,
            funCur: funCur,
          });
          // I know it's very unsightreadable so darn it
          obj0[key] = fun;
        };
      };
    };

    return obj0;
  };


  /* ----------------------------------------
   * NOTE:
   *
   * Merges two DB objects.
   * Only objects and arrays should be present in the object.
   *
   * I have no idea how to simply this.
   * ---------------------------------------- */
  cls.mergeObjDB = function thisFun(obj0, obj) {
    Object._it(obj0, (key1, val1) => {
      // Depth: 0
      val1 instanceof Array ?
        thisFun.applyMerge(key1, obj, val1) :
        Object._it(obj0[key1], (key2, val2) => {
          // Depth: 1
          val2 instanceof Array ?
            thisFun.applyMerge(key2, Object.dir(obj, [key1], Object.air), val2) :
            Object._it(obj0[key1][key2], (key3, val3) => {
              // Depth: 2
              val3 instanceof Array ?
                thisFun.applyMerge(key3, Object.dir(obj, [key1, key2], Object.air), val3) :
                Object._it(obj0[key1][key2][key3], (key4, val4) => {
                  // Depth: 3
                  val4 instanceof Array ?
                    thisFun.applyMerge(key4, Object.dir(obj, [key1, key2, key3], Object.air), val4) :
                    Object._it(obj0[key1][key2][key3][key4], (key5, val5) => {
                      // Depth: 4
                      val5 instanceof Array ?
                        thisFun.applyMerge(key5, Object.dir(obj, [key1, key2, key3, key4], Object.air), val5) :
                        Log.warn("[LOVEC] Cannot fully merge an object due to " + "too many layers".color(Pal.remove) + ".");
                    });
                });
            });
        });
    });

  }
  .setProp({
    applyMerge: (key, objTg, arrTg) => {
      let tmp = objTg[key];
      if(tmp == null || !(tmp instanceof Array)) return;

      arrTg.pushAll(tmp);
    },
  });


  /* ----------------------------------------
   * NOTE:
   *
   * Merges all found DB files with the same name, in "scripts/db".
   * Cross-mod.
   * ---------------------------------------- */
  cls.mergeDB = function(dbObj, nmFi, nmModCur) {
    if(nmModCur == null) nmModCur = "lovec";

    let i = 0;
    Vars.mods.eachEnabled(mod => {
      if(mod.name === nmModCur) return;

      let path = mod.name + "/db/" + nmFi;
      let dbMdl;
      try {
        dbMdl = require(path);
      } catch(err) {
        dbMdl = null;
        if(!err.message.startsWith("Module ")) {
          Log.warn("[LOVEC] Error loading DB file from [$1]:\n".format(mod.name.color(Pal.accent)) + err);
        };
      };

      if(dbMdl != null) {
        Object.mergeObjDB(dbObj, dbMdl.db);
        i++;
      };
    });

    Log.info("[LOVEC] Merged [$1] DB file(s) for [$2] in [$3] from other mods.".format(i, nmFi, nmModCur.color(Pal.accent)));
  };


  /* <---------- number ----------> */


  var ptp = Number.prototype;


  /* ----------------------------------------
   * NOTE:
   *
   * Converts a tile coordination to world coordination.
   * ---------------------------------------- */
  ptp.toFCoord = function(size) {
    return this * Vars.tilesize + (tryVal(size, 1) % 2 === 0 ? 4.0 : 0.0);
  };


  /* ----------------------------------------
   * NOTE:
   *
   * Converts a world coordination to tile coordination.
   * ---------------------------------------- */
  ptp.toIntCoord = function() {
    return Math.round(this / Vars.tilesize);
  };


  /* ----------------------------------------
   * NOTE:
   *
   * Converts a rectangular range parameter to full width of the rectangle.
   * ---------------------------------------- */
  ptp.toRectW = function(size) {
    return (this * 2.0 + size) * Vars.tilesize;
  };


  /* <---------- array ----------> */


  var ptp = Array.prototype;


  /* ----------------------------------------
   * NOTE:
   *
   * Whether {obj} is an instance of at least one class from this array.
   * Used only for class arrays.
   * ---------------------------------------- */
  ptp.hasIns = function(obj) {
    return this.some(cls => obj instanceof cls);
  };
