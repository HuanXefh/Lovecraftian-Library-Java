/*
  ========================================
  Section: Definition
  ========================================
*/


    /* <------------------------------ meta ------------------------------> */


    /**
     * @typedef {TemplateInstance<BasicBulletType, INTF_BUL_trailHandler>} INTFBULTrailHandler
     */


    /* <------------------------------ component ------------------------------> */


/*
  ========================================
  Section: Application
  ========================================
*/


    /**
     * Used to show trail for bullets. Bypasses vanilla trail for more custom effects.
     * @class INTF_BUL_trailHandler
     */
    module.exports = new CLS_interface("INTF_BUL_trailHandler", {


        __paramObjM__: function() {
            return {


                /**
                 * `PARAM`: Trail length.
                 * @memberof INTF_BUL_trailHandler
                 * @instance
                 * @type {number}
                 */
                trailLen: 0,
                /**
                 * `PARAM`: Trail width.
                 * @memberof INTF_BUL_trailHandler
                 * @instance
                 * @type {number}
                 */
                trailW: 2.0,
                /**
                 * `PARAM`: Trail color.
                 * @memberof INTF_BUL_trailHandler
                 * @instance
                 * @type {Color}
                 */
                trailColor: GLB_color.accent,
                /**
                 * `PARAM`: Interpolation pattern for trail.
                 * @memberof INTF_BUL_trailHandler
                 * @instance
                 * @type {Interp}
                 */
                trailInterp: Interp.linear,
                /**
                 * `PARAM`: Trail oscillation magnitude.
                 * @memberof INTF_BUL_trailHandler
                 * @instance
                 * @type {number}
                 */
                trailSinMag: 0.0,
                /**
                 * `PARAM`: Affects trail oscillation speed.
                 * @memberof INTF_BUL_trailHandler
                 * @instance
                 * @type {number}
                 */
                trailSinScl: 1.0,


            };
        },


        removed: function(bul) {
            if(this.delegee.trailLen > 0 && bul.trail != null && bul.trail.size() > 0) {
                Fx.trailFade.at(bul.x, bul.y, this.delegee.trailW, this.delegee.trailColor, bul.trail.copy());
            };
        },


        update: function(bul) {
            this.self.ex_updateTrail(bul);
        },


        draw: function(bul) {
            this.self.ex_drawTrail(bul);
        },


        /**
         * @memberof INTF_BUL_trailHandler
         * @instance
         * @func
         * @param {Bullet} bul
         * @return {void}
         */
        ex_updateTrail: function(bul) {
            if(!Vars.headless && this.delegee.trailLen > 0) {
                if(bul.trail == null) {
                    bul.trail = new Trail(this.delegee.trailLen);
                };
                bul.trail.length = this.delegee.trailLen;
                bul.trail.update(
                    bul.x, bul.y,
                    this.delegee.trailInterp.apply(this.self.ex_getTrailWScl(bul)) * (1.0 + (
                        this.delegee.trailSinMag > 0.0 ?
                            Mathf.absin(GLB_var.time, this.delegee.trailSinScl, this.delegee.trailSinMag) :
                            0.0
                    )),
                );
            };
        }
        .setProp({
            noSuper: true,
            argLen: 1,
        }),


        /**
         * Gets scaling of trail width (clamped).
         * @memberof INTF_BUL_trailHandler
         * @instance
         * @func
         * @param {Bullet} bul
         * @return {number}
         */
        ex_getTrailWScl: function(bul) {
            return bul.fin();
        }
        .setProp({
            noSuper: true,
            argLen: 1,
        }),


        /**
         * @memberof INTF_BUL_trailHandler
         * @instance
         * @func
         * @param {Bullet} bul
         * @return {void}
         */
        ex_drawTrail: function(bul) {
            if(this.delegee.trailLen > 0 && bul.trail != null) {
                processZ(Draw.z() - 0.0001);
                bul.trail.draw(this.delegee.trailColor, this.delegee.trailW);
                processZ(null);
            };
        }
        .setProp({
            noSuper: true,
            argLen: 1,
        }),


    });
