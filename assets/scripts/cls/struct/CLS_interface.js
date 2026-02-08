/* ----------------------------------------
 * NOTE:
 *
 * Interface formed from an object.
 * Used to add properties to a class.
 *
 * Interface instances are named like {INTF_xxx}.
 * More like a mixin though, I'm not gonna rename it.
 * ---------------------------------------- */


/* <---------- import ----------> */


/* <---------- meta ----------> */


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


var ptp = CLS_interface.prototype;


/* ----------------------------------------
 * NOTE:
 *
 * Makes a new interface by merging two interfaces.
 * ---------------------------------------- */
ptp.extendInterface = function(intf) {
  if(!(intf instanceof CLS_interface)) ERROR_HANDLER.throw("notInterface", intf);

  return new CLS_interface(mergeObjMixin(intf.interfaceObj, this.interfaceObj));
};


/* ----------------------------------------
 * NOTE:
 *
 * Whether some class has implemented this interface.
 * ---------------------------------------- */
ptp.isImplementedBy = function(cls) {
  return this.children.includes(cls);
};


module.exports = CLS_interface;
