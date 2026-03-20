/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


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

    if(blk.showPowProdBar) blk.addBar("poweroutput", b => new Bar(
      prov(() => Core.bundle.format("bar.poweroutput", Strings.fixed(b.getPowerProduction() * 60.0 * tryProp(b.timeScale, b), 1))),
      prov(() => Pal.powerBar),
      () => b.delegee.powProdEff,
    ));

    if(blk.showPowBalanceBar) blk.addBar("power", b => new Bar(
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


    /**
     * Handles power production methods for non-generator blocks.
     * @class INTF_BLK_powerProducer
     */
    new CLS_interface("INTF_BLK_powerProducer", {


      __PARAM_OBJ_SETTER__: () => ({


        /**
         * <PARAM>: Base power production.
         * @memberof INTF_BLK_powerProducer
         * @instance
         */
        powProd: 0.0,
        /**
         * <PARAM>: Whether to add power output bar.
         * @memberof INTF_BLK_powerProducer
         * @instance
         */
        showPowProdBar: true,
        /**
         * <PARAM>: Whether to add power balance bar.
         * @memberof INTF_BLK_powerProducer
         * @instance
         */
        showPowBalanceBar: false,


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


      /**
       * Override this method for dynamic power production.
       * <br> <LATER>
       * @memberof INTF_BLK_powerProducer
       * @instance
       * @param {Building} b
       * @return {number}
       */
      ex_calcPowProd: function(b) {
        return this.powProd;
      }
      .setProp({
        noSuper: true,
        argLen: 1,
      }),


    }),


    /**
     * @class INTF_B_powerProducer
     */
    new CLS_interface("INTF_B_powerProducer", {


      __PARAM_OBJ_SETTER__: () => ({


        /* <------------------------------ internal ------------------------------ */


        /**
         * <INTERNAL>: Power production efficiency, affects output.
         * @memberof INTF_B_powerProducer
         * @instance
         */
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
