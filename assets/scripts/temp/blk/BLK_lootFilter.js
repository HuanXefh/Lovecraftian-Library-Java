/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = require("lovec/temp/blk/BLK_baseLootBlock");
  const INTF = require("lovec/temp/intf/INTF_BLK_contentSelector");


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
      MDL_effect._e_itemTransfer(loot.x, loot.y, b);
      MDL_effect._e_itemTransfer(b.x, b.y, b.lootDumpVec2);
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


    /**
     * Transports matching loots to the back side.
     * @class BLK_lootFilter
     * @extends BLK_baseLootBlock
     * @extends INTF_BLK_contentSelector
     */
    newClass().extendClass(PARENT[0], "BLK_lootFilter").implement(INTF[0]).initClass()
    .setParent(Wall)
    .setTags()
    .setParam({


      /* <------------------------------ internal ------------------------------ */


      /**
       * <INTERNAL>
       * @memberof BLK_lootFilter
       * @instance
       */
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


    /**
     * @class B_lootFilter
     * @extends B_baseLootBlock
     * @extends INTF_B_contentSelector
     */
    newClass().extendClass(PARENT[1], "B_lootFilter").implement(INTF[1]).initClass()
    .setParent(WallBlock.WallBuild)
    .setParam({


      /* <------------------------------ internal ------------------------------ */


      /**
       * <INTERNAL>
       * @memberof B_lootFilter
       * @instance
       */
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
        this.ex_processData(wr);
      },


      read: function(rd, revi) {
        this.ex_processData(rd);
      },


      /**
       * @override
       * @memberof B_lootFilter
       * @instance
       * @return {void}
       */
      ex_updateLootTs: function() {
        comp_ex_updateLootTs(this);
      }
      .setProp({
        noSuper: true,
        override: true,
      }),


      /**
       * @memberof B_lootFilter
       * @instance
       * @param {Array<Unit>} loots
       * @param {number} amt
       * @return {void}
       */
      ex_lootCall: function(loots, amt) {
        comp_ex_lootCall(this, loots, amt);
      }
      .setProp({
        noSuper: true,
      }),


    }),


  ];
