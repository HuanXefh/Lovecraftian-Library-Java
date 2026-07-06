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


  Function.prototype.__superClass__ = null;
  Function.prototype.__isClass__ = false;
  Function.prototype.__isAbstractClass__ = false;
  Function.prototype.__isContentTemplate__ = false;


  /**
   * Gets super class.
   * If this function is not a class, returns null instead.
   * @return {Function|null}
   */
  Function.prototype.getSuper = function() {
    return this.__superClass__;
  };


  /**
   * Sets up the Lovec class.
   * This is required for a class to function properly.
   * @return {this}
   */
  Function.prototype.initClass = function() {
    let cls = this;
    let ins = this.prototype;

    // Root class of all Lovec classes is `Function`
    if(cls.getSuper() == null) cls.__superClass__ = Function;

    cls.__isClass__ = true;
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

    this.__isAbstractClass__ = true;
    this.prototype.init = function() {
      ERROR_HANDLER.throw("abstractInstance");
    };

    return this;
  };


  /**
   * Calls super method from the parent class.
   * Will throw error if no super method found.
   * <br> <ARGS>: nameFun, arg1, arg2, arg3, ...
   * @typedef {function(string, ...args): any} Function#super
   */


  /**
   * Lets a class extend another class.
   * Should be called before {@link Function#initClass}.
   * Super methods can be called with `this.super(nameFun, arg1, arg2, arg3, ...)` later.
   * @param {Function} cls
   * @param {string|unset} [name] - Name of the new class.
   * @return {this}
   */
  Function.prototype.extendClass = function(cls, name) {
    if(typeof cls !== "function" || !cls.__isClass__) ERROR_HANDLER.throw("notClass", cls);
    if(this.__isContentTemplate__ && !cls.__isContentTemplate__) ERROR_HANDLER.throw("notContentTemplate", cls);

    Object.assign(this, cls);
    // Clone all native objects/arrays to prevent modification of the super one
    Object._it(this, (key, val) => {
      if(isNativeObject(val)) this[key] = Object.assign({}, val);
      if(val instanceof Array) this[key] = val.cpyAll();
    });

    this.__superClass__ = cls;
    // A second abstract class??? `initAbstrClass` again
    this.__isAbstractClass__ = false;

    this.super = function(nameFun) {
      let clsParent = this.getSuper();
      if(clsParent === Function) ERROR_HANDLER.throw("noSuperClass");
      if(clsParent.__isAbstractClass__) ERROR_HANDLER.throw("abstractSuper");
      let funParent = clsParent[nameFun];
      if(funParent == null) ERROR_HANDLER.throw("noSuperMethod", nameFun);

      return funParent === this[nameFun] ?
        clsParent.super.apply(clsParent, arguments) :
        funParent.apply(this, Array.from(arguments).splice(1));
    };

    this.prototype = Object.create(cls.prototype);
    this.prototype.constructor = this;

    this.prototype.super = function(nameFun) {
      let clsParent = this.getClass().getSuper();
      if(clsParent === Function) ERROR_HANDLER.throw("noSuperClass");
      if(clsParent.__isAbstractClass__) ERROR_HANDLER.throw("abstractSuper");
      let funParent = clsParent.prototype[nameFun];
      if(funParent == null) ERROR_HANDLER.throw("noSuperMethod", nameFun);

      return funParent === this[nameFun] ?
        clsParent.prototype.super.apply(clsParent.prototype, arguments) :
        funParent.apply(this, Array.from(arguments).splice(1));
    };

    if(name != null && typeof name === "string") {
      this.nm = name;
      if(this.__isContentTemplate__) {
        if(LCTemp[name] != null) throw new Error("Template name ${1} has already been used???".format(name));
        LCTemp[name] = this;
        LCTempParentMap.put(name, LCTempParentMap.get(cls.nm).cpy().pushAll(cls.nm));
      };
    } else {
      this.nm = "";
    };

    return this;
  };


  /**
   * Alias of {@link Function#extendClass}.
   * @param {Function} cls
   * @param {string|unset} [name]
   * @return {this}
   */
  Function.prototype.extend = function(cls, name) {
    return this.extendClass(cls, name);
  };


  /**
   * Defines iterator for a class, so that instances of this class can be used in for-of loop.
   * `__parent__` in the iterator refers to the instance.
   * Iterator must have "next" method that returns `{value: any, done: boolean}`.
   * @param {Object} iteratorObj
   * @return {void}
   */
  Function.prototype.setIterator = function(iteratorObj) {
    if(typeof iteratorObj.next !== "function") throw new Error('Iterator must have "next" method!');

    this.prototype[Symbol.iterator] = function() {
      let obj = Object.assign({}, iteratorObj);
      obj.__parent__ = this;
      return obj;
    };
  };
