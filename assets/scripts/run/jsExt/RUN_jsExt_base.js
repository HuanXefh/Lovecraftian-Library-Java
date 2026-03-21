/*
  ========================================
  Section: Introduction
  ========================================
*/


  /**
   * Fundamental methods for JavaScript native types.
   */


/*
  ========================================
  Section: Definition (Object)
  ========================================
*/


  /**
   * Gets key by reading values in `obj`.
   * @param {Object} obj
   * @param {any} val
   * @param {any} [def]
   * @return {any}
   */
  Object.findKeyByVal = function(obj, val, def) {
    let key_fi = def;
    for(let key in obj) {
      if(obj[key] !== val) continue;
      key_fi = key;
    };
    return key_fi;
  };


  /**
   * Gets last child object found in `obj` when searching with given keys.
   * @param {Object} obj
   * @param {Array<string>} keys
   * @param {any} [def] - If given, returns `def` if not found.
   * @return {any}
   */
  Object.findByKeys = function(obj, keys, def) {
    let tg = obj;
    let tmp = null;

    let i = 0, iCap = keys.iCap();
    while(i < iCap) {
      tmp = tg[keys[i]];
      if(tmp != null) {
        tg = tmp;
      } else if(def !== undefined) {
        return def;
      } else break;
      i++;
    };

    return tg;
  };


  /**
   * Deletes every accessible property in `obj`.
   * Use with care!
   * @template T
   * @param {T} obj
   * @return {T}
   */
  Object.clear = function(obj) {
    for(let key in obj) {
      delete obj[key];
    };

    return obj;
  };


  /**
   * Iterates through all key-value pairs in an object.
   * @param {Object} obj
   * @param {function(string, any): void} scr - <ARGS>: key, val.
   * @param {boolean|unset} [forceIns] - If true, methods in `obj` will be ignored.
   * @return {void}
   */
  Object._it = function(obj, scr, forceIns) {
    if(!forceIns) {
      for(let key in obj) {
        scr(key, obj[key]);
      };
    } else {
      for(let key in obj) {
        if(obj[key] != null && typeof obj[key] === "object") scr(key, obj[key]);
      };
    };
  };


  /**
   * Sets a lot of properties for `obj`.
   * <br> <ARGS>: obj, propObj
   * <br> <ARGS>: obj, isFinal, nmProp1, val1, nmProp2, val2, nmProp3, val3, ...
   * @template T
   * @param {T} obj
   * @return {T}
   */
  Object.setProp = function(obj) {
    if(arguments.length === 2) {
      for(let key in arguments[1]) {
        obj[key] = arguments[1][key];
      };
    } else {
      let i = 2, iCap = arguments.length;
      while(i < iCap) {
        Object.defineProperty(obj, arguments[i], {value: arguments[i + 1], writable: !arguments[1]});
        i += 2;
      };
    };

    return obj;
  };


  /**
   * Clones all properties from `objOld` to `objNew`.
   * @template T
   * @param {T} objNew
   * @param {Object} objOld
   * @return {T}
   */
  Object.cloneProp = function(objNew, objOld) {
    Object._it(objOld, (key, prop) => {
      objNew[key] = prop;
    });

    return objNew;
  };


  /**
   * Variant of {@link Object._it} for instance.
   * @func Object#_it
   * @param {function(string, any): void} scr
   * @param {boolean|unset} [forceIns]
   * @return {void}
   */
  setHiddenProp(Object.prototype, "_it", function(scr, forceIns) {
    Object._it(this, scr, forceIns);
  });


  /**
   * Variant of {@link Object.setProp} for instance.
   * <br> <ARGS>: obj, propObj
   * <br> <ARGS>: obj, isFinal, nmProp1, val1, nmProp2, val2, nmProp3, val3, ...
   * @func Object#setProp
   * @return {this}
   */
  setHiddenProp(Object.prototype, "setProp", function() {
    let args = Array.from(arguments);
    args.unshift(this);
    return Object.setProp.apply(this, args);
  });


  /**
   * Variant of {@link Object.cloneProp} for instance.
   * @func Object#cloneProp
   * @param {Object} objOld
   * @return {this}
   */
  setHiddenProp(Object.prototype, "cloneProp", function(objOld) {
    return Object.cloneProp(this, objOld);
  });


