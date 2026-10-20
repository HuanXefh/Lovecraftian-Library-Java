/*
  ========================================
  Section: Definition
  ========================================
*/


    /* <------------------------------ import ------------------------------> */


    /**
     * @typedef {TemplateInstance<Wall, BLK_materialBlock>} BLKMaterialBlock
     */


    /**
     * @typedef {TemplateInstance<Wall.WallBuild, B_materialBlock>} BMaterialBlock
     * @prop {BLKMaterialBlock} block
     */


    const PARENT = require("lovec/temp/blk/BLK_baseBlock");


    /* <------------------------------ component ------------------------------> */


    /**
     * @private
     * @param {BLKMaterialBlock} blk
     * @return {void}
     */
    function comp_init(blk) {
        blk.group = BlockGroup.walls;
        blk.priority = TargetPriority.wall;
    };


/*
  ========================================
  Section: Application
  ========================================
*/


    module.exports = [


        /**
         * Not a wall for defense but technically a wall.
         * Used as building material.
         * @class BLK_materialBlock
         * @extends BLK_baseBlock
         */
        newClass()
        .extendClass(PARENT[0], "BLK_materialBlock")
        .initTemplate()
        .setParent("Wall")
        .setTags("blk-non-wall")
        .setParam({})
        .setMethod({


            init: function() {
                comp_init(this);
            },


        }),


        /**
         * @class B_materialBlock
         * @extends B_baseBlock
         */
        newClass()
        .extendClass(PARENT[1], "B_materialBlock")
        .initTemplate()
        .setParent("Wall.WallBuild")
        .setParam({})
        .setMethod({}),


    ];
