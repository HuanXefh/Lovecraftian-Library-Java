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
  const getRcMdl = function(nameMod, nameBlk) {
    let rcMdl;
    try {
      rcMdl = require(nameMod + "/auxFi/rc/" + nameBlk);
    } catch(err) {
      let obj = getRcMdlFromJson(nameMod, nameBlk);
      if(obj != null) {
        rcMdl = obj;
      } else {
        throw new Error("Failed to load recipe for " + nameMod + "-" + nameBlk + ":\n" + err);
      };
    };

    return rcMdl;
  };
  exports.getRcMdl = getRcMdl;


  /**
   * Gets recipe module from JSON file.
   * Used in {@link getRcMdl}.
   * @param {string} nameMod
   * @param {string} nameBlk
   * @return {RecipeModule}
   */
  const getRcMdlFromJson = function(nameMod, nameBlk) {
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
  exports.getRcMdlFromJson = getRcMdlFromJson;


  /**
   * Gets base object in a recipe module.
   * @param {RecipeModule} rcMdl
   * @return {RecipeBase}
   */
  const getRcBase = function(rcMdl) {
    return rcMdl == null ?
      Object.air :
      tryVal(rcMdl.rc.base, Object.air);
  };
  exports.getRcBase = getRcBase;


  /**
   * Gets some value in a base object.
   * @param {RecipeModule} rcMdl
   * @param {string} key
   * @param {any} [def]
   * @return {any}
   */
  const getRcBaseVal = function(rcMdl, key, def) {
    return tryVal(getRcBase(rcMdl)[key], def);
  };
  exports.getRcBaseVal= getRcBaseVal;


  /**
   * Gets all recipes in a recipe module.
   * @param {RecipeModule} rcMdl
   * @return {Array<RecipeObject>}
   */
  const getRcLi = function(rcMdl) {
    return rcMdl == null ?
      Array.air :
      tryVal(rcMdl.rc.recipe, Array.air);
  };
  exports.getRcLi = getRcLi;


  /**
   * Gets amount of recipe objects in a recipe module.
   * @param {RecipeModule} rcMdl
   * @return {number}
   */
  const getRcSize = function(rcMdl) {
    return getRcLi(rcMdl).iCap() / 2;
  };
  exports.getRcSize = getRcSize;


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
  const getRcObj = function(rcMdl, rcHeader) {
    return getRcLi(rcMdl).read(String(convertHeader(rcMdl, rcHeader)), null);
  };
  exports.getRcObj = getRcObj;


  /**
   * Gets all headers found in some recipe module.
   * @param {RecipeModule} rcMdl
   * @return {Array<string>}
   */
  const getRcHeaders = function(rcMdl) {
    return getRcLi(rcMdl).readCol(2, 0);
  };
  exports.getRcHeaders = getRcHeaders;


  /**
   * Gets all recipe objects found in `rcMdl`.
   * @param {RecipeModule} rcMdl
   * @return {Array<RecipeObject>}
   */
  const getRcObjs = function(rcMdl) {
    return getRcLi(rcMdl).readCol(2, 1);
  };
  exports.getRcObjs = getRcObjs;


  /**
   * Whether a header exists in `rcMdl`.
   * @param {RecipeModule} rcMdl
   * @param {string} rcHeader
   * @return {boolean}
   */
  const checkHeaderValid = function(rcMdl, rcHeader) {
    rcHeader = convertHeader(rcMdl, rcHeader);
    let rcLi = getRcLi(rcMdl), tmpHeader;
    let i = 0, iCap = rcLi.iCap();
    while(i < iCap) {
      tmpHeader = rcLi[i];
      if(tmpHeader == rcHeader) return true;
      i += 2;
    };

    return false;
  };
  exports.checkHeaderValid = checkHeaderValid;


  /**
   * Gets first header in `rcMdl`, which is usually the default header.
   * @param {RecipeModule} rcMdl
   * @return {string}
   */
  const getFirstHeader = function(rcMdl) {
    return tryVal(getRcLi(rcMdl)[0], "");
  };
  exports.getFirstHeader = getFirstHeader;


  /**
   * Gets a value in target recipe object if found.
   * @param {RecipeModule} rcMdl
   * @param {string} rcHeader
   * @param {string} key
   * @param {any} [def]
   * @return {any}
   */
  const getRcVal = function(rcMdl, rcHeader, key, def) {
    let rcObj = getRcObj(rcMdl, rcHeader);
    return rcObj == null ?
      def :
      tryVal(rcObj[key], def);
  };
  exports.getRcVal = getRcVal;


  /**
   * Whether some resource exists in the inputs of `rcMdl`.
   * @param {ResourceGn} rs_gn
   * @param {RecipeModule} rcMdl
   * @return {boolean}
   */
  const checkInput = function thisFun(rs_gn, rcMdl) {
    return getRcHeaders(rcMdl).some(rcHeader => {
      getCi(thisFun.fakeRc.ci, rcMdl, rcHeader);
      getBi(thisFun.fakeRc.bi, rcMdl, rcHeader);
      getAux(thisFun.fakeRc.aux, rcMdl, rcHeader);
      getOpt(thisFun.fakeRc.opt, rcMdl, rcHeader);

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
  exports.checkInput = checkInput;


  /**
   * Whether there's any payload input in `rcMdl`.
   * @param {RecipeModule} rcMdl
   * @return {boolean}
   */
  const checkAnyPayInput = function thisFun(rcMdl) {
    return getRcHeaders(rcMdl).some(rcHeader => {
      getPayi(thisFun.fakeRc.payi, rcMdl, rcHeader);

      return CLS_recipe.checkAnyPayInput(thisFun.fakeRc);
    });
  }
  .setProp({
    fakeRc: {
      payi: [],
    },
  });
  exports.checkAnyPayInput = checkAnyPayInput;


  /**
   * Whether some resource exists in the outputs of `rcMdl`.
   * @param {ResourceGn} rs_gn
   * @param {RecipeModule} rcMdl
   * @return {boolean}
   */
  const checkOutput = function thisFun(rs_gn, rcMdl) {
    return getRcHeaders(rcMdl).some(rcHeader => {
      getCo(thisFun.fakeRc.co, rcMdl, rcHeader);
      getBo(thisFun.fakeRc.bo, rcMdl, rcHeader);
      getFo(thisFun.fakeRc.fo, rcMdl, rcHeader);

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
  exports.checkOutput = checkOutput;


  /**
   * Whether there's any item output in `rcMdl`.
   * @param {RecipeModule} rcMdl
   * @return {boolean}
   */
  const checkAnyItmOutput = function thisFun(rcMdl) {
    return getRcHeaders(rcMdl).some(rcHeader => {
      getBo(thisFun.fakeRc.bo, rcMdl, rcHeader);
      getFo(thisFun.fakeRc.fo, rcMdl, rcHeader);

      return CLS_recipe.checkAnyItmOutput(thisFun.fakeRc);
    });
  }
  .setProp({
    fakeRc: {
      bo: [],
      fo: [],
    },
  });
  exports.checkAnyItmOutput = checkAnyItmOutput;


  /**
   * Whether there's any fluid output in `rcMdl`.
   * @param {RecipeModule} rcMdl
   * @return {boolean}
   */
  const checkAnyFldOutput = function thisFun(rcMdl, includeAux) {
    return getRcHeaders(rcMdl).some(rcHeader => {
      getCo(thisFun.fakeRc.co, rcMdl, rcHeader);
      getBo(thisFun.fakeRc.bo, rcMdl, rcHeader);

      return CLS_recipe.checkAnyFldOutput(thisFun.fakeRc, includeAux);
    });
  }
  .setProp({
    fakeRc: {
      co: [],
      bo: [],
    },
  });
  exports.checkAnyFldOutput = checkAnyFldOutput;


  /**
   * Whether there's any payload output in `rcMdl`.
   * @param {RecipeModule} rcMdl
   * @return {boolean}
   */
  const checkAnyPayOutput = function thisFun(rcMdl) {
    return getRcHeaders(rcMdl).some(rcHeader => {
      getPayo(thisFun.fakeRc.payo, rcMdl, rcHeader);

      return CLS_recipe.checkAnyPayOutput(thisFun.fakeRc);
    });
  }
  .setProp({
    fakeRc: {
      payo: [],
    },
  });
  exports.checkAnyPayOutput = checkAnyPayOutput;


  /**
   * Whether there's Erekir heat input in `rcMdl`.
   * @param {RecipeModule} rcMdl
   * @return {boolean}
   */
  const checkErekirHeatInput = function(rcMdl) {
    return rcMdl.rc.base.baseErekirHeatReq > 0.0 || rcMdl.rc.recipe.some(tmp => typeof tmp === "object" && tmp.erekirHeatReq != null && tmp.erekirHeatReq > 0.0);
  };
  exports.checkErekirHeatInput = checkErekirHeatInput;


  /**
   * Whether there's Erekir heat output in `rcMdl`.
   * @param {RecipeModule} rcMdl
   * @return {boolean}
   */
  const checkErekirHeatOutput = function(rcMdl) {
    return rcMdl.rc.base.baseErekirHeatProd > 0.0 || rcMdl.rc.recipe.some(tmp => typeof tmp === "object" && tmp.erekirHeatProd != null && tmp.erekirHeatProd > 0.0);
  };
  exports.checkErekirHeatOutput = checkErekirHeatOutput;


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
  const getKeyCtHeaderMap = function thisFun(contMap, rcMdl, mode) {
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
      rcHeader = String(rcHeader);
      keyCt = tryVal(rcObj.keyCt, rcObj.icon);
      if(typeof keyCt === "string") {
        if(keyCt.startsWith("GROUP: ")) {
          // "GROUP: xxx"
          keyCt = keyCt.replace("GROUP: ", "");
          DB_recipe.db["gen"]["group"].readList(keyCt).forEachFast(tup => {
            // Group is used for items and fluids only
            ct = MDL_content.getCt(tup[0], "rs");
            thisFun.handleCt(map, ct, rcHeader, mode);
          }, true);
        } else {
          // Content name
          ct = MDL_content.getCt(keyCt, null, true);
          thisFun.handleCt(map, ct, rcHeader, mode);
        };
      } else if(keyCt instanceof UnlockableContent) {
        // Content
        thisFun.handleCt(map, keyCt, rcHeader, mode);
      } else if(keyCt instanceof Array) {
        // Array of contents or content names
        keyCt.forEachFast(name => {
          ct = MDL_content.getCt(name, null, true);
          thisFun.handleCt(map, ct, rcHeader, mode);
        }, true);
      };
    }, true);

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
  exports.getKeyCtHeaderMap = getKeyCtHeaderMap;


  /* <------------------------------ recipe fields ------------------------------ */


  /**
   * Gets icon string of a recipe.
   * @param {RecipeModule} rcMdl
   * @param {string} rcHeader
   * @return {string}
   */
  const getIconName = function(rcMdl, rcHeader) {
    return getRcVal(rcMdl, rcHeader, "icon", "null");
  };
  exports.getIconName = getIconName;


  /**
   * Gets icon of a recipe.
   * @param {RecipeModule} rcMdl
   * @param {string} rcHeader
   * @param {boolean|unset} [notContent]
   * @return {TextureRegionDrawable}
   */
  const makeIcon = function(rcMdl, rcHeader, notContent) {
    let iconName = getIconName(rcMdl, rcHeader);
    if(notContent) return new TextureRegionDrawable(Core.atlas.find(iconName)).tint(getRcVal(rcMdl, rcHeader, "tint", Color.white));
    let ct = MDL_content.getCt(iconName, null, true);

    return ct == null ?
      Icon.cancel :
      new TextureRegionDrawable(ct.uiIcon).tint(getRcVal(rcMdl, rcHeader, "tint", Color.white));
  };
  exports.makeIcon = makeIcon;


  /**
   * Gets category of a recipe.
   * @param {RecipeModule} rcMdl
   * @param {string} rcHeader
   * @return {string}
   */
  const getCateg = function(rcMdl, rcHeader) {
    return getRcVal(rcMdl, rcHeader, "category", "uncategorized");
  };
  exports.getCateg = getCateg;


  /**
   * Gets all categories found in `rcMdl`.
   * "uncategorized" will always appear at the end.
   * @param {RecipeModule} rcMdl
   * @return {Array<string>}
   */
  const getCategs = function(rcMdl) {
    let arr = [];

    let rcLi = getRcLi(rcMdl);
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
  exports.getCategs = getCategs;


  /**
   * Gets object of categories and recipe headers.
   * @param {RecipeModule} rcMdl
   * @return {Object<string: string>}
   */
  const getCategHeaderObj = function(rcMdl) {
    let obj = {};

    let rcHeaders = getRcHeaders(rcMdl);
    getCategs(rcMdl).forEachFast(categ => {
      obj[categ] = [];
      rcHeaders.forEachFast(rcHeader => {
        if(getCateg(rcMdl, rcHeader) == categ) obj[categ].push(rcHeader);
      }, true);
    }, true);

    return obj;
  };
  exports.getCategHeaderObj = getCategHeaderObj;


  /**
   * `BUNDLE`: "term.common-term-categ-<categ>.name".
   * @param {string} categ
   * @return {string}
   */
  const getCategB = function(categ) {
    return MDL_bundle.getTerm("common", "categ-" + categ);
  };
  exports.getCategB = getCategB;


  /**
  * Gets tooltip of this recipe, nullable.
  * <br> `BUNDLE`: "info.common-info-tt-<tooltip>.name".
  * @param {RecipeModule} rcMdl
  * @param {string} rcHeader
  * @return {string|null}
  */
  const getTooltip = function(rcMdl, rcHeader) {
    let tt = getRcVal(rcMdl, rcHeader, "tooltip", null);
    return tt == null ?
    null :
    MDL_bundle.getInfo("common", "tt-" + tt);
  };
  exports.getTooltip = getTooltip;


  /**
   * Whether this recipe is generated.
   * Do not set this field.
   * @param {RecipeModule} rcMdl
   * @param {string} rcHeader
   * @return {boolean}
   */
  const checkIsGen = function(rcMdl, rcHeader) {
    return getRcVal(rcMdl, rcHeader, "isGenerated", false);
  };
  exports.checkIsGen = checkIsGen;


  /**
   * Whether some content has not been found in this recipe.
   * Do not set this field.
   * @param {RecipeModule} rcMdl
   * @param {string} rcHeader
   * @return {boolean}
   */
  const checkIsIncomplete = function(rcMdl, rcHeader) {
    return getRcVal(rcMdl, rcHeader, "isIncomplete", false);
  };
  exports.checkIsIncomplete = checkIsIncomplete;


  /**
   * Gets the function used to check whether this recipe is allowed now.
   * @param {RecipeModule} rcMdl
   * @param {string} rcHeader
   * @return {function(Building): boolean}
   */
  const getValidCheck = function(rcMdl, rcHeader) {
    return getRcVal(rcMdl, rcHeader, "validCheck", Function.airTrue);
  };
  exports.getValidCheck = getValidCheck;


  /**
   * Gets contents required to be unlocked for this recipe.
   * @param {RecipeModule} rcMdl
   * @param {string} rcHeader
   * @param {boolean|unset} [toCts]
   * @return {Array<string>|Array<UnlockableContent>}
   */
  const getLockedByCts = function(rcMdl, rcHeader, toCts) {
    let arr = getRcVal(rcMdl, rcHeader, "lockedBy", Array.air);
    if(!toCts) return arr;

    let cts = [], ct;
    arr.forEachFast(nameCt => {
      ct = MDL_content.getCt(nameCt, null, true);
      if(ct != null) cts.pushUnique(ct);
    }, true);

    return cts;
  };
  exports.getLockedByCts = getLockedByCts;


  /**
   * Gets recipe unlocked status check.
   * @param {RecipeModule} rcMdl
   * @param {string} rcHeader
   * @return {function(Building): boolean}
   */
  const getUnlockedCheck = function(rcMdl, rcHeader) {
    let cts = getLockedByCts(rcMdl, rcHeader, true);
    return cts.length === 0 ?
      Function.airTrue :
      function() {
        return cts.every(ct => ct.unlocked);
      };
  };
  exports.getUnlockedCheck = getUnlockedCheck;


  /**
   * Gets the final `validCheck` used in multi-crafters.
   * @param {RecipeModule} rcMdl
   * @param {string} rcHeader
   * @return {function(Building): boolean}
   */
  const getFinalValidCheck = function(rcMdl, rcHeader) {
    let validCheck = getValidCheck(rcMdl, rcHeader);
    let cts = getLockedByCts(rcMdl, rcHeader, true);

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
  exports.getFinalValidCheck = getFinalValidCheck;


  /**
   * Gets crafting time scaling of a recipe.
   * @param {RecipeModule} rcMdl
   * @param {string} rcHeader
   * @return {number}
   */
  const getTimeScl = function(rcMdl, rcHeader) {
    return getRcVal(rcMdl, rcHeader, "timeScl", 1.0);
  };
  exports.getTimeScl = getTimeScl;


  /**
   * Gets extra block pollution of a recipe.
   * @param {RecipeModule} rcMdl
   * @param {string} rcHeader
   * @return {number}
   */
  const getPol = function(rcMdl, rcHeader) {
    return getRcVal(rcMdl, rcHeader, "pollution", 0.0);
  };
  exports.getPol = getPol;


  /**
   * Whether the crafter consumes even when full of output items.
   * @param {RecipeModule} rcMdl
   * @param {string} rcHeader
   * @return {boolean}
   */
  const checkIgnoreItemFullness = function(rcMdl, rcHeader) {
    return getRcVal(rcMdl, rcHeader, "ignoreItemFullness", false);
  };
  exports.checkIgnoreItemFullness = checkIgnoreItemFullness;


  /**
   * Gets requirement of Erekir heat.
   * Not used in ProjReind.
   * @param {RecipeModule} rcMdl
   * @param {string} rcHeader
   * @return {number}
   */
  const getErekirHeatReq = function(rcMdl, rcHeader) {
    return getRcVal(rcMdl, rcHeader, "erekirHeatReq", getRcBaseVal(rcMdl, "baseErekirHeatReq", 0.0));
  };
  exports.getErekirHeatReq = getErekirHeatReq;


  /**
   * Gets output of Erekir heat.
   * Not used in ProjReind.
   * @param {RecipeModule} rcMdl
   * @param {string} rcHeader
   * @return {number}
   */
  const getErekirHeatProd = function(rcMdl, rcHeader) {
    return getRcVal(rcMdl, rcHeader, "erekirHeatProd", getRcBaseVal(rcMdl, "baseErekirHeatProd", 0.0));
  };
  exports.getErekirHeatProd = getErekirHeatProd;


  /**
   * Gets attribute that affects efficiency of this recipe.
   * @param {RecipeModule} rcMdl
   * @param {string} rcHeader
   * @return {string}
   */
  const getAttr = function(rcMdl, rcHeader) {
    return getRcVal(rcMdl, rcHeader, "attr", getRcBaseVal(rcMdl, "baseAttr", null));
  };
  exports.getAttr = getAttr;


  /**
   * Gets attribute value for 0.0 efficiency.
   * @param {RecipeModule} rcMdl
   * @param {string} rcHeader
   * @return {number}
   */
  const getAttrMin = function(rcMdl, rcHeader) {
    return getRcVal(rcMdl, rcHeader, "attrMin", getRcBaseVal(rcMdl, "baseAttrMin", 0.0));
  };
  exports.getAttrMin = getAttrMin;


  /**
   * Gets attribute value for 1.0 efficiency.
   * @param {RecipeModule} rcMdl
   * @param {string} rcHeader
   * @return {number}
   */
  const getAttrMax = function(rcMdl, rcHeader) {
    return getRcVal(rcMdl, rcHeader, "attrMax", getRcBaseVal(rcMdl, "baseAttrMax", 1.0));
  };
  exports.getAttrMax = getAttrMax;


  /**
   * Gets multiplier on final attrbute boost.
   * @param {RecipeModule} rcMdl
   * @param {string} rcHeader
   * @return {number}
   */
  const getAttrBoostScl = function(rcMdl, rcHeader) {
    return getRcVal(rcMdl, rcHeader, "attrBoostScl", getRcBaseVal(rcMdl, "baseAttrBoostScl", 1.0));
  };
  exports.getAttrBoostScl = getAttrBoostScl;


  /**
   * Gets maximum efficiency that can be reached with attribute boost.
   * @param {RecipeModule} rcMdl
   * @param {string} rcHeader
   * @return {number}
   */
  const getAttrBoostCap = function(rcMdl, rcHeader) {
    return getRcVal(rcMdl, rcHeader, "attrBoostCap", getRcBaseVal(rcMdl, "baseAttrBoostCap", Infinity));
  };
  exports.getAttrBoostCap = getAttrBoostCap;


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
    getRcHeaders(rcMdl).forEachFast(rcHeader => {
      initParamObj = {
        blk: blkInit,
        timeScl: getTimeScl(rcMdl, rcHeader),
        failP: getFailP(rcMdl, rcHeader),
      };
      getCi(null, rcMdl, rcHeader, false, initParamObj);
      getBi(null, rcMdl, rcHeader, false, initParamObj);
      getAux(null, rcMdl, rcHeader, false, initParamObj);
      getOpt(null, rcMdl, rcHeader, false, initParamObj);
      getPayi(null, rcMdl, rcHeader, false, initParamObj);
      getCo(null, rcMdl, rcHeader, false, initParamObj);
      getBo(null, rcMdl, rcHeader, false, initParamObj);
      getFo(null, rcMdl, rcHeader, false, initParamObj);
      getPayo(null, rcMdl, rcHeader, false, initParamObj);
    }, true);
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
   * @param {function(UnlockableContent, number, number|null): void} [ctC] - `ARGS`: ct, amt, p.
   * @param {boolean|unset} [isSecondary] - Do not set this.
   * @param {number|unset} [pTg]
   * @return {void}
   */
  const parseRcIoRow = function thisFun(outArr, tg, amt, p, ctC, isSecondary, pTg) {
    if(ctC == null) ctC = Function.air;
    if(pTg == null) pTg = 1.0;
    let isContinuous = p == null;

    if(tg instanceof Array) {
      // Alternative input
      let i = 0, iCap = tg.iCap(), tmpArr = [];
      while(i < iCap) {
        parseRcIoRow(tmpArr, tg[i], tg[i + 1], isContinuous ? null : tg[i + 2], ctC, true, pTg);
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
            ctC, true, pTg,
          );
        }, true);
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
        let blk = MDL_content.getCt(tg.replace("COST: ", ""), "blk");
        if(blk == null) {
          thisFun.reportIncompleteRc(tg);
        } else {
          blk.requirements.forEachFast(itmStack => {
            parseRcIoRow(outArr, itmStack.item, itmStack.amount, 1.0, ctC, false, pTg);
          }, true);
        };
      } else {
        // Content name
        let ct = MDL_content.getCt(tg, null, true);
        if(ct == null) {
          thisFun.reportIncompleteRc(tg);
        } else {
          parseRcIoRow(outArr, ct, amt, p, ctC, false, pTg);
        };
      };
    } else if(tg instanceof UnlockableContent) {
      // Content
      if(isContinuous) {
        outArr.push(tg, amt);
        ctC(tg, amt, null);
      } else {
        outArr.push(tg, Math.round(amt / pTg), p * pTg);
        ctC(tg, Math.round(amt / pTg), p * pTg);
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
      getRcVal(rcMdl, rcHeader, name, Array.air) :
      getRcBaseVal(rcMdl, baseName, Array.air).concat(getRcVal(rcMdl, rcHeader, name, Array.air));

    let
      i = 0,
      iCap = raw.iCap(),
      ord = IO_ORDER_MAP.get(name),
      ctC = null;

    // It's OK to hard code this I guess
    switch(name) {

      case "ci" :
        ctC = function(ct, amt) {
          if(initParamObj == null || amt < 0.0001) return;
          MDL_recipeDict.addFldConsTerm(
            readParam(initParamObj, "blk"),
            ct,
            amt,
            {
              ct: getIconName(rcMdl, rcHeader),
              ctTint: getRcVal(rcMdl, rcHeader, "tint"),
              ctTableF: (tb, blk, ct) => CLS_recipe.get(blk, rcHeader).displayTooltip(tb, true, blk.localizedName),
            },
          );
        };
        break;

      case "bi" :
        ctC = function(ct, amt, p) {
          if(initParamObj == null || amt <= 0) return;
          ct instanceof Item ?
            MDL_recipeDict.addItmConsTerm(
              readParam(initParamObj, "blk"),
              ct,
              amt / readParam(initParamObj, "timeScl", 1.0),
              p,
              {
                ct: getIconName(rcMdl, rcHeader),
                ctTint: getRcVal(rcMdl, rcHeader, "tint"),
                ctTableF: (tb, blk, ct) => CLS_recipe.get(blk, rcHeader).displayTooltip(tb, true, blk.localizedName),
              },
            ) :
            MDL_recipeDict.addFldConsTerm(
              readParam(initParamObj, "blk", null),
              ct,
              amt / readParam(initParamObj, "blk").craftTime / readParam(initParamObj, "timeScl", 1.0),
              {
                ct: getIconName(rcMdl, rcHeader),
                ctTint: getRcVal(rcMdl, rcHeader, "tint"),
                ctTableF: (tb, blk, ct) => CLS_recipe.get(blk, rcHeader).displayTooltip(tb, true, blk.localizedName),
              },
            );
        };
        break;

      case "aux" :
        ctC = function(ct, amt) {
          if(initParamObj == null || amt < 0.0001) return;
          MDL_recipeDict.addFldConsTerm(
            readParam(initParamObj, "blk"),
            ct,
            amt,
            {
              ct: getIconName(rcMdl, rcHeader),
              ctTint: getRcVal(rcMdl, rcHeader, "tint"),
              ctTableF: (tb, blk, ct) => CLS_recipe.get(blk, rcHeader).displayTooltip(tb, true, blk.localizedName),
            },
          );
        };
        break;

      case "opt" :
        ctC = function(ct, amt, p) {
          if(initParamObj == null || amt <= 0) return;
          MDL_recipeDict.addItmConsTerm(
            readParam(initParamObj, "blk"),
            ct,
            amt / readParam(initParamObj, "timeScl", 1.0),
            p,
            {
              ct: getIconName(rcMdl, rcHeader),
              ctTint: getRcVal(rcMdl, rcHeader, "tint"),
              ctTableF: (tb, blk, ct) => CLS_recipe.get(blk, rcHeader).displayTooltip(tb, true, blk.localizedName),
              icon: "lovec-icon-boost",
            },
          );
        };
        break;

      case "payi" :
        ctC = function(ct, amt) {
          if(initParamObj == null || amt <= 0) return;
          MDL_recipeDict.addPayConsTerm(
            readParam(initParamObj, "blk"),
            ct,
            amt / readParam(initParamObj, "timeScl", 1.0),
            {
              ct: getIconName(rcMdl, rcHeader),
              ctTint: getRcVal(rcMdl, rcHeader, "tint"),
              ctTableF: (tb, blk, ct) => CLS_recipe.get(blk, rcHeader).displayTooltip(tb, true, blk.localizedName),
            },
          );
        };
        break;

      case "co" :
        ctC = function(ct, amt) {
          if(initParamObj == null || amt < 0.0001) return;
          MDL_recipeDict.addFldProdTerm(
            readParam(initParamObj, "blk"),
            ct,
            amt,
            {
              ct: getIconName(rcMdl, rcHeader),
              ctTint: getRcVal(rcMdl, rcHeader, "tint"),
              ctTableF: (tb, blk, ct) => CLS_recipe.get(blk, rcHeader).displayTooltip(tb, true, blk.localizedName),
            },
          );
        };
        break;

      case "bo" :
        ctC = function(ct, amt, p) {
          if(initParamObj == null || amt <= 0) return;
          MDL_recipeDict.addItmProdTerm(
            readParam(initParamObj, "blk"),
            ct,
            amt / readParam(initParamObj, "timeScl", 1.0),
            p * (readParam(initParamObj, "failP") == null ? 1.0 : (1.0 - readParam(initParamObj, "failP"))),
            {
              ct: getIconName(rcMdl, rcHeader),
              ctTint: getRcVal(rcMdl, rcHeader, "tint"),
              ctTableF: (tb, blk, ct) => CLS_recipe.get(blk, rcHeader).displayTooltip(tb, true, blk.localizedName),
            },
          );
        };
        break;

      case "fo" :
        ctC = function(ct, amt, p) {
          if(initParamObj == null || amt <= 0) return;
          MDL_recipeDict.addItmProdTerm(
            readParam(initParamObj, "blk"),
            ct,
            amt / readParam(initParamObj, "timeScl", 1.0),
            p * (readParam(initParamObj, "failP") == null ? 0.0 : readParam(initParamObj, "failP")),
            {
              ct: getIconName(rcMdl, rcHeader),
              ctTint: getRcVal(rcMdl, rcHeader, "tint"),
              ctTableF: (tb, blk, ct) => CLS_recipe.get(blk, rcHeader).displayTooltip(tb, true, blk.localizedName),
            },
          );
        };
        break;

      case "payo" :
        ctC = function(ct, amt) {
          if(initParamObj == null || amt <= 0) return;
          MDL_recipeDict.addPayProdTerm(
            readParam(initParamObj, "blk"),
            ct,
            amt / readParam(initParamObj, "timeScl", 1.0),
            {
              ct: getIconName(rcMdl, rcHeader),
              ctTint: getRcVal(rcMdl, rcHeader, "tint"),
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
        ctC,
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
  const getCi = function(contArr, rcMdl, rcHeader, ignoreBase, initParamObj) {
    return parseRcIo(contArr, "ci", rcMdl, rcHeader, ignoreBase, initParamObj);
  };
  exports.getCi = getCi;


  /**
   * Gets parsed BI data.
   * @param {Array|unset} contArr
   * @param {RecipeModule} rcMdl
   * @param {string} rcHeader
   * @param {boolean|unset} [ignoreBase]
   * @param {Object|unset} [initParamObj]
   * @return {Array}
   */
  const getBi = function(contArr, rcMdl, rcHeader, ignoreBase, initParamObj) {
    return parseRcIo(contArr, "bi", rcMdl, rcHeader, ignoreBase, initParamObj);
  };
  exports.getBi = getBi;


  /**
   * Gets parsed AUX data.
   * @param {Array|unset} contArr
   * @param {RecipeModule} rcMdl
   * @param {string} rcHeader
   * @param {boolean|unset} [ignoreBase]
   * @param {Object|unset} [initParamObj]
   * @return {Array}
   */
  const getAux = function(contArr, rcMdl, rcHeader, ignoreBase, initParamObj) {
    return parseRcIo(contArr, "aux", rcMdl, rcHeader, ignoreBase, initParamObj);
  };
  exports.getAux = getAux;


  /**
   * Whether at least one OPT should be met for this recipe.
   * @param {RecipeModule} rcMdl
   * @param {string} rcHeader
   * @return {boolean}
   */
  const getReqOpt = function(rcMdl, rcHeader) {
    return getRcVal(rcMdl, rcHeader, "reqOpt", getRcBaseVal(rcMdl, "baseReqOpt", false));
  };
  exports.getReqOpt = getReqOpt;


  /**
   * Gets parsed OPT data.
   * @param {Array|unset} contArr
   * @param {RecipeModule} rcMdl
   * @param {string} rcHeader
   * @param {boolean|unset} [ignoreBase]
   * @param {Object|unset} [initParamObj]
   * @return {Array}
   */
  const getOpt = function(contArr, rcMdl, rcHeader, ignoreBase, initParamObj) {
    return parseRcIo(contArr, "opt", rcMdl, rcHeader, ignoreBase, initParamObj);
  };
  exports.getOpt = getOpt;


  /**
   * Gets parsed PAYI data.
   * @param {Array|unset} contArr
   * @param {RecipeModule} rcMdl
   * @param {string} rcHeader
   * @param {boolean|unset} [ignoreBase]
   * @param {Object|unset} [initParamObj]
   * @return {Array}
   */
  const getPayi = function(contArr, rcMdl, rcHeader, ignoreBase, initParamObj) {
    return parseRcIo(contArr, "payi", rcMdl, rcHeader, ignoreBase, initParamObj).inSituMap(ele => ele instanceof UnlockableContent ? ele.name : ele);
  };
  exports.getPayi = getPayi;


  /**
   * Gets parsed CO data.
   * @param {Array|unset} contArr
   * @param {RecipeModule} rcMdl
   * @param {string} rcHeader
   * @param {boolean|unset} [ignoreBase]
   * @param {Object|unset} [initParamObj]
   * @return {Array}
   */
  const getCo = function(contArr, rcMdl, rcHeader, ignoreBase, initParamObj) {
    return parseRcIo(contArr, "co", rcMdl, rcHeader, ignoreBase, initParamObj);
  };
  exports.getCo = getCo;


  /**
   * Gets parsed BO data.
   * @param {Array|unset} contArr
   * @param {RecipeModule} rcMdl
   * @param {string} rcHeader
   * @param {boolean|unset} [ignoreBase]
   * @param {Object|unset} [initParamObj]
   * @return {Array}
   */
  const getBo = function(contArr, rcMdl, rcHeader, ignoreBase, initParamObj) {
    return parseRcIo(contArr, "bo", rcMdl, rcHeader, ignoreBase, initParamObj);
  };
  exports.getBo = getBo;


  /**
   * Gets chance to fail a recipe.
   * @param {RecipeModule} rcMdl
   * @param {string} rcHeader
   * @return {number}
   */
  const getFailP = function(rcMdl, rcHeader) {
    return getRcVal(rcMdl, rcHeader, "failP", getRcBaseVal(rcMdl, "baseFailP", 0.0));
  };
  exports.getFailP = getFailP;


  /**
   * Gets parsed FO data.
   * @param {Array|unset} contArr
   * @param {RecipeModule} rcMdl
   * @param {string} rcHeader
   * @param {boolean|unset} [ignoreBase]
   * @param {Object|unset} [initParamObj]
   * @return {Array}
   */
  const getFo = function(contArr, rcMdl, rcHeader, ignoreBase, initParamObj) {
    return parseRcIo(contArr, "fo", rcMdl, rcHeader, ignoreBase, initParamObj);
  };
  exports.getFo = getFo;


  /**
   * Gets parsed PAYO data.
   * @param {Array|unset} contArr
   * @param {RecipeModule} rcMdl
   * @param {string} rcHeader
   * @param {boolean|unset} [ignoreBase]
   * @param {Object|unset} [initParamObj]
   * @return {Array}
   */
  const getPayo = function(contArr, rcMdl, rcHeader, ignoreBase, initParamObj) {
    return parseRcIo(contArr, "payo", rcMdl, rcHeader, ignoreBase, initParamObj).inSituMap(ele => ele instanceof UnlockableContent ? ele.name : ele);
  };
  exports.getPayo = getPayo;


  /**
   * Gets a recipe script.
   * @param {RecipeModule} rcMdl
   * @param {string} rcHeader
   * @param {string} name
   * @return {function(Building): void}
   */
  const processRcScr = function(rcMdl, rcHeader, name) {
    let
      scr = getRcVal(rcMdl, rcHeader, name, null),
      baseScr = getRcBaseVal(rcMdl, "base" + name.firstUpperCase, null);

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
  const getUpdateScr = function(rcMdl, rcHeader) {
    return processRcScr(rcMdl, rcHeader, "updateScr");
  };
  exports.getUpdateScr = getUpdateScr;


  /**
   * Gets script called every frame this the building is running.
   * @param {RecipeModule} rcMdl
   * @param {string} rcHeader
   * @return {function(Building): void}
   */
  const getRunScr = function(rcMdl, rcHeader) {
    return processRcScr(rcMdl, rcHeader, "runScr");
  };
  exports.getRunScr = getRunScr;


  /**
   * Gets script called when this building finishes crafting.
   * @param {RecipeModule} rcMdl
   * @param {string} rcHeader
   * @return {function(Building): void}
   */
  const getCraftScr = function(rcMdl, rcHeader) {
    return processRcScr(rcMdl, rcHeader, "craftScr");
  };
  exports.getCraftScr = getCraftScr;


  /**
   * Gets script called when this building is no longer running.
   * Won't be called if the building has never been active.
   * @param {RecipeModule} rcMdl
   * @param {string} rcHeader
   * @return {function(Building): void}
   */
  const getStopScr = function(rcMdl, rcHeader) {
    return processRcScr(rcMdl, rcHeader, "stopScr");
  };
  exports.getStopScr = getStopScr;


  /**
   * Gets script called when this crafter fails its recipe.
   * @param {RecipeModule} rcMdl
   * @param {string} rcHeader
   * @return {function(Building): void}
   */
  const getFailScr = function(rcMdl, rcHeader) {
    return processRcScr(rcMdl, rcHeader, "failScr");
  };
  exports.getFailScr = getFailScr;


  /**
   * Gets a 5-tuple of recipe scripts.
   * @param {Array|unset} contTup
   * @param {RecipeModule} rcMdl
   * @param {string} rcHeader
   * @return {Array<function(Building): void>} - `TUPLE`: updateScr, runScr, craftScr, stopScr, failScr.
   */
  const getScrTup = function(contTup, rcMdl, rcHeader) {
    let tup = contTup != null ? contTup.clear() : [];

    tup.push(
      getUpdateScr(rcMdl, rcHeader),
      getRunScr(rcMdl, rcHeader),
      getCraftScr(rcMdl, rcHeader),
      getStopScr(rcMdl, rcHeader),
      getFailScr(rcMdl, rcHeader),
    );

    return tup;
  };
  exports.getScrTup = getScrTup;


  /**
   * Gets effect used when recipe is failed.
   * Nullable for default effect.
   * @param {RecipeModule} rcMdl
   * @param {string} rcHeader
   * @return {Effect|null}
   */
  const getFailEff = function(rcMdl, rcHeader) {
    return getRcVal(rcMdl, rcHeader, "failEff", getRcBaseVal(rcMdl, "baseFailEff", null));
  };
  exports.getFailEff = getFailEff;


  /**
   * Gets drawer of this recipe, see "DrawRecipe" in {@link TP_drawer}.
   * @param {RecipeModule} rcMdl
   * @param {string} rcHeader
   * @return {DrawBlock|null}
   */
  const getDrawer = function(rcMdl, rcHeader) {
    return getRcVal(rcMdl, rcHeader, "drawer", null);
  };
  exports.getDrawer = getDrawer;


  /* <------------------------------ specific ------------------------------ */


  /**
   * Gets multiplier on power produced.
   * For {@link BLK_generatorRecipeFactory}.
   * @param {RecipeModule} rcMdl
   * @param {string} rcHeader
   * @return {number}
   */
  const getPowProdMtp = function(rcMdl, rcHeader) {
    return getRcVal(rcMdl, rcHeader, "powProdMtp", 1.0);
  };
  exports.getPowProdMtp = getPowProdMtp;


  /**
   * Gets temperature required for a recipe.
   * For {@link BLK_furnaceRecipeFactory}.
   * @param {RecipeModule} rcMdl
   * @param {string} rcHeader
   * @return {number}
   */
  const getTempReq = function(rcMdl, rcHeader) {
    return getRcVal(rcMdl, rcHeader, "tempReq", 0.0);
  };
  exports.getTempReq = getTempReq;


  /**
   * Gets temperature allowed for a recipe, beyond which failure occurs more frequently.
   * For {@link BLK_furnaceRecipeFactory}.
   * @param {RecipeModule} rcMdl
   * @param {string} rcHeader
   * @return {number}
   */
  const getTempAllowed = function(rcMdl, rcHeader) {
    return getRcVal(rcMdl, rcHeader, "tempAllowed", Infinity);
  };
  exports.getTempAllowed = getTempAllowed;


  /**
   * Gets multiplier on durability decrease rate.
   * For {@link BLK_durabilityRecipeFactory}.
   * @param {RecipeModule} rcMdl
   * @param {string} rcHeader
   * @return {number}
   */
  const getDurabDecMtp = function(rcMdl, rcHeader) {
    return getRcVal(rcMdl, rcHeader, "durabDecMtp", 1.0);
  };
  exports.getDurabDecMtp = getDurabDecMtp;
