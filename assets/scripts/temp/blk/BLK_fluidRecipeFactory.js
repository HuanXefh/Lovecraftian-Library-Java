/*
  ========================================
  Section: Definition
  ========================================
*/


    /* <------------------------------ import ------------------------------> */


    /**
     * @typedef {TemplateInstance<GenericCrafter, BLK_fluidRecipeFactory>} BLKFluidRecipeFactory
     */


    /**
     * @typedef {TemplateInstance<GenericCrafter.GenericCrafterBuild, B_fluidRecipeFactory>} BFluidRecipeFactory
     * @prop {BLKFluidRecipeFactory} block
     */


    const PARENT = require("lovec/temp/blk/BLK_recipeFactory");
    const INTF_BLK_corrosionAcceptor = require("lovec/temp/intf/INTF_BLK_corrosionAcceptor");
    const INTF_BLK_fluidHeatAcceptor = require("lovec/temp/intf/INTF_BLK_fluidHeatAcceptor");


    /* <------------------------------ component ------------------------------> */


/*
  ========================================
  Section: Application
  ========================================
*/


    module.exports = [


        /**
         * Recipe factories with fluid block mechanics.
         * @class BLK_fluidRecipeFactory
         * @extends BLK_recipeFactory
         * @extends INTF_BLK_corrosionAcceptor
         * @extends INTF_BLK_fluidHeatAcceptor
         */
        newClass()
        .extendClass(PARENT[0], "BLK_fluidRecipeFactory")
        .implement(INTF_BLK_corrosionAcceptor[0])
        .implement(INTF_BLK_fluidHeatAcceptor[0])
        .initTemplate()
        .setParent(GenericCrafter)
        .setTags()
        .setParam({})
        .setMethod({}),


        /**
         * @class B_fluidRecipeFactory
         * @extends B_recipeFactory
         * @extends INTF_B_corrosionAcceptor
         * @extends INTF_B_fluidHeatAcceptor
         */
        newClass()
        .extendClass(PARENT[1], "B_fluidRecipeFactory")
        .implement(INTF_BLK_corrosionAcceptor[1])
        .implement(INTF_BLK_fluidHeatAcceptor[1])
        .initTemplate()
        .setParent(GenericCrafter.GenericCrafterBuild)
        .setParam({})
        .setMethod({


            updateTile: function() {
                // No super
            }
            .setProp({
                noSuper: true,
            }),


        }),


    ];
