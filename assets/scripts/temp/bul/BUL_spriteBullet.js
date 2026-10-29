/*
  ================================================================================
  Section: Definition
  ================================================================================
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
        let
            bulHFrac = btp.self.ex_calcBulHFrac(bul),
            shrink = btp.shrinkInterp.apply(bulHFrac),
            w = btp.width * ((1.0 - btp.shrinkX) + btp.shrinkX * shrink),
            h = btp.height * ((1.0 - btp.shrinkY) + btp.shrinkY * shrink),
            ang = bul.rotation() - 90.0 + (btp.spin === 0.0 ? 0.0 : (Mathf.randomSeed(bul.id, 360.0) + bul.time * btp.spin)) + btp.rotationOffset,
            offH = btp.delegee.offH * bulHFrac,
            offSha = btp.delegee.offSha * bulHFrac,
            x = bul.x,
            y = bul.y + offH;

        if(btp.delegee.shouldDrawShadow && GLB_var.world.floorWorld(bul.x, bul.y) != null && GLB_var.world.floorWorld(bul.x, bul.y).canShadow) {
            processZ(btp.delegee.shaZ);
            Draw.mixcol(GLB_color.shadow, 1.0);
            Draw.color(GLB_color.shadow.a);
            Draw.rect(btp.delegee.shaReg, bul.x + offSha, bul.y + offSha, w, h, ang);
            Draw.reset();
            processZ();
        };

        btp.drawParts(bul);
        Tmp.c1.set(btp.mixColorFrom).lerp(btp.mixColorTo, 1.0 - bulHFrac);
        Draw.mixcol(Tmp.c1, Tmp.c1.a);
        if(btp.backRegion.found()) {
            Draw.color(btp.backColor);
            Draw.rect(btp.backRegion, x, y, w, h, ang);
        };
        Draw.color(btp.frontColor);
        Draw.rect(btp.frontRegion, x, y, w, h, ang);
        Draw.reset();
    };


    /**
     * @private
     * @param {BULSpriteBullet} btp
     * @return {void}
     */
    function comp_ex_init(btp) {
        btp.delegee.flyingMode = CLS_bulletFlyingMode.get(btp.delegee.flyingMode);
        if(btp.delegee.flyingMode == null) throw new LCError.NullArgumentError("flyingMode");
    };


/*
  ================================================================================
  Section: Application
  ================================================================================
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
         * `PARAM`: Height offset.
         * @memberof BUL_spriteBullet
         * @instance
         * @type {number}
         */
        offH: 0.0,
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
         * `INTERNAL`: Affects shadow. Converted to mode on INIT. See {@link CLS_bulletFlyingMode}.
         * @memberof BUL_spriteBullet
         * @instance
         * @type {string|CLS_bulletFlyingMode}
         */
        flyingMode: "constant",
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
         * @return {void}
         */
        ex_init: function() {
            comp_ex_init(this);
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
        ex_getVisualY: function(bul) {
            return bul.y + this.self.ex_calcBulHFrac(bul) * this.delegee.offH;;
        }
        .setProp({
            noSuper: true,
            override: true,
            argLen: 1,
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
            return this.self.ex_calcBulHFrac(bul);
        }
        .setProp({
            noSuper: true,
            override: true,
            argLen: 1,
        }),


        /**
         * Calculates bullet height fraction.
         * @memberof BUL_spriteBullet
         * @instance
         * @func
         * @param {Bullet} bul
         * @return {number}
         */
        ex_calcBulHFrac: function(bul) {
            return this.delegee.flyingMode.apply(bul);
        }
        .setProp({
            noSuper: true,
            argLen: 1,
        }),


    });
