/*
  ================================================================================
  Section: Definition
  ================================================================================
*/


    /* <------------------------------ import ------------------------------> */


    /**
     * @typedef {TemplateInstance<Block, BLK_baseMender>} BLKBaseMender
     */


    /**
     * @typedef {TemplateInstance<Building, B_baseMender>} BBaseMender
     * @prop {BLKBaseMender} block
     */


    const PARENT = require("lovec/temp/blk/BLK_baseProjector");


    /* <------------------------------ component ------------------------------> */


/*
  ================================================================================
  Section: Application
  ================================================================================
*/


    module.exports = [


        /**
         * Any block that can repair blocks and/or units.
         * @class BLK_baseMender
         * @extends BLK_baseProjector
         */
        newClass()
        .extendClass(PARENT[0], "BLK_baseMender")
        .initTemplate()
        .setParent(null)
        .setTags()
        .setParam({


            /* <------------------------------ vanilla ------------------------------> */


            suppressable: true,


        })
        .setMethod({}),


        /**
         * @class B_baseMender
         * @extends B_baseProjector
         */
        newClass()
        .extendClass(PARENT[1], "B_baseMender")
        .initTemplate()
        .setParent(null)
        .setParam({})
        .setMethod({}),


    ];
