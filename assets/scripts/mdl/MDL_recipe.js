/*
  ========================================
  Section: Introduction
  ========================================
*/


  /**
   * The bedrock for multi-crafters.
   * @module lovec/mdl/MDL_recipe
   */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <------------------------------ base ------------------------------ */


  const IO_ORDER_MAP = ObjectMap.of(
    "ci", 2,
    "bi", 3,
    "aux", 2,
    "opt", 4,
    "payi", 2,
    "co", 2,
    "bo", 3,
    "fo", 3,
    "payo", 2,
  );
  exports.IO_ORDER_MAP = IO_ORDER_MAP;


  /**
   * Gets recipe module for some block.
   * <br> `PATH`: "<nameMod>/scripts/auxFi/rc/<nameBlk>.js".
   * <br> `PATH`: "<nameMod>/scripts/auxFi/json/rc/<nameBlk>.json".
   * @param {string} nameMod
   * @param {string} nameBlk
   * @return {RecipeModule}
   */
  const _rcMdl = function(nameMod, nameBlk) {
    let rcMdl;
    try {
      rcMdl = require(nameMod + "/auxFi/rc/" + nameBlk);
    } catch(err) {
      let obj = _rcMdlJson(nameMod, nameBlk);
      if(obj != null) {
        rcMdl = obj;
      } else {
        throw new Error("Failed to load recipe for " + nameMod + "-" + nameBlk + ":\n" + err);
      };
    };

    return rcMdl;
  };
  exports._rcMdl = _rcMdl;


  /**
   * Gets recipe module from JSON file.
   * Used in {@link _rcMdl}.
   * @param {string} nameMod
   * @param {string} nameBlk
   * @return {RecipeModule}
   */
  const _rcMdlJson = function(nameMod, nameBlk) {
    let mod = fetchMod(nameMod);
    if(mod == null) return null;
    let dir = mod.root.child("scripts").child("auxFi").child("json").child("rc");
    if(!dir.exists()) return null;
    let fiSeq = dir.findAll(fi => (fi.name() === nameBlk + ".json") || (fi.name() === nameBlk + ".hjson"));
    if(fiSeq.size === 0) return null;

    let obj = jsonToJsObj(fiSeq.get(0));
    // Check if format is correct
    if(typeof obj.base !== "object" || obj.base instanceof Array) throw new Error("Error parsing recipe. `base` must be an object!");
    if(!(obj.recipe instanceof Array)) throw new Error("Error parsing recipe. `recipe` must be an array!");
    let i = 0, iCap = obj.recipe.iCap(), rcObj;
    while(i < iCap) {
      if(typeof obj.recipe[i] !== "string") throw new Error("Error parsing recipe. Header must be a string!");
      rcObj = obj.recipe[i + 1];
      if(typeof rcObj.icon !== "string") throw new Error("Error parsing recipe. `icon` is required and must be a string!");
      IO_ORDER_MAP.each((nameIo, ord) => {
        if(rcObj[nameIo] == null) return;
        if(!(rcObj[nameIo] instanceof Array)) throw new Error("Error parsing recipe. `${1}` must be an array!".format(nameIo));
        if(rcObj[nameIo].length % ord !== 0) throw new Error("Error parsing recipe. Length of `${1}` should be multiple of ${2}, length found: ${3}".format(nameIo, ord, rcObj[nameIo].length));
      });
      CLS_contentTemplateParser.parseFields(rcObj);
      i += 2;
    };
    // A special tag, just in case
    obj.isFromJson = true;

    return {rc: obj};
  };
  exports._rcMdlJson = _rcMdlJson;


  /**
   * Gets base object in a recipe module.
   * @param {RecipeModule} rcMdl
   * @return {RecipeBase}
   */
  const _rcBase = function(rcMdl) {
    return rcMdl == null ?
      Object.air :
      tryVal(rcMdl.rc.base, Object.air);
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
      tryVal(rcMdl.rc.recipe, Array.air);
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
   * Converts given header to final header used for reading data.
   * @param {RecipeModule} rcMdl
   * @param {string} rcHeader
   * @return {string}
   */
  const convertHeader = function(rcMdl, rcHeader) {
    return rcMdl.rc.hearderMigration == null ?
      rcHeader :
      tryVal(rcMdl.rc.hearderMigration[rcHeader], rcHeader);
  };
  exports.convertHeader = convertHeader;


  /**
   * Gets a recipe object by header in `rcMdl`.
   * @param {RecipeModule} rcMdl
   * @param {string} rcHeader
   * @return {RecipeObject|null}
   */
  const _rcObj = function(rcMdl, rcHeader) {
    return _rcLi(rcMdl).read(convertHeader(rcMdl, rcHeader), null);
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
    rcHeader = convertHeader(rcMdl, rcHeader);
    let rcLi = _rcLi(rcMdl), tmpHeader;
    let i = 0, iCap = rcLi.iCap();
    while(i < iCap) {
      tmpHeader = rcLi[i];
      if(tmpHeader == rcHeader) return true;
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
    return _rcHeaders(rcMdl).some(rcHeader => {
      _ci(thisFun.fakeRc.ci, rcMdl, rcHeader);
      _bi(thisFun.fakeRc.bi, rcMdl, rcHeader);
      _aux(thisFun.fakeRc.aux, rcMdl, rcHeader);
      _opt(thisFun.fakeRc.opt, rcMdl, rcHeader);

      return CLS_recipe.checkInput(thisFun.fakeRc, rs_gn);
    });
  }
  .setProp({
    fakeRc: {
      ci: [],
      bi: [],
      aux: [],
      opt: [],
    },
  });
  exports._hasInput = _hasInput;


  /**
   * Whether there's any payload input in `rcMdl`.
   * @param {RecipeModule} rcMdl
   * @return {boolean}
   */
  const _hasAnyPayInput = function thisFun(rcMdl) {
    return _rcHeaders(rcMdl).some(rcHeader => {
      _payi(thisFun.fakeRc.payi, rcMdl, rcHeader);

      return CLS_recipe.checkAnyPayInput(thisFun.fakeRc);
    });
  }
  .setProp({
    fakeRc: {
      payi: [],
    },
  });
  exports._hasAnyPayInput = _hasAnyPayInput;


  /**
   * Whether some resource exists in the outputs of `rcMdl`.
   * @param {ResourceGn} rs_gn
   * @param {RecipeModule} rcMdl
   * @return {boolean}
   */
  const _hasOutput = function thisFun(rs_gn, rcMdl) {
    return _rcHeaders(rcMdl).some(rcHeader => {
      _co(thisFun.fakeRc.co, rcMdl, rcHeader);
      _bo(thisFun.fakeRc.bo, rcMdl, rcHeader);
      _fo(thisFun.fakeRc.fo, rcMdl, rcHeader);

      return CLS_recipe.checkOutput(thisFun.fakeRc, rs_gn);
    });
  }
  .setProp({
    fakeRc: {
      co: [],
      bo: [],
      fo: [],
    },
  });
  exports._hasOutput = _hasOutput;


  /**
   * Whether there's any item output in `rcMdl`.
   * @param {RecipeModule} rcMdl
   * @return {boolean}
   */
  const _hasAnyItmOutput = function thisFun(rcMdl) {
    return _rcHeaders(rcMdl).some(rcHeader => {
      _bo(thisFun.fakeRc.bo, rcMdl, rcHeader);
      _fo(thisFun.fakeRc.fo, rcMdl, rcHeader);

      return CLS_recipe.checkAnyItmOutput(thisFun.fakeRc);
    });
  }
  .setProp({
    fakeRc: {
      bo: [],
      fo: [],
    },
  });
  exports._hasAnyItmOutput = _hasAnyItmOutput;


  /**
   * Whether there's any fluid output in `rcMdl`.
   * @param {RecipeModule} rcMdl
   * @return {boolean}
   */
  const _hasAnyFldOutput = function thisFun(rcMdl, includeAux) {
    return _rcHeaders(rcMdl).some(rcHeader => {
      _co(thisFun.fakeRc.co, rcMdl, rcHeader);
      _bo(thisFun.fakeRc.bo, rcMdl, rcHeader);

      return CLS_recipe.checkAnyFldOutput(thisFun.fakeRc, includeAux);
    });
  }
  .setProp({
    fakeRc: {
      co: [],
      bo: [],
    },
  });
  exports._hasAnyFldOutput = _hasAnyFldOutput;


  /**
   * Whether there's any payload output in `rcMdl`.
   * @param {RecipeModule} rcMdl
   * @return {boolean}
   */
  const _hasAnyPayOutput = function thisFun(rcMdl) {
    return _rcHeaders(rcMdl).some(rcHeader => {
      _payo(thisFun.fakeRc.payo, rcMdl, rcHeader);

      return CLS_recipe.checkAnyPayOutput(thisFun.fakeRc);
    });
  }
  .setProp({
    fakeRc: {
      payo: [],
    },
  });
  exports._hasAnyPayOutput = _hasAnyPayOutput;


  /**
   * Whether there's Erekir heat input in `rcMdl`.
   * @param {RecipeModule} rcMdl
   * @return {boolean}
   */
  const _hasErekirHeatInput = function(rcMdl) {
    return rcMdl.rc.base.baseErekirHeatReq > 0.0 || rcMdl.rc.recipe.some(tmp => typeof tmp === "object" && tmp.erekirHeatReq != null && tmp.erekirHeatReq > 0.0);
  };
  exports._hasErekirHeatInput = _hasErekirHeatInput;


  /**
   * Whether there's Erekir heat output in `rcMdl`.
   * @param {RecipeModule} rcMdl
   * @return {boolean}
   */
  const _hasErekirHeatOutput = function(rcMdl) {
    return rcMdl.rc.base.baseErekirHeatProd > 0.0 || rcMdl.rc.recipe.some(tmp => typeof tmp === "object" && tmp.erekirHeatProd != null && tmp.erekirHeatProd > 0.0);
  };
  exports._hasErekirHeatOutput = _hasErekirHeatOutput;


  const RecipeKeyResourceModes = new CLS_enum({
    ITEM: 0,
    FLUID: 1,
    PAYLOAD: 2,
  })
  .globalize("RecipeKeyResourceModes");


  /**
   * Gets resource-header map for auto-selection.
   * @param {ObjectMap|unset} contArr
   * @param {RecipeModule} rcMdl
   * @param {number|unset} [mode] - See {@link RecipeKeyResourceModes}.
   * @return {ObjectMap}
   */
  const _keyCtHeaderMap = function thisFun(contMap, rcMdl, mode) {
    let map;
    if(contMap == null) {
      map = new ObjectMap();
    } else {
      map = contMap;
      map.clear();
    };
    if(mode == null) mode = RecipeKeyResourceModes.ITEM;

    let ct, keyCt;
    rcMdl.rc.recipe.forEachRow(2, (rcHeader, rcObj) => {
      keyCt = tryVal(rcObj.keyCt, rcObj.icon);
      if(typeof keyCt === "string") {
        if(keyCt.startsWith("GROUP: ")) {
          // "GROUP: xxx"
          keyCt = keyCt.replace("GROUP: ", "");
          DB_recipe.db["gen"]["group"].readList(keyCt).forEachFast(tup => {
            // Group is used for items and fluids only
            ct = MDL_content._ct(tup[0], "rs");
            thisFun.handleCt(map, ct, rcHeader, mode);
          });
        } else {
          // Content name
          ct = MDL_content._ct(keyCt, null, true);
          thisFun.handleCt(map, ct, rcHeader, mode);
        };
      } else if(keyCt instanceof UnlockableContent) {
        // Content
        thisFun.handleCt(map, keyCt, rcHeader, mode);
      } else if(keyCt instanceof Array) {
        // Array of contents or content names
        keyCt.forEachFast(name => {
          ct = MDL_content._ct(name, null, true);
          thisFun.handleCt(map, ct, rcHeader, mode);
        });
      };
    });

    return map;
  }
  .setProp({
    handleCt: function(map, ct, rcHeader, mode) {
      if(ct == null) return;
      if(map.containsKey(ct)) {
        console.warn('[LOVEC] Key content ${1} under header "${2}" occurs more than once!'.format(ct.name, rcHeader));
      };
      let cond = false;
      switch(mode) {
        case RecipeKeyResourceModes.ITEM :
          cond = ct instanceof Item;
          break;
        case RecipeKeyResourceModes.FLUID :
          cond = ct instanceof Liquid;
          break;
        case RecipeKeyResourceModes.PAYLOAD :
          cond = instanceOfAny(ct, Block, UnitType);
          break;
        default :
          throw new Error("${1} cannot be a key content!".format(ct.name));
      };
      if(!cond) return;
      map.put(ct, rcHeader);
    },
  });
  exports._keyCtHeaderMap = _keyCtHeaderMap;


  /* <------------------------------ recipe fields ------------------------------ */


  /**
   * Gets icon string of a recipe.
   * @param {RecipeModule} rcMdl
   * @param {string} rcHeader
   * @return {string}
   */
  const _iconName = function(rcMdl, rcHeader) {
    return _rcVal(rcMdl, rcHeader, "icon", "null");
  };
  exports._iconName = _iconName;


  /**
   * Gets icon of a recipe.
   * @param {RecipeModule} rcMdl
   * @param {string} rcHeader
   * @param {boolean|unset} [notContent]
   * @return {TextureRegionDrawable}
   */
  const _icon = function(rcMdl, rcHeader, notContent) {
    let iconName = _iconName(rcMdl, rcHeader);
    if(notContent) return new TextureRegionDrawable(Core.atlas.find(iconName)).tint(_rcVal(rcMdl, rcHeader, "tint", Color.white));
    let ct = MDL_content._ct(iconName, null, true);

    return ct == null ?
      Icon.cancel :
      new TextureRegionDrawable(ct.uiIcon).tint(_rcVal(rcMdl, rcHeader, "tint", Color.white));
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
    let arr = [];

    let rcLi = _rcLi(rcMdl);
    let i = 0, iCap = rcLi.iCap(), categ;
    while(i < iCap) {
      categ = tryVal(rcLi[i + 1]["category"], "uncategorized");
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
    let obj = {};

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
   * `BUNDLE`: "term.common-term-categ-<categ>.name".
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
   * Whether some content has not been found in this recipe.
   * Do not set this field.
   * @param {RecipeModule} rcMdl
   * @param {string} rcHeader
   * @return {boolean}
   */
  const _isIncomplete = function(rcMdl, rcHeader) {
    return _rcVal(rcMdl, rcHeader, "isIncomplete", false);
  };
  exports._isIncomplete = _isIncomplete;


  /**
   * Gets the function used to check whether this recipe is allowed now.
   * @param {RecipeModule} rcMdl
   * @param {string} rcHeader
   * @return {function(Building): boolean}
   */
  const _validCheck = function(rcMdl, rcHeader) {
    return _rcVal(rcMdl, rcHeader, "validCheck", Function.airTrue);
  };
  exports._validCheck = _validCheck;


  /**
   * Gets contents required to be unlocked for this recipe.
   * @param {RecipeModule} rcMdl
   * @param {string} rcHeader
   * @param {boolean|unset} [toCts]
   * @return {Array<string>|Array<UnlockableContent>}
   */
  const _lockedBy = function(rcMdl, rcHeader, toCts) {
    let arr = _rcVal(rcMdl, rcHeader, "lockedBy", Array.air);
    if(!toCts) return arr;

    let cts = [], ct;
    arr.forEachFast(nameCt => {
      ct = MDL_content._ct(nameCt, null, true);
      if(ct != null) cts.pushUnique(ct);
    });

    return cts;
  };
  exports._lockedBy = _lockedBy;


  /**
   * Gets the final `validCheck` used in multi-crafters.
   * @param {RecipeModule} rcMdl
   * @param {string} rcHeader
   * @return {function(Building): boolean}
   */
  const _finalValidCheck = function(rcMdl, rcHeader) {
    let validCheck = _validCheck(rcMdl, rcHeader);
    let cts = _lockedBy(rcMdl, rcHeader, true);

    return cts.length === 0 ?
      validCheck :
      validCheck === Function.airTrue ?
        function(b) {
          return cts.every(ct => ct.unlockedNow());
        } :
        function(b) {
          return validCheck(b) && ct.every(ct => ct.unlockedNow());
        };
  };
  exports._finalValidCheck = _finalValidCheck;


  /**
   * Variant of {@link _finalValidCheck} for tuple.
   * @param {Array|unset} contTup
   * @param {RecipeModule} rcMdl
   * @param {string} rcHeader
   * @return {[function(): boolean]}
   */
  const _validTup = function(contTup, rcMdl, rcHeader) {
    let tup = contTup != null ? contTup.clear() : [];

    tup.push(_finalValidCheck(rcMdl, rcHeader));

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
   * Gets extra block pollution of a recipe.
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
   * Gets requirement of Erekir heat.
   * Not used in ProjReind.
   * @param {RecipeModule} rcMdl
   * @param {string} rcHeader
   * @return {number}
   */
  const _erekirHeatReq = function(rcMdl, rcHeader) {
    return _rcVal(rcMdl, rcHeader, "erekirHeatReq", _rcBaseVal(rcMdl, "baseErekirHeatReq", 0.0));
  };
  exports._erekirHeatReq = _erekirHeatReq;


  /**
   * Gets output of Erekir heat.
   * Not used in ProjReind.
   * @param {RecipeModule} rcMdl
   * @param {string} rcHeader
   * @return {number}
   */
  const _erekirHeatProd = function(rcMdl, rcHeader) {
    return _rcVal(rcMdl, rcHeader, "erekirHeatProd", _rcBaseVal(rcMdl, "baseErekirHeatProd", 0.0));
  };
  exports._erekirHeatProd = _erekirHeatProd;


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
   * Gets tooltip of this recipe, nullable.
   * <br> `BUNDLE`: "info.common-info-tt-<tooltip>.name".
   * @param {RecipeModule} rcMdl
   * @param {string} rcHeader
   * @return {string|null}
   */
  const _tt = function(rcMdl, rcHeader) {
    let tt = _rcVal(rcMdl, rcHeader, "tooltip", null);
    return tt == null ?
      null :
      MDL_bundle._info("common", "tt-" + tt);
  };
  exports._tt = _tt;


  /* <------------------------------ recipe I/O ------------------------------ */


  /**
   * Adds recipe data to recipe dictionary.
   * Should be called on INIT.
   * @param {RecipeModule} rcMdl
   * @param {Block} blkInit - Owner of the recipes.
   * @return {void}
   */
  const initRc = function thisFun(rcMdl, blkInit) {
    if(thisFun.blks.includes(blkInit)) throw new Error("Block ${1} has its recipe initialized more than once???".format(blkInit.name));

    let initParamObj;
    _rcHeaders(rcMdl).forEachFast(rcHeader => {
      initParamObj = {
        blk: blkInit,
        timeScl: _timeScl(rcMdl, rcHeader),
        failP: _failP(rcMdl, rcHeader),
      };
      _ci(null, rcMdl, rcHeader, false, initParamObj);
      _bi(null, rcMdl, rcHeader, false, initParamObj);
      _aux(null, rcMdl, rcHeader, false, initParamObj);
      _opt(null, rcMdl, rcHeader, false, initParamObj);
      _payi(null, rcMdl, rcHeader, false, initParamObj);
      _co(null, rcMdl, rcHeader, false, initParamObj);
      _bo(null, rcMdl, rcHeader, false, initParamObj);
      _fo(null, rcMdl, rcHeader, false, initParamObj);
      _payo(null, rcMdl, rcHeader, false, initParamObj);
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
   * @param {function(UnlockableContent, number, number|null): void} [ctCaller] - `ARGS`: ct, amt, p.
   * @param {boolean|unset} [isSecondary] - Do not set this.
   * @param {number|unset} [pTg]
   * @return {void}
   */
  const parseRcIoRow = function thisFun(outArr, tg, amt, p, ctCaller, isSecondary, pTg) {
    if(ctCaller == null) ctCaller = Function.air;
    if(pTg == null) pTg = 1.0;
    let isContinuous = p == null;

    if(tg instanceof Array) {
      // Alternative input
      let i = 0, iCap = tg.iCap(), tmpArr = [];
      while(i < iCap) {
        parseRcIoRow(tmpArr, tg[i], tg[i + 1], isContinuous ? null : tg[i + 2], ctCaller, true, pTg);
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
    } else if(typeof tg === "string") {
      if(tg.startsWith("GROUP: ")) {
        // GROUP: xxx
        let tmpArr = [];
        DB_recipe.db["gen"]["group"].readList(tg.replace("GROUP: ", "")).forEachFast(tup => {
          parseRcIoRow(
            tmpArr, tup[0],
            amt * readParam(tup[1], "amtScl", 1.0),
            isContinuous ? null : (p * readParam(tup[1], "pScl", 1.0)),
            ctCaller, true, pTg,
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
          console.warn("[LOVEC] No content found under ${1}!".format(tg.color(Pal.accent)));
        };
      } else if(tg.startsWith("COST: ")) {
        // COST: xxx
        let blk = MDL_content._ct(tg.replace("COST: ", ""), "blk");
        if(blk == null) {
          thisFun.reportIncompleteRc(tg);
        } else {
          blk.requirements.forEachFast(itmStack => {
            parseRcIoRow(outArr, itmStack.item, itmStack.amount, 1.0, ctCaller, false, pTg);
          });
        };
      } else {
        // Content name
        let ct = MDL_content._ct(tg, null, true);
        if(ct == null) {
          thisFun.reportIncompleteRc(tg);
        } else {
          parseRcIoRow(outArr, ct, amt, p, ctCaller, false, pTg);
        };
      };
    } else if(tg instanceof UnlockableContent) {
      // Content
      if(isContinuous) {
        outArr.push(tg, amt);
        ctCaller(tg, amt, null);
      } else {
        outArr.push(tg, Math.round(amt / pTg), p * pTg);
        ctCaller(tg, Math.round(amt / pTg), p * pTg);
      };
    } else {
      printObj(tg);
      throw new Error("WTF did you put into the I/O array???");
    };
  }
  .setProp({
    reportIncompleteRc: function(name) {
      CLS_recipeGenerator.RECIPE_OBJECT_TMP.isIncomplete = true;
      if(CLS_recipeGenerator.RECIPE_OBJECT_TMP.erroredNames == null) CLS_recipeGenerator.RECIPE_OBJECT_TMP.erroredNames = [];
      CLS_recipeGenerator.RECIPE_OBJECT_TMP.erroredNames.pushUnique(name);
    },
  });
  exports.parseRcIoRow = parseRcIoRow;


  /**
   * Parses given I/O data.
   * @param {Array|unset} contArr
   * @param {string} name
   * @param {RecipeModule} rcMdl
   * @param {string} rcHeader
   * @param {boolean|unset} [ignoreBase] - If true, "baseXxx" is not included.
   * @param {Object|unset} [initParamObj]
   * @return {Array}
   */
  const parseRcIo = function thisFun(contArr, name, rcMdl, rcHeader, ignoreBase, initParamObj) {
    if(!IO_ORDER_MAP.containsKey(name)) throw new Error("`${1}` is not a valid IO name!".format(name));

    let arr = contArr != null ? contArr.clear() : [];

    let baseName = "base" + name.firstUpperCase();
    let raw = ignoreBase ?
      _rcVal(rcMdl, rcHeader, name, Array.air) :
      _rcBaseVal(rcMdl, baseName, Array.air).concat(_rcVal(rcMdl, rcHeader, name, Array.air));

    let
      i = 0,
      iCap = raw.iCap(),
      ord = IO_ORDER_MAP.get(name),
      ctCaller = null;

    // It's OK to hard code this I guess
    switch(name) {

      case "ci" :
        ctCaller = function(ct, amt) {
          if(initParamObj == null || amt < 0.0001) return;
          MDL_recipeDict.addFldConsTerm(
            readParam(initParamObj, "blk"),
            ct,
            amt,
            {
              ct: _iconName(rcMdl, rcHeader),
              ctTint: _rcVal(rcMdl, rcHeader, "tint"),
              ctTableF: (tb, blk, ct) => CLS_recipe.get(blk, rcHeader).displayTooltip(tb, true, blk.localizedName),
            },
          );
        };
        break;

      case "bi" :
        ctCaller = function(ct, amt, p) {
          if(initParamObj == null || amt <= 0) return;
          ct instanceof Item ?
            MDL_recipeDict.addItmConsTerm(
              readParam(initParamObj, "blk"),
              ct,
              amt / readParam(initParamObj, "timeScl", 1.0),
              p,
              {
                ct: _iconName(rcMdl, rcHeader),
                ctTint: _rcVal(rcMdl, rcHeader, "tint"),
                ctTableF: (tb, blk, ct) => CLS_recipe.get(blk, rcHeader).displayTooltip(tb, true, blk.localizedName),
              },
            ) :
            MDL_recipeDict.addFldConsTerm(
              readParam(initParamObj, "blk", null),
              ct,
              amt / readParam(initParamObj, "blk").craftTime / readParam(initParamObj, "timeScl", 1.0),
              {
                ct: _iconName(rcMdl, rcHeader),
                ctTint: _rcVal(rcMdl, rcHeader, "tint"),
                ctTableF: (tb, blk, ct) => CLS_recipe.get(blk, rcHeader).displayTooltip(tb, true, blk.localizedName),
              },
            );
        };
        break;

      case "aux" :
        ctCaller = function(ct, amt) {
          if(initParamObj == null || amt < 0.0001) return;
          MDL_recipeDict.addFldConsTerm(
            readParam(initParamObj, "blk"),
            ct,
            amt,
            {
              ct: _iconName(rcMdl, rcHeader),
              ctTint: _rcVal(rcMdl, rcHeader, "tint"),
              ctTableF: (tb, blk, ct) => CLS_recipe.get(blk, rcHeader).displayTooltip(tb, true, blk.localizedName),
            },
          );
        };
        break;

      case "opt" :
        ctCaller = function(ct, amt, p) {
          if(initParamObj == null || amt <= 0) return;
          MDL_recipeDict.addItmConsTerm(
            readParam(initParamObj, "blk"),
            ct,
            amt / readParam(initParamObj, "timeScl", 1.0),
            p,
            {
              ct: _iconName(rcMdl, rcHeader),
              ctTint: _rcVal(rcMdl, rcHeader, "tint"),
              ctTableF: (tb, blk, ct) => CLS_recipe.get(blk, rcHeader).displayTooltip(tb, true, blk.localizedName),
              icon: "lovec-icon-boost",
            },
          );
        };
        break;

      case "payi" :
        ctCaller = function(ct, amt) {
          if(initParamObj == null || amt <= 0) return;
          MDL_recipeDict.addPayConsTerm(
            readParam(initParamObj, "blk"),
            ct,
            amt / readParam(initParamObj, "timeScl", 1.0),
            {
              ct: _iconName(rcMdl, rcHeader),
              ctTint: _rcVal(rcMdl, rcHeader, "tint"),
              ctTableF: (tb, blk, ct) => CLS_recipe.get(blk, rcHeader).displayTooltip(tb, true, blk.localizedName),
            },
          );
        };
        break;

      case "co" :
        ctCaller = function(ct, amt) {
          if(initParamObj == null || amt < 0.0001) return;
          MDL_recipeDict.addFldProdTerm(
            readParam(initParamObj, "blk"),
            ct,
            amt,
            {
              ct: _iconName(rcMdl, rcHeader),
              ctTint: _rcVal(rcMdl, rcHeader, "tint"),
              ctTableF: (tb, blk, ct) => CLS_recipe.get(blk, rcHeader).displayTooltip(tb, true, blk.localizedName),
            },
          );
        };
        break;

      case "bo" :
        ctCaller = function(ct, amt, p) {
          if(initParamObj == null || amt <= 0) return;
          MDL_recipeDict.addItmProdTerm(
            readParam(initParamObj, "blk"),
            ct,
            amt / readParam(initParamObj, "timeScl", 1.0),
            p * (readParam(initParamObj, "failP") == null ? 1.0 : (1.0 - readParam(initParamObj, "failP"))),
            {
              ct: _iconName(rcMdl, rcHeader),
              ctTint: _rcVal(rcMdl, rcHeader, "tint"),
              ctTableF: (tb, blk, ct) => CLS_recipe.get(blk, rcHeader).displayTooltip(tb, true, blk.localizedName),
            },
          );
        };
        break;

      case "fo" :
        ctCaller = function(ct, amt, p) {
          if(initParamObj == null || amt <= 0) return;
          MDL_recipeDict.addItmProdTerm(
            readParam(initParamObj, "blk"),
            ct,
            amt / readParam(initParamObj, "timeScl", 1.0),
            p * (readParam(initParamObj, "failP") == null ? 0.0 : readParam(initParamObj, "failP")),
            {
              ct: _iconName(rcMdl, rcHeader),
              ctTint: _rcVal(rcMdl, rcHeader, "tint"),
              ctTableF: (tb, blk, ct) => CLS_recipe.get(blk, rcHeader).displayTooltip(tb, true, blk.localizedName),
            },
          );
        };
        break;

      case "payo" :
        ctCaller = function(ct, amt) {
          if(initParamObj == null || amt <= 0) return;
          MDL_recipeDict.addPayProdTerm(
            readParam(initParamObj, "blk"),
            ct,
            amt / readParam(initParamObj, "timeScl", 1.0),
            {
              ct: _iconName(rcMdl, rcHeader),
              ctTint: _rcVal(rcMdl, rcHeader, "tint"),
              ctTableF: (tb, blk, ct) => CLS_recipe.get(blk, rcHeader).displayTooltip(tb, true, blk.localizedName),
            },
          );
        };
        break;

    };

    while(i < iCap) {
      parseRcIoRow(
        arr, raw[i], raw[i + 1],
        ord === 2 ? null : raw[i + 2],
        ctCaller,
      );

      if(name === "opt") {
        arr.push(Number(raw[i + 3]));
      };

      i += ord;
    };

    return arr;
  };
  exports.parseRcIo = parseRcIo;



  /**
   * Gets parsed CI data.
   * @param {Array|unset} contArr
   * @param {RecipeModule} rcMdl
   * @param {string} rcHeader
   * @param {boolean|unset} [ignoreBase]
   * @param {Object|unset} [initParamObj]
   * @return {Array}
   */
  const _ci = function(contArr, rcMdl, rcHeader, ignoreBase, initParamObj) {
    return parseRcIo(contArr, "ci", rcMdl, rcHeader, ignoreBase, initParamObj);
  };
  exports._ci = _ci;


  /**
   * Gets parsed BI data.
   * @param {Array|unset} contArr
   * @param {RecipeModule} rcMdl
   * @param {string} rcHeader
   * @param {boolean|unset} [ignoreBase]
   * @param {Object|unset} [initParamObj]
   * @return {Array}
   */
  const _bi = function(contArr, rcMdl, rcHeader, ignoreBase, initParamObj) {
    return parseRcIo(contArr, "bi", rcMdl, rcHeader, ignoreBase, initParamObj);
  };
  exports._bi = _bi;


  /**
   * Gets parsed AUX data.
   * @param {Array|unset} contArr
   * @param {RecipeModule} rcMdl
   * @param {string} rcHeader
   * @param {boolean|unset} [ignoreBase]
   * @param {Object|unset} [initParamObj]
   * @return {Array}
   */
  const _aux = function(contArr, rcMdl, rcHeader, ignoreBase, initParamObj) {
    return parseRcIo(contArr, "aux", rcMdl, rcHeader, ignoreBase, initParamObj);
  };
  exports._aux = _aux;


  /**
   * Whether at least one OPT should be met for this recipe.
   * @param {RecipeModule} rcMdl
   * @param {string} rcHeader
   * @return {boolean}
   */
  const _reqOpt = function(rcMdl, rcHeader) {
    return _rcVal(rcMdl, rcHeader, "reqOpt", _rcBaseVal(rcMdl, "baseReqOpt", false));
  };
  exports._reqOpt = _reqOpt;


  /**
   * Gets parsed OPT data.
   * @param {Array|unset} contArr
   * @param {RecipeModule} rcMdl
   * @param {string} rcHeader
   * @param {boolean|unset} [ignoreBase]
   * @param {Object|unset} [initParamObj]
   * @return {Array}
   */
  const _opt = function(contArr, rcMdl, rcHeader, ignoreBase, initParamObj) {
    return parseRcIo(contArr, "opt", rcMdl, rcHeader, ignoreBase, initParamObj);
  };
  exports._opt = _opt;


  /**
   * Gets parsed PAYI data.
   * @param {Array|unset} contArr
   * @param {RecipeModule} rcMdl
   * @param {string} rcHeader
   * @param {boolean|unset} [ignoreBase]
   * @param {Object|unset} [initParamObj]
   * @return {Array}
   */
  const _payi = function(contArr, rcMdl, rcHeader, ignoreBase, initParamObj) {
    return parseRcIo(contArr, "payi", rcMdl, rcHeader, ignoreBase, initParamObj).inSituMap(ele => ele instanceof UnlockableContent ? ele.name : ele);
  };
  exports._payi = _payi;


  /**
   * Gets parsed CO data.
   * @param {Array|unset} contArr
   * @param {RecipeModule} rcMdl
   * @param {string} rcHeader
   * @param {boolean|unset} [ignoreBase]
   * @param {Object|unset} [initParamObj]
   * @return {Array}
   */
  const _co = function(contArr, rcMdl, rcHeader, ignoreBase, initParamObj) {
    return parseRcIo(contArr, "co", rcMdl, rcHeader, ignoreBase, initParamObj);
  };
  exports._co = _co;


  /**
   * Gets parsed BO data.
   * @param {Array|unset} contArr
   * @param {RecipeModule} rcMdl
   * @param {string} rcHeader
   * @param {boolean|unset} [ignoreBase]
   * @param {Object|unset} [initParamObj]
   * @return {Array}
   */
  const _bo = function(contArr, rcMdl, rcHeader, ignoreBase, initParamObj) {
    return parseRcIo(contArr, "bo", rcMdl, rcHeader, ignoreBase, initParamObj);
  };
  exports._bo = _bo;


  /**
   * Gets chance to fail a recipe.
   * @param {RecipeModule} rcMdl
   * @param {string} rcHeader
   * @return {number}
   */
  const _failP = function(rcMdl, rcHeader) {
    return _rcVal(rcMdl, rcHeader, "failP", _rcBaseVal(rcMdl, "baseFailP", 0.0));
  };
  exports._failP = _failP;


  /**
   * Gets parsed FO data.
   * @param {Array|unset} contArr
   * @param {RecipeModule} rcMdl
   * @param {string} rcHeader
   * @param {boolean|unset} [ignoreBase]
   * @param {Object|unset} [initParamObj]
   * @return {Array}
   */
  const _fo = function(contArr, rcMdl, rcHeader, ignoreBase, initParamObj) {
    return parseRcIo(contArr, "fo", rcMdl, rcHeader, ignoreBase, initParamObj);
  };
  exports._fo = _fo;


  /**
   * Gets parsed PAYO data.
   * @param {Array|unset} contArr
   * @param {RecipeModule} rcMdl
   * @param {string} rcHeader
   * @param {boolean|unset} [ignoreBase]
   * @param {Object|unset} [initParamObj]
   * @return {Array}
   */
  const _payo = function(contArr, rcMdl, rcHeader, ignoreBase, initParamObj) {
    return parseRcIo(contArr, "payo", rcMdl, rcHeader, ignoreBase, initParamObj).inSituMap(ele => ele instanceof UnlockableContent ? ele.name : ele);
  };
  exports._payo = _payo;


  /**
   * Gets a recipe script.
   * @param {RecipeModule} rcMdl
   * @param {string} rcHeader
   * @param {string} name
   * @return {function(Building): void}
   */
  const processRcScr = function(rcMdl, rcHeader, name) {
    let
      scr = _rcVal(rcMdl, rcHeader, name, null),
      baseScr = _rcBaseVal(rcMdl, "base" + name.firstUpperCase, null);

    return scr == null && baseScr == null ?
      Function.air :
      scr != null ?
        scr :
        baseScr != null ?
          baseScr :
          function(b) {
            baseScr(b);
            scr(b);
          };
  };
  exports.processRcScr = processRcScr;


  /**
   * Gets script called whenever this building updates.
   * @param {RecipeModule} rcMdl
   * @param {string} rcHeader
   * @return {function(Building): void}
   */
  const _updateScr = function(rcMdl, rcHeader) {
    return processRcScr(rcMdl, rcHeader, "updateScr");
  };
  exports._updateScr = _updateScr;


  /**
   * Gets script called every frame this the building is running.
   * @param {RecipeModule} rcMdl
   * @param {string} rcHeader
   * @return {function(Building): void}
   */
  const _runScr = function(rcMdl, rcHeader) {
    return processRcScr(rcMdl, rcHeader, "runScr");
  };
  exports._runScr = _runScr;


  /**
   * Gets script called when this building finishes crafting.
   * @param {RecipeModule} rcMdl
   * @param {string} rcHeader
   * @return {function(Building): void}
   */
  const _craftScr = function(rcMdl, rcHeader) {
    return processRcScr(rcMdl, rcHeader, "craftScr");
  };
  exports._craftScr = _craftScr;


  /**
   * Gets script called when this building is no longer running.
   * Won't be called if the building has never been active.
   * @param {RecipeModule} rcMdl
   * @param {string} rcHeader
   * @return {function(Building): void}
   */
  const _stopScr = function(rcMdl, rcHeader) {
    return processRcScr(rcMdl, rcHeader, "stopScr");
  };
  exports._stopScr = _stopScr;


  /**
   * Gets script called when this crafter fails its recipe.
   * @param {RecipeModule} rcMdl
   * @param {string} rcHeader
   * @return {function(Building): void}
   */
  const _failScr = function(rcMdl, rcHeader) {
    return processRcScr(rcMdl, rcHeader, "failScr");
  };
  exports._failScr = _failScr;


  /**
   * Gets a 5-tuple of recipe scripts.
   * @param {Array|unset} contTup
   * @param {RecipeModule} rcMdl
   * @param {string} rcHeader
   * @return {Array<function(Building): void>} - `TUPLE`: updateScr, runScr, craftScr, stopScr, failScr.
   */
  const _scrTup = function(contTup, rcMdl, rcHeader) {
    let tup = contTup != null ? contTup.clear() : [];

    tup.push(
      _updateScr(rcMdl, rcHeader),
      _runScr(rcMdl, rcHeader),
      _craftScr(rcMdl, rcHeader),
      _stopScr(rcMdl, rcHeader),
      _failScr(rcMdl, rcHeader),
    );

    return tup;
  };
  exports._scrTup = _scrTup;


  /**
   * Gets a 2-tuple of items and fluids to dump.
   * CO not included due to `liquidOutputDirections`.
   * @param {Array|unset} contTup
   * @param {Block} blk
   * @param {RecipeModule} rcMdl
   * @param {string} rcHeader
   * @return {[Array<Item>, Array<Liquid>]}
   */
  const _dumpTup = function thisFun(contTup, blk, rcMdl, rcHeader) {
    let tup = contTup != null ? contTup : [[], []];
    tup[0].clear();
    tup[1].clear();

    let i, iCap, tmp;

    // BO
    _bo(thisFun.tmpArr1, rcMdl, rcHeader);
    i = 0;
    iCap = thisFun.tmpArr1.iCap();
    while(i < iCap) {
      tmp = thisFun.tmpArr1[i];
      if(blk.hasItems && tmp instanceof Item) tup[0].pushUnique(tmp);
      if(blk.hasLiquids && tmp instanceof Liquid) tup[1].pushUnique(tmp);
      i += 3;
    };

    // FO
    if(blk.hasItems) {
      _fo(thisFun.tmpArr2, rcMdl, rcHeader);
      i = 0;
      iCap = thisFun.tmpArr2.iCap();
      while(i < iCap) {
        tup[0].pushUnique(thisFun.tmpArr2[i]);
        i += 3;
      };
    };

    return tup;
  }
  .setProp({
    tmpArr1: [],
    tmpArr2: [],
  });
  exports._dumpTup = _dumpTup;


  /**
   * Gets effect used when recipe is failed.
   * Nullable for default effect.
   * @param {RecipeModule} rcMdl
   * @param {string} rcHeader
   * @return {Effect|null}
   */
  const _failEff = function(rcMdl, rcHeader) {
    return _rcVal(rcMdl, rcHeader, "failEff", _rcBaseVal(rcMdl, "baseFailEff", null));
  };
  exports._failEff = _failEff;


  /**
   * Gets drawer of this recipe, see "DrawRecipe" in {@link TP_drawer}.
   * @param {RecipeModule} rcMdl
   * @param {string} rcHeader
   * @return {DrawBlock|null}
   */
  const _drawer = function(rcMdl, rcHeader) {
    return _rcVal(rcMdl, rcHeader, "drawer", null);
  };
  exports._drawer = _drawer;


  /* <------------------------------ specific ------------------------------ */


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
