/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- meta ----------> */


  /**
   * Used to add properties to a class by `cls.implement(intf)`.
   * Not really interface but more like mixin, methods from the interface are not required to be explicitly implemented.
   * `__PROTO__` in the object (as a getter function) is used to set up prototype of a class.
   * Interfaces are usually named like "INTF_xxx".
   * <br> <IMPORTANT>: It's recommended to create anonymous interfaces by `new Interface(null, {})` instead of `new Interface({})`.
   * @class
   * @param {string|unset} nm
   * @param {Object} obj
   * @example
   * let INTF_test = new CLS_interface(null, {
   *   print: function() {print("ohno")},
   *   printAbstr: function() {}.setAbstr(),
   *   __PROTO__: () => ({
   *     print: function() {print("ohyes")},
   *   }),
   * });
   * let CLS_test = newClass().implement(INTF_test).initClass();
   *
   * CLS_test.print();                // Prints "ohno", which is from the interface
   * new CLS_test().print();                // Prints "ohyes", which is from `__PROTO__` of the interface
   * CLS_test.printAbstr();                // Throws an error since the method becomes abstract method by calling `setAbstr`.
   */
  const CLS_interface = newClass().initClass();


  CLS_interface.prototype.init = function(nm, obj) {
    // For anonymous interface using legacy constructor
    if(typeof nm === "object" && obj === undefined) {
      obj = nm;
      nm = null;
    };

    Object._it(obj, (key, val) => {
      if(typeof val !== "function") ERROR_HANDLER.throw("nonFunctionInInterface", key);
    });

    this.nm = nm == null ? "" : registerUniqueName(nm, insNms, "interface");
    this.interfaceObj = obj;
    this.parentIntfs = [];
    this.children = [];
  };


  const insNms = [];


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


  /* <------------------------------ util ------------------------------ */


  /**
   * Makes a new interface by merging two interfaces.
   * @param {CLS_interface} intf
   * @param {string|unset} [nm]
   * @return {CLS_interface}
   */
  CLS_interface.prototype.extendInterface = function(intf, nm) {
    if(!(intf instanceof CLS_interface)) ERROR_HANDLER.throw("notInterface", intf);

    let ointf = new CLS_interface(nm, mergeObjMixin(intf.interfaceObj, this.interfaceObj));
    ointf.parentIntfs = intf.parentIntfs.cpy().pushAll(this.parentIntfs).pushAll(this).unique();

    return ointf;
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
