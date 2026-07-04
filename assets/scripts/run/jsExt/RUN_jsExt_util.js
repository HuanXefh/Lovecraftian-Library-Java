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
  Section: Definition (Object)
  ========================================
*/


  const TMP_TUP = [];


  /**
   * Gets a random key in `obj`.
   * @param {Object} obj
   * @return {string}
   */
  Object.randKey = function(obj) {
    return Object.keys(obj).readRand();
  };


  /**
   * Converts an array or argument object to object.
   * @param {Arguments} arr
   * @return {Object}
   */
  Object.arrToObj = function(arr) {
    let obj = {};

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
  Object.objToArr = function(obj) {
    let arr = [];

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
  Object.objTo2Arr = function(obj) {
    let arr = [];
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
  Object.mergeObj = function() {
    let obj0 = {};

    for(let obj of arguments) {
      if(typeof obj !== "object") continue;
      for(let key in obj) {
        obj0[key] = obj[key];
      };
    };

    return obj0;
  };


  /**
   * Variant of {@link Object.mergeObj} that mixes methods.
   * `addSuper` is used to call `super$xxx` if `override` is true.
   * <br> <ARGS>: obj1, obj2, obj3, ...
   * @return {Object}
   */
  Object.mergeObjMixin = function() {
    let obj0 = {};

    let superFun, fun;
    for(let obj of arguments) {
      if(typeof obj !== "object") continue;
      for(let key in obj) {
        if(typeof obj[key] !== "function" || typeof obj0[key] !== "function") {
          obj0[key] = obj[key];
        } else {
          superFun = obj0[key];
          fun = obj[key];
          fun.argLen = Math.max(tryVal(superFun.argLen, -1), tryVal(fun.argLen, -1));
          obj0[key] = !fun.override ?
            mixTempMethods(superFun, fun, MethodMixModes.NORMAL).wrapLen(fun.argLen) :
            !fun.addSuper ?
              fun.wrapLen(fun.argLen) :
              mixTempMethods(null, fun, MethodMixModes.BUILD, key);
          initTempMethod(obj0[key]).setProp({
            override: false,
            funPrev: superFun,
            funCur: fun,
          });
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
  Object.mergeObjDB = function thisFun(obj0, obj) {
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
                        console.err("[LOVEC] Cannot fully merge an object due to " + "too many layers".color(Pal.remove) + ".");
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
   * @param {string} nameFi
   * @param {string|unset} [nameModCur]
   * @return {void}
   */
  Object.mergeDB = function(dbObj, nameFi, nameModCur) {
    if(nameModCur == null) nameModCur = "lovec";

    let i = 0;
    Vars.mods.eachEnabled(mod => {
      if(mod.name === nameModCur) return;

      let path = mod.name + "/db/" + nameFi;
      let dbMdl;
      try {
        dbMdl = require(path);
      } catch(err) {
        dbMdl = null;
        if(!err.message.startsWith("Module ")) {
          console.err("[LOVEC] Error loading DB file from ${1}:\n".format(mod.name.color(Pal.accent)) + err);
        };
      };

      if(dbMdl != null) {
        Object.mergeObjDB(dbObj, dbMdl.db);
        i++;
      };
    });

    console.log("[LOVEC] Merged ${1} DB file(s) for ${2} in ${3} from other mods.".format(i, nameFi, nameModCur.color(Pal.accent)));
  };


/*
  ========================================
  Section: Definition (Number)
  ========================================
*/


  /**
   * Converts a tile coordinate to world coordinate.
   * @param {number|unset} [size]
   * @return {number}
   */
  Number.prototype.toFCoord = function(size) {
    return size == null ?
      LCFormat.toFCoord(this) :
      LCFormat.toFCoord(this, size);
  };


  /**
   * Converts a world coordinate to tile coordinate.
   * @return {number}
   */
  Number.prototype.toIntCoord = function() {
    return LCFormat.toIntCoord(this);
  };


  /**
   * Converts a rectangular range parameter to full width.
   * @param {number} size
   * @return {number}
   */
  Number.prototype.toRectW = function(size) {
    return LCFormat.calcRectW(this, size);
  };


  /**
   * Converts a rectangular range parameter to half width.
   * @param {number} size
   * @return {number}
   */
  Number.prototype.toRectHW = function(size) {
    return LCFormat.calcRectHW(this, size);
  };


/*
  ========================================
  Section: Definition (Array)
  ========================================
*/


  /**
   * Whether `ins` is instance of any class (or content template) from this array.
   * @param {Object} ins
   * @return {boolean}
   */
  Array.prototype.hasIns = function(ins) {
    return this.some(cls => checkInstance(ins, cls));
  };
