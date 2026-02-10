/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * Transports matching loots to the back side.
   * ---------------------------------------- */


/*
  ========================================
  Section: Definition
  ========================================
*/


  // TODO: Test.


  /* <---------- import ----------> */


  const PARENT = require("lovec/temp/blk/BLK_baseLootBlock");
  const INTF = require("lovec/temp/intf/INTF_BLK_contentSelector");


  const MDL_call = require("lovec/mdl/MDL_call");
  const MDL_effect = require("lovec/mdl/MDL_effect");
  const MDL_pos = require("lovec/mdl/MDL_pos");


  /* <---------- component ----------> */


  function comp_init(blk) {
    resetBlockFlag(blk, []);
    blk.group = BlockGroup.none;
    blk.priority = TargetPriority.base;

    blk.rotate = true;
    blk.update = true;
  };


  function comp_load(blk) {
    blk.itemReg = fetchRegion(blk, "-item");
  };


  function comp_setStats(blk) {
    if(blk.lootCallIntv >= 1.0) blk.stats.add(Stat.itemsMoved, blk.lootCallAmt / blk.lootCallIntv * 60.0, StatUnit.itemsSecond);
  };


  function comp_onProximityUpdate(b) {
    let coords = MDL_pos._coordsBack(b.x, b.y, b.block.size, b.rotation);
    b.lootDumpVec2.set(coords[0], coords[1]);
  };


  function comp_pickedUp(b) {
    b.lootDumpVec2.set(-1.0, -1.0);
  };


  function comp_draw(b) {
    if(b.ctTg != null) {
      Draw.color(b.ctTg.color);
      Draw.rect(b.block.delegee.itemReg, b.x, b.y, b.drawrot());
      Draw.color();
    };
  };


  function comp_ex_updateLootTs(b) {
    MDL_pos._tsRot(b.tile, b.rotation, b.block.size, b.lootTs);
  };


  function comp_ex_lootCall(b, loots, amt) {
    let loot = loots.find(loot => loot.item() === b.ctTg);
    if(loot != null) {
      MDL_effect.showBetween_itemTransfer(loot.x, loot.y, b);
      MDL_effect.showBetween_itemTransfer(b.x, b.y, b.lootDumpVec2);
      if(loot.stack.amount <= amt) {
        loot.x = b.lootDumpVec2.x;
        loot.y = b.lootDumpVec2.y;
        loot.ex_resetLifetime();
      } else {
        MDL_call.spawnLoot_server(b.lootDumpVec2.x, b.lootDumpVec2.y, loot.item(), amt, 0.0);
        loot.stack.amount -= amt;
      };
    };
  };


/*
  ========================================
  Section: Application
  ========================================
*/


  module.exports = [


    // Block
    newClass().extendClass(PARENT[0], "BLK_lootFilter").implement(INTF[0]).initClass()
    .setParent(Wall)
    .setTags()
    .setParam({
      itemReg: null,
    })
    .setMethod({


      init: function() {
        comp_init(this);
      },


      load: function() {
        comp_load(this);
      },


      setStats: function() {
        comp_setStats(this);
      },


    }),


    // Building
    newClass().extendClass(PARENT[1], "BLK_lootFilter").implement(INTF[1]).initClass()
    .setParent(WallBlock.WallBuild)
    .setParam({
      lootDumpVec2: prov(() => new Vec2()),
    })
    .setMethod({


      onProximityUpdate: function() {
        comp_onProximityUpdate(this);
      },


      pickedUp: function() {
        comp_pickedUp(this);
      },


      draw: function() {
        comp_draw(this);
      },


      write: function(wr) {
        let LCRevi = processRevision(wr);
        this.ex_processData(wr, LCRevi);
      },


      read: function(rd, revi) {
        let LCRevi = processRevision(rd);
        this.ex_processData(rd, LCRevi);
      },


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
