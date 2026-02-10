/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * Parent of ground drills and wall drills.
   * ---------------------------------------- */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = require("lovec/temp/blk/BLK_baseMiner");
  const VARGEN = require("lovec/glb/GLB_varGen");


  const FRAG_faci = require("lovec/frag/FRAG_faci");


  const MDL_content = require("lovec/mdl/MDL_content");
  const MDL_event = require("lovec/mdl/MDL_event");
  const MDL_table = require("lovec/mdl/MDL_table");


  /* <---------- component ----------> */


  function comp_init(blk) {
    blk.group = BlockGroup.drills;

    if(blk.noSandOutput) {
      MDL_event._c_onLoad(() => {
        if(blk.blockedItems == null) blk.blockedItems = new Seq();
        blk.blockedItems.addAll(VARGEN.sandItms);
      });
    };

    blk.itmWhitelist = blk.itmWhitelist.map(nmItm => MDL_content._ct(nmItm, "rs")).pull(null);
  };


  function comp_setStats(blk) {
    if(blk.overwriteVanillaStat) {
      blk.stats.remove(Stat.drillTier);
      blk.stats.remove(Stat.drillSpeed);

      let drillSpd = FRAG_faci._drillSpd(blk, false);
      blk.stats.add(fetchStat("lovec", "blk0min-basedrillspd"), drillSpd, StatUnit.itemsSecond);
      let drillSpdBoost = FRAG_faci._drillSpd(blk, true);
      if(!drillSpdBoost.fEqual(drillSpd)) blk.stats.add(fetchStat("lovec", "blk0min-boosteddrillspd"), drillSpdBoost, StatUnit.itemsSecond);
      blk.stats.add(fetchStat("lovec", "blk0min-drilltier"), blk.tier);
    };

    if(blk.blockedItems != null && blk.blockedItems.size > 0) {
      blk.stats.add(fetchStat("lovec", "blk0min-blockeditms"), newStatValue(tb => {
        tb.row();
        MDL_table.setDisplay_ctLi(tb, blk.blockedItems.toArray());
      }));
    } else if(blk.itmWhitelist.length > 0) {
      blk.stats.add(fetchStat("lovec", "blk0min-alloweditms"), newStatValue(tb => {
        tb.row();
        MDL_table.setDisplay_ctLi(tb, blk.itmWhitelist);
      }));
    };
  };


/*
  ========================================
  Section: Application
  ========================================
*/


  module.exports = [


    // Block
    newClass().extendClass(PARENT[0], "BLK_baseDrill").initClass()
    .setParent(null)
    .setTags("blk-min", "blk-drl")
    .setParam({
      // @PARAM: Whether this drill cannot mine sand.
      noSandOutput: true,
      // @PARAM: Items that this drill can mine. Works only when {blk.blockedItems} is not used.
      itmWhitelist: prov(() => []),
    })
    .setMethod({


      init: function() {
        comp_init(this);
      },


      setStats: function() {
        comp_setStats(this);
      },


      ex_calcDropHardness: function(oblk, itm) {
        return tryJsProp(oblk, "dropHardness", itm.hardness) * tryJsProp(oblk, "dropHardnessMtp", 1.0);
      }
      .setProp({
        noSuper: true,
        argLen: 2,
      }),


    }),


    // Building
    newClass().extendClass(PARENT[1], "BLK_baseDrill").initClass()
    .setParent(null)
    .setParam({})
    .setMethod({}),


  ];
