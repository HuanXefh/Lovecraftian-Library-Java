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
  const _ct = function thisFun(ct_gn, mode, suppressWarning) {
    if(ct_gn == null || ct_gn === "null") return null;
    if(ct_gn instanceof UnlockableContent) return global.lovecUtil.db.oreDict.get(ct_gn, ct_gn);
    if(typeof ct_gn !== "string") {
      printObj(ct_gn);
      throw new Error("What is this?\n" + ct_gn);
    };

    let ct = null;
    if(mode != null) {
      // Try finding content in specific categories
      thisFun.modeMap.get(mode, Array.air).forEachFast(ctTypeStr => {
        if(ct != null) return;
        ct = Vars.content.getByName(ContentType[ctTypeStr], ct_gn);
      });
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
  exports._ct = _ct;


  /**
   * Whether this content has name in bundle.
   * @param {ContentGn} ct_gn
   * @return {boolean}
   */
  const _hasBundle = function(ct_gn) {
    let ct = _ct(ct_gn);
    if(ct == null) return false;

    return Core.bundle.has(ct.contentType.toString() + "." + ct.name + ".name");
  };
  exports._hasBundle = _hasBundle;


  /**
   * Renames this content if bundle name is not provided.
   * Should be called on INIT.
   * @param {ContentGn} ct_gn
   * @param {string|(function(): string)} name_fn
   * @return {void}
   */
  const rename = function(ct_gn, name_fn) {
    let ct = _ct(ct_gn);
    if(ct == null || _hasBundle(ct)) return;

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
  const _mod = function(ct_gn, returnMod) {
    let ct = _ct(ct_gn);
    if(ct == null) return null;
    let mod = ct.minfo.mod;

    return mod == null ?
      (returnMod ? null : "vanilla") :
      (returnMod ? mod : mod.name);
  };
  exports._mod = _mod;


  /**
   * Gets content name without mod name prefix.
   * Do not call this on vanilla contents.
   * @param {UnlockableContent} ct
   * @return {string}
   */
  const _nameCtNoPrefix = function(ct) {
    return ct.name.replace(_mod(ct) + "-", "");
  };
  exports._nameCtNoPrefix = _nameCtNoPrefix;


  /* <------------------------------ resource ------------------------------ */


  /**
   * Gets a list of blocks that are built with the given item.
   * @param {ItemGn} itm_gn
   * @param {boolean|unset} [appendAmt] - If true, a 2-array will be returned instead, where amount is appended.
   * @return {Array<Block>|Array}
   */
  const _reqBlks = function(itm_gn, appendAmt) {
    let arr = [];
    let itm = _ct(itm_gn, "rs");
    if(itm == null || !(itm instanceof Item)) return arr;

    Vars.content.blocks().each(
      oblk => oblk.placeablePlayer && !DB_block.db["class"]["group"]["visibility"]["hidden"].includes(oblk.buildVisibility),
      oblk => {
        oblk.requirements.forEachFast(itmStack => {
          if(itmStack.item === itm && itmStack.amount > 0) !appendAmt ? arr.push(oblk) : arr.push(oblk, itmStack.amount);
        });
      },
    );
    if(arr.length > 0 && !itm.buildable) {
      console.warn("[LOVEC] Item ${1} is marked as not buildable, but actually used for ${2} blocks!".format(itm.name.color(Pal.accent), arr.length));
    };

    return arr;
  }
  .setCache();
  exports._reqBlks = _reqBlks;


  /**
   * Gets a list of blocks that drop the given resource.
   * @param {ResourceGn} rs_gn
   * @return {Array<Block>}
   */
  const _oreBlks = function(rs_gn) {
    let arr = [];
    let rs = _ct(rs_gn, "rs");
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
  exports._oreBlks = _oreBlks;


  /**
   * Gets intermediate of given resource that has a specific intermediate tag.
   * If the given resource is an intermediate, its parent will be used instead.
   * @param {ResourceGn} rs_gn
   * @param {string} intmdTag
   * @return {Resource|null}
   */
  const _intmd = function(rs_gn, intmdTag) {
    let rs = _ct(rs_gn, "rs");
    if(rs == null) return null;
    if(tryJsProp(rs, "intmdParent") != null) rs = rs.delegee.intmdParent;

    let arr = VARGEN.intmds[intmdTag];
    if(arr == null) return null;

    return arr.find(ors => ors.delegee.intmdParent === rs);
  }
  .setCache();
  exports._intmd = _intmd;


  /* <------------------------------ block ------------------------------ */


  /**
   * Gets generalized craft time of some block. See {@link DB_block}.
   * @param {BlockGn} blk_gn
   * @param {boolean|unset} [isDrillTime]
   * @param {ContentGn|unset} [ct_gn] - The content to craft.
   * @return {number}
   */
  const _craftTime = function(blk_gn, isDrillTime, ct_gn) {
    let arr = DB_block.db["class"]["map"]["craftTime"];
    let val = Infinity;
    let blk = _ct(blk_gn, "blk");
    if(blk == null) return val;

    let valCaller = null;
    let i = 0, iCap = arr.iCap();
    let cls;
    while(i < iCap) {
      cls = arr[i];
      if(cls != null && blk instanceof cls) valCaller = arr[i + 1];
      i += 2;
    };
    if(valCaller != null) val = valCaller(blk, isDrillTime, _ct(ct_gn, null, true));
    if(isDrillTime) val /= tryJsProp(blk, "drillAmtMtp", 1.0);

    return val;
  };
  exports._craftTime = _craftTime;


  /**
   * Gets power consumption of some block.
   * @param {BlockGn} blk_gn
   * @return {number}
   */
  const _powConsAmt = function(blk_gn) {
    let blk = _ct(blk_gn, "blk");
    if(!blk.hasPower) return 0.0;

    let powCons = blk.consumers.find(cons => cons instanceof ConsumePower);
    return powCons == null ? 0.0 : powCons.usage;
  };
  exports._powConsAmt = _powConsAmt;


  /* <------------------------------ unit type ------------------------------ */


  /**
   * Gets damage affinity type of some unit type.
   * @param {UnitTypeGn} utp_gn
   * @return {string}
   */
  const _unitDmgType = function(utp_gn) {
    let utp = _ct(utp_gn, "utp");
    if(utp == null) return "none";

    let arr = DB_unit.db["grpParam"]["typeTagMap"];

    let i = 0, iCap = arr.iCap();
    while(i < iCap) {
      if(checkTempTag(utp, arr[i + 1])) return arr[i];
      i += 2;
    };

    return null;
  }
  .setCache();
  exports._unitDmgType = _unitDmgType;


  /* <------------------------------ faction ------------------------------ */


  /**
   * Gets faction of some block or unit type, "none" if not found.
   * @param {string|Block|UnitType|null} ct_gn
   * @return {string}
   */
  const _faction = function(ct_gn) {
    let ct = _ct(ct_gn, null, true);
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
  exports._faction = _faction;


  /**
   * `BUNDLE`: "term.common-term-faction-<nameFaction>.name".
   * @param {string} faction
   * @return {string}
   */
  const _factionB = function(faction) {
    return MDL_bundle._term("common", "faction-" + faction);
  };
  exports._factionB = _factionB;


  /**
   * Gets color of some faction.
   * @param {string} faction
   * @param {Color|unset} [colorCont]
   * @return {Color}
   */
  const _factionColor = function(faction, colorCont) {
    let color = colorCont != null ? colorCont : new Color();
    return Color.valueOf(color, DB_block.db["grpParam"]["factionColor"].read(faction, "ffffff"));
  };
  exports._factionColor = _factionColor;


  /**
   * Gets a list of blocks and unit types belong to given faction.
   * @param {string} faction
   * @return {Array<UnlockableContent>}
   */
  const _factionCts = function(faction) {
    let arr = [];
    const li1 = DB_block.db["map"]["faction"];
    const li2 = DB_unit.db["map"]["faction"];
    let i = 0, iCap1 = li1.iCap(), iCap2 = li2.iCap();
    while(i < iCap1) {
      if(li1[i + 1] === faction) arr.pushNonNull(_ct(li1[i], "blk"));
      i += 2;
    };
    i = 0;
    while(i < iCap2) {
      if(li2[i + 1] === faction) arr.pushNonNull(_ct(li2[i], "utp"));
      i += 2;
    };

    return arr;
  }
  .setCache();
  exports._factionCts = _factionCts;


  /* <------------------------------ factory ------------------------------ */


  /**
   * Gets a list of factory families the given block is in.
   * @param {BlockGn} blk_gn
   * @return {Array<string>}
   */
  const _facFamis = function(blk_gn) {
    let blk = _ct(blk_gn, "blk");
    if(blk == null) return [];

    return DB_block.db["map"]["facFami"].readList(blk.name);
  }
  .setCache();
  exports._facFamis = _facFamis;


  /**
   * `BUNDLE`: "term.common-term-fami-<nameFami>.name".
   * @param {string} facFami
   * @return {string}
   */
  const _facFamiB = function(facFami) {
    return MDL_bundle._term("common", "fami-" + facFami);
  };
  exports._facFamiB = _facFamiB;


  /**
   * Gets a list of defined factory families.
   * @return {Array<string>}
   */
  const _facFamisDefined = function() {
    return DB_block.db["map"]["facFami"].readCol(2, 1).unique();
  }
  .setCache();
  exports._facFamisDefined = _facFamisDefined;


  /**
   * Gets a list of blocks that are in the given factory family.
   * @param {string} facFami
   * @return {Array<Block>}
   */
  const _facFamiBlks = function(facFami) {
    let arr = [];
    let arr1 = DB_block.db["map"]["facFami"];
    let i = 0, iCap = arr1.iCap();
    while(i < iCap) {
      if(arr1[i + 1] === facFami) {
        arr.pushNonNull(_ct(arr1[i], "blk"));
      };
      i += 2;
    };

    return arr;
  }
  .setCache();
  exports._facFamiBlks = _facFamiBlks;
