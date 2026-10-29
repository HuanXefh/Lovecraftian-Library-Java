/*
  ================================================================================
  Section: Definition
  ================================================================================
*/


    /* <------------------------------ meta ------------------------------> */


    /**
     * @typedef {TemplateInstance<TallBlock, ENV_grassHeap>} ENVGrassHeap
     */


    const PARENT = require("lovec/temp/env/ENV_heap");
    const INTF_ENV_unitHider = require("lovec/temp/intf/INTF_ENV_unitHider");


    /* <------------------------------ component ------------------------------> */


    /**
     * @private
     * @param {ENVGrassHeap} blk
     * @return {void}
     */
    function comp_init(blk) {
        blk.solid = false;

        if(blk.delegee.grassRad < 0.0) {
            blk.delegee.grassRad = blk.size * Vars.tilesize * 0.5 + 2.0;
        };
    };


    /**
     * @private
     * @param {ENVGrassHeap} blk
     * @param {Tile} t
     * @return {void}
     */
    function comp_drawBase(blk, t) {
        SLCDrawf.tree(blk.region, blk.customShadowRegion, t, blk.size * Vars.tilesize * 1.2, blk.shadowOffset, 0.6, 0.6, 0.6, GLB_param.TREE_ALPHA, blk.delegee.layGrass + Mathf.randomSeed(t.pos(), 0.0, 0.015), GLB_param.SHOULD_DRAW_WOBBLE, GLB_param.SHOULD_CHECK_TREE_DISTANCE);
    };


/*
  ================================================================================
  Section: Application
  ================================================================================
*/


    /**
     * Wobbling tall block.
     * <br> `NAMEGEN`
     * @class ENV_grassHeap
     * @extends ENV_heap
     * @extends INTF_ENV_unitHider
     */
    module.exports = newClass()
    .extendClass(PARENT, "ENV_grassHeap")
    .implement(INTF_ENV_unitHider)
    .initTemplate()
    .setParent("TallBlock")
    .setTags("env-grass-tall")
    .setParam({


        /**
         * `PARAM`: See {@link ENV_baseTree}.
         * @memberof ENV_grassHeap
         * @instance
         * @type {number}
         */
        layGrass: 76.0,
        /**
         * `PARAM`: See {@link ENV_baseTree#treeRad}. Set automatically if negative.
         * @memberof ENV_grassHeap
         * @instance
         * @type {number}
         */
        grassRad: -1.0,


        /* <------------------------------ vanilla ------------------------------> */


        rotationRand: 30.0,


    })
    .setMethod({


        init: function() {
            comp_init(this);
        },


        drawBase: function(t) {
            comp_drawBase(this, t);
        }
        .setProp({
            noSuper: true,
        }),


        /**
         * `REALIZED`
         * @override
         * @memberof ENV_baseTree
         * @instance
         * @func
         * @param {number} tx
         * @param {number} ty
         * @return {number}
         */
        ex_getHideRad: function(tx, ty) {
            return this.delegee.grassRad;
        }
        .setProp({
            noSuper: true,
            override: true,
            argLen: 2,
        }),


    });
