/*
  ========================================
  Section: Introduction
  ========================================
*/


    /**
     * Methods related to recipe dictionary.
     * @module lovec/mdl/MDL_recipeDict
     */


/*
  ========================================
  Section: Definition
  ========================================
*/


    const rcDict = {
        /** @type {boolean} */
        hasInit: false,
        /** @type {ObjectMap<string, RecipeDictionaryCustomFieldData>} */
        customFieldMap: new ObjectMap(),

        cons: {},
        prod: {},
    };
    exports.rcDict = rcDict;


    /**
     * Registers a new custom field.
     * @param {string} name
     * @param {RecipeDictionaryCustomFieldData} data
     * @return {void}
     */
    const newCustomField = function(name, data) {
        if(data.mod != null && Vars.mods.locateMod(data.mod) == null) return;
        rcDict.customFieldMap.put(name, data);
        MDL_event.onLoad(() => {
            data.icon = findRegionDrawable(data.icon);
        });
    };
    exports.newCustomField = newCustomField;


    /**
     * `BUNDLE`: `term.common-term-rcdict-custom-<name>.name`.
     * @param {string} name
     * @return {string}
     */
    const getCustomFieldBundle = function(name) {
        return MDL_bundle.getTerm("common", "rcdict-custom-" + name);
    };
    exports.getCustomFieldBundle = getCustomFieldBundle;


    /**
     * Adds an item consumption term.
     * Should be called strictly after CLIENT LOAD.
     * @param {BlockGn} blk_gn
     * @param {ItemGn} item_gn
     * @param {number} amt
     * @param {number|unset} [p]
     * @param {RecipeDictionaryData|unset} [data]
     * @return {void}
     */
    const addItemConsTerm = function(blk_gn, item_gn, amt, p, data) {
        if(!rcDict.hasInit) throw new LCError.RecipeDictionaryUninitializedError();

        let blk = MDL_content.getCt(blk_gn, ContentGetModes.BLK);
        if(blk == null) return;
        let item = MDL_content.getCt(item_gn, ContentGetModes.RS);
        if(item == null) return;
        if(p == null) p = 1.0;
        if(p < 0.0001) return;

        rcDict.cons.item[item.id].push(
            blk,
            amt * p,
            tryVal(data, Object.air),
        );
    };
    exports.addItemConsTerm = addItemConsTerm;


    /**
     * Adds a fluid consumption term.
     * Should be called strictly after CLIENT LOAD.
     * @param {BlockGn} blk_gn
     * @param {LiquidGn} liq_gn
     * @param {number} amt
     * @param {RecipeDictionaryData|unset} [data]
     * @return {void}
     */
    const addFldConsTerm = function(blk_gn, liq_gn, amt, data) {
        if(!rcDict.hasInit) throw new LCError.RecipeDictionaryUninitializedError();

        let blk = MDL_content.getCt(blk_gn, ContentGetModes.BLK);
        if(blk == null) return;
        let liq = MDL_content.getCt(liq_gn, ContentGetModes.RS);
        if(liq == null) return;

        rcDict.cons.fluid[liq.id].push(
            blk,
            amt,
            tryVal(data, Object.air),
        );
    };
    exports.addFldConsTerm = addFldConsTerm;


    /**
     * Adds a payload consumption term.
     * Should be called strictly after CLIENT LOAD.
     * @param {BlockGn} blk_gn
     * @param {string|Block|UnitType|null} ct_gn
     * @param {number} amt
     * @param {RecipeDictionaryData|unset} [data]
     * @return {void}
     */
    const addPayConsTerm = function(blk_gn, ct_gn, amt, data) {
        if(!rcDict.hasInit) throw new LCError.RecipeDictionaryUninitializedError();

        let blk = MDL_content.getCt(blk_gn, ContentGetModes.BLK);
        if(blk == null) return;
        let ct = MDL_content.getCt(ct_gn, null, true);
        if(ct == null) return;

        rcDict.cons[(ct instanceof Block ? "block" : "unit")][ct.id].push(
            blk,
            amt,
            tryVal(data, Object.air),
        );
    };
    exports.addPayConsTerm = addPayConsTerm;


    /**
     * Adds a custom consumption term.
     * Should be called strictly after CLIENT LOAD.
     * @param {BlockGn} blk_gn
     * @param {string} name
     * @param {number} amt
     * @param {RecipeDictionaryData|unset} [data]
     * @return {void}
     */
    const addCustomConsTerm = function(blk_gn, name, amt, data) {
        if(!rcDict.hasInit) throw new LCError.RecipeDictionaryUninitializedError();
        if(rcDict.cons[name] == null) throw new LCError.RecipeDictionaryCustomFieldNotFoundError(name);

        let blk = MDL_content.getCt(blk_gn, ContentGetModes.BLK);
        if(blk == null) return;

        rcDict.cons[name].push(
            blk,
            amt,
            tryVal(data, Object.air),
        );
    };
    exports.addCustomConsTerm = addCustomConsTerm;


    /**
     * Adds an item production term.
     * Should be called strictly after CLIENT LOAD.
     * @param {BlockGn} blk_gn
     * @param {ItemGn} item_gn
     * @param {number} amt
     * @param {number|unset} [p]
     * @param {RecipeDictionaryData|unset} [data]
     * @return {void}
     */
    const addItemProdTerm = function(blk_gn, item_gn, amt, p, data) {
        if(!rcDict.hasInit) throw new LCError.RecipeDictionaryUninitializedError();

        let blk = MDL_content.getCt(blk_gn, ContentGetModes.BLK);
        if(blk == null) return;
        let item = MDL_content.getCt(item_gn, ContentGetModes.RS);
        if(item == null) return;
        if(p == null) p = 1.0;
        if(p < 0.0001) return;

        rcDict.prod.item[item.id].push(
            blk,
            amt * p,
            tryVal(data, Object.air),
        );
    };
    exports.addItemProdTerm = addItemProdTerm;


    /**
     * Adds a fluid production term.
     * Should be called strictly after CLIENT LOAD.
     * @param {BlockGn} blk_gn
     * @param {LiquidGn} liq_gn
     * @param {number} amt
     * @param {RecipeDictionaryData|unset} [data]
     * @return {void}
     */
    const addFldProdTerm = function(blk_gn, liq_gn, amt, data) {
        if(!rcDict.hasInit) throw new LCError.RecipeDictionaryUninitializedError();

        let blk = MDL_content.getCt(blk_gn, ContentGetModes.BLK);
        if(blk == null) return;
        let liq = MDL_content.getCt(liq_gn, ContentGetModes.RS);
        if(liq == null) return;

        rcDict.prod.fluid[liq.id].push(
            blk,
            amt,
            tryVal(data, Object.air),
        );
    };
    exports.addFldProdTerm = addFldProdTerm;


    /**
     * Adds a payload production term.
     * Should be called strictly after CLIENT LOAD.
     * @param {BlockGn} blk_gn
     * @param {string|Block|UnitType|null} ct_gn
     * @param {number} amt
     * @param {RecipeDictionaryData|unset} [data]
     * @return {void}
     */
    const addPayProdTerm = function(blk_gn, ct_gn, amt, data) {
        if(!rcDict.hasInit) throw new LCError.RecipeDictionaryUninitializedError();

        let blk = MDL_content.getCt(blk_gn, ContentGetModes.BLK);
        if(blk == null) return;
        let ct = MDL_content.getCt(ct_gn, null, true);
        if(ct == null) return;

        rcDict.prod[(ct instanceof Block ? "block" : "unit")][ct.id].push(
            blk,
            amt,
            tryVal(data, Object.air),
        );
    };
    exports.addPayProdTerm = addPayProdTerm;


    /**
     * Adds a custom production term.
     * Should be called strictly after CLIENT LOAD.
     * @param {BlockGn} blk_gn
     * @param {string} name
     * @param {number} amt
     * @param {RecipeDictionaryData|unset} [data]
     * @return {void}
     */
    const addCustomProdTerm = function(blk_gn, name, amt, data) {
        if(!rcDict.hasInit) throw new LCError.RecipeDictionaryUninitializedError();
        if(rcDict.prod[name] == null) throw new LCError.RecipeDictionaryCustomFieldNotFoundError(name);

        let blk = MDL_content.getCt(blk_gn, ContentGetModes.BLK);
        if(blk == null) return;

        rcDict.prod[name].push(
            blk,
            amt,
            tryVal(data, Object.air),
        );
    };
    exports.addCustomProdTerm = addCustomProdTerm;


    /**
     * Gets consumption amount of `ct_gn` by `blk_gn`.
     * @param {ContentGn} ct_gn - Can be a custom field name.
     * @param {BlockGn} blk_gn
     * @return {number}
     */
    const getConsAmt = function(ct_gn, blk_gn) {
        let val = 0.0;
        if(ct_gn == null) return val;
        let ct = rcDict.customFieldMap.containsKey(ct_gn) ?
            TmpStateTag.customValue :
            MDL_content.getCt(ct_gn, null, true);
        let blk = MDL_content.getCt(blk_gn, ContentGetModes.BLK);
        if(ct == null || blk == null) return val;

        let arr = ct === TmpStateTag.customValue ?
            rcDict.cons[ct_gn] :
            ct instanceof Item ?
                rcDict.cons.item[ct.id] :
                ct instanceof Liquid ?
                    rcDict.cons.fluid[ct.id] :
                    ct instanceof UnitType ?
                        rcDict.cons.unit[ct.id] :
                        rcDict.cons.block[ct.id];
        let i = 0, iCap = arr.iCap();
        while(i < iCap) {
            if(arr[i] === blk) {
                val = Math.max(arr[i + 1], val);
            };
            i += 3;
        };

        return val;
    }
    .setCache();
    exports.getConsAmt = getConsAmt;


    /**
     * Variant of {@link getConsAmt} for buildings.
     * @param {ContentGn} ct_gn
     * @param {Building} b
     * @return {number}
     */
    const getConsAmtByBuild = function(ct_gn, b) {
        let ct = MDL_content.getCt(ct_gn, null, true);
        return tryFun(b.ex_getConsAmt, b, getConsAmt(ct, b.block), ct);
    };
    exports.getConsAmtByBuild = getConsAmtByBuild;


    /**
     * Gets production amount of `ct_gn` by `blk_gn`.
     * @param {ContentGn} ct_gn - Can be a custom field name.
     * @param {BlockGn} blk_gn
     * @return {number}
     */
    const getProdAmt = function(ct_gn, blk_gn) {
        let val = 0.0;
        if(ct_gn == null) return val;
        let ct = rcDict.customFieldMap.containsKey(ct_gn) ?
            TmpStateTag.customValue :
            MDL_content.getCt(ct_gn, null, true);
        let blk = MDL_content.getCt(blk_gn, ContentGetModes.BLK);
        if(ct == null || blk == null) return val;

        let arr = ct === TmpStateTag.customValue ?
            rcDict.prod[ct_gn] :
            ct instanceof Item ?
                rcDict.prod.item[ct.id] :
                ct instanceof Liquid ?
                    rcDict.prod.fluid[ct.id] :
                    ct instanceof UnitType ?
                        rcDict.prod.unit[ct.id] :
                        rcDict.prod.block[ct.id];
        let i = 0, iCap = arr.iCap();
        while(i < iCap) {
            if(arr[i] === blk) {
                val = Math.max(arr[i + 1], val);
            };
            i += 3;
        };

        return val;
    }
    .setCache();
    exports.getProdAmt = getProdAmt;


    /**
     * Variant of {@link getProdAmt} for buildings.
     * @param {ContentGn} ct_gn
     * @param {Building} b
     * @return {number}
     */
    const getProdAmtByBuild = function(ct_gn, b) {
        let ct = MDL_content.getCt(ct_gn, null, true);
        return tryFun(b.ex_getProdAmt, b, getProdAmt(ct, b.block), ct);
    };
    exports.getProdAmtByBuild = getProdAmtByBuild;


    /**
     * Whether `blk_gn` consumes or produces `ct_gn`.
     * @param {ContentGn} ct_gn - Can be a custom field name.
     * @param {BlockGn} blk_gn
     * @return {boolean}
     */
    const checkIo = function(ct_gn, blk_gn) {
        return getConsAmt(ct_gn, blk_gn) > 0.0 || getProdAmt(ct_gn, blk_gn) > 0.0;
    }
    .setCache();
    exports.checkIo = checkIo;


    /**
     * Whether `blk_gn` consumes or produces anyone in `cts_gn`.
     * @param {Array<ContentGn>} cts_gn - Can include custom field names.
     * @param {BlockGn} blk_gn
     * @return {boolean}
     */
    const checkAnyIo =  function(cts_gn, blk_gn) {
        return cts_gn.some(ct_gn => checkIo(ct_gn, blk_gn));
    };
    exports.checkAnyIo = checkAnyIo;


    /**
     * Whether `blk_gn` consumes or produces everyone in `cts_gn`.
     * @param {Array<ContentGn>} cts_gn - Can include custom field names.
     * @param {BlockGn} blk_gn
     * @return {boolean}
     */
    const checkAllIo =  function(cts_gn, blk_gn) {
        return cts_gn.every(ct_gn => checkIo(ct_gn, blk_gn));
    };
    exports.checkAllIo = checkAllIo;


    /**
     * Finds all blocks that consume `ct_gn`.
     * @param {ContentGn} ct_gn - Can be a custom field name.
     * @param {boolean|unset} [appendData] - If true, this method will return a 3-array instead. <br> `ROW`: blk, amt, data.
     * @param {boolean|unset} [removeHidden]
     * @return {Array<Block>|F3Array<Block, number, RecipeDictionaryData>}
     */
    const getConsumers = function(ct_gn, appendData, removeHidden) {
        let arr = [];
        if(ct_gn == null) return arr;
        let ct = rcDict.customFieldMap.containsKey(ct_gn) ?
            TmpStateTag.customValue :
            MDL_content.getCt(ct_gn, null, true);
        if(ct == null) return arr;

        let arr1 = ct === TmpStateTag.customValue ?
            rcDict.cons[ct_gn] :
            ct instanceof Item ?
                rcDict.cons.item[ct.id] :
                ct instanceof Liquid ?
                    rcDict.cons.fluid[ct.id] :
                    ct instanceof UnitType ?
                        rcDict.cons.unit[ct.id] :
                        rcDict.cons.block[ct.id];
        let i = 0, iCap = arr1.iCap();
        while(i < iCap) {
            if(!removeHidden || !arr1[i + 2].hidden) {
                !appendData ?
                    arr.push(arr1[i]) :
                    arr.push(arr1[i], arr1[i + 1], arr1[i + 2]);
            };
            i += 3;
        };

        return arr;
    }
    .setCache();
    exports.getConsumers = getConsumers;


    /**
     * Variant of {@link getConsumers} that finds producers instead.
     * @param {ContentGn} ct_gn - Can be a custom field name.
     * @param {boolean|unset} [appendData] - If true, this method will return a 3-array instead. <br> `ROW`: blk, amt, data.
     * @param {boolean|unset} [removeHidden]
     * @return {Array<Block>|F3Array<Block, number, RecipeDictionaryData>}
     */
    const getProducers = function(ct_gn, appendData, removeHidden) {
        let arr = [];
        if(ct_gn == null) return arr;
        let ct = rcDict.customFieldMap.containsKey(ct_gn) ?
            TmpStateTag.customValue :
            MDL_content.getCt(ct_gn, null, true);
        if(ct == null) return arr;

        let arr1 = ct === TmpStateTag.customValue ?
            rcDict.prod[ct_gn] :
            ct instanceof Item ?
                rcDict.prod.item[ct.id] :
                ct instanceof Liquid ?
                    rcDict.prod.fluid[ct.id] :
                    ct instanceof UnitType ?
                        rcDict.prod.unit[ct.id] :
                        rcDict.prod.block[ct.id];

        let i = 0, iCap = arr1.iCap();
        while(i < iCap) {
            if(!removeHidden || !arr1[i + 2].hidden) {
                !appendData ?
                    arr.push(arr1[i]) :
                    arr.push(arr1[i], arr1[i + 1], arr1[i + 2]);
            };
            i += 3;
        };

        return arr;
    }
    .setCache();
    exports.getProducers = getProducers;


