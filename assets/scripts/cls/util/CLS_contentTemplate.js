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
  /** <ROW>: nmPropNew, nmPropOld, def. */
  CLS_contentTemplate.paramAliasArr = [];
  /** <ROW>: nmProp, valGetter. */
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
   * @param {string} nm
   * @return {boolean}
   */
  CLS_contentTemplate.isSubTempOf = function(nm) {
    return this.nm === nm || LCTempParentMap.get(this.nm).includes(nm);
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
   * @param {Array} arr - <ROW>: nmPropNew, nmPropOld, def.
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
   * @param {Array} arr - <ROW>: nmProp, valGetter
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
    MDL_event._c_onLoad(() => {
      this.paramObj.tempTags.forEachFast(tag => {
        if(!registeredTags.includes(tag) && !DB_item.db["intmd"]["tag"].includes(tag)) console.warn("[LOVEC] Template tag ${1} has not been registered yet!".format(tag.color(Pal.accent)));
      });
    });

    return this;
  };


  /**
   * Sets methods, which will be mixed with previous methods.
   * <br> Special method names:
   * <br> "__PARAM_OBJ_SETTER__" - Result will be used in `setParam`.
   * <br> "__PARAM_ALIAS_SETTER__" - Result will be used in `setParamAlias`.
   * <br> "__PARAM_PARSER_SETTER__" - Result will be used in `setParamParser`.
   * @param {Object<string, TemplateFunction>} nmFunObj
   * @param {boolean|unset} [isFromIntf] - Do not set this!
   * @return {this}
   */
  CLS_contentTemplate.setMethod = function(nmFunObj, isFromIntf) {
    const thisCls = this;

    Object._it(nmFunObj, (nm, fun) => {
      // Internal methods used in interfaces
      if(nm === "__PROTO__") {
        throw new Error("Do not set prototype properties for content template interface!");
      };
      if(nm === "__PARAM_OBJ_SETTER__") {
        thisCls.setParam(fun());
        return;
      };
      if(nm === "__PARAM_ALIAS_SETTER__") {
        thisCls.setParamAlias(fun());
        return;
      };
      if(nm === "__PARAM_PARSER_SETTER__") {
        thisCls.setParamParser(fun());
        return;
      };

      initTempMethod(fun, isFromIntf);

      if(fun.override) {
        // Override the previous method
        fun.funPrev = thisCls.funObj[nm];
        thisCls.funObj[nm] = fun;
      } else {
        let superFun = thisCls.funObj[nm];
        if(superFun != null) {
          if((fetchSetting("test-intf-nosuper-warning") ? true : !isFromIntf) && !fun.override && superFun.noSuper && fun.noSuper !== superFun.noSuper) console.warn("[LOVEC] ${1}${2} has mismatched `noSuper` with super method in ${3}!".format(nm.color(Pal.accent), !isFromIntf ? "" : " (from interface)", this.nm.color(Pal.accent)));
          if(!fun.override && fun.argLen >= 0 && superFun.argLen !== fun.argLen) console.warn("[LOVEC] ${1} has mismatched argument length (${2}) with super method in ${3}!".format(nm.color(Pal.accent), fun.argLen, this.nm.color(Pal.accent)));
        };
        thisCls.funObj[nm] = mixTempMethods(superFun, fun, MethodMixModes.NORMAL);
      };
      thisCls.funObj[nm].nm = nm;
      if(!thisCls.funObj[nm].noSuper && nm.startsWith("ex_")) {
        let str = "";
        Object._it(nmFunObj, (nm, fun) => {
          str += "> " + nm + "\n";
          str += fun;
        });
        console.warn(String.multiline(
          '[LOVEC] Found an "ex_xxx" method without `noSuper = true` in ${1}:'.format(this.nm.color(Pal.accent)),
          nm,
          thisCls.funObj[nm],
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

    Object._it(this.paramObj, (nm, def) => {
      // Skip template parent, or an error jumps out of nowhere
      if(nm === "tempParent") return;
      // Copy template tags to avoid modification on the template
      if(nm === "tempTags") {
        obj[nm] = paramObj == null || paramObj[nm] === undefined ? def.cpy() : paramObj[nm];
        return;
      };

      obj[nm] = paramObj == null || paramObj[nm] === undefined ? def : paramObj[nm];
    });
    this.paramAliasArr.forEachRow(3, (nmPropNew, nmPropOld, def) => {
      // Migrate alias properties to real ones
      if(obj[nmPropNew] === undefined) {
        obj[nmPropOld] = def;
      } else if(obj[nmPropNew] === "!ALIAS") {
        obj[nmPropOld] = def;
        delete obj[nmPropNew];
      } else {
        obj[nmPropOld] = obj[nmPropNew];
        delete obj[nmPropNew];
      };
    });
    this.paramParserArr.forEachRow(2, (nmProp, parser) => {
      obj[nmProp] = parser.apply(obj, [obj[nmProp]]);
    });
    Object._it(obj, (nm, prop) => {
      // When the property is a `Prov`, use the content instead
      if(prop instanceof Prov) obj[nm] = prop.get();
      // When the property is a `Cons`, pass the object to it
      if(prop instanceof Cons) obj[nm] = prop.get(obj);
    });
    Object._it(this.funObj, (nm, fun) => {
      // Get the final method and wrap its length
      obj[nm] = mixTempMethods(null, fun, MethodMixModes.BUILD, nm);
      /*obj[nm] = fun.noSuper ?
        fun.wrapLen(fun.argLen) :
        (
          fun.superBoolMode === "and" ?
            function() {
              return this["super$" + fun.nm].apply(this, arguments) && fun.apply(this, arguments);
            }.wrapLen(fun.argLen) :
            fun.superBoolMode === "or" ?
              function() {
                return this["super$" + fun.nm].apply(this, arguments) || fun.apply(this, arguments);
              }.wrapLen(fun.argLen) :
              fun.mergeMode === "object" ?
                function() {
                  return Object.mergeObj(this["super$" + fun.nm].apply(this, arguments), fun.apply(this, arguments));
                }.wrapLen(fun.argLen) :
                fun.mergeMode === "array" ?
                  function() {
                    return this["super$" + fun.nm].apply(this, arguments).pushAll(fun.apply(this, arguments));
                  }.wrapLen(fun.argLen) :
                  typeof fun.mergeMode === "function" ?
                    function() {
                      TMP_TUP.with(this["super$" + fun.nm].apply(this, arguments), fun.apply(this, arguments));
                      return fun.mergeMode.apply(this, TMP_TUP);
                    }.wrapLen(fun.argLen) :
                    function() {
                      this["super$" + fun.nm].apply(this, arguments);
                      return fun.apply(this, arguments);
                    }.wrapLen(fun.argLen)
        );
      obj[nm].argLen = fun.argLen;*/
    });

    // Utility methods on the content created
    obj.ex_getTemp = function() {
      return thisTemp;
    };
    obj.ex_getTempNm = function() {
      return thisTemp.nm;
    };
    obj.ex_isSubInsOf = function(nm) {
      return obj.ex_getTemp().isSubTempOf(nm);
    };

    return obj;
  };


/*
  ========================================
  Section: Definition (Instance)
  ========================================
*/




module.exports = CLS_contentTemplate;
