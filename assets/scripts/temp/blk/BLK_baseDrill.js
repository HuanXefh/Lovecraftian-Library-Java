/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = require("lovec/temp/blk/BLK_baseMiner");


  /* <---------- component ----------> */


  function comp_init(blk) {
    blk.group = BlockGroup.drills;

    if(blk.noSandOutput) {
      MDL_event._c_onLoad(() => {
        if(blk.blockedItems == null) blk.blockedItems = new Seq();
        blk.blockedItems.addAll(VARGEN.sandItms);
      });
    };

    blk.itmWhitelist = blk.itmWhitelist.map(nmItm => MDL_content._ct(nmItm, "rs")).compact();

    MDL_event._c_onLoad(() => {
      Core.app.post(() => {
        if(blk.consumers.some(blkCons => instanceOfAny(blkCons, ConsumeItems, ConsumeItemFilter, ConsumeItemDynamic))) {
          throw new Error("Do not add item consumers to drills, they are not supported!");
        };
      });
    });
  };


  function comp_setStats(blk) {
    blk.stats.timePeriod = blk.drillCraftTime;

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
        MDL_table._l_ctLi(tb, blk.blockedItems.toArray());
      }));
    } else if(blk.itmWhitelist.length > 0) {
      blk.stats.add(fetchStat("lovec", "blk0min-alloweditms"), newStatValue(tb => {
        tb.row();
        MDL_table._l_ctLi(tb, blk.itmWhitelist);
      }));
    };
  };


  function comp_updateTile(b) {
    b.drillCraftProg += b.edelta();
    if(b.drillCraftProg >= b.block.delegee.drillCraftTime) {
      b.drillCraftProg %= b.block.delegee.drillCraftTime;
      // No you still can't use item consumers for drills, since they don't have separate item storage (hard-coded)
      // This is meant for `cons.trigger()` only
      b.consume();
    };
  };


/*
  ========================================
  Section: Application
  ========================================
*/


  module.exports = [


    /**
     * Parent of ground drills and wall drills.
     * @class BLK_baseDrill
     * @extends BLK_baseMiner
     */
    newClass().extendClass(PARENT[0], "BLK_baseDrill").initClass()
    .setParent(null)
    .setTags("blk-min", "blk-drl")
    .setParam({


      /**
       * <PARAM>: Another `drillTime` used to trigger consumers. Do not use item consumers!
       * @memberof BLK_baseDrill
       * @instance
       */
      drillCraftTime: 60.0,
      /**
       * <PARAM>: Whether this drill cannot mine sand.
       * @memberof BLK_baseDrill
       * @instance
       */
      noSandOutput: true,
      /**
       * <PARAM>: The only items that this drill can mine. Works only when `blockedItems` is not used.
       * @memberof BLK_baseDrill
       * @instance
       */
      itmWhitelist: prov(() => []),


    })
    .setMethod({


      init: function() {
        comp_init(this);
      },


      setStats: function() {
        comp_setStats(this);
      },


      /**
       * Gets final hardness of some item drop from some block.
       * @memberof BLK_baseDrill
       * @instance
       * @param {Block} oblk
       * @param {Item} itm
       * @return {number}
       */
      ex_calcDropHardness: function(oblk, itm) {
        return tryJsProp(oblk, "dropHardness", itm.hardness);
      }
      .setProp({
        noSuper: true,
        argLen: 2,
      }),


    }),


    /**
     * @class B_baseDrill
     * @extends B_baseMiner
     */
    newClass().extendClass(PARENT[1], "B_baseDrill").initClass()
    .setParent(null)
    .setParam({


      /* <------------------------------ internal ------------------------------ */


      /**
       * <INTERNAL>
       * @memberof B_baseDrill
       * @instance
       */
      drillCraftProg: 0.0,


    })
    .setMethod({


      created: function() {
        this.drillCraftProg = Mathf.random(this.block.delegee.drillCraftTime);
      },


      updateTile: function() {
        comp_updateTile(this);
      },


    }),


  ];
