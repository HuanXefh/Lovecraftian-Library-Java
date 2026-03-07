/* <---------- import ----------> */


/* <---------- meta ----------> */


/**
 * Used to add properties to a class by `cls.implement(intf)`.
 * Interfaces are usually named like "INTF_xxx".
 * @class
 * @param {Object} obj
 */
const CLS_interface = newClass().initClass();


CLS_interface.prototype.init = function(obj) {
  Object._it(obj, (key, val) => {
    if(typeof val !== "function") ERROR_HANDLER.throw("nonFunctionInInterface", key);
  });

  this.interfaceObj = obj;
  this.children = [];
};


/* <---------- static method ----------> */


/* <---------- instance method ----------> */


/**
 * Makes a new interface by merging two interfaces.
 * @param {CLS_interface} intf
 * @return {CLS_interface}
 */
CLS_interface.prototype.extendInterface = function(intf) {
  if(!(intf instanceof CLS_interface)) ERROR_HANDLER.throw("notInterface", intf);

  return new CLS_interface(mergeObjMixin(intf.interfaceObj, this.interfaceObj));
};


/**
 * Whether some class has implemented this interface.
 * @param {Function} cls
 * @return {boolean}
 */
CLS_interface.prototype.isImplementedBy = function(cls) {
  return this.children.includes(cls);
};


module.exports = CLS_interface;
