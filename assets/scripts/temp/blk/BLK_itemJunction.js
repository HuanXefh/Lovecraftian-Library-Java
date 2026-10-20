/*
  ========================================
  Section: Definition
  ========================================
*/


    /* <------------------------------ import ------------------------------> */


    /**
     * @typedef {TemplateInstance<Junction, BLK_itemJunction>} BLKItemJunction
     */


    /**
     * @typedef {TemplateInstance<Junction.JunctionBuild, B_itemJunction>} BItemJunction
     * @prop {BLKItemJunction} block
     */


    const PARENT = require("lovec/temp/blk/BLK_baseItemGate");


    /* <------------------------------ component ------------------------------> */


/*
  ========================================
  Section: Application
  ========================================
*/


    module.exports = [


        /**
         * Vanilla item junction.
         * <br> `SINGLESIZE`
         * @class BLK_itemJunction
         * @extends BLK_baseItemGate
         */
        newClass()
        .extendClass(PARENT[0], "BLK_itemJunction")
        .initTemplate()
        .setParent("Junction")
        .setTags()
        .setParam({})
        .setMethod({}),


        /**
         * @class B_itemJunction
         * @extends B_baseItemGate
         */
        newClass()
        .extendClass(PARENT[1], "B_itemJunction")
        .initTemplate()
        .setParent("Junction.JunctionBuild")
        .setParam({})
        .setMethod({}),


    ];
