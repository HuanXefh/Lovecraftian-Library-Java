/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- meta ----------> */


  /**
   * Used to store fixed values.
   * Very similiar to {@link CLS_objectBox}.
   * @class
   * @param {Object} obj
   */
  const CLS_enum = newClass().initClass();


  CLS_enum.prototype.init = function(obj) {
    if(obj == null) ERROR_HANDLER.throw("nullArgument", "obj");

    this.keys = [];
    this.vals = [];
    let count = 0;
    Object._it(obj, (key, val) => {
      if(typeof val !== "function") {
        this.setProp(true, key, val);
        this.keys.push(key);
        this.vals.pushUnique(val);
        count++;
      } else {
        this[key] = val;
      };
    });
    this.size = count;

    Object.freeze(this);
  };


/*
  ========================================
  Section: Definition (Static)
  ========================================
*/


/*
  ========================================
  Section: Definition (Instance)
  ========================================
*/


  /* <------------------------------ property ------------------------------ */


  /**
   * Gets size of the enum.
   * @return {number}
   */
  CLS_enum.prototype.getSize = function() {
    return this.size;
  };


  /**
   * Gets available keys of the enum.
   * @return {Array<string>}
   */
  CLS_enum.prototype.getKeys = function() {
    return this.keys;
  };


  /* <------------------------------ condition ------------------------------ */


  /**
   * Whether this enum contains some key.
   * @param {string} key
   * @return {boolean}
   */
  CLS_enum.prototype.hasKey = function(key) {
    return this.keys.includes(key);
  };


  /**
   * Whether this enum contains some value.
   * @param {any} val
   * @return {boolean}
   */
  CLS_enum.prototype.has = function(val) {
    return this.vals.includes(val);
  };




CLS_enum.setIterator({


  ind: -1,


  next() {
    this.ind++;
    return this.ind >= this.__PARENT__.vals.length ?
      {done: true} :
      {value: this.__PARENT__.vals[this.ind], done: false};
  },


});




module.exports = CLS_enum;
