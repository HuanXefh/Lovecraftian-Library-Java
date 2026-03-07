/* <---------- import ----------> */


/* <---------- meta ----------> */


/**
 * A container formed from an object that cannot be modified afterward.
 * Object boxes are named like "BOX_xxx".
 * @class
 * @param {Object} obj
 */
const CLS_objectBox = newClass().initClass();


CLS_objectBox.prototype.init = function(obj) {
  if(obj == null) obj = {};

  let args = [this, true];
  let count = 0;
  Object._it(obj, (key, val) => {
    args.push(key, val);
    count++;
  });
  Object.setProp.apply(null, args);
  this.size = count;
  this.keys = Object.keys(obj);

  Object.seal(this);
};


/* <---------- static method ----------> */


/* <---------- instance method ----------> */


/**
 * Gets size of the box.
 * @return {number}
 */
CLS_objectBox.prototype.getSize = function() {
  return this.size;
};


/**
 * Gets available keys of the box.
 * @return {Array<string>}
 */
CLS_objectBox.prototype.getKeys = function() {
  return this.keys;
};


module.exports = CLS_objectBox;
