/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * {BLK_furnaceRecipeFactory} that consumes power instead of fuel.
   * ---------------------------------------- */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = require("lovec/temp/blk/BLK_recipeFactory");
  const INTF = require("lovec/temp/intf/INTF_BLK_electricFurnaceBlock");


  const MDL_recipe = require("lovec/mdl/MDL_recipe");


  /* <---------- component ----------> */


  function comp_init(blk) {
    blk.ex_addConfigCaller("tempSet", (b, val) => b.delegee.tempSet = val);
  };


  function comp_ex_loadRcParam(b, rcMdl, rcHeader) {
    b.tempReq = MDL_recipe._tempReq(rcMdl, rcHeader);
    b.tempAllowed = MDL_recipe._tempAllowed(rcMdl, rcHeader);
  };


  function comp_ex_calcFailP(b) {
    let frac = Mathf.clamp(Math.min(
      Math.pow(b.tempCur / b.ex_getHeatTg(), 1.5),
      !isFinite(b.ex_getHeatAllowed()) ? Infinity : (b.ex_getHeatAllowed() - 2.0 * b.tempCur) / b.ex_getHeatAllowed() + 2.0,
    ));

    return frac < 0.1 ?
      0.0 :
      frac;
  };


/*
  ========================================
  Section: Application
  ========================================
*/


  module.exports = [


    // Block
    newClass().extendClass(PARENT[0], "BLK_electricFurnaceRecipeFactory").implement(INTF[0]).initClass()
    .setParent(GenericCrafter)
    .setTags("blk-fac", "blk-rc0fac", "blk-furn")
    .setParam({})
    .setMethod({


      init: function() {
        comp_init(this);
      },


    }),


    // Building
    newClass().extendClass(PARENT[1], "BLK_electricFurnaceRecipeFactory").implement(INTF[1]).initClass()
    .setParent(GenericCrafter.GenericCrafterBuild)
    .setParam({
      tempReq: 0.0,
      tempAllowed: Infinity,
    })
    .setMethod({


      updateTile: function() {

      }
      .setProp({
        noSuper: true,
      }),


      config: function() {
        return packConfig({
          rcHeader: this.rcHeader,
          tempSet: this.tempSet,
        });
      }
      .setProp({
        noSuper: true,
        override: true,
      }),


      buildConfiguration: function(tb) {

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


      ex_getHeatTg: function() {
        return this.tempReq;
      }
      .setProp({
        noSuper: true,
        override: true,
      }),


      ex_getHeatAllowed: function() {
        return this.tempAllowed;
      }
      .setProp({
        noSuper: true,
        override: true,
      }),


      ex_calcFailP: function thisFun() {
        return comp_ex_calcFailP(this) * thisFun.funPrev.call(this);
      }
      .setProp({
        noSuper: true,
        override: true,
      }),


    }),


  ];
