/*
  ========================================
  Section: Introduction
  ========================================
*/


  /**
   * Fundamental global methods in Lovec.
   */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- type ----------> */


  /**
   * Whether this object is a native JS object.
   * @global
   * @param {Object} obj
   * @return {boolean}
   */
  isNativeObject = function(obj) {
    return typeof obj === "object" && !(obj instanceof java.lang.Object);
  };


  /**
   * Whether some object is instance of any of given classes.
   * <br> <ARGS>: obj, cls1, cls2, cls3, ...
   * @return {boolean}
   */
  instanceOfAny = function() {
    if(arguments.length < 2) return false;
    for(let i = 1; i < arguments.length; i++) {
      if(arguments[0] instanceof arguments[i]) return true;
    };
    return false;
  };


  /* <---------- modification ----------> */


  /**
   * Sets a fixed property for some object.
   * @global
   * @param {Object} obj
   * @param {string} nmProp
   * @param {any} val
   * @return {void}
   */
  setFinalProp = function(obj, nmProp, val) {
    Object.defineProperty(obj, nmProp, {value: val, writable: false, enumerable: true, configurable: false});
  };


  /**
   * Sets a hidden property for some object.
   * @global
   * @param {Object} obj
   * @param {string} nmProp
   * @param {any} val
   * @return {void}
   */
  setHiddenProp = function(obj, nmProp, val) {
    Object.defineProperty(obj, nmProp, {value: val, writable: true, enumerable: false, configurable: true});
  };


  /**
   * See {@link Object.mergeObj}.
   * <br> <ARGS>: obj1, obj2, obj3, ...
   * @global
   * @return {Object}
   */
  mergeObj = function() {
    return Object.mergeObj.apply(this, arguments);
  };


  /**
   * See {@link Object.mergeObjMixin}.
   * <br> <ARGS>: obj1, obj2, obj3, ...
   * @global
   * @return {Object}
   */
  mergeObjMixin = function() {
    return Object.mergeObjMixin.apply(this, arguments);
  };


  /* <---------- struct ----------> */


  /**
   * Adds a method to some object.
   * If the name has been used before, function overloading happens.
   * @global
   * @param {any} obj
   * @param {string} nmFun
   * @param {Array<ArgumentType>|unset} types - If set, the method added also checks argument types.
   * @param {Function} fun
   * @return {void}
   */
  addMethod = function(obj, nmFun, types, fun) {
    let lastFun = obj[nmFun];

    obj[nmFun] = function() {
      if(fun.length === arguments.length && (types == null ? true : checkArgType(arguments, types))) {
        return fun.apply(this, arguments);
      } else if(typeof lastFun === "function") {
        return lastFun.apply(this, arguments);
      };
    };
  };


  /**
   * Defines an overloaded function, see {@link addMethod}.
   * <br> <ARGS>: fun1, fun2, fun3, ...
   * <br> <ARGS>: types1, fun1, types2, fun2, types3, fun3, ...
   * @global
   * @return {Function}
   * @example
   * let fun = newMultiFunction(
   *   ["number"], num => print("number"),
   *   ["string"], str => print("string"),
   *   ["boolean"], bool => print("boolean"),
   *   [Array], arr => print("array"),
   *   ["number", "number"], (num1, num2) => print("number, number"),
   * );
   * fun(2);                // Prints "number"
   * fun("ohno");                // Prints "string"
   * fun(true);                // Prints "boolean"
   * fun([0]);                // Prints "array"
   * fun(1, 2);                // Prints "number, number"
   */
  newMultiFunction = function() {
    let fun = function() {
      return fun.__OVERLOADING_CONTAINER__[""].apply(this, arguments);
    };
    fun.__OVERLOADING_CONTAINER__ = {};

    let i = 0, iCap = arguments.length;
    if(arguments[0] instanceof Array && typeof arguments[1] === "function") {
      while(i < iCap) {
        addMethod(fun.__OVERLOADING_CONTAINER__, "", arguments[i], arguments[i + 1]);
        i += 2;
      };
    } else {
      while(i < iCap) {
        addMethod(fun.__OVERLOADING_CONTAINER__, "", null, arguments[i]);
        i++;
      };
    };

    return fun;
  };


  /**
   * Whether given arguments match given types.
   * @global
   * @param {Arguments} args
   * @param {Array<ArgumentType>} types
   * @return {boolean}
   */
  checkArgType = function(args, types) {
    if(!(args instanceof Array)) args = Array.from(args);

    let i = 0, iCap = args.iCap();
    while(i < iCap) {
      if(types[i] == null || args[i] == null) {
        // Do nothing
      } else if(typeof types[i] !== "string") {
        if(!(args[i] instanceof types[i])) return false;
      } else {
        if(typeof args[i] !== types[i]) return false;
      };
      i++;
    };

    return true;
  };


  /**
   * Creates a new Lovec function class.
   * `cls.prototype.init` is required to create instance.
   * @global
   * @return {function(): void}
   * @example
   * // How to make a class
   * let CLS1 = newClass().initClass();
   *
   * // How to extend some class
   * let CLS2 = newClass().extendClass(CLS1).initClass();
   *
   * // How to implement some interface
   * let INTF = new CLS_interface(null, {});
   * let CLS3 = newClass().extendClass(CLS1).implement(INTF).initClass();
   */
  newClass = function() {
    return function() {
      this.init != null ?
        this.init.apply(this, arguments) :
        ERROR_HANDLER.throw("noInitForClassPrototype");
    };
  };


  /* <---------- null check ----------> */


  /**
   * If `val` is null, this method will return `def` instead.
   * <br> <IMPORTANT>: Do not use `return val | def` which uses double equality.
   * @global
   * @param {any} val
   * @param {any} [def]
   * @return {any}
   */
  tryVal = function(val, def) {
    return val == null ? def : val;
  };


  /**
   * Variant of {@link tryVal} where default value is obtained from a {@link Prov}.
   * Used when `def` is very costy to get.
   * @global
   * @param {any} val
   * @param {Prov} defProv
   * @return {any}
   */
  tryValProv = function(val, defProv) {
    if(!(defProv instanceof Prov)) ERROR_HANDLER.throw("notProv", defProv);

    return val == null ? defProv.get() : val;
  };


  /**
   * Tries to call a function, returns `def` if not found or not function.
   * Used to replace `try{} catch(err) {}` which is costy.
   * <br> <ARGS> fun, def, caller, arg1, arg2, arg3, ...
   * @global
   * @param {any} fun
   * @param {any} caller
   * @param {any} [def]
   * @return {any}
   */
  tryFun = function(fun, caller, def) {
    if(fun == null || typeof fun !== "function") return def;

    return arguments.length <= 3 ?
      fun.call(caller) :
      fun.apply(caller, Array.from(arguments).splice(3));
  };


  /**
   * Used when a property and a method have the same name.
   * @global
   * @param {any} prop0fun
   * @param {any} caller
   * @return {any}
   * @example
   * // This will lead to crash, since a variable can only be either a property or a method in JS
   * // Unfortunately, in Mindustry warmup of a building is not always property/method
   * print(b.warmup);
   * print(b.warmup());
   *
   * // However, it's avoidable by using `tryProp`
   * print(tryProp(b.warmup, b));
   */
  tryProp = function(prop0fun, caller) {
    if(prop0fun == null || typeof prop0fun !== "function") return prop0fun;

    return prop0fun.call(caller);
  };


  /**
   * Tries to get a JS property from some object created with {@link JavaAdapter}.
   * @global
   * @param {any} obj
   * @param {string} nmProp
   * @param {any} [def]
   * @return {any}
   */
  tryJsProp = function(obj, nmProp, def) {
    return obj.delegee == null || obj.delegee[nmProp] === undefined ?
      def :
      obj.delegee[nmProp];
  };


  /**
   * Variant of {@link tryVal} used to read parameter objects.
   * @global
   * @param {Object|unset} paramObj
   * @param {string} nmProp
   * @param {any} [def]
   * @return {any}
   */
  readParam = function(paramObj, nmProp, def) {
    return (paramObj == null || paramObj[nmProp] == null) ? def : paramObj[nmProp];
  };


  /**
   * Variant of {@link readParam} but the result is immediately used if found.
   * @global
   * @param {Object|unset} paramObj
   * @param {string} nmProp
   * @param {function(any): void} scr
   * @param {any} [def]
   * @return {void}
   */
  readParamAndCall = function(paramObj, nmProp, scr, def) {
    let val = readParam(paramObj, nmProp);
    if(val !== undefined) {
      scr(val);
    } else if(def !== undefined) {
      scr(def);
    };
  };


  /* <---------- call ----------> */


  /**
   * Used to set up a lot of properties.
   * <br> <IMPORTANT>: Do not use arrow function here!
   * <br> <ARGS>: thisVal, fun, arg1, arg2, arg3, ...
   * @global
   * @param {any} thisVal
   * @param {Function} fun
   * @return {any}
   */
  batchCall = function(thisVal, fun) {
    return fun.apply(thisVal, Array.from(arguments).splice(2));
  };


  /* <---------- debug ----------> */


  /**
   * Variant of {@link print} to print multiple arguments.
   * Arrays will be flattened.
   * @global
   * @return {void}
   */
  printAll = function() {
    print(Array.from(arguments).flatten());
  };


  /**
   * See {@link Object.printKeys}.
   * @global
   * @param {any} obj
   * @return {void}
   */
  printKeys = function(obj) {
    Object.printKeys(obj);
  };


  /**
   * See {@link Object.printObj}.
   * @global
   * @return {void}
   */
  printObj = function(obj) {
    Object.printObj(obj);
  };


  /**
   * Prints something and returns it.
   * Used for debugging.
   * @global
   * @param {any} obj
   * @return {any}
   */
  printReturn = function(obj) {
    print(obj);
    return obj;
  };
