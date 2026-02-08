/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * Handles methods for fluid heat.
   * ---------------------------------------- */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const CLS_interface = require("lovec/cls/struct/CLS_interface");
  const EFF = require("lovec/glb/GLB_eff");
  const PARAM = require("lovec/glb/GLB_param");
  const TIMER = require("lovec/glb/GLB_timer");
  const VARGEN = require("lovec/glb/GLB_varGen");


  const MDL_draw = require("lovec/mdl/MDL_draw");
  const MDL_effect = require("lovec/mdl/MDL_effect");
  const MDL_flow = require("lovec/mdl/MDL_flow");


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


    // Block
    new CLS_interface({


      __PARAM_OBJ_SETTER__: () => ({
        // @PARAM: Rate at which the fluid heat approaches target temperature.
        fHeatWarmupRate: 0.004,
        // @PARAM: Whether the fluid heat region should be rotated.
        shouldRotFHeatReg: false,

        heatRes: 0.0,
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


    // Building
    new CLS_interface({


      __PARAM_OBJ_SETTER__: () => ({
        fHeatCur: 0.0,
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


      ex_processData: function(wr0rd, LCRevi) {
        processData(
          wr0rd, LCRevi,

          (wr, revi) => {
            wr.f(this.fHeatCur);
          },

          (rd, revi) => {
            if(revi < 1) {
              let pres = rd.f();
              this.presTg = pres;
              this.presTmp = pres;
              this.fHeatCur = rd.f();
              return;
            };

            this.fHeatCur = rd.f();
          },
        );
      }
      .setProp({
        noSuper: true,
        argLen: 2,
      }),


    }),


  ];
