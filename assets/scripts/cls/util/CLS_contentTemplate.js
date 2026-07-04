/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- meta ----------> */


  /**
   * Base class of all content templates, provides basic methods to define a template.
   * Content templates are used to build the object for `extend` and its Lovec variants.
   * Do not create instance of templates!
   * @class
   */
  const CLS_contentTemplate = newClass().initClass();


  CLS_contentTemplate.prototype.init = function() {
    ERROR_HANDLER.throw("contentTemplateInstance");
  };


  const TMP_TUP = [];
  const registeredTags = [];


  CLS_contentTemplate.__IS_CONTENT_TEMPLATE__ = true;
  CLS_contentTemplate.nm = "CLS_contentTemplate";
  CLS_contentTemplate.paramObj = {
    tempParent: null,
    tempTags: [],
  };
  /** <ROW>: namePropNew, namePropOld, def. */
  CLS_contentTemplate.paramAliasArr = [];
  /** <ROW>: nameProp, valGetter. */
  CLS_contentTemplate.paramParserArr = [];
  CLS_contentTemplate.funObj = {};


/*
  ========================================
  Section: Definition (Static)
  ========================================
*/


  /* <------------------------------ property ------------------------------ */


  /**
   * Gets the Java class used in `extend`.
   * @return {Function}
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
    return this.nm === name || LCTempParentMap.get(this.nm).includes(name);
  };


  /* <------------------------------ template tag ------------------------------ */


  /**
   * Call this method to register new template tags.
   * @param {string} tag
   * @return {this}
   */
  CLS_contentTemplate.registerTag = function(tag) {
    registerUniqueName(tag, registeredTags, "content template tag");

    return this;
  };


  /* <------------------------------ modification ------------------------------ */


  /**
   * Sets new properties and their default values.
   * @param {Object} obj
   * @return {this}
   */
  CLS_contentTemplate.setParam = function(obj) {
    this.paramObj = mergeObj(this.paramObj, obj);

    return this;
  };


  /**
   * Sets aliases for properties.
   * @param {Array} arr - <ROW>: namePropNew, namePropOld, def.
   * @return {this}
   */
  CLS_contentTemplate.setParamAlias = function(arr) {
    let i = 0, iCap = arr.iCap();
    while(i < iCap) {
      if(arr[i] !== arr[i + 1]) {
        this.paramAliasArr.write([arr[i], arr[i + 1]], arr[i + 2]);
        this.paramObj[arr[i]] = "!ALIAS";
      };
      i += 3;
    };

    return this;
  };


  /**
   * Sets parsers to change value of some property before building final object.
   * `this` in the parsers refers to the object being built.
   * @param {Array} arr - <ROW>: nameProp, valGetter
   * @return {this}
   * @example
   * // The property "file" is a path string that needs to be converted
   * temp.setParamParser([
   *   "file", function(path) {return require(path)},
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
   * @param {Function} javaCls
   * @return {this}
   */
  CLS_contentTemplate.setParent = function(javaCls) {
    if(javaCls != null && (typeof javaCls !== "function" || javaCls.__javaObject__ == null)) throw new Error("Cannot set parent of ${1} to a non-Java class!".format(this.nm));
    this.paramObj.tempParent = javaCls;

    return this;
  };


  /**
   * Sets tags of the template.
   * <br> <ARGS>: tag1, tag2, tag3, ...
   * @return {this}
   */
  CLS_contentTemplate.setTags = function() {
    this.paramObj.tempTags = Array.from(arguments);
    if(this.paramObj.tempTags.length > 0) {
      MDL_event._c_onLoad(() => {
        this.paramObj.tempTags.forEachFast(tag => {
          if(
            !registeredTags.includes(tag)
              && !tag.startsWith("dmg0type")
              && !DB_item.db["intmd"]["tag"].includes(tag)
          ) {
            console.warn("[LOVEC] Template tag ${1} has not been registered yet!".format(tag.color(Pal.accent)));
          };
        });
      });
    };

    return this;
  };


  /**
   * Sets methods, which will be mixed with previous methods.
   * <br> Special method names:
   * <br> "__PARAM_OBJ_SETTER__" - Result will be used in `setParam`.
   * <br> "__PARAM_ALIAS_SETTER__" - Result will be used in `setParamAlias`.
   * <br> "__PARAM_PARSER_SETTER__" - Result will be used in `setParamParser`.
   * @param {Object<string, TemplateFunction>} nameFunObj
   * @param {boolean|unset} [isFromIntf] - Do not set this!
   * @return {this}
   */
  CLS_contentTemplate.setMethod = function(nameFunObj, isFromIntf) {
    const thisCls = this;

    Object._it(nameFunObj, (name, fun) => {
      // Internal methods used in interfaces
      if(name === "__PROTO__") {
        throw new Error("Do not set prototype properties for content template interface!");
      };
      if(name === "__PARAM_OBJ_SETTER__") {
        thisCls.setParam(fun());
        return;
      };
      if(name === "__PARAM_ALIAS_SETTER__") {
        thisCls.setParamAlias(fun());
        return;
      };
      if(name === "__PARAM_PARSER_SETTER__") {
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
          if((fetchSetting("test-intf-nosuper-warning") ? true : !isFromIntf) && !fun.override && superFun.noSuper && fun.noSuper !== superFun.noSuper) console.warn("[LOVEC] ${1}${2} has mismatched `noSuper` with super method in ${3}!".format(name.color(Pal.accent), !isFromIntf ? "" : " (from interface)", this.nm.color(Pal.accent)));
          if(!fun.override && fun.argLen >= 0 && superFun.argLen !== fun.argLen) console.warn("[LOVEC] ${1} has mismatched argument length (${2}) with super method in ${3}!".format(name.color(Pal.accent), fun.argLen, this.nm.color(Pal.accent)));
        };
        thisCls.funObj[name] = mixTempMethods(superFun, fun, MethodMixModes.NORMAL);
      };
      thisCls.funObj[name].nm = name;
      if(!thisCls.funObj[name].noSuper && name.startsWith("ex_")) {
        let str = "";
        Object._it(nameFunObj, (nnamem, fun) => {
          str += "> " + name + "\n";
          str += fun;
        });
        console.warn(String.multiline(
          '[LOVEC] Found an "ex_xxx" method without `noSuper = true` in ${1}:'.format(this.nm.color(Pal.accent)),
          name,
          thisCls.funObj[name],
          "Full object:",
          str,
        ));
      };
    });

    return this;
  };


  /* <------------------------------ util ------------------------------ */


  /**
   * Override this method to implement Java interfaces.
   * <br> <LATER>
   * @param {Object} obj - The object built for `extend`.
   * @return {Array<Class>}
   */
  CLS_contentTemplate.getParentIntfs = function(obj) {
    return Array.air;
  };


  /**
   * Override this method to initialize some content just after `extend` is called.
   * <br> <LATER>
   * @param {UnlockableContent} ct
   * @return {void}
   */
  CLS_contentTemplate.initContent = function(ct) {

  };


  /**
   * Builds the object used in `extend`.
   * @param {Object} paramObj - Sets values of properties in a template. Only properties defined with content template can be set.
   * @return {Object}
   */
  CLS_contentTemplate.build = function(paramObj) {
    const thisTemp = this;
    let obj = {};
    if(this.getParent() == null) ERROR_HANDLER.throw("contentTemplateNoParentJavaClass");

    Object._it(this.paramObj, (name, def) => {
      // Skip template parent, or an error jumps out of nowhere
      if(name === "tempParent") return;
      // Copy template tags to avoid modification on the template
      if(name === "tempTags") {
        obj[name] = paramObj == null || paramObj[name] === undefined ? def.cpy() : paramObj[name];
        return;
      };

      obj[name] = paramObj == null || paramObj[name] === undefined ? def : paramObj[name];
    });
    this.paramAliasArr.forEachRow(3, (namePropNew, namePropOld, def) => {
      // Migrate alias properties to real ones
      if(obj[namePropNew] === undefined) {
        obj[namePropOld] = def;
      } else if(obj[namePropNew] === "!ALIAS") {
        obj[namePropOld] = def;
        delete obj[namePropNew];
      } else {
        obj[namePropOld] = obj[namePropNew];
        delete obj[namePropNew];
      };
    });
    this.paramParserArr.forEachRow(2, (nameProp, parser) => {
      obj[nameProp] = parser.apply(obj, [obj[nameProp]]);
    });
    Object._it(obj, (name, prop) => {
      // When the property is a `Prov`, use the content instead
      if(prop instanceof Prov) obj[name] = prop.get();
      // When the property is a `Cons`, pass the object to it
      if(prop instanceof Cons) obj[name] = prop.get(obj);
    });
    Object._it(this.funObj, (name, fun) => {
      // Get the final method and wrap its length
      obj[name] = mixTempMethods(null, fun, MethodMixModes.BUILD, name);
    });

    // Utility methods on the content created
    obj.ex_getTemp = function() {
      return thisTemp;
    };
    obj.ex_getTempName = function() {
      return thisTemp.nm;
    };
    obj.ex_isSubInsOf = function(name) {
      return obj.ex_getTemp().isSubTempOf(name);
    };

    return obj;
  };


/*
  ========================================
  Section: Definition (Instance)
  ========================================
*/




module.exports = CLS_contentTemplate;
