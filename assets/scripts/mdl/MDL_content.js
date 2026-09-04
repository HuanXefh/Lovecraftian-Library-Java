/*
  ========================================
  Section: Introduction
  ========================================
*/


  /**
   * Methods to read contents and their properties.
   * @module lovec/mdl/MDL_content
   */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <------------------------------ base ------------------------------ */


  /**
   * Converts generalized content to content.
   * @param {ContentGn} ct_gn
   * @param {string|unset} [mode] - Used to specify category for faster calculation, leave empty to search in all categories.
   * @param {boolean|unset} [suppressWarning] - If false, a warning will be logged if content not found.
   * @return {UnlockableContent|null}
   */
  const getCt = function thisFun(ct_gn, mode, suppressWarning) {
    if(ct_gn == null || ct_gn === "null") return null;
    if(ct_gn.unlocked != null) return global.lovecUtil.db.oreDict.get(ct_gn, ct_gn);

    let ct = null;
    if(mode != null) {
      // Try finding content in specific categories
      thisFun.modeMap.get(mode, Array.air).forEachFast(ctTypeStr => {
        if(ct != null) return;
        ct = Vars.content.getByName(ContentType[ctTypeStr], ct_gn);
      }, true);
    } else {
      // Try finding content in all categories, can be costy
      if(!suppressWarning) LOG_HANDLER.log("costyContentSearch", ct_gn);
      ct = Vars.content.byName(ct_gn);
    };

    if(ct == null && !suppressWarning) LOG_HANDLER.log("noContentFound", ct_gn);

    return ct == null ? null : global.lovecUtil.db.oreDict.get(ct, ct);
  }
  .setProp({
    modeMap: ObjectMap.of(
      "rs", ["item", "liquid"],
      "blk", ["block"],
      "utp", ["unit"],
      "sta", ["status"],
      "wea", ["weather"],
      "sec", ["sector"],
      "pla", ["planet"],
    ),
  });
  exports.getCt = getCt;


  /**
   * Whether this content has name in bundle.
   * @param {ContentGn} ct_gn
   * @return {boolean}
   */
  const checkHasBundle = function(ct_gn) {
    let ct = getCt(ct_gn);
    if(ct == null) return false;

    return Core.bundle.has(ct.contentType.toString() + "." + ct.name + ".name");
  };
  exports.checkHasBundle = checkHasBundle;


  /**
   * Renames this content if bundle name is not provided.
   * Should be called on INIT.
   * @param {ContentGn} ct_gn
   * @param {string|(function(): string)} name_fn
   * @return {void}
   */
  const rename = function(ct_gn, name_fn) {
    let ct = getCt(ct_gn);
    if(ct == null || checkHasBundle(ct)) return;

    Core.app.post(() => {
      ct.localizedName = typeof name_fn === "function" ?
        name_fn() :
        name_fn;
    });
  }
  .setAnno("non-headless");
  exports.rename = rename;


  /**
   * Gets mod that adds this content.
   * @param {ContentGn} ct_gn
   * @param {boolean|unset} [returnMod] - If true, this method will return instance of {@link Mod} instead of string name.
   * @return {string|Mod}
   */
  const getMod = function(ct_gn, returnMod) {
    let ct = getCt(ct_gn);
    if(ct == null) return null;
    let mod = ct.minfo.mod;

    return mod == null ?
      (returnMod ? null : "vanilla") :
      (returnMod ? mod : mod.name);
  };
  exports.getMod = getMod;


  /**
   * Gets content name without mod name prefix.
   * Do not call this on vanilla contents.
   * @param {UnlockableContent} ct
   * @return {string}
   */
  const getCtNameNoPrefix = function(ct) {
    return ct.name.replace(getMod(ct) + "-", "");
  };
  exports.getCtNameNoPrefix = getCtNameNoPrefix;


  /* <------------------------------ resource ------------------------------ */


  /**
   * Gets a list of blocks that are built with the given item.
   * @param {ItemGn} item_gn
   * @param {boolean|unset} [appendAmt] - If true, a 2-array will be returned instead, where amount is appended.
   * @return {Array<Block>|Array}
   */
  const getReqBlks = function(item_gn, appendAmt) {
    let arr = [];
    let item = getCt(item_gn, "rs");
    if(item == null || !(item instanceof Item)) return arr;

    Vars.content.blocks().each(
      oblk => oblk.placeablePlayer && !DB_block.db["class"]["group"]["visibility"]["hidden"].includes(oblk.buildVisibility),
      oblk => {
        oblk.requirements.forEachFast(itemStack => {
          if(itemStack.item === item && itemStack.amount > 0) !appendAmt ? arr.push(oblk) : arr.push(oblk, itemStack.amount);
        }, true);
      },
    );
    if(arr.length > 0 && !item.buildable) {
      console.warn("[LOVEC] Item ${1} is marked as not buildable, but actually used for ${2} blocks!".format(item.name.color(Pal.accent), arr.length));
    };

    return arr;
  }
  .setCache();
  exports.getReqBlks = getReqBlks;


  /**
   * Gets a list of blocks that drop the given resource.
   * @param {ResourceGn} rs_gn
   * @return {Array<Block>}
   */
  const getOreBlks = function(rs_gn) {
    let arr = [];
    let rs = getCt(rs_gn, "rs");
    if(rs == null) return arr;

    const li = Vars.content.blocks();
    if(rs instanceof Item) {
      li.each(blk => blk.itemDrop === rs || tryFun(blk.ex_getRsDrop, blk, null) === rs, blk => arr.push(blk));
    } else if(rs instanceof Liquid) {
      li.each(blk => blk.liquidDrop === rs || tryFun(blk.ex_getRsDrop, blk, null) === rs, blk => arr.push(blk));
    };

    return arr;
  }
  .setCache();
  exports.getOreBlks = getOreBlks;


  /**
   * Gets intermediate of given resource that has a specific intermediate tag.
   * If the given resource is an intermediate, its parent will be used instead.
   * @param {ResourceGn} rs_gn
   * @param {string} intmdTag
   * @return {Resource|null}
   */
  const getIntmd = function(rs_gn, intmdTag) {
    let rs = getCt(rs_gn, "rs");
    if(rs == null) return null;
    if(tryJsProp(rs, "intmdParent") != null) rs = rs.delegee.intmdParent;

    let arr = VARGEN.intmds[intmdTag];
    if(arr == null) return null;

    return arr.find(ors => ors.delegee.intmdParent === rs);
  }
  .setCache();
  exports.getIntmd = getIntmd;


  /* <------------------------------ block ------------------------------ */


  /**
   * Gets generalized craft time of some block. See {@link DB_block}.
   * @param {BlockGn} blk_gn
   * @param {boolean|unset} [isDrillTime]
   * @param {ContentGn|unset} [ct_gn] - The content to craft.
   * @return {number}
   */
  const getCraftTime = function(blk_gn, isDrillTime, ct_gn) {
    let arr = DB_block.db["class"]["map"]["craftTime"];
    let val = Infinity;
    let blk = getCt(blk_gn, "blk");
    if(blk == null) return val;

    let valC = null;
    let i = 0, iCap = arr.iCap();
    let cls;
    while(i < iCap) {
      cls = arr[i];
      if(cls != null && blk instanceof cls) valC = arr[i + 1];
      i += 2;
    };
    if(valC != null) val = valC(blk, isDrillTime, getCt(ct_gn, null, true));
    if(isDrillTime) val /= tryJsProp(blk, "drillAmtMtp", 1.0);

    return val;
  };
  exports.getCraftTime = getCraftTime;


  /* <------------------------------ unit type ------------------------------ */


  /**
   * Gets damage affinity type of some unit type.
   * @param {UnitTypeGn} utp_gn
   * @return {string}
   */
  const getUnitDmgType = function(utp_gn) {
    let utp = getCt(utp_gn, "utp");
    if(utp == null) return "none";

    let arr = DB_unit.db["grpParam"]["typeTagMap"];

    let i = 0, iCap = arr.iCap();
    while(i < iCap) {
      if(checkTempTag(utp, arr[i + 1])) return arr[i];
      i += 2;
    };

    return "none";
  }
  .setCache();
  exports.getUnitDmgType = getUnitDmgType;


  /* <------------------------------ faction ------------------------------ */


  /**
   * Gets faction of some block or unit type, "none" if not found.
   * @param {string|Block|UnitType|null} ct_gn
   * @return {string}
   */
  const getFaction = function(ct_gn) {
    let ct = getCt(ct_gn, null, true);
    if(ct == null) {
      return "none";
    } else if(ct instanceof Block) {
      return DB_block.db["map"]["faction"].read(ct.name, "none");
    } else if(ct instanceof UnitType) {
      return DB_unit.db["map"]["faction"].read(ct.name, "none");
    };

    return "none";
  }
  .setCache();
  exports.getFaction = getFaction;


  /**
   * `BUNDLE`: "term.common-term-faction-<nameFaction>.name".
   * @param {string} faction
   * @return {string}
   */
  const getFactionB = function(faction) {
    return MDL_bundle.getTerm("common", "faction-" + faction);
  };
  exports.getFactionB = getFactionB;


  /**
   * Gets color of some faction.
   * @param {string} faction
   * @param {Color|unset} [colorCont]
   * @return {Color}
   */
  const getFactionColor = function(faction, colorCont) {
    let color = colorCont != null ? colorCont : new Color();
    return Color.valueOf(color, DB_block.db["grpParam"]["factionColor"].read(faction, "ffffff"));
  };
  exports.getFactionColor = getFactionColor;


  /**
   * Gets a list of blocks and unit types belong to given faction.
   * @param {string} faction
   * @return {Array<UnlockableContent>}
   */
  const getFactionCts = function(faction) {
    let arr = [];
    const li1 = DB_block.db["map"]["faction"];
    const li2 = DB_unit.db["map"]["faction"];
    let i = 0, iCap1 = li1.iCap(), iCap2 = li2.iCap();
    while(i < iCap1) {
      if(li1[i + 1] === faction) arr.pushNonNull(getCt(li1[i], "blk"));
      i += 2;
    };
    i = 0;
    while(i < iCap2) {
      if(li2[i + 1] === faction) arr.pushNonNull(getCt(li2[i], "utp"));
      i += 2;
    };

    return arr;
  }
  .setCache();
  exports.getFactionCts = getFactionCts;


  /* <------------------------------ factory ------------------------------ */


  /**
   * Gets a list of factory families the given block is in.
   * @param {BlockGn} blk_gn
   * @return {Array<string>}
   */
  const getFacFamis = function(blk_gn) {
    let blk = getCt(blk_gn, "blk");
    if(blk == null) return [];

    return DB_block.db["map"]["facFami"].readList(blk.name);
  }
  .setCache();
  exports.getFacFamis = getFacFamis;


  /**
   * `BUNDLE`: "term.common-term-fami-<nameFami>.name".
   * @param {string} facFami
   * @return {string}
   */
  const getFacFamiB = function(facFami) {
    return MDL_bundle.getTerm("common", "fami-" + facFami);
  };
  exports.getFacFamiB = getFacFamiB;


  /**
   * Gets a list of defined factory families.
   * @return {Array<string>}
   */
  const getFacFamisDefined = function() {
    return DB_block.db["map"]["facFami"].readCol(2, 1).uniquify();
  }
  .setCache();
  exports.getFacFamisDefined = getFacFamisDefined;


  /**
   * Gets a list of blocks that are in the given factory family.
   * @param {string} facFami
   * @return {Array<Block>}
   */
  const getFacFamiBlks = function(facFami) {
    let arr = [];
    let arr1 = DB_block.db["map"]["facFami"];
    let i = 0, iCap = arr1.iCap();
    while(i < iCap) {
      if(arr1[i + 1] === facFami) {
        arr.pushNonNull(getCt(arr1[i], "blk"));
      };
      i += 2;
    };

    return arr;
  }
  .setCache();
  exports.getFacFamiBlks = getFacFamiBlks;
