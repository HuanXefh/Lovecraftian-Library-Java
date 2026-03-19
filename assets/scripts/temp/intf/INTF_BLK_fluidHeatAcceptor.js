/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  /* <---------- component ----------> */


  function comp_init(blk) {
    blk.heatRes = MDL_flow._heatRes(blk);
  };


  function comp_load(blk) {
    blk.fHeatReg = fetchRegionOrNull(blk, "-fluid-heat", "-heat");
  };


  function comp_setStats(blk) {
    if(isFinite(blk.heatRes)) blk.stats.add(fetchStat("lovec", "blk0heat-heatres"), blk.heatRes, fetchStatUnit("lovec", "heatunits"));
  };


  function comp_setBars(blk) {
    if(!isFinite(MDL_flow._heatRes(blk))) return;

    blk.addBar("lovec-fheat", b => new Bar(
      prov(() => Core.bundle.format("bar.lovec-bar-fluid-heat-amt", Strings.fixed(b.delegee.fHeatCur, 2) + " " + fetchStatUnit("lovec", "heatunits").localized())),
      prov(() => Pal.lightOrange),
      () => Mathf.clamp(b.delegee.fHeatCur / blk.heatRes),
    ));
  };


  function comp_created(b) {
    b.fHeatCur = PARAM.glbHeat;
    b.fHeatTg = MDL_flow._fHeat_b(b, true);
  };


  function comp_updateTile(b) {
    if(TIMER.heat && Mathf.chance(0.33)) b.fHeatTg = MDL_flow._fHeat_b(b, true);
    if(TIMER.liq) b.fHeatCur = Mathf.lerpDelta(b.fHeatCur, b.fHeatTg, b.block.delegee.fHeatWarmupRate);

    if(PARAM.updateSuppressed || !TIMER.secQuarter || !Mathf.chance(0.25)) return;

    let heatRes = b.block.delegee.featRes;
    if(!isFinite(heatRes) || b.fHeatCur - heatRes < 0.0001) return;

    b.damagePierce(2.0 * b.fHeatCur / heatRes);
    MDL_effect.showAt(b.x, b.y, EFF.heatSmog, 0.0);
  };


  function comp_draw(b) {
    if(!PARAM.drawFluidHeat || !VARGEN.hotFlds.includes(b.liquids.current())) return;

    let heatRes = b.block.delegee.heatRes;
    if(!isFinite(heatRes)) return;

    MDL_draw._reg_heat(
      b.x, b.y,
      Math.pow(Mathf.clamp(b.fHeatCur * 0.75 / heatRes), 3),
      b.block.delegee.fHeatReg,
      b.block.delegee.shouldRotFHeatReg ? b.drawrot() : 0.0,
      b.block.size,
    );
  };


/*
  ========================================
  Section: Application
  ========================================
*/


  module.exports = [


    /**
     * Handles methods for fluid heat.
     * @class INTF_BLK_fluidHeatAcceptor
     */
    new CLS_interface("INTF_BLK_fluidHeatAcceptor", {


      __PARAM_OBJ_SETTER__: () => ({


        /**
         * <PARAM>: Rate at which fluid heat approaches target temperature.
         * @memberof INTF_BLK_fluidHeatAcceptor
         * @instance
         */
        fHeatWarmupRate: 0.004,
        /**
         * <PARAM>: Whether fluid heat region is rotatable.
         * @memberof INTF_BLK_fluidHeatAcceptor
         * @instance
         */
        shouldRotFHeatReg: false,


        /* <------------------------------ internal ------------------------------ */


        /**
         * <INTERNAL>
         * @memberof INTF_BLK_fluidHeatAcceptor
         * @instance
         */
        heatRes: 0.0,
        /**
         * <INTERNAL>
         * @memberof INTF_BLK_fluidHeatAcceptor
         * @instance
         */
        fHeatReg: null,


      }),


      init: function() {
        comp_init(this);
      },


      load: function() {
        comp_load(this);
      },


      setStats: function() {
        comp_setStats(this);
      },


      setBars: function() {
        comp_setBars(this);
      },


    }),


    /**
     * @class INTF_B_fluidHeatAcceptor
     */
    new CLS_interface("INTF_B_fluidHeatAcceptor", {


      __PARAM_OBJ_SETTER__: () => ({


        /* <------------------------------ internal ------------------------------ */


        /**
         * <INTERNAL>
         * @memberof INTF_B_fluidHeatAcceptor
         * @instance
         */
        fHeatCur: 0.0,
        /**
         * <INTERNAL>
         * @memberof INTF_B_fluidHeatAcceptor
         * @instance
         */
        fHeatTg: 0.0,


      }),


      created: function() {
        comp_created(this);
      },


      updateTile: function() {
        comp_updateTile(this);
      },


      draw: function() {
        comp_draw(this);
      },


      /**
       * @memberof INTF_B_fluidHeatAcceptor
       * @instance
       * @param {Writes|Reads} wr0rd
       * @return {void}
       */
      ex_processData: function(wr0rd) {
        processData(
          wr0rd, this.LCRevi,

          (wr, revi) => {
            wr.f(this.fHeatCur);
          },

          (rd, revi) => {
            this.fHeatCur = rd.f();
          },
        );
      }
      .setProp({
        noSuper: true,
        argLen: 1,
      }),


    }),


  ];
