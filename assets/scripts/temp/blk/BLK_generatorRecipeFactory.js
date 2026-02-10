/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * Recipe factories that generates power.
   * I won't add power generation to the base template, since generators have their template tags.
   * ---------------------------------------- */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = require("lovec/temp/blk/BLK_recipeFactory");
  const INTF = require("lovec/temp/intf/INTF_BLK_powerProducer");
  const INTF_A = require("lovec/temp/intf/INTF_BLK_explosionInducer");
  const VAR = require("lovec/glb/GLB_var");


  const MDL_recipe = require("lovec/mdl/MDL_recipe");


  /* <---------- component ----------> */


  function comp_init(blk) {
    blk.priority = VAR.prio_powGen;
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


    // Block
    newClass().extendClass(PARENT[0], "BLK_generatorRecipeFactory").implement(INTF[0]).implement(INTF_A[0]).initClass()
    .setParent(GenericCrafter)
    .setTags("blk-pow", "blk-pow0gen")
    .setParam({
      // @PARAM: Minimum warmup required to create explosion when destroyed.
      exploMinWarmup: Infinity,
    })
    .setMethod({


      init: function() {
        comp_init(this);
      },


      ex_calcPowProd: function(b) {
        return this.powProd * b.delegee.rcPowProdMtp;
      }
      .setProp({
        noSuper: true,
        override: true,
        argLen: 1,
      }),


    }),


    // Building
    newClass().extendClass(PARENT[1], "BLK_generatorRecipeFactory").implement(INTF[1]).implement(INTF_A[1]).initClass()
    .setParent(GenericCrafter.GenericCrafterBuild)
    .setParam({
      rcPowProdMtp: 1.0,
    })
    .setMethod({


      updateTile: function() {
        comp_updateTile(this);
      }
      .setProp({
        noSuper: true,
      }),


      ex_loadRcParam: function(rcMdl, rcHeader) {
        comp_ex_loadRcParam(this, rcMdl, rcHeader);
      }
      .setProp({
        noSuper: true,
      }),


      ex_shouldExplodeOnDestroyed: function() {
        return tryProp(this.warmup, this, 0.0) > this.block.delegee.exploMinWarmup;
      }
      .setProp({
        noSuper: true,
        override: true,
      }),


    }),


  ];
