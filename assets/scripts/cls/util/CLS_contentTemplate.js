/*
  ========================================
  Section: Definition
  ========================================
*/


    /**
     * Base class of all content templates, provides basic methods to define a template.
     * Content templates are used to build the object for `extend` and its Lovec variants.
     * <br> `IMPORTANT`: Do not create instance of templates!
     * @class
     */
    const CLS_contentTemplate = newClass().initClass();


    /** @type {ObjectMap<string, ContentTemplate>} */
    const nameTempMap = new ObjectMap();
    /** @type {ObjectMap<string, Array<string>>} */
    const nameTempParentsMap = ObjectMap.of(
        "CLS_contentTemplate", [],
    );
    /** @type {Array<string>} */
    const registeredTags = [];
    /** @type {number} */
    let buildTaskAmt = 0;


    /** @type {boolean} */
    CLS_contentTemplate.__isContentTemplate__ = true;
    /** @type {string} */
    CLS_contentTemplate.clsName = "CLS_contentTemplate";
    /** @type {Object} */
    CLS_contentTemplate.paramObj = {
        tempParent: null,
        tempFunPrefix: "ex_",
        tempTags: [],
    };
    /** @type {TemplateAliasArray} */
    CLS_contentTemplate.paramAliasArr = [];
    /** @type {TemplateParserArray} */
    CLS_contentTemplate.paramParserArr = [];
    /** @type {Object<string, TemplateFunction>} */
    CLS_contentTemplate.funObj = {};


    MDL_event.onLoad(() => {
        console.log("[LOVEC] ${1} objects built with content template.".format(buildTaskAmt.color(Pal.accent)));
    });


