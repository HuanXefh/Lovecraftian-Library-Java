/* ----------------------------------------
 * NOTE:
 *
 * Something like Java enum.
 * The final enum is a sealed object, which is returned by calling {ins.build}.
 * ---------------------------------------- */


/* <---------- import ----------> */


/* <---------- meta ----------> */


const CLS_enumBuilder = newClass().initClass();


CLS_enumBuilder.prototype.init = function(constructF) {
  this.constructF = tryVal(constructF, Function.air);

  this.builderObj = {
    __KEYS__: [],
  };
};


/* <---------- static method ----------> */


/* <---------- instance method ----------> */


var ptp = CLS_enumBuilder.prototype;


/* ----------------------------------------
 * NOTE:
 *
 * @ARGS: nm, arg1, arg2, arg3, ...
 * Adds an enum to the queue.
 * ---------------------------------------- */
ptp.add = function(nm) {
  let obj = {};
  this.constructF.apply(obj, Array.from(arguments).splice(1));
  Object.seal(obj);
  this.builderObj[nm] = obj;
  this.builderObj.__KEYS__.push(nm);

  return this;
};


/* ----------------------------------------
 * NOTE:
 *
 * Builds the enum object and returns it.
 * ---------------------------------------- */
ptp.build = function() {
  const thisIns = this;

  let enumObj = {};
  this.builderObj.__KEYS__.forEachFast(nm => {
    setFinalProp(enumObj, nm, thisIns.builderObj[nm]);
  });
  enumObj.values = function() {
    return thisIns.builderObj.__KEYS__.map(nm => enumObj[nm]);
  };
  Object.seal(enumObj);

  return enumObj;
};


module.exports = CLS_enumBuilder;
