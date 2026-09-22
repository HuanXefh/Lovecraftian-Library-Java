/*
  ========================================
  Section: Definition
  ========================================
*/


    /* <------------------------------ meta ------------------------------> */


    /**
     * @typedef {TemplateInstance<Block, ENV_baseGrass>} ENVBaseGrass
     */


    const PARENT = require("lovec/temp/env/ENV_baseProp");


    /* <------------------------------ component ------------------------------> */


    /**
     * @private
     * @param {ENVBaseGrass} blk
     * @return {void}
     */
    function comp_init(blk) {
        blk.breakable = false;
        blk.unitMoveBreakable = false;
        blk.solid = false;
        blk.alwaysReplace = false;
        blk.floating = true;
        blk.placeableLiquid = true;

        // Bypass vanilla shadow due to hard-coded alpha value
        blk.hasShadow = false;
        blk.customShadow = true;

        if(!Vars.headless) {
            MDL_event.onLoad(() => {
                if(!blk.customShadowRegion.found()) LCLogHandler.log("noCustomShadowRegionFound", blk.name);
                if(blk.variantShadowRegions != null) {
                    let i = 0, iCap = blk.variantShadowRegions.iCap();
                    while(i < iCap) {
                        if(!blk.variantShadowRegions[i].found()) {
                            blk.variantShadowRegions[i] = blk.customShadowRegion;
                        };
                        i++;
                    };
                };
            });
        };
    };


    /**
     * @private
     * @param {ENVBaseGrass} blk
     * @param {Tile} t
     * @return {void}
     */
    function comp_drawBase(blk, t) {
        if(!blk.customShadowRegion.found()) return;
        processZ(Layer.block - 0.1);
        Draw.rect(blk.customShadowRegion, t.worldx(), t.worldy());
        processZ(null);
    };


/*
  ========================================
  Section: Application
  ========================================
*/


    /**
     * Parent of shorter plants. These props are part of map decoration and thus being unbreakable.
     * @class ENV_baseGrass
     * @extends ENV_baseProp
     */
    module.exports = newClass()
    .extendClass(PARENT, "ENV_baseGrass")
    .initTemplate()
    .setParent(null)
    .setTags()
    .setParam({})
    .setParamAlias([
        /**
         * `ALIAS`: `layer`.
         * @memberof ENV_baseGrass
         * @instance
         * @name layGrass
         * @type {number}
         */
        "layGrass", "layer", Layer.groundUnit - 1.2,
    ])
    .setMethod({


        init: function() {
            comp_init(this);
        },


        drawBase: function(t) {
            comp_drawBase(this, t);
        },


    });
