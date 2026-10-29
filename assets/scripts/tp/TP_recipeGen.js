/*
  ================================================================================
  Section: Introduction
  ================================================================================
*/


    /**
     * Collection of recipe generators.
     * @module lovec/tp/TP_recipeGen
     */


/*
  ================================================================================
  Section: Definition
  ================================================================================
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

        let categ = this.getCategByMode("assembler", mode, "assembly");
        this.setCateg(categ);
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
     * Recipe generator: cooler.
     * @this {CLS_recipeGenerator}
     * @param {RecipeRC} rc
     * @param {RecipeMetaObject} metaObj
     * @return {void}
     */
    const cooler = function(rc, metaObj) {
        let
            mode = readParam(metaObj, "mode");

        if(mode == null) throw new LCError.NullArgumentError("mode");

        let categ = this.getCategByMode("cooler", mode);
        this.setCateg(categ);
        if(mode === "condensation") {
            // Steam condensation recipe on top of everything
            let steamRefundFrac = 0.85;
            this.handleSingle(
                rc,
                "loveclab-gas0misc-steam",
                metaObj,
                {
                    keyCt: "GROUP: steam",
                    liqI: "GROUP: steam",
                    liqO: "loveclab-liq0ore-water",
                    amtO: readParam(metaObj, "amtI", readParam(metaObj, "amt", 1)) * steamRefundFrac,
                },
            );
        };
        this.handle2Arr(
            rc,
            DB_recipe.db["genData"]["cooling"][mode],
            null,
            metaObj,
        );
    };
    newRecipeGenerator("lovec", "cooler", cooler);
    exports.cooler = cooler;


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
                    tint: GLB_color.heal,
                    itemI: "loveclab-item0bio-log",
                    itemO: "loveclab-item0bio-sawdust",
                },
            );
            this.setTag();
        };

        this.setTag("specific");
        this.handle2Arr(
            rc,
            DB_recipe.db["genData"]["crushing"]["biomass"],
            null,
            metaObj,
        );
        this.setTag();

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
     * Recipe generator: dryer.
     * Removes moisture.
     * @this {CLS_recipeGenerator}
     * @param {RecipeRC} rc
     * @param {RecipeMetaObject} metaObj
     * @return {void}
     */
    const dryer = function(rc, metaObj) {
        let
            mode = readParam(metaObj, "mode");

        if(mode == null) throw new LCError.NullArgumentError("mode");

        let categ = this.getCategByMode("dryer", mode, "drying");
        this.setCateg(categ);
        this.handle2Arr(
            rc,
            DB_recipe.db["genData"]["drying"][mode],
            null,
            metaObj,
        );
    };
    newRecipeGenerator("lovec", "dryer", dryer);
    exports.dryer = dryer;


    /**
     * Recipe generator: electrolyzer.
     * Electrolyzes fluid.
     * @this {CLS_recipeGenerator}
     * @param {RecipeRC} rc
     * @param {RecipeMetaObject} metaObj
     * @return {void}
     */
    const electrolyzer = function(rc, metaObj) {
        let
            mode = readParam(metaObj, "mode");

        if(mode == null) throw new LCError.NullArgumentError("mode");

        let categ = this.getCategByMode("electrolyzer", mode, "electrolysis");
        this.setCateg(categ);
        this.handle2Arr(
            rc,
            DB_recipe.db["genData"]["electrolysis"][mode],
            null,
            metaObj,
        );
    };
    newRecipeGenerator("lovec", "electrolyzer", electrolyzer);
    exports.electrolyzer = electrolyzer;


    /**
     * Recipe generator: filter.
     * @this {CLS_recipeGenerator}
     * @param {RecipeRC} rc
     * @param {RecipeMetaObject} metaObj
     * @return {void}
     */
    const filter = function(rc, metaObj) {
        let
            mode = readParam(metaObj, "mode");

        if(mode == null) throw new LCError.NullArgumentError("mode");

        let categ = this.getCategByMode("filter", mode, "filtration");
        this.setCateg(categ);
        this.handle2Arr(
            rc,
            DB_recipe.db["genData"]["filtration"][mode],
            null,
            metaObj,
        );
    };
    newRecipeGenerator("lovec", "filter", filter);
    exports.filter = filter;


    /**
     * Recipe generator: heater.
     * Produces heat, or heats up materials.
     * @this {CLS_recipeGenerator}
     * @param {RecipeRC} rc
     * @param {RecipeMetaObject} metaObj
     * @return {void}
     */
    const heater = function(rc, metaObj) {
        let
            mode = readParam(metaObj, "mode");

        if(mode == null) throw new LCError.NullArgumentError("mode");

        let categ = this.getCategByMode("heater", mode, "heating");
        this.setCateg(categ);
        this.handle2Arr(
            rc,
            DB_recipe.db["genData"]["heating"][mode],
            null,
            metaObj,
        );
    };
    newRecipeGenerator("lovec", "heater", heater);
    exports.heater = heater;


    /**
     * Recipe generator: mixer.
     * Mixes materials into a mixture.
     * @this {CLS_recipeGenerator}
     * @param {RecipeRC} rc
     * @param {RecipeMetaObject} metaObj
     * @return {void}
     */
    const mixer = function(rc, metaObj) {
        let
            mode = readParam(metaObj, "mode");

        if(mode == null) throw new LCError.NullArgumentError("mode");

        let categ = this.getCategByMode("mixer", mode, "mixing");
        this.setCateg(categ);
        this.handle2Arr(
            rc,
            DB_recipe.db["genData"]["mixing"][mode],
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
            DB_recipe.db["genData"]["mixing"]["liquid"],
            null,
            metaObj,
        );
        this.handleCtLi(
            rc,
            GLB_varGen.tagIntmdsMap.get("rs-sol").filter(liq => liq.delegee.intmdParent != null && LCDBFileHandler.read("liquid-solvent", liq.delegee.solvent) != null),
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
        let
            mode = readParam(metaObj, "mode");

        if(mode == null) throw new LCError.NullArgumentError("mode");

        let categ = this.getCategByMode("pulverizer", mode, "pulverization");
        this.setCateg(categ);

        if(mode === "main") {
            this.setTag("specific");
            this.handle2Arr(
                rc,
                DB_recipe.db["genData"]["pulverization"]["main"],
                null,
                metaObj,
            );
            this.setTag();

            this.handleCtLi(
                rc,
                GLB_varGen.tagIntmdsMap.get("rs-dust").filter(item => !DB_recipe.db["genData"]["pulverization"]["main"].colIncludes(item.name, 2, 0) && !item.self.ex_getIntmdTags().includesAny("rs-p1", "rs-p2") && !GLB_varGen.tagIntmdsMap.get("rs-chunks").some(oitem => item.delegee.intmdParent === oitem.delegee.intmdParent)),
                null,
                metaObj,
                (item, metaObj) => ({
                    keyCt: item.delegee.intmdParent.name,
                    itemI: item.delegee.intmdParent,
                    itemO: item,
                }),
            );
        } else {
            this.handle2Arr(
                rc,
                DB_recipe.db["genData"]["pulverization"][mode],
                null,
                metaObj,
            );
        };
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
            mode = readParam(metaObj, "mode");

        if(mode == null) throw new LCError.NullArgumentError("mode");

        let categ = this.getCategByMode("purifier", mode, "purification");
        this.setCateg(categ);
        if(mode === "wash") {
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
                DB_recipe.db["genData"]["purification"]["i"],
                null,
                metaObj,
            );
        } else {
            this.handle2Arr(
                rc,
                DB_recipe.db["genData"]["purification"][mode],
                null,
                metaObj,
            );
        };
    };
    newRecipeGenerator("lovec", "purifier", purifier);
    exports.purifier = purifier;


    /**
     * Recipe generator: reactor.
     * Handles regular chemical reactions.
     * @this {CLS_recipeGenerator}
     * @param {RecipeRC} rc
     * @param {RecipeMetaObject} metaObj
     * @return {void}
     */
    const reactor = function(rc, metaObj) {
        let
            mode = readParam(metaObj, "mode");

        if(mode == null) throw new LCError.NullArgumentError("mode");

        let categ = this.getCategByMode("reactor", mode);
        this.setCateg(categ);
        this.handle2Arr(
            rc,
            DB_recipe.db["genData"]["reaction"][mode],
            null,
            metaObj,
        );
    };
    newRecipeGenerator("lovec", "reactor", reactor);
    exports.reactor = reactor;


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
        if((fuelType & FuelTypes.ITEM) !== 0) arr.pushAll(DB_recipe.db["genData"]["reaction"]["burnSolid"]);
        if((fuelType & FuelTypes.LIQUID) !== 0) arr.pushAll(DB_recipe.db["genData"]["reaction"]["burnLiquid"]);
        if((fuelType & FuelTypes.GAS) !== 0) arr.pushAll(DB_recipe.db["genData"]["reaction"]["burnGas"]);

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
            mode = readParam(metaObj, "mode");

        if(mode == null) throw new LCError.NullArgumentError("mode");

        let categ = this.getCategByMode("roastingFurnace", mode, "roasting");
        this.setCateg(categ);
        this.handle2Arr(
            rc,
            DB_recipe.db["genData"]["roasting"][mode],
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
            DB_recipe.db["genData"]["crushing"]["rock"],
            null,
            metaObj,
        );
        this.setTag();

        this.handleCtLi(
            rc,
            GLB_varGen.tagIntmdsMap.get("rs-chunks").filter(item => !DB_recipe.db["genData"]["crushing"]["rock"].colIncludes(item.name, 2, 0) && !item.self.ex_getIntmdTags().includesAny("rs-p1", "rs-p2")),
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
     * See {@link DB_item.db.group.aggregate}.
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
            GLB_varGen.rawOreBlks,
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
     * Recipe generator: shaper.
     * @this {CLS_recipeGenerator}
     * @param {RecipeRC} rc
     * @param {RecipeMetaObject} metaObj
     * @return {void}
     */
    const shaper = function(rc, metaObj) {
        let
            mode = readParam(metaObj, "mode");

        if(mode == null) throw new LCError.NullArgumentError("mode");

        let categ = this.getCategByMode("shaper", mode);
        this.setCateg(categ);
        this.handle2Arr(
            rc,
            DB_recipe.db["genData"]["shaping"][mode],
            null,
            metaObj,
        );
    };
    newRecipeGenerator("lovec", "shaper", shaper);
    exports.shaper = shaper;


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
            mode = readParam(metaObj, "mode");

        if(mode == null) throw new LCError.NullArgumentError("mode");

        let categ = this.getCategByMode("sinteringFurnace", mode, "sintering");
        this.setCateg(categ);
        if(mode === "main") {
            this.handleCtLi(
                rc,
                GLB_varGen.tagIntmdsMap.get("rs-dust").filter(item => !item.self.ex_getIntmdTags().includesAny("rs-p1", "rs-p2")),
                null,
                metaObj,
                (item, metaObj) => ({
                    keyCt: item.name,
                    tempReq: LCDBFileHandler.read("item-sintering-temperature", item.delegee.intmdParent, -1.0),
                    itemI: item,
                    itemO: item.delegee.intmdParent,
                }),
            );
            this.handle2Arr(
                rc,
                DB_recipe.db["genData"]["sintering"]["main"],
                null,
                metaObj,
            );
        } else if(mode === "concentrate") {
            this.handleCtLi(
                rc,
                GLB_varGen.tagIntmdsMap.get("rs-chunks").concat(GLB_varGen.tagIntmdsMap.get("rs-dust")).filter(item => item.self.ex_getIntmdTags().includesAny("rs-p1", "rs-p2")),
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
            this.handle2Arr(
                rc,
                DB_recipe.db["genData"]["sintering"]["concentrate"],
                null,
                metaObj,
            );
        } else {
            this.handle2Arr(
                rc,
                DB_recipe.db["genData"]["sintering"][mode],
                null,
                metaObj,
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
            mode = readParam(metaObj, "mode");

        if(mode == null) throw new LCError.NullArgumentError("mode");

        let categ = this.getCategByMode("smelter", mode, "smelting");
        this.setCateg(categ);
        this.handle2Arr(
            rc,
            DB_recipe.db["genData"]["smelting"][mode],
            null,
            metaObj,
        );
    };
    newRecipeGenerator("lovec", "smelter", smelter);
    exports.smelter = smelter;
