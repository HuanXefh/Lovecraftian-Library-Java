/*
  ================================================================================
  Section: Definition
  ================================================================================
*/


    /* <------------------------------ import ------------------------------> */


    /**
     * @typedef {TemplateInstance<MessageBlock, BLK_messageBlock>} BLKMessageBlock
     */


    /**
     * @typedef {TemplateInstance<MessageBlock.MessageBuild, B_messageBlock>} BMessageBlock
     * @prop {BLKMessageBlock} block
     */


    const PARENT = require("lovec/temp/blk/BLK_baseLogicBlock");


    /* <------------------------------ component ------------------------------> */


/*
  ================================================================================
  Section: Application
  ================================================================================
*/


    module.exports = [


        /**
         * Vanilla message block.
         * @class BLK_messageBlock
         * @extends BLK_baseLogicBlock
         */
        newClass()
        .extendClass(PARENT[0], "BLK_messageBlock")
        .initTemplate()
        .setParent("MessageBlock")
        .setTags()
        .setParam({})
        .setMethod({}),


        /**
         * @class B_messageBlock
         * @extends B_baseLogicBlock
         */
        newClass()
        .extendClass(PARENT[1], "B_messageBlock")
        .initTemplate()
        .setParent("MessageBlock.MessageBuild")
        .setParam({})
        .setMethod({}),


    ];
