/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = require("lovec/temp/blk/BLK_furnaceFactory");
  const INTF = require("lovec/temp/intf/INTF_BLK_pressureProducer");


  /* <---------- component ----------> */


  function comp_init(blk) {
    if(!blk.hasLiquids) ERROR_HANDLER.throw("noLiquidModule", blk.name);
    blk.exploFldTg = MDL_content._ct(blk.exploFldTg, "rs");
    blk.dryHeatFldTg = MDL_content._ct(blk.dryHeatFldTg, "rs");
    if(blk.dryHeatCancelThr < 0.0) blk.dryHeatCancelThr = blk.dryHeatThr * 0.5;
  };


  function comp_load(blk) {
    blk.flashReg = fetchRegionOrNull(blk, "-flash");
  };


  function comp_setStats(blk) {
    blk.stats.add(fetchStat("lovec", "blk-canexplode"), true);
    blk.stats.add(fetchStat("lovec", "blk-explor"), blk.exploRad / Vars.tilesize, StatUnit.blocks);
    blk.stats.add(fetchStat("lovec", "blk-explodmg"), blk.exploDmg);
  };


  function comp_setBars(blk) {
    blk.addBar("lovec-instab", b => new Bar(
      "bar.instability",
      Pal.sap,
      () => b.delegee.boilerInstab,
    ));
  };


  function comp_drawPlace(blk, tx, ty, rot, valid) {
    if(blk.exploDmg > 0.0) {
      MDL_draw._d_diskWarning(tx.toFCoord(blk.size), ty.toFCoord(blk.size), blk.exploRad);
    };
  };


  function comp_onDestroyed(b) {
    if(b.boilerInstab > b.block.delegee.hitExploMinInstab) {
      FRAG_attack._a_explosion(b.x, b.y, b.block.delegee.exploDmg, b.block.delegee.exploRad, b.block.delegee.exploShake);
    };
  };


  function comp_updateTile(b) {
    let
      cap = b.block.liquidCapacity,
      amtWater = b.block.delegee.dryHeatFldTg == null ? cap : b.liquids.get(b.block.delegee.dryHeatFldTg),
      amtSteam = b.block.delegee.exploFldTg == null ? 0.0 : b.liquids.get(b.block.delegee.exploFldTg),
      amtHeat = b.ex_getHeat();

    if(amtWater < 0.01 && amtHeat > b.block.delegee.dryHeatThr) {
      b.dryHeated = true;
    };
    if(amtHeat < b.block.delegee.dryHeatCancelThr) {
      b.dryHeated = false;
    };

    b.boilerInstab = Mathf.clamp(b.boilerInstab + (
      (b.dryHeated && amtWater > 0.1) || (amtSteam / cap > 0.9) ?
        b.block.delegee.boilerInstabIncRate :
        -b.block.delegee.boilerInstabIncRate
    ) * Time.delta);
    if(b.boilerInstab > 0.9999) {
      TRIGGER.boilerExplosion.fire(b);
      b.kill();
    };

    b.boilerInstabProg += b.boilerInstab * 3.0;
  };


  function comp_draw(b) {
    MDL_draw._reg_fadeProg(b.x, b.y, b.boilerInstabProg, b.block.delegee.flashReg, 0.0, 1.0, 1.0, Color.white, b.boilerInstab * 0.7);
  };


  function comp_drawSelect(b) {
    if(b.block.delegee.exploDmg > 0.0) {
      MDL_draw._d_diskWarning(b.x, b.y, b.block.delegee.exploRad);
    };
  };


