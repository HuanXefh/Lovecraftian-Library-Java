/*
  ================================================================================
  Section: Definition
  ================================================================================
*/


    /* <------------------------------ import ------------------------------> */


    /**
     * @typedef {TemplateInstance<LiquidJunction, BLK_fluidValve>} BLKFluidValve
     */


    /**
     * @typedef {TemplateInstance<LiquidJunction.LiquidJunctionBuild, B_fluidValve>} BFluidValve
     * @prop {BLKFluidValve} block
     */


    const PARENT = require("lovec/temp/blk/BLK_fluidJunction");


    /* <------------------------------ component ------------------------------> */


    /**
     * @private
     * @param {BLKFluidValve} blk
     * @return {void}
     */
    function comp_init(blk) {
        blk.configurable = true;

        blk.config(JAVA.boolean, (b, bool) => {
            b.delegee.isOn = bool;
            MDL_sound.playAt(b.x, b.y, "SOUNDS: click");
            b.recache();
        });
    };


    /**
     * @private
     * @param {BLKFluidValve} blk
     * @return {void}
     */
    function comp_load(blk) {
        blk.delegee.onReg = fetchRegion(blk, "-on");
    };


    /**
     * @private
     * @param {BFluidValve} b
     * @param {Building} b_f
     * @param {Liquid} liq
     * @return {Building|null}
     */
    function comp_getLiquidDestination(b, b_f, liq) {
        return !b.enabled || b.delegee.isOn || MDL_cond.isAuxiliaryFluid(liq) ?
            b :
            b.super$getLiquidDestination(b_f, liq);
    };


    /**
     * @private
     * @param {BFluidValve} b
     * @return {boolean}
     */
    function comp_configTapped(b) {
        b.configure(!b.delegee.isOn);
        return false;
    };


    /**
     * @private
     * @param {BFluidValve} b
     * @return {void}
     */
    function comp_draw(b) {
        if(b.delegee.isOn) {
            Draw.rect(b.block.delegee.onReg, b.x, b.y, b.drawrot());
        };
    };


/*
  ================================================================================
  Section: Application
  ================================================================================
*/


    module.exports = [


        /**
         * Togglable liquid junction.
         * <br> `SINGLESIZE`
         * @class BLK_fluidValve
         * @extends BLK_fluidJunction
         */
        newClass()
        .extendClass(PARENT[0], "BLK_fluidValve")
        .initTemplate()
        .setParent("LiquidJunction")
        .setTags()
        .setParam({


            /* <------------------------------ internal ------------------------------> */


            /**
             * `INTERNAL`
             * @memberof BLK_fluidValve
             * @instance
             * @type {TextureRegion}
             */
            onReg: null,


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
         * @class B_fluidValve
         * @extends B_fluidJunction
         */
        newClass()
        .extendClass(PARENT[1], "B_fluidValve")
        .initTemplate()
        .setParent("LiquidJunction.LiquidJunctionBuild")
        .setParam({


            /* <------------------------------ internal ------------------------------> */


            /**
             * `INTERNAL`
             * @memberof B_fluidValve
             * @instance
             * @type {boolean}
             */
            isOn: false,


        })
        .setMethod({


            getLiquidDestination: function(b_f, liq) {
                return comp_getLiquidDestination(this, b_f, liq);
            }.setProp({
                noSuper: true,
                override: true,
            }),


            configTapped: function() {
                return comp_configTapped(this);
            }
            .setProp({
                noSuper: true,
            }),


            draw: function() {
                comp_draw(this);
            },


            write: function(wr) {
                wr.bool(this.delegee.isOn);
            },


            read: function(rd, revi) {
                if(this.delegee.LCRevi === 5) {
                    rd.s();
                };
                this.delegee.isOn = rd.bool();
            },


        }),


    ];
