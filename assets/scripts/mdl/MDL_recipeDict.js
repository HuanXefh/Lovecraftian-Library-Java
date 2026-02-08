/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * Methods related to recipe dictionary.
   * ---------------------------------------- */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const MDL_content = require("lovec/mdl/MDL_content");
  const MDL_event = require("lovec/mdl/MDL_event");


  const DB_block = require("lovec/db/DB_block");
  const DB_misc = require("lovec/db/DB_misc");


  /* <---------- base ----------> */


  const rcDict = {
    hasInit: false,
    cons: {},
    prod: {},
  };
  exports.rcDict = rcDict;


  /* ----------------------------------------
   * NOTE:
   *
   * Possible fields for {data} used in recipe dictionary terms:
   * icon: str                @PARAM: Arbitrary texture region used.
   * ct: str                @PARAM: Content button used.
   * time: f                @PARAM: Craft time used.
   * ---------------------------------------- */


  /* ----------------------------------------
   * NOTE:
   *
   * Adds an item consumption term to recipe dictionary.
   * ---------------------------------------- */
  const addItmConsTerm = function(blk_gn, itm_gn, amt, p, data) {
    if(!rcDict.hasInit) ERROR_HANDLER.throw("recipeDictionaryNotInitialized");

    let blk = MDL_content._ct(blk_gn, "blk");
    if(blk == null) return;
    let itm = MDL_content._ct(itm_gn, "rs");
    if(itm == null) return;
    if(amt == null) amt = 0;
    if(amt < 1) return;
    if(p == null) p = 1.0;
    if(p < 0.0001) return;

    rcDict.cons.item[itm.id].push(
      blk,
      amt * p,
      tryVal(data, Object.air),
    );
  };
  exports.addItmConsTerm = addItmConsTerm;


  /* ----------------------------------------
   * NOTE:
   *
   * Adds a fluid consumption term to recipe dictionary.
   * ---------------------------------------- */
  const addFldConsTerm = function(blk_gn, liq_gn, amt, data) {
    if(!rcDict.hasInit) ERROR_HANDLER.throw("recipeDictionaryNotInitialized");

    let blk = MDL_content._ct(blk_gn, "blk");
    if(blk == null) return;
    let liq = MDL_content._ct(liq_gn, "rs");
    if(liq == null) return;
    if(amt == null) amt = 0.0;
    if(amt < 0.0001) return;

    rcDict.cons.fluid[liq.id].push(
      blk,
      amt,
      tryVal(data, Object.air),
    );
  };
  exports.addFldConsTerm = addFldConsTerm;


  /* ----------------------------------------
   * NOTE:
   *
   * Adds a payload consumption term to recipe dictionary.
   * ---------------------------------------- */
  const addPayConsTerm = function(blk_gn, ct_gn, amt, data) {
    if(!rcDict.hasInit) ERROR_HANDLER.throw("recipeDictionaryNotInitialized");

    let blk = MDL_content._ct(blk_gn, "blk");
    if(blk == null) return;
    let ct = MDL_content._ct(ct_gn, null, true);
    if(ct == null) return;
    if(amt == null) amt = 0;
    if(amt < 0.0001) return;

    rcDict.cons[(ct instanceof Block ? "block" : "unit")][ct.id].push(
      blk,
      amt,
      tryVal(data, Object.air),
    );
  };
  exports.addPayConsTerm = addPayConsTerm;


  /* ----------------------------------------
   * NOTE:
   *
   * Adds an item production term to recipe dictionary.
   * ---------------------------------------- */
  const addItmProdTerm = function(blk_gn, itm_gn, amt, p, data) {
    if(!rcDict.hasInit) ERROR_HANDLER.throw("recipeDictionaryNotInitialized");

    let blk = MDL_content._ct(blk_gn, "blk");
    if(blk == null) return;
    let itm = MDL_content._ct(itm_gn, "rs");
    if(itm == null) return;
    if(amt == null) amt = 0;
    if(amt < 1) return;
    if(p == null) p = 1.0;
    if(p < 0.0001) return;

    rcDict.prod.item[itm.id].push(
      blk,
      amt * p,
      tryVal(data, Object.air),
    );
  };
  exports.addItmProdTerm = addItmProdTerm;


  /* ----------------------------------------
   * NOTE:
   *
   * Adds a fluid production term to recipe dictionary.
   * ---------------------------------------- */
  const addFldProdTerm = function(blk_gn, liq_gn, amt, data) {
    if(!rcDict.hasInit) ERROR_HANDLER.throw("recipeDictionaryNotInitialized");

    let blk = MDL_content._ct(blk_gn, "blk");
    if(blk == null) return;
    let liq = MDL_content._ct(liq_gn, "rs");
    if(liq == null) return;
    if(amt == null) amt = 0.0;
    if(amt < 0.0001) return;

    rcDict.prod.fluid[liq.id].push(
      blk,
      amt,
      tryVal(data, Object.air),
    );
  };
  exports.addFldProdTerm = addFldProdTerm;


  /* ----------------------------------------
   * NOTE:
   *
   * Adds a payload production term to recipe dictionary.
   * ---------------------------------------- */
  const addPayProdTerm = function(blk_gn, ct_gn, amt, data) {
    if(!rcDict.hasInit) ERROR_HANDLER.throw("recipeDictionaryNotInitialized");

    let blk = MDL_content._ct(blk_gn, "blk");
    if(blk == null) return;
    let ct = MDL_content._ct(ct_gn, null, true);
    if(ct == null) return;
    if(amt == null) amt = 0;
    if(amt < 0.0001) return;

    rcDict.prod[(ct instanceof Block ? "block" : "unit")][ct.id].push(
      blk,
      amt,
      tryVal(data, Object.air),
    );
  };
  exports.addPayProdTerm = addPayProdTerm;


  /* ----------------------------------------
   * NOTE:
   *
   * Gets consumption amount of {ct_gn} by {blk_gn}.
   * ---------------------------------------- */
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


  /* ----------------------------------------
   * NOTE:
   *
   * Gets production amount of {ct_gn} by {blk_gn}.
   * ---------------------------------------- */
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


  /* ----------------------------------------
   * NOTE:
   *
   * Whether {ct_gn} exists in {blk_gn}'s I/O entries.'
   * ---------------------------------------- */
  const _hasIo = function(ct_gn, blk_gn) {
    return _consAmt(ct_gn, blk_gn) > 0.0 || _prodAmt(ct_gn, blk_gn) > 0.0;
  }
  .setCache();
  exports._hasIo = _hasIo;


  /* ----------------------------------------
   * NOTE:
   *
   * Whether anyone in {cts_gn} exists in {blk_gn}'s I/O entries.'
   * ---------------------------------------- */
  const _hasAnyIo =  function(cts_gn, blk_gn) {
    return cts_gn.some(ct_gn => _hasIo(ct_gn, blk_gn));
  };
  exports._hasAnyIo = _hasAnyIo;


  /* ----------------------------------------
   * NOTE:
   *
   * Whether everyone in {cts_gn} exists in {blk_gn}'s I/O entries.'
   * ---------------------------------------- */
  const _hasAllIo =  function(cts_gn, blk_gn) {
    return cts_gn.every(ct_gn => _hasIo(ct_gn, blk_gn));
  };
  exports._hasAllIo = _hasAllIo;


  /* ----------------------------------------
   * NOTE:
   *
   * Returns an array or 3-array of all blocks that consume the content.
   * ---------------------------------------- */
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


  /* ----------------------------------------
   * NOTE:
   *
   * Returns an array or 3-array of all blocks that produce the content.
   * ---------------------------------------- */
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


    /* ----------------------------------------
     * NOTE:
     *
     * Reads consumers and output lists of blocks to build the recipe dictionary.
     * Methods used for each block class are defined in {DB_misc.db["recipe"]}.
     * This only works for Java mods, since JS mods don't create classes.
     * ----------------------------------------
     * IMPORTANT:
     *
     * Use {Core.app.post} or {Time.run} for methods that modify recipe dictionary, after CLIENT LOAD.
     * ---------------------------------------- */
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
          i = 0, iCap = arr.iCap();
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
        i = 0, iCap = arr.iCap();
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
        i = 0, iCap = arr.iCap();
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
