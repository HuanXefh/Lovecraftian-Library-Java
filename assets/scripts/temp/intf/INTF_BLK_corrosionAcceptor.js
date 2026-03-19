/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  /* <---------- component ----------> */


  function comp_init(blk) {
    blk.matGrp = MDL_flow._matGrp(blk);
    blk.corRes = MDL_flow._corRes(blk);
    blk.cloggable = MDL_cond._isCloggableBlock(blk);
  };


  function comp_setStats(blk) {
    let matGrpB = MDL_flow._matGrpB(blk);
    if(matGrpB !== "!ERR") blk.stats.add(fetchStat("lovec", "blk0liq-matgrp"), matGrpB);
    if(blk.cloggable) blk.stats.add(fetchStat("lovec", "blk0liq-cloggable"), true);
  };


  function comp_updateTile(b) {
    if(PARAM.updateSuppressed || b.liquids == null || !TIMER.secQuarter || !Mathf.chance(0.25)) return;
    let liqCur = b.liquids.current();
    let amt = b.liquids.get(liqCur);
    if(amt < 0.05) return;

    b.ex_updateCorrosion(liqCur, amt);
    if(b.block.delegee.cloggable) {
      b.ex_updateClogging(liqCur, amt);
    };
  };


  function comp_ex_updateCorrosion(b, liq, amt) {
    let corPow = tryJsProp(liq, "corPow", 0.0);
    let corMtp = MDL_flow._corMtp(b.block, liq);
    if(corPow < 0.01 && corMtp > 1.0) corPow = 1.0;
    if(corPow < 0.01) return;
    let corRes = tryJsProp(b.block, "corRes", 1.0);

    b.damagePierce((b.maxHealth * VAR.blk_corDmgFrac + VAR.blk_corDmgMin) * corPow * corMtp / corRes);
    if(Mathf.chance(0.5)) MDL_effect._e_corrosion(b.x, b.y, b.block.size, liq.color);
  };


  function comp_ex_updateClogging(b, liq, amt) {
    if(liq.viscosity < VAR.blk_clogViscThr) return;

    b.damagePierce((b.maxHealth * VAR.blk_clogDmgFrac + VAR.blk_clogDmgMin) * Mathf.lerp(0.5, 1.0, amt / b.block.liquidCapacity) * Mathf.lerp(0.5, 1.0, liq.viscosity / VAR.blk_clogViscThr * 4.0));
    if(Mathf.chance(0.5)) MDL_effect._e_corrosion(b.x, b.y, b.block.size, liq.color, true);
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


      __PARAM_OBJ_SETTER__: () => ({


        /* <------------------------------ internal ------------------------------ */


        /**
         * <INTERNAL>
         * @memberof INTF_BLK_corrosionAcceptor
         * @instance
         */
        matGrp: null,
        /**
         * <INTERNAL>
         * @memberof INTF_BLK_corrosionAcceptor
         * @instance
         */
        corRes: 1.0,
        /**
         * <INTERNAL>
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


      /**
       * @memberof INTF_B_corrosionAcceptor
       * @instance
       * @param {Liquid} liq
       * @param {number} amt
       * @return {void}
       */
      ex_updateCorrosion: function(liq, amt) {
        comp_ex_updateCorrosion(this, liq, amt);
      }
      .setProp({
        noSuper: true,
        argLen: 2,
      }),


      /**
       * @memberof INTF_B_corrosionAcceptor
       * @instance
       * @param {Liquid} liq
       * @param {number} amt
       * @return {void}
       */
      ex_updateClogging: function(liq, amt) {
        comp_ex_updateClogging(this, liq, amt);
      }
      .setProp({
        noSuper: true,
        argLen: 2,
      }),


    }),


  ];
