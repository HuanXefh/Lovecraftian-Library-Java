/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = require("lovec/temp/blk/BLK_baseItemDistributor");


  /* <---------- component ----------> */


  function comp_init(blk) {
    if(blk.overwriteVanillaProp) {
      blk.unloadable = true;
      blk.allowConfigInventory = true;
    };
  };


  function comp_setStats(blk) {
    blk.stats.add(Stat.range, blk.range, StatUnit.blocks);
  };


  function comp_updateTile(b) {
    if(TIMER.rsCur) b.lastRs = b.items.first();
  };


  function comp_acceptItem(b, b_f, itm) {
    b.lastRs = itm;
    return true;
  };


  function comp_drawSelect(b) {
    LCDraw.contentIcon(b.x, b.y, b.lastRs, b.block.size);
  };


/*
  ========================================
  Section: Application
  ========================================
*/


  module.exports = [


    /**
     * Simply item bridge.
     * <br> <SINGLESIZE>
     * @class BLK_conveyorBridge
     * @extends BLK_baseItemDistributor
     */
    newClass().extendClass(PARENT[0], "BLK_conveyorBridge").initClass()
    .setParent(ItemBridge)
    .setTags("blk-dis", "blk-brd")
    .setParam({})
    .setMethod({


      init: function() {
        comp_init(this);
      },


      setStats: function() {
        comp_setStats(this);
      },


      /**
       * @override
       * @memberof BLK_conveyorBridge
       * @instance
       * @return {boolean}
       */
      ex_isSingleSized: function() {
        return true;
      }
      .setProp({
        noSuper: true,
        override: true,
      }),


    }),


    /**
     * @class B_conveyorBridge
     * @extends B_baseItemDistributor
     */
    newClass().extendClass(PARENT[1], "B_conveyorBridge").initClass()
    .setParent(ItemBridge.ItemBridgeBuild)
    .setParam({


      /* <------------------------------ internal ------------------------------ */


      /**
       * <INTERNAL>
       * @memberof B_conveyorBridge
       * @instance
       */
      lastRs: null,


    })
    .setMethod({


      updateTile: function() {
        comp_updateTile(this);
      },


      acceptItem: function(b_f, itm) {
        return comp_acceptItem(this, b_f, itm);
      }
      .setProp({
        boolMode: "and",
      }),


      drawSelect: function() {
        comp_drawSelect(this);
      },


    }),


  ];
