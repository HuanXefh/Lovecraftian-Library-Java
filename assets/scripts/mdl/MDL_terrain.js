/*
  ========================================
  Section: Introduction
  ========================================
*/


    /**
     * Methods related to terrain type calculation.
     * The proper name should be "biome", but it's too late for me too.
     * @module lovec/mdl/MDL_terrain
     */


/*
  ========================================
  Section: Definition
  ========================================
*/


    /* <------------------------------ auxiliary ------------------------------ */


    /**
     * @typedef {(countMap: ObjectMap<string, number>, totalCount: number, flrThr: number) => TmpStateTag|string} TerrainGetter
     */


    /** @type {Array<string>} */
    const usedMatGrps = (function() {
        let arr = [];
        MDL_event.onInit(() => {
            Vars.content.blocks().each(
                blk => tryJsProp(blk, "tempTags", Array.air).includes("env-mat-flr"),
                blk => usedMatGrps.pushUnique(tryJsProp(blk, "matGrp", "none")),
            );
            usedMatGrps.pull("none");
        });
        return arr;
    })();
    /** @type {Array<string>} */
    const warnedMatGrps = [];


    /** @type {Array<TerrainGetter>} */
    const terFs = [];
    /** @type {Array<TerrainGetter>} */
    const bankTerFs = [];
    /** @type {Object<string, Array<string>>} */
    const bankTerMatGrps = {};


    /**
     * @param {string} matGrp
     * @return {void}
     */
    function warnUnusedMatGrp(matGrp) {
        if(!warnedMatGrps.includes(matGrp) && !usedMatGrps.includes(matGrp)) {
            console.warn("[LOVEC] Material group ${1} is not used by any block!".format(matGrp.color(Pal.accent)));
            warnedMatGrps.push(matGrp);
        };
    };


    /**
     * `ARGS`: countMap, ters.
     * <br> `ARGS`: countMap, ter1, ter2, ter3, ...
     * @param {Object<string, number>} countMap
     * @return {number}
     */
    function sumCountTers(countMap) {
        let count = 0;
        if(arguments[1] instanceof Array) {
            arguments[1].forEachFast(ter => {
                count += countMap.get(ter, 0);
            }, true);
        } else {
            let i = 1, iCap = arguments.length;
            while(i < iCap) {
                count += countMap.get(arguments[i], 0);
                i++;
            };
        };
        return count;
    };


    /* <------------------------------ base ------------------------------ */


    /**
     * Registers a new terrain type composed of given material groups.
     * @param {string} ter
     * @param {Array<string>} matGrps
     * @return {void}
     */
    const newTerF = function(ter, matGrps) {
        terFs.push((map, count, thr) => sumCountTers(map, matGrps) / count < thr ? TmpStateTag.pending : ter);
    };
    exports.newTerF = newTerF;


    /**
     * Registers a new bank terrain type with given material group as the liquid part.
     * <br> A bank terrain type includes a liquid terrain type and several ground terrain types.
     * <br> Use {@link setBankTerMatGrps} to set ground part.
     * @param {string} ter
     * @param {string} liqMatGrp
     * @return {void}
     */
    const newBankTerF = function(ter, liqMatGrp) {
        bankTerFs.push((map, count, thr) => map.get(liqMatGrp, 0) / count < thr * VAR.param.terBankLiqFrac || sumCountTers(map, tryVal(bankTerMatGrps[ter], Array.air)) / count < thr * VAR.param.terBankGroundFrac ? TmpStateTag.pending : ter);
    };
    exports.newBankTerF = newBankTerF;


    /**
    * Sets ground part for a bank terrain type with given material groups.
    * Does not remove previously added ones.
    * <br> Use {@link newBankTerF} to set liquid part.
    * @param {string} name
    * @param {Array<string>} matGrps
    * @return {void}
    */
    const setBankTerMatGrps = function(name, matGrps) {
        if(bankTerMatGrps[name] == null) {
            bankTerMatGrps[name] = [];
        };
        matGrps.forEachFast(matGrp => {
            warnUnusedMatGrp(matGrp);
            bankTerMatGrps[name].pushUnique(matGrp);
        }, true);
    };
    exports.setBankTerMatGrps = setBankTerMatGrps;


    /** @type {number} */
    const MAX_CHECK_R = 30;
    /** @type {D2Array<ObjectMap<Tile, string>>} */
    const terCache = [].setValue(() => [].setValue(() => new ObjectMap(), MAX_CHECK_R + 1), Vars.maxBlockSize + 1);


    /**
     * Gets terrain type at some tile.
     * @param {Tile} t
     * @param {number|unset} [size]
     * @param {number|unset} [checkR]
     * @return {string|null} - Terrain type "transition" is null.
     */
    const getTer = function thisFun(t, size, checkR) {
        if(t == null) return null;
        if(size == null) size = 1;
        if(checkR == null) checkR = 5;

        let ter, cacheMap;

        // Use cached result if found
        cacheMap = terCache[size][checkR].get(t);
        if(cacheMap.containsKey(t)) {
            return cacheMap.get(t);
        };

        // Set up tile array
        let ts = LCPos.getTilesRect(thisFun.tmpTs, t, checkR, size);
        if(ts.length === 0) {
            cacheMap.put(t, null);
            return null;
        };
        let count = Math.pow(checkR * 2 + size, 2);
        while(ts.length < count) {
            ts.push(null);
        };

        // Set up count map
        thisFun.countMap.clear();
        ts.forEachFast(ot => {
            // For debug
            if(PARAM.ENABLE_TEST_DRAW && ot != null) {
                Fx.placeBlock.at(ot);
            };

            ter = ot == null ?
                null :
                tryJsProp(ot.floor(), "matGrp", null);
            if(ter != null) {
                thisFun.countMap.put(ter, thisFun.countMap.get(ter, 0) + 1);
            };
        }, true);

        // Calculate terrain type
        let tmpTer;
        ter = null;
        terFs.forEachFast(getter => {
            tmpTer = getter(thisFun.countMap, count, VAR.param.terFlrThr);
            if(tmpTer !== TmpStateTag.pending) {
                ter = tmpTer;
            };
        }, true);
        bankTerFs.forEachFast(getter => {
            tmpTer = getter(thisFun.countMap, count, VAR.param.terFlrThr);
            if(tmpTer !== TmpStateTag.pending) {
                ter = tmpTer;
            };
        }, true);

        cacheMap.put(t, ter);
        return ter;
    }
    .setProp({
        /**
         * @memberof getTer
         * @type {Array<Tile>}
         */
        tmpTs: [],
        /**
         * @memberof getTer
         * @type {ObjectMap<string, number>}
         */
        countMap: new ObjectMap(),
    })
    .setAnno("init", function() {
        Events.on(TileFloorChangeEvent, ev => {
            terCache.forEachFast(maps => maps.forEachFast(map => map.clear()));
        });
        TRIGGER.mapChange.addGlobalListener(() => {
            terCache.forEachFast(maps => maps.forEachFast(map => map.clear()));
        });
    });
    exports.getTer = getTer;


    /**
     * `BUNDLE`: `term.common-term-ter-<ter>.name`.
     * @param {string|unset} [ter]
     * @return {string}
     */
    const getTerBundle = function(ter) {
        return Vars.headless ? "" : MDL_bundle.getTerm("common", "ter-" + (tryVal(ter, "transition")));
    };
    exports.getTerBundle = getTerBundle;


    /* <------------------------------ component ------------------------------ */


    /**
     * Used to show current terrain type at some tile.
     * @param {Block} blk
     * @param {number} tx
     * @param {number} ty
     * @param {number} rot
     * @param {boolean} valid
     * @param {number|unset} [offTy]
     * @return {void}
     */
    const drawTerPlace = function thisFun(blk, tx, ty, rot, valid, offTy) {
        let t = Vars.world.tile(tx, ty);
        if(t == null) return;
        if(LCNativeArray.checkTupChange(thisFun.tmpTup, blk, t, rot)) {
            thisFun.tmpText = getTerBundle(getTer(t, blk.size, tryFun(blk.ex_getTerrainCheckR, blk, 5)));
        };
        LCDrawf.textPlace(blk, tx, ty, MDL_bundle.getInfo("lovec", "text-terrain") + " " + thisFun.tmpText, valid, offTy);
    }
    .setProp({
        /**
         * @memberof drawTerPlace
         * @type {[Block, Tile, number]}
         */
        tmpTup: [],
        /**
         * @memberof drawTerPlace
         * @type {string}
         */
        tmpText: "",
    });
    exports.drawTerPlace = drawTerPlace;