/*
  ========================================
  Section: Definition (Number)
  ========================================
*/


  /**
   * Iteration using this number (rounded) as cap.
   * @override
   * @param {function(number): void} scr
   * @param {number|unset} [gap]
   * @param {number|unset} [base]
   * @return {void}
   */
  Number.prototype._it = function(scr, gap, base) {
    if(gap == null) gap = 1;
    if(base == null) base = 0;

    gap = Math.round(gap);
    if(gap < 1) return;
    let iCap = Math.round(this);
    if(iCap < 1) return;

    let i = base;
    while(i < iCap) {
      scr(i);
      i += gap;
    };
  };


  /**
   * Gets next integer.
   * @return {number}
   */
  Number.prototype.next = function() {
    return Math.round(this) + 1;
  };


/*
  ========================================
  Section: Definition (String)
  ========================================
*/


  /**
   * Gets cap for iteration.
   * @return {number}
   */
  String.prototype.iCap = function() {
    return this.length;
  };


/*
  ========================================
  Section: Definition (Array)
  ========================================
*/


  /**
   * Iterates through each element pair in `arr1` and `arr2`.
   * @param {Array} arr1
   * @param {Array} arr2
   * @param {function(any, any): void} scr
   * @return {void}
   */
  Array.forEachPair = function(arr1, arr2, scr) {
    let i = 0, j, iCap = arr1.iCap(), jCap = arr2.iCap();
    while(i < iCap) {
      j = 0;
      while(j < jCap) {
        scr(arr1[i], arr2[j]);
        j++;
      };
      i++;
    };
  };


  /**
   * Gets cap for iteration.
   * @return {number}
   */
  Array.prototype.iCap = function() {
    return this.length;
  };


  /**
   * Not really faster.
   * Use this instead of {@link Array#forEach} so you won't accidentally call it on something like {@link Seq}, which can crash the game on Android.
   * @param {function(any): void} scr
   * @return {void}
   */
  Array.prototype.forEachFast = function(scr) {
    let iCap = this.iCap();
    if(iCap === 0) return;
    for(let i = 0; i < iCap; i++) {
      scr(this[i]);
    };
  };


  /**
   * Variant of {@link Array#forEach} with a condition check.
   * @param {function(any): boolean} boolF
   * @param {function(any): void} scr
   * @return {void}
   */
  Array.prototype.forEachCond = function(boolF, scr) {
    if(boolF == null) boolF = Function.airTrue;

    let iCap = this.iCap();
    if(iCap === 0) return;
    for(let i = 0; i < iCap; i++) {
      if(boolF(this[i])) scr(this[i]);
    };
  };


  /**
   * Variant of {@link Array#forEach} used for layered array.
   * This one provides index and array reference which are hard to access directly.
   * @param {function(any, number, Array): void} scr
   * @return {void}
   */
  Array.prototype.forEachAll = function(scr) {
    Array.prototype.forEachAll.callIt.apply(this, [scr]);
  };
  Array.prototype.forEachAll.callIt = function(scr) {
    let i = 0, iCap = this.iCap();
    while(i < iCap) {
      this[i] instanceof Array ?
        Array.prototype.forEachAll.callIt.apply(this[i], [scr]) :
        scr(this[i], i, this);
      i++;
    };
  };


  /**
   * Variant of {@link Array#forEach} used for formatted array.
   * @param {number|unset} ord
   * @param {function(...any): void} scr - Arguments here will be elements in each row.
   * @return {void}
   */
  Array.prototype.forEachRow = function(ord, scr) {
    if(ord == null) ord = 1;

    let iCap = this.iCap();
    if(iCap === 0) return;
    let tmpArr = [];
    for(let i = 0, j = 0; i < iCap; i += ord) {
      tmpArr.clear();
      while(j < ord) {
        tmpArr.push(this[i + j]);
        j++;
      };
      j = 0;
      scr.apply(null, tmpArr);
    };
  };


  /**
   * Empties this array.
   * @return {this}
   */
  Array.prototype.clear = function() {
    this.length = 0;

    return this;
  };


  /**
   * Sets length and fills this array with some value.
   * @param {any} val0valGetter - Use a function here if the value to fill is an object like array.
   * @param {number|unset} [len]
   * @return {this}
   */
  Array.prototype.setVal = function(val0valGetter, len) {
    if(len == null) len = this.length;

    this.clear();
    let i = 0;
    if(typeof val0valGetter !== "function") {
      while(i < len) {
        this[i] = val0valGetter;
        i++;
      };
    } else {
      while(i < len) {
        this[i] = val0valGetter();
        i++;
      };
    };

    return this;
  };
