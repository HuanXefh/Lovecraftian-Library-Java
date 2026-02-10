/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * Multi-crafters that break your finger.
   * ---------------------------------------- */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = require("lovec/temp/blk/BLK_recipeFactory");
  const INTF = require("lovec/temp/intf/INTF_BLK_manualClickBlock");


  const MDL_table = require("lovec/mdl/MDL_table");
  const MDL_ui = require("lovec/mdl/MDL_ui");


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


    // Block
    newClass().extendClass(PARENT[0], "BLK_manualRecipeFactory").implement(INTF[0]).initClass()
    .setParent(GenericCrafter)
    .setTags("blk-fac")
    .setParam({
      skipTapConfig: true,
    })
    .setMethod({}),


    // Building
    newClass().extendClass(PARENT[1], "BLK_manualRecipeFactory").implement(INTF[1]).initClass()
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


      ex_getTimerEffcState: function() {
        return true;
      }
      .setProp({
        noSuper: true,
        override: true,
      }),


    }),


  ];
