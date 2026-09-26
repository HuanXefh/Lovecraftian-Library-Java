/*
  ========================================
  Section: Definition
  ========================================
*/


    /* <------------------------------ import ------------------------------> */


    /**
     * @typedef {TemplateInstance<Block, INTF_BLK_furnaceBlock>} INTFBLKFurnaceBlock
     */


    /**
     * @typedef {TemplateInstance<Building, INTF_B_furnaceBlock>} INTFBFurnaceBlock
     * @prop {INTFBLKFurnaceBlock} block
     */


    const PARENT = require("lovec/temp/intf/INTF_BLK_heatBlock");


    /* <------------------------------ component ------------------------------> */


    /**
     * @private
     * @param {INTFBLKFurnaceBlock} blk
     * @return {void}
     */
    function comp_init(blk) {
        if(!blk.noFuelInput) {
            blk.configurable = true;
        };

        MDL_event.onLoadPost(() => {
            MDL_fuel.getFuelArr(blk).forEachFast(rs => {
                rs instanceof Item ?
                    MDL_recipeDict.addItemConsTerm(blk, rs, 1, 1.0, {icon: "lovec-icon-fuel", item: MDL_fuel.getFuelPon(rs) * 60.0 / blk.fuelConsMtp}) :
                    MDL_recipeDict.addFldConsTerm(blk, rs, MDL_fuel.getFuelPon(rs) * blk.fuelConsMtp, {icon: "lovec-icon-fuel"});
            });
        });
    };


    /**
     * @private
     * @param {INTFBLKFurnaceBlock} blk
     * @param {Stats} stats
     * @return {void}
     */
    function comp_setStats(blk, stats) {
        if(!blk.noFuelInput) {
            stats.add(fetchStat("lovec", "blk0fac-fuel"), newStatValue(tb => {
                tb.row();
                MDL_table.pnFixed(
                    tb,
                    pnTb => {
                        let matArr = [[
                            "",
                            tb1 => tb1.add(fetchStat("lovec", "rs0fuel-point").localized()).tooltip(MDL_bundle.getInfo("lovec", "tt-fuel-point")),
                            tb1 => tb1.add(fetchStat("lovec", "rs0fuel-level").localized()).tooltip(MDL_bundle.getInfo("lovec", "tt-fuel-level")),
                        ]];
                        MDL_fuel.getFuelArr(blk).forEachFast(rs => {
                            matArr.push([
                                rs,
                                rs instanceof Liquid ? "-" : (MDL_fuel.getFuelPon(rs) / blk.fuelConsMtp).color(blk.fuelConsMtp.fEqual(1.0) ? Color.white : blk.fuelConsMtp > 1.0 ? Pal.remove : Pal.heal),
                                (MDL_fuel.getFuelLvl(rs) * blk.fuelLvlMtp).color(blk.fuelLvlMtp.fEqual(1.0) ? Color.white : blk.fuelLvlMtp < 1.0 ? Pal.remove : Pal.heal),
                            ]);
                        });
                        MDL_table.setTable(pnTb, matArr);
                    },
                    {maxH: 300.0, align: Align.left, padLeft: 28.0},
                );
            }));

            if(!blk.fuelConsMtp.fEqual(1.0)) {
                stats.add(fetchStat("lovec", "blk0fac-fuelconsmtp"), blk.fuelConsMtp.perc());
            };
            if(!blk.fuelLvlMtp.fEqual(1.0)) {
                stats.add(fetchStat("lovec", "blk0fac-fuellvlmtp"), blk.fuelLvlMtp.perc());
            };
        };
    };


    /**
     * @private
     * @param {INTFBLKFurnaceBlock} blk
     * @return {void}
     */
    function comp_setBars(blk) {
        blk.removeBar("lovec-temp");
        blk.addBar("lovec-furnace-temp", b => new Bar(
            prov(() => Core.bundle.format("bar.heatpercent", Strings.fixed(b.delegee.tempCur, 2) + " " + fetchStatUnit("lovec", "heatunits").localized(), b.delegee.furnEffc.roundFixed(2) * 100.0)),
            prov(() => Tmp.c2.set(Color.darkGray).lerp(Pal.lightOrange, b.ex_getHeatFrac())),
            () => b.ex_getHeatFrac(),
        ));
    };


    /**
     * @private
     * @param {INTFBFurnaceBlock} b
     * @return {void}
     */
    function comp_updateTile(b) {
        if(DEBUG.skipFurnUpdate) return;

        // Update currently used fuel
        if(TIMER.secFive && !b.block.delegee.noFuelInput) {
            b.fuelTup = MDL_fuel.getFuelTup(b.fuelTup, b);
            b.tempFuel = b.fuelTup[0] == null ?
                0.0 :
                (b.fuelTup[2] * 100.0 * b.block.delegee.fuelLvlMtp);
            b.fuelPolProd = b.fuelTup[0] == null ?
                0.0 :
                MDL_pollution.getRsPol(b.fuelTup[0]);
        };

        // Add dynamic pollution
        if(TIMER.sec && b.fuelPonCur > 0.0) {
            MDL_pollution.addDynaPol(b.fuelPolProd);
        };

        // Occasionally update fuel consumption status
        if(TIMER.heat && b.fuelTup[0] != null) {
            b.ex_updateFuelConsumption(b.fuelTup[0], b.fuelTup[1]);
        };

        // Update furnace efficiency
          b.furnEffc = b.cheating() ?
            1.0 :
            Mathf.clamp(Math.min(
                Math.pow(b.tempCur / b.ex_getHeatTarget(), 1.5),
                !isFinite(b.ex_getHeatAllowed()) ?
                    Infinity :
                    ((b.ex_getHeatAllowed() - 2.0 * b.tempCur) / b.ex_getHeatAllowed() + 2.0),
            ));
        if(b.furnEffc < 0.15) {
            b.furnEffc = 0.0;
        };
        if(b.tempExt <= b.tempFuel && b.maxHeaterProd <= b.tempFuel) {
            b.furnEffc *= b.fuelEffc;
        };
    };


    /**
     * @private
     * @param {INTFBFurnaceBlock} b
     * @return {void}
     */
    function comp_updateEfficiencyMultiplier(b) {
        b.efficiency *= b.cheating() ? 1.0 : b.furnEffc;
    };


    /**
     * @private
     * @param {INTFBFurnaceBlock} b
     * @param {Building} b_f
     * @param {Item} item
     * @return {boolean}
     */
    function comp_acceptItem(b, b_f, item) {
        return b.block.delegee.noFuelInput ?
            b.items != null :
            b.items != null && b.items.get(item) < b.getMaximumAccepted(item) && (b.fuelSel != null ? item === b.fuelSel : MDL_fuel.checkFuelInput(b.block, item));
    };


    /**
     * @private
     * @param {INTFBFurnaceBlock} b
     * @param {Building} b_f
     * @param {Liquid} liq
     * @return {boolean}
     */
    function comp_acceptLiquid(b, b_f, liq) {
        return b.block.delegee.noFuelInput ?
            b.liquids != null :
            b.liquids != null && b.liquids.get(liq) < b.block.liquidCapacity && (b.fuelSel != null ? liq === b.fuelSel : MDL_fuel.checkFuelInput(b.block, liq));
    };


    /**
     * @private
     * @param {INTFBFurnaceBlock} b
     * @param {Resource} fuel
     * @param {number} pon
     * @return {void}
     */
    function comp_ex_updateFuelConsumption(b, fuel, pon) {
        b.fuelEffc = 1.0;
        if(fuel instanceof Item) {
            if(b.fuelPonCur < 1.0 && pon > 0.0 && FRAG_item.consumeItem(b, fuel, 1)) {
                b.fuelPonCur += pon;
            };
            if(b.fuelPonCur < 1.0) {
                b.fuelEffc = 0.0;
            };
            b.fuelPonCur = Mathf.maxZero(b.fuelPonCur - VAR.time.heatIntv / 60.0 * b.block.delegee.fuelConsMtp);
        } else {
            b.fuelPonCur = LCCraftingHandler.addLiquid(b, b, fuel, -pon * b.block.delegee.fuelConsMtp * VAR.time.heatIntv, false, false, true);
            b.fuelEffc = Math.min(b.fuelPonCur, 1.0);
        };
    };


    /**
     * @private
     * @param {INTFBFurnaceBlock} b
     * @return {void}
     */
    function comp_ex_postUpdateEfficiencyMultiplier(b) {
        comp_updateEfficiencyMultiplier(b);
    };


    /**
     * @private
     * @param {INTFBFurnaceBlock} b
     * @return {number}
     */
    function comp_ex_calcTempTargetFrac(b) {
        // If external heat outruns fuel heat
        if(b.tempExt > b.tempFuel || b.maxHeaterProd > b.tempFuel) return 1.0;
        // If no fuel supplied
        if(b.fuelTup[0] == null || b.fuelPonCur < 0.0001) return 0.0;
        if(b.fuelTup[0] instanceof Item) {
            if(b.items == null || !b.items.has(b.fuelTup[0])) return 0.0;
        } else {
            if(b.liquids == null || !b.liquids.get(b.fuelTup[0]) < 0.01) return 0.0;
        };
        return 1.0;
    };


    /**
     * @private
     * @param {INTFBFurnaceBlock} b
     * @param {Table} tb
     * @return {void}
     */
    function comp_ex_buildFuelSelector(b, tb) {
        MDL_table.setCtSelect(
            tb, b.block, MDL_fuel.getFuelArr(b.block),
            () => b.delegee.fuelSel, val => b.configure("FUEL: " + (val == null ? "null" : val.name)),
            null,
            {rowAmt: b.block.selectionRows, colAmt: b.block.selectionColumns - 1, closeSelect: false},
        );
    };


