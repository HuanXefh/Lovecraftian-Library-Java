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


  /* <---------- static property ----------> */


  CLS_contentTemplate.__IS_CONTENT_TEMPLATE__ = true;
  CLS_contentTemplate.nm = "CLS_contentTemplate";


  /**
   * @type {Object}
   */
  CLS_contentTemplate.paramObj = {
    tempParent: null,
    tempTags: [],
  };


  /**
   * <ROW>: nmPropNew, nmPropOld, def.
   * @type {Array}
   */
  CLS_contentTemplate.paramAliasArr = [];


  /**
   * <ROW>: nmProp, valGetter.
   * @type {Array}
   */
  CLS_contentTemplate.paramParserArr = [];


  /**
   * @type {Object}
   */
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
   *   "file", function(path) {return require(path)};
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

      fun.setProp({
        noSuper: tryVal(fun.noSuper, false),
        override: tryVal(fun.override, false),
        final: tryVal(fun.final, false),
        boolMode: tryVal(fun.boolMode, "none"),
        superBoolMode: tryVal(fun.superBoolMode, fun.boolMode),
        mergeMode: tryVal(fun.mergeMode, "none"),
        argLen: tryVal(fun.argLen, -1),
        funPrev: !isFromIntf ? null : tryVal(fun.funPrev, null),
        funCur: !isFromIntf ? null : tryVal(fun.funCur, null),
      });

      if(fun.override) {
        // Override the previous method
        fun.funPrev = thisCls.funObj[nm];
        thisCls.funObj[nm] = fun;
      } else {
        let superFun = thisCls.funObj[nm];
        if(superFun != null) {
          if((fetchSetting("test-intf-nosuper-warning") ? true : !isFromIntf) && !fun.override && superFun.noSuper && fun.noSuper !== superFun.noSuper) Log.warn("[LOVEC] ${1}${2} has mismatched `noSuper` with super method in ${3}!".format(nm.color(Pal.accent), !isFromIntf ? "" : " (from interface)", this.nm.color(Pal.accent)));
          if(!fun.override && fun.argLen >= 0 && superFun.argLen !== fun.argLen) Log.warn("[LOVEC] ${1} has mismatched argument length (${2}) with super method in ${3}!".format(nm.color(Pal.accent), fun.argLen, this.nm.color(Pal.accent)));
        };
        // Call super method if defined
        thisCls.funObj[nm] = superFun == null ?
          fun :
          superFun.final ?
            superFun :
            (
              fun.boolMode === "and" ?
                function() {
                  return superFun.apply(this, arguments) && fun.apply(this, arguments);
                } :
                fun.boolMode === "or" ?
                  function() {
                    return superFun.apply(this, arguments) || fun.apply(this, arguments);
                  } :
                  fun.mergeMode === "object" ?
                    function() {
                      return Object.mergeObj(superFun.apply(this, arguments), fun.apply(this, arguments));
                    } :
                    fun.mergeMode === "array" ?
                      function() {
                        return superFun.apply(this, arguments).pushAll(fun.apply(this, arguments));
                      } :
                      typeof fun.mergeMode === "function" ?
                        function() {
                          return fun.mergeMode(superFun.apply(this, arguments), fun.apply(this, arguments));
                        } :
                        function() {
                          superFun.apply(this, arguments);
                          return fun.apply(this, arguments);
                        }
            ).setProp({
              noSuper: fun.noSuper,
              override: false,
              final: fun.final,
              boolMode: fun.boolMode,
              superBoolMode: fun.superBoolMode,
              mergeMode: fun.mergeMode,
              argLen: Math.max(superFun.argLen, fun.argLen),
              funPrev: superFun,
              funCur: fun,
            });
      };
      thisCls.funObj[nm].nm = nm;
      if(!thisCls.funObj[nm].noSuper && nm.startsWith("ex_")) {
        let str = "";
        Object._it(nmFunObj, (nm, fun) => {
          str += "> " + nm + "\n";
          str += fun;
        });
        Log.warn(String.multiline(
          "[LOVEC] Found a ex_xxx method without {noSuper = true} in ${1}:".format(this.nm.color(Pal.accent)),
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
   * Builds the object used in `extend`.
   * @param {Object} paramObj - Sets values of properties in a template. Only properties defined with content template can be set.
   * @return {Object}
   */
  CLS_contentTemplate.build = function(paramObj) {
    const obj = {};
    const thisFun = this;
    if(this.getParent() == null) ERROR_HANDLER.throw("contentTemplateNoParentJavaClass");

    Object._it(this.paramObj, (nm, def) => {
      // Skip template parent, or an error jumps out of nowhere
      if(nm === "tempParent") return;
      // Copy template tags to avoid modification on the template
      if(nm === "tempTags") {
        obj[nm] = (paramObj == null || paramObj[nm] === undefined) ? def.cpy() : paramObj[nm];
        return;
      };

      obj[nm] = (paramObj == null || paramObj[nm] === undefined) ? def : paramObj[nm];
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
      // When the property is a {Prov}, use the content instead
      if(prop instanceof Prov) obj[nm] = prop.get();
      // When the property is a {Cons}, pass the object to it
      if(prop instanceof Cons) obj[nm] = prop.get(obj);
    });
    Object._it(this.funObj, (nm, fun) => {
      // Get the final method and wrap its length
      obj[nm] = fun.noSuper ?
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
                      return fun.mergeMode(this["super$" + fun.nm].apply(this, arguments), fun.apply(this, arguments));
                    }.wrapLen(fun.argLen) :
                    function() {
                      this["super$" + fun.nm].apply(this, arguments);
                      return fun.apply(this, arguments);
                    }.wrapLen(fun.argLen)
        );
      obj[nm].argLen = fun.argLen;
    });

    // Utility methods on the content created
    obj.ex_getTemp = function() {
      return thisFun;
    };
    obj.ex_getTempNm = function() {
      return thisFun.nm;
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
