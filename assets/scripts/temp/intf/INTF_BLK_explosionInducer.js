/*
  ========================================
  Section: Definition
  ========================================
*/


    /* <------------------------------ meta ------------------------------> */


    /**
     * @typedef {TemplateInstance<Block, INTF_BLK_explosionInducer>} INTFBLKExplosionInducer
     */


    /**
     * @typedef {TemplateInstance<Building, INTF_B_explosionInducer>} INTFBExplosionInducer
     * @prop {INTFBLKExplosionInducer} block
     */


    /* <------------------------------ component ------------------------------> */


    /**
     * @private
     * @param {INTFBLKExplosionInducer} blk
     * @return {void}
     */
    function comp_init(blk) {
        // noinspection JSValidateTypes
        blk.delegee.exploLiq = MDL_content.getCt(blk.delegee.exploLiq, ContentGetModes.RS);
    };


    /**
     * @private
     * @param {INTFBLKExplosionInducer} blk
     * @return {void}
     */
    function comp_load(blk) {
        blk.delegee.exploSe = fetchSound(blk.delegee.exploSe);
    };


    /**
     * @private
     * @param {INTFBExplosionInducer} b
     * @return {void}
     */
    function comp_ex_createExplosion(b) {
        let dmg = b.block.self.ex_calcExploDmg(b);
        if(dmg > 0.0) {
            Damage.damage(b.x, b.y, b.block.self.ex_calcExploRad(b), dmg);
        };
        b.block.delegee.exploEff.at(b);
        b.block.delegee.exploSe.at(b);
        let liq = b.block.self.ex_findExploLiq(b);
        if(liq != null) {
            let
                i = 0,
                iCap = b.block.self.ex_calcExploPuddleAmt(b),
                t,
                liqAmt = b.block.self.ex_calcExploPuddleLiqAmt(b);
            while(i < iCap) {
                Tmp.v1.trns(Mathf.random(360.0), Mathf.random(b.block.self.ex_calcExploPuddleRad()));
                t = GLB_var.world.tileWorld(b.x + Tmp.v1.x, b.y + Tmp.v1.y);
                if(t != null) {
                    Puddles.deposit(t, liq, liqAmt);
                };
                i++;
            };
        };
        let shake = b.block.self.ex_calcExploShake(b);
        if(shake > 0.0) {
            MDL_effect.shake(b.x, b.y, shake, b.block.self.ex_calcExploShakeDur(b));
        };
        if(b.block.delegee.hasImpactOnExplosion) {
            FRAG_attack.impact(b.x, b.y, b.block.self.ex_calcExploDmg(b) * 0.5, 480.0, b.block.self.ex_calcExploRad(b), 0.0, 0.0);
        };
    };


