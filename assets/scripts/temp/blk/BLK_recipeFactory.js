/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * Lovec version of multi-crafter, the bedrock of Reindustrialization.
   * ---------------------------------------- */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = require("lovec/temp/blk/BLK_baseFactory");
  const INTF = require("lovec/temp/intf/INTF_BLK_recipeSelector");
  const INTF_A = require("lovec/temp/intf/INTF_BLK_recipeHandler");


  const CLS_window = require("lovec/cls/ui/CLS_window");


  const MDL_bundle = require("lovec/mdl/MDL_bundle");
  const MDL_table = require("lovec/mdl/MDL_table");
  const MDL_ui = require("lovec/mdl/MDL_ui");


  const MOD_tmi = require("lovec/mod/MOD_tmi");


  /* <---------- component ----------> */


  function comp_init(blk) {
    MOD_tmi._r_recipe(blk, blk.rcMdl);
  };


  function comp_setStats(blk) {
    blk.stats.remove(Stat.output);
    blk.stats.remove(Stat.productionTime);
    blk.stats.add(Stat.productionTime, blk.craftTime / 60.0, StatUnit.seconds);
    blk.stats.add(fetchStat("lovec", "blk0fac-recipes"), newStatValue(tb => {
      tb.row();
      MDL_table.setDisplay_recipe(tb, blk.rcMdl, blk);
      MDL_table.__btn(tb, MDL_bundle._term("lovec", "new-window"), () => {
        if(Core.app.isMobile()) {
          MDL_ui.show_fadeInfo("lovec", "non-mobile");
          return;
        };

        new CLS_window(
          "[$1] ([$2])".format(fetchStat("lovec", "blk0fac-recipes").localized(), blk.localizedName),
          tb1 => MDL_table.setDisplay_recipe(tb1, blk.rcMdl, blk, true, true),
        ).add();
      }).row();
    }));
  };


/*
  ========================================
  Section: Application
  ========================================
*/


  module.exports = [


    // Block
    newClass().extendClass(PARENT[0]).implement(INTF[0]).implement(INTF_A[0]).initClass()
    .setParent(GenericCrafter)
    .setTags("blk-fac")
    .setParam({})
    .setMethod({


      init: function() {
        comp_init(this);
      },


      setStats: function() {
        comp_setStats(this);
      },


    }),


    // Building
    newClass().extendClass(PARENT[1]).implement(INTF[1]).implement(INTF_A[1]).initClass()
    .setParent(GenericCrafter.GenericCrafterBuild)
    .setParam({})
    .setMethod({


      write: function(wr) {
        let LCRevi = processRevision(wr);
        this.ex_processData(wr, LCRevi);
      },


      read: function(rd, revi) {
        let LCRevi = processRevision(rd);
        this.ex_processData(rd, LCRevi);
      },


    }),


  ];
