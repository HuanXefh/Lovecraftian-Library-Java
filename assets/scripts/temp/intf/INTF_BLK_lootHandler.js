/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  /* <---------- component ----------> */


  function comp_created(b) {
    b.lootCallCd = Mathf.random(b.block.delegee.lootCallCooldown);
  };


  function comp_onProximityUpdate(b) {
    b.ex_updateLootTs();
  };


  function comp_pickedUp(b) {
    b.lootTs.clear();
  };


  function comp_updateTile(b) {
    if(b.block.delegee.lootCallCooldown < 1.0) return;

    if(b.lootCallCd < b.block.delegee.lootCallCooldown) {
      b.lootCallCd += b.edelta();
      if(b.lootCallCd > b.block.delegee.lootCallCooldown) {
        b.ex_updateLootQueue();
      };
    };
    if(b.efficiency > 0.0 && b.lootCallCd > b.block.delegee.lootCallCooldown) {
      if(TIMER.secQuarter) {
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


      __PARAM_OBJ_SETTER__: () => ({


        /**
         * <PARAM>: Craft time of this loot block. Loot call is ignored if this is negative.
         * @memberof INTF_BLK_lootHandler
         * @instance
         */
        lootCallCooldown: 0.0,
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
        lootCallCd: 0.0,


      }),


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


      /**
       * @memberof INTF_B_lootHandler
       * @instance
       * @return {number}
       */
      ex_getReloadFrac: function() {
        return this.block.delegee.lootCallCooldown < 1.0 ? 1.0 : Mathf.clamp(this.lootCallCd / this.block.delegee.lootCallCooldown);
      }
      .setProp({
        noSuper: true,
      }),


    }),


  ];
