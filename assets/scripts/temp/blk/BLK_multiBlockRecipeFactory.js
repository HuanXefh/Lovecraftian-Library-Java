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
     * Non-square multi-crafter.
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
    .setMethod({


      /**
       * @override
       * @memberof BLK_multiBlockRecipeFactory
       * @instance
       * @return {number}
       */
      ex_calcPayRoomDef: function() {
        this.calcMaxSize(Tmp.p1, this.size, 0);
        return Math.round((Tmp.p1.x + Tmp.p1.y) * 0.5);
      }
      .setProp({
        noSuper: true,
        override: true,
      }),


    }),


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


      shouldDrawStatus: function() {
        return this.block.enableDrawStatus;
      }
      .setProp({
        noSuper: true,
      }),


      drawStatus: function() {
        // Use Java class method instead
      }
      .setProp({
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
      }),


    }),


  ];
