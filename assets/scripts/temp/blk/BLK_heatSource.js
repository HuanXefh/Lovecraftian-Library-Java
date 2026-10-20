/*
  ========================================
  Section: Definition
  ========================================
*/


    /* <------------------------------ import ------------------------------> */


    /**
     * @typedef {TemplateInstance<Wall, BLK_heatSource>} BLKHeatSource
     */


    /**
     * @typedef {TemplateInstance<Wall.WallBuild, B_heatSource>} BHeatSource
     * @prop {BLKHeatSource} block
     */


    const PARENT = require("lovec/temp/blk/BLK_baseHeatBlock");


    /* <------------------------------ component ------------------------------> */


    /**
     * @private
     * @param {BLKHeatSource} blk
     * @return {void}
     */
    function comp_init(blk) {
        blk.rotate = true;
        blk.update = true;
        blk.group = BlockGroup.none;
        blk.priority = TargetPriority.base;
        blk.buildVisibility = BuildVisibility.sandboxOnly;
        blk.drawCached = false;
        blk.drawDynamic = true;

        blk.configurable = true;

        blk.config(JAVA.float, (b, f) => {
            b.delegee.tempSet = f;
        });
    };


    /**
     * @private
     * @param {BLKHeatSource} blk
     * @return {void}
     */
    function comp_load(blk) {
        blk.delegee.sideReg1 = fetchRegion(blk, "-side1", "-side");
        blk.delegee.sideReg2 = fetchRegion(blk, "-side2", "-side");
    };


    /**
     * @private
     * @param {BHeatSource} b
     * @param {Table} tb
     * @return {void}
     */
    function comp_buildConfiguration(b, tb) {
        tb.row();
        tb.table(Styles.black3, tb1 => {
            tb1.left();
            MDL_table.margin(tb1);
            MDL_table.sliderCfg(tb1, b, () => "${1}: ${2}".format(MDL_bundle.getTerm("lovec", "temperature"), b.delegee.tempSet + " " + fetchStatUnit("lovec", "heatunits").localized()), b.block.delegee.tempMin, b.block.delegee.tempMax, 50.0, b.delegee.tempSet);
        })
        .left()
        .growX();
    };


    /**
     * @private
     * @param {BHeatSource} b
     * @return {void}
     */
    function comp_draw(b) {
        Draw.rect(b.block.region, b.x, b.y);
        LCDrawf.side(b.x, b.y, b.block.delegee.sideReg1, b.block.delegee.sideReg2, b.rotation);
    };


/*
  ========================================
  Section: Application
  ========================================
*/


    module.exports = [


        /**
         * Source of Lovec heat, with a slider to adjust the temperature.
         * @class BLK_heatSource
         * @extends BLK_baseHeatBlock
         */
        newClass()
        .extendClass(PARENT[0], "BLK_heatSource")
        .initTemplate()
        .setParent("Wall")
        .setTags("blk-non-wall")
        .setParam({


            /**
             * `PARAM`: Minimum temperature.
             * @memberof BLK_heatSource
             * @instance
             * @type {number}
             */
            tempMin: 0.0,
            /**
             * `PARAM`: Maximum temperature.
             * @memberof BLK_heatSource
             * @instance
             * @type {number}
             */
            tempMax: 3000.0,
            /**
             * @inheritdoc
             * @memberof BLK_heatSource
             * @instance
             * @type {number}
             */
            heatWarmupRate: 0.008,


            /* <------------------------------ internal ------------------------------> */


            /**
             * `INTERNAL`
             * @memberof BLK_heatSource
             * @instance
             * @type {TextureRegion}
             */
            sideReg1: null,
            /**
             * `INTERNAL`
             * @memberof BLK_heatSource
             * @instance
             * @type {TextureRegion}
             */
            sideReg2: null,
            /**
             * `INTERNAL`
             * <br> `REALIZED`
             * @override
             * @memberof BLK_heatSource
             * @instance
             * @type {boolean}
             */
            skipHeatFetch: true,
            /**
             * `INTERNAL`
             * <br> `REALIZED`
             * @override
             * @memberof BLK_heatSource
             * @instance
             * @type {boolean}
             */
            skipHeatTrans: true,


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
         * @class B_heatSource
         * @extends B_baseHeatBlock
         */
        newClass()
        .extendClass(PARENT[1], "B_heatSource")
        .initTemplate()
        .setParent("Wall.WallBuild")
        .setParam({


            /* <------------------------------ internal ------------------------------> */


            /**
             * `INTERNAL`: Target temperature.
             * @memberof B_heatSource
             * @instance
             * @type {number}
             */
            tempSet: 0.0,


        })
        .setMethod({


            config: function() {
                return this.tempSet.toF();
            }
            .setProp({
                noSuper: true,
                override: true,
            }),


            buildConfiguration: function(tb) {
                comp_buildConfiguration(this, tb);
            }
            .setProp({
                noSuper: true,
            }),


            draw: function() {
                comp_draw(this);
            }
            .setProp({
                noSuper: true,
            }),


            write: function(wr) {
                wr.f(this.delegee.tempSet);
            },


            read: function(rd, revi) {
                if(this.delegee.LCRevi === 5) {
                    rd.s();
                };
                this.delegee.tempSet = rd.f();
            },


            /**
             * `REALIZED`
             * @override
             * @memberof B_heatSource
             * @instance
             * @func
             * @return {number}
             */
            ex_calcTempTarget: function() {
                return this.delegee.tempSet;
            }
            .setProp({
                noSuper: true,
                override: true,
            }),


            /**
             * `REALIZED`
             * @memberof B_heatSource
             * @instance
             * @func
             * @return {number}
             * @lovecAttached
             */
            ex_getHeatProd: function() {
                return this.delegee.tempCur;
            }
            .setProp({
                noSuper: true,
            }),


            /**
             * `REALIZED`
             * @override
             * @memberof B_heatSource
             * @instance
             * @func
             * @return {number}
             */
            ex_getHeatFrac: function() {
                return this.delegee.tempSet < 0.0001 ? 0.0 : Mathf.clamp(this.delegee.tempCur / this.delegee.tempSet);
            }
            .setProp({
                noSuper: true,
                override: true,
            }),


            /**
             * `REALIZED`
             * @override
             * @memberof B_heatSource
             * @instance
             * @func
             * @return {number}
             */
            ex_calcHeatSupplied: function() {
                return this.delegee.tempCur;
            }
            .setProp({
                noSuper: true,
                override: true,
            }),


        }),


    ];
