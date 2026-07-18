/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = require("lovec/temp/blk/BLK_baseFactory");


  /* <---------- component ----------> */


  function comp_init(blk) {
    blk.emitLight = true;
    blk.canPickup = false;
    if(blk.fogRadFrac > 0.0) {
      blk.flags.with(BlockFlag.hasFogRadius)
    };

    blk.ex_addLogicGetter(LAccess.range, b => blk.lightRad * b.delegee.lightWarmup / Vars.tilesize);
  };


  function comp_setStats(blk) {
    blk.stats.add(Stat.range, blk.lightRad / Vars.tilesize, StatUnit.blocks);
  };


  function comp_drawPlace(blk, tx, ty, rot, valid) {
    Drawf.dashCircle(tx.toFCoord(blk.size), ty.toFCoord(blk.size), blk.lightRad, valid ? Pal.accent : Pal.remove);
  };


  function comp_updateTile(b) {
    b.lightWarmup = Mathf.approachDelta(b.lightWarmup, Mathf.clamp(b.efficiency), 0.004);
    if(TIMER.secQuarter && b.block.delegee.fogRadFrac > 0.0) {
      b.fogRad = b.block.delegee.lightRad * b.block.delegee.fogRadFrac * b.lightWarmup / Vars.tilesize;
      if(!b.lastFogRad.fEqual(b.fogRad, 0.5)) {
        Vars.fogControl.forceUpdate(b.team, b);
        b.lastFogRad = b.fogRad;
      };
    };
  };


  function comp_drawSelect(b) {
    Drawf.dashCircle(b.x, b.y, b.block.delegee.lightRad * b.lightWarmup, Pal.accent);
  };


  function comp_drawLight(b) {
    LCDrawf.light(
      b.x, b.y, b.lightWarmup,
      b.block.delegee.lightRad * b.lightWarmup * 0.6,
      b.block.size, LCDrawf.lightColor,
      b.block.delegee.lightA * Interp.pow3In.apply(b.lightWarmup),
    );
  };


/*
  ========================================
  Section: Application
  ========================================
*/


  module.exports = [


    /**
     * Light block but actually a factory.
     * The range and lightness are determined by efficiency.
     * @class BLK_light
     * @extends BLK_baseFactory
     */
    newClass().extendClass(PARENT[0], "BLK_light").initClass()
    .setParent(GenericCrafter)
    .setTags("blk-non-fac")
    .setParam({


      /**
       * `PARAM`: Light radius of this block at efficiency of 1.0.
       * @memberof BLK_light
       * @instance
       */
      lightRad: 200.0,
      /**
       * `PARAM`: Lightness of this block.
       * @memberof BLK_light
       * @instance
       */
      lightA: 0.65,
      /**
       * `PARAM`: Fraction of light radius as fog radius. Uses static fog radius if not set.
       * @memberof BLK_light
       * @instance
       */
      fogRadFrac: 0.0,


    })
    .setParamParser([
      "lightRad", function(val) {
        this["lightClipSize"] = val * 3.0;
        return val;
      },
    ])
    .setMethod({


      init: function() {
        comp_init(this);
      },


      setStats: function() {
        comp_setStats(this);
      },


      drawPlace: function(tx, ty, rot, valid) {
        comp_drawPlace(this, tx, ty, rot, valid);
      },


    }),


    /**
     * @class B_light
     * @extends B_baseFactory
     */
    newClass().extendClass(PARENT[1], "B_light").initClass()
    .setParent(GenericCrafter.GenericCrafterBuild)
    .setParam({


      /* <------------------------------ internal ------------------------------ */


      /**
       * `INTERNAL`
       * @memberof B_light
       * @instance
       */
      lightWarmup: 0.0,
      /**
       * `INTERNAL`
       * @memberof B_light
       * @instance
       */
      fogRad: 0.0,
      /**
       * `INTERNAL`
       * @memberof B_light
       * @instance
       */
      lastFogRad: 0.0,


    })
    .setMethod({


      updateTile: function() {
        comp_updateTile(this);
      },


      warmup: function() {
        return this.lightWarmup;
      }
      .setProp({
        noSuper: true,
      }),


      fogRadius: function() {
        return this.block.delegee.fogRadFrac < 0.0001 ?
          this.block.fogRadius :
          this.fogRad;
      }
      .setProp({
        noSuper: true,
      }),


      drawSelect: function() {
        comp_drawSelect(this);
      },


      drawLight: function() {
        comp_drawLight(this);
      }
      .setProp({
        noSuper: true,
      }),


      write: function(wr) {
        this.ex_processData(wr);
        wr.f(this.lightWarmup);
      },


      read: function(rd, revi) {
        if(this.LCRevi === 5) rd.s();

        this.ex_processData(rd);
        this.lightWarmup = rd.f();
      },


      /**
       * @memberof B_light
       * @instance
       * @param {Writes|Reads} wr0rd
       * @return {void}
       */
      ex_processData: function(wr0rd) {
        // Do nothing
      }
      .setProp({
        noSuper: true,
        argLen: 1,
      }),


    }),


  ];
