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
     * @param {PackContext} packer
     * @return {void}
     */
    function comp_createIcons(blk, packer) {
        if(blk instanceof OreBlock && packer.has(blk.name + "-large")) {
            let
                pixOri = packer.get(blk.name + "-large"),
                pix = pixOri.crop(),
                rawColor = Color.rgba8888(0.0, 0.0, 0.0, 0.3),
                x,
                y = 0;
            while(y < pix.height) {
                x = 0;
                while(x < pix.width) {
                    if(pixOri.getA(x, y) < 36 && pixOri.getA(x, y - 3) >= 36) {
                        pix.setRaw(x, y, rawColor);
                    };
                    x++;
                };
                y++;
            };
            SLCVersionResolver.isV8 ?
                packer.add(MultiPacker.PageType.environment, blk.name + "-large", pix) :
                packer.add(blk.name + "-large", pix);
            pix.dispose();
        };
    };


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
     * Parent of all mineable overlay blocks.
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


        createIcons: function(packer) {
            comp_createIcons(this, packer);
        },


        drawBase: function(t) {
            comp_drawBase(this, t);
        }
        .setProp({
            noSuper: true,
        }),


    });
