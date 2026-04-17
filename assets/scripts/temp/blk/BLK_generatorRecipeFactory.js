/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = require("lovec/temp/blk/BLK_recipeFactory");
  const INTF = require("lovec/temp/intf/INTF_BLK_powerProducer");
  const INTF_A = require("lovec/temp/intf/INTF_BLK_explosionInducer");


  /* <---------- component ----------> */


  function comp_init(blk) {
    blk.priority = VAR.priority.powGen;
  };


  function comp_updateTile(b) {
    b.powProdEff = Mathf.approachDelta(b.powProdEff, b.efficiency, 0.02);
  };


  function comp_ex_loadRcParam(b, rcMdl, rcHeader) {
    b.rcPowProdMtp = MDL_recipe._powProdMtp(rcMdl, rcHeader);
  };


/*
  ========================================
  Section: Application
  ========================================
*/


  module.exports = [


    /**
     * Recipe factories that generates power.
     * I won't merge power generation into {@link BLK_recipeFactory}, since generators have their template tags.
     * @class BLK_generatorRecipeFactory
     * @extends BLK_recipeFactory
     * @extends INTF_BLK_powerProducer
     * @extends INTF_BLK_explosionInducer
     */
    newClass().extendClass(PARENT[0], "BLK_generatorRecipeFactory").implement(INTF[0]).implement(INTF_A[0]).initClass()
    .setParent(GenericCrafter)
    .setTags("blk-pow", "blk-rc0fac", "blk-pow0gen")
    .setParam({


      /**
       * <PARAM>: Minimum warmup required to create explosion when destroyed.
       * @memberof BLK_generatorRecipeFactory
       * @instance
       */
      exploMinWarmup: Infinity,


    })
    .setMethod({


      init: function() {
        comp_init(this);
      },


      /**
       * @override
       * @memberof BLK_generatorRecipeFactory
       * @instance
       * @param {Building} b
       * @return {number}
       */
      ex_calcPowProd: function(b) {
        return this.powProd * b.delegee.rcPowProdMtp;
      }
      .setProp({
        noSuper: true,
        override: true,
        argLen: 1,
      }),


    }),


    /**
     * @class B_generatorRecipeFactory
     * @extends B_recipeFactory
     * @extends INTF_B_powerProducer
     * @extends INTF_B_explosionInducer
     */
    newClass().extendClass(PARENT[1], "B_generatorRecipeFactory").implement(INTF[1]).implement(INTF_A[1]).initClass()
    .setParent(GenericCrafter.GenericCrafterBuild)
    .setParam({


      /* <------------------------------ internal ------------------------------ */


      /**
       * <INTERNAL>
       * @memberof B_generatorRecipeFactory
       * @instance
       */
      rcPowProdMtp: 1.0,


    })
    .setMethod({


      updateTile: function() {
        comp_updateTile(this);
      }
      .setProp({
        noSuper: true,
      }),


      /**
       * @memberof B_generatorRecipeFactory
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


      /**
       * @override
       * @memberof B_generatorRecipeFactory
       * @instance
       * @return {boolean}
       */
      ex_shouldExplodeOnDestroyed: function() {
        return tryProp(this.warmup, this, 0.0) > this.block.delegee.exploMinWarmup;
      }
      .setProp({
        noSuper: true,
        override: true,
      }),


    }),


  ];
