/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = require("lovec/temp/blk/BLK_recipeFactory");


  /* <---------- component ----------> */


/*
  ========================================
  Section: Application
  ========================================
*/


  module.exports = [


    /**
     * @class BLK_multiBlockRecipeFactory
     * @extends BLK_recipeFactory
     */
    newClass().extendClass(PARENT[0], "BLK_multiBlockRecipeFactory").initClass()
    .setParent(MultiBlockCrafter)
    .setTags()
    .setParam({


      /* <------------------------------ internal ------------------------------ */


      /**
       * `INTERNAL`
       * @override
       * @memberof BLK_multiBlockRecipeFactory
       * @instance
       */
      payInputSideFracMode: SideFracModes.ALL,
      /**
       * `INTERNAL`
       * @override
       * @memberof BLK_multiBlockRecipeFactory
       * @instance
       */
      payOutputSideFracMode: SideFracModes.ALL,


    })
    .setMethod({}),


    /**
     * @class B_multiBlockRecipeFactory
     * @extends B_recipeFactory
     */
    newClass().extendClass(PARENT[1], "B_multiBlockRecipeFactory").initClass()
    .setParent(MultiBlockCrafterBuild)
    .setParam({})
    .setMethod({


      updateTile: function thisFun() {
        this.updateLinkedBuilds();
        thisFun.funPrev.call(this);
      }
      .setProp({
        noSuper: true,
        override: true,
      }),


      /**
       * @override
       * @memberof B_multiBlockRecipeFactory
       * @instance
       * @return {void}
       */
      ex_showRcChangeEff: function() {
        this.linkedBuilds.each(ob => EFF.fadePlacePack[ob.block.size].at(ob));
      }
      .setProp({
        noSuper: true,
      })


    }),


  ];
