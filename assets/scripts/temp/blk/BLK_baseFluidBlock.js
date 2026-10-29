/*
  ================================================================================
  Section: Definition
  ================================================================================
*/


    /* <------------------------------ import ------------------------------> */


    /**
     * @typedef {TemplateInstance<Block, BLK_baseFluidBlock>} BLKBaseFluidBlock
     */


    /**
     * @typedef {TemplateInstance<Building, B_baseFluidBlock>} BBaseFluidBlock
     * @prop {BLKBaseFluidBlock} block
     */


    const PARENT = require("lovec/temp/blk/BLK_baseBlock");


    /* <------------------------------ component ------------------------------> */


    /**
     * @private
     * @param {BLKBaseFluidBlock} blk
     * @return {void}
     */
    function comp_init(blk) {
        blk.group = BlockGroup.liquids;
    };


    /**
     * @private
     * @param {BBaseFluidBlock} b
     * @param {Building} b_f
     * @param {Liquid} liq
     * @return {boolean}
     */
    function comp_acceptLiquid(b, b_f, liq) {
        return !(!b.block.delegee.allowAux && MDL_cond.isAuxiliaryFluid(liq));
    };


/*
  ================================================================================
  Section: Application
  ================================================================================
*/


    module.exports = [


        /**
         * Base template for all fluid blocks.
         * Fluid blocks won't accept abstract fluids by default.
         * @class BLK_baseFluidBlock
         * @extends BLK_baseBlock
         */
        newClass()
        .extendClass(PARENT[0], "BLK_baseFluidBlock")
        .initTemplate()
        .setParent(null)
        .setTags()
        .setParam({


            /**
             * `PARAM`: Whether abstract fluid is allowed in this liquid block.
             * @memberof BLK_baseFluidBlock
             * @instance
             * @type {boolean}
             */
            allowAux: false,


        })
        .setMethod({


            init: function() {
                comp_init(this);
            },


        }),


        /**
         * @class B_baseFluidBlock
         * @extends B_baseBlock
         */
        newClass()
        .extendClass(PARENT[1], "B_baseFluidBlock")
        .initTemplate()
        .setParent(null)
        .setParam({})
        .setMethod({


            acceptLiquid: function(b_f, liq) {
                return comp_acceptLiquid(this, b_f, liq);
            }
            .setProp({
                boolMode: "and",
            }),


        }),


    ];
