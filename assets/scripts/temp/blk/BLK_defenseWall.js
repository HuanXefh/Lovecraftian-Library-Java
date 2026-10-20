/*
  ========================================
  Section: Definition
  ========================================
*/


    /* <------------------------------ import ------------------------------> */


    /**
     * @typedef {TemplateInstance<Wall, BLK_defenseWall>} BLKDefenseWall
     */


    /**
     * @typedef {TemplateInstance<Wall.WallBuild, B_defenseWall>} BDefenseWall
     * @prop {BLKDefenseWall} block
     */


    const PARENT = require("lovec/temp/blk/BLK_materialBlock");


    /* <------------------------------ component ------------------------------> */


/*
  ========================================
  Section: Application
  ========================================
*/


    module.exports = [


        /**
         * Wall blocks that are used for defense.
         * @class BLK_defenseWall
         * @extends BLK_materialBlock
         */
        newClass()
        .extendClass(PARENT[0], "BLK_defenseWall")
        .initTemplate()
        .setParent(Wall)
        .setTags()
        .setParam({


            /* <------------------------------ vanilla ------------------------------> */


            flashHit: true,
            flashColor: Color.white,


        })
        .setMethod({}),


        /**
         * @class B_defenseWall
         * @extends B_materialBlock
         */
        newClass()
        .extendClass(PARENT[1], "B_defenseWall")
        .initTemplate()
        .setParent(Wall.WallBuild)
        .setParam({})
        .setMethod({}),


    ];
