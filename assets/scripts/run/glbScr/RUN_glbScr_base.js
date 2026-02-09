/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * Fundamental global methods in Lovec.
   * ---------------------------------------- */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- type ----------> */


  /* ----------------------------------------
   * NOTE:
   *
   * Whether {obj} is a native object.
   * ---------------------------------------- */
  isNativeObject = function(obj) {
    return typeof obj === "object" && !(obj instanceof java.lang.Object);
  };


  /* <---------- modification ----------> */


  /* ----------------------------------------
   * NOTE:
   *
   * Sets a fixed property for {obj}.
   * ---------------------------------------- */
  setFinalProp = function(obj, nmProp, val) {
    Object.defineProperty(obj, nmProp, {value: val, writable: false, enumerable: true, configurable: false});
  };


  /* ----------------------------------------
   * NOTE:
   *
   * Sets a hidden property for {obj}.
   * ---------------------------------------- */
  setHiddenProp = function(obj, nmProp, val) {
    Object.defineProperty(obj, nmProp, {value: val, writable: true, enumerable: false, configurable: true});
  };


  /* ----------------------------------------
   * NOTE:
   *
   * @ARGS: obj1, obj2, obj3, ...
   * {Object.mergeObj}.
   * ---------------------------------------- */
  mergeObj = function() {
    return Object.mergeObj.apply(this, arguments);
  };


  /* ----------------------------------------
   * NOTE:
   *
   * @ARGS: obj1, obj2, obj3, ...
   * {Object.mergeObjMixin}.
   * ---------------------------------------- */
  mergeObjMixin = function() {
    return Object.mergeObjMixin.apply(this, arguments);
  };


  /* <---------- struct ----------> */


  /* ----------------------------------------
   * NOTE:
   *
   * Used for function overloading (definition of one function with different sets of arguments).
   * Mostly for class or instance methods, as {obj} is required.
   * If {tps} is used the method also checks types.
   * ---------------------------------------- */
  addMethod = function(obj, nmFun, tps, fun) {
    let lastFun = obj[nmFun];

    obj[nmFun] = function() {
      if(fun.length === arguments.length && (tps == null ? true : checkArgType(arguments, tps))) {
        return fun.apply(this, arguments);
      } else if(typeof lastFun === "function") {
        return lastFun.apply(this, arguments);
      };
    };
  };


  /* ----------------------------------------
   * NOTE:
   *
   * @ARGS: fun1, fun2, fun3, ...
   * @ARGS: tps1, fun1, tps2, fun2, tps3, fun3, ...
   * Used to define a function that behaves differently for varied argument length or types of arguments.
   * This is betrayal to the Lord of JavaScript, be careful.
   *
   * Example:
   * let fun = newMultiFunction(
   *   ["number"], num => print("number"),
   *   ["string"], str => print("string"),
   *   ["boolean"], bool => print("boolean"),
   *   [Array], arr => print("array"),
   *   ["number", "number"], (num1, num2) => print("number & number"),
   *   ["number", Array], (num, arr) => print("number & array"),
   * );
   *
   * fun(1.0)          // Prints "number"
   * fun("ohno")          // Prints "string"
   * fun(true)          // Prints "boolean"
   * fun([])          // Prints "array"
   * fun(0.0, 0.0)          // Prints "number & number"
   * fun(0.0, [])          // Prints "number & array"
   * ---------------------------------------- */
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


  /* ----------------------------------------
   * NOTE:
   *
   * For argument type check.
   * For JavaScript data types, use string instead (e.g. "number" for {Number}).
   * Definitely not TypeScript reference.
   * ---------------------------------------- */
  checkArgType = function(args, tps) {
    if(!(args instanceof Array)) args = Array.from(args);

    let i = 0, iCap = args.iCap();
    while(i < iCap) {
      if(tps[i] == null || args[i] == null) {
        // Do nothing
      } else if(typeof tps[i] !== "string") {
        if(!(args[i] instanceof tps[i])) return false;
      } else {
        if(typeof args[i] !== tps[i]) return false;
      };
      i++;
    };

    return true;
  };


  /* ----------------------------------------
   * NOTE:
   *
   * @ARGS: fun1, fun2, fun3, ...
   * Used to defined a generator (as object).
   * {this} in the argument methods is always the generator, you can use it to define an infinite loop.
   *
   * Example:
   * let gen = newGenerator(
   *   function() {
   *     return 0;
   *   },
   *   function() {
   *     return 1;
   *   },
   *   function() {
   *     this.__STEP__ = 0;
   *     return 2;
   *   },
   * );
   *
   * let arr = [];
   * for(let i = 0; i < 10; i++) {
   *   arr.push(gen.next());
   * };
   * print(arr);                // Prints 0, 1, 2, 0, 1, 2, 0, 1, 2
   * ---------------------------------------- */
  newGenerator = function() {
    let genObj = {


      __STEP__: 0,
      __FUNS__: Array.from(arguments).filter(arg => typeof arg === "function"),


      next() {
        let obj = {};
        if(genObj.__STEP__ < genObj.__FUNS__.length) {
          obj.value = genObj.__FUNS__[genObj.__STEP__].apply(genObj, arguments);
        };
        obj.done = genObj.__STEP__ >= (genObj.__FUNS__.length - 1);
        genObj.__STEP__++;

        return obj;
      },


      return(val) {
        genObj.__STEP__ = Math.max(genObj.__STEP__, genObj.__FUNS__.length - 1);

        return {value: val, done: true};
      },


    };

    return genObj;
  };


  /* ----------------------------------------
   * NOTE:
   *
   * Used for function class definition.
   * {initClass} is required to complete the class.
   * {init} on the prototype is required, or it throws an error when creating an instance.
   *
   * Example:
   * const CLS_myClass = newClass().extendClass(CLS_someClass).initClass();
   * CLS_myClass.prototype.init = function() {...};
   * ---------------------------------------- */
  newClass = function() {
    return function() {
      this.init != null ?
        this.init.apply(this, arguments) :
        ERROR_HANDLER.throw("noInitForClassPrototype");
    };
  };


  /* <---------- null check ----------> */


  /* ----------------------------------------
   * NOTE:
   *
   * If {val} is {null}, returns default value.
   * Don't use {return val | def}, you know, double equality.
   * ---------------------------------------- */
  tryVal = function(val, def) {
    return val == null ? def : val;
  };


  /* ----------------------------------------
   * NOTE:
   *
   * A variant of {tryVal} where default value is given by a {Prov}.
   * Used when {def} is very costy to get.
   * ---------------------------------------- */
  tryValProv = function(val, defProv) {
    if(!(defProv instanceof Prov)) ERROR_HANDLER.throw("notProv", defProv);

    return val == null ? defProv.get() : val;
  };


  /* ----------------------------------------
   * NOTE:
   *
   * @ARGS: fun, def, caller, arg1, arg2, arg3, ...
   * Tries to call a function, returns the default value if not found or not function.
   * Don't use {try} & {catch}, it's costy.
   * ---------------------------------------- */
  tryFun = function(fun, caller, def) {
    if(fun == null || typeof fun !== "function") return def;

    return arguments.length <= 3 ?
      fun.call(caller) :
      fun.apply(caller, Array.from(arguments).splice(3));
  };


  /* ----------------------------------------
   * NOTE:
   *
   * Used when there's a field and another method bearing the same name.
   * {b.warmup} and {b.warmup()}, in Java it's fine, in JavaScript it's crash.
   * ---------------------------------------- */
  tryProp = function(prop0fun, caller) {
    if(prop0fun == null || typeof prop0fun !== "function") return prop0fun;

    return prop0fun.call(caller);
  };


  /* ----------------------------------------
   * NOTE:
   *
   * Tries to get a JS property from {obj} (usually defined in Java adaptor).
   * ---------------------------------------- */
  tryJsProp = function(obj, nmProp, def) {
    return obj.delegee == null || obj.delegee[nmProp] === undefined ?
      def :
      obj.delegee[nmProp];
  };


  /* ----------------------------------------
   * NOTE:
   *
   * {tryVal} but used for parameter objects.
   * ---------------------------------------- */
  readParam = function(paramObj, nmProp, def) {
    return (paramObj == null || paramObj[nmProp] == null) ? def : paramObj[nmProp];
  };


  /* ----------------------------------------
   * NOTE:
   *
   * {readParam} but the value returned is immediately used if found.
   * ---------------------------------------- */
  readParamAndCall = function(paramObj, nmProp, scr, def) {
    let val = readParam(paramObj, nmProp);
    if(val !== undefined) {
      scr(val);
    } else if(def !== undefined) {
      scr(def);
    };
  };


  /* <---------- call ----------> */


  /* ----------------------------------------
   * NOTE:
   *
   * Used when setting up a lot of properties.
   * Don't use arrow function here!
   * ---------------------------------------- */
  batchCall = function(thisVal, fun) {
    return fun.apply(thisVal, Array.from(arguments).splice(2));
  };


  /* <---------- debug ----------> */


  /* ----------------------------------------
   * NOTE:
   *
   * Variant of {print} used for printing multiple arguments.
   *
   * These will print {1, 2, 1, 2}:
   * printAll(1, 2, 1, 2)
   * printAll([1, 2, 1, 2])
   * printAll(1, [2], [1, 2])
   * ---------------------------------------- */
  printAll = function() {
    print(Array.from(arguments).flatten());
  };


  /* ----------------------------------------
   * NOTE:
   *
   * Variant of {print} that prints all possible keys of the object.
   * ---------------------------------------- */
  printKeys = function(obj) {
    Object.printKeys(obj);
  };


  /* ----------------------------------------
   * NOTE:
   *
   * Variant of {print} that prints the entire object.
   * ---------------------------------------- */
  printObj = function(obj) {
    Object.printObj(obj);
  };


  /* ----------------------------------------
   * NOTE:
   *
   * Prints {obj} and returns it.
   * ---------------------------------------- */
  printReturn = function(obj) {
    print(obj);
    return obj;
  };
