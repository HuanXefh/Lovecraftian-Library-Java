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


    /** @global */
    const ContentGetModes = newEnum({
        /** @type {ENumber} */
        RS: 0,
        /** @type {ENumber} */
        BLK: 1,
        /** @type {ENumber} */
        UTP: 2,
        /** @type {ENumber} */
        STA: 3,
        /** @type {ENumber} */
        WEA: 4,
        /** @type {ENumber} */
        SEC: 5,
        /** @type {ENumber} */
        PLA: 6,
    }, "ContentGetModes");


    /** @type {ObjectMap<ENumber, Array<string>>} */
    const contentModeTypeMap = ObjectMap.of(
        ContentGetModes.RS, ["item", "liquid"],
        ContentGetModes.BLK, ["block"],
        ContentGetModes.UTP, ["unit"],
        ContentGetModes.STA, ["status"],
        ContentGetModes.WEA, ["weather"],
        ContentGetModes.SEC, ["sector"],
        ContentGetModes.PLA, ["planet"],
    );


    /**
     * @internal
     * @type {ObjectMap<ContentGn, UnlockableContent|null>}
     */
    const handledCtMap = new ObjectMap();
    exports.handledCtMap = handledCtMap;


    /**
     * @internal
     * @type {IntMap<ObjectMap<ContentGn, UnlockableContent|null>>}
     */
    const handledCtModeMap = IntMap.of(
        ContentGetModes.RS.toInt(), new ObjectMap(),
        ContentGetModes.BLK.toInt(), new ObjectMap(),
        ContentGetModes.UTP.toInt(), new ObjectMap(),
        ContentGetModes.STA.toInt(), new ObjectMap(),
        ContentGetModes.WEA.toInt(), new ObjectMap(),
        ContentGetModes.SEC.toInt(), new ObjectMap(),
        ContentGetModes.PLA.toInt(), new ObjectMap(),
    );
    exports.handledCtModeMap = handledCtModeMap;


    /**
     * @param {ContentGn} ct_gn
     * @param {ENumber|unset} [mode]
     * @param {boolean|unset} [suppressWarning]
     * @return {UnlockableContent|null}
     */
    function searchCt(ct_gn, mode, suppressWarning) {
        if(ct_gn.unlocked != null) return global.lovecUtil.db.oreDict.get(ct_gn, ct_gn);

        let ct = null;
        if(mode != null) {
            contentModeTypeMap.get(mode, Array.air).forEachFast(ctTypeStr => {
                if(ct != null) return;
                ct = Vars.content.getByName(ContentType[ctTypeStr], ct_gn);
            }, true);
        } else {
            if(!suppressWarning) LCLogHandler.log("costyContentSearch", ct_gn);
            ct = Vars.content.byName(ct_gn);
        };

        if(ct == null && !suppressWarning) {
            LCLogHandler.log("noContentFoundWithMode", ct_gn, mode);
        };
        return ct == null ? null : global.lovecUtil.db.oreDict.get(ct, ct);
    };


    /**
     * Converts generalized content to content.
     * @param {ContentGn} ct_gn
     * @param {ENumber|unset} [mode] - Used to specify category for faster calculation, leave empty to search in all categories. See {@link ContentGetModes}.
     * @param {boolean|unset} [suppressWarning] - If false, a warning will be logged if content not found.
     * @return {UnlockableContent|null}
     */
    const getCt = function(ct_gn, mode, suppressWarning) {
        if(ct_gn == null || ct_gn == "null") return null;

        let ct, map;
        if(mode != null) {
            map = handledCtModeMap.get(mode);
            if(!map.containsKey(ct_gn)) {
                ct = searchCt(ct_gn, mode, suppressWarning);
                map.put(ct_gn, ct);
            } else {
                ct = map.get(ct_gn);
            };
        } else {
            map = handledCtMap;
            if(!map.containsKey(ct_gn)) {
                ct = searchCt(ct_gn, null, suppressWarning);
                map.put(ct_gn, ct);
            } else {
                ct = map.get(ct_gn);
            };
        };

        return ct;
    };
    exports.getCt = getCt;


    /**
     * Whether this content has name in bundle.
     * @param {ContentGn} ct_gn
     * @return {boolean}
     */
    const checkHasBundle = function(ct_gn) {
        let ct = getCt(ct_gn);
        return ct == null ?
            false :
            Core.bundle.has(ct.contentType.toString() + "." + ct.name + ".name");
    };
    exports.checkHasBundle = checkHasBundle;


    /**
     * Renames this content if bundle name is not provided.
     * Should be called on INIT.
     * @param {ContentGn} ct_gn
     * @param {Dynamic<string>} name_fn
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
     * Gets the mod that adds this content.
     * @param {ContentGn} ct_gn
     * @param {boolean|unset} [returnMod] - If true, this method will return {@link Mods.LoadedMod} instead of name.
     * @return {string|Mods.LoadedMod|null}
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
     * @return {Array<Block>|F2Array<Block, number>}
     */
    const getReqBlks = function(item_gn, appendAmt) {
        let arr = [];
        let item = getCt(item_gn, ContentGetModes.RS);
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
        let rs = getCt(rs_gn, ContentGetModes.RS);
        if(rs == null) return arr;

        let seq = Vars.content.blocks();
        if(rs instanceof Item) {
            seq.each(blk => blk.itemDrop === rs || tryFun(blk.ex_getRsDrop, blk, null) === rs, blk => arr.push(blk));
        } else if(rs instanceof Liquid) {
            seq.each(blk => blk.liquidDrop === rs || tryFun(blk.ex_getRsDrop, blk, null) === rs, blk => arr.push(blk));
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
        let rs = getCt(rs_gn, ContentGetModes.RS);
        if(rs == null) return null;
        if(tryJsProp(rs, "intmdParent") != null) rs = rs.delegee.intmdParent;
        let arr = VARGEN.tagIntmdsMap.get(intmdTag);
        if(arr == null) return null;
        return arr.find(ors => ors.delegee.intmdParent === rs);
    }
    .setCache();
    exports.getIntmd = getIntmd;


    /* <------------------------------ block ------------------------------ */


    /**
     * Gets generalized craft time of some block. See {@link DB_block.class.map.craftTime}.
     * @param {BlockGn} blk_gn
     * @param {boolean|unset} [isDrillTime]
     * @param {ContentGn|unset} [ct_gn] - The content to craft.
     * @return {number}
     */
    const getCraftTime = function(blk_gn, isDrillTime, ct_gn) {
        let val = Infinity;
        let blk = getCt(blk_gn, ContentGetModes.BLK);
        if(blk == null) return val;

        let valC = readTypeValArr(DB_block.db["class"]["map"]["craftTime"], blk);
        if(valC != null) {
            val = valC(blk, isDrillTime, getCt(ct_gn, null, true));
            if(isDrillTime) {
                val /= tryJsProp(blk, "drillAmtMtp", 1.0);
            };
        };

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
        let utp = getCt(utp_gn, ContentGetModes.UTP);
        if(utp == null) return "none";

        let
            arr = DB_unit.db["grpParam"]["typeTagMap"],
            i = 0,
            iCap = arr.iCap();

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
     * @lovecTypeSensitive
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
     * `BUNDLE`: `term.common-term-faction-<nameFaction>.name`.
     * @param {string} faction
     * @return {string}
     */
    const getFactionBundle = function(faction) {
        return MDL_bundle.getTerm("common", "faction-" + faction);
    };
    exports.getFactionBundle = getFactionBundle;


    /**
     * Gets color of some faction.
     * @param {Color|unset} contColor
     * @param {string} faction
     * @return {Color}
     */
    const getFactionColor = function(contColor, faction) {
        let color = contColor != null ? contColor : new Color();
        return Color.valueOf(color, DB_block.db["grpParam"]["factionColor"].read(faction, "ffffff"));
    };
    exports.getFactionColor = getFactionColor;


    /**
     * Gets a list of blocks and unit types that belong to given faction.
     * @param {string} faction
     * @return {Array<UnlockableContent>}
     */
    const getFactionCts = function(faction) {
        let
            arr = [],
            arr1 = DB_block.db["map"]["faction"],
            arr2 = DB_unit.db["map"]["faction"],
            i = 0,
            iCap1 = arr1.iCap(),
            iCap2 = arr2.iCap();

        while(i < iCap1) {
            if(arr1[i + 1] === faction) {
                arr.pushNonNull(getCt(arr1[i], ContentGetModes.BLK));
            };
            i += 2;
        };
        i = 0;
        while(i < iCap2) {
            if(arr2[i + 1] === faction) {
                arr.pushNonNull(getCt(arr2[i], ContentGetModes.UTP));
            };
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
        let blk = getCt(blk_gn, ContentGetModes.BLK);
        if(blk == null) return [];
        return DB_block.db["map"]["facFami"].readList(blk.name);
    }
    .setCache();
    exports.getFacFamis = getFacFamis;


    /**
     * `BUNDLE`: `term.common-term-fami-<nameFami>.name`.
     * @param {string} facFami
     * @return {string}
     */
    const getFacFamiBundle = function(facFami) {
        return MDL_bundle.getTerm("common", "fami-" + facFami);
    };
    exports.getFacFamiBundle = getFacFamiBundle;


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
        let
            arr = [],
            arr1 = DB_block.db["map"]["facFami"],
            i = 0,
            iCap = arr1.iCap();

        while(i < iCap) {
            if(arr1[i + 1] === facFami) {
                arr.pushNonNull(getCt(arr1[i], ContentGetModes.BLK));
            };
          i += 2;
        };

        return arr;
    }
    .setCache();
    exports.getFacFamiBlks = getFacFamiBlks;
