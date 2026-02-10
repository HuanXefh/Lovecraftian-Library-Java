/* ----------------------------------------
 * NOTE:
 *
 * The base class of content templates.
 * Templates are used to create the object used in {extend} and its variants in Lovec.
 * No instance usage.
 * ---------------------------------------- */


/* <---------- import ----------> */


/* <---------- meta ----------> */


const CLS_contentTemplate = newClass().initClass();


CLS_contentTemplate.prototype.init = function() {
  ERROR_HANDLER.throw("contentTemplateInstance");
};


/* <---------- static method ----------> */


var cls = CLS_contentTemplate;


cls.__IS_CONTENT_TEMPLATE__ = true;
cls.nm = "!UNDEF";
cls.paramObj = {
  tempParent: null,
  tempTags: [],
};
cls.paramAliasArr = [];
cls.paramParserArr = [];
cls.funObj = {};


/* ----------------------------------------
 * NOTE:
 *
 * Overwrites {paramObj} to set new fields and default values.
 * ---------------------------------------- */
cls.setParam = function(obj) {
  this.paramObj = mergeObj(this.paramObj, obj);

  return this;
};


/* ----------------------------------------
 * NOTE:
 *
 * Overwrites {paramAliasArr} to set aliases for existing fields, with default values given.
 * Format for {arr}: {nmPropNew, nmPropOld, def}
 * ---------------------------------------- */
cls.setParamAlias = function(arr) {
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


/* ----------------------------------------
 * NOTE:
 *
 * Overwrites {paramParserArr} to set parser function for some parameter, that is run when building the object.
 * {this} in the parser refers to the object built.
 * Format for {arr}: {nmProp, parser}.
 * ---------------------------------------- */
cls.setParamParser = function(arr) {
  let i = 0, iCap = arr.iCap();
  while(i < iCap) {
    this.paramParserArr.write(arr[i], arr[i + 1]);
    i += 2;
  };

  return this;
};


/* ----------------------------------------
 * NOTE:
 *
 * Sets the Java class used for {extend}.
 * ---------------------------------------- */
cls.setParent = function(javaCls) {
  this.paramObj.tempParent = javaCls;

  return this;
};


/* ----------------------------------------
 * NOTE:
 *
 * @ARGS: tag1, tag2, tag3, ...
 * Sets tags used to specify the template.
 * ---------------------------------------- */
cls.setTags = function() {
  this.paramObj.tempTags = Array.from(arguments);

  return this;
};


/* ----------------------------------------
 * NOTE:
 *
 * Overrides the method in {funObj}.
 * Uses properties of {fun}:
 * fun.noSuper: bool                @PARAM: Whether {this.super$xxx} should be skipped.
 * fun.override: bool                @PARAM: Whether to skip methods from the parent template.
 * fun.final: bool                @PARAM: Whether the method is fixed and cannot be mixed when inherited later.
 * fun.boolMode: str                @PARAM: Used for functions that return a boolean. Possible values: "none", "and", "or".
 * fun.superBoolMode: str                @PARAM: Like {boolMode} but for {super$xxx}, same as {boolMode} by default.
 * fun.mergeMode: str                @PARAM: Used for functions that return an object or array. This field can be a function for customization.
 * fun.argLen: int                @PARAM: The expected argument length of final Java method.
 * fun.funPrev: *DO NOT SET*                @PARAM: The method from parent template before mixing, for advanced use.
 * fun.funCur: *DO NOT SET*                @PARAM: The method from current template before mixing, for advanced use.
 *
 * Special method names for template customization:
 * "__PARAM_OBJ_SETTER__" - Result will be used for {setParam}.
 * "__PARAM_ALIAS_SETTER__" - Result will be used for {setParamAlias}.
 * "__PARAM_PARSER_SETTER__" - Result will be used for {setParamParser}.
 * ---------------------------------------- */
cls.setMethod = function(nmFunObj, isFromIntf) {
  const thisCls = this;

  Object._it(nmFunObj, (nm, fun) => {
    // Internal methods used in interfaces
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
      funPrev: null,
      funCur: null,
    });

    if(fun.override) {
      // Override the previous method
      fun.funPrev = thisCls.funObj[nm];
      thisCls.funObj[nm] = fun;
    } else {
      let superFun = thisCls.funObj[nm];
      if(superFun != null) {
        if((fetchSetting("test-intf-nosuper-warning") ? true : !isFromIntf) && !fun.override && superFun.noSuper && fun.noSuper !== superFun.noSuper) Log.warn("[LOVEC] [$1][$2] has mismatched {noSuper} with super method in [$3]!".format(nm.color(Pal.accent), !isFromIntf ? "" : " (from interface)", this.nm.color(Pal.accent)));
        if(!fun.override && fun.argLen >= 0 && superFun.argLen !== fun.argLen) Log.warn("[LOVEC] [$1] has mismatched argument length ([$2]) with super method in [$3]!".format(nm.color(Pal.accent), fun.argLen, this.nm.color(Pal.accent)));
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
            argLen: superFun == null ? fun.argLen : Math.max(superFun.argLen, fun.argLen),
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
        "[LOVEC] Found a ex_xxx method without {noSuper = true} in [$1]:".format(this.nm.color(Pal.accent)),
        nm,
        thisCls.funObj[nm],
        "Full object:",
        str,
      ));
    };
  });

  return this;
};


/* ----------------------------------------
 * NOTE:
 *
 * Returns the class used in {extend}.
 * ---------------------------------------- */
cls.getParent = function() {
  return this.paramObj.tempParent;
};


/* ----------------------------------------
 * NOTE:
 *
 * Returns the object used in {extend}.
 * You may need {mergeObj} for customization without a new template.
 * ---------------------------------------- */
cls.build = function(paramObj) {
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

  // Make sure the template is accessible afterwards, mostly for test
  obj.ex_getTemp = function() {
    return thisFun;
  };
  obj.ex_getTempNm = function() {
    return thisFun.nm;
  };

  return obj;
};


/* <---------- instance method ----------> */


module.exports = CLS_contentTemplate;
