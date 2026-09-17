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


    /* <------------------------------ condition ------------------------------ */


    /**
     * Whether this object is a native JS object.
     * @global
     * @param {Object} obj
     * @return {boolean}
     * @lovecTypeSensitive
     */
    isNativeObject = function(obj) {
        return typeof obj === "object" && !(obj instanceof java.lang.Object);
    };


    /**
     * Whether this function is a native JS function.
     * @global
     * @param {Function} fun
     * @return {boolean}
     * @lovecTypeSensitive
     */
    isNativeFunction = function(fun) {
        return typeof fun === "function" && fun.toString().charCodeAt(0) === 10;
    };


    /**
     * Whether some object is instance of anyone among given classes.
     * Note that this method uses more generic `checkInstance`.
     * <br> `ARGS`: obj, cls1, cls2, cls3, ...
     * @return {boolean}
     */
    instanceOfAny = function() {
        if(arguments.length < 2) return false;
        for(let i = 1; i < arguments.length; i++) {
            if(checkInstance(arguments[0], arguments[i])) return true;
        };
        return false;
    };


    /* <------------------------------ modification ------------------------------ */


    /**
     * Sets a fixed property for some object.
     * @global
     * @param {Object} obj
     * @param {string} nameProp
     * @param {Object} val
     * @return {void}
     */
    setFinalProp = function(obj, nameProp, val) {
        Object.defineProperty(obj, nameProp, {value: val, writable: false, enumerable: true, configurable: false});
    };


    /**
     * Sets a hidden property for some object.
     * @global
     * @param {Object} obj
     * @param {string} nameProp
     * @param {Object} val
     * @return {void}
     */
    setHiddenProp = function(obj, nameProp, val) {
        Object.defineProperty(obj, nameProp, {value: val, writable: true, enumerable: false, configurable: true});
    };


    /**
     * Creates a global reference to some object.
     * @global
     * @template T
     * @param {T} obj
     * @param {string} name
     * @param {string|unset} [nameWrapper]
     * @return {T}
     */
    globalize = function(obj, name, nameWrapper) {
        let name_fi = (nameWrapper == null ? "" : (nameWrapper + ".")) + name;
        registerUniqueName(name_fi, globalize.names, "globalize");
        globalEval(
            'let cond = false; try {cond = ' + name_fi + ' !== undefined} catch(err) {cond = false}; if(cond) throw new Error("Cannot globalize an object due to reference conflict! Exception: ' + name + '")',
            "globalizeCheck_" + globalize.ind,
        );
        globalize.tmp = obj;
        if(nameWrapper != null && !globalize.nameWrapperMap.containsKey(nameWrapper)) {
            try {
                let wrapper = eval(nameWrapper);
                globalize.nameWrapperMap.put(nameWrapper, wrapper);
            } catch(err) {
                globalEval(
                    nameWrapper + " = {}",
                    "globalizeWrap_" + globalize.indWrapper,
                );
                globalize.nameWrapperMap.put(nameWrapper, eval(nameWrapper));
                globalize.indWrapper++;
            };
        };
        globalEval(
            name_fi + " = globalize.tmp",
            "globalize_" + globalize.ind,
        );
        globalize.ind++;
        return obj;
    };
    /** @type {Array<string>} */
    globalize.names = [];
    /** @type {ObjectMap<string, Object>} */
    globalize.nameWrapperMap = new ObjectMap();
    globalize.ind = 0;
    globalize.indWrapper = 0;
    /** @type {Object|null} */
    globalize.tmp = null;


    /* <------------------------------ struct ------------------------------ */


    /**
     * Defines an overloaded function.
     * <br> `ARGS`: fun1, fun2, fun3, ...
     * <br> `ARGS`: types1, fun1, types2, fun2, types3, fun3, ...
     * @global
     * @return {Function}
     * @example
     * let fun = newMultiFunction(
     *     ["number"], num => print("number"),
     *     ["string"], str => print("string"),
     *     ["boolean"], bool => print("boolean"),
     *     [Array], arr => print("array"),
     *     ["number", "number"], (num1, num2) => print("number, number"),
     * );
     * fun(2);                // Prints "number"
     * fun("ohno");                // Prints "string"
     * fun(true);                // Prints "boolean"
     * fun([0]);                // Prints "array"
     * fun(1, 2);                // Prints "number, number"
     */
    newMultiFunction = function() {
        let fun = function() {
            return fun.__overloadContainer__[""].apply(this, arguments);
        };
        fun.__overloadContainer__ = {};

        let i = 0, iCap = arguments.length;
        if(arguments[0] instanceof Array && typeof arguments[1] === "function") {
            while(i < iCap) {
                newMultiFunction.addMethod(fun.__overloadContainer__, "", arguments[i], arguments[i + 1]);
                i += 2;
            };
        } else {
            while(i < iCap) {
                newMultiFunction.addMethod(fun.__overloadContainer__, "", null, arguments[i]);
                i++;
            };
        };

        return fun;
    };
    /**
     * Adds a method to some object.
     * If the name has been used before, function overloading happens.
     * @param {Object} obj
     * @param {string} nameFun
     * @param {Array<ArgumentType>|unset} types - If set, the method added also checks argument types.
     * @param {Function} fun
     * @return {void}
     */
    newMultiFunction.addMethod = function(obj, nameFun, types, fun) {
        let lastFun = obj[nameFun];
        obj[nameFun] = function() {
            if(fun.length === arguments.length && (types == null ? true : newMultiFunction.checkArgType(arguments, types))) {
                return fun.apply(this, arguments);
            } else if(typeof lastFun === "function") {
                return lastFun.apply(this, arguments);
            };
        };
    };
    /**
     * Whether given arguments match given types.
     * @param {Arguments} args
     * @param {Array<ArgumentType>} types
     * @return {boolean}
     */
    newMultiFunction.checkArgType = function(args, types) {
        let i = 0, iCap = args.length;
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
     * Creates a new Lovec class.
     * `cls.prototype.init` is required to create instance.
     * @global
     * @return {Function}
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
            if(this.init == null) throw new Error("Do not create instances for classes without `class.prototype.init`");
            if(this.getClass().__isAbstractClass__) throw new Error("Cannot create instance for abstract class!");
            this.init.apply(this, arguments);
        };
    };


    /**
     * Creates a new Lovec enum.
     * @global
     * @template T
     * @param {T} obj
     * @param {string|unset} [globalName] - If set, this enum will be exposed to global scope.
     * @param {string|unset} [nameWrapper]
     * @return {CLS_enum&T}
     */
    newEnum = function(obj, globalName, nameWrapper) {
        let enumIns = new CLS_enum(obj);
        if(globalName != null) {
            globalize(enumIns, globalName, nameWrapper);
        };
        return enumIns;
    };


    /* <------------------------------ null check ------------------------------ */


    /**
     * If `val` is null, this method will return `def` instead.
     * <br> `IMPORTANT`: Do not abuse `return val || def`, which uses double equality and may yield bugs.
     * @global
     * @template T
     * @param {T} val
     * @param {T|unset} [def]
     * @return {T|unset}
     */
    tryVal = function(val, def) {
        return val == null ? def : val;
    };


    /**
     * Variant of {@link tryVal} where default value is obtained from a {@link Prov}.
     * Used when `def` is very costy to get.
     * @global
     * @template T
     * @param {T} val
     * @param {Prov<T>} defProv
     * @return {T}
     */
    tryValProv = function(val, defProv) {
        return val == null ? defProv.get() : val;
    };


    /**
     * Tries calling a function, returns `def` if not found or not function.
     * Used to replace `try{} catch(err) {}` which is costy.
     * <br> `ARGS`: fun, def, caller, arg1, arg2, arg3, ...
     * @global
     * @template T
     * @param {(...Object) => T} fun
     * @param {Object} caller
     * @param {T|unset} [def]
     * @return {T|unset}
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
     * @template T
     * @param {T|((...Object) => T)} prop0fun
     * @param {Object} caller
     * @return {T}
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
        return prop0fun == null || typeof prop0fun !== "function" ?
            prop0fun :
            prop0fun.call(caller);
    };


    /**
     * Tries to get a JS property from some object created with {@link JavaAdapter}.
     * @global
     * @param {Object} obj
     * @param {string} nameProp
     * @param {Object} [def]
     * @return {*}
     */
    tryJsProp = function(obj, nameProp, def) {
        return obj.delegee == null || obj.delegee[nameProp] === undefined ?
            def :
            obj.delegee[nameProp];
    };


    /**
     * Variant of {@link tryVal} used to read parameter objects.
     * Can accept a list of property names for fallback.
     * @global
     * @param {Object|unset} paramObj
     * @param {Plural<string>} nameProps_p
     * @param {Object|unset} [def]
     * @return {*}
     */
    readParam = function(paramObj, nameProps_p, def) {
        if(paramObj == null) return def;
        if(!(nameProps_p instanceof Array)) {
            return paramObj[nameProps_p] == null ? def : paramObj[nameProps_p];
        };

        let i = 0, iCap = nameProps_p.iCap();
        while(i < iCap) {
            if(paramObj[nameProps_p[i]] != null) return paramObj[nameProps_p[i]];
            i++;
        };

        return def;
    };


    /**
     * Variant of {@link readParam} where result is immediately used if found.
     * @global
     * @param {Object|unset} paramObj
     * @param {Plural<string>} nameProps_p
     * @param {CFunction<*>} scr
     * @param {Object|unset} [def]
     * @return {void}
     */
    readParamAndCall = function(paramObj, nameProps_p, scr, def) {
        let val = readParam(paramObj, nameProps_p);
        if(val !== undefined) {
            scr(val);
        } else if(def !== undefined) {
            scr(def);
        };
    };


    /**
     * Converts null values in a param object into assigned default values.
     * <br> `ARGS`: paramObj, nameProp1, def1, nameProp2, def2, nameProp3, def3...
     * @global
     * @template T
     * @param {T} paramObj
     * @return {T}
     */
    processNullParam = function(paramObj) {
        let args = Array.from(arguments).splice(1);
        let i = 0;
        let iCap = args.iCap();
        let nameProp, def;
        while(i < iCap) {
            nameProp = args[i];
            def = args[i + 1];
            if(paramObj[nameProp] == null) {
                paramObj[nameProp] = def;
            };
            i += 2;
        };

        return paramObj;
    };


    /* <------------------------------ call ------------------------------ */


    /**
     * Used to set up a lot of properties.
     * <br> `IMPORTANT`: Do not use arrow function here!
     * <br> `ARGS`: thisVal, fun, arg1, arg2, arg3, ...
     * @global
     * @template T
     * @param {Object} thisVal
     * @param {(...Object) => T} fun
     * @return {T}
     */
    batchCall = function(thisVal, fun) {
        return fun.apply(thisVal, Array.from(arguments).splice(2));
    };


    /**
     * Used to call constructor function with an argument array.
     * <br> It's not possible to call `apply` on constructor function.
     * @global
     * @template T
     * @param {T} ctor
     * @param {Arguments} args
     * @return {T}
     */
    ctorCall = function(ctor, args) {
        function wrapper() {
            return ctor.apply(this, args);
        };
        wrapper.prototype = ctor.prototype;
        return new wrapper();
    };


    /* <------------------------------ debug ------------------------------ */


    // noinspection JSValidateTypes
    /**
     * The console object with some debugging methods.
     * @global
     */
    console = {


        /**
         * Logs some text.
         * @param {string} text
         * @param {ENumber|unset} [mode]
         * @return {void}
         */
        log: function(text, mode) {
            if(mode == null) mode = 0;
            switch(mode) {
                case 0 :
                    Log.info(text);
                    break;
                case 1 :
                    Log.warn(text);
                    break;
                case 2 :
                    Log.err(text);
                    break;
                case 3 :
                    Log.debug(text);
                    break;
            };
        },


        /**
         * Logs some text as warning.
         * @param {string} text
         * @return {void}
         */
        warn: function(text) {
            console.log(text, 1);
        },


        /**
         * Logs some text as error.
         * @param {string} text
         * @return {void}
         */
        err: function(text) {
            console.log(text, 2);
        },


        /**
         * Logs some text as debugging info.
         * @param {string} text
         * @return {void}
         */
        debug: function(text) {
            console.log(text, 3);
        },


        /**
         * Logs some text if given `bool` is false.
         * @param {boolean} bool
         * @param {string} text
         * @param {number|unset} [mode]
         * @return {void}
         */
        assert: function(bool, text, mode) {
            if(mode == null) mode = 2;
            if(!bool) {
                console.log(text, mode);
            };
        },


        /**
         * @internal
         * @type {Object<string, number>}
         */
        __countObj__: {},


        /**
         * Counts how many times this method is called.
         * @param {string|unset} [tag]
         * @return {void}
         */
        count: function(tag) {
            if(tag == null) tag = "default";
            console.log("Count for " + tag + ": " + LCNativeObject.numIncre(console.__countObj__, tag));
        },


    };


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
     * Prints accessible keys of some object.
     * @global
     * @param {Object} obj
     * @return {void}
     * @lovecTypeSensitive
     */
    printKeys = function(obj) {
        if(typeof obj !== "object" && typeof obj !== "function") return;
        Object.keys(obj).printEach();
    };


    /**
     * Prints all key-value pairs in an object.
     * @global
     * @param {Object} obj
     * @return {void}
     * @lovecTypeSensitive
     */
    printObj = function(obj) {
        if(typeof obj !== "object" && typeof obj !== "function") {
            print(obj);
            return;
        };
        if(typeof obj === "function") {
            print(obj);
        };
        Object.eachPair(obj, (key, val) => {
            print([key, val]);
        });
    };


    /**
     * Prints something and returns it.
     * Used for debugging.
     * @global
     * @template T
     * @param {T} obj
     * @return {T}
     */
    printReturn = function(obj) {
        print(obj);
        return obj;
    };
