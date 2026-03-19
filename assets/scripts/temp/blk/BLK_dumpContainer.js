/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = require("lovec/temp/blk/BLK_container");
  const INTF = require("lovec/temp/intf/INTF_BLK_contentMultiSelector");


  /* <---------- component ----------> */


  function comp_init(blk) {
    blk.update = true;
  };


  function comp_setStats(blk) {
    blk.stats.add(Stat.itemsMoved, 60.0 / blk.dumpTime, StatUnit.itemsSecond);
  };


  function comp_updateTile(b) {
    if(b.ctTgs.length === 0) return;

    let bSpd = MDL_entity._bSpd(b);
    if(bSpd > 0.0 && b.timerDump.get(b.block.dumpTime / Math.max(bSpd, 0.0001))) {
      b.dump(b.ctTgs.readRand());
    };
  };


  function comp_acceptItem(b, b_f, itm) {
    return b_f === b || !MDL_cond._isContainer(b_f.block);
  };


/*
  ========================================
  Section: Application
  ========================================
*/


  module.exports = [


    /**
     * Unlike vanilla container, this block can dump selected items actively.
     * The output speed is controlled by `dumpTime`.
     * @class BLK_dumpContainer
     * @extends BLK_container
     * @extends INTF_BLK_contentMultiSelector
     */
    newClass().extendClass(PARENT[0], "BLK_dumpContainer").implement(INTF[0]).initClass()
    .setParent(StorageBlock)
    .setTags("blk-cont")
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
     * @class B_dumpContainer
     * @extends B_container
     * @extends INTF_B_contentMultiSelector
     */
    newClass().extendClass(PARENT[1], "B_dumpContainer").implement(INTF[1]).initClass()
    .setParent(StorageBlock.StorageBuild)
    .setParam({


      /* <------------------------------ internal ------------------------------ */


      /**
       * <INTERNAL>
       * @memberof B_dumpContainer
       * @instance
       */
      timerDump: prov(() => new Interval(1)),


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


      write: function(wr) {
        this.ex_processData(wr);
      },


      read: function(rd, revi) {
        if(this.LCRevi === 5) rd.s();

        this.ex_processData(rd);
      },


    }),


  ];
