/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = require("lovec/temp/blk/BLK_baseGenerator");


  /* <---------- component ----------> */


  function comp_setBars(blk) {
    if(blk.genWarmupRate < 0.0) return;

    blk.addBar("lovec-warmup", b => new Bar(
      prov(() => Core.bundle.format("bar.lovec-bar-warmup-amt", b.delegee.genWarmup.perc())),
      prov(() => Pal.ammo),
      () => Mathf.clamp(b.delegee.genWarmup),
    ));
  };


  function comp_updateTile(b) {
    let rate = b.block.delegee.genWarmupRate;
    if(rate < 0.0) {
      b.genWarmup = 1.0;
    } else {
      b.genWarmup = b.efficiency > 0.9999 && b.power.status > 0.99 ?
        Mathf.approachDelta(b.genWarmup, 1.0, rate * b.timeScale) :
        Mathf.approachDelta(b.genWarmup, 0.0, rate * 5.0);
    };

    b.productionEfficiency = b.efficiency * b.efficiencyMultiplier;
    b.totalTime += b.delegee.warmup.call(b) * b.edelta();

    if(b.efficiency > 0.0 && Mathf.chanceDelta(b.block.effectChance * b.efficiency)) {
      b.block.generateEffect.at(b.x + Mathf.range(b.block.generateEffectRange), b.y + Mathf.range(b.block.generateEffectRange));
    };

    if(b.block.filterItem != null && b.efficiency > 0.0 && b.block.itemDurationMultipliers.size > 0 && b.block.filterItem.getConsumed(b) != null) {
      b.itemDurationMultiplier = b.block.itemDurationMultipliers.get(b.block.filterItem.getConsumed(b), 1.0);
    };
    if(b.items != null && b.efficiency > 0.0 && b.generateTime <= 0.0) {
      b.consume();
      b.block.consumeEffect.at(b.x + Mathf.range(b.block.generateEffectRange), b.y + Mathf.range(b.block.generateEffectRange));
      b.generateTime = 1.0;
    };
    if(b.block.outputLiquid != null) {
      let amt = Math.min(b.productionEfficiency * b.delta() * b.block.outputLiquid.amount, b.block.liquidCapacity - b.liquids.get(b.block.outputLiquid.liquid));
      b.liquids.add(b.block.outputLiquid.liquid, amt);
      b.dumpLiquid(b.block.outputLiquid.liquid);
      if(b.block.explodeOnFull && b.liquids.get(b.block.outputLiquid.liquid) > b.block.liquidCapacity - 0.01) {
        b.kill();
        Events.fire(new GeneratorPressureExplodeEvent(b));
      };
    };

    b.generateTime -= b.delta() / b.block.itemDuration / b.itemDurationMultiplier;
  };


/*
  ========================================
  Section: Application
  ========================================
*/


  module.exports = [


    /**
     * Vanilla {@link ConsumeGenerator} but has warmup like {@link ImpactReactor}.
     * @class BLK_consumeGenerator
     * @extends BLK_baseGenerator
     */
    newClass().extendClass(PARENT[0], "BLK_consumeGenerator").initClass()
    .setParent(ConsumeGenerator)
    .setTags("blk-pow", "blk-pow0gen")
    .setParam({


      /**
       * <PARAM>: Warmup rate for power generation. Set this to negative value to disable warmup mechanics.
       * @memberof BLK_consumeGenerator
       * @instance
       */
      genWarmupRate: -1.0,


    })
    .setParamAlias([
      "consEff", "consumeEffect", Fx.none,
    ])
    .setMethod({


      setBars: function() {
        comp_setBars(this);
      },


    }),


    /**
     * @class B_consumeGenerator
     * @extends B_baseGenerator
     */
    newClass().extendClass(PARENT[1], "B_consumeGenerator").initClass()
    .setParent(ConsumeGenerator.ConsumeGeneratorBuild)
    .setParam({


      /* <------------------------------ internal ------------------------------ */


      /**
       * <INTERNAL>
       * @memberof B_consumeGenerator
       * @instance
       */
      genWarmup: 0.0,


    })
    .setMethod({


      updateTile: function() {
        comp_updateTile(this);
      }
      .setProp({
        noSuper: true,
      }),


      getPowerProduction: function() {
        return !this.enabled ?
          0.0 :
          (this.block.powerProduction * this.productionEfficiency * this.genWarmup);
      }
      .setProp({
        noSuper: true,
      }),


      warmup: function() {
        return !this.enabled ?
          0.0 :
          (this.productionEfficiency * this.genWarmup);
      }
      .setProp({
        noSuper: true,
      }),


      write: function(wr) {
        this.ex_processData(wr);
        wr.f(this.genWarmup);
      },


      read: function(rd, revi) {
        if(this.LCRevi === 5) rd.s();

        this.ex_processData(rd);
        this.genWarmup = rd.f();
      },


      /**
       * @memberof B_consumeGenerator
       * @instance
       * @param {Writes|Reads} wr0rd
       * @return {void}
       */
      ex_processData: function(wr0rd) {
        // Do nothing
      }
      .setProp({
        noSuper: true,
      }),


    }),


  ];
