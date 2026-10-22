/*
  ========================================
  Section: Definition
  ========================================
*/


    /* <------------------------------ import ------------------------------> */


    /**
     * @typedef {TemplateInstance<MendProjector, BLK_radiusMender>} BLKRadiusMender
     */


    /**
     * @typedef {TemplateInstance<MendProjector.MendBuild, B_radiusMender>} BRadiusMender
     * @prop {BLKRadiusMender} block
     */


    const PARENT = require("lovec/temp/blk/BLK_baseMender");


    /* <------------------------------ component ------------------------------> */


    /**
     * @private
     * @param {BLKRadiusMender} blk
     * @return {void}
     */
    function comp_init(blk) {
        blk.delegee.healsBuilding = blk.delegee.bHealAmt > 0.0 || blk.delegee.bHealPerc > 0.0;
        blk.delegee.healsUnit = blk.delegee.unitHealAmt > 0.0 || blk.delegee.unitHealPerc > 0.0;
    };


    /**
     * @private
     * @param {BLKRadiusMender} blk
     * @param {Stats} stats
     * @return {void}
     */
    function comp_setStats(blk, stats) {
        stats.remove(Stat.repairTime);
        stats.remove(Stat.range);

        if(blk.delegee.healsBuilding) {
            stats.add(fetchStat("lovec", "blk0misc-repairamt"), MDL_text.getHealText(
                blk.delegee.bHealAmt,
                blk.delegee.bHealPerc,
            ));
        };
        if(blk.delegee.healsUnit) {
            stats.add(fetchStat("lovec", "blk0misc-unitrepairamt"), MDL_text.getHealText(
                blk.delegee.unitHealAmt,
                blk.delegee.unitHealPerc,
            ));
        };
        stats.add(fetchStat("lovec", "blk0misc-repairr"), blk.range / Vars.tilesize, StatUnit.blocks);
        stats.add(fetchStat("lovec", "blk0misc-repairintv"), blk.reload / 60.0, StatUnit.seconds);
    };


    /**
     * @private
     * @param {BRadiusMender} b
     * @return {void}
     */
    function comp_updateTile(b) {
        let cond = !b.checkSuppression();

        b.smoothEfficiency = Mathf.lerpDelta(b.smoothEfficiency, b.efficiency, 0.08);
        b.heat = Mathf.lerpDelta(b.heat, cond && b.efficiency > 0.0 ? 1.0 : 0.0, 0.08);
        b.charge += b.heat * b.delta();
        b.phaseHeat = Mathf.lerpDelta(b.phaseHeat, b.optionalEfficiency, 0.1);

        if(b.optionalEfficiency > 0.0 && cond) {
            b.delegee.useTimeCur += b.delta();
            if(b.delegee.useTimeCur >= b.block.useTime) {
                b.delegee.useTimeCur %= b.block.useTime;
                b.consume();
            };
        };

        if(b.charge > b.block.reload && cond) {
            b.charge = 0.0;
            let rad = b.block.range + b.phaseHeat * b.block.phaseRangeBoost;

            if(b.block.delegee.healsBuilding) {
                LCEntity.eachBuild(b.x, b.y, b.team, rad, ob => MDL_cond.canHeal(ob), ob => {
                    FRAG_attack.heal(ob, (ob.maxHealth * b.block.delegee.bHealPerc + b.block.delegee.bHealAmt * (1.0 + b.phaseHeat * b.block.phaseBoost)) * b.efficiency, true);
                });
            };

            if(b.block.delegee.healsUnit) {
                LCEntity.eachUnit(b.x, b.y, b.team, rad, ounit => MDL_cond.canHeal(ounit), ounit => {
                    if(FRAG_attack.heal(ounit, (ounit.maxHealth * b.block.delegee.unitHealPerc + b.block.delegee.unitHealAmt * (1.0 + b.phaseHeat * b.block.phaseBoost)) * b.efficiency)) {
                        MDL_effect.line(b.x, b.y, null, ounit, GLB_color.heal);
                    };
                });
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
         * Vanilla mender, but heal numbers are shown.
         * Capable of healing units also.
         * @class BLK_radiusMender
         * @extends BLK_baseMender
         */
        newClass()
        .extendClass(PARENT[0], "BLK_radiusMender")
        .initTemplate()
        .setParent("MendProjector")
        .setTags()
        .setParam({


            /**
             * `PARAM`: Heal amount for buildings.
             * @memberof BLK_radiusMender
             * @instance
             * @type {number}
             */
            bHealAmt: 0.0,
            /**
             * `PARAM`: Heal percentage for buildings.
             * @memberof BLK_radiusMender
             * @instance
             * @type {number}
             */
            bHealPerc: 0.0,
            /**
             * `PARAM`: Heal amount for units.
             * @memberof BLK_radiusMender
             * @instance
             * @type {number}
             */
            unitHealAmt: 0.0,
            /**
             * `PARAM`: Heal percentage for units.
             * @memberof BLK_radiusMender
             * @instance
             * @type {number}
             */
            unitHealPerc: 0.0,


            /* <------------------------------ internal ------------------------------> */


            /**
             * `INTERNAL`
             * @memberof BLK_radiusMender
             * @instance
             * @type {boolean}
             */
            healsBuilding: false,
            /**
             * `INTERNAL`
             * @memberof BLK_radiusMender
             * @instance
             * @type {boolean}
             */
            healsUnit: false,


        })
        .setMethod({


            init: function() {
                comp_init(this);
            },


            setStats: function(stats) {
                comp_setStats(this, getCtStats(this, stats));
            },


        }),


        /**
         * @class B_radiusMender
         * @extends B_baseMender
         */
        newClass()
        .extendClass(PARENT[1], "B_radiusMender")
        .initTemplate()
        .setParent("MendProjector.MendBuild")
        .setParam({


            /* <------------------------------ internal ------------------------------> */


            /**
             * `INTERNAL`
             * @memberof B_radiusMender
             * @instance
             * @type {number}
             */
            useTimeCur: 0.0,


        })
        .setMethod({


            updateTile: function() {
                comp_updateTile(this);
            }
            .setProp({
                noSuper: true,
            }),


        }),


    ];
