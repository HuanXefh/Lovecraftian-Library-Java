/*
  ================================================================================
  Section: Definition
  ================================================================================
*/


    /* <------------------------------ import ------------------------------> */


    /**
     * @typedef {TemplateInstance<Wall, BLK_partsBlock>} BLKPartsBlock
     */


    /**
     * @typedef {TemplateInstance<Wall.WallBuild, B_partsBlock>} BPartsBlock
     * @prop {BLKPartsBlock} block
     */


    const PARENT = require("lovec/temp/blk/BLK_materialBlock");


    /* <------------------------------ component ------------------------------> */


    /**
     * @private
     * @param {BLKPartsBlock} blk
     * @return {void}
     */
    function comp_init(blk) {
        blk.rebuildable = false;
        blk.placeablePlayer = false;
    };


/*
  ================================================================================
  Section: Application
  ================================================================================
*/


    module.exports = [


        /**
         * Blocks that are mostly treated as payloads.
         * Used mostly for recipes.
         * Cannot be built or placed.
         * @class BLK_partsBlock
         * @extends BLK_materialBlock
         */
        newClass()
        .extendClass(PARENT[0], "BLK_partsBlock")
        .initTemplate()
        .setParent("Wall")
        .setTags("blk-non-wall")
        .setParam({


            /* <------------------------------ vanilla ------------------------------> */


            databaseCategory: "lovec-material",
            databaseTag: "default",


        })
        .setMethod({


            init: function() {
                comp_init(this);
            },


            canPlaceOn: function(t, team, rot) {
                // Should never be placed by player, without this someone may build it using schematics
                return false;
            }
            .setProp({
                noSuper: true,
                override: true,
                final: true,
            }),


        }),


        /**
         * @class B_partsBlock
         * @extends B_materialBlock
         */
        newClass()
        .extendClass(PARENT[1], "B_partsBlock")
        .initTemplate()
        .setParent("Wall.WallBuild")
        .setParam({})
        .setMethod({}),


    ];
