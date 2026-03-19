/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  /* <---------- component ----------> */


  function comp_onProximityUpdate(b) {
    b.ex_updateLootTs();
  };


  function comp_pickedUp(b) {
    b.lootTs.clear();
  };


  function comp_updateTile(b) {
    if(b.block.delegee.lootCallIntv < 1.0) return;

    if(b.timerLootCall.get(b.block.delegee.lootCallIntv / Math.max(b.efficiency, 0.000001))) {
      b.ex_updateLootQueue();
      b.ex_lootCall(b.lootQueue, b.block.delegee.lootCallAmt);
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


      __PARAM_OBJ_SETTER__: () => ({


        /**
         * <PARAM>: Craft time of this loot block. Loot call is ignored if this is less than 1.0.
         * @memberof INTF_BLK_lootHandler
         * @instance
         */
        lootCallIntv: 0.0,
        /**
         * <PARAM>: Amount parameter of this loot block used in loot call.
         * @memberof INTF_BLK_lootHandler
         * @instance
         */
        lootCallAmt: 0,


      }),


    }),


    /**
     * @class INTF_B_lootHandler
     */
    new CLS_interface("INTF_B_lootHandler", {


      __PARAM_OBJ_SETTER__: () => ({


        /* <------------------------------ internal ------------------------------ */


        /**
         * <INTERNAL>
         * @memberof INTF_B_lootHandler
         * @instance
         */
        lootTs: prov(() => []),
        /**
         * <INTERNAL>
         * @memberof INTF_B_lootHandler
         * @instance
         */
        lootQueue: prov(() => []),
        /**
         * <INTERNAL>
         * @memberof INTF_B_lootHandler
         * @instance
         */
        timerLootCall: prov(() => new Interval(1)),


      }),


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
       * <LATER>
       * @memberof INTF_B_lootHandler
       * @instance
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
       * @return {void}
       */
      ex_updateLootQueue: function() {
        MDL_pos._lootsTs(this.lootTs, this.lootQueue);
      }
      .setProp({
        noSuper: true,
      }),


      /**
       * Override this method to process found loots.
       * <br> <LATER>
       * @memberof INTF_B_lootHandler
       * @instance
       * @param {Array<Unit>} loots
       * @param {number} amtCall
       * @return {void}
       */
      ex_lootCall: function(loots, amtCall) {

      }
      .setProp({
        noSuper: true,
        argLen: 2,
      }),


    }),


  ];
