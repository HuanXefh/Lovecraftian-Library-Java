/*
  ========================================
  Section: Introduction
  ========================================
*/


  /**
   * The bedrock for multi-crafters.
   */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- base ----------> */


  /**
   * Gets recipe module for some block.
   * <br> <PATH>: "<nmMod>/scripts/auxFi/rc/<nmBlk>.js".
   * @param {string} nmMod
   * @param {string} nmBlk
   * @return {RecipeModule}
   */
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


  /**
   * Gets base object in a recipe module.
   * @param {RecipeModule} rcMdl
   * @return {RecipeBase}
   */
  const _rcBase = function(rcMdl) {
    return rcMdl == null ?
      Object.air :
      tryVal(rcMdl.rc["base"], Object.air);
  };
  exports._rcBase = _rcBase;


  /**
   * Gets some value in a base object.
   * @param {RecipeModule} rcMdl
   * @param {string} key
   * @param {any} [def]
   * @return {any}
   */
  const _rcBaseVal = function(rcMdl, key, def) {
    return tryVal(_rcBase(rcMdl)[key], def);
  };
  exports._rcBaseVal= _rcBaseVal;


  /**
   * Gets all recipes in a recipe module.
   * @param {RecipeModule} rcMdl
   * @return {Array<RecipeObject>}
   */
  const _rcLi = function(rcMdl) {
    return rcMdl == null ?
      Array.air :
      tryVal(rcMdl.rc["recipe"], Array.air);
  };
  exports._rcLi = _rcLi;


  /**
   * Gets amount of recipe objects in a recipe module.
   * @param {RecipeModule} rcMdl
   * @return {number}
   */
  const _rcSize = function(rcMdl) {
    return _rcLi(rcMdl).iCap() / 2;
  };
  exports._rcSize = _rcSize;


  /**
   * Gets a recipe object by header in `rcMdl`.
   * @param {RecipeModule} rcMdl
   * @param {string} rcHeader
   * @return {RecipeObject|null}
   */
  const _rcObj = function(rcMdl, rcHeader) {
    return _rcLi(rcMdl).read(rcHeader, null);
  };
  exports._rcObj = _rcObj;


  /**
   * Gets all headers found in some recipe module.
   * @param {RecipeModule} rcMdl
   * @return {Array<string>}
   */
  const _rcHeaders = function(rcMdl) {
    return _rcLi(rcMdl).readCol(2, 0);
  };
  exports._rcHeaders = _rcHeaders;


  /**
   * Gets all recipe objects found in `rcMdl`.
   * @param {RecipeModule} rcMdl
   * @return {Array<RecipeObject>}
   */
  const _rcObjs = function(rcMdl) {
    return _rcLi(rcMdl).readCol(2, 1);
  };
  exports._rcObjs = _rcObjs;


  /**
   * Whether a header exists in `rcMdl`.
   * @param {RecipeModule} rcMdl
   * @param {string} rcHeader
   * @return {boolean}
   */
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


  /**
   * Gets first header in `rcMdl`, which is usually the default header.
   * @param {RecipeModule} rcMdl
   * @return {string}
   */
  const _firstHeader = function(rcMdl) {
    return tryVal(_rcLi(rcMdl)[0], "");
  };
  exports._firstHeader = _firstHeader;


  /**
   * Gets a value in target recipe object if found.
   * @param {RecipeModule} rcMdl
   * @param {string} rcHeader
   * @param {string} key
   * @param {any} [def]
   * @return {any}
   */
  const _rcVal = function(rcMdl, rcHeader, key, def) {
    let rcObj = _rcObj(rcMdl, rcHeader);
    return rcObj == null ?
      def :
      tryVal(rcObj[key], def);
  };
  exports._rcVal = _rcVal;


  /**
   * Whether some resource exists in the inputs of `rcMdl`.
   * @param {ResourceGn} rs_gn
   * @param {RecipeModule} rcMdl
   * @return {boolean}
   */
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


  /**
   * Whether there's any payload input in `rcMdl`.
   * @param {RecipeModule} rcMdl
   * @return {boolean}
   */
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


  /**
   * Whether some resource exists in the outputs of `rcMdl`.
   * @param {ResourceGn} rs_gn
   * @param {RecipeModule} rcMdl
   * @return {boolean}
   */
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


  /**
   * Whether there's any item output in `rcMdl`.
   * @param {RecipeModule} rcMdl
   * @return {boolean}
   */
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


  /**
   * Whether there's any fluid output in `rcMdl`.
   * @param {RecipeModule} rcMdl
   * @return {boolean}
   */
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


  /**
   * Whether there's any payload output in `rcMdl`.
   * @param {RecipeModule} rcMdl
   * @return {boolean}
   */
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


  /**
   * Gets icon string of a recipe.
   * @param {RecipeModule} rcMdl
   * @param {string} rcHeader
   * @return {string}
   */
  const _iconNm = function(rcMdl, rcHeader) {
    return _rcVal(rcMdl, rcHeader, "icon", "null");
  };
  exports._iconNm = _iconNm;


  /**
   * Gets icon of a recipe.
   * @param {RecipeModule} rcMdl
   * @param {string} rcHeader
   * @param {boolean|unset} [notContent]
   * @return {TextureRegionDrawable}
   */
  const _icon = function(rcMdl, rcHeader, notContent) {
    let iconNm = _iconNm(rcMdl, rcHeader);
    if(notContent) return new TextureRegionDrawable(Core.atlas.find(iconNm));
    let ct = MDL_content._ct(iconNm, null, true);

    return ct == null ?
      Icon.cancel :
      new TextureRegionDrawable(ct.uiIcon);
  };
  exports._icon = _icon;


  /**
   * Gets category of a recipe.
   * @param {RecipeModule} rcMdl
   * @param {string} rcHeader
   * @return {string}
   */
  const _categ = function(rcMdl, rcHeader) {
    return _rcVal(rcMdl, rcHeader, "category", "uncategorized");
  };
  exports._categ = _categ;


  /**
   * Gets all categories found in `rcMdl`.
   * "uncategorized" will always appear at the end.
   * @param {RecipeModule} rcMdl
   * @return {Array<string>}
   */
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


  /**
   * Gets object of categories and recipe headers.
   * @param {RecipeModule} rcMdl
   * @return {Object<string: string>}
   */
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


  /**
   * <BUNDLE>: "term.common-term-categ-<categ>.name".
   * @param {string} categ
   * @return {string}
   */
  const _categB = function(categ) {
    return MDL_bundle._term("common", "categ-" + categ);
  };
  exports._categB = _categB;


  /**
   * Whether this recipe is generated.
   * Do not set this field.
   * @param {RecipeModule} rcMdl
   * @param {string} rcHeader
   * @return {boolean}
   */
  const _isGen = function(rcMdl, rcHeader) {
    return _rcVal(rcMdl, rcHeader, "isGenerated", false);
  };
  exports._isGen = _isGen;


  /**
   * Gets the function used to check whether this recipe is allowed now.
   * @param {RecipeModule} rcMdl
   * @param {string} rcHeader
   * @return {function(Building): boolean}
   */
  const _validGetter = function(rcMdl, rcHeader) {
    return _rcVal(rcMdl, rcHeader, "validGetter", Function.airTrue);
  };
  exports._validGetter = _validGetter;


  /**
   * Gets contents required to be unlocked for this recipe.
   * @param {RecipeModule} rcMdl
   * @param {string} rcHeader
   * @param {boolean|unset} [toCts]
   * @return {Array<string>|Array<UnlockableContent>}
   */
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


  /**
   * Gets the final `validGetter` used in multi-crafters.
   * @param {RecipeModule} rcMdl
   * @param {string} rcHeader
   * @return {function(Building): boolean}
   */
  const _finalValidGetter = function(rcMdl, rcHeader) {
    let validGetter = _validGetter(rcMdl, rcHeader);
    let cts = _lockedBy(rcMdl, rcHeader, true);

    return b => validGetter(b) && cts.every(ct => ct.unlockedNow());
  };
  exports._finalValidGetter = _finalValidGetter;


  /**
   * Variant of {@link _finalValidGetter} for tuple.
   * @param {RecipeModule} rcMdl
   * @param {string} rcHeader
   * @param {Array|unset} [contTup]
   * @return {[function(): boolean]}
   */
  const _validTup = function(rcMdl, rcHeader, contTup) {
    const tup = contTup != null ? contTup.clear() : [];

    tup.push(_finalValidGetter(rcMdl, rcHeader));

    return tup;
  };
  exports._validTup = _validTup;


  /**
   * Gets crafting time scaling of a recipe.
   * @param {RecipeModule} rcMdl
   * @param {string} rcHeader
   * @return {number}
   */
  const _timeScl = function(rcMdl, rcHeader) {
    return _rcVal(rcMdl, rcHeader, "timeScl", 1.0);
  };
  exports._timeScl = _timeScl;


  /**
   * Gets block pollution of a recipe.
   * @param {RecipeModule} rcMdl
   * @param {string} rcHeader
   * @return {number}
   */
  const _pol = function(rcMdl, rcHeader) {
    return _rcVal(rcMdl, rcHeader, "pollution", 0.0);
  };
  exports._pol = _pol;


  /**
   * Whether the crafter consumes even when full of output items.
   * @param {RecipeModule} rcMdl
   * @param {string} rcHeader
   * @return {boolean}
   */
  const _ignoreItemFullness = function(rcMdl, rcHeader) {
    return _rcVal(rcMdl, rcHeader, "ignoreItemFullness", false);
  };
  exports._ignoreItemFullness = _ignoreItemFullness;


  /**
   * Gets attribute that affects efficiency of this recipe.
   * @param {RecipeModule} rcMdl
   * @param {string} rcHeader
   * @return {string}
   */
  const _attr = function(rcMdl, rcHeader) {
    return _rcVal(rcMdl, rcHeader, "attr", _rcBaseVal(rcMdl, "baseAttr", null));
  };
  exports._attr = _attr;


  /**
   * Gets attribute value for 0.0 efficiency.
   * @param {RecipeModule} rcMdl
   * @param {string} rcHeader
   * @return {number}
   */
  const _attrMin = function(rcMdl, rcHeader) {
    return _rcVal(rcMdl, rcHeader, "attrMin", _rcBaseVal(rcMdl, "baseAttrMin", 0.0));
  };
  exports._attrMin = _attrMin;


  /**
   * Gets attribute value for 1.0 efficiency.
   * @param {RecipeModule} rcMdl
   * @param {string} rcHeader
   * @return {number}
   */
  const _attrMax = function(rcMdl, rcHeader) {
    return _rcVal(rcMdl, rcHeader, "attrMax", _rcBaseVal(rcMdl, "baseAttrMax", 1.0));
  };
  exports._attrMax = _attrMax;


  /**
   * Gets multiplier on final attrbute boost.
   * @param {RecipeModule} rcMdl
   * @param {string} rcHeader
   * @return {number}
   */
  const _attrBoostScl = function(rcMdl, rcHeader) {
    return _rcVal(rcMdl, rcHeader, "attrBoostScl", _rcBaseVal(rcMdl, "baseAttrBoostScl", 1.0));
  };
  exports._attrBoostScl = _attrBoostScl;


  /**
   * Gets maximum efficiency that can be reached with attribute boost.
   * @param {RecipeModule} rcMdl
   * @param {string} rcHeader
   * @return {number}
   */
  const _attrBoostCap = function(rcMdl, rcHeader) {
    return _rcVal(rcMdl, rcHeader, "attrBoostCap", _rcBaseVal(rcMdl, "baseAttrBoostCap", Infinity));
  };
  exports._attrBoostCap = _attrBoostCap;


  /**
   * Gets tooltip bundle piece of this recipe.
   * @param {RecipeModule} rcMdl
   * @param {string} rcHeader
   * @return {string|null}
   */
  const _tt = function(rcMdl, rcHeader) {
    return _rcVal(rcMdl, rcHeader, "tooltip", null);
  };
  exports._tt = _tt;


  /**
   * Gets full text for recipe tooltip.
   * @param {RecipeModule} rcMdl
   * @param {string} rcHeader
   * @param {boolean|unset} [valid]
   * @return {string}
   */
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
    };

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
  exports._ttStr = _ttStr;


  /* <---------- recipe I/O ----------> */


  /**
   * Adds recipe data to recipe dictionary.
   * Should be called on INIT.
   * @param {RecipeModule} rcMdl
   * @param {Block} blkInit - Owner of the recipes.
   * @return {void}
   */
  const initRc = function thisFun(rcMdl, blkInit) {
    if(thisFun.blks.includes(blkInit)) throw new Error("Block ${1} has its recipe initialized more than once???".format(blkInit.name));

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


  /**
   * Parses given I/O row data, and pushes results into `outArr`.
   * @param {Array} outArr
   * @param {string|Array|UnlockableContent} tg
   * @param {number} amt
   * @param {number|unset} [p]
   * @param {function(UnlockableContent, number, number|null): void} [ctCaller] - <ARGS>: ct, amt, p.
   * @param {boolean|unset} [isSecondary] - Do not set this.
   * @return {void}
   */
  const parseRcIoRow = function(outArr, tg, amt, p, ctCaller, isSecondary) {
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
          outArr.pushAll(tmpArr) :
          isContinuous ?
            (
              tmpArr.length === 2 ?
                outArr.push(tmpArr[0], tmpArr[1]) :
                outArr.push(tmpArr, -1.0)
            ) :
            (
              tmpArr.length === 3 ?
                outArr.push(tmpArr[0], tmpArr[1], tmpArr[2]) :
                outArr.push(tmpArr, -1.0, -1.0)
            );
      };
    } else if(tg instanceof UnlockableContent) {
      if(isContinuous) {
        outArr.push(tg, amt);
        ctCaller(tg, amt, null);
      } else {
        outArr.push(tg, Math.round(amt), p);
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
            outArr.pushAll(tmpArr) :
            isContinuous ?
              (
                tmpArr.length === 2 ?
                  outArr.push(tmpArr[0], tmpArr[1]) :
                  outArr.push(tmpArr, -1.0)
              ) :
              (
                tmpArr.length === 3 ?
                  outArr.push(tmpArr[0], tmpArr[1], tmpArr[2]) :
                  outArr.push(tmpArr, -1.0, -1.0)
              );
        } else {
          Log.warn("[LOVEC] No content found under ${1}!".format(tg.color(Pal.accent)));
        };
      } else {
        let ct = MDL_content._ct(tg, null, true);
        if(ct != null) parseRcIoRow(outArr, ct, amt, p, ctCaller);
      };
    } else {
      printObj(tg);
      throw new Error("WTF did you put into the I/O array???");
    };
  };
  exports.parseRcIoRow = parseRcIoRow;


  /**
   * Gets parsed CI data.
   * @param {RecipeModule} rcMdl
   * @param {string} rcHeader
   * @param {Array|unset} [contArr]
   * @param {Block|unset} [blkInit]
   * @return {Array}
   */
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


  /**
   * Gets parsed BI data.
   * @param {RecipeModule} rcMdl
   * @param {string} rcHeader
   * @param {Array|unset} [contArr]
   * @param {Block|unset} [blkInit]
   * @param {number|unset} [timeSclInit]
   * @return {Array}
   */
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


  /**
   * Gets parsed AUX data.
   * @param {RecipeModule} rcMdl
   * @param {string} rcHeader
   * @param {Array|unset} [contArr]
   * @param {Block|unset} [blkInit]
   * @return {Array}
   */
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


  /**
   * Whether at least one OPT should be met for this recipe.
   * @param {RecipeModule} rcMdl
   * @param {string} rcHeader
   * @return {boolean}
   */
  const _reqOpt = function(rcMdl, rcHeader) {
    return _rcVal(rcMdl, rcHeader, "reqOpt", false);
  };
  exports._reqOpt = _reqOpt;


  /**
   * Gets parsed OPT data.
   * @param {RecipeModule} rcMdl
   * @param {string} rcHeader
   * @param {Array|unset} [contArr]
   * @param {Block|unset} [blkInit]
   * @return {Array}
   */
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
          {ct: _iconNm(rcMdl, rcHeader), icon: "lovec-icon-boost"},
        );
      });
      i += 4;
    };

    return arr;
  };
  exports._opt = _opt;


  /**
   * Gets parsed PAYI data.
   * @param {RecipeModule} rcMdl
   * @param {string} rcHeader
   * @param {Array|unset} [contArr]
   * @param {Block|unset} [blkInit]
   * @return {Array}
   */
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


  /**
   * Gets parsed CO data.
   * @param {RecipeModule} rcMdl
   * @param {string} rcHeader
   * @param {Array|unset} [contArr]
   * @param {Block|unset} [blkInit]
   * @return {Array}
   */
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


  /**
   * Gets parsed BO data.
   * @param {RecipeModule} rcMdl
   * @param {string} rcHeader
   * @param {Array|unset} [contArr]
   * @param {Block|unset} [blkInit]
   * @param {number|unset} [timeSclInit]
   * @param {number|unset} [failPInit]
   * @return {Array}
   */
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


  /**
   * Gets chance to fail a recipe.
   * @param {RecipeModule} rcMdl
   * @param {string} rcHeader
   * @return {number}
   */
  const _failP = function(rcMdl, rcHeader) {
    return _rcVal(rcMdl, rcHeader, "failP", 0.0);
  };
  exports._failP = _failP;


  /**
   * Gets parsed FO data.
   * @param {RecipeModule} rcMdl
   * @param {string} rcHeader
   * @param {Array|unset} [contArr]
   * @param {Block|unset} [blkInit]
   * @param {number|unset} [timeSclInit]
   * @param {number|unset} [failPInit]
   * @return {Array}
   */
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


  /**
   * Gets parsed PAYO data.
   * @param {RecipeModule} rcMdl
   * @param {string} rcHeader
   * @param {Array|unset} [contArr]
   * @param {Block|unset} [blkInit]
   * @param {number|unset} [timeSclInit]
   * @return {Array}
   */
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


  /**
   * Gets script called whenever the building updates.
   * @param {RecipeModule} rcMdl
   * @param {string} rcHeader
   * @return {[function(Building): void, function(Building): void]}
   */
  const _updateScr = function(rcMdl, rcHeader) {
    return b => {
      _rcVal(rcMdl, rcHeader, "updateScr", Function.air)(b);
      _rcBaseVal(rcMdl, "baseUpdateScr", Function.air)(b);
    };
  }
  .setCache();
  exports._updateScr = _updateScr;


  /**
   * Gets script called every frame when the building is running.
   * @param {RecipeModule} rcMdl
   * @param {string} rcHeader
   * @return {[function(Building): void, function(Building): void]}
   */
  const _runScr = function(rcMdl, rcHeader) {
    return b => {
      _rcVal(rcMdl, rcHeader, "runScr", Function.air)(b);
      _rcBaseVal(rcMdl, "baseRunScr", Function.air)(b);
    };
  }
  .setCache();
  exports._runScr = _runScr;


  /**
   * Gets script called when the building finishes crafting.
   * @param {RecipeModule} rcMdl
   * @param {string} rcHeader
   * @return {[function(Building): void, function(Building): void]}
   */
  const _craftScr = function(rcMdl, rcHeader) {
    return b => {
      _rcVal(rcMdl, rcHeader, "craftScr", Function.air)(b);
      _rcBaseVal(rcMdl, "baseCraftScr", Function.air)(b);
    };
  }
  .setCache();
  exports._craftScr = _craftScr;


  /**
   * Gets script called when the building is no longer running.
   * Won't be called if the building has never been active.
   * @param {RecipeModule} rcMdl
   * @param {string} rcHeader
   * @return {[function(Building): void, function(Building): void]}
   */
  const _stopScr = function(rcMdl, rcHeader) {
    return b => {
      _rcVal(rcMdl, rcHeader, "stopScr", Function.air)(b);
      _rcBaseVal(rcMdl, "baseStopScr", Function.air)(b);
    };
  }
  .setCache();
  exports._stopScr = _stopScr;


  /**
   * Gets a 4-tuple of recipe scripts.
   * @param {RecipeModule} rcMdl
   * @param {string} rcHeader
   * @param {Array|unset} [contTup]
   * @return {[function(Building): void, function(Building): void, function(Building): void, function(Building): void]}
   */
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


  /**
   * Gets multiplier on power produced.
   * For {@link BLK_generatorRecipeFactory}.
   * @param {RecipeModule} rcMdl
   * @param {string} rcHeader
   * @return {number}
   */
  const _powProdMtp = function(rcMdl, rcHeader) {
    return _rcVal(rcMdl, rcHeader, "powProdMtp", 1.0);
  };
  exports._powProdMtp = _powProdMtp;


  /**
   * Gets temperature required for a recipe.
   * For {@link BLK_furnaceRecipeFactory}.
   * @param {RecipeModule} rcMdl
   * @param {string} rcHeader
   * @return {number}
   */
  const _tempReq = function(rcMdl, rcHeader) {
    return _rcVal(rcMdl, rcHeader, "tempReq", 0.0);
  };
  exports._tempReq = _tempReq;


  /**
   * Gets temperature allowed for a recipe, beyond which failure occurs more frequently.
   * For {@link BLK_furnaceRecipeFactory}.
   * @param {RecipeModule} rcMdl
   * @param {string} rcHeader
   * @return {number}
   */
  const _tempAllowed = function(rcMdl, rcHeader) {
    return _rcVal(rcMdl, rcHeader, "tempAllowed", Infinity);
  };
  exports._tempAllowed = _tempAllowed;


  /**
   * Gets multiplier on durability decrease rate.
   * For {@link BLK_durabilityRecipeFactory}.
   * @param {RecipeModule} rcMdl
   * @param {string} rcHeader
   * @return {number}
   */
  const _durabDecMtp = function(rcMdl, rcHeader) {
    return _rcVal(rcMdl, rcHeader, "durabDecMtp", 1.0);
  };
  exports._durabDecMtp = _durabDecMtp;
