/*
  ========================================
  Section: Definition
  ========================================
*/


    /* <------------------------------ meta ------------------------------> */


    /**
     * @typedef {TemplateInstance<BasicBulletType, BUL_spriteBullet>} BULSpriteBullet
     */


    const PARENT = require("lovec/temp/bul/BUL_baseBullet");
    const INTF_BUL_trailHandler = require("lovec/temp/intf/INTF_BUL_trailHandler");


    /* <------------------------------ component ------------------------------> */


    /**
     * @private
     * @param {BULSpriteBullet} btp
     * @return {void}
     */
    function comp_load(btp) {
        btp.delegee.shaReg = btp.backRegion.found() ? btp.backRegion : btp.frontRegion;
    };


    /**
     * @private
     * @param {BULSpriteBullet} btp
     * @param {Bullet} bul
     * @return {void}
     */
    function comp_draw(btp, bul) {
        if(btp.delegee.shouldDrawShadow && GLB_var.world.floorWorld(bul.x, bul.y) != null && GLB_var.world.floorWorld(bul.x, bul.y).canShadow) {
            let
                shrink = btp.shrinkInterp.apply(bul.fout()),
                offSha = btp.delegee.offSha * btp.self.ex_calcShaH(bul);

            processZ(btp.delegee.shaZ);
            Draw.mixcol(GLB_color.shadow, 1.0);
            Draw.color(GLB_color.shadow.a);
            Draw.rect(
                btp.delegee.shaReg,
                bul.x + offSha,
                bul.y + offSha,
                btp.width * ((1.0 - btp.shrinkX) + btp.shrinkX * shrink),
                btp.height * ((1.0 - btp.shrinkY) + btp.shrinkY * shrink),
                bul.rotation() - 90.0 + (btp.spin === 0.0 ? 0.0 : (Mathf.randomSeed(bul.id, 360.0) + bul.time * btp.spin)) + btp.rotationOffset,
            );
            Draw.reset();
            processZ();
        };

        btp.super$draw(bul);
    };


/*
  ========================================
  Section: Application
  ========================================
*/


    /**
     * {@link BasicBulletType} that supports shadow.
     * @class BUL_spriteBullet
     * @extends BUL_baseBullet
     * @extends INTF_BUL_trailHandler
     */
    module.exports = newClass()
    .extendClass(PARENT, "BUL_spriteBullet")
    .implement(INTF_BUL_trailHandler)
    .initTemplate()
    .setParent("BasicBulletType")
    .setTags()
    .setParam({


        /**
         * `PARAM`: Whether to draw shadow for this bullet.
         * @memberof BUL_spriteBullet
         * @instance
         * @type {boolean}
         */
        shouldDrawShadow: true,
        /**
         * `PARAM`: Shadow layer.
         * @memberof BUL_spriteBullet
         * @instance
         * @type {number}
         */
        shaZ: 79.9,
        /**
         * `PARAM`: Shadow offset.
         * @memberof BUL_spriteBullet
         * @instance
         * @type {number}
         */
        offSha: -8.0,


        /* <------------------------------ internal ------------------------------> */


        /**
         * `INTERNAL`: Affects shadow. See {@link BulletFlyingModes}.
         * @memberof BUL_spriteBullet
         * @instance
         * @type {ENumber}
         */
        flyingMode: BulletFlyingModes.CONSTANT,
        /**
         * `INTERNAL`
         * @memberof BUL_spriteBullet
         * @instance
         * @type {TextureRegion}
         */
        shaReg: null,


    })
    .setMethod({


        load: function() {
            comp_load(this);
        },


        draw: function(bul) {
            comp_draw(this, bul);
        }
        .setProp({
            noSuper: true,
        }),


        /**
         * @override
         * @memberof BUL_spriteBullet
         * @instance
         * @func
         * @param {Bullet} bul
         * @return {number}
         */
        ex_getTrailWScl: function(bul) {
            return this.self.ex_calcShaH(bul);
        }
        .setProp({
            noSuper: true,
            override: true,
            argLen: 1,
        }),


        /**
         * Calculates height for shadow (normalized).
         * @memberof BUL_spriteBullet
         * @instance
         * @func
         * @param {Bullet} bul
         * @return {number}
         */
        ex_calcShaH: function(bul) {
            switch(this.delegee.flyingMode) {
                case BulletFlyingModes.CONSTANT : return 1.0;
                case BulletFlyingModes.BALLISTIC : return Interp.pow2Out.apply(1.0 - Math.abs(bul.fout() - 0.5) * 2.0);
                case BulletFlyingModes.DROP : return bul.fout();
                case BulletFlyingModes.LIFT : return bul.fin();
            };
            return 1.0;
        }
        .setProp({
            noSuper: true,
            argLen: 1,
        }),


    });
