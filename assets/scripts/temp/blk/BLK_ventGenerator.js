/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * Generators built on vents. It checks vent size now since it's not strictly 3x3.
   * Consumers are supported.
   * You don't need to divide production amount by squared block size.
   * ---------------------------------------- */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = require("lovec/temp/blk/BLK_baseGenerator");
  const TIMER = require("lovec/glb/GLB_timer");


  const MDL_cond = require("lovec/mdl/MDL_cond");
  const MDL_effect = require("lovec/mdl/MDL_effect");
  const MDL_table = require("lovec/mdl/MDL_table");


  /* <---------- component ----------> */


  function comp_init(blk) {
    let sizeSqr = Math.pow(blk.size, 2);

    if(blk.overwriteVanillaProp) {
      blk.displayEfficiency = false;
      blk.displayEfficiencyScale = 1.0;
      blk.minEfficiency = sizeSqr - 0.0001;
    };
  };


  function comp_setStats(blk) {
    if(blk.outputLiquid != null) {
      blk.stats.replace(Stat.output, StatValues.liquid(blk.outputLiquid.liquid, blk.outputLiquid.amount * 60.0, true));
    };

    blk.stats.remove(Stat.tiles);
    blk.stats.remove(Stat.affinities);
    blk.stats.add(fetchStat("lovec", "blk-attrreq"), newStatValue(tb => {
      tb.row();
      MDL_table.setDisplay_attr(tb, blk.attribute, oblk => MDL_cond._isVentBlock(oblk) && oblk.delegee.ventSize === blk.size);
    }));
  };


  function comp_canPlaceOn(blk, t, team, rot) {
    return MDL_cond._isVentBlock(t.floor()) && t.floor().delegee.ventSize === blk.size;
  };


  function comp_updateTile(b) {
    if(TIMER.effc) {
      b.lastEffc = (b.sum + b.block.attribute.env()) * b.efficiency / Math.pow(b.block.size, 2);
    };

    b.lastWarmup = Mathf.approachDelta(b.lastWarmup, b.lastEffc > 0.0 ? 1.0 : 0.0, 0.008);
    b.productionEfficiency = Mathf.approachDelta(b.productionEfficiency, b.lastEffc, 0.008);
    b.tProg += b.productionEfficiency * b.delta() * b.warmup();
    if(Mathf.chanceDelta(b.block.effectChance * b.productionEfficiency)) {
      MDL_effect.showAround(b.x, b.y, b.block.generateEffect, 3.0, 0.0);
    };

    if(b.block.outputLiquid != null) {
      b.liquids.add(b.block.outputLiquid.liquid, Math.min(b.productionEfficiency * b.delta() * b.block.outputLiquid.amount, b.block.liquidCapacity - b.liquids.get(b.block.outputLiquid.liquid)));
      b.dumpLiquid(b.block.outputLiquid.liquid);
    };
  };


  function comp_warmup(b) {
    // Warmup can be over 1.0 in vanilla {ThermalGenerator}, which is bad
    return b.lastWarmup;
  };


  function comp_totalProgress(b) {
    return b.tProg;
  };


/*
  ========================================
  Section: Application
  ========================================
*/


  module.exports = [


    // Block
    newClass().extendClass(PARENT[0]).initClass()
    .setParent(ThermalGenerator)
    .setTags("blk-pow", "blk-pow0gen")
    .setParam({})
    .setMethod({


      init: function() {
        comp_init(this);
      },


      setStats: function() {
        comp_setStats(this);
      },


      canPlaceOn: function(t, team, rot) {
        return comp_canPlaceOn(this, t, team, rot);
      }
      .setProp({
        boolMode: "and",
      }),


      ex_getRcDictOutputScl: function() {
        return 1.0 / Math.pow(this.size, 2);
      }
      .setProp({
        noSuper: true,
      }),


    }),


    // Building
    newClass().extendClass(PARENT[1]).initClass()
    .setParent(ThermalGenerator.ThermalGeneratorBuild)
    .setParam({
      lastEffc: 0.0,
      lastWarmup: 0.0,
      tProg: 0.0,
    })
    .setMethod({


      updateTile: function() {
        comp_updateTile(this);
      }
      .setProp({
        noSuper: true,
      }),


      warmup: function() {
        return comp_warmup(this);
      }
      .setProp({
        noSuper: true,
      }),


      totalProgress: function() {
        return comp_totalProgress(this);
      }
      .setProp({
        noSuper: true,
      }),


    }),


  ];
