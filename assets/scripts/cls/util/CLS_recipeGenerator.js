/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- meta ----------> */


  /**
   * Utility class for automatic recipe generation.
   * See {@link TP_recipeGen} for examples.
   * @class
   * @param {function(Object, Object): void} setter - `this` here refers to the generator itself. <br> <ARGS>: rcObj, metaObj.
   */
  const CLS_recipeGenerator = newClass().initClass();


  CLS_recipeGenerator.prototype.init = function(setter) {
    this.setter = tryVal(setter, Function.air);

    this.__CATEG__ = null;
    this.__TAG__ = null;
  };


  let runCount = 0;
  let rcCount = 0;


  MDL_event._c_onLoad(() => {
    Time.run(60.0, () => {
      console.log("[LOVEC] Handled ${1} recipe generation tasks. Generated ${2} recipes in total.".format(runCount, rcCount));
    });
  });


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


  /* <------------------------------ I/O ------------------------------ */


  /**
   * Sets up single-content CI.
   * @param {ContentGn} ct_gn
   * @param {number} amtI
   * @param {Object} metaObj
   * @param {Object|unset} [paramObj]
   * @return {[string, number]} <TUP>: nmCt, amt.
   */
  CLS_recipeGenerator.prototype.processCi = function(ct_gn, amtI, metaObj, paramObj) {
    return [
      ct_gn instanceof UnlockableContent ? ct_gn.name : ct_gn,
      readParam(paramObj, "amtI", amtI * readParam(paramObj, "amtIScl", 1.0)) * 6.0 / readParam(metaObj, "time", 60.0),
    ];
  };


  /**
   * Sets up single-content BI.
   * @param {ContentGn} ct_gn
   * @param {number} amtI
   * @param {number} pI
   * @param {Object} metaObj
   * @param {Object|unset} [paramObj]
   * @return {[string, number, number]} <TUP>: nmCt, amt, p.
   */
  CLS_recipeGenerator.prototype.processBi = function(ct_gn, amtI, pI, metaObj, paramObj) {
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
   * @param {Object} metaObj
   * @param {Object|unset} [paramObj]
   * @return {[string, number]} <TUP>: nmCt, amt.
   */
  CLS_recipeGenerator.prototype.processPayi = function(ct_gn, payAmtI, metaObj, paramObj) {
    return [
      ct_gn instanceof UnlockableContent ? ct_gn.name : ct_gn,
      readParam(paramObj, "payAmtI", Math.round(payAmtI * readParam(paramObj, "amtIScl", 1.0))),
    ];
  };


  /**
   * Sets up single-content CO.
   * @param {ContentGn} ct_gn
   * @param {number} amtO
   * @param {Object} metaObj
   * @param {Object|unset} [paramObj]
   * @return {[string, number]} <TUP>: nmCt, amt.
   */
  CLS_recipeGenerator.prototype.processCo = function(ct_gn, amtO, metaObj, paramObj) {
    return [
      ct_gn instanceof UnlockableContent ? ct_gn.name : ct_gn,
      readParam(paramObj, "amtO", amtO * readParam(paramObj, "amtOScl", 1.0)) * 6.0 / readParam(metaObj, "time", 60.0),
    ];
  };


  /**
   * Sets up single-content BO.
   * @param {ContentGn} ct_gn
   * @param {number} amtO
   * @param {number} pO
   * @param {Object} metaObj
   * @param {Object|unset} [paramObj]
   * @return {[string, number, number]} <TUP>: nmCt, amt, p.
   */
  CLS_recipeGenerator.prototype.processBo = function(ct_gn, amtO, pO, metaObj, paramObj) {
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
   * @param {Object} metaObj
   * @param {Object|unset} [paramObj]
   * @return {[string, number]} <TUP>: nmCt, amt.
   */
  CLS_recipeGenerator.prototype.processPayo = function(ct_gn, payAmtO, metaObj, paramObj) {
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


  /* <------------------------------ property ------------------------------ */


  /**
   * Sets current category.
   * @param {string|unset} [categ]
   * @return {this}
   */
  CLS_recipeGenerator.prototype.setCateg = function(categ) {
    this.__CATEG__ = categ;
    return this;
  };


  /**
   * Sets current recipe tag.
   * @param {string|unset} [tag]
   * @return {this}
   */
  CLS_recipeGenerator.prototype.setTag = function(tag) {
    this.__TAG__ = tag;
    return this;
  };


  /* <------------------------------ util ------------------------------ */


  /**
   * Gets standard generated header for some recipe.
   * @param {string} nmCt
   * @return {string}
   */
  CLS_recipeGenerator.prototype.getHeaderName = function(nmCt) {
    return tryVal(this.__CATEG__, "uncategorized").toUpperCase() + ": <${1}${2}>".format(nmCt, this.__TAG__ == null ? "" : " (${1})".format(this.__TAG__));
  };


  /**
   * Adds a recipe.
   * Any recipe added by this method will be tagged as GENERATED.
   * @param {Object} rc
   * @param {string} nmCt
   * @param {(function(Object): void)|unset} [objF] - Used to further modify the recipe.
   * @param {Object|unset} [rcBuilderObj] - Expected to be built with {@link CLS_recipeBuilder}.
   * @param {Object|unset} [paramObj]
   * @return {void}
   */
  CLS_recipeGenerator.prototype.addRc = function(rc, nmCt, objF, rcBuilderObj, paramObj) {
    let rcObj = {
      icon: nmCt,
      category: this.__CATEG__,
      isGenerated: true,
    };
    if(rcBuilderObj != null) {
      Object.cloneProp(rcObj, rcBuilderObj);
    };
    if(objF != null) {
      objF(rcObj);
    };

    let tag = readParam(paramObj, "tag"), lastTag = null;
    if(tag != null) {
      lastTag = this.__TAG__;
      this.setTag(tag);
    };
    rc["recipe"].write(this.getHeaderName(nmCt), rcObj);
    if(lastTag != null) {
      this.setTag(lastTag);
    };

    rcCount++;
  };


  /**
   * Reads basic parameters from `paramObj`.
   * @param {Object} rcObj
   * @param {Object|unset} [paramObj]
   * @return {void}
   */
  CLS_recipeGenerator.prototype.setBaseParam = function(rcObj, paramObj) {
    readParamAndCall(paramObj, "tint", val => rcObj.tint = val);
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
   * Whether recipe for given content should be created.
   * @param {UnlockableContent} ct
   * @param {Object} metaObj
   * @param {Object|unset} [paramObj]
   * @return {boolean}
   */
  CLS_recipeGenerator.prototype.checkCtValid = function(ct, metaObj, paramObj) {
    return DB_misc.db["recipe"]["rcGenValidCheck"].every(boolF => boolF.apply(this, [ct, metaObj, paramObj]));
  };


  /**
   * Handles `objF` used for recipe.
   * @param {UnlockableContent} ct
   * @param {Object} metaObj
   * @param {Object} paramObj
   * @return {function(Object): void}
   */
  CLS_recipeGenerator.prototype.processObjF = function(ct, metaObj, paramObj) {
    return obj => {
      this.setBaseParam(obj, paramObj);
      DB_misc.db["recipe"]["rcGenObjF"].forEachRow(2, (boolF, objF) => {
        if(!boolF.apply(this, [ct, metaObj, paramObj])) return;
        objF.apply(this, [obj, metaObj, paramObj]);
      });
      readParam(metaObj, "objF", Function.air)(obj);
    };
  };


  /**
   * Builds final recipe object.
   * @param {UnlockableContent} ct
   * @param {Object} metaObj
   * @param {Object|unset} [paramObj]
   * @return {Object}
   */
  CLS_recipeGenerator.prototype.buildRcObj = function(ct, metaObj, paramObj) {
    let builder = new CLS_recipeBuilder;
    let
      amtI = readParam(metaObj, "amtI", readParam(metaObj, "amt", 1)),
      payAmtI = readParam(metaObj, "payAmtI", readParam(metaObj, "payAmt", 1)),
      pI = readParam(metaObj, "pI", readParam(metaObj, "p", 1.0)),
      amtO = readParam(metaObj, "amtO", readParam(metaObj, "amt", 1)),
      payAmtO = readParam(metaObj, "payAmtO", readParam(metaObj, "payAmt", 1)),
      pO = readParam(metaObj, "pO", readParam(metaObj, "p", 1.0)),
      time = readParam(metaObj, "time", 60.0);

    // No time here, which is handled in `processXxx`
    readParamAndCall(paramObj, "liqI", val => builder.__ci(this.processCi(val, amtI, metaObj, paramObj)));
    readParamAndCall(paramObj, "itmI", val => builder.__bi(this.processBi(val, amtI, pI, metaObj, paramObj)));
    readParamAndCall(paramObj, "payI", val => builder.__payi(this.processPayi(val, payAmtI, metaObj, paramObj)));
    readParamAndCall(paramObj, "liqO", val => builder.__co(this.processCo(val, amtO, metaObj, paramObj)));
    readParamAndCall(paramObj, "itmO", val => builder.__bo(this.processBo(val, amtO, pO, metaObj, paramObj)));
    readParamAndCall(paramObj, "payO", val => builder.__payo(this.processPayo(val, payAmtO, metaObj, paramObj)));

    // No time here too
    let tg;
    readParamAndCall(paramObj, "liqIMapper", val => {
      tg = val(ct);
      if(tg == null) return;
      this.processCi(tg, amtI, metaObj, paramObj);
    });
    readParamAndCall(paramObj, "itmIMapper", val => {
      tg = val(ct);
      if(tg == null) return;
      this.processBi(tg, amtI, pI, metaObj, paramObj);
    });
    readParamAndCall(paramObj, "payIMapper", val => {
      tg = val(ct);
      if(tg == null) return;
      this.processPayi(tg, payAmtI, metaObj, paramObj);
    });
    readParamAndCall(paramObj, "liqOMapper", val => {
      tg = val(ct);
      if(tg == null) return;
      this.processCo(tg, amtO, metaObj, paramObj);
    });
    readParamAndCall(paramObj, "itmOMapper", val => {
      tg = val(ct);
      printAll(val, ct);
      if(tg == null) return;
      this.processBo(tg, amtO, pO, metaObj, paramObj);
    });
    readParamAndCall(paramObj, "payOMapper", val => {
      tg = val(ct);
      if(tg == null) return;
      this.processPayo(tg, payAmtO, metaObj, paramObj);
    });

    readParamAndCall(paramObj, "ci", val => builder.__ci(this.parseRawCi(val, amtO * 6.0 / time), true));
    readParamAndCall(paramObj, "payCi", val => builder.__ci(this.parseRawCi(val, payAmtO * 6.0 / time), true));
    readParamAndCall(paramObj, "bi", val => builder.__bi(this.parseRawBi(val, amtO, pO), true));
    readParamAndCall(paramObj, "liqBi", val => builder.__bi(this.parseRawBi(val, amtO * 6.0, pO), true));
    readParamAndCall(paramObj, "payBi", val => builder.__bi(this.parseRawBi(val, payAmtO, 1.0), true));
    readParamAndCall(paramObj, "payi", val => builder.__payi(this.parseRawPayi(val, payAmtO)));
    readParamAndCall(paramObj, "co", val => builder.__co(this.parseRawCo(val, amtI * 6.0 / time), true));
    readParamAndCall(paramObj, "payCo", val => builder.__co(this.parseRawCo(val, payAmtI * 6.0 / time), true));
    readParamAndCall(paramObj, "bo", val => builder.__bo(this.parseRawBo(val, amtI, pI), true));
    readParamAndCall(paramObj, "liqBo", val => builder.__bo(this.parseRawBo(val, amtI * 6.0, pI), true));
    readParamAndCall(paramObj, "payBo", val => builder.__bo(this.parseRawBo(val, payAmtI, 1.0), true));
    readParamAndCall(paramObj, "payo", val => builder.__payo(this.parseRawPayo(val, payAmtI)));

    return builder.build();
  };


  /**
   * @param {Object|(function(UnlockableContent, Object): Object)} paramObj_d
   * @param {UnlockableContent} ct
   * @param {Object} metaObj
   * @return {Object}
   */
  function convertParamObj(paramObj_d, ct, metaObj) {
    let obj = typeof paramObj_d === "function" ?
      paramObj_d(ct, metaObj) :
      paramObj_d != null ?
        Object.assign({}, paramObj_d) :
        {};
    if(obj.hardness == null && ct instanceof Item) {
      obj.hardness = ct.hardness;
    };

    return obj;
  };


  /**
   * Generates a single recipe.
   * @param {Object} rc
   * @param {ContentGn} ct_gn
   * @param {Object} metaObj
   * @param {Object|(function(UnlockableContent, Object): Object)|unset} [paramObj_d]
   * @param {(function(UnlockableContent): string)|unset} [nmCtGetter]
   */
  CLS_recipeGenerator.prototype.handleSingle = function(rc, ct_gn, metaObj, paramObj_d, nmCtGetter) {
    if(nmCtGetter == null) nmCtGetter = ct => ct.name;

    let ct = MDL_content._ct(ct_gn, null, true);
    if(ct == null) return;
    let paramObj = convertParamObj(paramObj_d, ct, metaObj);
    if(!this.checkCtValid(ct, metaObj, paramObj)) return;

    this.addRc(
      rc, nmCtGetter(ct),
      this.processObjF(ct, metaObj, paramObj),
      this.buildRcObj(ct, metaObj, paramObj),
      paramObj,
    );
  };


  /**
   * Generates recipes based on a 2-array.
   * @param {Object} rc
   * @param {Array} arr - <ROW>: nmCt, paramObj.
   * @param {(function(ContentGn): UnlockableContent)|unset} ctMapper
   * @param {Object} metaObj
   * @param {(function(UnlockableContent): string)|unset} [nmCtGetter]
   */
  CLS_recipeGenerator.prototype.handle2Arr = function(rc, arr, ctMapper, metaObj, nmCtGetter) {
    if(ctMapper == null) ctMapper = tmpCt => MDL_content._ct(tmpCt, null, true);
    if(nmCtGetter == null) nmCtGetter = ct => ct.name;

    let ct, paramObj;
    arr.forEachRow(2, (nmCt, tmpParamObj) => {
      ct = ctMapper(nmCt);
      if(ct == null) return;
      paramObj = convertParamObj(tmpParamObj, ct, metaObj);
      if(!this.checkCtValid(ct, metaObj, paramObj)) return;

      this.addRc(
        rc, nmCtGetter(ct),
        this.processObjF(ct, metaObj, paramObj),
        this.buildRcObj(ct, metaObj, paramObj),
        paramObj,
      );
    });
  };


  /**
   * Generates recipes based on a 2-array of names and numbers.
   * @param {Object} rc
   * @param {Array} arr - <ROW>: nmCt, num.
   * @param {(function(ContentGn): UnlockableContent)|unset} ctMapper
   * @param {(function(number, Object): void)|unset} numCaller - <ARGS>: num, paramObj.
   * @param {Object} metaObj
   * @param {Object|(function(UnlockableContent, Object): Object)|unset} [paramObj_d]
   * @param {(function(UnlockableContent): string)|unset} [nmCtGetter]
   */
  CLS_recipeGenerator.prototype.handleNmNumArr = function(rc, arr, ctMapper, numCaller, metaObj, paramObj_d, nmCtGetter) {
    if(ctMapper == null) ctMapper = tmpCt => MDL_content._ct(tmpCt, null, true);
    if(numCaller == null) numCaller = Function.air;
    if(nmCtGetter == null) nmCtGetter = ct => ct.name;

    let ct, paramObj;
    arr.forEachRow(2, (nmCt, num) => {
      ct = ctMapper(nmCt);
      if(ct == null) return;
      paramObj = convertParamObj(paramObj_d, ct, metaObj);
      numCaller(num, paramObj);
      if(!this.checkCtValid(ct, metaObj, paramObj)) return;

      this.addRc(
        rc, nmCtGetter(ct),
        this.processObjF(ct, metaObj, paramObj),
        this.buildRcObj(ct, metaObj, paramObj),
        paramObj,
      );
    });
  };


  /**
   * Generates recipes based on a list of contents.
   * @param {Object} rc
   * @param {Array<ContentGn>} arr
   * @param {(function(ContentGn): UnlockableContent)|unset} ctMapper
   * @param {Object} metaObj
   * @param {Object|(function(UnlockableContent, Object): Object)|unset} [paramObj_d]
   * @param {(function(UnlockableContent): string)|unset} [nmCtGetter]
   */
  CLS_recipeGenerator.prototype.handleCtLi = function(rc, arr, ctMapper, metaObj, paramObj_d, nmCtGetter) {
    if(ctMapper == null) ctMapper = tmpCt => MDL_content._ct(tmpCt, null, true);
    if(nmCtGetter == null) nmCtGetter = ct => ct.name;

    let ct, paramObj;
    arr.forEachFast(tmpCt => {
      ct = ctMapper(tmpCt);
      if(ct == null) return;
      paramObj = convertParamObj(paramObj_d, ct, metaObj);
      if(!this.checkCtValid(ct, metaObj, paramObj)) return;

      this.addRc(
        rc, nmCtGetter(ct),
        this.processObjF(ct, metaObj, paramObj),
        this.buildRcObj(ct, metaObj, paramObj),
        paramObj,
      );
    });
  };


  /**
   * Modifies `rc` on CLIENT LOAD.
   * @param {Object} rc
   * @param {Object} metaObj
   * @return {void}
   */
  CLS_recipeGenerator.prototype.run = function(rc, metaObj) {
    MDL_event._c_onLoad(() => {
      this.setter(rc, metaObj);
    });
    runCount++;
  };




module.exports = CLS_recipeGenerator;
