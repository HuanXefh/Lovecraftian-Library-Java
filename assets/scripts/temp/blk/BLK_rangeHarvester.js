/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * Attribute crafter with a rectangular range.
   * ---------------------------------------- */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = require("lovec/temp/blk/BLK_baseHarvester");
  const INTF = require("lovec/temp/intf/INTF_BLK_rangeAttributeBlock");
  const INTF_A = require("lovec/temp/intf/INTF_BLK_rangeDisplay");
  const INTF_B = require("lovec/temp/intf/INTF_BLK_lootProducer");


  const MDL_attr = require("lovec/mdl/MDL_attr");
  const MDL_draw = require("lovec/mdl/MDL_draw");
  const MDL_effect = require("lovec/mdl/MDL_effect");
  const MDL_pos = require("lovec/mdl/MDL_pos");
  const MDL_table = require("lovec/mdl/MDL_table");


  /* <---------- component ----------> */


  function comp_init(blk) {
    resetBlockFlag(blk, []);

    if(blk.overwriteVanillaProp) {
      blk.baseEfficiency = 0.0;
      blk.maxBoost = Number.n8;
    };

    blk.blkR = blk.attrR;

    blk.ex_addLogicGetter(LAccess.range, b => blk.blkR);
  };


  function comp_load(blk) {
    blk.craftSe = fetchSound(blk.craftSe);
  };


  function comp_setStats(blk) {
    blk.stats.add(Stat.range, blk.attrR, StatUnit.blocks);

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
      thisFun.tmpTup[3] = MDL_pos._tsRect(t, blk.attrR, blk.size).filter(ot => MDL_attr._sum_ts([ot], blk.attribute, blk.attrMode) > 0.0);
    };

    thisFun.tmpTup[3].forEachFast(ot => {
      MDL_draw._d_areaShrink(ot, blk.attrMode === "block" ? ot.block().size : 1, valid);
    });
  }
  .setProp({
    tmpTup: [],
  });


  function comp_craft(b) {
    MDL_effect.playAt(b.x, b.y, b.block.delegee.craftSe, Math.min(b.block.ambientSoundVolume * 2.0, 1.0), 1.0, 0.1);
  };


/*
  ========================================
  Section: Application
  ========================================
*/


  module.exports = [


    // Block
    newClass().extendClass(PARENT[0], "BLK_rangeHarvester").implement(INTF[0]).implement(INTF_A[0]).implement(INTF_B[0]).initClass()
    .setParent(AttributeCrafter)
    .setTags("blk-min", "blk-harv")
    .setParam({
      // @PARAM: See {BLK_wallHarvester}.
      shouldDropLoot: true,
      // @PARAM: See {BLK_baseFactory}.
      craftSe: Sounds.unset,
    })
    .setParamAlias([
      "craftEff", "craftEffect", Fx.none,
      "updateEff", "updateEffect", Fx.none,
      "updateEffP", "updateEffectChance", 0.02,
    ])
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


      drawPlace: function(tx, ty, rot, valid) {
        comp_drawPlace(this, tx, ty, rot, valid);
      },


      ex_getCraftTime: function() {
        return this.craftTime;
      }
      .setProp({
        noSuper: true,
        override: true,
      }),


    }),


    // Building
    newClass().extendClass(PARENT[1], "BLK_rangeHarvester").implement(INTF[1]).implement(INTF_A[1]).implement(INTF_B[1]).initClass()
    .setParent(AttributeCrafter.AttributeCrafterBuild)
    .setParam({})
    .setMethod({


      craft: function() {
        comp_craft(this);
      },


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
        return this.progress * this.block.craftTime;
      }
      .setProp({
        noSuper: true,
        override: true,
      }),


    }),


  ];
