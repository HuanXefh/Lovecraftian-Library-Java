/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = require("lovec/temp/blk/BLK_recipeFactory");
  const INTF = require("lovec/temp/intf/INTF_BLK_manualClickBlock");


  /* <---------- component ----------> */


  function comp_buildConfiguration(b, tb) {
    tb.row();
    tb.table(Styles.none, tb1 => {
      tb1.center();
      MDL_table.__btnCfg(tb1, b, () => {
        Vars.state.paused ?
          MDL_ui.show_fadeInfo("lovec", "paused-manual-click") :
          b.configure(true);
      }, Icon.crafting, 72.0);
    }).center();
  };


/*
  ========================================
  Section: Application
  ========================================
*/


  module.exports = [


    /**
     * Multi-crafters that break your finger.
     * @class BLK_manualRecipeFactory
     * @extends BLK_recipeFactory
     * @extends INTF_BLK_manualClickBlock
     */
    newClass().extendClass(PARENT[0], "BLK_manualRecipeFactory").implement(INTF[0]).initClass()
    .setParent(GenericCrafter)
    .setTags("blk-fac", "blk-rc0fac")
    .setParam({


      /* <------------------------------ internal ------------------------------ */


      /**
       * <INTERNAL>
       * @memberof BLK_manualRecipeFactory
       * @instance
       */
      skipTapConfig: true,


    })
    .setMethod({}),


    /**
     * @class B_manualRecipeFactory
     * @extends B_recipeFactory
     * @extends INTF_B_manualClickBlock
     */
    newClass().extendClass(PARENT[1], "B_manualRecipeFactory").implement(INTF[1]).initClass()
    .setParent(GenericCrafter.GenericCrafterBuild)
    .setParam({})
    .setMethod({


      updateTile: function() {

      }
      .setProp({
        noSuper: true,
      }),


      buildConfiguration: function thisFun(tb) {
        comp_buildConfiguration(this, tb);
      }
      .setProp({
        noSuper: true,
      }),


      /**
       * Manual factories should update their efficiency more frequently.
       * @override
       * @memberof B_manualRecipeFactory
       * @instance
       * @return {boolean}
       */
      ex_getTimerEffcState: function() {
        return true;
      }
      .setProp({
        noSuper: true,
        override: true,
      }),


    }),


  ];
