/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  /* <---------- component ----------> */


  function comp_init(blk) {
    blk.polTol = MDL_pollution._polTol(blk);
  };


  function comp_setStats(blk) {
    if(blk.polTol > 0.0) blk.stats.add(fetchStat("lovec", "blk-poltol"), blk.polTol, fetchStatUnit("lovec", "polunits"));
  };


  function comp_updateTile(b) {
    if(b.blk$polTol < 0.0001) return;

    b.polExcess = Mathf.maxZero(MDL_pollution._glbPol() - b.blk$polTol);
    b.polEffc = b.ex_calcPolEffc();

    if(b.polEffc < 1.0 && Mathf.chanceDelta(0.03)) {
      MDL_effect._e_corrosion(b.x, b.y, b.block.size, Color.valueOf(Tmp.c1, "2f4108"));
    };
  };


  function comp_updateEfficiencyMultiplier(b) {
    b.efficiency *= b.polEffc;
  };


  function comp_ex_postUpdateEfficiencyMultiplier(b) {
    comp_updateEfficiencyMultiplier(b);
  };


  function comp_ex_calcPolEffc(b) {
    return b.polExcess < 0.0001 ?
      (
        b.block.delegee.revertedPolEffc ?
          0.0 :
          1.0
      ) :
      Mathf.clamp(
        b.block.delegee.revertedPolEffc ?
          b.polExcess / b.blk$polTol :
          (1.0 - b.polExcess / b.blk$polTol)
      );
  };


/*
  ========================================
  Section: Application
  ========================================
*/


  module.exports = [


    /**
     * @class INTF_BLK_pollutionHandler
     */
    new CLS_interface("INTF_BLK_pollutionHandler", {


      __paramObjSetter__: () => ({


        /**
         * <PARAM>: If true, this block requires pollution to reache 100% efficiency. But why?
         * @memberof INTF_BLK_pollutionHandler
         * @instance
         */
        revertedPolEffc: false,


        /* <------------------------------ internal ------------------------------ */


        /**
         * <INTERNAL>: Pollution tolerance.
         * @memberof INTF_BLK_pollutionHandler
         * @instance
         */
        polTol: -1.0,


      }),


      init: function() {
        comp_init(this);
      },


      setStats: function() {
        comp_setStats(this);
      },


    }),


    /**
     * @class INTF_B_pollutionHandler
     */
    new CLS_interface("INTF_B_pollutionHandler", {


      __paramObjSetter__: () => ({


        /* <------------------------------ internal ------------------------------ */


        /**
         * <INTERNAL>: Efficiency related to pollution.
         * @memberof INTF_B_pollutionHandler
         * @instance
         */
        polEffc: 1.0,
        /**
         * <INTERNAL>: Pollution points above tolerance.
         * @memberof INTF_B_pollutionHandler
         * @instance
         */
        polExcess: 0.0,
        /**
         * <INTERNAL>
         * @memberof INTF_B_pollutionHandler
         * @instance
         */
        blk$polTol: -1.0,


      }),


      updateTile: function() {
        comp_updateTile(this);
      },


      updateEfficiencyMultiplier: function() {
        comp_updateEfficiencyMultiplier(this);
      },


      ex_postUpdateEfficiencyMultiplier: function() {
        comp_ex_postUpdateEfficiencyMultiplier(this);
      }
      .setProp({
        noSuper: true,
      }),


      /**
       * Calculates efficiency related to pollution.
       * @memberof INTF_B_pollutionHandler
       * @instance
       * @return {number}
       */
      ex_calcPolEffc: function() {
        return comp_ex_calcPolEffc(this);
      }
      .setProp({
        noSuper: true,
      }),


    }),


  ];
