/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = require("lovec/temp/blk/BLK_configTurret");
  const INTF = require("lovec/temp/intf/INTF_BLK_impactInducer");


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


  function comp_drawSelect(b) {
    let ob = Vars.world.build(b.link);
    if(ob == null) return;

    MDL_draw._d_lineFlick(
      b.x, b.y, ob.x, ob.y,
      1.0, 0.5,
      !b.block.delegee.bulCollidesTerrain ?
        Pal.accent :
        b.block.delegee.bulCollidesTerrainCaveOnly && !PARAM.IS_CAVE_MAP ?
          Pal.accent :
          !MDL_pos._rayCheck_legSolid(b.x, b.y, ob.x, ob.y) ?
            Pal.accent :
            Pal.remove,
    );
  };


/*
  ========================================
  Section: Application
  ========================================
*/


  module.exports = [


    /**
     * Greatly nerfed mass driver.
     * @class BLK_massDriver
     * @extends BLK_configTurret
     * @extends INTF_BLK_impactInducer
     */
    newClass().extendClass(PARENT[0], "BLK_massDriver").implement(INTF[0]).initClass()
    .setParent(MassDriver)
    .setTags("blk-tur", "blk-dis")
    .setParam({


      /**
       * <PARAM>: Damage dealt by the mass driver bolt.
       * @memberof BLK_massDriver
       * @instance
       */
      bulDmg: 40.0,
      /**
       * <PARAM>: If true, the bullet will collide with terrain wall.
       * @memberof BLK_massDriver
       * @instance
       */
      bulCollidesTerrain: true,
      /**
       * <PARAM>: If true, the bullet only collides with terrain wall in a cave map.
       * @memberof BLK_massDriver
       * @instance
       */
      bulCollidesTerrainCaveOnly: false,
      /**
       * <PARAM>: Whether the bullet collides with ground units.
       * @memberof BLK_massDriver
       * @instance
       */
      bulCollidesGround: true,
      /**
       * <PARAM>: Whether the bullet collides with air units.
       * @memberof BLK_massDriver
       * @instance
       */
      bulCollidesAir: false,
      /**
       * <PARAM>: `sprite` of the bullet.
       * @memberof BLK_massDriver
       * @instance
       */
      bulSpr: "shell",
      /**
       * <PARAM>: `width` of the bullet.
       * @memberof BLK_massDriver
       * @instance
       */
      bulW: 9.0,
      /**
       * <PARAM>: `height` of the bullet.
       * @memberof BLK_massDriver
       * @instance
       */
      bulH: 12.0,
      /**
       * <PARAM>: `shrinkY` of the bullet.
       * @memberof BLK_massDriver
       * @instance
       */
      bulShrinkY: 0.0,


      /* <------------------------------ vanilla ------------------------------ */


      bullet: prov(() => extend(MassDriverBolt, {


        update(bul) {
          if(
            bul.shooter != null && bul.shooter instanceof MassDriver.MassDriverBuild
              && tryJsProp(bul.shooter.block, "bulCollidesTerrain", false)
              && (
                tryJsProp(bul.shooter.block, "bulCollidesTerrainCaveOnly", false) ?
                  PARAM.IS_CAVE_MAP :
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


      /**
       * @override
       * @memberof BLK_massDriver
       * @instance
       * @param {Building} b
       * @return {number}
       */
      ex_calcImpactIntv: function(b) {
        return this.reload;
      }
      .setProp({
        noSuper: true,
        override: true,
        argLen: 1,
      }),


      /**
       * @override
       * @memberof BLK_massDriver
       * @instance
       * @param {Building} b
       * @return {number}
       */
      ex_calcImpactShake: function(b) {
        return this.shake;
      }
      .setProp({
        noSuper: true,
        override: true,
        argLen: 1,
      }),


    }),


    /**
     * @class B_massDriver
     * @extends B_configTurret
     * @extends INTF_B_impactInducer
     */
    newClass().extendClass(PARENT[1], "B_massDriver").implement(INTF[1]).initClass()
    .setParent(MassDriver.MassDriverBuild)
    .setParam({


      /* <------------------------------ internal ------------------------------ */


      /**
       * <INTERNAL>
       * @memberof B_massDriver
       * @instance
       */
      justCrafted: false,


    })
    .setMethod({


      updateTile: function() {
        comp_updateTile(this);
      },


      drawSelect: function() {
        comp_drawSelect(this);
      },


      /**
       * @memberof B_massDriver
       * @instance
       * @return {void}
       */
      ex_onCraft: function() {
        this.ex_createImpactWave();
        MDL_effect._e_impactWave(this.x, this.y, this.block.ex_calcImpactRad(this));
      }
      .setProp({
        noSuper: true,
      }),


    }),


  ];