/*
  ========================================
  Section: Application
  ========================================
*/


    module.exports = [


        /**
         * Handles explosion creation.
         * @class INTF_BLK_explosionInducer
         */
        new CLS_interface("INTF_BLK_explosionInducer", {


            __paramObjM__: function() {
                return {


                    /**
                     * `PARAM`: Whether to create impact wave along with the explosion.
                     * @memberof INTF_BLK_explosionInducer
                     * @instance
                     * @type {boolean}
                     */
                    hasImpactOnExplosion: true,
                    /**
                     * `PARAM`: Explosion damage.
                     * @memberof INTF_BLK_explosionInducer
                     * @instance
                     * @type {number}
                     */
                    exploDmg: 0.0,
                    /**
                     * `PARAM`: Explosion radius.
                     * @memberof INTF_BLK_explosionInducer
                     * @instance
                     * @type {number}
                     */
                    exploRad: 40.0,
                    /**
                     * `PARAM`: Explosion puddle liquid.
                     * @memberof INTF_BLK_explosionInducer
                     * @instance
                     * @type {Liquid|null}
                     */
                    exploLiq: null,
                    /**
                     * `PARAM`: Amount of puddles created.
                     * @memberof INTF_BLK_explosionInducer
                     * @instance
                     * @type {number}
                     */
                    exploPuddleAmt: 10,
                    /**
                     * `PARAM`: Puddle spread radius.
                     * @memberof INTF_BLK_explosionInducer
                     * @instance
                     * @type {number}
                     */
                    exploPuddleRad: 20.0,
                    /**
                     * `PARAM`: Amount of liquid in each puddle.
                     * @memberof INTF_BLK_explosionInducer
                     * @instance
                     * @type {number}
                     */
                    exploPuddleLiqAmt: 100.0,
                    /**
                     * `PARAM`: Explosion shake power.
                     * @memberof INTF_BLK_explosionInducer
                     * @instance
                     * @type {number}
                     */
                    exploShake: 0.0,
                    /**
                     * `PARAM`: Explosion shake duration.
                     * @memberof INTF_BLK_explosionInducer
                     * @instance
                     * @type {number}
                     */
                    exploShakeDur: 60.0,
                    /**
                     * `PARAM`: Explosion effect.
                     * @memberof INTF_BLK_explosionInducer
                     * @instance
                     * @type {Effect}
                     */
                    exploEff: GLB_eff.explosion,
                    /**
                     * `PARAM`: Explosion sound.
                     * @memberof INTF_BLK_explosionInducer
                     * @instance
                     * @type {SoundGn}
                     */
                    exploSe: "se-shot-explosion",


                };
            },


            init: function() {
                comp_init(this);
            },


            load: function() {
                comp_load(this);
            },


            drawPlace: function(tx, ty, rot, valid) {
                if(this.delegee.exploDmg > 0.0) {
                    LCDrawf.diskWarning(tx.toFCoord(this.size), ty.toFCoord(this.size), this.delegee.exploRad);
                };
            },


            /**
             * @memberof INTF_BLK_explosionInducer
             * @instance
             * @func
             * @param {INTFBExplosionInducer} b
             * @return {number}
             */
            ex_calcExploDmg: function(b) {
                return this.delegee.exploDmg;
            }
            .setProp({
                noSuper: true,
                argLen: 1,
            }),


            /**
             * @memberof INTF_BLK_explosionInducer
             * @instance
             * @func
             * @param {INTFBExplosionInducer} b
             * @return {number}
             */
            ex_calcExploRad: function(b) {
                return this.delegee.exploRad;
            }
            .setProp({
                noSuper: true,
                argLen: 1,
            }),


            /**
             * @memberof INTF_BLK_explosionInducer
             * @instance
             * @func
             * @param {INTFBExplosionInducer} b
             * @return {Liquid|null}
             */
            ex_findExploLiq: function(b) {
                return this.delegee.exploLiq;
            }
            .setProp({
                noSuper: true,
                argLen: 1,
            }),


            /**
             * @memberof INTF_BLK_explosionInducer
             * @instance
             * @func
             * @param {INTFBExplosionInducer} b
             * @return {number}
             */
            ex_calcExploPuddleAmt: function(b) {
                return this.delegee.exploPuddleAmt;
            }
            .setProp({
                noSuper: true,
                argLen: 1,
            }),


            /**
             * @memberof INTF_BLK_explosionInducer
             * @instance
             * @func
             * @param {INTFBExplosionInducer} b
             * @return {number}
             */
            ex_calcExploPuddleRad: function(b) {
                return this.delegee.exploPuddleRad;
            }
            .setProp({
                noSuper: true,
                argLen: 1,
            }),


            /**
             * @memberof INTF_BLK_explosionInducer
             * @instance
             * @func
             * @param {INTFBExplosionInducer} b
             * @return {number}
             */
            ex_calcExploPuddleLiqAmt: function(b) {
                return this.delegee.exploPuddleLiqAmt;
            }
            .setProp({
                noSuper: true,
                argLen: 1,
            }),


            /**
             * @memberof INTF_BLK_explosionInducer
             * @instance
             * @func
             * @param {INTFBExplosionInducer} b
             * @return {number}
             */
            ex_calcExploShake: function(b) {
                return this.delegee.exploShake;
            }
            .setProp({
                noSuper: true,
                argLen: 1,
            }),


            /**
             * @memberof INTF_BLK_explosionInducer
             * @instance
             * @func
             * @param {INTFBExplosionInducer} b
             * @return {number}
             */
            ex_calcExploShakeDur: function(b) {
                return this.delegee.exploShakeDur;
            }
            .setProp({
                noSuper: true,
                argLen: 1,
            }),


        }),


        /**
         * @class INTF_B_explosionInducer
         */
        new CLS_interface("INTF_B_explosionInducer", {


            onDestroyed: function() {
                if(this.self.ex_shouldExplodeOnDestroyed()) {
                    this.self.ex_createExplosion();
                };
            },


            drawSelect: function() {
                if(this.block.self.ex_calcExploDmg(this) > 0.0) {
                    LCDrawf.diskWarning(this.x, this.y, this.block.self.ex_calcExploRad(this));
                };
            },


            /**
             * If true, explosion will be created when this building is destroyed.
             * <br> `LATER`
             * @memberof INTF_B_explosionInducer
             * @instance
             * @func
             * @return {boolean}
             */
            ex_shouldExplodeOnDestroyed: function() {
                return false;
            }
            .setProp({
                noSuper: true,
            }),


            /**
             * Call this method to create explosion.
             * @memberof INTF_B_explosionInducer
             * @instance
             * @func
             * @return {void}
             */
            ex_createExplosion: function() {
                comp_ex_createExplosion(this);
            }
            .setProp({
                noSuper: true,
            }),


        }),


    ];
