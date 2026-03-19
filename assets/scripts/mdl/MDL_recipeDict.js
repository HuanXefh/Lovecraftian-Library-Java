/*
  ========================================
  Section: Introduction
  ========================================
*/


  /**
   * Methods related to recipe dictionary.
   */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- base ----------> */


  const rcDict = {
    hasInit: false,
    cons: {},
    prod: {},
  };
  exports.rcDict = rcDict;


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
   * Gets consumption amount of `ct_gn` by `blk_gn`.
   * @param {ContentGn} ct_gn
   * @param {BlockGn} blk_gn
   * @return {number}
   */
  const _consAmt = function(ct_gn, blk_gn) {
    let val = 0.0;
    let ct = MDL_content._ct(ct_gn, null, true);
    let blk = MDL_content._ct(blk_gn, "blk");
    if(ct == null || blk == null) return val;

    const arr = rcDict.cons[
      ct instanceof Item ?
        "item" :
        ct instanceof Liquid ?
          "fluid" :
          ct instanceof UnitType ?
            "unit" :
            "block"
    ][ct.id];
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
   * Gets production amount of `ct_gn` by `blk_gn`.
   * @param {ContentGn} ct_gn
   * @param {BlockGn} blk_gn
   * @return {number}
   */
  const _prodAmt = function(ct_gn, blk_gn) {
    let val = 0.0;
    let ct = MDL_content._ct(ct_gn, null, true);
    let blk = MDL_content._ct(blk_gn, "blk");
    if(ct == null || blk == null) return val;

    const arr = rcDict.prod[
      ct instanceof Item ?
        "item" :
        ct instanceof Liquid ?
          "fluid" :
          ct instanceof UnitType ?
            "unit" :
            "block"
    ][ct.id];
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
   * Whether `blk_gn` consumes or produces `ct_gn`.
   * @param {ContentGn} ct_gn
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
   * @param {Array<ContentGn>} cts_gn
   * @param {BlockGn} blk_gn
   * @return {boolean}
   */
  const _hasAnyIo =  function(cts_gn, blk_gn) {
    return cts_gn.some(ct_gn => _hasIo(ct_gn, blk_gn));
  };
  exports._hasAnyIo = _hasAnyIo;


  /**
   * Whether `blk_gn` consumes or produces everyone in `cts_gn`.
   * @param {Array<ContentGn>} cts_gn
   * @param {BlockGn} blk_gn
   * @return {boolean}
   */
  const _hasAllIo =  function(cts_gn, blk_gn) {
    return cts_gn.every(ct_gn => _hasIo(ct_gn, blk_gn));
  };
  exports._hasAllIo = _hasAllIo;


  /**
   * Finds all blocks that consume `ct_gn`.
   * @param {ContentGn} ct_gn
   * @param {boolean|unset} [appendData] - If true, this method will return a 3-array instead. <br> <ROW>: blk, amt, data.
   * @return {Array}
   */
  const _consumers = function(ct_gn, appendData) {
    const arr = [];

    let ct = MDL_content._ct(ct_gn, null, true);
    if(ct == null) return arr;

    const arr1 = rcDict.cons[
      ct instanceof Item ?
        "item" :
        ct instanceof Liquid ?
          "fluid" :
          ct instanceof UnitType ?
            "unit" :
            "block"
    ][ct.id];
    let i = 0, iCap = arr1.iCap();
    while(i < iCap) {
      let blk = arr1[i];
      if(!appendData) {
        arr.push(blk);
      } else {
        let amt = arr1[i + 1];
        let data = arr1[i + 2];
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
   * @param {ContentGn} ct_gn
   * @param {boolean|unset} [appendData]
   * @return {Array}
   */
  const _producers = function(ct_gn, appendData) {
    const arr = [];

    let ct = MDL_content._ct(ct_gn, null, true);
    if(ct == null) return arr;

    const arr1 = rcDict.prod[
      ct instanceof Item ?
        "item" :
        ct instanceof Liquid ?
          "fluid" :
          ct instanceof UnitType ?
            "unit" :
            "block"
    ][ct.id];
    let i = 0, iCap = arr1.iCap();
    while(i < iCap) {
      let blk = arr1[i];
      if(!appendData) {
        arr.push(blk);
      } else {
        let amt = arr1[i + 1];
        let data = arr1[i + 2];
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


    Core.app.post(() => Vars.content.blocks().each(blk => {
      let arr, cls, i, iCap;

      if(!DB_block.db["group"]["noRcDict"]["cons"].includes(blk.name)) {
        arr = DB_misc.db["recipe"]["consumeReader"];
        blk.consumers.forEachFast(cons => {
          if(cons.ex_setRcDict != null) {
            cons.ex_setRcDict(blk, rcDict.cons.item, rcDict.cons.fluid, rcDict.cons.block, rcDict.cons.unit);
            return;
          };

          let dictCaller = null;
          i = 0;
          iCap = arr.iCap();
          while(i < iCap) {
            cls = arr[i];
            if(cons instanceof cls) {
              dictCaller = arr[i + 1];
            };
            i += 2;
          };
          if(dictCaller != null) dictCaller(blk, cons, rcDict.cons.item, rcDict.cons.fluid, rcDict.cons.block, rcDict.cons.unit);
        });

        let dictCaller = null;
        i = 0;
        iCap = arr.iCap();
        while(i < iCap) {
          cls = arr[i];
          if(blk instanceof cls) {
            dictCaller = arr[i + 1];
          };
          i += 2;
        };
        if(dictCaller != null) dictCaller(blk, null, rcDict.cons.item, rcDict.cons.fluid, rcDict.cons.block, rcDict.cons.unit);
      };

      if(!DB_block.db["group"]["noRcDict"]["prod"].includes(blk.name)) {
        arr = DB_misc.db["recipe"]["produceReader"];
        let dictCaller = null;
        i = 0;
        iCap = arr.iCap();
        while(i < iCap) {
          cls = arr[i];
          if(blk instanceof cls) {
            dictCaller = arr[i + 1];
          };
          i += 2;
        };
        if(dictCaller != null) dictCaller(blk, rcDict.prod.item, rcDict.prod.fluid, rcDict.prod.block, rcDict.prod.unit);
      };

    }));



  }, 49527117);
