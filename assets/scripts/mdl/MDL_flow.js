/*
  ========================================
  Section: Introduction
  ========================================
*/


    /**
     * Methods related to fluids and abstract fluids.
     * @module lovec/mdl/MDL_flow
     */


/*
  ========================================
  Section: Definition
  ========================================
*/


    /* <------------------------------ auxiliary ------------------------------> */


    /**
     * @param {number} val
     * @param {number} valHalf
     * @param {number} valMax
     * @param {number} base
     * @return {number}
     */
    function halfLogWrap(val, valHalf, valMax, base) {
        return base == null ?
            (1.0 - 0.5 * (Math.log(valMax + 1.0) - Math.log(val + 1.0)) / (Math.log(valMax + 1.0) - Math.log(valHalf + 1.0))) :
            (1.0 - 0.5 * (Mathf.log(base, valMax + 1.0) - Mathf.log(base, val + 1.0)) / (Mathf.log(base, valMax + 1.0) - Mathf.log(base, valHalf + 1.0)));
    };


    /* <------------------------------ base (group) ------------------------------> */


    /**
     * Gets elementary group of a fluid, null if not found.
     * See {@link DB_fluid.db.group.elementary}.
     * @param {LiquidGn} liq_gn
     * @returns {string|null}
     */
    const getEleGrp = function(liq_gn) {
        let liq = MDL_content.getCt(liq_gn, ContentGetModes.RS);
        if(liq == null) return null;
        let obj = DB_fluid.db["group"]["elementary"];
        for(let key in obj) {
            if(obj[key].includes(liq.name)) return key;
        };
        return null;
    }
    .setCache();
    exports.getEleGrp = getEleGrp;


    /**
     * `BUNDLE`: `term.common-term-grp-<eleGrp>.name`.
     * @param {LiquidGn} liq_gn
     * @return {TmpStateTag|string}
     */
    const getEleGrpBundle = function(liq_gn) {
        let eleGrp = getEleGrp(liq_gn);
        if(eleGrp == null) return TmpStateTag.error;
        return MDL_bundle.getTerm("common", "grp-" + eleGrp);
    }
    .setCache();
    exports.getEleGrpBundle = getEleGrpBundle;


    /**
     * Gets material group of a block, mostly for corrosion calculation.
     * See {@link DB_block.db.group.material}.
     * <br> Not floor material in {@link ENV_materialFloor}!
     * @param {BlockGn} blk_gn
     * @returns {string|null}
     */
    const getMatGrp = function(blk_gn) {
        let blk = MDL_content.getCt(blk_gn, ContentGetModes.BLK);
        if(blk == null) return null;
        let obj = DB_block.db["group"]["material"];
        for(let key in obj) {
            if(obj[key].includes(blk.name)) return key;
        };
        return null;
    }
    .setCache();
    exports.getMatGrp = getMatGrp;


    /**
     * `BUNDLE`: `term.common-term-grp-<matGrp>.name`.
     * @param {BlockGn} blk_gn
     * @return {TmpStateTag|string}
     */
    const getMatGrpBundle = function(blk_gn) {
        let matGrp = getMatGrp(blk_gn);
        if(matGrp == null) return TmpStateTag.error;
        return MDL_bundle.getTerm("common", "grp-" + matGrp);
    }
    .setCache();
    exports.getMatGrpBundle = getMatGrpBundle;


    /**
     * Gets fluid tags of the given fluid.
     * See {@link DB_fluid.db.group.fTag}.
     * @param {LiquidGn} liq_gn
     * @return {Array<string>}
     */
    const getFTags = function(liq_gn) {
        let arr0 = [];
        let liq = MDL_content.getCt(liq_gn, ContentGetModes.RS);
        if(liq == null) return arr0;
        Object.eachPair(DB_fluid.db["group"]["fTag"], (key, arr) => {
            if(arr.includes(liq.name)) arr0.push(key);
        });
        return arr0;
    }
    .setCache();
    exports.getFTags = getFTags;


    /**
     * Gets fluid tag text of the given fluid.
     * <br> `BUNDLE`: `term.common-grp-<fldTag>.name`.
     * @param {LiquidGn} liq_gn
     * @return {string}
     */
    const getFTagsBundle = function(liq_gn) {
        return MDL_text.getTagText(
            getFTags(liq_gn).map(tag => MDL_bundle.getTerm("common", "grp-" + tag))
        );
    }
    .setCache();
    exports.getFTagsBundle = getFTagsBundle;


    /* <------------------------------ base (param) ------------------------------> */


    /**
     * Gets density of a fluid.
     * <br> `DB`: `liquid-density`.
     * @param {LiquidGn} liq_gn
     * @return {number}
     */
    const getDens = function thisFun(liq_gn) {
        let dens = 1.0;
        let liq = MDL_content.getCt(liq_gn, ContentGetModes.RS);
        if(liq == null) return dens;
        dens = LCDBFileHandler.read("liquid-density", liq);
        if(dens == null) {
            let densDef = liq.gas ? thisFun.defGasDens : thisFun.defLiqDens;
            let eleGrp = getEleGrp(liq);
            dens = eleGrp == null ? densDef : DB_fluid.db["grpParam"]["dens"].read(eleGrp, densDef);
        };
        return dens;
    }
    .setProp({
        /**
         * @memberof getDens
         * @type {number}
         */
        defLiqDens: 1.0,
        /**
         * @memberof getDens
         * @type {number}
         */
        defGasDens: 0.00129,
    })
    .setCache();
    exports.getDens = getDens;


    /**
     * Gets boiling point of a fluid (in HU).
     * <br> `DB`: `liquid-boiling-point`.
     * @param {LiquidGn} liq_gn
     * @return {number}
     */
    const getBoilPon = function thisFun(liq_gn) {
        let boilPon = thisFun.defBoilPon;
        let liq = MDL_content.getCt(liq_gn, ContentGetModes.RS);
        if(liq == null) return boilPon;
        if(liq.solvent != null) {
            boilPon = DB_fluid.db["grpParam"]["solventBoil"].read(liq.solvent);
            if(boilPon != null) return boilPon;
        };
        boilPon = LCDBFileHandler.read("liquid-boiling-point", liq);
        if(boilPon == null) {
            let eleGrp = getEleGrp(liq);
            boilPon = eleGrp == null ?
                thisFun.defBoilPon :
                DB_fluid.db["grpParam"]["boil"].read(eleGrp, thisFun.defBoilPon);
        };
        return boilPon;
    }
    .setProp({
        /**
         * @memberof getBoilPon
         * @type {number}
         */
        defBoilPon: 100.0,
    })
    .setCache();
    exports.getBoilPon = getBoilPon;


    /**
     * Gets fluid heat of a fluid.
     * <br> `DB`: `liquid-fluid-heat`.
     * @param {LiquidGn} liq_gn
     * @return {number}
     */
    const getFHeat = function thisFun(liq_gn) {
        let fHeat = thisFun.defFHeat;
        let liq = MDL_content.getCt(liq_gn, ContentGetModes.RS);
        if(liq == null) return fHeat;
        fHeat = LCDBFileHandler.read("liquid-fluid-heat", liq, thisFun.defFHeat);
        return fHeat;
    }
    .setProp({
        /**
         * @memberof getFHeat
         * @type {number}
         */
        defFHeat: 26.0,
    })
    .setCache();
    exports.getFHeat = getFHeat;


    /**
     * Gets wrapped temperature of a fluid.
     * @param {LiquidGn} liq_gn
     * @return {number}
     */
    const getTempWrap = function thisFun(liq_gn) {
        return halfLogWrap(getFHeat(liq_gn), thisFun.tempHalf, thisFun.tempMax);
    }
    .setProp({
        /**
         * @memberof getTempWrap
         * @type {number}
         */
        tempHalf: 26.0,
        /**
         * @memberof getTempWrap
         * @type {number}
         */
        tempMax: 1500.0,
    })
    .setCache();
    exports.getTempWrap  = getTempWrap;


    /**
     * Gets wrapped viscosity of a fluid.
     * <br> `DB`: `liquid-viscosity`.
     * @param {LiquidGn} liq_gn
     * @return {number}
     */
    const getViscWrap = function thisFun(liq_gn) {
        let viscWrap = thisFun.defLiqViscWrap;
        let liq = MDL_content.getCt(liq_gn, ContentGetModes.RS);
        if(liq == null) return viscWrap;
        let visc = LCDBFileHandler.read("liquid-viscosity", liq);
        if(visc != null) {
            viscWrap = halfLogWrap(visc, thisFun.viscHalf, thisFun.viscMax);
        } else {
            if(liq.gas) {
                viscWrap = thisFun.defGasViscWrap;
            } else {
                let eleGrp = getEleGrp(liq);
                viscWrap = eleGrp == null ? thisFun.defLiqViscWrap : DB_fluid.db["grpParam"]["viscWrap"].read(eleGrp, thisFun.defLiqViscWrap);
            };
        };
        return viscWrap;
    }
    .setProp({
        /**
         * @memberof getViscWrap
         * @type {number}
         */
        viscHalf: 0.98,
        /**
         * @memberof getViscWrap
         * @type {number}
         */
        viscMax: 2800.0,
        /**
         * @memberof getViscWrap
         * @type {number}
         */
        defLiqViscWrap: 0.5,
        /**
         * @memberof getViscWrap
         * @type {number}
         */
        defGasViscWrap: 0.15,
    })
    .setCache();
    exports.getViscWrap = getViscWrap;


    /**
     * Gets maximum pressure allowed for a block.
     * <br> `DB`: `block-pressure-resistance`.
     * @param {BlockGn} blk_gn
     * @return {number}
     */
    const getPresRes = function thisFun(blk_gn) {
        let res = thisFun.defRes;
        let blk = MDL_content.getCt(blk_gn, ContentGetModes.BLK);
        if(blk == null) return res;
        res = LCDBFileHandler.read("block-pressure-resistance", blk);
        if(res == null) {
            let matGrp = getMatGrp(blk);
            res = matGrp == null ? thisFun.defRes : DB_block.db["grpParam"]["presRes"].read(matGrp, thisFun.defRes);
        };
        return res;
    }
    .setProp({
        /**
         * @memberof getPresRes
         * @type {number}
         */
        defRes: 5.0,
    })
    .setCache();
    exports.getPresRes = getPresRes;


    /**
     * Gets maximum vacuum allowed for a block.
     * <br> `DB`: `block-vacuum-resistance`.
     * @param {BlockGn} blk_gn
     * @return {number}
     */
    const getVacRes = function thisFun(blk_gn) {
        let res = thisFun.defRes;
        let blk = MDL_content.getCt(blk_gn, ContentGetModes.BLK);
        if(blk == null) return res;
        res = LCDBFileHandler.read("block-vacuum-resistance", blk);
        if(res == null) {
            let matGrp = getMatGrp(blk);
            res = matGrp == null ? thisFun.defRes : DB_block.db["grpParam"]["vacRes"].read(matGrp, thisFun.defRes);
        };
        return res;
    }
    .setProp({
        /**
         * @memberof getVacRes
         * @type {number}
         */
        defRes: -5.0,
    })
    .setCache();
    exports.getVacRes = getVacRes;


    /**
     * Gets pressure in a building, can be negative for vacuum.
     * @param {Building} b
     * @return {number}
     */
    const getPresByBuild = function(b) {
        return tryFun(
            b.ex_getPres, b,
            b.liquids == null ? 0.0 : (b.liquids.get(VARGEN.auxPres) - b.liquids.get(VARGEN.auxVac))
        );
    };
    exports.getPresByBuild = getPresByBuild;


    /* <------------------------------ corrosion ------------------------------> */


    /**
     * Gets corrosion power of a fluid.
     * <br> `DB`: `liq-core-pow`.
     * @param {LiquidGn} liq_gn
     * @return {number}
     */
    const getCorPow = function thisFun(liq_gn) {
        let corPow = thisFun.defCorPow;
        let liq = MDL_content.getCt(liq_gn, ContentGetModes.RS);
        if(liq == null) return corPow;
        corPow = LCDBFileHandler.read("liquid-corrosion-power", liq);
        if(corPow == null) {
            let eleGrp = getEleGrp(liq);
            corPow = eleGrp == null ? thisFun.defCorPow : corPow = DB_fluid.db["grpParam"]["corrosion"].read(eleGrp, thisFun.defCorPow);
        };
        return corPow;
    }
    .setProp({
        /**
         * @memberof getCorPow
         * @type {number}
         */
        defCorPow: 0.0,
    })
    .setCache();
    exports.getCorPow = getCorPow;


    /**
     * Calculates multiplier on corrosion damage for a pair of block and fluid.
     * @param {BlockGn} blk_gn
     * @param {LiquidGn} liq_gn
     * @return {number}
     */
    const calcCorMtp = function thisFun(blk_gn, liq_gn) {
        let
            corMtp = thisFun.defCorMtp,
            blk = MDL_content.getCt(blk_gn, ContentGetModes.BLK),
            liq = MDL_content.getCt(liq_gn, ContentGetModes.RS);

        if(blk == null || liq == null) return corMtp;
        let eleGrp = tryJsProp(liq, "eleGrp", null);
        let matGrp = tryJsProp(blk, "matGrp", null);
        if(matGrp == null) return corMtp;
        let matEleSclArr = DB_fluid.db["grpParam"]["matEleScl"][matGrp];
        corMtp = eleGrp == null || matEleSclArr == null ?
            thisFun.defCorMtp :
            matEleSclArr.read(eleGrp, thisFun.defCorMtp);

        let tagMtp, matFTagSclArr;
        tryJsProp(liq, "fTags", Array.air).forEachFast(tag => {
            matFTagSclArr = DB_fluid.db["grpParam"]["matFTagScl"][matGrp];
            tagMtp = matFTagSclArr == null ? thisFun.defCorMtp : matFTagSclArr.read(tag, thisFun.defCorMtp);
            corMtp *= tagMtp;
        }, true);

        return corMtp;
    }
    .setProp({
        /**
         * @memberof calcCorMtp
         * @type {number}
         */
        defCorMtp: 1.0,
    })
    .setCache();
    exports.calcCorMtp = calcCorMtp;


    /**
     * Gets corrosion resistance of a block.
     * <br> `DB`: `block-corrosion-resistance`.
     * @param {BlockGn} blk_gn
     * @return {number}
     */
    const getCorRes = function thisFun(blk_gn) {
        let corRes = thisFun.defCorRes;
        let blk = MDL_content.getCt(blk_gn, ContentGetModes.BLK);
        if(blk == null) return corRes;
        corRes = LCDBFileHandler.read("block-corrosion-resistance", blk);
        if(corRes == null) {
            let matGrp = getMatGrp(blk);
            corRes = matGrp == null ? thisFun.defCorRes : DB_block.db["grpParam"]["corRes"].read(matGrp, thisFun.defCorRes);
        };
        return corRes;
    }
    .setProp({
        /**
         * @memberof getCorRes
         * @type {number}
         */
        defCorRes: 1.0,
    })
    .setCache();
    exports.getCorRes = getCorRes;


    /**
     * Updates corrosion in a building.
     * @param {Building} b
     * @param {Liquid} liq
     * @param {number} amt
     * @return {void}
     */
    const updateCorrosion = function(b, liq, amt) {
        if(PARAM.UPDATE_SUPPRESSED || !Vars.state.rules.fire || !TIMER.secQuarter || amt < 0.05 || !syncChance("corrosion", 0.25)) return;

        let corPow = tryJsProp(liq, "corPow", 0.0);
        let corMtp = calcCorMtp(b.block, liq);
        if(corPow < 0.01 && corMtp > 1.0) {
            corPow = 1.0;
        };
        if(corPow < 0.01) return;
        let corRes = tryJsProp(b.block, "corRes", 1.0);

        b.damagePierce((b.maxHealth * VAR.param.corDmgFrac + VAR.param.corDmgMin) * corPow * corMtp / corRes);
        if(Mathf.chance(0.5)) {
            MDL_effect.corrosion(b.x, b.y, b.block.size, liq.color);
        };
    };
    exports.updateCorrosion = updateCorrosion;


    /**
     * Updates clogging in a building.
     * @param {Building} b
     * @param {Liquid} liq
     * @param {number} amt
     * @return {void}
     */
    const updateClogging = function(b, liq, amt) {
        if(PARAM.UPDATE_SUPPRESSED || !Vars.state.rules.fire || !TIMER.secQuarter || amt < 0.05 || liq.viscosity < VAR.param.clogViscThr || !syncChance("clogging", 0.25)) return;

        b.damagePierce((b.maxHealth * VAR.param.clogDmgFrac + VAR.param.clogDmgMin) * Mathf.lerp(0.5, 1.0, amt / b.block.liquidCapacity) * Mathf.lerp(0.5, 1.0, liq.viscosity / VAR.param.clogViscThr * 4.0));
        if(Mathf.chance(0.5)) {
            MDL_effect.corrosion(b.x, b.y, b.block.size, liq.color, true);
        };
    };
    exports.updateClogging = updateClogging;


    /* <------------------------------ heat ------------------------------> */


    /**
     * Gets maximum heat allowed for a block.
     * <br> `DB`: `block-heat-resistance`.
     * @param {BlockGn} blk_gn
     * @return {number}
     */
    const getHeatRes = function thisFun(blk_gn) {
        let heatRes = thisFun.defHeatRes;
        let blk = MDL_content.getCt(blk_gn, ContentGetModes.BLK);
        if(blk == null) return heatRes;
        heatRes = LCDBFileHandler.read("block-heat-resistance", blk);
        if(heatRes == null) {
            let matGrp = getMatGrp(blk);
            heatRes = matGrp == null ? thisFun.defHeatRes : DB_block.db["grpParam"]["heatRes"].read(matGrp, thisFun.defHeatRes);
        };
        return heatRes;
    }
    .setProp({
        /**
         * @memberof getHeatRes
         * @type {number}
         */
        defHeatRes: Infinity,
    })
    .setCache();
    exports.getHeatRes = getHeatRes;


    /**
     * Gets heat in a building.
     * @param {Building} b
     * @return {number}
     */
    const getHeatInBuild = function(b) {
        return tryFun(
            b.ex_getHeat, b,
            b.liquids == null ? 0.0 : b.liquids.get(VARGEN.auxHeat) * 100.0,
        );
    };
    exports.getHeatInBuild = getHeatInBuild;


    /**
     * Gets current fluid heat in a building.
     * @param {Building} b
     * @param {boolean|unset} [forceCalc] - If true, this method will always calculate heat based on liquid module.
     * @return {number}
     */
    const getFHeatInBuild = function(b, forceCalc) {
        let def = PARAM.GLOBAL_HEAT;
        if(!forceCalc) {
            if(tryJsProp(b, "fHeatCur") != null) return b.delegee.fHeatCur;
        };
        if(b.liquids == null) return def;

        let liqCur = b.liquids.current();
        let amt = b.liquids.get(liqCur);
        if(amt < 0.01) return def;
        let cap = b.block.liquidCapacity;
        if(cap < 0.0001) return def;
        let fHeatBase = LCDBFileHandler.read("liquid-fluid-heat", liqCur, def);

        return fHeatBase * (1.0 + amt / cap * 0.2);
    };
    exports.getFHeatInBuild = getFHeatInBuild;


    /**
     * Calculates range heat at some tile.
     * @param {Tile|null} t
     * @return {number}
     */
    const calcRHeat = function(t) {
        if(t == null) return 0.0;

        let rHeat = PARAM.GLOBAL_HEAT + calcStaticRHeat(t);
        let ot;

        // Building
        if(t.build != null) {
            rHeat += getHeatInBuild(t.build) * 0.25 + getFHeatInBuild(t.build) * 0.5;
        };

        // Puddle
        let puddle = Puddles.get(t);
        if(puddle != null) {
            rHeat += getFHeat(puddle.liquid) * 0.75;
        };

        // Nearby heat sources
        let
            sideRHeat = 0.0,
            sideRHeatCount = 0;
        for(let i = 0; i < 4; i++) {
            ot = t.nearby(i);
            if(ot != null) {
                if(ot.build != null) {
                    sideRHeat += getHeatInBuild(ot.build);
                    sideRHeatCount++;
                };
            };
        };
        if(sideRHeatCount > 0) {
            rHeat += sideRHeat / sideRHeatCount;
        };

        return rHeat;
    }
    .setProp({
        /**
         * @memberof calcRHeat
         * @type {ObjectMap<Tile, number>}
         */
        staticRHeatCache: new ObjectMap(),
    })
    .setAnno("init", function() {
        TRIGGER.mapChange.addGlobalListener(() => {
            this.staticRHeatCache.clear();
        });
    });
    exports.calcRHeat = calcRHeat;


    /**
     * @param {Tile}
     * @return {number}
     */
    const calcStaticRHeat = function(t) {
        let rHeat = 0.0;

        // Attribute
        let ot;
        for(let i = 0; i < 4; i++) {
            ot = t.nearby(i);
            if(ot != null) {
                rHeat += ot.floor().attributes.get(TP_attr.attr0env_heat) * 100.0;
            };
        };
        rHeat /= 4;
        rHeat += t.floor().attributes.get(TP_attr.attr0env_heat) * 100.0;

        return rHeat;
    }
    .setCache(calcRHeat.staticRHeatCache);


    /**
     * Gets range heat resistance of a unit type.
     * @param {UnitType} utp
     * @return {number}
     */
    const getRHeatRes = function(utp) {
        return Math.sqrt(utp.health) * utp.hitSize * 0.7;
    }
    .setCache();
    exports.getRHeatRes = getRHeatRes;
