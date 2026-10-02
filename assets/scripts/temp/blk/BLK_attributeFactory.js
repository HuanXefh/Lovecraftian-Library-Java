/*
  ========================================
  Section: Definition
  ========================================
*/


    /* <------------------------------ import ------------------------------> */


    /**
     * @typedef {TemplateInstance<AttributeCrafter, BLK_attributeFactory>} BLKAttributeFactory
     */


    /**
     * @typedef {TemplateInstance<AttributeCrafter.AttributeCrafterBuild, B_attributeFactory>} BAttributeFactory
     * @prop {BLKAttributeFactory} block
     */


    const PARENT = require("lovec/temp/blk/BLK_baseFactory");


    /* <------------------------------ component ------------------------------> */


/*
  ========================================
  Section: Application
  ========================================
*/


    module.exports = [


        /**
         * Vanilla attribute crafter.
         * <br> To be honest I don't like this as a pure factory.
         * @class BLK_attributeFactory
         * @extends BLK_baseFactory
         */
        newClass()
        .extendClass(PARENT[0], "BLK_attributeFactory")
        .initTemplate()
        .setParent(AttributeCrafter)
        .setTags()
        .setParam({})
        .setMethod({}),


        /**
         * @class B_attributeFactory
         * @extends B_baseFactory
         */
        newClass()
        .extendClass(PARENT[1], "B_attributeFactory")
        .initTemplate()
        .setParent(AttributeCrafter.AttributeCrafterBuild)
        .setParam({})
        .setMethod({}),


    ];
