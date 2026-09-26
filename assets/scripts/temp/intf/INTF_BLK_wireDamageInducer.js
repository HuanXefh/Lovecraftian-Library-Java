/*
  ========================================
  Section: Definition
  ========================================
*/


    /* <------------------------------ meta ------------------------------> */


    /**
     * @typedef {TemplateInstance<Block, INTF_BLK_wireDamageInducer>} INTFBLKWireDamageInducer
     */


    /**
     * @typedef {TemplateInstance<Building, INTF_B_wireDamageInducer>} INTFBWireDamageInducer
     * @prop {INTFBLKWireDamageInducer} block
     */


    /* <------------------------------ component ------------------------------> */


    /**
     * @private
     * @param {INTFBLKWireDamageInducer} blk
     * @return {void}
     */
    function comp_init(blk) {
        blk.update = true;
    };


    /**
     * @private
     * @param {INTFBLKWireDamageInducer} blk
     * @param {number} x1
     * @param {number} y1
     * @param {number} x2
     * @param {number} y2
     * @return {number}
     */
    function comp_ex_getWireGlowAlpha(blk, x1, y1, x2, y2) {
        let b = Vars.world.buildWorld(x1, y1);
        let b_t = Vars.world.buildWorld(x2, y2);
        if(b == null || b_t == null || b.power == null || b_t.power == null) return 0.0;
        return Math.max(b.power.status, b_t.power.status) * LCDrawf.getLaserA(blk.ex_getWireStrokeScl(), false, false, true);
    };


    /**
     * @private
     * @param {INTFBWireDamageInducer} b
     * @return {void}
     */
    function comp_updateTile(b) {
        if(Vars.net.client() || !TIMER.secQuarter) return;
        let dmg = b.block.delegee.wireTouchDmg * b.power.status;
        if(dmg < 0.0001) return;
        let b_t = b.ex_findWireTarget();
        if(b_t == null || b_t.power == null || b_t.power < 0.01) return;
        let unit = LCRaycastf.findUnit(b.x, b.y, b_t.x, b_t.y, ounit => MDL_cond.isUnitBoosting(ounit));
        if(unit == null) return;

        FRAG_attack.lightning_global(unit.x, unit.y, null, dmg, 3, 7, 8, b.block.delegee.wireArcColor, "air");
        TRIGGER.wireTouch.fire(b, unit);
    };


/*
  ========================================
  Section: Application
  ========================================
*/


    module.exports = [


        /**
         * Handles wire touch damage.
         * Does not draw wire.
         * @class INTF_BLK_wireDamageInducer
         */
        new CLS_interface("INTF_BLK_wireDamageInducer", {


            __paramObjM__: function() {
                return {


                    /**
                     * `PARAM`: Wire material. See {@link DB_block.db.grpParam.wireMatReg}.
                     * @memberof INTF_BLK_wireDamageInducer
                     * @instance
                     * @type {string}
                     */
                    wireMat: "copper",
                    /**
                     * `PARAM`: Damage dealt when a boosting unit touches the wire.
                     * @memberof INTF_BLK_wireDamageInducer
                     * @instance
                     * @type {number}
                     */
                    wireTouchDmg: 0.0,
                    /**
                     * `PARAM`: Color of lightning created when wire is touched.
                     * @memberof INTF_BLK_wireDamageInducer
                     * @instance
                     * @type {Color}
                     */
                    wireArcColor: Pal.accent,


                };
            },


            init: function() {
                comp_init(this);
            },


            /**
             * @memberof INTF_BLK_wireDamageInducer
             * @instance
             * @func
             * @param {number} x1
             * @param {number} y1
             * @param {number} x2
             * @param {number} y2
             * @return {number}
             */
            ex_getWireGlowAlpha: function(x1, y1, x2, y2) {
                return comp_ex_getWireGlowAlpha(this, x1, y1, x2, y2);
            }
            .setProp({
                noSuper: true,
            }),


            /**
             * `LATER`
             * @memberof INTF_BLK_wireDamageInducer
             * @instance
             * @func
             * @return {number}
             */
            ex_getWireStrokeScl: function() {
                return 1.0;
            }
            .setProp({
                noSuper: true,
            }),


        }),


        /**
         * @class INTF_B_wireDamageInducer
         */
        new CLS_interface("INTF_B_wireDamageInducer", {


            updateTile: function() {
                comp_updateTile(this);
            },


            /**
             * Finds a random target building to check whether a boosting unit is on the way.
             * Normally it's a building connected to this wire block.
             * <br> `LATER`
             * @memberof INTF_B_wireDamageInducer
             * @instance
             * @func
             * @return {Building|null}
             */
            ex_findWireTarget: function() {
                return null;
            }
            .setProp({
                noSuper: true,
            }),


        }),


    ];
