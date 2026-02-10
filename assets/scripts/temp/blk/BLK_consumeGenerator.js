/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * Vanilla {ConsumeGenerator} but has warmup like {ImpactReactor}.
   * ---------------------------------------- */


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
  };


/*
  ========================================
  Section: Application
  ========================================
*/


  module.exports = [


    // Block
    newClass().extendClass(PARENT[0], "BLK_consumeGenerator").initClass()
    .setParent(ConsumeGenerator)
    .setTags("blk-pow", "blk-pow0gen")
    .setParam({
      // @PARAM: Warmup rate for power generation, just like impact reactor. Set this to negative value to disable warmup mechanics.
      genWarmupRate: -1.0,
    })
    .setParamAlias([
      "consEff", "consumeEffect", Fx.none,
    ])
    .setMethod({}),


    // Building
    newClass().extendClass(PARENT[1], "BLK_consumeGenerator").initClass()
    .setParent(ConsumeGenerator.ConsumeGeneratorBuild)
    .setParam({
      genWarmup: 0.0,
    })
    .setMethod({


      updateTile: function() {
        comp_updateTile(this);
      },


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
        let LCRevi = processRevision(wr);
        this.ex_processData(wr, LCRevi);
        wr.f(this.genWarmup);
      },


      read: function(rd, revi) {
        let LCRevi = processRevision(rd);
        this.ex_processData(rd, LCRevi);
        this.genWarmup = rd.f();
      },


      ex_processData: function(wr0rd, revi) {
        // Do nothing
      }
      .setProp({
        noSuper: true,
      }),


    }),


  ];
