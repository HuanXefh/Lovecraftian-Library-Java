/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * Greatly nerfed mass driver.
   * ---------------------------------------- */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = require("lovec/temp/blk/BLK_configTurret");
  const INTF = require("lovec/temp/intf/INTF_BLK_impactInducer");
  const PARAM = require("lovec/glb/GLB_param");


  const MDL_effect = require("lovec/mdl/MDL_effect");
  const MDL_event = require("lovec/mdl/MDL_event");


  /* <---------- component ----------> */


  function comp_init(blk) {
    MDL_event._c_onLoad(() => {
      blk.bullet.damage = blk.bulDmg;
      blk.bullet.collidesGround = blk.bulCollidesGround;
      blk.bullet.collidesAir = blk.bulCollidesAir;
      blk.bullet.sprite = blk.bulSpr;
      blk.bullet.width = blk.bulW;
      blk.bullet.height = blk.bulH;
      blk.bullet.shrinkY = blk.bulShrinkY;
    });
  };


  function comp_setStats(blk) {
    blk.stats.add(Stat.damage, blk.bulDmg);
  };


  function comp_updateTile(b) {
    if(b.reloadCounter > 0.99 && !b.justCrafted) {
      b.ex_onCraft();
      b.justCrafted = true;
    };
    if(b.reloadCounter < 0.1) {
      b.justCrafted = false;
    };
  };


/*
  ========================================
  Section: Application
  ========================================
*/


  module.exports = [


    // Block
    newClass().extendClass(PARENT[0], "BLK_massDriver").implement(INTF[0]).initClass()
    .setParent(MassDriver)
    .setTags("blk-tur", "blk-dis")
    .setParam({
      // @PARAM: Damage of the mass driver bolt.
      bulDmg: 40.0,
      // @PARAM: If {true}, the bullet will collide with terrain wall.
      bulCollidesTerrain: true,
      // @PARAM: If {true}, the bullet only collides with terrain wall in a cave map.
      bulCollidesTerrainCaveOnly: false,
      // @PARAM: Whether the bullet collides with ground units.
      bulCollidesGround: true,
      // @PARAM: Whether the bullet collides with air units.
      bulCollidesAir: false,
      // @PARAM: {sprite} of the bullet.
      bulSpr: "shell",
      // @PARAM: {width} of the bullet.
      bulW: 9.0,
      // @PARAM: {height} of the bullet.
      bulH: 12.0,
      // @PARAM: {shrinkY} of the bullet.
      bulShrinkY: 0.0,

      bullet: prov(() => extend(MassDriverBolt, {


        update(bul) {
          if(
            bul.shooter != null && bul.shooter instanceof MassDriver.MassDriverBuild
              && tryJsProp(bul.shooter.block, "bulCollidesTerrain", false)
              && (
                tryJsProp(bul.shooter.block, "bulCollidesTerrainCaveOnly", false) ?
                  PARAM.isCaveMap :
                  true
              )
              && EntityCollisions.legsSolid(bul.tileX(), bul.tileY())
          ) {
            this.hit(bul, bul.tileX() * Vars.tilesize, bul.tileY() * Vars.tilesize);
            bul.remove();
            return;
          };

          this.super$update(bul);
        },


      })),
    })
    .setParamAlias([
      "shootEff", "shootEffect", Fx.shootBig2,
      "smokeEff", "smokeEffect", Fx.none,
      "receiveEff", "receiveEffect", Fx.mineBig,
    ])
    .setMethod({


      init: function() {
        comp_init(this);
      },


      setStats: function() {
        comp_setStats(this);
      },


      ex_calcImpactIntv: function(b) {
        return this.reload;
      }
      .setProp({
        noSuper: true,
        override: true,
        argLen: 1,
      }),


      ex_calcImpactShake: function(b) {
        return this.shake;
      }
      .setProp({
        noSuper: true,
        override: true,
        argLen: 1,
      }),


    }),


    // Building
    newClass().extendClass(PARENT[1], "BLK_massDriver").implement(INTF[1]).initClass()
    .setParent(MassDriver.MassDriverBuild)
    .setParam({
      justCrafted: false,
    })
    .setMethod({


      updateTile: function() {
        comp_updateTile(this);
      },


      ex_onCraft: function() {
        this.ex_createImpactWave();
        MDL_effect.showAt_impactWave(this.x, this.y, this.block.ex_calcImpactRad(this));
      }
      .setProp({
        noSuper: true,
      }),


    }),


  ];
