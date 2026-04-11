/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = require("lovec/temp/blk/BLK_basePowerBlock");


  /* <---------- auxiliary ----------> */


  const powProdScl = 1.1;


  /* <---------- component ----------> */


  function comp_init(blk) {
    blk.priority = VAR.prio_powTrans;

    if(isFinite(blk.maxPowProdAllowed)) {
      blk.maxPowProdAllowed *= powProdScl;
    };
  };


  function comp_setStats(blk) {
    if(blk.overwriteVanillaStat) {
      blk.stats.remove(Stat.powerUse);
      let powLoss = MDL_content._powConsAmt(blk);
      if(powLoss > 0.0) blk.stats.add(fetchStat("lovec", "blk0pow-powloss"), powLoss * 60.0, StatUnit.powerSecond);
    };

    if(isFinite(blk.maxPowProdAllowed)) blk.stats.add(fetchStat("lovec", "blk0pow-safepowlvl"), (blk.maxPowProdAllowed / powProdScl * 60.0).roundFixed(2), StatUnit.powerSecond);
  };


  function comp_setBars(blk) {
    if(!isFinite(blk.maxPowProdAllowed)) return;

    // Should be displayed last
    Core.app.post(() => {
      blk.addBar("lovec-power-transmitter-overdrive", b => new Bar(
        prov(() => Core.bundle.format("bar.lovec-bar-transmitter-overdrive-amt", b.ex_getTransmitterOverdriveFrac().perc())),
        prov(() => Tmp.c1.set(Pal.heal).lerp(Pal.remove, b.ex_getTransmitterOverdriveFrac())),
        () => 1.0,
      ));
    });
  };


  const comp_canPlaceOn = function thisFun(blk, t, team, rot) {
    if(blk.ignoreShortCircuitPlacement) return true;

    if(checkTupChange(thisFun.tmpTup, true, blk, t, team, rot)) {
      thisFun.tmpTup[4] = tryJsProp(blk, "canShortCircuit", false)
        && t.floor().liquidDrop != null
        && MDL_cond._isConductiveLiquid(t.floor().liquidDrop);
    };

    if(thisFun.tmpTup[4]) {
      MDL_draw._d_textPlace(blk, t.x, t.y, MDL_bundle._info("lovec", "text-short-circuit"), false);
      return false;
    };

    return true;
  }
  .setProp({
    tmpTup: [],
  });


  function comp_updateTile(b) {
    if(PARAM.updateDeepSuppressed || !isFinite(b.ex_getMaxPowProdAllowed())) return;

    let powProd = b.power.graph.getLastPowerProduced();
    if(TIMER.secHalf) {
      b.transmitterOverdriveFrac = Mathf.approach(b.transmitterOverdriveFrac, powProd > VAR.blk_powSourceStdProd ? 0.0 : Mathf.clamp(powProd / b.ex_getMaxPowProdAllowed()), 0.2);
    };
    if(b.transmitterOverdriveFrac < 1.0 || powProd > VAR.blk_powSourceStdProd) return;
    b.damagePierce(b.maxHealth * VAR.blk_shortCircuitDmgFrac / 60.0 * b.block.delegee.transmitterOverdriveDmgScl);
  };


/*
  ========================================
  Section: Application
  ========================================
*/


  module.exports = [


    /**
     * Any block that transmits power to other blocks.
     * Not placeable on conductive floor if vulnerable to short circuit by default.
     * @class BLK_basePowerTransmitter
     * @extends BLK_basePowerBlock
     */
    newClass().extendClass(PARENT[0], "BLK_basePowerTransmitter").initClass()
    .setParent(null)
    .setTags("blk-pow", "blk-pow0trans")
    .setParam({


      /**
       * <PARAM>: If true, placement won't be affected by short circuit.
       * @memberof BLK_basePowerTransmitter
       * @instance
       */
      ignoreShortCircuitPlacement: false,
      /**
       * <PARAM>: If power produced in the power graph is larger than this, the transmitter will get damaged.
       * @memberof BLK_basePowerTransmitter
       * @instance
       */
      maxPowProdAllowed: Infinity,
      /**
       * <PARAM>: Multiplier on transmitter overdrive damage.
       * @memberof BLK_basePowerTransmitter
       * @instance
       */
      transmitterOverdriveDmgScl: 1.0,


    })
    .setMethod({


      init: function() {
        comp_init(this);
      },


      setStats: function() {
        comp_setStats(this);
      },


      setBars: function() {
        comp_setBars(this);
      },


      canPlaceOn: function(t, team, rot) {
        return comp_canPlaceOn(this, t, team, rot);
      }
      .setProp({
        boolMode: "and",
      }),


    }),


    /**
     * @class B_basePowerTransmitter
     * @extends B_basePowerBlock
     */
    newClass().extendClass(PARENT[1], "B_basePowerTransmitter").initClass()
    .setParent(null)
    .setParam({


      /* <------------------------------ internal ------------------------------ */


      /**
       * <INTERNAL>
       * @memberof B_basePowerTransmitter
       * @instance
       */
      transmitterOverdriveFrac: 0.0,


    })
    .setMethod({


      updateTile: function() {
        comp_updateTile(this);
      },


      /**
       * @memberof B_basePowerTransmitter
       * @instance
       * @return {number}
       */
      ex_getMaxPowProdAllowed: function() {
        return this.block.delegee.maxPowProdAllowed;
      }
      .setProp({
        noSuper: true,
      }),


      /**
       * @memberof B_basePowerTransmitter
       * @instance
       * @return {number}
       */
      ex_getTransmitterOverdriveFrac: function() {
        return this.transmitterOverdriveFrac;
      }
      .setProp({
        noSuper: true,
      }),


    }),


  ];
