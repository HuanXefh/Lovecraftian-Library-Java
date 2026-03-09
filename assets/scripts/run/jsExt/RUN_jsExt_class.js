/*
  ========================================
  Section: Introduction
  ========================================
*/


  /**
   * More methods for JavaScript constructor function to make it more like a class.
   */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  /* <---------- function ----------> */


  Function.prototype.__SUPER_CLASS__ = null;
  Function.prototype.__IS_CLASS__ = false;
  Function.prototype.__IS_ABSTRACT_CLASS__ = false;
  Function.prototype.__IS_CONTENT_TEMPLATE__ = false;


  /**
   * Gets super class.
   * If this function is not a class, returns null instead.
   * @return {Function|null}
   */
  Function.prototype.getSuper = function() {
    return this.__SUPER_CLASS__;
  };


  /**
   * Sets up the function class.
   * This is required for a class to function properly.
   * @return {this}
   */
  Function.prototype.initClass = function() {
    let cls = this;
    let ins = this.prototype;

    // Root class of all function class is `Function`
    if(cls.getSuper() == null) cls.__SUPER_CLASS__ = Function;

    cls.__IS_CLASS__ = true;
    ins.getClass = () => cls;

    return this;
  };


  /**
   * Variant of {@link Function#initClass} for abstract class.
   * Creating new instance of this class will not be allowed.
   * For abstract methods, see {@link Function#setAbstr}.
   * @return {this}
   */
  Function.prototype.initAbstrClass = function() {
    this.initClass();

    this.__IS_ABSTRACT_CLASS__ = true;
    this.prototype.init = function() {
      ERROR_HANDLER.throw("abstractInstance");
    };

    return this;
  };


  /**
   * Calls super method from the parent class.
   * Will throw error if no super method found.
   * <br> <ARGS>: nmFun, arg1, arg2, arg3, ...
   * @typedef {function(string, ...args): any} Function#super
   */


  /**
   * Lets a class extend another class.
   * Should be called before {@link Function#initClass}.
   * Super methods can be called with `this.super(nmFun, arg1, arg2, arg3, ...)` later.
   * @param {Function} cls
   * @param {string|unset} [nm] - Name of the new class.
   * @return {this}
   */
  Function.prototype.extendClass = function(cls, nm) {
    if(typeof cls !== "function" || !cls.__IS_CLASS__) ERROR_HANDLER.throw("notClass", cls);
    if(this.__IS_CONTENT_TEMPLATE__ && !cls.__IS_CONTENT_TEMPLATE__) ERROR_HANDLER.throw("notContentTemplate", cls);

    Object.assign(this, cls);
    // Clone all native objects/arrays to prevent modification of the super one
    Object._it(this, (key, val) => {
      if(isNativeObject(val)) this[key] = Object.assign({}, val);
      if(val instanceof Array) this[key] = val.cpy();
    });

    this.__SUPER_CLASS__ = cls;
    // A second abstract class??? `initAbstrClass` again
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

    if(nm != null && typeof nm === "string") {
      this.nm = nm;
      if(this.__IS_CONTENT_TEMPLATE__) {
        LCTemp[nm] = this;
        LCTempParentMap.put(nm, LCTempParentMap.get(cls.nm).cpy().pushAll(cls.nm));
      };
    };

    return this;
  };
