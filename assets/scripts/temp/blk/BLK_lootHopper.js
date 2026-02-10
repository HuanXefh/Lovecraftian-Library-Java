/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * Collects loot on top of the block.
   * ---------------------------------------- */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = require("lovec/temp/blk/BLK_baseLootBlock");


  const FRAG_item = require("lovec/frag/FRAG_item");


  const MDL_effect = require("lovec/mdl/MDL_effect");
  const MDL_pos = require("lovec/mdl/MDL_pos");


  /* <---------- component ----------> */


  function comp_init(blk) {
    resetBlockFlag(blk, []);

    if(blk.overwriteVanillaProp) {
      blk.solid = false;
      blk.underBullets = true;
    };

    blk.update = true;
  };


  function comp_setStats(blk) {
    if(blk.lootCallIntv >= 1.0) blk.stats.add(Stat.itemsMoved, blk.lootCallAmt / blk.lootCallIntv * 60.0, StatUnit.itemsSecond);
  };


  function comp_updateTile(b) {
    if(b.timer.get(b.block.timerDump, b.block.dumpTime / b.timeScale)) {
      b.dump();
    };
  };


  function comp_ex_updateLootTs(b) {
    MDL_pos._tsBuild(b, b.lootTs);
  };


  function comp_ex_lootCall(b, loots, amt) {
    let loot = loots.readRand();
    if(loot != null) {
      if(FRAG_item.takeLoot(b, loot, amt, true)) MDL_effect.showBetween_itemTransfer(loot.x, loot.y, b);
    };
  };


/*
  ========================================
  Section: Application
  ========================================
*/


  module.exports = [


    // Block
    newClass().extendClass(PARENT[0], "BLK_lootHopper").initClass()
    .setParent(StorageBlock)
    .setTags()
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
    newClass().extendClass(PARENT[1], "BLK_lootHopper").initClass()
    .setParent(StorageBlock.StorageBuild)
    .setParam({})
    .setMethod({


      updateTile: function() {
        comp_updateTile(this);
      },


      shouldAmbientSound: function() {
        return false;
      }
      .setProp({
        noSuper: true,
      }),


      ex_updateLootTs: function() {
        comp_ex_updateLootTs(this);
      }
      .setProp({
        noSuper: true,
        override: true,
      }),


      ex_lootCall: function(loots, amt) {
        comp_ex_lootCall(this, loots, amt);
      }
      .setProp({
        noSuper: true,
      }),


    }),


  ];
