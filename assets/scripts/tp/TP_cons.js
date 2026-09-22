/*
  ========================================
  Section: Introduction
  ========================================
*/


    /**
     * Registers new consumers.
     * @module lovec/tp/TP_cons
     */


/*
  ========================================
  Section: Definition
  ========================================
*/


    /* <------------------------------ item ------------------------------> */


    /**
     * Consumes one item among a list of items, where each item has an efficiency multiplier.
     * @type {FFunction<Object, ConsumeItemFilter>}
     */
    const ConsumeItemEfficiencyMap = paramObj => extend(
        ConsumeItemFilter,
        (function() {
            let arr = readParam(paramObj, "itemEffcArr", Array.air).readCol(2, 0);
            return item => arr.includes(item.name);
        })(),
        {


            /** @type {ObjectMap<string, number>} */
            effcMap: readParam(paramObj, "itemEffcArr", Array.air).toObjMap(),
            /** @type {Item|null} */
            lastItem: null,


            /**
             * @param {Stats} stats
             * @return {void}
             */
            display(stats) {
                stats.add(this.booster ? Stat.booster : Stat.input, newStatValue(tb => {
                    tb.row();
                    tb.table(Styles.none, tb1 => {
                        let matArr = [[
                            "",
                            MDL_bundle.getTerm("lovec", "resource"),
                            MDL_bundle.getTerm("lovec", "efficiency-multiplier"),
                        ]];
                        let item;
                        this.effcMap.each((nameItem, effc) => {
                            item = Vars.content.item(nameItem);
                            if(item == null) return;
                            matArr.push([
                                item,
                                item.localizedName,
                                effc.perc(0),
                            ]);
                        });
                        MDL_table.setTable(tb, matArr).padLeft(48.0);
                    }).growX();
                }));
            },


            /**
             * @param {Building} b
             * @return {number}
             */
            efficiency(b) {
                this.lastItem = this.getConsumed(b);
                return !b.consumeTriggerValid() || this.lastItem == null ?
                    0.0 :
                    (this.super$efficiency(b) * this.effcMap.get(this.lastItem.name, 0.0));
            },


            /**
             * @param {Block} blk
             * @param {RecipeDictionaryIoArray} dictConsItem
             * @param {RecipeDictionaryIoArray} dictConsFld
             * @param {RecipeDictionaryIoArray} dictConsBlk
             * @param {RecipeDictionaryIoArray} dictConsUtp
             * @return {void}
             */
            ex_setRcDict(blk, dictConsItem, dictConsFld, dictConsBlk, dictConsUtp) {
                let item;
                this.effcMap.each((nameItem, effc) => {
                    item = Vars.content.item(nameItem);
                    if(item == null) return;
                    dictConsItem[item.id].push(blk, 1, {});
                });
            },


            /**
             * @param {Block} blk
             * @param {tmi.recipe.Recipe} rawRc
             * @param {number} boostEffc
             * @return {void}
             */
            ex_setTmiRc(blk, rawRc, boostEffc) {
                let rcGrp = new MOD_tmi.classes.RecipeItemGroup();
                this.effcMap.each((nameItem, effc) => {
                    MOD_tmi.addOpt(rawRc, rcGrp, nameItem, 1, effc, false, true);
                });
            },


        },
    );
    newConsumer("ConsumeItemEfficiencyMap", ConsumeItemEfficiencyMap);
    exports.ConsumeItemEfficiencyMap = ConsumeItemEfficiencyMap;


    /* <------------------------------ liquid ------------------------------> */


    /**
     * Consumes one liquid among a list of liquids, where each liquid has an efficiency multiplier.
     * @type {FFunction<Object, ConsumeLiquidFilter>}
     */
    const ConsumeLiquidEfficiencyMap = paramObj => extend(
        ConsumeLiquidFilter,
        (function() {
            let arr = readParam(paramObj, "liqEffcArr", Array.air).readCol(2, 0);
            return liq => arr.includes(liq.name);
        })(),
        readParam(paramObj, "amt", 0.0),
        {


            /** @type {ObjectMap<string, number>} */
            effcMap: readParam(paramObj, "liqEffcArr", Array.air).toObjMap(),
            /** @type {Liquid|null} */
            lastLiq: null,


            /**
             * @param {Stats} stats
             * @return {void}
             */
            display(stats) {
                stats.add(this.booster ? Stat.booster : Stat.input, newStatValue(tb => {
                    tb.row();
                    tb.table(Styles.none, tb1 => {
                        let matArr = [[
                            "",
                            MDL_bundle.getTerm("lovec", "resource"),
                            MDL_bundle.getTerm("lovec", "efficiency-multiplier"),
                        ]];
                        this.effcMap.each((nameLiq, effc) => {
                            let liq = Vars.content.liquid(nameLiq);
                            if(liq == null) return;
                            matArr.push([
                                tb2 => MDL_table.rcCtIcon(tb2, liq, this.amount),
                                liq.localizedName,
                                effc.perc(0),
                            ]);
                        });
                        MDL_table.setTable(tb, matArr).padLeft(48.0);
                    }).growX();
                }));
            },


            /**
             * @param {Building} b
             * @return {void}
             */
            update(b) {
                // Don't call `this.multiplier.get(b)` here, which causes `ClassCastException` on Android
                // Rhino sucks
                this.lastLiq = this.getConsumed(b);
                if(this.lastLiq != null) {
                    b.liquids.remove(this.lastLiq, this.amount * b.edelta() / this.effcMap.get(this.lastLiq.name, 0.0001));
                };
            },


            /**
             * @param {Building} b
             * @return {number}
             */
            efficiency(b) {
                this.lastLiq = this.getConsumed(b);
                return this.lastLiq == null ?
                    0.0 :
                    (this.super$efficiency(b) * this.effcMap.get(this.lastLiq.name, 0.0));
            },


            /**
             * @param {Block} blk
             * @param {RecipeDictionaryIoArray} dictConsItem
             * @param {RecipeDictionaryIoArray} dictConsFld
             * @param {RecipeDictionaryIoArray} dictConsBlk
             * @param {RecipeDictionaryIoArray} dictConsUtp
             * @return {void}
             */
            ex_setRcDict(blk, dictConsItem, dictConsFld, dictConsBlk, dictConsUtp) {
                let liq;
                this.effcMap.each((nameLiq, effc) => {
                    liq = Vars.content.liquid(nameLiq);
                    if(liq == null) return;
                    dictConsFld[liq.id].push(blk, this.amount, {});
                });
            },


            /**
             * @param {Block} blk
             * @param {tmi.recipe.Recipe} rawRc
             * @param {number} boostEffc
             * @return {void}
             */
            ex_setTmiRc(blk, rawRc, boostEffc) {
                let rcGrp = new MOD_tmi.classes.RecipeItemGroup();
                this.effcMap.each((nameLiq, effc) => {
                    MOD_tmi.addOpt(rawRc, rcGrp, nameLiq, this.amount, effc, true, true);
                });
            },


        },
    );
    newConsumer("ConsumeLiquidEfficiencyMap", ConsumeLiquidEfficiencyMap);
    exports.ConsumeLiquidEfficiencyMap = ConsumeLiquidEfficiencyMap;


    /* <------------------------------ power ------------------------------> */


    /* <------------------------------ special ------------------------------> */


    /**
     * A power consumer that releases lightning arcs, used by some metallic conduits.
     * Triggered manually.
     */
    const ConsumePowerShortCircuitPipe = paramObj => extend(ConsumePower, {



        /** @type {number} */
        usage: readParam(paramObj, "amt", 0.0),
        /** @type {number} */
        dmgMtp: readParam(paramObj, "dmgMtp", 1.0),


        /**
         * @param {Stats} stats
         * @return {void}
         */
        display(stats) {
            // Do nothing
        },


        /**
         * @param {Building} b
         * @return {void}
         */
        trigger(b) {
            if(
                Vars.net.client()
                    || b.power == null || b.power.status < 0.0001
                    || b.liquids == null || !tryJsProp(b.liquids.current(), "isConductive", false)
            ) return;

            FRAG_attack.lightning_global(b.x, b.y, null, VAR.param.lightningDmg * b.power.status * this.dmgMtp, null, 6, 4, null, "ground");
            TRIGGER.poweredMetalPipe.fire();
        },


        /**
         * @param {Building} b
         * @return {number}
         */
        efficiency(b) {
            return 1.0;
        },



    });
    newConsumer("ConsumePowerShortCircuitPipe", ConsumePowerShortCircuitPipe);
    exports.ConsumePowerShortCircuitPipe = ConsumePowerShortCircuitPipe;
