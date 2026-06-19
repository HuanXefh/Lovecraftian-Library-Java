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
     * Handles recaching of buildings.
     * @class INTF_BLK_buildingRecacheHandler
     */
    new CLS_interface("INTF_BLK_buildingRecacheHandler", {


      __PARAM_OBJ_SETTER__: () => ({


        /**
         * <PARAM>: Whether to recache when an item is added or removed.
         * @memberof INTF_BLK_INTF_BLK_buildingRecacheHandler
         * @instance
         */
        recacheForItm: false,
        /**
         * <PARAM>: Whether to recache when a fluid is added or removed.
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


      handleItem: function(b_f, itm) {
        if(!Vars.headless && this.block.drawCached && this.block.delegee.recacheForItm) this.recache();
      },


      handleStack: function(itm, amt, e_f) {
        if(!Vars.headless && this.block.drawCached && this.block.delegee.recacheForItm) this.recache();
      },


      itemTaken: function(itm) {
        if(!Vars.headless && this.block.drawCached && this.block.delegee.recacheForItm) this.recache();
      },


      removeStack: function(itm, amt) {
        if(!Vars.headless && this.block.drawCached && this.block.delegee.recacheForItm) this.recache();
      }
      .setProp({
        mergeMode: function(valPrev, val) {
          return valPrev;
        },
      }),


      dump: function(itm) {
        if(!Vars.headless && this.block.drawCached && this.block.delegee.recacheForItm) this.recache();
      }
      .setProp({
        mergeMode: function(valPrev, val) {
          return valPrev;
        },
      }),


      moveForward: function(itm) {
        if(!Vars.headless && this.block.drawCached && this.block.delegee.recacheForItm) this.recache();
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
