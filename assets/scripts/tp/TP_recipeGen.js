/*
  ========================================
  Section: Introduction
  ========================================
*/


    /**
     * Collection of recipe generators.
     * @module lovec/tp/TP_recipeGen
     */


/*
  ========================================
  Section: Definition
  ========================================
*/


    /**
     * Recipe generator: auxiliary fluid producer.
     * Produces auxiliary fluid base on temperature.
     * @this {CLS_recipeGenerator}
     * @param {RecipeRC} rc
     * @param {RecipeMetaObject} metaObj
     * @return {void}
     */
    const auxTemp = function(rc, metaObj) {
        let
            target = readParam(metaObj, "target"),
            maxTemp = readParam(metaObj, "maxTemp"),
            tempGap = readParam(metaObj, "tempGap", 300.0);

        if(target == null) throw new LCError.NullArgumentError("target");
        if(maxTemp == null) throw new LCError.NullArgumentError("maxTemp");

        this.setCateg("aux");
        let i = 1, tempCur = tempGap;
        while(tempCur <= maxTemp) {
            this.handleSingle(
                rc,
                target,
                metaObj,
                {
                    tag: i,
                    tempReq: tempCur,
                    liqO: target,
                    amtO: i / 6.0,
                },
            );
            i++;
            tempCur += tempGap;
        };
    };
    newRecipeGenerator("lovec", "auxTemp", auxTemp);
    exports.auxTemp = auxTemp;


    /**
     * Recipe generator: assembler.
     * Crafts various items, and payloads sometimes.
     * @this {CLS_recipeGenerator}
     * @param {RecipeRC} rc
     * @param {RecipeMetaObject} metaObj
     * @return {void}
     */
    const assembler = function(rc, metaObj) {
        let
            mode = readParam(metaObj, "mode");

        if(mode == null) throw new LCError.NullArgumentError("mode");

        this.setCateg("assembly");
        this.handle2Arr(
            rc,
            DB_recipe.db["genData"]["assembly"][mode],
            null,
            metaObj,
        );
    };
    newRecipeGenerator("lovec", "assembler", assembler);
    exports.assembler = assembler;


    /**
     * Recipe generator: alloy furnace.
     * Converts materials into alloy metal.
     * @this {CLS_recipeGenerator}
     * @param {RecipeRC} rc
     * @param {RecipeMetaObject} metaObj
     * @return {void}
     */
    const alloyFurnace = function(rc, metaObj) {
        this.setCateg("alloying");
        this.handle2Arr(
            rc,
            DB_recipe.db["genData"]["alloying"],
            null,
            metaObj,
        );
    };
    newRecipeGenerator("lovec", "alloyFurnace", alloyFurnace);
    exports.alloyFurnace = alloyFurnace;


    /**
     * Recipe generator: brick kiln.
     * Converts brick blend to brick.
     * @this {CLS_recipeGenerator}
     * @param {RecipeRC} rc
     * @param {RecipeMetaObject} metaObj
     * @return {void}
     */
    const brickKiln = function(rc, metaObj) {
        this.setCateg("brick-baking");
        this.handle2Arr(
            rc,
            DB_recipe.db["genData"]["brickBaking"],
            null,
            metaObj,
        );
    };
    newRecipeGenerator("lovec", "brickKiln", brickKiln);
    exports.brickKiln = brickKiln;


    /**
     * Recipe generator: carbonization furnace.
     * Handles recipes for charcoal, active carbon, etc.
     * @this {CLS_recipeGenerator}
     * @param {RecipeRC} rc
     * @param {RecipeMetaObject} metaObj
     * @return {void}
     */
    const carbonizationFurnace = function(rc, metaObj) {
        this.setCateg("carbonization");
        this.handle2Arr(
            rc,
            DB_recipe.db["genData"]["carbonization"],
            null,
            metaObj,
        );
    };
    newRecipeGenerator("lovec", "carbonizationFurnace", carbonizationFurnace);
    exports.carbonizationFurnace = carbonizationFurnace;


    /**
     * Recipe generator: caster.
     * Converts materials into casting target items.
     * @this {CLS_recipeGenerator}
     * @param {RecipeRC} rc
     * @param {RecipeMetaObject} metaObj
     * @return {void}
     */
    const caster = function(rc, metaObj) {
        this.setCateg("casting");
        this.handle2Arr(
            rc,
            DB_recipe.db["genData"]["casting"],
            null,
            metaObj,
        );
    };
    newRecipeGenerator("lovec", "caster", caster);
    exports.caster = caster;


    /**
     * Recipe generator: condenser.
     * Converts evaporized liquid into liquid.
     * @this {CLS_recipeGenerator}
     * @param {RecipeRC} rc
     * @param {RecipeMetaObject} metaObj
     * @return {void}
     */
    const condenser = function(rc, metaObj) {
        this.setCateg("condensation");

        // Steam condensation recipe on top of everything
        const STEAM_REFUND_FRAC = 0.85;
        this.handleSingle(
            rc,
            "loveclab-gas0misc-steam",
            metaObj,
            {
                keyCt: "GROUP: steam",
                liqI: "GROUP: steam",
                liqO: "loveclab-liq0ore-water",
                amtO: readParam(metaObj, "amtI", readParam(metaObj, "amt", 1)) * STEAM_REFUND_FRAC,
            },
        );

        this.handle2Arr(
            rc,
            DB_recipe.db["genData"]["condensation"],
            null,
            metaObj,
        );
    };
    newRecipeGenerator("lovec", "condenser", condenser);
    exports.condenser = condenser;


    /**
     * Recipe generator: crusher.
     * Crushes biotic materials into biomass powder.
     * @this {CLS_recipeGenerator}
     * @param {RecipeRC} rc
     * @param {RecipeMetaObject} metaObj
     * @return {void}
     */
    const crusherBiomass = function(rc, metaObj) {
        let
            target = readParam(metaObj, "target", "loveclab-item0bio-biomass-powder"),
            noSawdust = readParam(metaObj, "noSawdust", false);

        this.setCateg("crushing");

        if(!noSawdust) {
            this.setTag("sawdust");
            this.handleSingle(
                rc,
                "loveclab-item0bio-log",
                metaObj,
                {
                    tint: Pal.heal,
                    itemI: "loveclab-item0bio-log",
                    itemO: "loveclab-item0bio-sawdust",
                },
            );
            this.setTag();
        };

        this.handleNameNumArr(
            rc,
            DB_item.db["group"]["biomass"],
            null,
            (mtp, paramObj) => {
                paramObj.amtI = readParam(metaObj, "amtI", readParam(metaObj, "amt", 1)) / mtp;
            },
            metaObj,
            (item, metaObj) => ({
                keyCt: item.name,
                itemI: item,
                itemO: target,
            }),
        );
    };
    newRecipeGenerator("lovec", "crusherBiomass", crusherBiomass);
    exports.crusherBiomass = crusherBiomass;


    /**
     * Recipe generator: decorticator.
     * @this {CLS_recipeGenerator}
     * @param {RecipeRC} rc
     * @param {RecipeMetaObject} metaObj
     * @return {void}
     */
    const crusherDecortication = function(rc, metaObj) {
        this.setCateg("misc");

        this.handle2Arr(
            rc,
            DB_recipe.db["genData"]["decortication"],
            null,
            metaObj,
        );
    };
    newRecipeGenerator("lovec", "crusherDecortication", crusherDecortication);
    exports.crusherDecortication = crusherDecortication;


    /**
     * Recipe generator: dryer.
     * Removes moisture.
     * @this {CLS_recipeGenerator}
     * @param {RecipeRC} rc
     * @param {RecipeMetaObject} metaObj
     * @return {void}
     */
    const dryer = function(rc, metaObj) {
        let
            includeItem = readParam(metaObj, "includeItem", true),
            includeLiquid = readParam(metaObj, "includeLiquid", false),
            includeGas = readParam(metaObj, "includeGas", false),
            mode = readParam(metaObj, "mode", "neutral");

        let arr = [];
        if(includeItem) arr.pushAll(DB_recipe.db["genData"]["dryingItem"]);
        if(includeLiquid) {
            arr.pushAll(DB_recipe.db["genData"]["dryingLiquid"]);
            if(mode === neutral || mode === "acidic") arr.pushAll(DB_recipe.db["genData"]["dryingLiquidAcidic"]);
            if(mode === neutral || mode === "basic") arr.pushAll(DB_recipe.db["genData"]["dryingLiquidBasic"]);
        };
        if(includeGas) {
            arr.pushAll(DB_recipe.db["genData"]["dryingGas"]);
            if(mode === neutral || mode === "acidic") arr.pushAll(DB_recipe.db["genData"]["dryingGasAcidic"]);
            if(mode === neutral || mode === "basic") arr.pushAll(DB_recipe.db["genData"]["dryingGasBasic"]);
        };

        this.setCateg("drying");
        this.handle2Arr(
            rc,
            arr,
            null,
            metaObj,
        );
    };
    newRecipeGenerator("lovec", "dryer", dryer);
    exports.dryer = dryer;


    /**
     * Recipe generator: freeze dryer.
     * Removes moisture through sublimation of ice.
     * @this {CLS_recipeGenerator}
     * @param {RecipeRC} rc
     * @param {RecipeMetaObject} metaObj
     * @return {void}
     */
    const dryerFreeze = function(rc, metaObj) {
        this.setCateg("drying");
        this.handle2Arr(
            rc,
            DB_recipe.db["genData"]["dryingFreeze"],
            null,
            metaObj,
        );
    };
    newRecipeGenerator("lovec", "dryerFreeze", dryerFreeze);
    exports.dryerFreeze = dryerFreeze;


    /**
     * Recipe generator: filter.
     * Separates items from slurry, or liquids from morbid solution.
     * @this {CLS_recipeGenerator}
     * @param {RecipeRC} rc
     * @param {RecipeMetaObject} metaObj
     * @return {void}
     */
    const filter = function(rc, metaObj) {
        let
            isItemFilter = readParam(metaObj, "isItemFilter", false);

        this.setCateg("filtration");
        this.handle2Arr(
            rc,
            DB_recipe.db["genData"][isItemFilter ? "filtration" : "filtrationLiquid"],
            null,
            metaObj,
        );
    };
    newRecipeGenerator("lovec", "filter", filter);
    exports.filter = filter;


    /**
     * Recipe generator: forge.
     * Converts materials into forging target items.
     * @this {CLS_recipeGenerator}
     * @param {RecipeRC} rc
     * @param {RecipeMetaObject} metaObj
     * @return {void}
     */
    const forge = function(rc, metaObj) {
        this.setCateg("forging");
        this.handle2Arr(
            rc,
            DB_recipe.db["genData"]["forging"],
            null,
            metaObj,
        );
    };
    newRecipeGenerator("lovec", "forge", forge);
    exports.forge = forge;


    /**
     * Recipe generator: heat exchanger.
     * Produces heat from hot fluids.
     * @this {CLS_recipeGenerator}
     * @param {RecipeRC} rc
     * @param {RecipeMetaObject} metaObj
     * @return {void}
     */
    const heaterExchange = function(rc, metaObj) {
        this.setCateg("heating");
        this.handle2Arr(
            rc,
            DB_recipe.db["genData"]["heatingExchange"],
            null,
            metaObj,
        );
    };
    newRecipeGenerator("lovec", "heaterExchange", heaterExchange);
    exports.heaterExchange = heaterExchange;


    /**
     * Recipe generator: gas heater.
     * Heats up some gases.
     * @this {CLS_recipeGenerator}
     * @param {RecipeRC} rc
     * @param {RecipeMetaObject} metaObj
     * @return {void}
     */
    const heaterGas = function(rc, metaObj) {
        this.setCateg("heating");
        this.handle2Arr(
            rc,
            DB_recipe.db["genData"]["heatingGas"],
            null,
            metaObj,
        );
    };
    newRecipeGenerator("lovec", "heaterGas", heaterGas);
    exports.heaterGas = heaterGas;


    /**
     * Recipe generator: mixer.
     * Mixes materials into blend.
     * @this {CLS_recipeGenerator}
     * @param {RecipeRC} rc
     * @param {RecipeMetaObject} metaObj
     * @return {void}
     */
    const mixer = function(rc, metaObj) {
        let
            isBallMill = readParam(metaObj, "isBallMill", false);

        metaObj.useCalculatedHardness = isBallMill;
        this.setCateg(isBallMill ? "ball-mill-mixing" : "mixing");
        this.handle2Arr(
            rc,
            DB_recipe.db["genData"][isBallMill ? "ballMillMixing" : "mixing"],
            null,
            metaObj,
        );
    };
    newRecipeGenerator("lovec", "mixer", mixer);
    exports.mixer = mixer;


    /**
     * Recipe generator: liquid mixer.
     * Mixes items and liquids to produce a solution.
     * @this {CLS_recipeGenerator}
     * @param {RecipeRC} rc
     * @param {RecipeMetaObject} metaObj
     * @return {void}
     */
    const mixerLiquid = function(rc, metaObj) {
        this.setCateg("liquid-mixing");
        this.handle2Arr(
            rc,
            DB_recipe.db["genData"]["mixingLiquid"],
            null,
            metaObj,
        );
        this.handleCtLi(
            rc,
            VARGEN.tagIntmdsMap.get("rs-sol").filter(liq => liq.delegee.intmdParent != null && LCDBFileHandler.read("liquid-solvent", liq.delegee.solvent) != null),
            null,
            metaObj,
            (liq, metaObj) => {
                let liqSolv = LCDBFileHandler.read("liquid-solvent", liq.delegee.solvent);
                return {
                    tag: liqSolv.name,
                    liqI: liqSolv,
                    itemI: liq.delegee.intmdParent,
                    liqO: liq,
                };
            },
            liq => liq.delegee.intmdParent.name,
        );
    };
    newRecipeGenerator("lovec", "mixerLiquid", mixerLiquid);
    exports.mixerLiquid = mixerLiquid;


    /**
     * Recipe generator: pulverizer.
     * Converts ore items into dust.
     * @this {CLS_recipeGenerator}
     * @param {RecipeRC} rc
     * @param {RecipeMetaObject} metaObj
     * @return {void}
     */
    const pulverizer = function(rc, metaObj) {
        this.setCateg("pulverization");

        this.setTag("specific");
        this.handle2Arr(
            rc,
            DB_recipe.db["genData"]["pulverization"],
            null,
            metaObj,
        );
        this.setTag();

        this.handleCtLi(
            rc,
            VARGEN.tagIntmdsMap.get("rs-dust").filter(item => !DB_recipe.db["genData"]["pulverization"].colIncludes(item.name, 2, 0) && !item.ex_getIntmdTags().includesAny("rs-p1", "rs-p2") && !VARGEN.tagIntmdsMap.get("rs-chunks").some(oitem => item.delegee.intmdParent === oitem.delegee.intmdParent)),
            null,
            metaObj,
            (item, metaObj) => ({
                keyCt: item.delegee.intmdParent.name,
                itemI: item.delegee.intmdParent,
                itemO: item,
            }),
        );
    };
    newRecipeGenerator("lovec", "pulverizer", pulverizer);
    exports.pulverizer = pulverizer;


    /**
     * Recipe generator: purifier.
     * Purifies ore chunks/dusts.
     * @this {CLS_recipeGenerator}
     * @param {RecipeRC} rc
     * @param {RecipeMetaObject} metaObj
     * @return {void}
     */
    const purifier = function(rc, metaObj) {
        let
            tier = readParam(metaObj, "tier", 1);

        this.setCateg("purification");
        if(tier !== 0) {
            this.handle2Arr(
                rc,
                DB_recipe.db["genData"][tier === 2 ? "purificationII" : "purificationI"],
                null,
                metaObj,
            );
        } else {
            metaObj.paramObjF = paramObj => {
                if(MDL_cond.isWaste(paramObj.bo[0])) {
                    // No purification target in the recipe
                    paramObj.shouldSkip = true;
                    return;
                };
                // Discard byproducts, double waste output amount
                paramObj.bo = paramObj.bo.slice(0, 6);
                paramObj.bo[4] *= 2.0;
            };
            this.handle2Arr(
                rc,
                DB_recipe.db["genData"]["purificationI"],
                null,
                metaObj,
            );
        };
    };
    newRecipeGenerator("lovec", "purifier", purifier);
    exports.purifier = purifier;


    /**
     * Recipe generator: purifier.
     * Purifies ore chunks/dusts. Specially designed for magnetic separators.
     * @this {CLS_recipeGenerator}
     * @param {RecipeRC} rc
     * @param {RecipeMetaObject} metaObj
     * @return {void}
     */
    const purifierMagnetic = function(rc, metaObj) {
        this.setCateg("purification");
        this.handle2Arr(
            rc,
            DB_recipe.db["genData"]["purificationMagnetic"],
            null,
            metaObj,
        );
    };
    newRecipeGenerator("lovec", "purifierMagnetic", purifierMagnetic);
    exports.purifierMagnetic = purifierMagnetic;


    /**
     * Recipe generator: mixing reactor.
     * Handles regular chemical reactions.
     * @this {CLS_recipeGenerator}
     * @param {RecipeRC} rc
     * @param {RecipeMetaObject} metaObj
     * @return {void}
     */
    const reactorMixing = function(rc, metaObj) {
        let
            isGasReactor = readParam(metaObj, "isGasReactor", false);

        this.setCateg(isGasReactor ? "gas-reaction" : "liquid-reaction");
        this.handle2Arr(
            rc,
            DB_recipe.db["genData"][isGasReactor ? "reactionGas" : "reactionLiquid"],
            null,
            metaObj,
        );
    };
    newRecipeGenerator("lovec", "reactorMixing", reactorMixing);
    exports.reactorMixing = reactorMixing;


    /**
     * Recipe generator: furnace reactor.
     * Handles reactions under high temperature.
     * @this {CLS_recipeGenerator}
     * @param {RecipeRC} rc
     * @param {RecipeMetaObject} metaObj
     * @return {void}
     */
    const reactorMelt = function(rc, metaObj) {
        this.setCateg("melt-reaction");
        this.handle2Arr(
            rc,
            DB_recipe.db["genData"]["reactionMelt"],
            null,
            metaObj,
        );
    };
    newRecipeGenerator("lovec", "reactorMelt", reactorMelt);
    exports.reactorMelt = reactorMelt;


    /**
     * Recipe generator: burner.
     * Handles combustion reactions.
     * @this {CLS_recipeGenerator}
     * @param {RecipeRC} rc
     * @param {RecipeMetaObject} metaObj
     * @return {void}
     */
    const reactorBurn = function(rc, metaObj) {
        let
            fuelType = readParam(metaObj, "fuelType", FuelTypes.ITEM);

        let arr = [];
        if((fuelType & FuelTypes.ITEM) !== 0) arr.pushAll(DB_recipe.db["genData"]["reactionBurnSolid"]);
        if((fuelType & FuelTypes.LIQUID) !== 0) arr.pushAll(DB_recipe.db["genData"]["reactionBurnLiquid"]);
        if((fuelType & FuelTypes.GAS) !== 0) arr.pushAll(DB_recipe.db["genData"]["reactionBurnGas"]);

        this.setCateg("combustion");
        this.handle2Arr(
            rc,
            arr,
            null,
            metaObj,
        );
    };
    newRecipeGenerator("lovec", "reactorBurn", reactorBurn);
    exports.reactorBurn = reactorBurn;


    /**
     * Recipe generator: roasting furnace.
     * Converts items to their roasted form.
     * @this {CLS_recipeGenerator}
     * @param {RecipeRC} rc
     * @param {RecipeMetaObject} metaObj
     * @return {void}
     */
    const roastingFurnace = function(rc, metaObj) {
        let
            isConcentrate = readParam(metaObj, "isConcentrate", false);

        this.setCateg("roasting");
        this.handle2Arr(
            rc,
            DB_recipe.db["genData"][!isConcentrate ? "roasting" : "concentrateRoasting"],
            null,
            metaObj,
        );
    };
    newRecipeGenerator("lovec", "roastingFurnace", roastingFurnace);
    exports.roastingFurnace = roastingFurnace;


    /**
     * Recipe generator: rock crusher.
     * Converts ore items into chunks.
     * @this {CLS_recipeGenerator}
     * @param {RecipeRC} rc
     * @param {RecipeMetaObject} metaObj
     * @return {void}
     */
    const rockCrusher = function(rc, metaObj) {
        this.setCateg("rock-crushing");

        this.setTag("specific");
        this.handle2Arr(
            rc,
            DB_recipe.db["genData"]["rockCrushing"],
            null,
            metaObj,
        );
        this.setTag();

        this.handleCtLi(
            rc,
            VARGEN.tagIntmdsMap.get("rs-chunks").filter(item => !DB_recipe.db["genData"]["rockCrushing"].colIncludes(item.name, 2, 0) && !item.ex_getIntmdTags().includesAny("rs-p1", "rs-p2")),
            null,
            metaObj,
            (item, metaObj) => ({
                keyCt: item.delegee.intmdParent.name,
                itemI: item.delegee.intmdParent,
                itemO: item,
            }),
        );
    };
    newRecipeGenerator("lovec", "rockCrusher", rockCrusher);
    exports.rockCrusher = rockCrusher;


    /**
     * Recipe generator: rock crusher.
     * Converts some rocks into aggregate.
     * See {@link DB_item}.
     * @this {CLS_recipeGenerator}
     * @param {RecipeRC} rc
     * @param {RecipeMetaObject} metaObj
     * @return {void}
     */
    const rockCrusherAggregate = function(rc, metaObj) {
        let
            target = readParam(metaObj, "target", "loveclab-item0buil-coarse-aggregate"),
            noAggregateConvert = readParam(metaObj, "noAggregateConvert", false);

        this.setCateg("aggregate-crushing");

        if(!noAggregateConvert) {
            this.handleSingle(
                rc,
                "loveclab-item0buil-coarse-aggregate",
                metaObj,
                {
                    keyCt: "loveclab-item0buil-coarse-aggregate",
                    itemI: "loveclab-item0buil-coarse-aggregate",
                    itemO: "loveclab-item0buil-fine-aggregate",
                },
            );
        };

        this.handleNameNumArr(
            rc,
            DB_item.db["group"]["aggregate"],
            null,
            (mtp, paramObj) => {
                paramObj.amtI = readParam(metaObj, "amtI", readParam(metaObj, "amt", 1)) * mtp;
            },
            metaObj,
            (item, metaObj) => ({
                keyCt: item.name,
                itemI: item,
                itemO: target,
            }),
        );
    };
    newRecipeGenerator("lovec", "rockCrusherAggregate", rockCrusherAggregate);
    exports.rockCrusherAggregate = rockCrusherAggregate;


    /**
     * Recipe generator: rock crusher.
     * Converts raw ore blocks into corresponding ore items.
     * See {@link BLK_rawOreBlock}.
     * @this {CLS_recipeGenerator}
     * @param {RecipeRC} rc
     * @param {RecipeMetaObject} metaObj
     * @return {void}
     */
    const rockCrusherRawOreBlock = function(rc, metaObj) {
        this.setCateg("raw-ore-block-crushing");
        this.handleCtLi(
            rc,
            VARGEN.rawOreBlks,
            blk => MDL_content.getCt(Object.keyByVal(LCDBFileHandler.getDataObj("item-payload-block"), blk.name, null), ContentGetModes.RS),
            metaObj,
            (item, metaObj) => ({
                keyCt: LCDBFileHandler.read("item-payload-block", item.name),
                payI: LCDBFileHandler.read("item-payload-block", item.name),
                itemO: item,
                amtO: readParam(metaObj, "amtI", readParam(metaObj, "amt", 1)) * MDL_content.getCt(LCDBFileHandler.read("item-payload-block", item.name), ContentGetModes.BLK).requirements[0].amount,
            }),
        );
    };
    newRecipeGenerator("lovec", "rockCrusherRawOreBlock", rockCrusherRawOreBlock);
    exports.rockCrusherRawOreBlock = rockCrusherRawOreBlock;


    /**
     * Recipe generator: sintering furnace.
     * Converts dust items back into their parent items (the ore at most time).
     * @this {CLS_recipeGenerator}
     * @param {RecipeRC} rc
     * @param {RecipeMetaObject} metaObj
     * @return {void}
     */
    const sinteringFurnace = function(rc, metaObj) {
        let
            isConcentrate = readParam(metaObj, "isConcentrate", false);

        if(!isConcentrate) {
            this.setCateg("sintering");
            this.handleCtLi(
                rc,
                VARGEN.tagIntmdsMap.get("rs-dust").filter(item => !item.ex_getIntmdTags().includesAny("rs-p1", "rs-p2")),
                null,
                metaObj,
                (item, metaObj) => ({
                    keyCt: item.name,
                    tempReq: LCDBFileHandler.read("item-sintering-temperature", item.delegee.intmdParent, -1.0),
                    itemI: item,
                    itemO: item.delegee.intmdParent,
                }),
            );
        } else {
            this.setCateg("concentrate-sintering");
            this.handleCtLi(
                rc,
                VARGEN.tagIntmdsMap.get("rs-chunks").concat(VARGEN.tagIntmdsMap.get("rs-dust")).filter(item => item.ex_getIntmdTags().includesAny("rs-p1", "rs-p2")),
                null,
                metaObj,
                (item, metaObj) => ({
                    icon: MDL_content.getIntmd(item.delegee.intmdParent, "rs-ore0conc"),
                    keyCt: item.name,
                    tempReq: LCDBFileHandler.read("item-sintering-temperature", item.delegee.intmdParent, -1.0),
                    itemI: item,
                    itemO: MDL_content.getIntmd(item.delegee.intmdParent, "rs-ore0conc"),
                }),
                item => item.delegee.intmdParent.name,
            );
        };
    };
    newRecipeGenerator("lovec", "sinteringFurnace", sinteringFurnace);
    exports.sinteringFurnace = sinteringFurnace;


    /**
     * Recipe generator: smelter.
     * Converts ore items (or concentrate items) to their refined form.
     * @this {CLS_recipeGenerator}
     * @param {RecipeRC} rc
     * @param {RecipeMetaObject} metaObj
     * @return {void}
     */
    const smelter = function(rc, metaObj) {
        let
            isConcentrate = readParam(metaObj, "isConcentrate", false);

        this.setCateg("smelting");
        this.handle2Arr(
            rc,
            DB_recipe.db["genData"][!isConcentrate ? "smelting" : "concentrateSmelting"],
            null,
            metaObj,
        );
    };
    newRecipeGenerator("lovec", "smelter", smelter);
    exports.smelter = smelter;