/*
  ========================================
  Section: Application
  ========================================
*/


  module.exports = [


    /**
     * A crafter (reactor???) that explodes if dry-heated or full of steam.
     * @class BLK_boiler
     * @extends BLK_furnaceFactory
     * @extends INTF_BLK_pressureProducer
     */
    newClass().extendClass(PARENT[0], "BLK_boiler").implement(INTF[0]).initClass()
    .setParent(GenericCrafter)
    .setTags("blk-fac")
    .setParam({


      /**
       * <PARAM>: Explosion radius.
       * @memberof BLK_boiler
       * @instance
       */
      exploRad: 40.0,
      /**
       * <PARAM>: Explosion damage. Use 0.0 to disable explosion.
       * @memberof BLK_boiler
       * @instance
       */
      exploDmg: 3000.0,
      /**
       * <PARAM>: Explosion shake.
       * @memberof BLK_boiler
       * @instance
       */
      exploShake: 12.0,
      /**
       * <PARAM>: Minimum instability required for this boiler to explode when destroyed.
       * @memberof BLK_boiler
       * @instance
       */
      hitExploMinInstab: 0.3,
      /**
       * <PARAM>: Fluid that causes explosion if full, nullable.
       * @memberof BLK_boiler
       * @instance
       */
      exploFldTg: "loveclab-gas0int-steam-hp",
      /**
       * <PARAM>: Fluid that causes explosion if the boiler is dry-heated, nullable.
       * @memberof BLK_boiler
       * @instance
       */
      dryHeatFldTg: "loveclab-liq0ore-water",
      /**
       * <PARAM>: Temperature above which dry-heating can happen.
       * @memberof BLK_boiler
       * @instance
       */
      dryHeatThr: 100.0,
      /**
       * <PARAM>: Temperature below which the boiler exits dry-heated state, half of {@link BLK_boiler#dryHeatThr} by default.
       * @memberof BLK_boiler
       * @instance
       */
      dryHeatCancelThr: -1.0,
      /**
       * <PARAM>: Instability increase/decrease rate.
       * @memberof BLK_boiler
       * @instance
       */
      boilerInstabIncRate: 0.001,
      /**
       * <PARAM>: Most boilers only accept external heat. Set this to false if the boiler burns fuel items.
       * @override
       * @memberof BLK_boiler
       * @instance
       */
      noFuelInput: true,


      /* <------------------------------ internal ------------------------------ */


      /**
       * <INTERNAL>
       * @override
       * @memberof BLK_boiler
       * @instance
       */
      presFldType: "gas",
      /**
       * <INTERNAL>
       * @memberof BLK_boiler
       * @instance
       */
      shouldClearAuxOnStop: false,
      /**
       * <INTERNAL>
       * @memberof BLK_boiler
       * @instance
       */
      flashReg: null,


    })
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


      setBars: function() {
        comp_setBars(this);
      },


      drawPlace: function(tx, ty, rot, valid) {
        comp_drawPlace(this, tx, ty, rot, valid);
      },


    }),


    /**
     * @class B_boiler
     * @extends B_furnaceFactory
     * @extends INTF_B_pressureProducer
     */
    newClass().extendClass(PARENT[1], "B_boiler").implement(INTF[1]).initClass()
    .setParent(GenericCrafter.GenericCrafterBuild)
    .setParam({


      /* <------------------------------ internal ------------------------------ */


      /**
       * <INTERNAL>
       * @memberof B_boiler
       * @instance
       */
      boilerInstab: 0.0,
      /**
       * <INTERNAL>
       * @memberof B_boiler
       * @instance
       */
      boilerInstabProg: 0.0,
      /**
       * <INTERNAL>
       * @memberof B_boiler
       * @instance
       */
      dryHeated: false,


    })
    .setMethod({


      onDestroyed: function() {
        comp_onDestroyed(this);
      },


      updateTile: function() {
        comp_updateTile(this);
      },


      draw: function() {
        comp_draw(this);
      },


      drawSelect: function() {
        comp_drawSelect(this);
      },


      write: function(wr) {
        wr.f(this.boilerInstab);
        wr.bool(this.dryHeated);
      },


      read: function(rd, revi) {
        this.boilerInstab = rd.f();
        this.dryHeated = rd.bool();
      },


    }),


  ];
