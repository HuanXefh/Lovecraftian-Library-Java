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
    Object._it(objOld, (key, prop) => {
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
   * Sets length and fills this array with some value.
   * @param {any} val_fn - Use a function here if the value to fill is an object like array.
   * @param {number|unset} [len]
   * @return {this}
   */
  Array.prototype.setVal = function(val_fn, len) {
    if(len == null) len = this.length;

    this.clear();
    let i = 0;
    if(typeof val_fn !== "function") {
      while(i < len) {
        this[i] = val_fn;
        i++;
      };
    } else {
      while(i < len) {
        this[i] = val_fn();
        i++;
      };
    };

    return this;
  };
