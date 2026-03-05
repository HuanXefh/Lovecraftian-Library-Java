/*
  ========================================
  Section: Introduction
  ========================================
*/


  /**
   * Utility methods.
   */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  /* <---------- object ----------> */


  var cls = Object;


  /**
   * Gets a random key in `obj`.
   * @param {Object} obj
   * @return {string}
   */
  cls.randKey = function(obj) {
    return Object.keys(obj).readRand();
  };


  /**
   * Converts an array or argument object to object.
   * @param {Arguments} arr
   * @return {Object}
   */
  cls.arrToObj = function(arr) {
    const obj = {};

    let i = 0, iCap = arr.iCap();
    while(i < iCap) {
      obj[i] = arr[i];
      i++;
    };

    return obj;
  };


  /**
   * Converts an object to array (loses all keys).
   * @param {Object} obj
   * @return {Array}
   */
  cls.objToArr = function(obj) {
    const arr = [];

    let i = 0;
    for(let key in obj) {
      arr[i] = obj[key];
      i++;
    };

    return arr;
  };


  /**
   * Converts an object to 2-array (keeps all keys).
   * @param {Object} obj
   * @return {Array}
   */
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


  /**
   * Merges a series of objects.
   * Properties defined later will overwrite the ones defined before.
   * <br> <ARGS>: obj1, obj2, obj3, ...
   * @return {Object}
   */
  cls.mergeObj = function() {
    const obj0 = {};

    for(let obj of arguments) {
      for(let key in obj) {
        obj0[key] = obj[key];
      };
    };

    return obj0;
  };


  /**
   * Variant of {@link Object.mergeObj} that mixes methods.
   * Instead of `noSuper`, `addSuper` is used to call `super$xxx`.
   * <br> <ARGS>: obj1, obj2, obj3, ...
   * @return {Object}
   */
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


  /**
   * Merges two DB objects.
   * @param {Object} obj0
   * @param {Object} obj
   * @return {Object}
   */
  cls.mergeObjDB = function thisFun(obj0, obj) {
    Object._it(obj0, (key1, val1) => {
      // Depth: 0
      val1 instanceof Array ?
        thisFun.applyMerge(key1, obj, val1) :
        Object._it(obj0[key1], (key2, val2) => {
          // Depth: 1
          val2 instanceof Array ?
            thisFun.applyMerge(key2, Object.findByKeys(obj, [key1], Object.air), val2) :
            Object._it(obj0[key1][key2], (key3, val3) => {
              // Depth: 2
              val3 instanceof Array ?
                thisFun.applyMerge(key3, Object.findByKeys(obj, [key1, key2], Object.air), val3) :
                Object._it(obj0[key1][key2][key3], (key4, val4) => {
                  // Depth: 3
                  val4 instanceof Array ?
                    thisFun.applyMerge(key4, Object.findByKeys(obj, [key1, key2, key3], Object.air), val4) :
                    Object._it(obj0[key1][key2][key3][key4], (key5, val5) => {
                      // Depth: 4
                      val5 instanceof Array ?
                        thisFun.applyMerge(key5, Object.findByKeys(obj, [key1, key2, key3, key4], Object.air), val5) :
                        Log.warn("[LOVEC] Cannot fully merge an object due to " + "too many layers".color(Pal.remove) + ".");
                    });
                });
            });
        });
    });

    return obj0;
  }
  .setProp({
    applyMerge: (key, objTg, arrTg) => {
      let tmp = objTg[key];
      if(tmp == null || !(tmp instanceof Array)) return;

      arrTg.pushAll(tmp);
    },
  });


  /**
   * Merges all found DB files with the same name in "scripts/db" folder.
   * Cross-mod.
   * @param {Object} dbObj
   * @param {string} nmFi
   * @param {string|unset} [nmModCur]
   * @return {void}
   */
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


  /**
   * Converts a tile coordinate to world coordinate.
   * @param {number|unset} [size]
   * @return {number}
   */
  ptp.toFCoord = function(size) {
    return size == null ?
      LCFormat.toFCoord(this) :
      LCFormat.toFCoord(this, size);
  };


  /**
   * Converts a world coordinate to tile coordinate.
   * @return {number}
   */
  ptp.toIntCoord = function() {
    return LCFormat.toIntCoord(this);
  };


  /**
   * Converts a rectangular range parameter to full width.
   * @param {number} size
   * @return {number}
   */
  ptp.toRectW = function(size) {
    return LCFormat.calcRectW(this, size);
  };


  /**
   * Converts a rectangular range parameter to half width.
   * @param {number} size
   * @return {number}
   */
  ptp.toRectHW = function(size) {
    return LCFormat.calcRectHW(this, size);
  };


  /* <---------- array ----------> */


  var ptp = Array.prototype;


  /**
   * Whether `obj` is instance of any class from this array.
   * @param {Object} obj
   * @return {boolean}
   */
  ptp.hasIns = function(obj) {
    return this.some(cls => obj instanceof cls);
  };
