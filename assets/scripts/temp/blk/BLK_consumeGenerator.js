/*
  ========================================
  Section: Definition
  ========================================
*/


    /* <------------------------------ import ------------------------------> */


    /**
     * @typedef {TemplateInstance<ConsumeGenerator, BLK_consumeGenerator>} BLKConsumeGenerator
     */


    /**
     * @typedef {TemplateInstance<ConsumeGenerator.ConsumeGeneratorBuild, B_consumeGenerator>} BConsumeGenerator
     * @prop {BLKConsumeGenerator} block
     */


    const PARENT = require("lovec/temp/blk/BLK_baseGenerator");


    /* <------------------------------ component ------------------------------> */


    /**
     * @private
     * @param {BLKConsumeGenerator} blk
     * @return {void}
     */
    function comp_setBars(blk) {
        if(blk.genWarmupRate < 0.0) {
            blk.addBar("lovec-warmup", b => new Bar(
                prov(() => Core.bundle.format("bar.lovec-bar-warmup-amt", b.delegee.genWarmup.perc())),
                prov(() => GLB_color.ammo),
                () => Mathf.clamp(b.delegee.genWarmup),
            ));
        };
    };


    /**
     * @private
     * @param {BConsumeGenerator} b
     * @return {void}
     */
    function comp_updateTile(b) {
        let rate = b.block.delegee.genWarmupRate;
        if(rate < 0.0) {
            b.delegee.genWarmup = 1.0;
        } else {
            b.delegee.genWarmup = b.efficiency > 0.9999 && (!b.block.consumesPower || b.power.status > 0.99) ?
                Mathf.approachDelta(b.delegee.genWarmup, b.self.ex_getGenWarmupTarget(), rate * b.timeScale) :
                Mathf.approachDelta(b.delegee.genWarmup, 0.0, rate * b.timeScale * 5.0);
        };

        b.productionEfficiency = b.efficiency * b.efficiencyMultiplier;
        b.totalTime += b.self.ex_getWarmupFrac() * b.edelta();

        if(b.efficiency > 0.0 && Mathf.chanceDelta(b.block.effectChance * b.efficiency)) {
            MDL_effect.showAround(b.x, b.y, b.block.generateEffect, b.block.generateEffectRange, 0.0);
        };

        if(b.block.filterItem != null && b.efficiency > 0.0 && b.block.itemDurationMultipliers.size > 0 && b.block.filterItem.getConsumed(b) != null) {
            b.itemDurationMultiplier = b.block.itemDurationMultipliers.get(b.block.filterItem.getConsumed(b), 1.0);
        };
        if(b.items != null && b.efficiency > 0.0 && b.generateTime <= 0.0) {
            b.generateTime = 1.0;
            b.consume();
            MDL_effect.showAt(b.x, b.y, b.block.consumeEffect, 0.0);
        };
        if(b.block.outputLiquid != null) {
            let amt = Math.min(b.productionEfficiency * b.delta() * b.block.outputLiquid.amount, b.block.liquidCapacity - b.liquids.get(b.block.outputLiquid.liquid));
            b.liquids.add(b.block.outputLiquid.liquid, amt);
            b.dumpLiquid(b.block.outputLiquid.liquid);
            if(b.block.explodeOnFull && b.liquids.get(b.block.outputLiquid.liquid) > b.block.liquidCapacity - 0.01) {
                b.kill();
                Events.fire(new GeneratorPressureExplodeEvent(b));
            };
        };

        b.generateTime -= b.delta() / b.block.itemDuration / b.itemDurationMultiplier;
        b.warmup = b.self.ex_getWarmupFrac();
    };


/*
  ========================================
  Section: Application
  ========================================
*/


    module.exports = [


        /**
         * Vanilla {@link ConsumeGenerator} but has warmup just like {@link ImpactReactor}.
         * @class BLK_consumeGenerator
         * @extends BLK_baseGenerator
         */
        newClass()
        .extendClass(PARENT[0], "BLK_consumeGenerator")
        .initTemplate()
        .setParent("ConsumeGenerator")
        .setTags()
        .setParam({


            /**
             * `PARAM`: Warmup rate for power generation. Set this to negative value to disable warmup mechanics.
             * @memberof BLK_consumeGenerator
             * @instance
             * @type {number}
             */
            genWarmupRate: -1.0,


        })
        .setParamAlias([
            /**
             * `ALIAS`: `consumeEffect`.
             * @memberof BLK_consumeGenerator
             * @instance
             * @name consEff
             * @type {Effect}
             */
            "consEff", "consumeEffect", Fx.none,
        ])
        .setMethod({


            setBars: function() {
                comp_setBars(this);
            },


        }),


        /**
         * @class B_consumeGenerator
         * @extends B_baseGenerator
         */
        newClass()
        .extendClass(PARENT[1], "B_consumeGenerator")
        .initTemplate()
        .setParent("ConsumeGenerator.ConsumeGeneratorBuild")
        .setParam({


            /* <------------------------------ internal ------------------------------> */


            /**
             * `INTERNAL`
             * @memberof B_consumeGenerator
             * @instance
             * @type {number}
             */
            genWarmup: 0.0,


        })
        .setMethod({


            updateTile: function() {
                comp_updateTile(this);
            }
            .setProp({
                noSuper: true,
            }),


            getPowerProduction: function() {
                return !this.enabled ?
                    0.0 :
                    (this.block.powerProduction * this.productionEfficiency * this.delegee.genWarmup);
            }
            .setProp({
                noSuper: true,
            }),


            write: function(wr) {
                this.self.ex_processData(wr);
                wr.f(this.delegee.genWarmup);
            },


            read: function(rd, revi) {
                if(this.delegee.LCRevi === 5) {
                    rd.s();
                };
                this.self.ex_processData(rd);
                this.delegee.genWarmup = rd.f();
            },


            /**
             * @memberof B_consumeGenerator
             * @instance
             * @func
             * @return {number}
             */
            ex_getWarmupFrac: function() {
                return !this.enabled ?
                    0.0 :
                    (this.productionEfficiency * this.delegee.genWarmup);
            }
            .setProp({
                noSuper: true,
            }),


            /**
             * Warmup target for {@link B_consumeGenerator#genWarmup}.
             * @memberof B_consumeGenerator
             * @instance
             * @func
             * @return {number}
             */
            ex_getGenWarmupTarget: function() {
                return 1.0;
            }
            .setProp({
                noSuper: true,
            }),


            /**
             * @memberof B_consumeGenerator
             * @instance
             * @func
             * @param {Writes|Reads} wr0rd
             * @return {void}
             */
            ex_processData: function(wr0rd) {
                // Do nothing
            }
            .setProp({
                noSuper: true,
            }),


        }),


    ];
