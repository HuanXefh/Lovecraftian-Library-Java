/*
  ========================================
  Section: Introduction
  ========================================
*/


  /**
   * Methods related to recipe dictionary.
   * @module lovec/mdl/MDL_recipeDict
   */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- base ----------> */


  const rcDict = {
    hasInit: false,
    customFieldMap: new ObjectMap(),
    continuousCutomFields: [],
    cons: {},
    prod: {},
  };
  exports.rcDict = rcDict;


  /**
   * Registers a new custom field.
   * @param {string} name
   * @param {Object} obj
   * @param {Drawable} obj.icon
   * @param {string|unset} [obj.mod] - Mod required for this custom field.
   * @param {boolean|unset} [obj.isContinuous] - Whether consumed/produced per frame.
   * @param {boolean|unset} [obj.isStatic] - Whether irrelative to craft time.
   * @return {void}
   */
  const newCustomField = function(name, obj) {
    if(obj.mod != null && Vars.mods.locateMod(obj.mod) == null) return;

    rcDict.customFieldMap.put(name, obj);
    MDL_event._c_onLoad(() => {
      obj.icon = findRegionDrawable(obj.icon);
    });
  };
  exports.newCustomField = newCustomField;


  /**
   * <BUNDLE>: "term.common-term-rcdict-custom-<name>.name".
   * @param {string} name
   * @return {string}
   */
  const _customFieldB = function(name) {
    return MDL_bundle._term("common", "rcdict-custom-" + name);
  };
  exports._customFieldB = _customFieldB;


  /**
   * Adds an item consumption term.
   * Should be called strictly after CLIENT LOAD.
   * @param {BlockGn} blk_gn
   * @param {ItemGn} itm_gn
   * @param {number} amt
   * @param {number|unset} [p]
   * @param {RecipeDictionaryData|unset} [data]
   * @return {void}
   */
  const addItmConsTerm = function(blk_gn, itm_gn, amt, p, data) {
    if(!rcDict.hasInit) ERROR_HANDLER.throw("recipeDictionaryNotInitialized");

    let blk = MDL_content._ct(blk_gn, "blk");
    if(blk == null) return;
    let itm = MDL_content._ct(itm_gn, "rs");
    if(itm == null) return;
    if(p == null) p = 1.0;
    if(p < 0.0001) return;

    rcDict.cons.item[itm.id].push(
      blk,
      amt * p,
      tryVal(data, Object.air),
    );
  };
  exports.addItmConsTerm = addItmConsTerm;


  /**
   * Adds a fluid consumption term.
   * Should be called strictly after CLIENT LOAD.
   * @param {BlockGn} blk_gn
   * @param {LiquidGn} liq_gn
   * @param {number} amt
   * @param {RecipeDictionaryData|unset} [data]
   * @return {void}
   */
  const addFldConsTerm = function(blk_gn, liq_gn, amt, data) {
    if(!rcDict.hasInit) ERROR_HANDLER.throw("recipeDictionaryNotInitialized");

    let blk = MDL_content._ct(blk_gn, "blk");
    if(blk == null) return;
    let liq = MDL_content._ct(liq_gn, "rs");
    if(liq == null) return;

    rcDict.cons.fluid[liq.id].push(
      blk,
      amt,
      tryVal(data, Object.air),
    );
  };
  exports.addFldConsTerm = addFldConsTerm;


  /**
   * Adds a payload consumption term.
   * Should be called strictly after CLIENT LOAD.
   * @param {BlockGn} blk_gn
   * @param {string|Block|UnitType|null} ct_gn
   * @param {number} amt
   * @param {RecipeDictionaryData|unset} [data]
   * @return {void}
   */
  const addPayConsTerm = function(blk_gn, ct_gn, amt, data) {
    if(!rcDict.hasInit) ERROR_HANDLER.throw("recipeDictionaryNotInitialized");

    let blk = MDL_content._ct(blk_gn, "blk");
    if(blk == null) return;
    let ct = MDL_content._ct(ct_gn, null, true);
    if(ct == null) return;

    rcDict.cons[(ct instanceof Block ? "block" : "unit")][ct.id].push(
      blk,
      amt,
      tryVal(data, Object.air),
    );
  };
  exports.addPayConsTerm = addPayConsTerm;


  /**
   * Adds a custom consumption term.
   * Should be called strictly after CLIENT LOAD.
   * @param {BlockGn} blk_gn
   * @param {string} name
   * @param {number} amt
   * @param {RecipeDictionaryData|unset} [data]
   * @return {void}
   */
  const addCustomConsTerm = function(blk_gn, name, amt, data) {
    if(!rcDict.hasInit) ERROR_HANDLER.throw("recipeDictionaryNotInitialized");
    if(rcDict.cons[name] == null) ERROR_HANDLER.throw("recipeDictionaryCustomFieldNotFound", name);

    let blk = MDL_content._ct(blk_gn, "blk");
    if(blk == null) return;

    rcDict.cons[name].push(
      blk,
      amt,
      tryVal(data, Object.air),
    );
  };
  exports.addCustomConsTerm = addCustomConsTerm;


  /**
   * Adds an item production term.
   * Should be called strictly after CLIENT LOAD.
   * @param {BlockGn} blk_gn
   * @param {ItemGn} itm_gn
   * @param {number} amt
   * @param {number|unset} [p]
   * @param {RecipeDictionaryData|unset} [data]
   * @return {void}
   */
  const addItmProdTerm = function(blk_gn, itm_gn, amt, p, data) {
    if(!rcDict.hasInit) ERROR_HANDLER.throw("recipeDictionaryNotInitialized");

    let blk = MDL_content._ct(blk_gn, "blk");
    if(blk == null) return;
    let itm = MDL_content._ct(itm_gn, "rs");
    if(itm == null) return;
    if(p == null) p = 1.0;
    if(p < 0.0001) return;

    rcDict.prod.item[itm.id].push(
      blk,
      amt * p,
      tryVal(data, Object.air),
    );
  };
  exports.addItmProdTerm = addItmProdTerm;


  /**
   * Adds a fluid production term.
   * Should be called strictly after CLIENT LOAD.
   * @param {BlockGn} blk_gn
   * @param {LiquidGn} liq_gn
   * @param {number} amt
   * @param {RecipeDictionaryData|unset} [data]
   * @return {void}
   */
  const addFldProdTerm = function(blk_gn, liq_gn, amt, data) {
    if(!rcDict.hasInit) ERROR_HANDLER.throw("recipeDictionaryNotInitialized");

    let blk = MDL_content._ct(blk_gn, "blk");
    if(blk == null) return;
    let liq = MDL_content._ct(liq_gn, "rs");
    if(liq == null) return;

    rcDict.prod.fluid[liq.id].push(
      blk,
      amt,
      tryVal(data, Object.air),
    );
  };
  exports.addFldProdTerm = addFldProdTerm;


  /**
   * Adds a payload production term.
   * Should be called strictly after CLIENT LOAD.
   * @param {BlockGn} blk_gn
   * @param {string|Block|UnitType|null} ct_gn
   * @param {number} amt
   * @param {RecipeDictionaryData|unset} [data]
   * @return {void}
   */
  const addPayProdTerm = function(blk_gn, ct_gn, amt, data) {
    if(!rcDict.hasInit) ERROR_HANDLER.throw("recipeDictionaryNotInitialized");

    let blk = MDL_content._ct(blk_gn, "blk");
    if(blk == null) return;
    let ct = MDL_content._ct(ct_gn, null, true);
    if(ct == null) return;

    rcDict.prod[(ct instanceof Block ? "block" : "unit")][ct.id].push(
      blk,
      amt,
      tryVal(data, Object.air),
    );
  };
  exports.addPayProdTerm = addPayProdTerm;


  /**
   * Adds a custom production term.
   * Should be called strictly after CLIENT LOAD.
   * @param {BlockGn} blk_gn
   * @param {string} name
   * @param {number} amt
   * @param {RecipeDictionaryData|unset} [data]
   * @return {void}
   */
  const addCustomProdTerm = function(blk_gn, name, amt, data) {
    if(!rcDict.hasInit) ERROR_HANDLER.throw("recipeDictionaryNotInitialized");
    if(rcDict.prod[name] == null) ERROR_HANDLER.throw("recipeDictionaryCustomFieldNotFound", name);

    let blk = MDL_content._ct(blk_gn, "blk");
    if(blk == null) return;

    rcDict.prod[name].push(
      blk,
      amt,
      tryVal(data, Object.air),
    );
  };
  exports.addCustomProdTerm = addCustomProdTerm;


  /**
   * Gets consumption amount of `ct_gn` by `blk_gn`.
   * @param {ContentGn} ct_gn - Can be a custom field name.
   * @param {BlockGn} blk_gn
   * @return {number}
   */
  const _consAmt = function(ct_gn, blk_gn) {
    let val = 0.0;
    if(ct_gn == null) return val;
    let ct = rcDict.customFieldMap.containsKey(ct_gn) ?
      "!CUSTOM" :
      MDL_content._ct(ct_gn, null, true);
    let blk = MDL_content._ct(blk_gn, "blk");
    if(ct == null || blk == null) return val;

    let arr = ct === "!CUSTOM" ?
      rcDict.cons[ct_gn] :
      ct instanceof Item ?
        rcDict.cons.item[ct.id] :
        ct instanceof Liquid ?
          rcDict.cons.fluid[ct.id] :
          ct instanceof UnitType ?
            rcDict.cons.unit[ct.id] :
            rcDict.cons.block[ct.id];
    let i = 0, iCap = arr.iCap();
    while(i < iCap) {
      if(arr[i] === blk) val = Math.max(arr[i + 1], val);
      i += 3;
    };

    return val;
  }
  .setCache();
  exports._consAmt = _consAmt;


  /**
   * Variant of {@link _consAmt} for buildings.
   * @param {ContentGn} ct_gn
   * @param {Building} b
   * @return {number}
   */
  const _consAmt_b = function(ct_gn, b) {
    let ct = MDL_content._ct(ct_gn, null, true);
    return tryFun(b.ex_getConsAmt, b, _consAmt(ct, b.block), ct);
  };
  exports._consAmt_b = _consAmt_b;


  /**
   * Gets production amount of `ct_gn` by `blk_gn`.
   * @param {ContentGn} ct_gn - Can be a custom field name.
   * @param {BlockGn} blk_gn
   * @return {number}
   */
  const _prodAmt = function(ct_gn, blk_gn) {
    let val = 0.0;
    if(ct_gn == null) return val;
    let ct = rcDict.customFieldMap.containsKey(ct_gn) ?
      "!CUSTOM" :
      MDL_content._ct(ct_gn, null, true);
    let blk = MDL_content._ct(blk_gn, "blk");
    if(ct == null || blk == null) return val;

    let arr = ct === "!CUSTOM" ?
      rcDict.prod[ct_gn] :
      ct instanceof Item ?
        rcDict.prod.item[ct.id] :
        ct instanceof Liquid ?
          rcDict.prod.fluid[ct.id] :
          ct instanceof UnitType ?
            rcDict.prod.unit[ct.id] :
            rcDict.prod.block[ct.id];
    let i = 0, iCap = arr.iCap();
    while(i < iCap) {
      if(arr[i] === blk) val = Math.max(arr[i + 1], val);
      i += 3;
    };

    return val;
  }
  .setCache();
  exports._prodAmt = _prodAmt;


  /**
   * Variant of {@link _prodAmt} for buildings.
   * @param {ContentGn} ct_gn
   * @param {Building} b
   * @return {number}
   */
  const _prodAmt_b = function(ct_gn, b) {
    let ct = MDL_content._ct(ct_gn, null, true);
    return tryFun(b.ex_getProdAmt, b, _prodAmt(ct, b.block), ct);
  };
  exports._prodAmt_b = _prodAmt_b;


  /**
   * Whether `blk_gn` consumes or produces `ct_gn`.
   * @param {ContentGn} ct_gn - Can be a custom field name.
   * @param {BlockGn} blk_gn
   * @return {boolean}
   */
  const _hasIo = function(ct_gn, blk_gn) {
    return _consAmt(ct_gn, blk_gn) > 0.0 || _prodAmt(ct_gn, blk_gn) > 0.0;
  }
  .setCache();
  exports._hasIo = _hasIo;


  /**
   * Whether `blk_gn` consumes or produces anyone in `cts_gn`.
   * @param {Array<ContentGn>} cts_gn - Can include custom field names.
   * @param {BlockGn} blk_gn
   * @return {boolean}
   */
  const _hasAnyIo =  function(cts_gn, blk_gn) {
    return cts_gn.some(ct_gn => _hasIo(ct_gn, blk_gn));
  };
  exports._hasAnyIo = _hasAnyIo;


  /**
   * Whether `blk_gn` consumes or produces everyone in `cts_gn`.
   * @param {Array<ContentGn>} cts_gn - Can include custom field names.
   * @param {BlockGn} blk_gn
   * @return {boolean}
   */
  const _hasAllIo =  function(cts_gn, blk_gn) {
    return cts_gn.every(ct_gn => _hasIo(ct_gn, blk_gn));
  };
  exports._hasAllIo = _hasAllIo;


  /**
   * Finds all blocks that consume `ct_gn`.
   * @param {ContentGn} ct_gn - Can be a custom field name.
   * @param {boolean|unset} [appendData] - If true, this method will return a 3-array instead. <br> <ROW>: blk, amt, data.
   * @return {Array}
   */
  const _consumers = function(ct_gn, appendData) {
    let arr = [];

    if(ct_gn == null) return arr;
    let ct = rcDict.customFieldMap.containsKey(ct_gn) ?
      "!CUSTOM" :
      MDL_content._ct(ct_gn, null, true);
    if(ct == null) return arr;

    let arr1 = ct === "!CUSTOM" ?
      rcDict.cons[ct_gn] :
      ct instanceof Item ?
        rcDict.cons.item[ct.id] :
        ct instanceof Liquid ?
          rcDict.cons.fluid[ct.id] :
          ct instanceof UnitType ?
            rcDict.cons.unit[ct.id] :
            rcDict.cons.block[ct.id];
    let i = 0, iCap = arr1.iCap(), blk, amt, data;
    while(i < iCap) {
      blk = arr1[i];
      if(!appendData) {
        arr.push(blk);
      } else {
        amt = arr1[i + 1];
        data = arr1[i + 2];
        arr.push(blk, amt, data);
      };
      i += 3;
    };

    return arr;
  }
  .setCache();
  exports._consumers = _consumers;


  /**
   * Variant of {@link _consumers} that finds producers instead.
   * @param {ContentGn} ct_gn - Can be a custom field name.
   * @param {boolean|unset} [appendData]
   * @return {Array}
   */
  const _producers = function(ct_gn, appendData) {
    let arr = [];

    if(ct_gn == null) return arr;
    let ct = rcDict.customFieldMap.containsKey(ct_gn) ?
      "!CUSTOM" :
      MDL_content._ct(ct_gn, null, true);
    if(ct == null) return arr;

    let arr1 = ct === "!CUSTOM" ?
      rcDict.prod[ct_gn] :
      ct instanceof Item ?
        rcDict.prod.item[ct.id] :
        ct instanceof Liquid ?
          rcDict.prod.fluid[ct.id] :
          ct instanceof UnitType ?
            rcDict.prod.unit[ct.id] :
            rcDict.prod.block[ct.id];
    let i = 0, iCap = arr1.iCap(), blk, amt, data;
    while(i < iCap) {
      blk = arr1[i];
      if(!appendData) {
        arr.push(blk);
      } else {
        amt = arr1[i + 1];
        data = arr1[i + 2];
        arr.push(blk, amt, data);
      };
      i += 3;
    };

    return arr;
  }
  .setCache();
  exports._producers = _producers;


