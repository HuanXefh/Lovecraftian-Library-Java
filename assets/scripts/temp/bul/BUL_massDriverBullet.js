/*
  ========================================
  Section: Definition
  ========================================
*/


    /* <------------------------------ meta ------------------------------> */


    /**
     * @typedef {TemplateInstance<MassDriverBolt, BUL_massDriverBullet>} BULMassDriverBullet
     */


    const PARENT = require("lovec/temp/bul/BUL_spriteBullet");
    const INTF_BUL_trailHandler = require("lovec/temp/intf/INTF_BUL_trailHandler");


    /* <------------------------------ component ------------------------------> */


    /**
     * @private
     * @param {BULMassDriverBullet} btp
     * @param {Bullet} bul
     * @return {void}
     */
    function comp_update(btp, bul) {
        if(
            bul.shooter != null && bul.shooter instanceof MassDriver.MassDriverBuild
                && tryJsProp(bul.shooter.block, "bulCollidesTerrain", false)
                && (!tryJsProp(bul.shooter.block, "bulCollidesTerrainCaveOnly", false) || GLB_param.IS_CAVE_MAP)
                && EntityCollisions.legsSolid(bul.tileX(), bul.tileY())
        ) {
            btp.hit(bul, bul.tileX() * Vars.tilesize, bul.tileY() * Vars.tilesize);
            bul.remove();
            return;
        };

        btp.super$update(bul);
    };


/*
  ========================================
  Section: Application
  ========================================
*/


    /**
     * Used in {@link BLK_massDriver}.
     * @class BUL_massDriverBullet
     * @extends BUL_spriteBullet
     * @extends INTF_BUL_trailHandler
     */
    module.exports = newClass()
    .extendClass(PARENT, "BUL_massDriverBullet")
    .implement(INTF_BUL_trailHandler)
    .initTemplate()
    .setParent("MassDriverBolt")
    .setTags()
    .setParam({


        /**
         * @inheritdoc
         * @memberof BUL_massDriverBullet
         * @instance
         * @type {number}
         */
        offSha: -14.0,


        /* <------------------------------ internal ------------------------------> */


        /**
         * `INTERNAL`
         * <br> `REALIZED`
         * @memberof BUL_massDriverBullet
         * @instance
         * @type {ENumber}
         */
        flyingMode: BulletFlyingModes.BALLISTIC,


    })
    .setMethod({


        update: function(bul) {
            comp_update(this, bul);
        }
        .setProp({
            noSuper: true,
        }),


        draw: function(bul) {
            // No super
        }
        .setProp({
            noSuper: true,
        }),


    });