/*
  ========================================
  Section: application
  ========================================
*/


    MDL_event.onLoad(() => {


        // Initialize
        rcDict.cons.item = {};
        rcDict.cons.fluid = {};
        rcDict.cons.block = {};
        rcDict.cons.unit = {};
        rcDict.prod.item = {};
        rcDict.prod.fluid = {};
        rcDict.prod.block = {};
        rcDict.prod.unit = {};
        rcDict.customFieldMap.each((name, obj) => {
            rcDict.cons[name] = [];
            rcDict.prod[name] = [];
        });
        Vars.content.items().each(item => {
            rcDict.cons.item[item.id] = [];
            rcDict.prod.item[item.id] = [];
        });
        Vars.content.liquids().each(liq => {
            rcDict.cons.fluid[liq.id] = [];
            rcDict.prod.fluid[liq.id] = [];
        });
        Vars.content.blocks().each(blk => blk.synthetic(), blk => {
            rcDict.cons.block[blk.id] = [];
            rcDict.prod.block[blk.id] = [];
        });
        Vars.content.units().each(utp => !utp.internal, utp => {
            rcDict.cons.unit[utp.id] = [];
            rcDict.prod.unit[utp.id] = [];
        });
        rcDict.hasInit = true;


        let
            arr,
            dictC;
        Core.app.post(() => Vars.content.blocks().each(blk => {
            if(!DB_block.db["group"]["noRcDict"]["cons"].includes(blk.name)) {
                arr = DB_recipe.db["dict"]["reader"]["consume"];
                blk.consumers.forEachFast(cons => {
                    if(cons.ex_setRcDict != null) {
                        cons.ex_setRcDict(blk, rcDict.cons.item, rcDict.cons.fluid, rcDict.cons.block, rcDict.cons.unit);
                        return;
                    };

                    dictC = readTypeValArr(arr, cons);
                    if(dictC != null) {
                        dictC(blk, cons, null, rcDict.cons.item, rcDict.cons.fluid, rcDict.cons.block, rcDict.cons.unit);
                    };
                });

                dictC = readTypeValArr(arr, blk);
                if(dictC != null) {
                    dictC(blk, null, null, rcDict.cons.item, rcDict.cons.fluid, rcDict.cons.block, rcDict.cons.unit);
                };
            };

            arr = DB_recipe.db["dict"]["reader"]["consumeSpec"];
            dictC = readTypeValArr(arr, blk);
            if(dictC != null) {
                dictC(blk, null, null, rcDict.cons.item, rcDict.cons.fluid, rcDict.cons.block, rcDict.cons.unit);
            };

            if(!DB_block.db["group"]["noRcDict"]["prod"].includes(blk.name)) {
                arr = DB_recipe.db["dict"]["reader"]["produce"];
                dictC = readTypeValArr(arr, blk);
                if(dictC != null) {
                    dictC(blk, null, rcDict.prod.item, rcDict.prod.fluid, rcDict.prod.block, rcDict.prod.unit);
                };
            };

            arr = DB_recipe.db["dict"]["reader"]["produceSpec"];
            dictC = readTypeValArr(arr, blk);
            if(dictC != null) {
                dictC(blk, null, rcDict.prod.item, rcDict.prod.fluid, rcDict.prod.block, rcDict.prod.unit);
            };
        }));


    });