/*
  ========================================
  Section: Application
  ========================================
*/


    module.exports = [


        /**
         * Handles methods for fuel consumption.
         * @class INTF_BLK_furnaceBlock
         * @extends INTF_BLK_heatBlock
         */
        new CLS_interface({


            __paramObjM__: function() {
                return {


                    /**
                     * `PARAM`: If true, this furnace cannot warm up on its own.
                     * @memberof INTF_BLK_furnaceBlock
                     * @instance
                     * @type {boolean}
                     */
                    noFuelInput: false,
                    /**
                     * `PARAM`: Type of fuel to consume, see {@link FuelTypes}.
                     * @memberof INTF_BLK_furnaceBlock
                     * @instance
                     * @type {ENumber}
                     */
                    fuelType: FuelTypes.ITEM,
                    /**
                     * `PARAM`: List of resources that annot be consumed as fuel.
                     * @memberof INTF_BLK_furnaceBlock
                     * @instance
                     * @type {TDynamic<Array<Resource>>}
                     */
                    blockedFuels: tprov(() => []),
                    /**
                     * `PARAM`: If not null, this furnace can only consume these fuels.
                     * @memberof INTF_BLK_furnaceBlock
                     * @instance
                     * @type {TDynamic<Array<Resource>>|null}
                     */
                    allowedFuels: null,
                    /**
                     * `PARAM`: Multiplier on fuel consumption.
                     * @memberof INTF_BLK_furnaceBlock
                     * @instance
                     * @type {number}
                     */
                    fuelConsMtp: 1.0,
                    /**
                     * `PARAM`: Multiplier on fuel level.
                     * @memberof INTF_BLK_furnaceBlock
                     * @instance
                     * @type {number}
                     */
                    fuelLvlMtp: 1.0,
                    /**
                     * @inheritdoc
                     */
                    heatWarmupRate: 0.0001,
                    /**
                     * @inheritdoc
                     */
                    heatLightRad: 40.0,


                    /* <------------------------------ internal ------------------------------> */


                    /**
                     * `INTERNAL`: Enable this if `acceptXxx` from this interface is the last template method to be mixed.
                     * @memberof INTF_BLK_furnaceBlock
                     * @instance
                     * @type {boolean}
                     */
                    useAndOperForAccept: false,
                    /**
                     * `INTERNAL`
                     * <br> `REALIZED`
                     * @override
                     * @memberof INTF_BLK_furnaceBlock
                     * @instance
                     * @type {boolean}
                     */
                    skipHeatTrans: true,
                    /**
                     * `INTERNAL`
                     * <br> `REALIZED`
                     * @override
                     * @memberof INTF_BLK_furnaceBlock
                     * @instance
                     * @type {boolean}
                     */
                    skipHeatSupply: true,


                };
            }
            .setProp({
                mergeMode: "object",
            }),


            init: function() {
                comp_init(this);
            },


            setStats: function(stats) {
                comp_setStats(this, getCtStats(this, stats));
            },


            setBars: function() {
                comp_setBars(this);
            },


            consumesItem: function(item) {
                return MDL_fuel.checkFuelInput(this, item);
            }
            .setProp({
                boolMode: "or",
            }),


            consumesLiquid: function(liq) {
                return MDL_fuel.checkFuelInput(this, liq);
            }
            .setProp({
                boolMode: "or",
            }),


        })
        .extendInterface(PARENT[0], "INTF_BLK_furnaceBlock"),


        /**
         * @class INTF_B_furnaceBlock
         * @extends INTF_B_heatBlock
         */
        new CLS_interface({


            __paramObjM__: function() {
                return {


                    /* <------------------------------ internal ------------------------------> */


                    /**
                     * `INTERNAL`: Temperature related to fuel.
                     * @memberof INTF_B_furnaceBlock
                     * @instance
                     * @type {number}
                     */
                    tempFuel: 0.0,
                    /**
                     * `INTERNAL`: Currently remaining fuel points.
                     * @memberof INTF_B_furnaceBlock
                     * @instance
                     * @type {number}
                     */
                    fuelPonCur: 0.0,
                    /**
                     * `INTERNAL`: Explicitly selected fuel.
                     * @memberof INTF_B_furnaceBlock
                     * @instance
                     * @type {Resource|null}
                     */
                    fuelSel: null,
                    /**
                     * `INTERNAL`: Current fuel, fuel point and fuel level.
                     * @memberof INTF_B_furnaceBlock
                     * @instance
                     * @type {TDynamic<[Resource, number, number]>}
                     */
                    fuelTup: tprov(() => []),
                    /**
                     * `INTERNAL`: Fuel efficiency. Does not affect efficiency directly.
                     * @memberof INTF_B_furnaceBlock
                     * @instance
                     * @type {number}
                     */
                    fuelEffc: 0.0,
                    /**
                     * `INTERNAL`: Furnace efficiency.
                     * @memberof INTF_B_furnaceBlock
                     * @instance
                     * @type {number}
                     */
                    furnEffc: 0.0,
                    /**
                     * `INTERNAL`: Dynamic pollution produced by burning current fuel.
                     * @memberof INTF_B_furnaceBlock
                     * @instance
                     * @type {number}
                     */
                    fuelPolProd: 0.0,


                };
            }
            .setProp({
                mergeMode: "object",
            }),


            updateTile: function() {
                comp_updateTile(this);
            },


            updateEfficiencyMultiplier: function() {
                comp_updateEfficiencyMultiplier(this);
            },


            acceptItem: function(b_f, item) {
                return comp_acceptItem(this, b_f, item);
            }
            .setProp({
                mergeMode: function(valPrev, val) {
                    return this.block.delegee.noFuelInput || this.block.delegee.useAndOperForAccept ?
                        val && valPrev :
                        val || valPrev;
                },
            }),


            acceptLiquid: function(b_f, liq) {
                return comp_acceptLiquid(this, b_f, liq);
            }
            .setProp({
                mergeMode: function(valPrev, val) {
                    return this.block.delegee.noFuelInput || this.block.delegee.useAndOperForAccept ?
                        val && valPrev :
                        val || valPrev;
                },
            }),


            canDump: function(b_t, item) {
                return this.fuelTup[0] == null || this.fuelTup[0].id !== item.id || this.items.has(item, 5);
            }
            .setProp({
                boolMode: "and",
            }),


            warmupTarget: function() {
                return this.cheating() ? 1.0 : this.ex_getHeatFrac();
            }
            .setProp({
                noSuper: true,
                mergeMode: function(valPrev, val) {
                    return val * valPrev;
                },
            }),


            /**
             * @memberof INTF_B_furnaceBlock
             * @instance
             * @func
             * @param {Resource} fuel
             * @param {number} pon
             * @return {void}
             */
            ex_updateFuelConsumption: function(fuel, pon) {
                comp_ex_updateFuelConsumption(this, fuel, pon);
            }
            .setProp({
                noSuper: true,
                argLen: 2,
            }),


            /**
             * @memberof INTF_B_furnaceBlock
             * @instance
             * @func
             * @return {void}
             */
            ex_postUpdateEfficiencyMultiplier: function() {
                comp_ex_postUpdateEfficiencyMultiplier(this);
            }
            .setProp({
                noSuper: true,
            }),


            /**
             * @inheritdoc
             */
            ex_calcTempTarget: function thisFun() {
                return Math.max(thisFun.funPrev.apply(this, arguments), this.tempFuel);
            }
            .setProp({
                noSuper: true,
                override: true,
            }),


            /**
             * @inheritdoc
             */
            ex_calcTempTargetFrac: function() {
                return comp_ex_calcTempTargetFrac(this);
            }
            .setProp({
                noSuper: true,
                override: true,
            }),


            /**
             * @inheritdoc
             */
            ex_getHeatTarget: function() {
                return PARAM.GLOBAL_HEAT;
            }
            .setProp({
                noSuper: true,
                override: true,
            }),


            /**
             * Expected maximum temperature allowed for current recipe.
             * <br> `LATER`
             * @memberof INTF_B_furnaceBlock
             * @instance
             * @func
             * @return {number}
             */
            ex_getHeatAllowed: function() {
                return Infinity;
            }
            .setProp({
                noSuper: true,
            }),


            /**
             * @inheritdoc
             */
            ex_checkHeatingValid: function() {
                return this.tempRiseTarget - PARAM.GLOBAL_HEAT >= 10.0;
            }
            .setProp({
                noSuper: true,
                override: true,
            }),


            /**
             * @memberof INTF_B_furnaceBlock
             * @instance
             * @func
             * @param {Table} tb
             * @return {void}
             */
            ex_buildFuelSelector: function(tb) {
                comp_ex_buildFuelSelector(this, tb);
            }
            .setProp({
                noSuper: true,
            }),


            /**
             * @memberof INTF_B_furnaceBlock
             * @instance
             * @func
             * @param {Writes|Reads} wr0rd
             * @return {void}
             */
            ex_processData: function(wr0rd) {
                processData(
                    wr0rd,
                    wr => {
                        MDL_io.ct(wr, this.fuelSel);
                    },
                    rd => {
                        this.fuelSel = MDL_io.ct(rd);
                    },
                );
            }
            .setProp({
                noSuper: true,
                argLen: 1,
            }),


        })
        .extendInterface(PARENT[1], "INTF_B_furnaceBlock"),


    ];
