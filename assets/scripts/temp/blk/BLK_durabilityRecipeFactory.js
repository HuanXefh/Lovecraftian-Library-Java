/*
  ========================================
  Section: Definition
  ========================================
*/


    /* <------------------------------ import ------------------------------> */


    /**
     * @typedef {TemplateInstance<GenericCrafter, BLK_durabilityRecipeFactory>} BLKDurabilityRecipeFactory
     */


    /**
     * @typedef {TemplateInstance<GenericCrafter.GenericCrafterBuild, B_durabilityRecipeFactory>} BDurabilityRecipeFactory
     * @prop {BLKDurabilityRecipeFactory} block
     */


    const PARENT = require("lovec/temp/blk/BLK_recipeFactory");
    const INTF_BLK_durabilityBlock = require("lovec/temp/intf/INTF_BLK_durabilityBlock");


    /* <------------------------------ component ------------------------------> */


    /**
     * @private
     * @param {BDurabilityRecipeFactory} b
     * @param {RecipeModule} rcMdl
     * @param {string} rcHeader
     * @return {void}
     */
    function comp_ex_loadRcParam(b, rcMdl, rcHeader) {
        b.delegee.blk$durabDecMtp = b.delegee.rc.durabDecMtp;
    };


/*
  ========================================
  Section: Application
  ========================================
*/


    module.exports = [


        /**
         * Recipe factories with durability.
         * @class BLK_durabilityRecipeFactory
         * @extends BLK_recipeFactory
         * @extends INTF_BLK_durabilityBlock
         */
        newClass()
        .extendClass(PARENT[0], "BLK_durabilityRecipeFactory")
        .implement(INTF_BLK_durabilityBlock[0])
        .initTemplate()
        .setParent(GenericCrafter)
        .setTags()
        .setParam({})
        .setMethod({}),


        /**
         * @class B_durabilityRecipeFactory
         * @extends B_recipeFactory
         * @extends INTF_B_durabilityBlock
         */
        newClass()
        .extendClass(PARENT[1], "B_durabilityRecipeFactory")
        .implement(INTF_BLK_durabilityBlock[1])
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


            /**
             * @memberof B_durabilityRecipeFactory
             * @instance
             * @func
             * @param {RecipeModule} rcMdl
             * @param {string} rcHeader
             * @return {void}
             */
            ex_loadRcParam: function(rcMdl, rcHeader) {
                comp_ex_loadRcParam(this, rcMdl, rcHeader);
            }
            .setProp({
                noSuper: true,
            }),


        }),


    ];
