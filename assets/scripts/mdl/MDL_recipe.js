/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * The bedrock for multi-crafters.
   * ---------------------------------------- */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const FRAG_recipe = require("lovec/frag/FRAG_recipe");


  const MDL_attr = require("lovec/mdl/MDL_attr");
  const MDL_bundle = require("lovec/mdl/MDL_bundle");
  const MDL_content = require("lovec/mdl/MDL_content");
  const MDL_recipeDict = require("lovec/mdl/MDL_recipeDict");
  const MDL_text = require("lovec/mdl/MDL_text");


  const DB_item = require("lovec/db/DB_item");


  /* <---------- base ----------> */


  /* ----------------------------------------
   * NOTE:
   *
   * Returns the recipe module for a block.
   * Use this in {CT_BLK_recipeFactory} or something alike.
   * You should NEVER call this after the game is loaded. {require} finds nothing then.
   * ---------------------------------------- */
  const _rcMdl = function(nmMod, nmBlk) {
    let rcMdl;
    try {
      rcMdl = require(nmMod + "/auxFi/rc/" + nmBlk);
    } catch(err) {
      throw new Error("Failed to load recipe for " + nmMod + "-" + nmBlk + ":\n" + err);
    };

    return rcMdl;
  };
  exports._rcMdl = _rcMdl;


  /* ----------------------------------------
   * NOTE:
   *
   * Fetches the base object in {rcMdl}.
   * Returns an empty object if errored.
   * ---------------------------------------- */
  const _rcBase = function(rcMdl) {
    return rcMdl == null ?
      Object.air :
      tryVal(rcMdl.rc["base"], Object.air);
  };
  exports._rcBase = _rcBase;


  /* ----------------------------------------
   * NOTE:
   *
   * Fetches a key value in the recipe base.
   * ---------------------------------------- */
  const _rcBaseVal = function(rcMdl, key, def) {
    return tryVal(_rcBase(rcMdl)[key], def);
  };
  exports._rcBaseVal= _rcBaseVal;


  /* ----------------------------------------
   * NOTE:
   *
   * Fetches the recipe array in {rcMdl}.
   * Returns an empty array if errored.
   * ---------------------------------------- */
  const _rcLi = function(rcMdl) {
    return rcMdl == null ?
      Array.air :
      tryVal(rcMdl.rc["recipe"], Array.air);
  };
  exports._rcLi = _rcLi;


  /* ----------------------------------------
   * NOTE:
   *
   * Returns the amount of recipe objects.
   * ---------------------------------------- */
  const _rcSize = function(rcMdl) {
    return _rcLi(rcMdl).iCap() / 2;
  };
  exports._rcSize = _rcSize;


  /* ----------------------------------------
   * NOTE:
   *
   * Fetches an recipe object in {rcMdl}, with the header string matching {rcHeader}.
   * Returns {null} if no object is found.
   * ---------------------------------------- */
  const _rcObj = function(rcMdl, rcHeader) {
    return _rcLi(rcMdl).read(rcHeader);
  };
  exports._rcObj = _rcObj;


  /* ----------------------------------------
   * NOTE:
   *
   * Returns an array of headers found in {rcMdl}.
   * ---------------------------------------- */
  const _rcHeaders = function(rcMdl) {
    return _rcLi(rcMdl).readCol(2, 0);
  };
  exports._rcHeaders = _rcHeaders;


  /* ----------------------------------------
   * NOTE:
   *
   * Returns an array of recipe objects found in {rcMdl}.
   * ---------------------------------------- */
  const _rcObjs = function(rcMdl) {
    return _rcLi(rcMdl).readCol(2, 1);
  };
  exports._rcObjs = _rcObjs;


  /* ----------------------------------------
   * NOTE:
   *
   * Whether the header exists in {rcMdl}.
   * ---------------------------------------- */
  const _hasHeader = function(rcMdl, rcHeader) {
    let rcLi = _rcLi(rcMdl), tmpHeader;
    let i = 0, iCap = rcLi.iCap();
    while(i < iCap) {
      tmpHeader = rcLi[i];
      if(tmpHeader === rcHeader) return true;
      i += 2;
    };

    return false;
  };
  exports._hasHeader = _hasHeader;


  const _firstHeader = function(rcMdl) {
    return tryVal(_rcLi(rcMdl)[0], "");
  };
  exports._firstHeader = _firstHeader;


  /* ----------------------------------------
   * NOTE:
   *
   * Fetches a key value in the matching recipe object.
   * ---------------------------------------- */
  const _rcVal = function(rcMdl, rcHeader, key, def) {
    let rcObj = _rcObj(rcMdl, rcHeader);
    return rcObj == null ?
      def :
      tryVal(rcObj[key], def);
  };
  exports._rcVal = _rcVal;


  /* ----------------------------------------
   * NOTE:
   *
   * Whether there is some resource input in a recipe module.
   * ---------------------------------------- */
  const _hasInput = function thisFun(rs_gn, rcMdl) {
    let ci, bi, aux, opt;
    return _rcHeaders(rcMdl).some(rcHeader => {
      ci = _ci(rcMdl, rcHeader, thisFun.tmpArr);
      bi = _bi(rcMdl, rcHeader, thisFun.tmpArr1);
      aux = _aux(rcMdl, rcHeader, thisFun.tmpArr2);
      opt = _opt(rcMdl, rcHeader, thisFun.tmpArr3);

      return FRAG_recipe._hasInput(rs_gn, ci, bi, aux, opt);
    });
  }
  .setProp({
    tmpArr: [],
    tmpArr1: [],
    tmpArr2: [],
    tmpArr3: [],
  });
  exports._hasInput = _hasInput;


  /* ----------------------------------------
   * NOTE:
   *
   * Whether there is any payload input in a recipe module.
   * ---------------------------------------- */
  const _hasAnyInput_pay = function thisFun(rcMdl) {
    let payi;
    return _rcHeaders(rcMdl).some(rcHeader => {
      payi = _payi(rcMdl, rcHeader, thisFun.tmpArr);

      return FRAG_recipe._hasInput_pay(payi);
    });
  }
  .setProp({
    tmpArr: [],
  });
  exports._hasAnyInput_pay = _hasAnyInput_pay;


  /* ----------------------------------------
   * NOTE:
   *
   * Whether there is some resource output in a recipe module.
   * ---------------------------------------- */
  const _hasOutput = function thisFun(rs_gn, rcMdl) {
    let co, bo, fo;
    return _rcHeaders(rcMdl).some(rcHeader => {
      co = _co(rcMdl, rcHeader, thisFun.tmpArr);
      bo = _bo(rcMdl, rcHeader, thisFun.tmpArr1);
      fo = _fo(rcMdl, rcHeader, thisFun.tmpArr2);

      return FRAG_recipe._hasOutput(rs_gn, co, bo, fo);
    });
  }
  .setProp({
    tmpArr: [],
    tmpArr1: [],
    tmpArr2: [],
  });
  exports._hasOutput = _hasOutput;


  /* ----------------------------------------
   * NOTE:
   *
   * Whether there's any item output in the recipe module.
   * ---------------------------------------- */
  const _hasAnyOutput_itm = function thisFun(rcMdl) {
    let bo, fo;
    return _rcHeaders(rcMdl).some(rcHeader => {
      bo = _bo(rcMdl, rcHeader, thisFun.tmpArr);
      fo = _fo(rcMdl, rcHeader, thisFun.tmpArr1);

      return FRAG_recipe._hasOutput_itm(bo, fo);
    });
  }
  .setProp({
    tmpArr: [],
    tmpArr1: [],
  });
  exports._hasAnyOutput_itm = _hasAnyOutput_itm;


  /* ----------------------------------------
   * NOTE:
   *
   * Whether there's any fluid output in the recipe module.
   * ---------------------------------------- */
  const _hasAnyOutput_liq = function thisFun(rcMdl, includeAux) {
    let co, bo;
    return _rcHeaders(rcMdl).some(rcHeader => {
      co = _co(rcMdl, rcHeader, thisFun.tmpArr);
      bo = _bo(rcMdl, rcHeader, thisFun.tmpArr1);

      return FRAG_recipe._hasOutput_liq(includeAux, co, bo);
    });
  }
  .setProp({
    tmpArr: [],
    tmpArr1: [],
  });
  exports._hasAnyOutput_liq = _hasAnyOutput_liq;


  /* ----------------------------------------
   * NOTE:
   *
   * Whether there is any payload output in a recipe module.
   * ---------------------------------------- */
  const _hasAnyOutput_pay = function thisFun(rcMdl) {
    let payo;
    return _rcHeaders(rcMdl).some(rcHeader => {
      payo = _payo(rcMdl, rcHeader, thisFun.tmpArr);

      return FRAG_recipe._hasOutput_pay(payo);
    });
  }
  .setProp({
    tmpArr: [],
  });
  exports._hasAnyOutput_pay = _hasAnyOutput_pay;


  /* <---------- recipe fields ----------> */


  /* ----------------------------------------
   * NOTE:
   *
   * Gets the icon string.
   * ---------------------------------------- */
  const _iconNm = function(rcMdl, rcHeader) {
    return _rcVal(rcMdl, rcHeader, "icon", "null");
  };
  exports._iconNm = _iconNm;


  /* ----------------------------------------
   * NOTE:
   *
   * Gets the icon for a recipe.
   * By default it should be the {uiIcon} of a content, use {notContent} to get something else.
   * ---------------------------------------- */
  const _icon = function(rcMdl, rcHeader, notContent) {
    let iconNm = _iconNm(rcMdl, rcHeader);
    if(notContent) return new TextureRegionDrawable(Core.atlas.find(iconNm));
    let ct = MDL_content._ct(iconNm, null, true);

    return ct == null ?
      Icon.cancel :
      new TextureRegionDrawable(ct.uiIcon);
  };
  exports._icon = _icon;


  /* ----------------------------------------
   * NOTE:
   *
   * Gets the category of a recipe.
   * Recipes in the same category will be displayed together.
   * If not set, {"uncategorized"} is used.
   * ---------------------------------------- */
  const _categ = function(rcMdl, rcHeader) {
    return _rcVal(rcMdl, rcHeader, "category", "uncategorized");
  };
  exports._categ = _categ;


  /* ----------------------------------------
   * NOTE:
   *
   * Returns an array of all found categories in {rcMdl}.
   * {"uncategorized"} will always appear at the end.
   * ---------------------------------------- */
  const _categs = function(rcMdl) {
    const arr = [];

    let rcLi = _rcLi(rcMdl);
    let i = 0, iCap = rcLi.iCap();
    while(i < iCap) {
      let categ = rcLi[i + 1]["category"];
      if(categ != null && !arr.includes(categ)) arr.push(categ);
      i += 2;
    };

    // Make "uncategorized" appear at the last
    if(arr.includes("uncategorized")) {
      arr.pull("uncategorized");
      arr.push("uncategorized");
    };

    return arr;
  };
  exports._categs = _categs;


  /* ----------------------------------------
   * NOTE:
   *
   * Returns an object of categories and their recipe headers.
   * ---------------------------------------- */
  const _categHeaderObj = function(rcMdl) {
    const obj = {};

    let rcHeaders = _rcHeaders(rcMdl);
    _categs(rcMdl).forEachFast(categ => {
      obj[categ] = [];
      rcHeaders.forEachFast(rcHeader => {
        if(_categ(rcMdl, rcHeader) === categ) obj[categ].push(rcHeader);
      });
    });

    return obj;
  };
  exports._categHeaderObj = _categHeaderObj;


  /* ----------------------------------------
   * NOTE:
   *
   * Gets the name of a category from the bundle.
   * Format: {term.common-term-categ-*category name*.name}.
   * ---------------------------------------- */
  const _categB = function(categ) {
    return MDL_bundle._term("common", "categ-" + categ);
  };
  exports._categB = _categB;


  /* ----------------------------------------
   * NOTE:
   *
   * Whether the recipe is generated instead of manually set.
   * You shouldn't touch this field.
   * ---------------------------------------- */
  const _isGen = function(rcMdl, rcHeader) {
    return _rcVal(rcMdl, rcHeader, "isGenerated", false);
  };
  exports._isGen = _isGen;


  /* ----------------------------------------
   * NOTE:
   *
   * A function to check whether the recipe is allowed now.
   * ---------------------------------------- */
  const _validGetter = function(rcMdl, rcHeader) {
    return _rcVal(rcMdl, rcHeader, "validGetter", Function.airTrue);
  };
  exports._validGetter = _validGetter;


  /* ----------------------------------------
   * NOTE:
   *
   * Contents that are required to be unlocked for the recipe.
   * ---------------------------------------- */
  const _lockedBy = function(rcMdl, rcHeader, toCts) {
    const arr = _rcVal(rcMdl, rcHeader, "lockedBy", Array.air);
    if(!toCts) return arr;

    const cts = [];
    arr.forEachFast(nmCt => {
      let ct = MDL_content._ct(nmCt, null, true);
      if(ct != null) cts.pushUnique(ct);
    });

    return cts;
  };
  exports._lockedBy = _lockedBy;


  /* ----------------------------------------
   * NOTE:
   *
   * Gets the final {validGetter} used in multi-crafters.
   * ---------------------------------------- */
  const _finalValidGetter = function(rcMdl, rcHeader) {
    let validGetter = _validGetter(rcMdl, rcHeader);
    let cts = _lockedBy(rcMdl, rcHeader, true);

    return b => validGetter(b) && cts.every(ct => ct.unlockedNow());
  };
  exports._finalValidGetter = _finalValidGetter;


  /* ----------------------------------------
   * NOTE:
   *
   * A variant of {_finalValidGetter} for tuple.
   * ---------------------------------------- */
  const _validTup = function(rcMdl, rcHeader, contTup) {
    const tup = contTup != null ? contTup.clear() : [];

    tup.push(_finalValidGetter(rcMdl, rcHeader));

    return tup;
  };
  exports._validTup = _validTup;


  /* ----------------------------------------
   * NOTE:
   *
   * Gets crafting time scale of the recipe.
   * ---------------------------------------- */
  const _timeScl = function(rcMdl, rcHeader) {
    return _rcVal(rcMdl, rcHeader, "timeScl", 1.0);
  };
  exports._timeScl = _timeScl;


  /* ----------------------------------------
   * NOTE:
   *
   * Extra pollution added to the block for this recipe.
   * ---------------------------------------- */
  const _pol = function(rcMdl, rcHeader) {
    return _rcVal(rcMdl, rcHeader, "pollution", 0.0);
  };
  exports._pol = _pol;


  /* ----------------------------------------
   * NOTE:
   *
   * Wether the crafter consumes even when full of output.
   * ---------------------------------------- */
  const _ignoreItemFullness = function(rcMdl, rcHeader) {
    return _rcVal(rcMdl, rcHeader, "ignoreItemFullness", false);
  };
  exports._ignoreItemFullness = _ignoreItemFullness;


  /* ----------------------------------------
   * NOTE:
   *
   * Gets the attribute that affects efficiency of the recipe.
   * ---------------------------------------- */
  const _attr = function(rcMdl, rcHeader) {
    return _rcVal(rcMdl, rcHeader, "attr", _rcBaseVal(rcMdl, "baseAttr", null));
  };
  exports._attr = _attr;


  /* ----------------------------------------
   * NOTE:
   *
   * Gets the attribute value minimum (0.0 efficiency).
   * Don't include block size here.
   * ---------------------------------------- */
  const _attrMin = function(rcMdl, rcHeader) {
    return _rcVal(rcMdl, rcHeader, "attrMin", _rcBaseVal(rcMdl, "baseAttrMin", 0.0));
  };
  exports._attrMin = _attrMin;


  /* ----------------------------------------
   * NOTE:
   *
   * Gets the attribute value maximum (1.0 efficiency).
   * Don't include block size here.
   * ---------------------------------------- */
  const _attrMax = function(rcMdl, rcHeader) {
    return _rcVal(rcMdl, rcHeader, "attrMax", _rcBaseVal(rcMdl, "baseAttrMax", 1.0));
  };
  exports._attrMax = _attrMax;


  /* ----------------------------------------
   * NOTE:
   *
   * Gets the multiplier on final boost.
   * You can use a negative scaling for something.
   * ---------------------------------------- */
  const _attrBoostScl = function(rcMdl, rcHeader) {
    return _rcVal(rcMdl, rcHeader, "attrBoostScl", _rcBaseVal(rcMdl, "baseAttrBoostScl", 1.0));
  };
  exports._attrBoostScl = _attrBoostScl;


  /* ----------------------------------------
   * NOTE:
   *
   * Gets the maximum efficiency that can be reached with attribute boost.
   * ---------------------------------------- */
  const _attrBoostCap = function(rcMdl, rcHeader) {
    return _rcVal(rcMdl, rcHeader, "attrBoostCap", _rcBaseVal(rcMdl, "baseAttrBoostCap", Infinity));
  };
  exports._attrBoostCap = _attrBoostCap;


  /* ----------------------------------------
   * NOTE:
   *
   * Gets the tooltip bundle piece.
   * Can return {null} if not found!
   * ---------------------------------------- */
  const _tt = function(rcMdl, rcHeader) {
    return _rcVal(rcMdl, rcHeader, "tooltip", null);
  };
  exports._tt = _tt;


  /* ----------------------------------------
   * NOTE:
   *
   * Gets the full text for recipe tooltip.
   * Very unsightreadable cauz why not.
   * ---------------------------------------- */
  const _ttStr = function(rcMdl, rcHeader, valid) {
    if(Vars.headless) return "";

    if(valid) {
      // Regular display
      return String.multiline(
        ("<" + _categB(_categ(rcMdl, rcHeader)) + ">").color(Pal.accent),
        (function() {let ct = MDL_content._ct(_iconNm(rcMdl, rcHeader), null, true); return ct == null ? "-" : ct.localizedName})(),
        (function() {
          let str = String.multiline(
            "",
            !_isGen(rcMdl, rcHeader) ? null : MDL_bundle._term("lovec", "generated-recipe").color(Color.darkGray),
            (function() {let attr = _attr(rcMdl, rcHeader); return attr == null ? null : MDL_text._statText(fetchStat("lovec", "blk-attrreq").localized(), MDL_attr._attrB(attr))})(),
            (function() {let pol = _pol(rcMdl, rcHeader); return pol.fEqual(0.0) ? null : MDL_text._statText(fetchStat("lovec", "blk-pol").localized(), (pol > 0.0 ? "+" : "=") + Math.abs(pol), fetchStatUnit("lovec", "polunits").localized())})(),
            (function() {let p = _failP(rcMdl, rcHeader); return p < 0.0001 ? null : MDL_text._statText(MDL_bundle._term("lovec", "chance-to-fail"), p.perc(1))})(),
            (function() {let mtp = _powProdMtp(rcMdl, rcHeader); return mtp.fEqual(1.0) ? null : MDL_text._statText(fetchStat("lovec", "blk0pow-powmtp").localized(), mtp.perc())})(),
            (function() {let temp = _tempReq(rcMdl, rcHeader); return temp < 0.0001 ? null : MDL_text._statText(fetchStat("lovec", "blk0heat-tempreq").localized(), Strings.fixed(temp, 2), fetchStatUnit("lovec", "heatunits").localized())})(),
            (function() {let temp = _tempAllowed(rcMdl, rcHeader); return !isFinite(temp) ? null : MDL_text._statText(MDL_bundle._term("lovec", "temperature-allowed"), Strings.fixed(temp, 2), fetchStatUnit("lovec", "heatunits").localized())})(),
            (function() {let mtp = _durabDecMtp(rcMdl, rcHeader); return mtp.fEqual(1.0) ? null : MDL_text._statText(MDL_bundle._term("lovec", "abrasion-multiplier"), mtp.perc())})(),
            (function() {let tt = _tt(rcMdl, rcHeader); return tt == null ? null : MDL_bundle._info("common", "tt-" + tt)})(),
          );
          return str === "\n" ? null : str;
        })(),
      );
    } else {
      // When content is still locked
      return String.multiline(
        MDL_bundle._info("lovec", "recipe-unavailable"),
        (function() {
          let str = String.multiline(
            "",
            (function() {let cts = _lockedBy(rcMdl, rcHeader, true); let str1 = null; if(cts.length > 0) {str1 = MDL_text._statText(MDL_bundle._term("lovec", "locked"), ""); cts.forEachFast(ct => str1 += "\n- " + ct.localizedName.plain().color(Pal.remove))}; return str1})(),
          );
          return str === "\n" ? null : str;
        })(),
      );
    };
  };
  exports._ttStr = _ttStr;


  /* <---------- recipe I/O ----------> */


  /* ----------------------------------------
   * NOTE:
   *
   * Call this to add data to recipe dictionary.
   * Should be called in {init}.
   * ---------------------------------------- */
  const initRc = function thisFun(rcMdl, blkInit) {
    if(thisFun.blks.includes(blkInit)) throw new Error("Block [$1] has its recipe initialized more than once???".format(blkInit.name));

    _rcHeaders(rcMdl).forEachFast(rcHeader => {
      let timeScl = _timeScl(rcMdl, rcHeader);
      _ci(rcMdl, rcHeader, null, blkInit);
      _bi(rcMdl, rcHeader, null, blkInit, timeScl);
      _aux(rcMdl, rcHeader, null, blkInit);
      _opt(rcMdl, rcHeader, null, blkInit);
      _payi(rcMdl, rcHeader, null, blkInit);
      let failP = _failP(rcMdl, rcHeader);
      _co(rcMdl, rcHeader, null, blkInit);
      _bo(rcMdl, rcHeader, null, blkInit, timeScl, failP);
      _fo(rcMdl, rcHeader, null, blkInit, timeScl, failP);
      _payo(rcMdl, rcHeader, null, blkInit, timeScl);
    });
  }
  .setProp({
    blks: [],
  });
  exports.initRc = initRc;


  /* ----------------------------------------
   * NOTE:
   *
   * Parses a row in the I/O array, and pushes results into {arr}.
   * ---------------------------------------- */
  const parseRcIoRow = function(arr, tg, amt, p, ctCaller, isSecondary) {
    if(ctCaller == null) ctCaller = Function.air;
    let isContinuous = p == null;

    if(tg instanceof Array) {
      let i = 0, iCap = tg.iCap(), tmpArr = [];
      while(i < iCap) {
        parseRcIoRow(tmpArr, tg[i], tg[i + 1], isContinuous ? null : tg[i + 2], ctCaller, true);
        i += isContinuous ? 2 : 3;
      };
      if(tmpArr.length > 0) {
        isSecondary ?
          arr.pushAll(tmpArr) :
          isContinuous ?
            (
              tmpArr.length === 2 ?
                arr.push(tmpArr[0], tmpArr[1]) :
                arr.push(tmpArr, -1.0)
            ) :
            (
              tmpArr.length === 3 ?
                arr.push(tmpArr[0], tmpArr[1], tmpArr[2]) :
                arr.push(tmpArr, -1.0, -1.0)
            );
      };
    } else if(tg instanceof UnlockableContent) {
      if(isContinuous) {
        arr.push(tg, amt);
        ctCaller(tg, amt, null);
      } else {
        arr.push(tg, Math.round(amt), p);
        ctCaller(tg, Math.round(amt), p);
      };
    } else if(typeof tg === "string") {
      if(tg.startsWith("GROUP: ")) {
        let tmpArr = [];
        DB_item.db["group"]["rcGroup"].readList(tg.replace("GROUP: ", "")).forEachFast(tup => {
          parseRcIoRow(
            tmpArr, tup[0],
            amt * readParam(tup[1], "amtScl", 1.0),
            isContinuous ? null : (p * readParam(tup[1], "pScl", 1.0)),
            ctCaller, true,
          );
        });
        if(tmpArr.length > 0) {
          isSecondary ?
            arr.pushAll(tmpArr) :
            isContinuous ?
              (
                tmpArr.length === 2 ?
                  arr.push(tmpArr[0], tmpArr[1]) :
                  arr.push(tmpArr, -1.0)
              ) :
              (
                tmpArr.length === 3 ?
                  arr.push(tmpArr[0], tmpArr[1], tmpArr[2]) :
                  arr.push(tmpArr, -1.0, -1.0)
              );
        } else {
          Log.warn("[LOVEC] No content found under [$1]!".format(tg.color(Pal.accent)));
        };
      } else {
        let ct = MDL_content._ct(tg, null, true);
        if(ct != null) parseRcIoRow(arr, ct, amt, p, ctCaller);
      };
    } else {
      throw new Error("WTF did you put into the I/O array???\n" + tg);
    };
  };
  exports.parseRcIoRow = parseRcIoRow;


  /* ----------------------------------------
   * NOTE:
   *
   * Converts the continuous input list from a recipe object.
   * ---------------------------------------- */
  const _ci = function(rcMdl, rcHeader, contArr, blkInit) {
    const arr = contArr != null ? contArr.clear() : [];

    let raw = _rcVal(rcMdl, rcHeader, "ci", Array.air).concat(_rcBaseVal(rcMdl, "baseCi", Array.air));
    let i = 0, iCap = raw.iCap();
    while(i < iCap) {
      parseRcIoRow(arr, raw[i], raw[i + 1], null, (ct, amt) => {
        if(blkInit == null) return;
        MDL_recipeDict.addFldConsTerm(
          blkInit, ct, amt,
          {ct: _iconNm(rcMdl, rcHeader)},
        );
      });
      i += 2;
    };

    return arr;
  };
  exports._ci = _ci;


  /* ----------------------------------------
   * NOTE:
   *
   * Converts the batch input list from a recipe object.
   * ---------------------------------------- */
  const _bi = function(rcMdl, rcHeader, contArr, blkInit, timeSclInit) {
    const arr = contArr != null ? contArr.clear() : [];

    let raw = _rcVal(rcMdl, rcHeader, "bi", Array.air).concat(_rcBaseVal(rcMdl, "baseBi", Array.air));
    let i = 0, iCap = raw.iCap();
    while(i < iCap) {
      parseRcIoRow(arr, raw[i], raw[i + 1], raw[i + 2], (ct, amt, p) => {
        if(blkInit == null) return;
        ct instanceof Item ?
          MDL_recipeDict.addItmConsTerm(
            blkInit, ct, amt / tryVal(timeSclInit, 1.0), p,
            {ct: _iconNm(rcMdl, rcHeader)},
          ) :
          MDL_recipeDict.addFldConsTerm(
            blkInit, ct, amt / blkInit.craftTime / tryVal(timeSclInit, 1.0),
            {ct: _iconNm(rcMdl, rcHeader)},
          );
      });
      i += 3;
    };

    return arr;
  };
  exports._bi = _bi;


  /* ----------------------------------------
   * NOTE:
   *
   * Converts the auxiliay list from a recipe object.
   * It's just another CI.
   * ---------------------------------------- */
  const _aux = function(rcMdl, rcHeader, contArr, blkInit) {
    const arr = contArr != null ? contArr.clear() : [];

    let raw = _rcVal(rcMdl, rcHeader, "aux", Array.air).concat(_rcBaseVal(rcMdl, "baseAux", Array.air));
    let i = 0, iCap = raw.iCap();
    while(i < iCap) {
      parseRcIoRow(arr, raw[i], raw[i + 1], null, (ct, amt) => {
        if(blkInit == null) return;
        MDL_recipeDict.addFldConsTerm(
          blkInit, ct, amt,
          {ct: _iconNm(rcMdl, rcHeader)},
        );
      });
      i += 2;
    };

    return arr;
  };
  exports._aux = _aux;


  /* ----------------------------------------
   * NOTE:
   *
   * Whether there should be at least one optional input present for the recipe.
   * ---------------------------------------- */
  const _reqOpt = function(rcMdl, rcHeader) {
    return _rcVal(rcMdl, rcHeader, "reqOpt", false);
  };
  exports._reqOpt = _reqOpt;


  /* ----------------------------------------
   * NOTE:
   *
   * Converts the optional input list from a recipe object.
   * ---------------------------------------- */
  const _opt = function(rcMdl, rcHeader, contArr, blkInit) {
    const arr = contArr != null ? contArr.clear() : [];

    let raw = _rcVal(rcMdl, rcHeader, "opt", Array.air).concat(_rcBaseVal(rcMdl, "baseOpt", Array.air));
    let i = 0, iCap = raw.iCap();
    while(i < iCap) {
      parseRcIoRow(arr, raw[i], raw[i + 1], raw[i + 2], (ct, amt, p) => {
        arr.push(Number(raw[i + 3]));
        if(blkInit == null) return;
        MDL_recipeDict.addItmConsTerm(
          blkInit, ct, amt, p,
          {ct: _iconNm(rcMdl, rcHeader), icon: "lovec-icon-optional"},
        );
      });
      i += 4;
    };

    return arr;
  };
  exports._opt = _opt;


  /* ----------------------------------------
   * NOTE:
   *
   * Converts the payload input list from a recipe object.
   * ---------------------------------------- */
  const _payi = function(rcMdl, rcHeader, contArr, blkInit) {
    const arr = contArr != null ? contArr.clear() : [];

    let raw = _rcVal(rcMdl, rcHeader, "payi", Array.air).concat(_rcBaseVal(rcMdl, "basePayi", Array.air));
    let i = 0, iCap = raw.iCap();
    while(i < iCap) {
      parseRcIoRow(arr, raw[i], raw[i + 1], null, (ct, amt) => {
        if(blkInit == null) return;
        MDL_recipeDict.addPayConsTerm(
          blkInit, ct, amt,
          {ct: _iconNm(rcMdl, rcHeader)},
        );
      });
      i += 2;
    };

    return arr.inSituMap(ele => ele instanceof UnlockableContent ? ele.name : ele);
  };
  exports._payi = _payi;


  /* ----------------------------------------
   * NOTE:
   *
   * Converts the continuous output list from a recipe object.
   * ---------------------------------------- */
  const _co = function(rcMdl, rcHeader, contArr, blkInit) {
    const arr = contArr != null ? contArr.clear() : [];

    let raw = _rcVal(rcMdl, rcHeader, "co", Array.air).concat(_rcBaseVal(rcMdl, "baseCo", Array.air));
    let i = 0, iCap = raw.iCap();
    while(i < iCap) {
      parseRcIoRow(arr, raw[i], raw[i + 1], null, (ct, amt) => {
        if(blkInit == null) return;
        MDL_recipeDict.addFldProdTerm(
          blkInit, ct, amt,
          {ct: _iconNm(rcMdl, rcHeader)},
        );
      });
      i += 2;
    };

    return arr;
  };
  exports._co = _co;


  /* ----------------------------------------
   * NOTE:
   *
   * Converts the batch output list from a recipe object.
   * ---------------------------------------- */
  const _bo = function(rcMdl, rcHeader, contArr, blkInit, timeSclInit, failPInit) {
    const arr = contArr != null ? contArr.clear() : [];

    let raw = _rcVal(rcMdl, rcHeader, "bo", Array.air).concat(_rcBaseVal(rcMdl, "baseBo", Array.air));
    let i = 0, iCap = raw.iCap();
    while(i < iCap) {
      parseRcIoRow(arr, raw[i], raw[i + 1], raw[i + 2], (ct, amt, p) => {
        if(blkInit == null) return;
        MDL_recipeDict.addItmProdTerm(
          blkInit, ct, amt / tryVal(timeSclInit, 1.0), p * (failPInit == null ? 1.0 : (1.0 - failPInit)),
          {ct: _iconNm(rcMdl, rcHeader)},
        );
      });
      i += 3;
    };

    return arr;
  };
  exports._bo = _bo;


  /* ----------------------------------------
   * NOTE:
   *
   * Gets the chance to fail a recipe.
   * Hmmmmm... it's kinda overcooked.
   * ---------------------------------------- */
  const _failP = function(rcMdl, rcHeader) {
    return _rcVal(rcMdl, rcHeader, "failP", 0.0);
  };
  exports._failP = _failP;


  /* ----------------------------------------
   * NOTE:
   *
   * Converts the failure output list from a recipe object.
   * ---------------------------------------- */
  const _fo = function(rcMdl, rcHeader, contArr, blkInit, timeSclInit, failPInit) {
    const arr = contArr != null ? contArr.clear() : [];

    let raw = _rcVal(rcMdl, rcHeader, "fo", Array.air).concat(_rcBaseVal(rcMdl, "baseFo", Array.air));
    let i = 0, iCap = raw.iCap();
    while(i < iCap) {
      parseRcIoRow(arr, raw[i], raw[i + 1], raw[i + 2], (ct, amt, p) => {
        if(blkInit == null) return;
        MDL_recipeDict.addItmProdTerm(
          blkInit, ct, amt / tryVal(timeSclInit, 1.0), p * (failPInit == null ? 0.0 : failPInit),
          {ct: _iconNm(rcMdl, rcHeader)},
        );
      });
      i += 3;
    };

    return arr;
  };
  exports._fo = _fo;


  /* ----------------------------------------
   * NOTE:
   *
   * Converts the payload output list from a recipe object.
   * ---------------------------------------- */
  const _payo = function(rcMdl, rcHeader, contArr, blkInit, timeSclInit) {
    const arr = contArr != null ? contArr.clear() : [];

    let raw = _rcVal(rcMdl, rcHeader, "payo", Array.air).concat(_rcBaseVal(rcMdl, "basePayo", Array.air));
    let i = 0, iCap = raw.iCap();
    while(i < iCap) {
      parseRcIoRow(arr, raw[i], raw[i + 1], null, (ct, amt) => {
        if(blkInit == null) return;
        MDL_recipeDict.addPayProdTerm(
          blkInit, ct, amt / tryVal(timeSclInit, 1.0),
          {ct: _iconNm(rcMdl, rcHeader)},
        );
      });
      i += 2;
    };

    return arr.inSituMap(ele => ele instanceof UnlockableContent ? ele.name : ele);
  };
  exports._payo = _payo;


  /* ----------------------------------------
   * NOTE:
   *
   * Gets the script called whenever the building updates.
   * ---------------------------------------- */
  const _updateScr = function(rcMdl, rcHeader) {
    return b => {
      _rcVal(rcMdl, rcHeader, "updateScr", Function.air)(b);
      _rcBaseVal(rcMdl, "baseUpdateScr", Function.air)(b);
    };
  }
  .setCache();
  exports._updateScr = _updateScr;


  /* ----------------------------------------
   * NOTE:
   *
   * Gets the script called every frame when the building is running.
   * ---------------------------------------- */
  const _runScr = function(rcMdl, rcHeader) {
    return b => {
      _rcVal(rcMdl, rcHeader, "runScr", Function.air)(b);
      _rcBaseVal(rcMdl, "baseRunScr", Function.air)(b);
    };
  }
  .setCache();
  exports._runScr = _runScr;


  /* ----------------------------------------
   * NOTE:
   *
   * Gets the script called when the building finishes crafting.
   * ---------------------------------------- */
  const _craftScr = function(rcMdl, rcHeader) {
    return b => {
      _rcVal(rcMdl, rcHeader, "craftScr", Function.air)(b);
      _rcBaseVal(rcMdl, "baseCraftScr", Function.air)(b);
    };
  }
  .setCache();
  exports._craftScr = _craftScr;


  /* ----------------------------------------
   * NOTE:
   *
   * Gets the script called when the building is no longer running.
   * Won't be called if the building has never been active.
   * ---------------------------------------- */
  const _stopScr = function(rcMdl, rcHeader) {
    return b => {
      _rcVal(rcMdl, rcHeader, "stopScr", Function.air)(b);
      _rcBaseVal(rcMdl, "baseStopScr", Function.air)(b);
    };
  }
  .setCache();
  exports._stopScr = _stopScr;


  /* ----------------------------------------
   * NOTE:
   *
   * Gets a 4-tuple of recipe scripts for storage.
   * ---------------------------------------- */
  const _scrTup = function(rcMdl, rcHeader, contTup) {
    const tup = contTup != null ? contTup.clear() : [];

    tup.push(
      _updateScr(rcMdl, rcHeader),
      _runScr(rcMdl, rcHeader),
      _craftScr(rcMdl, rcHeader),
      _stopScr(rcMdl, rcHeader),
    );

    return tup;
  };
  exports._scrTup = _scrTup;


  /* <---------- specific ----------> */


  /* BLK_generatorRecipeFactory */


  /* ----------------------------------------
   * NOTE:
   *
   * Gets the multiplier on power produced.
   * ---------------------------------------- */
  const _powProdMtp = function(rcMdl, rcHeader) {
    return _rcVal(rcMdl, rcHeader, "powProdMtp", 1.0);
  };
  exports._powProdMtp = _powProdMtp;


  /* BLK_furnaceRecipeFactory */


  /* ----------------------------------------
   * NOTE:
   *
   * Gets the temperature required for a recipe.
   * ---------------------------------------- */
  const _tempReq = function(rcMdl, rcHeader) {
    return _rcVal(rcMdl, rcHeader, "tempReq", 0.0);
  };
  exports._tempReq = _tempReq;


  /* ----------------------------------------
   * NOTE:
   *
   * Gets the temperature allowed for a recipe, beyond which failure occurs more frequently.
   * ---------------------------------------- */
  const _tempAllowed = function(rcMdl, rcHeader) {
    return _rcVal(rcMdl, rcHeader, "tempAllowed", Infinity);
  };
  exports._tempAllowed = _tempAllowed;


  /* BLK_durabilityRecipeFactory */


  /* ----------------------------------------
   * NOTE:
   *
   * Gets the multiplier on durability decrease rate.
   * ---------------------------------------- */
  const _durabDecMtp = function(rcMdl, rcHeader) {
    return _rcVal(rcMdl, rcHeader, "durabDecMtp", 1.0);
  };
  exports._durabDecMtp = _durabDecMtp;
