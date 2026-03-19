/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- meta ----------> */


  /**
   * Utility class for automatic recipe generation.
   * @class
   * @param {function(Object, Object): void} setter - `this` here refers to the generator itself. <br> <ARGS>: rcObj, paramObj.
   */
  const CLS_recipeGenerator = newClass().initClass();


  CLS_recipeGenerator.prototype.init = function(setter) {
    this.setter = tryVal(setter, Function.air);
  };


/*
  ========================================
  Section: Definition (Static)
  ========================================
*/


/*
  ========================================
  Section: Definition (Instance)
  ========================================
*/


  /* <------------------------------ util ------------------------------ */


  /**
   * Gets standard generated header for some recipe.
   * @param {string} nmCt
   * @param {string|unset} [categ]
   * @param {string|unset} [tag]
   * @return {string}
   * @example
   * rcGen.getHeaderName("copper")                // Returns "UNCATEGORIZED: copper"
   * rcGen.getHeaderName("lead", "smelting", "early game");                // Returns "SMELTING: lead (early game)"
   */
  CLS_recipeGenerator.prototype.getHeaderName = function(nmCt, categ, tag) {
    return tryVal(categ, "uncategorized").toUpperCase() + ": <${1}${2}>".format(nmCt, tag == null ? "" : " (${1})".format(tag));
  };


  /**
   * Adds a recipe.
   * Any recipe added by this method will be tagged as GENERATED.
   * @param {Object} rc
   * @param {string} nmCt
   * @param {string|unset} [categ]
   * @param {string|unset} [tag]
   * @param {(function(Object): void)|unset} [objF] - Used to further modify the recipe.
   * @param {Object|unset} [rcBuilderObj] - Expected to be built with {@link CLS_recipeBuilder}.
   * @return {void}
   */
  CLS_recipeGenerator.prototype.addRc = function(rc, nmCt, categ, tag, objF, rcBuilderObj) {
    let rcObj = {
      icon: nmCt,
      category: categ,
      isGenerated: true,
    };
    if(rcBuilderObj != null) {
      Object.cloneProp(rcObj, rcBuilderObj);
    };
    if(objF != null) {
      objF(rcObj);
    };

    rc["recipe"].write(this.getHeaderName(nmCt, categ, tag), rcObj);
  };


  /**
   * Reads basic parameters from `paramObj`.
   * @param {Object} rcObj
   * @param {Object|unset} [paramObj]
   * @return {void}
   */
  CLS_recipeGenerator.prototype.setBaseParam = function(rcObj, paramObj) {
    readParamAndCall(paramObj, "validGetter", val => rcObj.validGetter = val);
    readParamAndCall(paramObj, "lockedBy", val => rcObj.lockedBy = val);
    readParamAndCall(paramObj, "timeScl", val => rcObj.timeScl = val);
    readParamAndCall(paramObj, "pollution", val => rcObj.pollution = val);
    readParamAndCall(paramObj, "ignoreItemFullness", val => rcObj.ignoreItemFullness = val);
    readParamAndCall(paramObj, "attr", val => rcObj.attr = val);
    readParamAndCall(paramObj, "attrMin", val => rcObj.attrMin = val);
    readParamAndCall(paramObj, "attrMax", val => rcObj.attrMax = val);
    readParamAndCall(paramObj, "attrBoostScl", val => rcObj.attrBoostScl = val);
    readParamAndCall(paramObj, "attrBoostCap", val => rcObj.attrBoostCap = val);
    readParamAndCall(paramObj, "tooltip", val => rcObj.tooltip = val);
    readParamAndCall(paramObj, "tempReq", val => rcObj.tempReq = val);
    readParamAndCall(paramObj, "tempAllowed", val => rcObj.tempAllowed = val);
  };


  /**
   * Sets up single-content CI.
   * @param {ContentGn} ct_gn
   * @param {number} amtI
   * @param {Object|unset} [paramObj]
   * @return {[string, number]} <TUP>: nmCt, amt.
   */
  CLS_recipeGenerator.prototype.processCi = function(ct_gn, amtI, paramObj) {
    return [
      ct_gn instanceof UnlockableContent ? ct_gn.name : ct_gn,
      readParam(paramObj, "amtI", amtI * readParam(paramObj, "amtIScl", 1.0)),
    ];
  };


  /**
   * Sets up single-content BI.
   * @param {ContentGn} ct_gn
   * @param {number} amtI
   * @param {number} pI
   * @param {Object|unset} [paramObj]
   * @return {[string, number, number]} <TUP>: nmCt, amt, p.
   */
  CLS_recipeGenerator.prototype.processBi = function(ct_gn, amtI, pI, paramObj) {
    return [
      ct_gn instanceof UnlockableContent ? ct_gn.name : ct_gn,
      readParam(paramObj, "amtI", Math.round(amtI * readParam(paramObj, "amtIScl", 1.0))),
      pI,
    ];
  };


  /**
   * Sets up single-content PAYI.
   * @param {ContentGn} ct_gn
   * @param {number} payAmtI
   * @param {Object|unset} [paramObj]
   * @return {[string, number]} <TUP>: nmCt, amt.
   */
  CLS_recipeGenerator.prototype.processPayi = function(ct_gn, payAmtI, paramObj) {
    return [
      ct_gn instanceof UnlockableContent ? ct_gn.name : ct_gn,
      readParam(paramObj, "payAmtI", Math.round(payAmtI * readParam(paramObj, "amtIScl", 1.0))),
    ];
  };


  /**
   * Sets up single-content CO.
   * @param {ContentGn} ct_gn
   * @param {number} amtO
   * @param {Object|unset} [paramObj]
   * @return {[string, number]} <TUP>: nmCt, amt.
   */
  CLS_recipeGenerator.prototype.processCo = function(ct_gn, amtO, paramObj) {
    return [
      ct_gn instanceof UnlockableContent ? ct_gn.name : ct_gn,
      readParam(paramObj, "amtO", amtO * readParam(paramObj, "amtOScl", 1.0)),
    ];
  };


  /**
   * Sets up single-content BO.
   * @param {ContentGn} ct_gn
   * @param {number} amtO
   * @param {number} pO
   * @param {Object|unset} [paramObj]
   * @return {[string, number, number]} <TUP>: nmCt, amt, p.
   */
  CLS_recipeGenerator.prototype.processBo = function(ct_gn, amtO, pO, paramObj) {
    return [
      ct_gn instanceof UnlockableContent ? ct_gn.name : ct_gn,
      readParam(paramObj, "amtO", Math.round(amtO * readParam(paramObj, "amtOScl", 1.0))),
      pO,
    ];
  };


  /**
   * Sets up single-content PAYI.
   * @param {ContentGn} ct_gn
   * @param {number} payAmtO
   * @param {Object|unset} [paramObj]
   * @return {[string, number]} <TUP>: nmCt, amt.
   */
  CLS_recipeGenerator.prototype.processPayo = function(ct_gn, payAmtO, paramObj) {
    return [
      ct_gn instanceof UnlockableContent ? ct_gn.name : ct_gn,
      readParam(paramObj, "payAmtO", Math.round(payAmtO * readParam(paramObj, "amtOScl", 1.0))),
    ];
  };


  /**
   * Parses raw IO array.
   * @param {Array} raw
   * @param {number} baseAmt
   * @param {boolean|unset} [isContinuous]
   * @return {Array}
   */
  CLS_recipeGenerator.prototype.parseRawIo = function thisFun(raw, baseAmt, isContinuous) {
    const arr = [];

    let tmpArr = raw.cpy();
    thisFun.convertFrac.apply(this, [tmpArr, baseAmt, isContinuous]);
    tmpArr.forEachRow(isContinuous ? 2 : 3, (tg, amt, p) => {
      MDL_recipe.parseRcIoRow(arr, tg, amt, isContinuous ? null : p, null);
    });
    arr.forEachAll((ele, ind, arr1) => {
      if(ele instanceof UnlockableContent) arr1[ind] = ele.name;
    });

    return arr;
  }
  .setProp({
    convertFrac: function(arr, baseAmt, isContinuous) {
      let i = 0, iCap = arr.iCap();
      while(i < iCap) {
        if(arr[i] instanceof Array) {
          this.parseRawIo.convertFrac(arr[i], baseAmt, isContinuous);
        } else {
          arr[i + 1] = isContinuous ?
            (baseAmt * arr[i + 1]) :
            Math.round(baseAmt * arr[i + 1] * (1.0 / arr[i + 2]));
        };
        i += isContinuous ? 2 : 3;
      };
    },
  });


  /**
   * Parses raw CI array.
   * @param {Array} rawCi
   * @param {number} amtO
   * @return {Array}
   */
  CLS_recipeGenerator.prototype.parseRawCi = function(rawCi, amtO) {
    return this.parseRawIo(rawCi, amtO, true);
  };


  /**
   * Parses raw BI array.
   * @param {Array} rawBi
   * @param {number} amtO
   * @param {number} pO
   * @return {Array}
   */
  CLS_recipeGenerator.prototype.parseRawBi = function(rawBi, amtO, pO) {
    return this.parseRawIo(rawBi, amtO * pO, false);
  };


  /**
   * Parses raw CI array.
   * @param {Array} rawPayi
   * @param {number} payAmtO
   * @return {Array}
   */
  CLS_recipeGenerator.prototype.parseRawPayi = function(rawPayi, payAmtO) {
    return this.parseRawIo(rawPayi, payAmtO, true);
  };


  /**
   * Parses raw CO array.
   * @param {Array} rawCo
   * @param {number} amtI
   * @return {Array}
   */
  CLS_recipeGenerator.prototype.parseRawCo = function(rawCo, amtI) {
    return this.parseRawIo(rawCo, amtI, true);
  };


  /**
   * Parses raw BO array.
   * @param {Array} rawBo
   * @param {number} amtI
   * @param {number} pI
   * @return {Array}
   */
  CLS_recipeGenerator.prototype.parseRawBo = function(rawBo, amtI, pI) {
    return this.parseRawIo(rawBo, amtI * pI, false);
  };


  /**
   * Parses raw PAYO array.
   * @param {Array} rawPayo
   * @param {number} payAmtI
   * @return {Array}
   */
  CLS_recipeGenerator.prototype.parseRawPayo = function(rawPayo, payAmtI) {
    return this.parseRawIo(rawPayo, payAmtI, true);
  };


  /**
   * Modifies `rc` on CLIENT LOAD.
   * @param {Object} rc
   * @param {Object|unset} [paramObj]
   * @return {void}
   */
  CLS_recipeGenerator.prototype.run = function(rc, paramObj) {
    MDL_event._c_onLoad(() => {
      this.setter(rc, paramObj);
    });
  };




module.exports = CLS_recipeGenerator;
