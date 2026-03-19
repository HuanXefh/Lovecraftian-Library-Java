/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = require("lovec/temp/blk/BLK_recipeFactory");
  const INTF = require("lovec/temp/intf/INTF_BLK_electricFurnaceBlock");


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


    /**
     * {@link BLK_furnaceRecipeFactory} that consumes power instead of fuel.
     * @class BLK_electricFurnaceRecipeFactory
     * @extends BLK_recipeFactory
     * @extends INTF_BLK_electricFurnaceBlock
     */
    newClass().extendClass(PARENT[0], "BLK_electricFurnaceRecipeFactory").implement(INTF[0]).initClass()
    .setParent(GenericCrafter)
    .setTags("blk-fac", "blk-rc0fac", "blk-furn")
    .setParam({})
    .setMethod({


      init: function() {
        comp_init(this);
      },


    }),


    /**
     * @class B_electricFurnaceRecipeFactory
     * @extends B_recipeFactory
     * @extends INTF_B_electricFurnaceBlock
     */
    newClass().extendClass(PARENT[1], "B_electricFurnaceRecipeFactory").implement(INTF[1]).initClass()
    .setParent(GenericCrafter.GenericCrafterBuild)
    .setParam({


      /* <------------------------------ internal ------------------------------ */


      /**
       * <INTERNAL>
       * @memberof B_electricFurnaceRecipeFactory
       * @instance
       */
      tempReq: 0.0,
      /**
       * <INTERNAL>
       * @memberof B_electricFurnaceRecipeFactory
       * @instance
       */
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


      /**
       * @memberof B_electricFurnaceRecipeFactory
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
       * @memberof B_electricFurnaceRecipeFactory
       * @instance
       * @return {number}
       */
      ex_getHeatTg: function() {
        return this.tempReq;
      }
      .setProp({
        noSuper: true,
        override: true,
      }),


      /**
       * @override
       * @memberof B_electricFurnaceRecipeFactory
       * @instance
       * @return {number}
       */
      ex_getHeatAllowed: function() {
        return this.tempAllowed;
      }
      .setProp({
        noSuper: true,
        override: true,
      }),


      /**
       * @override
       * @memberof B_electricFurnaceRecipeFactory
       * @instance
       * @return {number}
       */
      ex_calcFailP: function thisFun() {
        return comp_ex_calcFailP(this) * thisFun.funPrev.call(this);
      }
      .setProp({
        noSuper: true,
        override: true,
      }),


    }),


  ];
