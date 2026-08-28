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
   * <br> `ARGS`: obj, propObj
   * <br> `ARGS`: obj, isFinal, nameProp1, val1, nameProp2, val2, nameProp3, val3, ...
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
    Object.eachPair(objOld, (key, prop) => {
      objNew[key] = prop;
    });

    return objNew;
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
  * <br> `ARGS`: obj, propObj
  * <br> `ARGS`: obj, isFinal, nameProp1, val1, nameProp2, val2, nameProp3, val3, ...
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
