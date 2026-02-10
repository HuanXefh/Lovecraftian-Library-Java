/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * Vanilla wall crafter, but enhanced.
   * ---------------------------------------- */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = require("lovec/temp/blk/BLK_baseHarvester");
  const INTF = require("lovec/temp/intf/INTF_BLK_lootProducer");


  const MDL_draw = require("lovec/mdl/MDL_draw");
  const MDL_pos = require("lovec/mdl/MDL_pos");
  const MDL_table = require("lovec/mdl/MDL_table");


  /* <---------- component ----------> */


  function comp_setStats(blk) {
    blk.stats.remove(Stat.tiles);
    blk.stats.remove(Stat.affinities);

    blk.stats.add(fetchStat("lovec", "blk-attrreq"), newStatValue(tb => {
      tb.row();
      MDL_table.setDisplay_attr(tb, blk.attribute);
    }));
  };


  const comp_drawPlace = function thisFun(blk, tx, ty, rot, valid) {
    let t = Vars.world.tile(tx, ty);
    if(t == null) return;

    if(Array.someMismatch(thisFun.tmpTup, true, blk, t, rot)) {
      thisFun.tmpTup[3] = MDL_pos._tsRect(t, 5, blk.size, thisFun.tmpTup[3]);
    };

    thisFun.tmpTup[3].forEachFast(ot => {
      if(ot.block().attributes.get(blk.attribute) < 0.0001) return;
      MDL_draw._d_areaShrink(ot, 1, valid);
    });
  }
  .setProp({
    tmpTup: [],
  });


/*
  ========================================
  Section: Application
  ========================================
*/


  module.exports = [


    // Block
    newClass().extendClass(PARENT[0], "BLK_wallHarvester").implement(INTF[0]).initClass()
    .setParent(WallCrafter)
    .setTags("blk-min", "blk-harv")
    .setParam({
      // @PARAM: Whether this harvester outputs loot instead of items.
      shouldDropLoot: true,
    })
    .setParamAlias([
      "updateEff", "updateEffect", Fx.none,
      "updateEffP", "updateEffectChance", 0.02,
    ])
    .setMethod({


      setStats: function() {
        comp_setStats(this);
      },


      drawPlace: function(tx, ty, rot, valid) {
        comp_drawPlace(this, tx, ty, rot, valid);
      },


      ex_getCraftTime: function() {
        return this.drillTime;
      }
      .setProp({
        noSuper: true,
        override: true,
      }),


    }),


    // Building
    newClass().extendClass(PARENT[1], "BLK_wallHarvester").implement(INTF[1]).initClass()
    .setParent(WallCrafter.WallCrafterBuild)
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


      ex_shouldDropLoot: function() {
        return this.block.delegee.shouldDropLoot;
      }
      .setProp({
        noSuper: true,
        override: true,
      }),


      ex_getCraftTimeCur: function() {
        return this.time;
      }
      .setProp({
        noSuper: true,
        override: true,
      }),


    }),


  ];
