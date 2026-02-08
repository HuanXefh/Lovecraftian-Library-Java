/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * Handles methods related to loot unit.
   * Stats not included.
   * ---------------------------------------- */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const CLS_interface = require("lovec/cls/struct/CLS_interface");


  const MDL_pos = require("lovec/mdl/MDL_pos");


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


    // Block
    new CLS_interface({


      __PARAM_OBJ_SETTER__: () => ({
        // @PARAM: Craft time of this loot block. Loot call is ignored if this is less than 1.0.
        lootCallIntv: 0.0,
        // @PARAM: Amount parameter of this loot block.
        lootCallAmt: 0,
      }),


    }),


    // Building
    new CLS_interface({


      __PARAM_OBJ_SETTER__: () => ({
        lootTs: prov(() => []),
        lootQueue: prov(() => []),
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


      /* ----------------------------------------
       * NOTE:
       *
       * @LATER
       * Push target tiles to {b.lootTs} here.
       * ---------------------------------------- */
      ex_updateLootTs: function() {

      }
      .setProp({
        noSuper: true,
      }),


      /* ----------------------------------------
       * NOTE:
       *
       * Pushes target loots to {b.LootQueue}.
       * ---------------------------------------- */
      ex_updateLootQueue: function() {
        MDL_pos._lootsTs(this.lootTs, null, this.lootQueue);
      }
      .setProp({
        noSuper: true,
      }),


      /* ----------------------------------------
       * NOTE:
       *
       * @LATER
       * Called occasionally, process loots here.
       * ---------------------------------------- */
      ex_lootCall: function(loots, amtCall) {

      }
      .setProp({
        noSuper: true,
        argLen: 2,
      }),


    }),


  ];
