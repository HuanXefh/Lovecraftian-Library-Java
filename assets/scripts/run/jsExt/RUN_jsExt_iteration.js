/*
  ========================================
  Section: Introduction
  ========================================
*/


  /**
   * Methods for iteration on fundamental JavaScript types.
   */


/*
  ========================================
  Section: Definition (Object)
  ========================================
*/


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
   * Variant of {@link Object._it} for instance.
   * @func Object#_it
   * @param {function(string, any): void} scr
   * @param {boolean|unset} [forceIns]
   * @return {void}
   */
  setHiddenProp(Object.prototype, "_it", function(scr, forceIns) {
    Object._it(this, scr, forceIns);
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
