/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = require("lovec/temp/blk/BLK_baseFluidDistributor");


  /* <---------- component ----------> */


  function comp_init(blk) {
    if(blk.overwriteVanillaProp) {
      if(blk.size === 1) {
        blk.solid = false;
        blk.underBullets = true;
      };
    };

    if(blk.fldType === "liquid") blk.noPresExplode = true;
    if(!blk.noPresExplode) {
      blk.presExploRad = FRAG_attack._presExploRad(blk.size);
      blk.presExploDmg = FRAG_attack._presExploDmg(blk.size);
    };
  };


  function comp_setStats(blk) {
    if(!blk.noPresExplode) {
      blk.stats.add(fetchStat("lovec", "blk-canexplode"), true);
      blk.stats.add(fetchStat("lovec", "blk-explor"), blk.presExploRad / Vars.tilesize, StatUnit.blocks);
      blk.stats.add(fetchStat("lovec", "blk-explodmg"), blk.presExploDmg);
    };
  };


  function comp_drawPlace(blk, tx, ty, rot, valid) {
    if(!blk.noPresExplode) {
      MDL_draw._d_diskWarning(tx.toFCoord(blk.size), ty.toFCoord(blk.size), blk.presExploRad);
    };
  };


  function comp_onDestroyed(b) {
    if(b.block.delegee.noPresExplode) return;
    let liqCur = b.liquids.current();
    if(MDL_cond._isAuxiliaryFluid(liqCur) || (!liqCur.gas && !liqCur.willBoil())) return;
    let frac = b.liquids.get(liqCur) / b.block.liquidCapacity;
    if(frac < 0.01) return;

    FRAG_attack._a_explosion(
      b.x, b.y,
      b.block.delegee.presExploDmg * frac,
      b.block.delegee.presExploRad * frac,
      12.0 * frac,
    );
  };


  function comp_drawSelect(b) {
    if(!b.block.delegee.noPresExplode) {
      MDL_draw._d_diskWarning(b.x, b.y, b.block.delegee.presExploRad);
    };
  };


/*
  ========================================
  Section: Application
  ========================================
*/


  module.exports = [


    /**
     * Vanilla liquid router.
     * @class BLK_fluidRouter
     * @extends BLK_baseFluidDistributor
     */
    newClass().extendClass(PARENT[0], "BLK_fluidRouter").initClass()
    .setParent(LiquidRouter)
    .setTags("blk-liq", "blk-fcont")
    .setParam({


      /**
       * <PARAM>: If true, pressure explosion will be disabled.
       * @memberof BLK_fluidRouter
       * @instance
       */
      noPresExplode: false,


      /* <------------------------------ internal ------------------------------ */


      /**
       * <INTERNAL>
       * @memberof BLK_fluidRouter
       * @instance
       */
      presExploRad: 0.0,
      /**
       * <INTERNAL>
       * @memberof BLK_fluidRouter
       * @instance
       */
      presExploDmg: 0.0,


    })
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
     * @class B_fluidRouter
     * @extends B_baseFluidDistributor
     */
    newClass().extendClass(PARENT[1], "B_fluidRouter").initClass()
    .setParent(LiquidRouter.LiquidRouterBuild)
    .setParam({})
    .setMethod({


      onDestroyed: function() {
        comp_onDestroyed(this);
      },


      drawSelect: function() {
        comp_drawSelect(this);
      },


    }),


  ];
