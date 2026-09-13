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
     * @param {C2Function<string, Object>} scr - `ARGS`: key, val.
     * @param {boolean|unset} [forceIns] - If true, methods in `obj` will be ignored.
     * @return {void}
     * @lovecTypeSensitive
     */
    Object.eachPair = function(obj, scr, forceIns) {
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
     * Variant of {@link Object.eachPair} for instance.
     * @func Object#_it
     * @param {C2Function<string, Object>} scr
     * @param {boolean|unset} [forceIns]
     * @return {void}
     */
    setHiddenProp(Object.prototype, "eachPair", function(scr, forceIns) {
        Object.eachPair(this, scr, forceIns);
    });


/*
  ========================================
  Section: Definition (Number)
  ========================================
*/


    /**
     * Iteration using this number as cap.
     * @param {CFunction<number>} scr
     * @param {number|unset} [gap]
     * @param {number|unset} [base]
     * @return {void}
     */
    Number.prototype.each = function(scr, gap, base) {
        LCNumber.each(Number(this), scr, tryVal(gap, 1), tryVal(base, 0));
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
     * @param {C2Function<Object, Object>} scr
     * @param {boolean|unset} [noWrap]
     * @return {void}
     */
    Array.forEachPair = function(arr1, arr2, scr, noWrap) {
        LCNativeArray.forEachPair(arr1, arr2, scr, tryVal(noWrap, false));
    };


    /**
     * Not really faster.
     * Use this instead of {@link Array#forEach} so you won't accidentally call it on something like {@link Seq}, which can crash the game on Android.
     * @param {CFunction<Object>} scr
     * @param {boolean|unset} [noWrap]
     * @return {void}
     */
    Array.prototype.forEachFast = function(scr, noWrap) {
        LCNativeArray.forEachFast(this, scr, tryVal(noWrap, false));
    };


    /**
     * Variant of {@link Array#forEach} with a condition check.
     * @param {FFunction<Object, boolean>} boolF
     * @param {CFunction<Object>} scr
     * @param {boolean|unset} [noWrap]
     * @return {void}
     */
    Array.prototype.forEachCond = function(boolF, scr, noWrap) {
        LCNativeArray.forEachCond(this, boolF, scr, tryVal(noWrap, false));
    };


    /**
     * Variant of {@link Array#forEach} used for formatted array.
     * @param {number} ord
     * @param {(...args: Array<Object>) => void} scr - Arguments here will be elements in each row.
     * @param {boolean|unset} [noWrap]
     * @return {void}
     */
    Array.prototype.forEachRow = function(ord, scr, noWrap) {
        LCNativeArray.forEachRow(this, ord, arr => scr.apply(null, arr), tryVal(noWrap, false));
    };


    /**
     * Variant of {@link Array#forEach} used for layered array.
     * This one provides index and array reference which are hard to access directly.
     * @param {C3Function<Object, number, Array>} scr
     * @param {boolean|unset} [noWrap]
     * @return {void}
     */
    Array.prototype.forEachAll = function(scr, noWrap) {
        LCNativeArray.forEachAll(this, scr, tryVal(noWrap, false));
    };
