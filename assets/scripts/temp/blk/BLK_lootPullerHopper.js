/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = require("lovec/temp/blk/BLK_lootHopper");
  const INTF = require("lovec/temp/intf/INTF_BLK_radiusDisplay");


  /* <---------- component ----------> */


  function comp_init(blk) {
    blk.ex_addLogicGetter(LAccess.range, b => blk.blkRad / Vars.tilesize);
  };


  function comp_load(blk) {
    blk.glowReg = fetchRegionOrNull(blk, "-glow");
  };


  function comp_setStats(blk) {
    blk.stats.add(Stat.range, blk.blkRad / Vars.tilesize, StatUnit.blocks);
  };


  function comp_updateTile(b) {
    if(!b.isPulling) {
      b.progWait += b.edelta();
      if(b.progWait > b.block.delegee.intvPull) {
        b.progWait %= b.block.delegee.intvPull;
        MDL_pos._loots(b.x, b.y, b.block.delegee.blkRad, b.pullTgs).inSituFilter(loot => Mathf.dst(loot.x, loot.y, b.x, b.y) > b.block.size * 0.5 * Vars.tilesize);
        b.isPulling = b.pullTgs.length > 0;
      };
    } else {
      b.progPull += Time.delta;
      if(b.progPull > b.block.delegee.durPull) {
        b.progPull %= b.block.delegee.durPull;
        b.isPulling = false;
      } else {
        b.pullTgs.forEachFast(loot => {
          loot.impulse(Tmp.v2.set(loot).sub(b.x, b.y).nor().scl(-b.block.delegee.powPull * b.glowHeat));
        });
      };
    };

    b.glowHeat = Mathf.approachDelta(b.glowHeat, b.isPulling ? 1.0 : 0.0, b.isPulling ? 0.006 : 0.02);
  };


  function comp_draw(b) {
    MDL_draw._reg_fade(b.x, b.y, b.block.delegee.glowReg, 0.0, 1.0, 1.0, Color.white, b.glowHeat * 0.7);

    if(b.glowHeat > 0.01) {
      b.pullTgs.forEachFast(loot => {
        if(loot.added) MDL_draw._d_arrowLine(loot.x, loot.y, b.x, b.y, 2.0, 1.0, Color.white, 0.35 * b.glowHeat, VAR.layer.effFlr);
      });
    };
  };


/*
  ========================================
  Section: Application
  ========================================
*/


  module.exports = [


    /**
     * Loot hopper that actively pulls nearby loots towards it.
     * <br> Nah I won't do regular radius loot collector.
     * @class BLK_lootPullerHopper
     * @extends BLK_lootHopper
     * @extends INTF_BLK_radiusDisplay
     */
    newClass().extendClass(PARENT[0], "BLK_lootPullerHopper").implement(INTF[0]).initClass()
    .setParent(StorageBlock)
    .setTags()
    .setParam({


      /**
       * <PARAM>: Pull power.
       * @memberof BLK_lootPullerHopper
       * @instance
       */
      powPull: 8.0,
      /**
       * <PARAM>: Duration of each pull.
       * @memberof BLK_lootPullerHopper
       * @instance
       */
      durPull: 240.0,
      /**
       * <PARAM>: Duration between each pull.
       * @memberof BLK_lootPullerHopper
       * @instance
       */
      intvPull: 240.0,


      /* <------------------------------ internal ------------------------------ */


      /**
       * <INTERNAL>
       * @memberof BLK_lootPullerHopper
       * @instance
       */
      glowReg: null,


    })
    .setParamAlias([
      /**
       * <PARAM>: Maximum radius to pull.
       * @type {number} pullRad
       * @memberof BLK_lootPullerHopper
       * @instance
       */
      "pullRad", "blkRad", 5 * 8.0,
    ])
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


    }),


    /**
     * @class B_lootPullerHopper
     * @extends B_lootHopper
     * @extends INTF_B_radiusDisplay
     */
    newClass().extendClass(PARENT[1], "B_lootPullerHopper").implement(INTF[1]).initClass()
    .setParent(StorageBlock.StorageBuild)
    .setParam({


      /* <------------------------------ internal ------------------------------ */


      /**
       * <INTERNAL>
       * @memberof B_lootPullerHopper
       * @instance
       */
      isPulling: false,
      /**
       * <INTERNAL>
       * @memberof B_lootPullerHopper
       * @instance
       */
      pullTgs: prov(() => []),
      /**
       * <INTERNAL>
       * @memberof B_lootPullerHopper
       * @instance
       */
      progPull: 0.0,
      /**
       * <INTERNAL>
       * @memberof B_lootPullerHopper
       * @instance
       */
      progWait: 0.0,
      /**
       * <INTERNAL>
       * @memberof B_lootPullerHopper
       * @instance
       */
      glowHeat: 0.0,


    })
    .setMethod({


      updateTile: function() {
        comp_updateTile(this);
      },


      shouldAmbientSound: function() {
        return this.isPulling;
      }
      .setProp({
        noSuper: true,
        override: true,
      }),


      draw: function() {
        comp_draw(this);
      },


    }),


  ];
