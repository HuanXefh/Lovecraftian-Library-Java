/*
  ========================================
  Section: Introduction
  ========================================
*/


    /**
     * Just random methods for random purpose.
     * @module lovec/frag/FRAG_faci
     */


/*
  ========================================
  Section: Definition
  ========================================
*/


    /* <------------------------------ core energy ------------------------------ */


    /** @type {ObjectMap<string, number>} */
    const cepCapMap = new ObjectMap();
    /** @type {ObjectMap<string, number>} */
    const cepUseMap = new ObjectMap();
    /** @type {ObjectMap<string, number>} */
    const cepFracMap = new ObjectMap();
    /** @type {ObjectMap<string, number>} */
    const cepEffcMap = new ObjectMap();


    /**
     * Gets amount of CEPs provided by some block.
     * @param {BlockGn} blk_gn
     * @return {number}
     */
    const getCepProv = function(blk_gn) {
        let blk = MDL_content.getCt(blk_gn, "blk");
        return blk == null ?
            0.0 :
            DB_block.db["param"]["cep"]["prov"].read(blk.name, MDL_cond.isCoreBlock(blk) ? 5.0 : 0.0);
    }
    .setCache();
    exports.getCepProv = getCepProv;


    /**
     * Gets amount of CEPs used by some block.
     * @param {BlockGn} blk_gn
     * @return {number}
     */
    const getCepUse = function(blk_gn) {
        let blk = MDL_content.getCt(blk_gn, "blk");
        return blk == null ?
            0.0 :
            DB_block.db["param"]["cep"]["use"].read(blk.name, 0.0);
    }
    .setCache();
    exports.getCepUse = getCepUse;


    /**
     * Gets current amount of CEPs provided for some team.
     * @param {Team} team
     * @return {number}
     */
    const getCepCapCur = function(team) {
        return cepCapMap.get(team.name, 0.0);
    };
    exports.getCepCapCur = getCepCapCur;


    /**
     * Gets current amount of CEPs used for some team.
     * @param {Team} team
     * @return {number}
     */
    const getCepUseCur = function(team) {
        return cepUseMap.get(team.name, 0.0);
    };
    exports.getCepUseCur = getCepUseCur;


    /**
     * Gets current fraction of CEPs used for some team.
     * @param {Team} team
     * @return {number}
     */
    const getCepFracCur = function(team) {
        return cepFracMap.get(team.name, 0.0);
    };
    exports.getCepFracCur = getCepFracCur;


    /**
     * Gets current efficiency of core energy for some team.
     * @param {Team} team
     * @return {number}
     */
    const getCepEffcCur = function(team) {
        return cepEffcMap.get(team.name, 1.0);
    };
    exports.getCepEffcCur = getCepEffcCur;


    /* <------------------------------ mining ------------------------------ */


    /**
     * Gets the drill speed for some block.
     * @param {Block} blk
     * @param {boolean|unset} [boosted]
     * @return {number}
     */
    const getDrillSpd = function(blk, boosted) {
        return readClassFunMap(DB_block.db["class"]["map"]["drillSpd"], blk, Function.airZero)(blk, tryVal(boosted, false)) * tryJsProp(blk, "drillAmtMtp", 1.0);
    };
    exports.getDrillSpd = getDrillSpd;


    /**
     * Gets text for given depth level from bundle.
     * @param {number} depthLvl
     * @return {string}
     */
    const getDepthLvlB = function thisFun(depthLvl) {
        return "${1} (${2})".format(
            depthLvl,
            MDL_bundle.getTerm.apply(null, DB_misc.db["block"]["depthName"].read(depthLvl, thisFun.tmpTup.with("lovec", "unknown"))),
        );
    }
    .setProp({
        /**
         * @memberof getDepthLvlB
         * @type {[string, string]}
         */
        tmpTup: [],
    });
    exports.getDepthLvlB = getDepthLvlB;


    /**
     * Gets resource level of a tree.
     * @param {Block} blk
     * @return {number}
     */
    const getTreeRsLvl = function(blk) {
        if(!MDL_cond.isTreeBlock(blk)) return 0.0;
        let
            treeGrp = tryJsProp(blk, "treeGrp", "none"),
            rsLvl = 0.0,
            attrsGn = readParam(DB_env.db["grpParam"]["tree"].read(treeGrp), "attrsF", Function.airArr)();
        if(attrsGn.length !== 0) {
            rsLvl = Math.max.apply(null, attrsGn.map(attrGn => blk.attributes.get(MDL_attr.getAttr(attrGn, true))));
        };
        return rsLvl;
    };
    exports.getTreeRsLvl = getTreeRsLvl;


    /* <------------------------------ turret ------------------------------ */


    /**
     * Sets up outline parameters for a content.
     * @param {UnlockableContent} ct
     * @return {void}
     */
    const setupOutline = function(ct) {
        let tup = DB_unit.db["grpParam"]["outline"].read(MDL_content.getMod(ct));
        if(tup == null) return;

        if(tup[0] < 1) {
            if(ct.outlines != null) ct.outlines = false;
        } else {
            ct.outlineRadius = tup[0];
            ct.outlineColor = MDL_color.getColor(tup[1], "new");
        };
    };
    exports.setupOutline = setupOutline;


/*
  ========================================
  Section: Application
  ========================================
*/




    MDL_event.onLoad(() => {

        let
            cepCapObj = {},
            cepUseObj = {};

        TRIGGER.majorIter.start.addGlobalListener(() => {
            VARGEN.mainTeams.forEachFast(team => {
                cepCapObj[team.name] = 0.0;
                cepUseObj[team.name] = 0.0;
            }, true);
        });
        TRIGGER.majorIter.building.addGlobalListener((b, isActive) => {
            if(!isActive) return;
            cepCapObj[b.team.name] += getCepProv(b.block);
            if(b.cheating()) return;
            cepUseObj[b.team.name] += getCepUse(b.block);
        });
        TRIGGER.majorIter.end.addGlobalListener(() => {
            VARGEN.mainTeams.forEachFast(team => {
                cepCapMap.put(team.name, cepCapObj[team]);
                cepUseMap.put(team.name, cepUseObj[team]);
                cepFracMap.put(team.name, cepCapObj[team] < 0.0001 ? 1.0 : cepUseObj[team] / cepCapObj[team]);
                cepEffcMap.put(team.name, cepFracMap.get(team) < 1.0001 ? 1.0 : Mathf.maxZero((2.0 * cepCapObj[team] - cepUseObj[team]) / cepCapObj[team]));
            }, true);
        });

    });
