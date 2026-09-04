/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  /* <---------- component ----------> */


/*
  ========================================
  Section: Application
  ========================================
*/


  module.exports = [


    /**
     * Handles recaching of buildings when `blk.drawCached` is true.
     * @class INTF_BLK_buildingRecacheHandler
     */
    new CLS_interface("INTF_BLK_buildingRecacheHandler", {


      __paramObjM__: () => ({


        /**
         * `PARAM`: Whether to recache when an item is added or removed.
         * @memberof INTF_BLK_INTF_BLK_buildingRecacheHandler
         * @instance
         */
        recacheForItem: false,
        /**
         * `PARAM`: Whether to recache when a fluid is added or removed.
         * @memberof INTF_BLK_INTF_BLK_buildingRecacheHandler
         * @instance
         */
        recacheForFld: false,


      }),


    }),


    /**
     * @class INTF_B_buildingRecacheHandler
     */
    new CLS_interface("INTF_B_buildingRecacheHandler", {


      handleItem: function(b_f, item) {
        if(!Vars.headless && this.block.drawCached && this.block.delegee.recacheForItem) this.recache();
      },


      handleStack: function(item, amt, e_f) {
        if(!Vars.headless && this.block.drawCached && this.block.delegee.recacheForItem) this.recache();
      },


      itemTaken: function(item) {
        if(!Vars.headless && this.block.drawCached && this.block.delegee.recacheForItem) this.recache();
      },


      removeStack: function(item, amt) {
        if(!Vars.headless && this.block.drawCached && this.block.delegee.recacheForItem) this.recache();
      }
      .setProp({
        mergeMode: function(valPrev, val) {
          return valPrev;
        },
      }),


      dump: function(item) {
        if(!Vars.headless && this.block.drawCached && this.block.delegee.recacheForItem) this.recache();
      }
      .setProp({
        mergeMode: function(valPrev, val) {
          return valPrev;
        },
      }),


      moveForward: function(item) {
        if(!Vars.headless && this.block.drawCached && this.block.delegee.recacheForItem) this.recache();
      }
      .setProp({
        mergeMode: function(valPrev, val) {
          return valPrev;
        },
      }),


      handleLiquid: function(b_f, liq, amt) {
        if(!Vars.headless && this.block.drawCached && this.block.delegee.recacheForFld) this.recache();
      },


      dumpLiquid: function(liq, amt) {
        if(!Vars.headless && this.block.drawCached && this.block.delegee.recacheForFld) this.recache();
      },


      moveLiquid: function(b_t, liq) {
        if(!Vars.headless && this.block.drawCached && this.block.delegee.recacheForFld) this.recache();
      }.setProp({
        mergeMode: function(valPrev, val) {
          return valPrev;
        },
      }),


      moveLiquidForward: function(b_t, liq) {
        if(!Vars.headless && this.block.drawCached && this.block.delegee.recacheForFld) this.recache();
      }
      .setProp({
        mergeMode: function(valPrev, val) {
          return valPrev;
        },
      }),


      transferLiquid: function(b_t, amt, liq) {
        if(!Vars.headless && this.block.drawCached && this.block.delegee.recacheForFld) this.recache();
      },


    }),


  ];
