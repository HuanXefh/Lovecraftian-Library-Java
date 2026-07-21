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
   * @param {function(string, any): void} scr - `ARGS`: key, val.
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
    LCNativeArray.forEachPair(arr1, arr2, scr);
  };


  /**
   * Not really faster.
   * Use this instead of {@link Array#forEach} so you won't accidentally call it on something like {@link Seq}, which can crash the game on Android.
   * @param {function(any): void} scr
   * @return {void}
   */
  Array.prototype.forEachFast = function(scr) {
    LCNativeArray.forEachFast(this, scr);
  };


  /**
   * Variant of {@link Array#forEach} with a condition check.
   * @param {function(any): boolean} boolF
   * @param {function(any): void} scr
   * @return {void}
   */
  Array.prototype.forEachCond = function(boolF, scr) {
    LCNativeArray.forEachCond(this, boolF, scr);
  };


  /**
   * Variant of {@link Array#forEach} used for formatted array.
   * @param {number} ord
   * @param {function(...any): void} scr - Arguments here will be elements in each row.
   * @return {void}
   */
  Array.prototype.forEachRow = function(ord, scr) {
    LCNativeArray.forEachRow(this, ord, arr => scr.apply(null, arr));
  };


  /**
   * Variant of {@link Array#forEach} used for layered array.
   * This one provides index and array reference which are hard to access directly.
   * @param {function(any, number, Array): void} scr
   * @return {void}
   */
  Array.prototype.forEachAll = function(scr) {
    LCNativeArray.forEachAll(this, scr);
  };
