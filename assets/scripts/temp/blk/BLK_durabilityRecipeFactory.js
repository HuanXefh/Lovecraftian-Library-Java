/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = require("lovec/temp/blk/BLK_recipeFactory");
  const INTF = require("lovec/temp/intf/INTF_BLK_durabilityBlock");


  /* <---------- component ----------> */


  function comp_ex_loadRcParam(b, rcMdl, rcHeader) {
    b.durabDecMtp = MDL_recipe._durabDecMtp(rcMdl, rcHeader);
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
    newClass().extendClass(PARENT[0], "BLK_durabilityRecipeFactory").implement(INTF[0]).initClass()
    .setParent(GenericCrafter)
    .setTags("blk-fac", "blk-rc0fac")
    .setParam({})
    .setMethod({}),


    /**
     * @class B_durabilityRecipeFactory
     * @extends B_recipeFactory
     * @extends INTF_B_durabilityBlock
     */
    newClass().extendClass(PARENT[1], "B_durabilityRecipeFactory").implement(INTF[1]).initClass()
    .setParent(GenericCrafter.GenericCrafterBuild)
    .setParam({})
    .setMethod({


      updateTile: function() {

      }
      .setProp({
        noSuper: true,
      }),


      /**
       * @memberof B_durabilityRecipeFactory
       * @instance
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
