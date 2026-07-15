/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = require("lovec/temp/blk/BLK_baseGenerator");


  /* <---------- component ----------> */


  function comp_init(blk) {
    blk.displayEfficiencyScale = 1.0 / Math.pow(blk.size, 2);
  };


  function comp_setStats(blk) {
    blk.stats.remove(blk.generationType);
    blk.stats.add(blk.generationType, blk.powerProduction * 60.0, StatUnit.powerSecond);
    if(blk.outputLiquid != null) {
      blk.stats.replace(Stat.output, StatValues.liquid(blk.outputLiquid.liquid, blk.outputLiquid.amount * 60.0, true));
    };

    blk.stats.remove(Stat.tiles);
    blk.stats.remove(Stat.affinities);
    blk.stats.add(fetchStat("lovec", "blk-attrreq"), newStatValue(tb => {
      tb.row();
      MDL_table._d_attr(tb, blk.attribute, oblk => blk.attrFilterTup[0](blk, oblk));
    }));
  };


  function comp_canPlaceOn(blk, t, team, rot) {
    return blk.attrFilterTup[0](blk, t.floor());
  };


  function comp_updateTile(b) {
    if(TIMER.effc) {
      b.lastEffc = (b.sum + b.block.attribute.env()) * b.efficiency / Math.pow(b.block.size, 2);
    };

    b.lastWarmup = Mathf.approachDelta(b.lastWarmup, Mathf.num(b.lastEffc > 0.0), b.block.delegee.warmupRate);
    b.productionEfficiency = Mathf.approachDelta(b.productionEfficiency, b.lastEffc, b.block.delegee.warmupRate);
    b.attrGenItmProg += b.productionEfficiency * b.delta();
    b.attrGenTProg += b.productionEfficiency * b.delta();
    if(Mathf.chanceDelta(b.block.effectChance * b.productionEfficiency)) {
      MDL_effect.showAround(b.x, b.y, b.block.generateEffect, b.block.delegee.generateEffectRange, 0.0);
    };

    if(b.items != null && b.attrGenItmProg > b.block.delegee.attrGenItmDur) {
      b.attrGenItmProg %= b.block.delegee.attrGenItmDur;
      b.consume();
      MDL_effect.showAt(b.x, b.y, b.block.delegee.consEff, 0.0);
    };
    if(b.block.outputLiquid != null) {
      b.liquids.add(b.block.outputLiquid.liquid, Math.min(b.productionEfficiency * b.delta() * b.block.outputLiquid.amount, b.block.liquidCapacity - b.liquids.get(b.block.outputLiquid.liquid)));
      b.dumpLiquid(b.block.outputLiquid.liquid);
    };
  };


/*
  ========================================
  Section: Application
  ========================================
*/


  module.exports = [


    /**
     * Better {@link ThermalGenerator} with proper consumption functionality.
     * You don't need to scale everything by squared size here.
     * @class BLK_attributeGenerator
     * @extends BLK_baseGenerator
     */
    newClass().extendClass(PARENT[0], "BLK_attributeGenerator").initClass()
    .setParent(ThermalGenerator)
    .setTags()
    .setParam({


      /**
       * `PARAM`: How fast this generator warms up.
       * @memberof BLK_attributeGenerator
       * @instance
       */
      warmupRate: 0.008,
      /**
       * `PARAM`: Item duration.
       * @memberof BLK_attributeGenerator
       * @instance
       */
      attrGenItmDur: 120.0,
      /**
       * `PARAM`: Used to filter out valid blocks with matching attribute.
       * <br> `ARGS`: blk, oblk.
       * @memberof BLK_attributeGenerator
       * @instance
       */
      attrFilterTup: prov(() => [Function.airTrue]),
      /**
       * `PARAM`: Effect created when item is consumed.
       * @memberof BLK_attributeGenerator
       * @instance
       */
      consEff: Fx.none,


    })
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


      getDisplayedPowerProduction: function() {
        return this.powerProduction;
      }
      .setProp({
        noSuper: true,
        override: true,
      }),


      /**
       * @memberof BLK_attributeGenerator
       * @instance
       * @return {number}
       */
      ex_getRcDictOutputScl: function() {
        return 1.0 / Math.pow(this.size, 2);
      }
      .setProp({
        noSuper: true,
      }),


    }),


    /**
     * @class B_attributeGenerator
     * @extends B_baseGenerator
     */
    newClass().extendClass(PARENT[1], "B_attributeGenerator").initClass()
    .setParent(ThermalGenerator.ThermalGeneratorBuild)
    .setParam({


      /* <------------------------------ internal ------------------------------ */


      /**
       * `INTERNAL`
       * @memberof B_attributeGenerator
       * @instance
       */
      lastEffc: 0.0,
      /**
       * `INTERNAL`
       * @memberof B_attributeGenerator
       * @instance
       */
      lastWarmup: 0.0,
      /**
       * `INTERNAL`
       * @memberof B_attributeGenerator
       * @instance
       */
      attrGenItmProg: 0.0,
      /**
       * `INTERNAL`
       * @memberof B_attributeGenerator
       * @instance
       */
      attrGenTProg: 0.0,


    })
    .setMethod({


      updateTile: function() {
        comp_updateTile(this);
      }
      .setProp({
        noSuper: true,
      }),


      warmup: function() {
        // In vanilla case warmup can be over 1.0, which breaks drawers
        return this.lastWarmup;
      }
      .setProp({
        noSuper: true,
        override: true,
      }),


      totalProgress: function() {
        return this.attrGenTProg;
      }
      .setProp({
        noSuper: true,
        override: true,
      }),


    }),


  ];
