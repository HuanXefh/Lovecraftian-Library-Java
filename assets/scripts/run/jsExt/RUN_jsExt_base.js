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
     * Sets a lot of properties for `obj`.
     * @template T
     * @template K
     * @param {T} obj
     * @param {K} propObj
     * @return {T&K}
     */
    Object.setProp = function(obj, propObj) {
        if(propObj == null) return obj;
        for(let key in propObj) {
            obj[key] = propObj[key];
        };
        return obj;
    };


    /**
     * Sets a lot of properties for an object.
     * <br> `ARGS`: obj, isFinal, nameProp1, val1, nameProp2, val2, nameProp3, val3, ...
     * @template T
     * @param {T} obj
     * @param {boolean} isFinal
     * @return {T}
     */
    Object.setProps = function(obj, isFinal) {
        let i = 2, iCap = arguments.length;
        while(i < iCap) {
            Object.defineProperty(obj, arguments[i], {value: arguments[i + 1], writable: !isFinal});
            i += 2;
        };
        return obj;
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
    * Variant of {@link Object.setProp} for instance.
    * @func Object#setProp
    * @template T
    * @param {T} propObj
    * @return {this&T}
    */
    setHiddenProp(Object.prototype, "setProp", function(propObj) {
        return Object.setProp(this, propObj);
    });


    /**
     * Variant of {@link Object.setProps} for instance.
     * <br> `ARGS`: isFinal, nameProp1, val1, nameProp2, val2, nameProp3, val3, ...
     * @func Object#setProps
     * @param {boolean} isFinal
     * @return {this}
     */
    setHiddenProp(Object.prototype, "setProps", function(isFinal) {
        let args = Array.from(arguments);
        args.unshift(this);
        return Object.setProps.apply(this, args);
    });


/*
  ========================================
  Section: Definition (Number)
  ========================================
*/


    /**
     * Gets last integer.
     * @return {number}
     */
    Number.prototype.last = function() {
        return Math.round(this) - 1;
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
     * Gets cap for iteration.
     * @return {number}
     */
    Array.prototype.iCap = function() {
        return this.length;
    };


    /**
     * Empties this array.
     * @return {this}
     */
    Array.prototype.clear = function() {
        return LCNativeArray.clear(this);
    };


    /**
     * 1. Gets a copy of this array.
     * <br> 2. Copies elements from another array.
     * @param {Array|unset} [arr]
     * @return {Array}
     */
    Array.prototype.cpy = function(arr) {
        return arr == null ?
            LCNativeArray.cpy(this) :
            LCNativeArray.cpy(this, arr);
    };


    /**
     * Variant of {@link Array#cpy} for nested array.
     * @return {Array}
     */
    Array.prototype.deepCpy = function() {
        return LCNativeArray.deepCpy(this);
    };
