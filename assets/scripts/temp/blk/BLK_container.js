/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * Unlike vanilla container, Lovec container can dump items when there are selected targets.
   * The output speed is controlled by {blk.dumpTime}.
   * ---------------------------------------- */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = require("lovec/temp/blk/BLK_baseStorageBlock");
  const INTF = require("lovec/temp/intf/INTF_BLK_contentMultiSelector");


  const MDL_cond = require("lovec/mdl/MDL_cond");
  const MDL_entity = require("lovec/mdl/MDL_entity");


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
    if(bSpd > 0.0 && b.timerDump.get(b.block.dumpTime / bSpd)) {
      b.dump(b.ctTgs.readRand());
    };
  };


  function comp_acceptItem(b, b_f, itm) {
    return b_f == null || !MDL_cond._isContainer(b_f.block);
  };


  function comp_warmup(b) {
    let amt = 0, typeAmt = 0;
    b.items.each(itm => {
      typeAmt++;
      amt += b.items.get(itm);
    });

    return typeAmt === 0 ?
      0.0 :
      amt / typeAmt / b.block.itemCapacity;
  };


/*
  ========================================
  Section: Application
  ========================================
*/


  module.exports = [


    // Block
    newClass().extendClass(PARENT[0]).implement(INTF[0]).initClass()
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


    // Building
    newClass().extendClass(PARENT[1]).implement(INTF[1]).initClass()
    .setParent(StorageBlock.StorageBuild)
    .setParam({
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


      warmup: function() {
        return comp_warmup(this);
      }
      .setProp({
        noSuper: true,
      }),


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
