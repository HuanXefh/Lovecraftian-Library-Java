/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = require("lovec/temp/blk/BLK_recipeFactory");


  /* <---------- component ----------> */


  function comp_updateTile(b) {
    if(b.isPayload()) return;

    if(!b.linkCreated) {
      b.linkEntities = b.block.setLinkBuild(b, b.block, b.tile, b.team, b.block.size, b.rotation);
      b.linkCreated = true;
      b.updateLinkProximity();
    };

    if(!b.linkValid) {
      b.linkEntities.each(ob => ob.kill());
      b.kill();
    };
  };


/*
  ========================================
  Section: Application
  ========================================
*/




  module.exports = [


    /**
     * Recipe factories using MultiBlockLib.
     * <br> <DEDICATION>: Supported by MultiBlockLib.
     * @class BLK_multiBlockLibRecipeFactory
     * @extends BLK_recipeFactory
     */
    newClass().extendClass(PARENT[0], "BLK_multiBlockLibRecipeFactory").initClass()
    .setParent(MOD_multiBlockLib.CLASSES.MultiBlockGenericCrafter)
    .setTags("blk-fac")
    .setParam({})
    .setMethod({}),


    /**
     * @class B_multiBlockLibRecipeFactory
     * @extends B_recipeFactory
     */
    newClass().extendClass(PARENT[1], "B_multiBlockLibRecipeFactory").initClass()
    .setParent(MOD_multiBlockLib.CLASSES.MultiBlockGenericCrafter.MultiBlockCrafterBuild)
    .setParam({})
    .setMethod({


      updateTile: function() {
        comp_updateTile(this);
      }
      .setProp({
        noSuper: true,
      }),


      /**
       * @override
       * @memberof B_multiBlockLibRecipeFactory
       * @instance
       * @return {void}
       */
      ex_showRcChangeEff: function() {
        this.linkEntities.each(ob => EFF.placeFadePack[ob.block.size].at(ob));
      }
      .setProp({
        noSuper: true,
      }),


    }),


  ];
