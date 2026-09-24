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


    /* <------------------------------ component ------------------------------> */


    /**
     * @private
     * @param {BULSpriteBullet} btp
     * @return {void}
     */
    function comp_load(btp) {
        btp.shaReg = btp.backRegion;
    };


    /**
     * @private
     * @param {BULSpriteBullet} btp
     * @param {Bullet} bul
     * @return {void}
     */
    function comp_draw(btp, bul) {
        if(btp.shouldDrawShadow && Vars.world.floorWorld(bul.x, bul.y) != null && Vars.world.floorWorld(bul.x, bul.y).canShadow) {
            processZ(btp.layer - 1.0);
            Draw.color(Pal.shadow, Pal.shadow.a);
            Draw.rect(btp.shaReg, bul.x + btp.offSha, bul.y + btp.offSha, bul.rotation - 90.0);
            Draw.color();
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
     */
    module.exports = newClass()
    .extendClass(PARENT, "BUL_spriteBullet")
    .initTemplate()
    .setParent(BasicBulletType)
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
         * `PARAM`: Shadow offset.
         * @memberof BUL_spriteBullet
         * @instance
         * @type {number}
         */
        offSha: -4.0,


        /* <------------------------------ internal ------------------------------> */


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


    });