/*
  ========================================
  Section: application
  ========================================
*/


  MDL_event._c_onLoad(() => {


    // Initialize
    rcDict.cons.item = {};
    rcDict.cons.fluid = {};
    rcDict.cons.block = {};
    rcDict.cons.unit = {};
    rcDict.prod.item = {};
    rcDict.prod.fluid = {};
    rcDict.prod.block = {};
    rcDict.prod.unit = {};
    rcDict.customFieldMap.each((name, obj) => {
      rcDict.cons[name] = [];
      rcDict.prod[name] = [];
    });
    Vars.content.items().each(itm => {
      rcDict.cons.item[itm.id] = [];
      rcDict.prod.item[itm.id] = [];
    });
    Vars.content.liquids().each(liq => {
      rcDict.cons.fluid[liq.id] = [];
      rcDict.prod.fluid[liq.id] = [];
    });
    Vars.content.blocks().each(blk => blk.synthetic(), blk => {
      rcDict.cons.block[blk.id] = [];
      rcDict.prod.block[blk.id] = [];
    });
    Vars.content.units().each(utp => !utp.internal, utp => {
      rcDict.cons.unit[utp.id] = [];
      rcDict.prod.unit[utp.id] = [];
    });
    rcDict.hasInit = true;


    let arr, cls, i, iCap, dictCaller;
    Core.app.post(() => Vars.content.blocks().each(blk => {
      if(!DB_block.db["group"]["noRcDict"]["cons"].includes(blk.name)) {
        arr = DB_recipe.db["dict"]["reader"]["consume"];
        blk.consumers.forEachFast(cons => {
          if(cons.ex_setRcDict != null) {
            cons.ex_setRcDict(blk, rcDict.cons.item, rcDict.cons.fluid, rcDict.cons.block, rcDict.cons.unit);
            return;
          };

          dictCaller = null;
          i = 0;
          iCap = arr.iCap();
          while(i < iCap) {
            cls = arr[i];
            if(cls != null && cons instanceof cls) {
              dictCaller = arr[i + 1];
            };
            i += 2;
          };
          if(dictCaller != null) dictCaller(blk, cons, null, rcDict.cons.item, rcDict.cons.fluid, rcDict.cons.block, rcDict.cons.unit);
        });

        dictCaller = null;
        i = 0;
        iCap = arr.iCap();
        while(i < iCap) {
          cls = arr[i];
          if(cls != null && blk instanceof cls) {
            dictCaller = arr[i + 1];
          };
          i += 2;
        };
        if(dictCaller != null) dictCaller(blk, null, null, rcDict.cons.item, rcDict.cons.fluid, rcDict.cons.block, rcDict.cons.unit);

      };

      arr = DB_recipe.db["dict"]["reader"]["consumeSpec"];
      dictCaller = null;
      i = 0;
      iCap = arr.iCap();
      while(i < iCap) {
        if(blk.name === arr[i]) {
          dictCaller = arr[i + 1];
        };
        i += 2;
      };
      if(dictCaller != null) dictCaller(blk, null, null, rcDict.cons.item, rcDict.cons.fluid, rcDict.cons.block, rcDict.cons.unit);

      if(!DB_block.db["group"]["noRcDict"]["prod"].includes(blk.name)) {
        arr = DB_recipe.db["dict"]["reader"]["produce"];
        dictCaller = null;
        i = 0;
        iCap = arr.iCap();
        while(i < iCap) {
          cls = arr[i];
          if(cls != null && blk instanceof cls) {
            dictCaller = arr[i + 1];
          };
          i += 2;
        };
        if(dictCaller != null) dictCaller(blk, null, rcDict.prod.item, rcDict.prod.fluid, rcDict.prod.block, rcDict.prod.unit);
      };

      arr = DB_recipe.db["dict"]["reader"]["produceSpec"];
      dictCaller = null;
      i = 0;
      iCap = arr.iCap();
      while(i < iCap) {
        if(blk.name === arr[i]) {
          dictCaller = arr[i + 1];
        };
        i += 2;
      };
      if(dictCaller != null) dictCaller(blk, null, rcDict.prod.item, rcDict.prod.fluid, rcDict.prod.block, rcDict.prod.unit);

    }));



  });
