/*
  ========================================
  Section: Definition
  ========================================
*/


    /* <------------------------------ import ------------------------------> */


    /**
     * @typedef {TemplateInstance<Block, INTF_BLK_oreScannerHandler>} INTFBLKOreScannerHandler
     */


    /**
     * @typedef {TemplateInstance<Building, INTF_B_oreScannerHandler>} INTFBOreScannerHandler
     * @prop {INTFBLKOreScannerHandler} block
     */


    /* <------------------------------ component ------------------------------> */


    /**
     * @private
     * @param {INTFBOreScannerHandler} b
     * @return {void}
     */
    function comp_updateTile(b) {
        if(b.requiresScanner && GLB_timer.effc) {
            b.scannerCur = LCEntity.getBuildBy(
                b.x, b.y, b.team,
                ob => MDL_cond.isOreScanner(ob.block) && ob.block.delegee.scanTier >= b.delegee.depthLvlReqCur && ob.efficiency > 0.0 && Mathf.dst(b.x, b.y, ob.x, ob.y) < ob.block.delegee.blkRad,
            );
        };
    };


    /**
     * @private
     * @param {INTFBOreScannerHandler} b
     * @return {void}
     */
    function comp_updateEfficiencyMultiplier(b) {
        if(b.requiresScanner) {
            b.efficiency *= b.scannerCur == null ? 0.0 : b.scannerCur.ex_getScanFrac();
        };
    };


    /**
     * @private
     * @param {INTFBOreScannerHandler} b
     * @return {void}
     */
    function comp_drawSelect(b) {
        if(!b.requiresScanner) return;
        b.scannerCur == null ?
            LCDrawf.textSelect(b, MDL_bundle.getInfo("lovec", "text-no-scanner"), false, b.block.delegee.noScannerTextOffTy) :
            LCDrawf.connectorArea(b, b.scannerCur);
    };


    /**
     * @private
     * @param {INTFBOreScannerHandler} b
     * @return {void}
     */
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


            __paramObjM__: function() {
                return {


                    /**
                     * `PARAM`: Integer offset of the no-scanner-found text.
                     * @memberof INTF_BLK_oreScannerHandler
                     * @instance
                     * @type {number}
                     */
                    noScannerTextOffTy: 0,


                };
            },


        }),


        /**
         * @class INTF_B_oreScannerHandler
         */
        new CLS_interface("INTF_B_oreScannerHandler", {


            __paramObjM__: function() {
                return {


                    /* <------------------------------ internal ------------------------------> */


                    /**
                     * `INTERNAL`: If this value is true, ore scanner check is enabled.
                     * @memberof INTF_B_oreScannerHandler
                     * @instance
                     * @type {boolean}
                     */
                    requiresScanner: false,
                    /**
                     * `INTERNAL`: Currently linked scanner.
                     * @memberof INTF_B_oreScannerHandler
                     * @instance
                     * @type {BOreScanner|null}
                     */
                    scannerCur: null,
                    /**
                     * `INTERNAL`: Currently required minimum depth tier of ore scanner. Should be updated somewhere else.
                     * @memberof INTF_B_oreScannerHandler
                     * @instance
                     * @type {number}
                     */
                    depthLvlReqCur: 0,


                };
            },


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
