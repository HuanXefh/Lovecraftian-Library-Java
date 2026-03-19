/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = require("lovec/temp/blk/BLK_baseFactory");


  /* <---------- component ----------> */


  function comp_init(blk) {
    MDL_event._c_onLoad(() => {
      Core.app.post(() => {
        Vars.content.weathers().each(
          wea => wea instanceof RainWeather,
          wea => MDL_recipeDict.addFldProdTerm(blk, wea.liquid, blk.liqProdRate),
        );
      });
    });

    MOD_tmi._r_rainCollector(blk);
  };


  function comp_setStats(blk) {
    blk.stats.add(fetchStat("lovec", "blk0fac-prodspd"), blk.liqProdRate * 60.0, StatUnit.liquidSecond);
  };


  function comp_ex_findWeatherLiquid(blk) {
    let liq = null;
    if(PARAM.isCaveMap) return liq;

    Groups.weather.each(weaSta => weaSta.weather instanceof RainWeather, weaSta => liq = weaSta.weather.liquid);

    return liq;
  };


  const comp_updateTile = function thisFun(b) {
    if(TIMER.secFive) b.rsTg = b.block.ex_findWeatherLiquid();

    if(b.rsTg !== null) {
      FRAG_fluid.addLiquid(b, b, b.rsTg, b.block.delegee.liqProdRate, true);
      // Spill liquid if full
      if(b.efficiency > 0.0 && Mathf.chanceDelta(0.04) && b.liquids.get(b.rsTg) > b.block.liquidCapacity * 0.98) {
        MDL_pos._tsEdge(b.tile, b.block.size, true, thisFun.tmpTs).forEachFast(ot => {
          if(Mathf.chance(0.5)) Puddles.deposit(ot, b.rsTg, 4.0);
        });
      };

      b.dumpLiquid(b.rsTg, 2.0);
    };
  }
  .setProp({
    tmpTs: [],
  });


  function comp_displayBars(b, tb) {
    if(b.rsTg != null && b.block.outputLiquids != null && !b.block.outputLiquids.some(liqStack => liqStack.liquid === b.rsTg)) {
      tb.add(new Bar(
        b.rsTg.localizedName,
        tryVal(b.rsTg.barColor, b.rsTg.color),
        () => b.liquids.get(liq) / b.block.liquidCapacity,
      )).growX();
      tb.row();
    };
  };


/*
  ========================================
  Section: Application
  ========================================
*/


  module.exports = [


    /**
     * Dynamically outputs liquid based on current rain weather.
     * @class BLK_rainCollector
     * @extends BLK_baseFactory
     */
    newClass().extendClass(PARENT[0], "BLK_rainCollector").initClass()
    .setParent(GenericCrafter)
    .setTags("blk-fac")
    .setParam({


      /**
       * <PARAM>: Production rate for weather liquid output.
       * @memberof BLK_rainCollector
       * @instance
       */
      liqProdRate: 0.1,


    })
    .setMethod({


      init: function() {
        comp_init(this);
      },


      setStats: function() {
        comp_setStats(this);
      },


      /**
       * Gets liquid to produce.
       * @memberof BLK_rainCollector
       * @instance
       * @return {Liquid|null}
       */
      ex_findWeatherLiquid: function() {
        return comp_ex_findWeatherLiquid(this);
      }
      .setProp({
        noSuper: true,
      }),


    }),


    /**
     * @class B_rainCollector
     * @extends B_baseFactory
     */
    newClass().extendClass(PARENT[1], "B_rainCollector").initClass()
    .setParent(GenericCrafter.GenericCrafterBuild)
    .setParam({


      /* <------------------------------ internal ------------------------------ */


      /**
       * <INTERNAL>
       * @memberof B_rainCollector
       * @instance
       */
      rsTg: null,


    })
    .setMethod({


      updateTile: function() {
        comp_updateTile(this);
      },


      displayBars: function(tb) {
        comp_displayBars(this, tb);
      },


    }),


  ];
