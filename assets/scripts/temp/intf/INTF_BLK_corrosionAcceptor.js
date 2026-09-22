/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  /* <---------- component ----------> */


  function comp_init(blk) {
    blk.matGrp = MDL_flow.getMatGrp(blk);
    blk.corRes = MDL_flow.getCorRes(blk);
    blk.cloggable = MDL_cond.isCloggableBlock(blk);
  };


  function comp_setStats(blk) {
    let matGrpBundle = MDL_flow.getMatGrpBundle(blk);
    if(matGrpBundle !== TmpStateTag.error) blk.stats.add(fetchStat("lovec", "blk0liq-matgrp"), matGrpBundle);
    if(blk.cloggable) blk.stats.add(fetchStat("lovec", "blk0liq-cloggable"), true);
  };


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


      __paramObjM__: () => ({


        /* <------------------------------ internal ------------------------------> */


        /**
         * `INTERNAL`
         * @memberof INTF_BLK_corrosionAcceptor
         * @instance
         */
        matGrp: null,
        /**
         * `INTERNAL`
         * @memberof INTF_BLK_corrosionAcceptor
         * @instance
         */
        corRes: 1.0,
        /**
         * `INTERNAL`
         * @memberof INTF_BLK_corrosionAcceptor
         * @instance
         */
        cloggable: false,


      }),


      init: function() {
        comp_init(this);
      },


      setStats: function() {
        comp_setStats(this);
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
