/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = require("lovec/temp/blk/BLK_baseFactory");
  const INTF = require("lovec/temp/intf/INTF_BLK_recipeSelector");
  const INTF_A = require("lovec/temp/intf/INTF_BLK_recipeHandler");


  /* <---------- component ----------> */


  function comp_init(blk) {
    MOD_tmi._r_recipeFactory(blk, blk.rcMdl);
  };


  function comp_setStats(blk) {
    blk.stats.remove(Stat.output);
    blk.stats.remove(Stat.productionTime);
    blk.stats.add(Stat.productionTime, blk.craftTime / 60.0, StatUnit.seconds);
    blk.stats.add(fetchStat("lovec", "blk0fac-recipes"), newStatValue(tb => {
      tb.row();
      MDL_table._d_rc(tb, blk.rcMdl, blk);
      MDL_table.__btn(tb, MDL_bundle._term("lovec", "new-window"), () => {
        new CLS_window(
          "${1} (${2})".format(fetchStat("lovec", "blk0fac-recipes").localized(), blk.localizedName),
          tb1 => MDL_table._d_rc(tb1, blk.rcMdl, blk, true, true),
        ).add();
      }).row();
    }));

    if(!MDL_recipe._hasAnyOutput_pay(blk.rcMdl)) {
      blk.stats.remove(fetchStat("lovec", "blk0fac-payroom"));
    };
  };


/*
  ========================================
  Section: Application
  ========================================
*/


  module.exports = [


    /**
     * Lovec version of multi-crafter, the bedrock of Reindustrialization.
     * Only `ConsumePower` can be used, do not add any other consumers.
     * Recipe data should be set in {@link INTF_BLK_recipeHandler#rcMdl}.
     * @class BLK_recipeFactory
     * @extends BLK_baseFactory
     * @extends INTF_BLK_recipeSelector
     * @extends INTF_BLK_recipeHandler
     */
    newClass().extendClass(PARENT[0], "BLK_recipeFactory").implement(INTF[0]).implement(INTF_A[0]).initClass()
    .setParent(GenericCrafter)
    .setTags("blk-fac", "blk-rc0fac")
    .setParam({})
    .setMethod({


      init: function() {
        comp_init(this);
      },


      setStats: function() {
        comp_setStats(this);
      },


    }),


    /**
     * @class B_recipeFactory
     * @extends B_baseFactory
     * @extends INTF_B_recipeSelector
     * @extends INTF_B_recipeHandler
     */
    newClass().extendClass(PARENT[1], "B_recipeFactory").implement(INTF[1]).implement(INTF_A[1]).initClass()
    .setParent(GenericCrafter.GenericCrafterBuild)
    .setParam({})
    .setMethod({


      write: function(wr) {
        this.ex_processData(wr);
      },


      read: function(rd, revi) {
        if(this.LCRevi === 5) rd.s();

        this.ex_processData(rd);
      },


    }),


  ];
