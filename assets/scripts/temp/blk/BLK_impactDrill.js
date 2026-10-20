/*
  ========================================
  Section: Definition
  ========================================
*/


    /* <------------------------------ import ------------------------------> */


    /**
     * @typedef {TemplateInstance<BurstDrill, BLK_impactDrill>} BLKImpactDrill
     */


    /**
     * @typedef {TemplateInstance<BurstDrill.BurstDrillBuild, B_impactDrill>} BImpactDrill
     * @prop {BLKImpactDrill} block
     */


    const PARENT = require("lovec/temp/blk/BLK_baseGroundDrill");
    const INTF_BLK_impactInducer = require("lovec/temp/intf/INTF_BLK_impactInducer");


    /* <------------------------------ component ------------------------------> */


    /**
     * @private
     * @param {BImpactDrill} b
     * @return {void}
     */
    function comp_updateTile(b) {
        if(b.dominantItem != null) {
            if(b.invertTime > 0.0) {
                b.invertTime -= b.delta() / b.block.invertedTime;
            };

            b.delegee.dumpTimeCur += b.delta();
            if(b.delegee.dumpTimeCur >= b.block.dumpTime) {
                b.delegee.dumpTimeCur %= b.block.dumpTime;
                b.dump(b.items.has(b.dominantItem) ? b.dominantItem : null);
            };

            let drillTime = b.block.getDrillTime(b.dominantItem);
            b.smoothProgress = Mathf.lerpDelta(b.smoothProgress, b.progress / (drillTime - 20.0), 0.1);
            if(b.dominantItems > 0 && b.efficiency > 0.0 && b.items.get(b.dominantItem) <= b.getMaximumAccepted(b.dominantItem) - b.dominantItems) {
                b.warmup = Mathf.approachDelta(b.warmup, b.progress / drillTime, b.block.warmupSpeed);
                let spd = Mathf.lerp(1.0, b.block.liquidBoostIntensity, b.optionalEfficiency) * b.efficiency;
                b.timeDrilled += b.block.speedCurve.apply(b.progress / drillTime) * spd;
                b.lastDrillSpeed = 1.0 / drillTime * spd * b.dominantItems;
                b.progress += b.delta() * spd;
                if(b.progress >= drillTime) {
                    FRAG_item.offload(b, b, b.dominantItem, b.dominantItems);
                    b.invertTime = 1.0;
                    b.progress %= drillTime;

                    Effect.shake(b.block.shake, b.block.shake, b);
                    b.block.drillSound.at(b.x, b.y, 1.0 + Mathf.range(b.block.drillSoundPitchRand), b.block.drillSoundVolume);
                    b.block.drillEffect.at(b.x + Mathf.range(b.block.drillEffectRnd), b.y + Mathf.range(b.block.drillEffectRnd), b.dominantItem.color);

                    b.self.ex_onCraft();
                };
            } else {
                b.warmup = Mathf.approachDelta(b.warmup, 0.0, 0.01);
                b.lastDrillSpeed = 0.0;
            };
        };
    };


/*
  ========================================
  Section: Application
  ========================================
*/


    module.exports = [


        /**
         * Vanilla burst drill rebalanced.
         * @class BLK_impactDrill
         * @extends BLK_baseGroundDrill
         * @extends INTF_BLK_impactInducer
         */
        newClass()
        .extendClass(PARENT[0], "BLK_impactDrill")
        .implement(INTF_BLK_impactInducer[0])
        .initTemplate()
        .setParent(BurstDrill)
        .setTags()
        .setParam({


            /**
             * `PARAM`: Impact drills are designed to mine depth ore by default.
             * @override
             * @memberof BLK_impactDrill
             * @instance
             * @type {boolean}
             */
            canMineDepthOre: true,


        })
        .setMethod({


            drawPlace: function(tx, ty, rot, valid) {
                // No super
            }
            .setProp({
              noSuper: true,
            }),


            /**
             * `REALIZED`
             * @override
             * @memberof BLK_impactDrill
             * @instance
             * @func
             * @param {BImpactDrill} b
             * @return {number}
             */
            ex_calcImpactIntv: function(b) {
                return this.drillTime;
            }
            .setProp({
                noSuper: true,
                override: true,
                argLen: 1,
            }),


            /**
             * `REALIZED`
             * @override
             * @memberof BLK_impactDrill
             * @instance
             * @func
             * @param {BImpactDrill} b
             * @return {number}
             */
            ex_calcImpactShake: function(b) {
                return this.shake;
            }
            .setProp({
                noSuper: true,
                override: true,
                argLen: 1,
            }),


        }),


        /**
         * @class B_impactDrill
         * @extends B_baseGroundDrill
         * @extends INTF_B_impactInducer
         */
        newClass()
        .extendClass(PARENT[1], "B_impactDrill")
        .implement(INTF_BLK_impactInducer[1])
        .initTemplate()
        .setParent(BurstDrill.BurstDrillBuild)
        .setParam({})
        .setMethod({


            updateTile: function() {
                comp_updateTile(this);
            }
            .setProp({
                noSuper: true,
            }),


            shouldConsume: function() {
                return this.enabled && this.dominantItem != null && this.items.get(this.dominantItem) <= this.getMaximumAccepted(this.dominantItem) - this.dominantItems;
            }
            .setProp({
                noSuper: true,
                boolMode: "and",
            }),


            drawSelect: function() {
                // No super
            }
            .setProp({
                noSuper: true,
            }),


            /**
             * @override
             * @memberof B_impactDrill
             * @instance
             * @func
             * @return {void}
             */
            ex_onCraft: function() {
                this.self.ex_createImpactWave();
            }
            .setProp({
                noSuper: true,
            }),


        }),


    ];
