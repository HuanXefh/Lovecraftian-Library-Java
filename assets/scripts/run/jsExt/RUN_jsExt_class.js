/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * More methods for JavaScript constructor function to make it more like a class.
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


  /* <---------- function ----------> */


  var ptp = Function.prototype;


  ptp.__SUPER_CLASS__ = null;
  ptp.__IS_CLASS__ = false;
  ptp.__IS_ABSTRACT_CLASS__ = false;
  ptp.__IS_CONTENT_TEMPLATE__ = false;


  /* ----------------------------------------
   * NOTE:
   *
   * Gets the super class. If not a function class, returns {null}.
   * ---------------------------------------- */
  ptp.getSuper = function() {
    return this.__SUPER_CLASS__;
  };


  /* ----------------------------------------
   * NOTE:
   *
   * Sets up generic methods for function class and its instances.
   * This is required for a class to function properly.
   * ---------------------------------------- */
  ptp.initClass = function() {
    let cls = this;
    let ins = this.prototype;

    // Root class of all function class is {Function}
    if(cls.getSuper() == null) cls.__SUPER_CLASS__ = Function;

    cls.__IS_CLASS__ = true;
    ins.getClass = () => cls;

    ins.setProp = obj => {
      for(let key in obj) {
        ins[key] = obj[key];
      };
    };

    return this;
  };


  /* ----------------------------------------
   * NOTE:
   *
   * Sets up an abstract class to be extended.
   * Creating new instance of this class directly is not allowed.
   * Don't call super in child classes, that's dumb idea.
   *
   * There's nothing called abstract method here, just set it empty.
   * ---------------------------------------- */
  ptp.initAbstrClass = function() {
    this.initClass();

    this.__IS_ABSTRACT_CLASS__ = true;
    this.prototype.init = function() {
      ERROR_HANDLER.throw("abstractInstance");
    };

    return this;
  };


  /* ----------------------------------------
   * NOTE:
   *
   * Lets a function class extend another function class.
   * Should be called before {initClass}.
   * You can use {this.super(nmFun, ...args)} to call super methods later.
   * ---------------------------------------- */
  ptp.extendClass = function(cls) {
    if(typeof cls !== "function" || !cls.__IS_CLASS__) ERROR_HANDLER.throw("notClass", cls);

    Object.assign(this, cls);
    // Clone all native objects/arrays to prevent modification of the super one
    Object._it(this, (key, val) => {
      if(isNativeObject(val)) this[key] = Object.assign({}, val);
      if(val instanceof Array) this[key] = val.cpy();
    });

    this.__SUPER_CLASS__ = cls;
    // A second abstract class??? {initAbstrClass} again
    this.__IS_ABSTRACT_CLASS__ = false;

    this.super = function(nmFun) {
      let clsParent = this.getSuper();
      if(clsParent === Function) ERROR_HANDLER.throw("noSuperClass");
      if(clsParent.__IS_ABSTRACT_CLASS__) ERROR_HANDLER.throw("abstractSuper");
      let funParent = clsParent[nmFun];
      if(funParent == null) ERROR_HANDLER.throw("noSuperMethod", nmFun);

      return funParent.apply(this, Array.from(arguments).splice(1));
    };

    this.prototype = Object.create(cls.prototype);
    this.prototype.constructor = this;

    this.prototype.super = function(nmFun) {
      let clsParent = this.getClass().getSuper();
      if(clsParent === Function) ERROR_HANDLER.throw("noSuperClass");
      if(clsParent.__IS_ABSTRACT_CLASS__) ERROR_HANDLER.throw("abstractSuper");
      let funParent = clsParent.prototype[nmFun];
      if(funParent == null) ERROR_HANDLER.throw("noSuperMethod", nmFun);

      return funParent.apply(this, Array.from(arguments).splice(1));
    };

    return this;
  };
