/* ----------------------------------------
 * NOTE:
 *
 * A container formed from an object, not expected to be modified afterwards.
 * You cannot modify the box after it being created.
 *
 * Object boxes are named like {BOX_xxx}.
 * ---------------------------------------- */


/* <---------- import ----------> */


/* <---------- meta ----------> */


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


var ptp = CLS_objectBox.prototype;


/* meta */


/* ----------------------------------------
 * NOTE:
 *
 * Returns size of the box.
 * ---------------------------------------- */
ptp.getSize = function() {
  return this.size;
};


/* ----------------------------------------
 * NOTE:
 *
 * Returns possible keys of the container.
 * ---------------------------------------- */
ptp.getKeys = function() {
  return this.keys;
};


module.exports = CLS_objectBox;
