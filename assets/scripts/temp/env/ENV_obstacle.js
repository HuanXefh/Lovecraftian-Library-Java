/*
  ========================================
  Section: Definition
  ========================================
*/


    /* <------------------------------ meta ------------------------------ */


    /**
     * @typedef {TemplateInstance<StaticProp, ENV_obstacle>} ENVObstacle
     */


    const PARENT = require("lovec/temp/env/ENV_baseProp");


    /* <------------------------------ component ------------------------------ */


    /**
     * @private
     * @param {ENVObstacle} blk
     * @return {void}
     */
    function comp_init(blk) {
        blk.solid = true;
        blk.breakable = false;
        blk.unitMoveBreakable = false;
        blk.alwaysReplace = false;
        blk.placeableLiquid = true;

        if(blk.customShadow) {
            MDL_event.onLoad(() => {
                if(!Vars.headless && !blk.customShadowRegion.found()) LCLogHandler.log("noCustomShadowRegionFound", blk.name);
            });
        };
    };


/*
  ========================================
  Section: Application
  ========================================
*/


    /**
     * Unbreakable props.
     * @class ENV_obstacle
     * @extends ENV_baseProp
     */
    module.exports = newClass()
    .extendClass(PARENT, "ENV_obstacle")
    .initTemplate()
    .setParent(StaticProp)
    .setTags()
    .setParam({})
    .setMethod({


        init: function() {
            comp_init(this);
        },


    });
