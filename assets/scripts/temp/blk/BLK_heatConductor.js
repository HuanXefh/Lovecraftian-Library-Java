/*
  ========================================
  Section: Definition
  ========================================
*/


    /* <------------------------------ import ------------------------------> */


    /**
     * @typedef {TemplateInstance<Wall, BLK_heatConductor>} BLKHeatConductor
     */


    /**
     * @typedef {TemplateInstance<Wall.WallBuild, B_heatConductor>} BHeatConductor
     * @prop {BLKHeatConductor} block
     */


    const PARENT = require("lovec/temp/blk/BLK_baseHeatBlock");


    /* <------------------------------ component ------------------------------> */


    /**
     * @private
     * @param {BLKHeatConductor} blk
     * @return {void}
     */
    function comp_init(blk) {
        blk.rotate = true;
        blk.update = true;
        blk.group = BlockGroup.none;
        blk.priority = TargetPriority.base;
        blk.drawCached = false;
        blk.drawDynamic = true;

        blk.delegee.heatLightTempReq = blk.delegee.visualFullHeatThr;
    };


    /**
     * @private
     * @param {BLKHeatConductor} blk
     * @return {void}
     */
    function comp_load(blk) {
        blk.delegee.dirReg = fetchRegion(blk, "-dir");
    };


    /**
     * @private
     * @param {BHeatConductor} b
     * @return {void}
     */
    function comp_draw(b) {
        Draw.rect(b.block.region, b.x, b.y);
        Draw.rect(b.block.delegee.dirReg, b.x, b.y, b.drawrot());
    };


/*
  ========================================
  Section: Application
  ========================================
*/


    module.exports = [


        /**
         * Conducts Lovec heat.
         * Note that this is not vanilla Erekir {@link HeatConductor}.
         * @class BLK_heatConductor
         * @extends BLK_baseHeatBlock
         */
        newClass()
        .extendClass(PARENT[0], "BLK_heatConductor")
        .initTemplate()
        .setParent("Wall")
        .setTags("blk-non-wall")
        .setParam({


            /**
             * `PARAM`: Temperature at which heat region is drawn with maximum alpha.
             * @memberof BLK_heatConductor
             * @instance
             * @type {number}
             */
            visualFullHeatThr: 100.0,


            /* <------------------------------ internal ------------------------------> */


            /**
             * `INTERNAL`
             * @memberof BLK_heatConductor
             * @instance
             * @type {TextureRegion}
             */
            dirReg: null,
            /**
             * `INTERNAL`: For heat conductors one heat region is just bright enough on most occasions.
             * @override
             * @memberof BLK_heatConductor
             * @instance
             * @type {boolean}
             */
            shouldDrawDoubleHeat: false,
            /**
             * `INTERNAL`
             * @override
             * @memberof BLK_heatConductor
             * @instance
             * @type {number}
             */
            heatLightTempReq: 100.0,


            /* <------------------------------ vanilla ------------------------------> */


            solid: false,
            underBullets: true,


        })
        .setMethod({


            init: function() {
                comp_init(this);
            },


            load: function() {
                comp_load(this);
            },


        }),


        /**
         * @class B_heatConductor
         * @extends B_baseHeatBlock
         */
        newClass()
        .extendClass(PARENT[1], "B_heatConductor")
        .initTemplate()
        .setParent("Wall.WallBuild")
        .setParam({})
        .setMethod({


            draw: function() {
                comp_draw(this);
            }
            .setProp({
                noSuper: true,
            }),


            /**
             * `REALIZED`
             * @override
             * @memberof B_heatConductor
             * @instance
             * @func
             * @return {number}
             */
            ex_getHeatTarget: function() {
                return this.block.delegee.visualFullHeatThr;
            }
            .setProp({
                noSuper: true,
                override: true,
            }),


        }),


    ];
