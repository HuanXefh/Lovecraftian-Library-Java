/*
  ================================================================================
  Section: Definition
  ================================================================================
*/


    /* <------------------------------ import ------------------------------> */


    /**
     * @typedef {TemplateInstance<Block, BLK_basePayloadBlock>} BLKBasePayloadBlock
     */


    /**
     * @typedef {TemplateInstance<Building, B_basePayloadBlock>} BBasePayloadBlock
     * @prop {BLKBasePayloadBlock} block
     */


    const PARENT = require("lovec/temp/blk/BLK_baseBlock");


    /* <------------------------------ component ------------------------------> */


/*
  ================================================================================
  Section: Application
  ================================================================================
*/


    module.exports = [


        /**
         * Parent for all payload-related blocks.
         * The block itself does not need to interact with payload though, it's just a category for templates.
         * @class BLK_basePayloadBlock
         * @extends BLK_baseBlock
         */
        newClass()
        .extendClass(PARENT[0], "BLK_basePayloadBlock")
        .initTemplate()
        .setParent(null)
        .setTags()
        .setParam({})
        .setMethod({}),


        /**
         * @class B_basePayloadBlock
         * @extends B_baseBlock
         */
        newClass()
        .extendClass(PARENT[1], "B_basePayloadBlock")
        .initTemplate()
        .setParent(null)
        .setParam({})
        .setMethod({}),


    ];
