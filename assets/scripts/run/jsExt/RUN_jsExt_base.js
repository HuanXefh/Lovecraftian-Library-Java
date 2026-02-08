/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * Fundamental methods for JavaScript native types.
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
   * Returns the last child object that is not {undefined} when searching with given keys.
   * If {def} is given, returns it instead if not found.
   * ---------------------------------------- */
  cls.dir = function(obj, keys, def) {
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


  /* ----------------------------------------
   * NOTE:
   *
   * Deletes every accessible properties in {obj}.
   * Use with care!
   * ---------------------------------------- */
  cls.clear = function(obj) {
    for(let key in obj) {
      delete obj[key];
    };

    return obj;
  };


  /* ----------------------------------------
   * NOTE:
   *
   * Iterates through an object (or function, whatever), if you're that lazy.
   * {_it_xxx} means interation, I assume that you have seen it in {MDL_pos}.
   * ---------------------------------------- */
  cls._it = function(obj, scr, forceIns) {
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


  /* ----------------------------------------
   * NOTE:
   *
   * @ARGS: obj, propObj
   * @ARGS: obj, isFinal, nmProp1, val1, nmProp2, val2, nmProp3, val3, ...
   * Sets a lot of properties for {obj}.
   * ---------------------------------------- */
  cls.setProp = function() {
    if(arguments.length === 2 && typeof arguments[1] === "object") {
      for(let key in arguments[1]) {
        arguments[0][key] = arguments[1][key];
      };
    } else {
      let i = 2, iCap = arguments.length;
      while(i < iCap) {
        Object.defineProperty(arguments[0], arguments[i], {value: arguments[i + 1], writable: !arguments[1]});
        i += 2;
      };
    };

    return arguments[0];
  };


  /* ----------------------------------------
   * NOTE:
   *
   * Clones all properties from {objOld} to {objNew}.
   * ---------------------------------------- */
  cls.cloneProp = function(objNew, objOld) {
    Object._it(objOld, (key, prop) => {
      objNew[key] = prop;
    });

    return objNew;
  };


  /* ----------------------------------------
   * NOTE:
   *
   * Whether {obj} has {key}.
   * ---------------------------------------- */
  cls.hasKey = function(obj, key) {
    return obj[key] !== undefined;
  };


  var ptp = Object.prototype;


  /* ----------------------------------------
  * NOTE:
  *
  * Instance version of {Object._it}.
  * ---------------------------------------- */
  setHiddenProp(ptp, "_it", function(scr, forceIns) {
    Object._it(this, scr, forceIns);
  });


  /* ----------------------------------------
  * NOTE:
  *
  * Instance version of {Object.setProp}.
  * ---------------------------------------- */
  setHiddenProp(ptp, "setProp", function() {
    let args = Array.from(arguments);
    args.unshift(this);
    return Object.setProp.apply(this, args);
  });


  /* ----------------------------------------
  * NOTE:
  *
  * Instance version of {Object.cloneProp}.
  * ---------------------------------------- */
  setHiddenProp(ptp, "cloneProp", function(objOld) {
    return Object.cloneProp(this, objOld);
  });


  /* <---------- number ----------> */


  var ptp =  Number.prototype;


  /* ----------------------------------------
   * NOTE:
   *
   * Interation using this number as cap.
   * ---------------------------------------- */
  ptp._it = function(gap, scr) {
    if(gap == null) gap = 1;

    gap = Math.round(gap);
    if(gap < 1) return;
    let iCap = Math.round(this);
    if(iCap < 1) return;

    let i = 0;
    while(i < iCap) {
      scr(i);
      i += gap;
    };
  };


  /* ----------------------------------------
   * NOTE:
   *
   * Returns the next integer.
   * ---------------------------------------- */
  ptp.next = function() {
    return Math.round(this) + 1;
  };


  /* <---------- string ----------> */


  var ptp = String.prototype;


  /* ----------------------------------------
   * NOTE:
   *
   * Capacity for iteration.
   * ---------------------------------------- */
  ptp.iCap = function() {
    return this.length;
  };


  /* <---------- array ----------> */


  var cls = Array;


  /* ----------------------------------------
   * NOTE:
   *
   * Iterates through each pair in {arr1} and {arr2}.
   * ---------------------------------------- */
  cls.forEachPair = function(arr1, arr2, scr) {
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


  var ptp = Array.prototype;


  /* ----------------------------------------
   * NOTE:
   *
   * Capacity for iteration.
   * ---------------------------------------- */
  ptp.iCap = function() {
    return this.length;
  };


  /* ----------------------------------------
   * NOTE:
   *
   * Faster {forEach}, or not, I hope so.
   * Use this instead of {forEach} so you won't accidentally call it on something like a seq, which crash the game on Android.
   * ---------------------------------------- */
  ptp.forEachFast = function(scr) {
    let iCap = this.iCap();
    if(iCap === 0) return;
    for(let i = 0; i < iCap; i++) {
      scr(this[i]);
    };
  };


  /* ----------------------------------------
   * NOTE:
   *
   * {forEach} but the index is used instead of element.
   * ---------------------------------------- */
  ptp.forEachInd = function(gap, scr) {
    if(gap == null) gap = 1;

    gap = Math.round(gap);
    if(gap < 1) return;

    let i = 0, iCap = this.iCap();
    while(i < iCap) {
      scr(i);
      i += gap;
    };
  };


  /* ----------------------------------------
   * NOTE:
   *
   * {forEach} with a condition check.
   * ---------------------------------------- */
  ptp.forEachCond = function(boolF, scr) {
    if(boolF == null) boolF = Function.airTrue;

    let iCap = this.iCap();
    if(iCap === 0) return;
    for(let i = 0; i < iCap; i++) {
      if(boolF(this[i])) scr(this[i]);
    };
  };


  /* ----------------------------------------
   * NOTE:
   *
   * {forEach} that works for layered array.
   * This one provides index and array reference in {scr}, which are hard to access directly.
   * ---------------------------------------- */
  ptp.forEachAll = function(scr) {
    Array.prototype.forEachAll.callIt.apply(this, [scr]);
  };
  ptp.forEachAll.callIt = function(scr) {
    let i = 0, iCap = this.iCap();
    while(i < iCap) {
      this[i] instanceof Array ?
        Array.prototype.forEachAll.callIt.apply(this[i], [scr]) :
        scr(this[i], i, this);
      i++;
    };
  };


  /* ----------------------------------------
   * NOTE:
   *
   * Iterates through a formatted array.
   * ---------------------------------------- */
  ptp.forEachRow = function(ord, scr) {
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


  /* ----------------------------------------
   * NOTE:
   *
   * Empties the array.
   * ---------------------------------------- */
  ptp.clear = function() {
    this.length = 0;

    return this;
  };


  /* ----------------------------------------
   * NOTE:
   *
   * Sets array length and fills it with {val}.
   * If {val} here is an object (like array), use a getter function to avoid filling with the same object.
   * ---------------------------------------- */
  ptp.setVal = function(val0valGetter, len) {
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
