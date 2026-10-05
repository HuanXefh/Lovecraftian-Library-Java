/*
  ========================================
  Section: Definition
  ========================================
*/


    /* <------------------------------ import ------------------------------> */


    /**
     * @typedef {TemplateInstance<ArmoredConveyor, BLK_auxiliaryCable>} BLKAuxiliaryCable
     */


    /**
     * @typedef {TemplateInstance<ArmoredConveyor.ArmoredConveyorBuild, B_auxiliaryCable>} BAuxiliaryCable
     * @prop {BLKAuxiliaryCable} block
     */


    const PARENT = require("lovec/temp/blk/BLK_cable");


    /* <------------------------------ component ------------------------------> */


    /**
     * @private
     * @param {BLKAuxiliaryCable} blk
     * @param {Stats} stats
     * @return {void}
     */
    function comp_setStats(blk, stats) {
        stats.remove(fetchStat("lovec", "blk0pow-safepowlvl"));
    };


    /**
     * @private
     * @param {BAuxiliaryCable} b
     * @return {void}
     */
    function comp_onProximityUpdate(b) {
        let safeLvl = Number.n8, tmpSafeLvl;
        b.proximity.each(
            ob => MDL_cond.isCable(ob.block),
            ob => {
                tmpSafeLvl = tryFun(ob.ex_getMaxPowProdAllowed, ob, Number.n8);
                if(tmpSafeLvl < safeLvl) {
                    safeLvl = tmpSafeLvl;
                };
            },
        );
        b.blk$maxPowProdAllowed = safeLvl;
    };


/*
  ========================================
  Section: Application
  ========================================
*/


    module.exports = [


        /**
         * {@link BLK_cable} with dynamic safe power level, thus able to become member of other cable graphs.
         * <br> `SINGLESIZE`
         * @class BLK_auxiliaryCable
         * @extends BLK_cable
         */
        newClass()
        .extendClass(PARENT[0], "BLK_auxiliaryCable")
        .initTemplate()
        .setParent(ArmoredConveyor)
        .setTags()
        .setParam({


            /**
             * `PARAM`: Safe power level used when only this cable exists in the graph.
             * @override
             * @memberof BLK_auxiliaryCable
             * @instance
             * @type {number}
             */
            maxPowProdAllowed: Number.n8,


        })
        .setMethod({


            setStats: function(stats) {
                comp_setStats(this, getCtStats(this, stats));
            },


        }),


        /**
         * @class B_auxiliaryCable
         * @extends B_cable
         */
        newClass()
        .extendClass(PARENT[1], "B_auxiliaryCable")
        .initTemplate()
        .setParent(ArmoredConveyor.ArmoredConveyorBuild)
        .setParam({


            /* <------------------------------ internal ------------------------------> */


            /**
             * `INTERNAL`
             * @memberof B_auxiliaryCable
             * @instance
             * @type {number|TmpStateTag}
             */
            blk$maxPowProdAllowed: TmpStateTag.needReplace,


        })
        .setMethod({


            onProximityUpdate: function thisFun() {
                comp_onProximityUpdate(this);
                thisFun.funPrev.call(this);
            }
            .setProp({
                override: true,
            }),


            /**
             * `REALIZED`
             * @override
             * @memberof B_auxiliaryCable
             * @instance
             * @func
             * @return {number}
             */
            ex_getMaxPowProdAllowed: function() {
                return this.delegee.blk$maxPowProdAllowed;
            }
            .setProp({
                noSuper: true,
                override: true,
            }),


        }),


    ];
