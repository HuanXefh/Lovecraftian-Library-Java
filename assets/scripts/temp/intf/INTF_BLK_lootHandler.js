/*
  ========================================
  Section: Definition
  ========================================
*/


    /* <------------------------------ import ------------------------------> */


    /**
     * @typedef {TemplateInstance<Block, INTF_BLK_lootHandler>} INTFBLKLootHandler
     */


    /**
     * @typedef {TemplateInstance<Building, INTF_B_lootHandler>} INTFBLootHandler
     * @prop {INTFBLKLootHandler} block
     */


    /* <------------------------------ component ------------------------------> */


    /**
     * @private
     * @param {INTFBLootHandler} b
     * @return {void}
     */
    function comp_created(b) {
        b.lootCallCd = Mathf.random(b.block.delegee.lootCallCooldown);
    };


    /**
     * @private
     * @param {INTFBLootHandler} b
     * @return {void}
     */
    function comp_onProximityUpdate(b) {
        b.ex_updateLootTs();
    };


    /**
     * @private
     * @param {INTFBLootHandler} b
     * @return {void}
     */
    function comp_pickedUp(b) {
        b.lootTs.clear();
    };


    /**
     * @private
     * @param {INTFBLootHandler} b
     * @return {void}
     */
    function comp_updateTile(b) {
        if(b.block.delegee.lootCallCooldown < 1.0) return;

        if(b.lootCallCd < b.block.delegee.lootCallCooldown) {
            b.lootCallCd += b.edelta();
            if(b.lootCallCd > b.block.delegee.lootCallCooldown) {
                b.ex_updateLootQueue();
            };
        };
        if(b.efficiency > 0.0 && b.lootCallCd > b.block.delegee.lootCallCooldown) {
            if(GLB_timer.secQuarter) {
                b.ex_updateLootQueue();
            };
            if(b.lootQueue.length > 0) {
                b.ex_lootCall(b.lootQueue, b.block.delegee.lootCallAmt);
                b.lootCallCd = 0.0;
            };
        };
    };


/*
  ========================================
  Section: Application
  ========================================
*/


    module.exports = [


        /**
         * Handles methods for blocks related to loot.
         * Stats not included.
         * @class INTF_BLK_lootHandler
         */
        new CLS_interface("INTF_BLK_lootHandler", {


            __paramObjM__: function() {
                return {


                    /**
                     * `PARAM`: Craft time of this loot block. Loot call is ignored if this is negative.
                     * @memberof INTF_BLK_lootHandler
                     * @instance
                     * @type {number}
                     */
                    lootCallCooldown: 0.0,
                    /**
                     * `PARAM`: Amount parameter of this loot block used in loot call.
                     * @memberof INTF_BLK_lootHandler
                     * @instance
                     * @type {number}
                     */
                    lootCallAmt: 0,


                };
            },


        }),


        /**
         * @class INTF_B_lootHandler
         */
        new CLS_interface("INTF_B_lootHandler", {


            __paramObjM__: function() {
                return {


                    /* <------------------------------ internal ------------------------------> */


                    /**
                     * `INTERNAL`
                     * @memberof INTF_B_lootHandler
                     * @instance
                     * @type {TDynamic<Array<Tile>>}
                     */
                    lootTs: tprov(() => []),
                    /**
                     * `INTERNAL`
                     * @memberof INTF_B_lootHandler
                     * @instance
                     * @type {TDynamic<Array<LootUnit>>}
                     */
                    lootQueue: tprov(() => []),
                    /**
                     * `INTERNAL`
                     * @memberof INTF_B_lootHandler
                     * @instance
                     * @type {number}
                     */
                    lootCallCd: 0.0,


                };
            },


            created: function() {
                comp_created(this);
            },


            onProximityUpdate: function() {
                comp_onProximityUpdate(this);
            },


            pickedUp: function() {
                comp_pickedUp(this);
            },


            updateTile: function() {
                comp_updateTile(this);
            },


            /**
             * `LATER`
             * @memberof INTF_B_lootHandler
             * @instance
             * @func
             * @return {void}
             */
            ex_updateLootTs: function() {

            }
            .setProp({
                noSuper: true,
            }),


            /**
             * @memberof INTF_B_lootHandler
             * @instance
             * @func
             * @return {void}
             */
            ex_updateLootQueue: function() {
                LCEntity.getLootsByTiles(this.lootQueue, this.lootTs);
            }
            .setProp({
                noSuper: true,
            }),


            /**
             * Override this method to process found loots.
             * <br> `LATER`
             * @memberof INTF_B_lootHandler
             * @instance
             * @func
             * @param {Array<LootUnit>} loots
             * @param {number} amtCall
             * @return {void}
             */
            ex_lootCall: function(loots, amtCall) {

            }
            .setProp({
                noSuper: true,
                argLen: 2,
            }),


            /**
             * `REALIZED`
             * @memberof INTF_B_lootHandler
             * @instance
             * @func
             * @return {number}
             * @lovecAttached
             */
            ex_getReloadFrac: function() {
                return this.block.delegee.lootCallCooldown < 1.0 ?
                    1.0 :
                    Mathf.clamp(this.lootCallCd / this.block.delegee.lootCallCooldown);
            }
            .setProp({
                noSuper: true,
            }),


        }),


    ];
