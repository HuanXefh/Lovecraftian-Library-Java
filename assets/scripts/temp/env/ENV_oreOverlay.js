/*
  ================================================================================
  Section: Definition
  ================================================================================
*/


    /* <------------------------------ meta ------------------------------> */


    /**
     * @typedef {TemplateInstance<Block, ENV_oreOverlay>} ENVOreOverlay
     */


    const PARENT = require("lovec/temp/env/ENV_baseOverlay");
    const INTF_ENV_largeBlock = require("lovec/temp/intf/INTF_ENV_largeBlock");


    /* <------------------------------ component ------------------------------> */


    /**
     * @private
     * @param {ENVOreOverlay} blk
     * @param {Tile} t
     * @return {void}
     */
    function comp_drawBase(blk, t) {
        if(!blk.self.ex_drawLarge(t.x, t.y)) {
            blk.super$drawBase(t);
        };
    };


/*
  ================================================================================
  Section: Application
  ================================================================================
*/


    /**
     * @class ENV_oreOverlay
     * @extends ENV_baseOverlay
     */
    module.exports = newClass()
    .extendClass(PARENT, "ENV_oreOverlay")
    .implement(INTF_ENV_largeBlock)
    .initTemplate()
    .setParent(null)
    .setTags()
    .setParam({})
    .setMethod({


        drawBase: function(t) {
            comp_drawBase(this, t);
        }
        .setProp({
            noSuper: true,
        }),


    });
