/*
  ========================================
  Section: Definition
  ========================================
*/


    /* <------------------------------ meta ------------------------------> */


    /**
     * @typedef {TemplateInstance<Block, INTF_BLK_corrosionAcceptor>} INTFBLKCorrosionAcceptor
     */


    /**
     * @typedef {TemplateInstance<Building, INTF_B_corrosionAcceptor>} INTFBCorrosionAcceptor
     * @prop {INTFBLKCorrosionAcceptor} block
     */


    /* <------------------------------ component ------------------------------> */


    /**
     * @private
     * @param {INTFBLKCorrosionAcceptor} blk
     * @return {void}
     */
    function comp_init(blk) {
        blk.matGrp = MDL_flow.getMatGrp(blk);
        blk.corRes = MDL_flow.getCorRes(blk);
        blk.cloggable = MDL_cond.isCloggableBlock(blk);
    };


    /**
     * @private
     * @param {INTFBLKCorrosionAcceptor} blk
     * @param {Stats} stats
     * @return {void}
     */
    function comp_setStats(blk, stats) {
        let matGrpBundle = MDL_flow.getMatGrpBundle(blk);
        if(matGrpBundle !== TmpStateTag.error) {
            stats.add(fetchStat("lovec", "blk0liq-matgrp"), matGrpBundle);
        };
        if(blk.cloggable) {
            stats.add(fetchStat("lovec", "blk0liq-cloggable"), true);
        };
    };


    /**
     * @private
     * @param {INTFBCorrosionAcceptor} b
     * @return {void}
     */
    function comp_updateTile(b) {
      if(b.liquids == null || PARAM.UPDATE_SUPPRESSED || !TIMER.secQuarter) return;

      let
          liqCur = b.liquids.current(),
          amt = b.liquids.currentAmount();

      MDL_flow.updateCorrosion(b, liqCur, amt);
      if(b.block.delegee.cloggable) {
          MDL_flow.updateClogging(b, liqCur, amt);
      };

      if(
          !Vars.net.client()
              && b.block.delegee.matGrp != null
              && Mathf.chanceDelta(0.1)
              && !b.block.consumesLiquid(liqCur)
              && amt > b.block.liquidCapacity * 0.1
      ) {
          MDL_reaction.handleReaction("MATERIAL: " + b.block.delegee.matGrp, liqCur, 10.0, b);
      };
    };


/*
  ========================================
  Section: Application
  ========================================
*/


    module.exports = [


        /**
         * Handles fluid corrosion damage, including clogging damage.
         * @class INTF_BLK_corrosionAcceptor
         */
        new CLS_interface("INTF_BLK_corrosionAcceptor", {


            __paramObjM__: function() {
                return {


                    /* <------------------------------ internal ------------------------------> */


                    /**
                     * `INTERNAL`: Material group of this block.
                     * @memberof INTF_BLK_corrosionAcceptor
                     * @instance
                     * @type {string|null}
                     */
                    matGrp: null,
                    /**
                     * `INTERNAL`: Corrosion resistance of this block.
                     * @memberof INTF_BLK_corrosionAcceptor
                     * @instance
                     * @type {number}
                     */
                    corRes: 1.0,
                    /**
                     * `INTERNAL`: Whether this block gains damage from viscous fluids.
                     * @memberof INTF_BLK_corrosionAcceptor
                     * @instance
                     * @type {boolean}
                     */
                    cloggable: false,


                };
            },


            init: function() {
                comp_init(this);
            },


            setStats: function(stats) {
                comp_setStats(this, getCtStats(this, stats));
            },


        }),


        /**
         * @class INTF_B_corrosionAcceptor
         */
        new CLS_interface("INTF_B_corrosionAcceptor", {


            updateTile: function() {
                comp_updateTile(this);
            },


        }),


    ];
