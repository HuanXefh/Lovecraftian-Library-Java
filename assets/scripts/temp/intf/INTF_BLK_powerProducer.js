/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * Handles power production methods for non-generator blocks.
   * ---------------------------------------- */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const CLS_interface = require("lovec/cls/struct/CLS_interface");


  const MDL_cond = require("lovec/mdl/MDL_cond");


  /* <---------- component ----------> */


  function comp_init(blk) {
    if(blk.overwriteVanillaProp) {
      blk.consumesPower = false;
      blk.outputsPower = true;
      blk.conductivePower = true;
    };
  };


  function comp_setStats(blk) {
    blk.stats.add(Stat.basePowerGeneration, blk.powProd * 60.0, StatUnit.powerSecond);
  };


  function comp_setBars(blk) {
    if(!blk.hasPower) return;

    if(blk.showPowProdStat) blk.addBar("poweroutput", b => new Bar(
      prov(() => Core.bundle.format("bar.poweroutput", Strings.fixed(b.getPowerProduction() * 60.0 * tryProp(b.timeScale, b), 1))),
      prov(() => Pal.powerBar),
      () => b.delegee.powProdEff,
    ));

    if(blk.showPowBalanceStat) blk.addBar("power", b => new Bar(
      prov(() => Core.bundle.format("bar.powerbalance", (b.power.graph.getPowerBalance() >= 0.0 ? "+" : "") + (!isFinite(b.power.graph.getPowerBalance()) ? "-∞" : UI.formatAmount(b.power.graph.getPowerBalance() * 60.0)))),
      prov(() => Pal.powerBar),
      () => Mathf.clamp(b.power.graph.getLastPowerProduced() / b.power.graph.getLastPowerNeeded()),
    ));
  };


  function comp_getPowerProduction(b) {
    return !b.enabled || b.power == null ?
      0.0 :
      b.block.ex_calcPowProd(b) * Math.max(b.powProdEff, 0.0);
  };


  function comp_conductsTo(b, ob) {
    return !MDL_cond._isFluidConduit(ob.block);
  };


/*
  ========================================
  Section: Application
  ========================================
*/


  module.exports = [


    // Block
    new CLS_interface({


      __PARAM_OBJ_SETTER__: () => ({
        // @PARAM: Base power produced by this block.
        powProd: 0.0,
        // @PARAM: Whether to add power output stat.
        showPowProdStat: true,
        // @PARAM: Whether to add power balance stat.
        showPowBalanceStat: false,
      }),


      init: function() {
        comp_init(this);
      },


      setStats: function() {
        comp_setStats(this);
      },


      setBars: function() {
        comp_setBars(this);
      },


      ex_calcPowProd: function(b) {
        return this.powProd;
      }
      .setProp({
        noSuper: true,
        argLen: 1,
      }),


    }),


    // Building
    new CLS_interface({


      __PARAM_OBJ_SETTER__: () => ({
        powProdEff: 0.0,
      }),


      getPowerProduction: function() {
        return comp_getPowerProduction(this);
      }
      .setProp({
        noSuper: true,
      }),


      conductsTo: function(ob) {
        return comp_conductsTo(this, ob);
      }
      .setProp({
        boolMode: "and",
      }),


    }),


  ];
