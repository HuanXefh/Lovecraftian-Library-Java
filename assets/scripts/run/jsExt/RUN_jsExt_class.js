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


    /** @type {Function|null} */
    Function.prototype.__superClass__ = null;
    /** @type {boolean} */
    Function.prototype.__isClass__ = false;
    /** @type {boolean} */
    Function.prototype.__isAbstractClass__ = false;
    /** @type {boolean} */
    Function.prototype.__isContentTemplate__ = false;


    /**
     * Gets super class.
     * Returns null if this function is not a Lovec class, or child class of any class.
     * @return {Function|null}
     */
    Function.prototype.getSuper = function() {
        return this.__superClass__;
    };


    /**
     * Sets up the Lovec class.
     * This is required for a class to function properly.
     * <br> For abstract class, use {@link Function#initAbstrClass} instead.
     * @return {this}
     */
    Function.prototype.initClass = function() {
        let cls = this;
        let ins = this.prototype;

        if(cls.getSuper() == null) {
            cls.__superClass__ = null;
        };
        cls.__isClass__ = true;
        ins.getClass = function() {
            return cls;
        };

        return this;
    };


    /**
     * Alias of {@link Function#initClass} with proper type for templates.
     * @return {CLS_contentTemplate}
     */
    Function.prototype.initTemplate = function() {
        // noinspection JSValidateTypes
        return this.initClass();
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
        return this;
    };


    /**
     * Calls super method from the parent class.
     * Will throw error if no super method found.
     * <br> `ARGS`: nameFun, arg1, arg2, arg3, ...
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
        if(typeof cls !== "function" || !cls.__isClass__) throw new TypeError(cls + " is not a Lovec class");
        if(this.__isContentTemplate__ && !cls.__isContentTemplate__) throw new TypeError(cls + " is not a content template");

        Object.assign(this, cls);
        // Clone all native objects/arrays to prevent modification of the super one
        Object.eachPair(this, (key, val) => {
            if(isNativeObject(val)) this[key] = Object.assign({}, val);
            if(val instanceof Array) this[key] = val.deepCpy();
        });

        this.__superClass__ = cls;
        // A second abstract class??? `initAbstrClass` again
        this.__isAbstractClass__ = false;


        this.prototype = Object.create(cls.prototype);
        this.prototype.constructor = this;

        // Define class `super`
        this.super = function(nameFun) {
            let clsParent = this.getSuper();
            if(clsParent == null) throw new Error("Super class not found");
            let funParent = clsParent[nameFun];
            if(funParent == null) throw new Error("Super method not found: " + nameFun);

            return funParent === this[nameFun] ?
                clsParent.super.apply(clsParent, arguments) :
                funParent.apply(clsParent, Array.from(arguments).splice(1));
        };
        // Define prototype `super`
        this.prototype.super = function(nameFun) {
            let clsParent = this.getClass().getSuper();
            if(clsParent == null) throw new Error("Super class not found");
            let funParent = clsParent.prototype[nameFun];
            if(funParent == null) throw new Error("Prototype super method not found: " + nameFun);

            return funParent === this[nameFun] ?
                clsParent.prototype.super.apply(clsParent.prototype, arguments) :
                funParent.apply(this, Array.from(arguments).splice(1));
        };

        if(name != null && typeof name === "string") {
            this.clsName = name;
            if(this.__isContentTemplate__) {
                if(CLS_contentTemplate.get(name) != null) throw new Error("Template name ${1} has already been used???".format(name));
                CLS_contentTemplate.register(name, this);
            };
        } else {
            this.clsName = "";
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
     * Iterator must have "next" method that returns `{value: Object, done: boolean}`.
     * @param {ClassIteratorObject} iteratorObj
     * @return {void}
     */
    Function.prototype.setIterator = function(iteratorObj) {
        if(typeof iteratorObj.next !== "function") throw new Error('Iterator must have `next` method');
        this.prototype[Symbol.iterator] = function() {
            let obj = Object.assign({}, iteratorObj);
            obj.__parent__ = this;
            return obj;
        };
    };
