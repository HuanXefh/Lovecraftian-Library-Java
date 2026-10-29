/*
  ================================================================================
  Section: Definition
  ================================================================================
*/


    /* <------------------------------ import ------------------------------> */


    /**
     * @typedef {TemplateInstance<GenericCrafter, EXT_BLK_recipeFactory>} EXTBLKRecipeFactory
     */


    /**
     * @typedef {TemplateInstance<GenericCrafter.GenericCrafterBuild, EXT_B_recipeFactory>} EXTBRecipeFactory
     * @prop {EXTBLKRecipeFactory} block
     */


    const PARENT = require("lovec/temp/blk/BLK_recipeFactory");
    const INTF_BLK_vanillaLikeBlock = require("lovec/temp/intf/INTF_BLK_vanillaLikeBlock");


    /* <------------------------------ component ------------------------------> */


/*
  ================================================================================
  Section: Application
  ================================================================================
*/


    module.exports = [


        /**
         * Variant of {@link BLK_recipeFactory} for other mods.
         * @class EXT_BLK_recipeFactory
         * @extends BLK_recipeFactory
         * @extends INTF_BLK_vanillaLikeBlock
         */
        newClass()
        .extendClass(PARENT[0], "EXT_BLK_recipeFactory")
        .implement(INTF_BLK_vanillaLikeBlock[0])
        .initTemplate()
        .setParent("GenericCrafter")
        .setParam({})
        .setMethod({}),


        /**
         * @class EXT_B_recipeFactory
         * @extends B_recipeFactory
         * @extends INTF_B_vanillaLikeBlock
         */
        newClass()
        .extendClass(PARENT[1], "EXT_B_recipeFactory")
        .implement(INTF_BLK_vanillaLikeBlock[1])
        .initTemplate()
        .setParent("GenericCrafter.GenericCrafterBuild")
        .setParam({})
        .setMethod({}),


    ];
