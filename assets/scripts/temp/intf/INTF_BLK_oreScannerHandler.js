/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  /* <---------- component ----------> */


  function comp_updateTile(b) {
    if(b.requiresScanner && TIMER.effc) {
      b.scannerCur = MDL_pos._b_scan(b.x, b.y, b.team, null, b.delegee.dpLvlReqCur);
    };
  };


  function comp_updateEfficiencyMultiplier(b) {
    if(b.requiresScanner) b.efficiency *= b.scannerCur == null ? 0.0 : b.scannerCur.ex_getScanFrac();
  };


  function comp_drawSelect(b) {
    if(!b.requiresScanner) return;

    b.scannerCur == null ?
      MDL_draw._d_textSelect(b, MDL_bundle._info("lovec", "text-no-scanner"), false, b.block.delegee.noScannerTextOffTy) :
      MDL_draw._d_conArea(b, b.scannerCur);
  };


  function comp_ex_postUpdateEfficiencyMultiplier(b) {
    comp_updateEfficiencyMultiplier(b);
  };


/*
  ========================================
  Section: Application
  ========================================
*/


  module.exports = [


    /**
     * Handles methods related to ore scanner check.
     * To make a building check nearby scanners, simply set `b.requiresScanner` to true.
     * @class INTF_BLK_oreScannerHandler
     */
    new CLS_interface("INTF_BLK_oreScannerHandler", {


      __PARAM_OBJ_SETTER__: () => ({


        /**
         * <PARAM>: Currently required minimum depth tier of ore scanner. Should be updated else where.
         * @memberof INTF_BLK_oreScannerHandler
         * @instance
         */
        dpLvlReqCur: 0,
        /**
         * <PARAM>: Integer offset of the no-scanner-found text.
         * @memberof INTF_BLK_oreScannerHandler
         * @instance
         */
        noScannerTextOffTy: 0,


      }),


    }),


    /**
     * @class INTF_B_oreScannerHandler
     */
    new CLS_interface("INTF_B_oreScannerHandler", {


      __PARAM_OBJ_SETTER__: () => ({


        /* <------------------------------ internal ------------------------------ */


        /**
         * <INTERNAL>: If this value is true, ore scanner check is enabled.
         * @memberof INTF_B_oreScannerHandler
         * @instance
         */
        requiresScanner: false,
        /**
         * <INTERNAL>: Currently linked scanner.
         * @memberof INTF_B_oreScannerHandler
         * @instance
         */
        scannerCur: null,


      }),


      updateTile: function() {
        comp_updateTile(this);
      },


      updateEfficiencyMultiplier: function() {
        comp_updateEfficiencyMultiplier(this);
      },


      drawSelect: function() {
        comp_drawSelect(this);
      },


      ex_postUpdateEfficiencyMultiplier: function() {
        comp_ex_postUpdateEfficiencyMultiplier(this);
      }
      .setProp({
        noSuper: true,
      }),


    }),


  ];
