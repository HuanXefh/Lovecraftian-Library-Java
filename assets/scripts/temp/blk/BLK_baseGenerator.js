/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = require("lovec/temp/blk/BLK_basePowerBlock");
  const INTF = require("lovec/temp/intf/INTF_BLK_facilityBlock");


  /* <---------- component ----------> */


  function comp_init(blk) {
    blk.priority = VAR.prio_powGen;

    if(blk.overwriteExploParam) {
      blk.explosionRadius = Math.round(FRAG_attack._presExploRad(blk.size) / Vars.tilesize);
      blk.explosionDamage = FRAG_attack._presExploDmg(blk.size);
      if(blk.explosionPuddleLiquid != null) {
        blk.explosionPuddles = Math.round(Mathf.lerp(5, 10, blk.size / 2));
        blk.explosionPuddleRange = blk.explosionRadius * 0.75;
        blk.explosionPuddleAmount = Mathf.lerp(50.0, 70.0, blk.size / 2);
      };
    };
  };


  function comp_setStats(blk) {
    if(blk.overwriteVanillaStat) {
      if(blk.explosionDamage > 0) {
        blk.stats.add(fetchStat("lovec", "blk-canexplode"), true);
        blk.stats.add(fetchStat("lovec", "blk-explor"), blk.explosionRadius, StatUnit.blocks);
        blk.stats.add(fetchStat("lovec", "blk-explodmg"), blk.explosionDamage);
        if(blk.explosionPuddleLiquid != null) blk.stats.add(fetchStat("lovec", "blk-exploliq"), StatValues.content([blk.explosionPuddleLiquid].toSeq()));
      };
    };
  };


  function comp_drawPlace(blk, tx, ty, rot, valid) {
    if(blk.explosionDamage > 0) {
      MDL_draw._d_diskWarning(tx.toFCoord(blk.size), ty.toFCoord(blk.size), blk.explosionRadius * Vars.tilesize);
    };
  };


  function comp_createExplosion(b) {
    FRAG_attack._a_shockwave(b.x, b.y, b.block.explosionRadius);
    FRAG_attack._a_impact(b.x, b.y, b.block.explosionDamage * 0.5, 480.0, b.block.explosionRadius * Vars.tilesize, 0.0, 0.0);
  };


  function comp_conductsTo(b, ob) {
    // Don't cause short circuit for pipes
    return !MDL_cond._isFluidConduit(ob.block);
  };


  function comp_drawSelect(b) {
    if(b.block.explosionDamage > 0) {
      MDL_draw._d_diskWarning(b.x, b.y, b.block.explosionRadius * Vars.tilesize);
    };
  };


/*
  ========================================
  Section: Application
  ========================================
*/


  module.exports = [


    /**
     * Blocks that produce power.
     * @class BLK_baseGenerator
     * @extends BLK_basePowerBlock
     * @extends INTF_BLK_facilityBlock
     */
    newClass().extendClass(PARENT[0], "BLK_baseGenerator").implement(INTF[0]).initClass()
    .setParent(null)
    .setTags("blk-pow", "blk-pow0gen")
    .setParam({


      /**
       * <PARAM>: Whether to overwrite explosion-related parameters with generated ones. Set this to false if the generator should not explode.
       * @memberof BLK_baseGenerator
       * @instance
       */
      overwriteExploParam: true,

      
    })
    .setParamAlias([
      "genEff", "generateEffect", Fx.none,
      "genEffP", "effectChance", 0.02,
      // Only used for `ConsumeGenerator`, I don't know why
      "genEffRad", "generateEffectRange", 3.0,
      "exploEff", "explodeEffect", Fx.none,
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
     * @class B_baseGenerator
     * @extends B_basePowerBlock
     * @extends INTF_B_facilityBlock
     */
    newClass().extendClass(PARENT[1], "B_baseGenerator").implement(INTF[1]).initClass()
    .setParent(null)
    .setParam({})
    .setMethod({


      createExplosion: function() {
        comp_createExplosion(this);
      },


      conductsTo: function(ob) {
        return comp_conductsTo(this, ob);
      }
      .setProp({
        boolMode: "and",
      }),


      drawSelect: function() {
        comp_drawSelect(this);
      },


    }),


  ];
