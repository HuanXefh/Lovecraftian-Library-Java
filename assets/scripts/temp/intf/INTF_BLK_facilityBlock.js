/*
  ========================================
  Section: Definition
  ========================================
*/


    /* <------------------------------ meta ------------------------------> */


    /**
     * @typedef {TemplateInstance<Block, INTF_BLK_facilityBlock>} INTFBLKFacilityBlock
     */


    /**
     * @typedef {TemplateInstance<Building, INTF_B_facilityBlock>} INTFBFacilityBlock
     * @prop {INTFBLKFacilityBlock} block
     */


    /* <------------------------------ component ------------------------------> */


    /**
     * @private
     * @param {INTFBLKFacilityBlock} blk
     * @return {void}
     */
    function comp_init(blk) {
        MDL_event.onLoadDelay(VAR.delay.load.blkCheck, () => {
            blk.canHandleAux = blk.ex_checkHandleAuxPossible();
            blk.canFireExplode = blk.ex_checkFireExplodePossible();
        });
    };


    /**
     * @private
     * @param {INTFBFacilityBlock} b
     * @return {void}
     */
    const comp_updateTile = function thisFun(b) {
        if(PARAM.UPDATE_SUPPRESSED || DEBUG.skipFacilityUpdate) return;

        // Handle auxiliary liquids
        if(b.liquids != null && TIMER.secTwo && b.block.delegee.canHandleAux) {
            b.liquids.each((liq, amt) => {
                if(!MDL_cond.isAuxiliaryFluid(liq)) return;
                if(b.efficiency < 0.0001 && b.block.delegee.shouldClearAuxOnStop) {
                    b.liquids.set(liq, 0.0);
                    return;
                };
                if(b.block.delegee.shouldCapAux && !MDL_cond.isNoCapAuxiliaryFluid(liq) && b.liquids.get(liq) > VAR.param.auxCap) {
                    b.liquids.set(liq, VAR.param.auxCap);
                };
            });
        };

        if(b.block.delegee.skipFacilityMethod) return;

        // Explode if near fire
        if(!Vars.net.client() && Vars.state.rules.reactorExplosions && b.block.delegee.canFireExplode) {
            if(Mathf.chanceDelta(0.005)) {
                b.fireExplodeReady = !Vars.net.client()
                    && LCPos.getTilesEdge(thisFun.tmpTs, b.tile, b.block.size, false).some(ot => Fires.get(ot) != null)
                    && (thisFun.checkExplosiveLiquid(b) || thisFun.checkExplosiveItem(b));
            };
            if(b.fireExplodeReady) {
                b.fireExplodeCd += Time.delta;
                if(Mathf.chanceDelta(0.4)) {
                    EFF.smogFireExplo.at(b);
                };
            } else {
                b.fireExplodeCd = Mathf.maxZero(b.fireExplodeCd - Time.delta);
            };
            if(b.fireExplodeCd >= b.block.delegee.fireExplodeCooldown) {
                TRIGGER.buildingFireExplosion.fire(b);
                FRAG_attack.explosion_global(
                    b.x, b.y,
                    FRAG_attack.getPresExploDmg(b.block.size),
                    FRAG_attack.getPresExploRad(b.block.size),
                    8.0,
                );
            };
        };
    }
    .setProp({
        /**
         * @memberof comp_updateTile
         * @type {Array<Tile>}
         */
        tmpTs: [],
        /**
         * @memberof comp_updateTile
         * @param {Building} b
         * @return {boolean}
         */
        checkExplosiveLiquid: function(b) {
            if(b.liquids == null) return false;
            let cond = false;
            b.liquids.each((liq, amt) => {
                if(cond || amt < 0.01) return;
                cond = VARGEN.exploFlds.includes(liq);
            });
            return cond;
        },
        /**
         * @memberof comp_updateTile
         * @param {Building} b
         * @return {boolean}
         */
        checkExplosiveItem: function(b) {
            return b.items == null ?
                false :
                VARGEN.exploItems.some(item => b.items.has(item));
        },
    });


/*
  ========================================
  Section: Application
  ========================================
*/


    module.exports = [


        /**
         * Handles methods that most factories and generators should have.
         * @class INTF_BLK_facilityBlock
         */
        new CLS_interface("INTF_BLK_facilityBlock", {


            __paramObjM__: function() {
                return {


                    /**
                     * `PARAM`: Whether auxiliary fluids in this block should be capped.
                     * @memberof INTF_BLK_facilityBlock
                     * @instance
                     * @type {boolean}
                     */
                    shouldCapAux: true,
                    /**
                     * `PARAM`: Whether auxiliary fluids should not be stored in this block when it's inactive.
                     * @memberof INTF_BLK_facilityBlock
                     * @instance
                     * @type {boolean}
                     */
                    shouldClearAuxOnStop: true,
                    /**
                     * `PARAM`: Whether to skip facility block update entirely.
                     * @memberof INTF_BLK_facilityBlock
                     * @instance
                     * @type {boolean}
                     */
                    skipFacilityMethod: false,


                    /* <------------------------------ internal ------------------------------> */


                    /**
                     * `INTERNAL`: Time before explosion due to nearby fire.
                     * @memberof INTF_BLK_facilityBlock
                     * @instance
                     * @type {number}
                     */
                    fireExplodeCooldown: 360.0,
                    /**
                     * `INTERNAL`: Whether this block is possible to obtain auxiliary fluids.
                     * @memberof INTF_BLK_facilityBlock
                     * @instance
                     * @type {boolean}
                     */
                    canHandleAux: false,
                    /**
                     * `INTERNAL`: Whether this block is possible to obtain flammable/explosive fluids.
                     * @memberof INTF_BLK_facilityBlock
                     * @instance
                     * @type {boolean}
                     */
                    canFireExplode: false,


                };
            },


            init: function() {
                comp_init(this);
            },


            /**
             * Sets up {@link INTF_BLK_facilityBlock#canHandleAux}.
             * @memberof INTF_BLK_facilityBlock
             * @instance
             * @func
             * @return {boolean}
             */
            ex_checkHandleAuxPossible: function() {
                return MDL_recipeDict.checkAnyIo(VARGEN.auxs, this);
            }
            .setProp({
                noSuper: true,
            }),


            /**
             * Sets up {@link INTF_BLK_facilityBlock#canFireExplode}.
             * @memberof INTF_BLK_facilityBlock
             * @instance
             * @func
             * @return {boolean}
             */
            ex_checkFireExplodePossible: function() {
                return MDL_recipeDict.checkAnyIo(VARGEN.exploItems, this) || MDL_recipeDict.checkAnyIo(VARGEN.exploFlds, this);
            }
            .setProp({
                noSuper: true,
            }),


        }),


        /**
         * @class INTF_B_facilityBlock
         */
        new CLS_interface("INTF_B_facilityBlock", {


            __paramObjM__: function() {
                return {


                    /* <------------------------------ internal ------------------------------> */


                    /**
                     * `INTERNAL`
                     * @memberof INTF_B_facilityBlock
                     * @instance
                     * @type {boolean}
                     */
                    fireExplodeReady: false,
                    /**
                     * `INTERNAL`
                     * @memberof INTF_B_facilityBlock
                     * @instance
                     * @type {number}
                     */
                    fireExplodeCd: 0.0,


                };
            },


            updateTile: function() {
                comp_updateTile(this);
            },


        }),


    ];
