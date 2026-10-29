/*
  ================================================================================
  Section: Definition
  ================================================================================
*/


    /* <------------------------------ import ------------------------------> */


    /**
     * @typedef {TemplateInstance<GenericCrafter, BLK_rainCollector>} BLKRainCollector
     */


    /**
     * @typedef {TemplateInstance<GenericCrafter.GenericCrafterBuild, B_rainCollector>} BRainCollector
     * @prop {BLKRainCollector} block
     */


    const PARENT = require("lovec/temp/blk/BLK_baseFactory");
    const INTF_BLK_corrosionAcceptor = require("lovec/temp/intf/INTF_BLK_corrosionAcceptor");
    const INTF_BLK_fluidHeatAcceptor = require("lovec/temp/intf/INTF_BLK_fluidHeatAcceptor");


    /* <------------------------------ component ------------------------------> */


    /**
     * @private
     * @param {BLKRainCollector} blk
     * @return {void}
     */
    function comp_init(blk) {
        blk.outputsLiquid = true;

        MDL_event.onLoadPost(() => {
            Vars.content.weathers().each(
                wea => wea instanceof RainWeather,
                wea => MDL_recipeDict.addFldProdTerm(blk, wea.liquid, blk.delegee.liqProdRate),
            );
        });

        MOD_tmi.regisRc_rainCollector(blk);
    };


    /**
     * @private
     * @param {BLKRainCollector} blk
     * @param {Stats} stats
     * @return {void}
     */
    function comp_setStats(blk, stats) {
        stats.add(fetchStat("lovec", "blk0fac-prodspd"), blk.delegee.liqProdRate * 60.0, StatUnit.liquidSecond);
    };


    /**
     * @private
     * @param {BLKRainCollector} blk
     * @return {Liquid|null}
     */
    function comp_ex_findWeatherLiquid(blk) {
        let liq = null;
        if(GLB_param.IS_CAVE_MAP) return liq;
        GLB_var.entities.weather.each(weaSta => weaSta.weather instanceof RainWeather, weaSta => liq = weaSta.weather.liquid);
        return liq;
    };


    /**
     * @private
     * @param {BRainCollector} b
     * @return {void}
     */
    const comp_updateTile = function thisFun(b) {
        if(GLB_timer.secFive) {
            b.delegee.rsTarget = b.block.self.ex_findWeatherLiquid();
        };

        if(b.delegee.rsTarget !== null && !Vars.net.client()) {
            SLCCraftingHandler.addLiquid(b, b, b.delegee.rsTarget, b.scaleOutput(b.block.delegee.liqProdRate), true);
            // Spill liquid if full
            if(b.efficiency > 0.0 && Mathf.chanceDelta(0.04) && b.liquids.get(b.delegee.rsTarget) > b.block.liquidCapacity * 0.98) {
                SLCPos.getTilesEdge(thisFun.tmpTs, b.tile, b.block.size, true).forEachFast(ot => {
                    if(Mathf.chance(0.5)) {
                        Puddles.deposit(ot, b.delegee.rsTarget, 4.0);
                    };
                }, true);
            };

            b.dumpLiquid(b.delegee.rsTarget, 2.0);
        };
    }
    .setProp({
        /**
         * @memberof comp_updateTile
         * @type {Array<Tile>}
         */
        tmpTs: [],
    });


    /**
     * @private
     * @param {BRainCollector} b
     * @param {Table} tb
     * @return {void}
     */
    function comp_displayBars(b, tb) {
        if(b.delegee.rsTarget != null && b.block.outputLiquids != null && !b.block.outputLiquids.some(liqStack => liqStack.liquid === b.delegee.rsTarget)) {
            tb.add(new Bar(
                b.delegee.rsTarget.localizedName,
                tryVal(b.delegee.rsTarget.barColor, b.delegee.rsTarget.color),
                () => b.liquids.get(liq) / b.block.liquidCapacity,
            )).growX();
            tb.row();
        };
    };


/*
  ================================================================================
  Section: Application
  ================================================================================
*/


    module.exports = [


        /**
         * Dynamically outputs liquid based on current rain weather.
         * @class BLK_rainCollector
         * @extends BLK_baseFactory
         * @extends INTF_BLK_corrosionAcceptor
         * @extends INTF_BLK_fluidHeatAcceptor
         */
        newClass()
        .extendClass(PARENT[0], "BLK_rainCollector")
        .implement(INTF_BLK_corrosionAcceptor[0])
        .implement(INTF_BLK_fluidHeatAcceptor[0])
        .initTemplate()
        .setParent("GenericCrafter")
        .setTags()
        .setParam({


            /**
             * `PARAM`: Production rate for weather liquid output.
             * @memberof BLK_rainCollector
             * @instance
             * @type {number}
             */
            liqProdRate: 0.1,


        })
        .setMethod({


            init: function() {
                comp_init(this);
            },


            setStats: function(stats) {
                comp_setStats(this, getCtStats(this, stats));
            },


            /**
             * Gets liquid to produce.
             * @memberof BLK_rainCollector
             * @instance
             * @func
             * @return {Liquid|null}
             */
            ex_findWeatherLiquid: function() {
                return comp_ex_findWeatherLiquid(this);
            }
            .setProp({
                noSuper: true,
            }),


        }),


        /**
         * @class B_rainCollector
         * @extends B_baseFactory
         * @extends INTF_B_corrosionAcceptor
         * @extends INTF_B_fluidHeatAcceptor
         */
        newClass()
        .extendClass(PARENT[1], "B_rainCollector")
        .implement(INTF_BLK_corrosionAcceptor[1])
        .implement(INTF_BLK_fluidHeatAcceptor[1])
        .initTemplate()
        .setParent("GenericCrafter.GenericCrafterBuild")
        .setParam({


            /* <------------------------------ internal ------------------------------> */


            /**
             * `INTERNAL`
             * @memberof B_rainCollector
             * @instance
             * @type {Liquid|null}
             */
            rsTarget: null,


        })
        .setMethod({


            updateTile: function() {
                comp_updateTile(this);
            },


            displayBars: function(tb) {
                comp_displayBars(this, tb);
            },


        }),


    ];