/*
  ========================================
  Section: Definition (Static)
  ========================================
*/


    /* <------------------------------ meta ------------------------------> */


    /**
     * Maps a name to some content template class.
     * Do not invoke this manually!
     * @param {string} name
     * @param {typeof CLS_contentTemplate} temp
     * @return {void}
     */
    CLS_contentTemplate.register = function(name, temp) {
        nameTempMap.put(name, temp);
        nameTempParentsMap.put(name, nameTempParentsMap.get(temp.__superClass__.clsName).cpy().pushAll(name));
    };


    /**
     * Gets a content template by name.
     * @param {string} name
     * @return {ContentTemplate}
     */
    CLS_contentTemplate.get = function(name) {
        return nameTempMap.get(name);
    };


    /**
     * Gets parent templates/interfaces as names.
     * @param {string} name
     * @return {Array<string>}
     */
    CLS_contentTemplate.getTempParents = function(name) {
        return nameTempParentsMap.get(name, Array.air);
    };


    /**
     * Adds common methods shared by all contents created with template.
     * @param {Object} obj
     * @param {CLS_contentTemplate} tempCur
     * @return {void}
     */
    CLS_contentTemplate.registerCommonMethods = function(obj, tempCur) {


        /**
         * Gets the content template that creates this content.
         * @memberof UnlockableContent
         * @instance
         * @return {CLS_contentTemplate}
         * @lovecAttached
         */
        obj.ex_getTemp = function() {
            return tempCur;
        };


        /**
         * Variant of {@link UnlockableContent#ex_getTemp} that returns name instead.
         * @memberof UnlockableContent
         * @instance
         * @return {string}
         * @lovecAttached
         */
        obj.ex_getTempName = function() {
            return tempCur.clsName;
        };


        /**
         * Whether this content inherits data from a content template.
         * @memberof UnlockableContent
         * @instance
         * @param {string} name
         * @return {boolean}
         * @lovecAttached
         */
        obj.ex_isSubInsOf = function(name) {
            return obj.ex_getTemp().isSubTempOf(name);
        };


    };


    /**
     * Gets final version of method name.
     * @param {string} name
     * @return {string}
     */
    CLS_contentTemplate.resolveMethodName = function(name) {
        // `createIcons` is removed in v9
        if(!LCCompatibilityHandler.isV8 && name === "createIcons") return "packSprites";

        return name;
    };


    /* <------------------------------ property ------------------------------> */


    /**
     * Gets the Java class used in `extend`.
     * @return {Class<Object>}
     */
    CLS_contentTemplate.getParent = function() {
        return this.paramObj.tempParent;
    };


    /**
     * Whether this template extends some template or implements some interface.
     * For condition check, use tags whenever possible for flexibility!
     * @param {string} name
     * @return {boolean}
     */
    CLS_contentTemplate.isSubTempOf = function(name) {
        return this.clsName === name || CLS_contentTemplate.getTempParents(this.clsName).includes(name);
    };


    /* <------------------------------ template tag ------------------------------> */


    /**
     * Call this method to register new template tags.
     * @param {string} tag
     * @return {this}
     */
    CLS_contentTemplate.registerTag = function(tag) {
        registerUniqueName(tag, registeredTags, "content template tag");
        return this;
    };


    /* <------------------------------ modification ------------------------------> */


    /**
     * Sets new properties and their default values.
     * <br> When param is a function, wrap it with proper function getter like {@link boolf}.
     * <br> When param is an object and not shared among all instances (e.g. array), wrap it with {@link tprov} or {@link tfunc}.
     * @param {Object} obj
     * @return {this}
     */
    CLS_contentTemplate.setParam = function(obj) {
        this.paramObj = mergeObj(this.paramObj, obj);
        return this;
    };


    /**
     * Sets aliases for properties.
     * @param {TemplateAliasArray} arr
     * @return {this}
     */
    CLS_contentTemplate.setParamAlias = function(arr) {
        let i = 0, iCap = arr.iCap();
        while(i < iCap) {
            if(arr[i] !== arr[i + 1]) {
                this.paramAliasArr.write([arr[i], arr[i + 1]], arr[i + 2]);
                this.paramObj[arr[i]] = TmpStateTag.alias;
            };
            i += 3;
        };
        return this;
    };


    /**
     * Sets parsers to change value of some property before building final object.
     * `this` in the parsers refers to the object being built.
     * @param {TemplateParserArray} arr
     * @return {this}
     * @example
     * // The property "file" is a path string that needs to be converted
     * temp.setParamParser([
     *     "file", function(path) {return require(path)},
     * ]);
     */
    CLS_contentTemplate.setParamParser = function(arr) {
        let i = 0, iCap = arr.iCap();
        while(i < iCap) {
            this.paramParserArr.write(arr[i], arr[i + 1]);
            i += 2;
        };
        return this;
    };


    /**
     * Sets the Java class used in `extend`.
     * @param {Class} javaCls
     * @return {this}
     * @lovecTypeSensitive
     */
    CLS_contentTemplate.setParent = function(javaCls) {
        if(javaCls != null && (typeof javaCls !== "function" || javaCls.__javaObject__ == null)) throw new Error("Cannot set parent of ${1} to a non-Java class".format(this.clsName));
        this.paramObj.tempParent = javaCls;
        return this;
    };


    /**
     * Sets tags of the template.
     * <br> `ARGS`: `...string` - tags
     * @return {this}
     */
    CLS_contentTemplate.setTags = function() {
        this.paramObj.tempTags = Array.from(arguments);
        if(this.paramObj.tempTags.length > 0) {
            MDL_event.onLoad(() => {
                this.paramObj.tempTags.forEachFast(tag => {
                    if(
                        !registeredTags.includes(tag)
                            && !tag.startsWith("dmg0type")
                            && !DB_item.db["intmd"]["tag"].includes(tag)
                    ) {
                        console.warn("[LOVEC] Template tag ${1} has not been registered yet!".format(tag.color(Pal.accent)));
                    };
                }, true);
            });
        };
        return this;
    };


    /**
     * Sets expected prefix of all new methods.
     * <br> New methods starts with "ex_" by default.
     * @param {string} prefix
     * @return {this}
     */
    CLS_contentTemplate.setMethodPrefix = function(prefix) {
        this.paramObj.tempFunPrefix = String(prefix);
        return this;
    };


    /**
     * Sets methods, which will be mixed with previous methods.
     * <br> Special method names:
     * <br> "__paramObjM__" - Result will be used in {@link CLS_contentTemplate.setParam}.
     * <br> "__paramAliasM__" - Result will be used in {@link CLS_contentTemplate.setParamAlias}.
     * <br> "__paramParserM__" - Result will be used in {@link CLS_contentTemplate.setParamParser}.
     * @param {Object<string, TemplateFunction>} nameFunObj
     * @param {boolean|unset} [isFromIntf] - Do not set this!
     * @return {this}
     */
    CLS_contentTemplate.setMethod = function(nameFunObj, isFromIntf) {
        const thisCls = this;

        Object.eachPair(nameFunObj, (name, fun) => {
            // Internal methods used in interfaces
            if(name === "__protoF__") {
                throw new Error("Do not set prototype properties for content template interface!");
            };
            if(name === "__paramObjM__") {
                thisCls.setParam(fun());
                return;
            };
            if(name === "__paramAliasM__") {
                thisCls.setParamAlias(fun());
                return;
            };
            if(name === "__paramParserM__") {
                thisCls.setParamParser(fun());
                return;
            };

            initTempMethod(fun, isFromIntf);

            if(fun.override) {
                // Override the previous method
                fun.funPrev = thisCls.funObj[name];
                thisCls.funObj[name] = fun;
            } else {
                let superFun = thisCls.funObj[name];
                if(superFun != null) {
                    if((fetchSetting("test-intf-nosuper-warning") || !isFromIntf) && !fun.override && superFun.noSuper && fun.noSuper !== superFun.noSuper) {
                        console.warn("[LOVEC] ${1}${2} has mismatched `noSuper` with super method in ${3}!".format(name.color(Pal.accent), !isFromIntf ? "" : " (from interface)", this.clsName.color(Pal.accent)));
                    };
                    if(!fun.override && fun.argLen >= 0 && superFun.argLen !== fun.argLen) {
                        console.warn("[LOVEC] ${1} has mismatched argument length (${2}) with super method in ${3}!".format(name.color(Pal.accent), fun.argLen, this.clsName.color(Pal.accent)));
                    };
                };
                thisCls.funObj[name] = mixTempMethods(superFun, fun, MethodMixModes.NORMAL);
            };
            thisCls.funObj[name].clsName = name;
            if(!thisCls.funObj[name].noSuper && name.startsWith(thisCls.paramObj.tempFunPrefix)) {
                let str = "";
                Object.eachPair(nameFunObj, (name, fun) => {
                    str += "> " + name + "\n";
                    str += fun;
                });
                console.warn(String.multiline(
                    '[LOVEC] Found an "${1}xxx" method without `noSuper = true` in ${2}:'.format(thisCls.paramObj.tempFunPrefix, this.clsName.color(Pal.accent)),
                    name,
                    thisCls.funObj[name],
                    "Full object:",
                    str,
                ));
            };
        });

        return this;
    };


    /* <------------------------------ util ------------------------------> */


    /**
     * Override this method to implement Java interfaces.
     * <br> `LATER`
     * @param {ExtendObject} obj
     * @return {Array<Class>}
     */
    CLS_contentTemplate.getParentIntfs = function(obj) {
        return Array.air;
    };


    /**
     * Override this method to initialize some content right after `extend` is called.
     * <br> Remember to call `this.super("initContent", ct)`!
     * <br> `LATER`
     * @param {UnlockableContent} ct
     * @return {void}
     */
    CLS_contentTemplate.initContent = function(ct) {

    };


    /**
     * Builds the object used in `extend`.
     * @param {ExtendParamObject} paramObj
     * @param {Object|unset} [baseObj] - In case that someone needs raw fields without type check.
     * @return {ExtendObject}
     */
    CLS_contentTemplate.build = function(paramObj, baseObj) {
        let obj = baseObj != null ? baseObj : {};
        let parent = this.getParent();
        if(parent == null) throw new Error("Content template has null parent: " + this.clsName);

        // Copy valid values from `paramObj` to `this.paramObj`
        Object.eachPair(this.paramObj, (name, def) => {
            if(name.equalsAny("tempParent", "tempFunPrefix")) return;
            // Copy template tags to avoid modification on the template
            if(name === "tempTags") {
                obj[name] = paramObj == null || paramObj[name] === undefined ? def.cpy() : paramObj[name];
                return;
            };
            if(name === "metaObj") {
                throw new Error("Do not set `metaObj` with `setParam()`!");
            };
            obj[name] = paramObj == null || paramObj[name] === undefined ? def : paramObj[name];
        });
        // Warn invalid fields in `paramObj`
        Object.eachPair(paramObj, (name, val) => {
            if(this.paramObj[name] === undefined) {
                console.warn("[LOVEC] Unknown field for content template ${1}: ".format(this.clsName.color(Pal.accent)) + name);
            };
        });
        // Handle aliases
        this.paramAliasArr.forEachRow(3, (namePropNew, namePropOld, def) => {
            // Migrate alias properties to real ones
            if(obj[namePropNew] === undefined) {
                obj[namePropOld] = def;
            } else if(obj[namePropNew] === TmpStateTag.alias) {
                obj[namePropOld] = def;
                delete obj[namePropNew];
            } else {
                obj[namePropOld] = obj[namePropNew];
                delete obj[namePropNew];
            };
        }, true);
        // Handle meta object in `paramObj`
        if(paramObj != null && typeof paramObj.metaObj === "object") {
            let fields = VAR.ctJsonParser.getFields(parent);
            let metaData;
            paramObj.metaObj.eachPair((name, val) => {
                metaData = fields.get(name.replace(/ /g, "_"));
                if(metaData == null) {
                    console.warn("[LOVEC] Unknown field ${1} for class ${2}!".format(name.color(Pal.remove), parent.__javaObject__.getSimpleName().color(Pal.accent)));
                    printObj(paramObj);
                    printObj(paramObj.metaObj);
                    return;
                };
                obj[name] = val;
            });
        };
        // Parse parameters
        this.paramParserArr.forEachRow(2, (nameProp, parser) => {
            obj[nameProp] = parser.apply(obj, [obj[nameProp]]);
        }, true);
        // Handle template getters
        Object.eachPair(obj, (name, prop) => {
            if(prop instanceof TemplateProv) obj[name] = prop.get();
            if(prop instanceof TemplateFunc) obj[name] = prop.get(obj);
        });
        // Gets final version of methods (with wrapped length)
        let finalMethodName;
        Object.eachPair(this.funObj, (name, fun) => {
            finalMethodName = CLS_contentTemplate.resolveMethodName(name);
            obj[finalMethodName] = mixTempMethods(null, fun, MethodMixModes.BUILD, name);
        });

        CLS_contentTemplate.registerCommonMethods(obj, this);
        buildTaskAmt++;

        return obj;
    };


/*
  ========================================
  Section: Definition (Instance)
  ========================================
*/




module.exports = CLS_contentTemplate;
