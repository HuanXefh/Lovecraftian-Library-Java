/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- meta ----------> */


  /**
   * A container formed from an object that is not expected to be modified afterward.
   * Object boxes are usually named like "BOX_xxx".
   * @class
   * @param {Object} obj
   */
  const CLS_objectBox = newClass().initClass();


  CLS_objectBox.prototype.init = function(obj) {
    if(obj == null) obj = {};

    let args = [this, true];
    Object._it(obj, (key, val) => {
      args.push(key, val);
    });
    Object.setProp.apply(null, args);
    this.keys = Object.keys(obj);

    Object.seal(this);
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
   * Gets available keys of the box.
   * @return {Array<string>}
   */
  CLS_objectBox.prototype.getKeys = function() {
    return this.keys;
  };




module.exports = CLS_objectBox;
