/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * Blocks that handle Lovec heat, not Erekir one.
   * ---------------------------------------- */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const CLS_interface = require("lovec/cls/struct/CLS_interface");
  const PARAM = require("lovec/glb/GLB_param");
  const TIMER = require("lovec/glb/GLB_timer");
  const VAR = require("lovec/glb/GLB_var");
  const VARGEN = require("lovec/glb/GLB_varGen");


  const FRAG_fluid = require("lovec/frag/FRAG_fluid");


  const MDL_draw = require("lovec/mdl/MDL_draw");
  const MDL_flow = require("lovec/mdl/MDL_flow");
  const MDL_pos = require("lovec/mdl/MDL_pos");
  const MDL_recipeDict = require("lovec/mdl/MDL_recipeDict");


  /* <---------- component ----------> */


  function comp_init(blk) {
    blk.heatBlkMeltTemp = MDL_flow._heatRes(blk);
  };


  function comp_load(blk) {
    blk.heatReg = fetchRegionOrNull(blk, "-heat");
  };


  function comp_setStats(blk) {
    if(isFinite(blk.heatBlkMeltTemp)) blk.stats.add(fetchStat("lovec", "blk0heat-heatres"), blk.heatBlkMeltTemp, fetchStatUnit("lovec", "heatunits"));
  };


  function comp_setBars(blk) {
    blk.addBar("lovec-temp", b => new Bar(
      prov(() => Core.bundle.format("bar.heatpercent", Strings.fixed(b.delegee.tempCur, 2) + " " + fetchStatUnit("lovec", "heatunits").localized(), b.ex_getHeatFrac().roundFixed(2) * 100.0)),
      prov(() => Pal.lightOrange),
      () => b.ex_getHeatFrac(),
    ));
  };


  function comp_created(b) {
    b.tempCur = PARAM.glbHeat;
  };


  function comp_onProximityUpdate(b) {
    b.ex_updateHeatFetchTgs();
    b.ex_updateHeatTransTgs();
    b.ex_updateHeatSupplyTgs();
  };


  function comp_pickedUp(b) {
    b.heatFetchTgs.clear();
    b.heatTransTgs.clear();
    b.heatSupplyTgs.clear();
  };


  function comp_updateTile(b) {
    // Update temperature and apply damage if overheated
    if(!PARAM.updateSuppressed) {
      b.tempRiseTg = b.ex_calcTempTg();
      b.tempCur = Mathf.lerpDelta(b.tempCur, Math.max(b.tempRiseTg, PARAM.glbHeat), b.block.delegee.heatTransRate);
      if(TIMER.secHalf && b.tempCur > b.block.delegee.heatBlkMeltTemp) {
        FRAG_attack.damage(b, (VAR.blk_corDmgMin + VAR.blk_corDmgFrac * b.maxHealth) * (b.tempCur - b.block.delegee.heatBlkMeltTemp) / 50.0, 0.0, "heat");
      };
    };

    // Occasionally supply abstract fluid, or output external heat
    if(TIMER.liq && !b.block.delegee.skipHeatSupply && b.heatSupplyTgs.length > 0) {
      b.heatSupplyIncre++;
      let b_t = b.heatSupplyTgs[b.heatSupplyIncre % b.heatSupplyTgs.length];
      if(b_t.added && !b_t.isPayload()) {
        b_t.ex_handleExtHeat != null ?
          b_t.ex_handleExtHeat(b.ex_getHeatSupplied()) :
          FRAG_fluid.addLiquid(b_t, null, VARGEN.auxHeat, b.ex_getHeatSupplied() * VAR.time_liqIntv / 6000.0, false, false, true);
      };
    };
  };


  function comp_draw(b) {
    if(PARAM.drawFurnaceHeat) {
      MDL_draw._reg_heat(b.x, b.y, Math.pow(b.ex_getHeatFrac(), 3) * 0.7, b.block.delegee.heatReg, b.drawrot(), b.block.size);
    };

    MDL_draw._l_disk(b.x, b.y, b.ex_getHeatFrac(), b.block.size * Vars.tilesize * 0.7, b.block.size);
  };


  function comp_ex_updateHeatFetchTgs(b) {
    if(b.block.delegee.skipHeatFetch) return;

    b.heatFetchTgs.clear();
    b.proximity.each(
      ob => ob.ex_getHeatProd != null || MDL_recipeDict._prodAmt(VARGEN.auxHeat, ob.block) > 0.0,
      ob => b.heatFetchTgs.push(ob, MDL_pos._sideFrac(ob, b)),
    );
  };


  function comp_ex_updateHeatTransTgs(b) {
    if(b.block.delegee.skipHeatTrans) return;

    b.heatTransTgs.clear();
    b.proximity.each(
      ob => ob.ex_getHeatTransfered != null && (
        !ob.block.rotate ?
          true :
          ob.relativeTo(b) === ob.rotation && (
            !b.block.rotate ?
              true :
              (function(b_f) {
                return b_f == null || b_f.ex_getHeatTransfered == null;
              })(b.nearby(Mathf.mod(b.rotation + 2, 4)))
          )
      ) && (
        !b.block.rotate ?
          true :
          b.relativeTo(ob) !== b.rotation
      ),
      ob => b.heatTransTgs.push(ob),
    );
  };


  function comp_ex_updateHeatSupplyTgs(b) {
    if(b.block.delegee.skipHeatSupply) return;

    b.heatSupplyTgs.clear();
    b.proximity.each(
      ob => (!b.block.rotate ? true : b.relativeTo(ob) === b.rotation)
        && (ob.ex_handleExtHeat != null || ob.block.consumesLiquid(VARGEN.auxHeat)),
      ob => b.heatSupplyTgs.push(ob),
    );
  };


  function comp_ex_calcTempTg(b) {
    let heat, heatTg = 0.0;
    b.maxHeaterProd = 0.0;

    if(!b.block.delegee.skipHeatFetch) {
      b.heatFetchTgs.forEachRow(2, (ob, sideFrac) => {
        heat = ob.ex_getHeatProd != null ?
          (ob.ex_getHeatProd() * sideFrac) :
          (FRAG_fluid.addLiquid(ob, ob, VARGEN.auxHeat, -MDL_recipeDict._prodAmt(VARGEN.auxHeat, ob.block) * sideFrac, true, true) * MDL_recipeDict._prodAmt(VARGEN.auxHeat, ob.block) * sideFrac);
        b.maxHeaterProd = Math.max(heat, b.maxHeaterProd);
        heatTg += heat;
      });
    };

    if(!b.block.delegee.skipHeatTrans) {
      b.heatTransTgs.forEachFast(ob => {
        heatTg += ob.ex_getHeatTransfered();
        b.maxHeaterProd = Math.max(tryFun(ob.ex_getMaxHeaterProd, ob, 0.0), b.maxHeaterProd);
      });
    };

    return heatTg;
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
        // @PARAM: How fast the heat block warms up.
        heatTransRate: 0.0008,
        // @PARAM: Whether this block should not gain heat from producers.
        skipHeatFetch: false,
        // @PARAM: Whether this block should not transfer heat from other heat blocks.
        skipHeatTrans: false,
        // @PARAM: Whether this block should not supply heat for consumers.
        skipHeatSupply: false,

        heatBlkMeltTemp: 0.0,
        heatReg: null,
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
        tempCur: 0.0,
        tempRiseTg: 0.0,
        maxHeaterProd: 0.0,
        heatFetchTgs: prov(() => []),
        heatTransTgs: prov(() => []),
        heatSupplyTgs: prov(() => []),
        heatSupplyIncre: 0,
      }),


      created: function() {
        comp_created(this);
      },


      onProximityUpdate: function() {
        comp_onProximityUpdate(this);
      },


      pickedUp: function() {
        comp_pickedUp(this);
      },


      updateTile: function() {
        comp_updateTile(this);
      },


      draw: function() {
        comp_draw(this);
      },


      ex_updateHeatFetchTgs: function() {
        comp_ex_updateHeatFetchTgs(this);
      }
      .setProp({
        noSuper: true,
      }),


      ex_updateHeatTransTgs: function() {
        comp_ex_updateHeatTransTgs(this);
      }
      .setProp({
        noSuper: true,
      }),


      ex_updateHeatSupplyTgs: function() {
        comp_ex_updateHeatSupplyTgs(this);
      }
      .setProp({
        noSuper: true,
      }),


      ex_calcTempTg: function() {
        return comp_ex_calcTempTg(this);
      }
      .setProp({
        noSuper: true,
      }),


      ex_getHeat: function() {
        return this.tempCur;
      }
      .setProp({
        noSuper: true,
      }),


      ex_getHeatFrac: function() {
        return Mathf.clamp(this.tempCur / this.block.delegee.heatBlkMeltTemp);
      }
      .setProp({
        noSuper: true,
      }),


      ex_getHeatTransfered: function() {
        return this.tempCur;
      }
      .setProp({
        noSuper: true,
      }),


      ex_getHeatSupplied: function() {
        // Single heater with larger output rate => more efficienct heat transfer
        return b.tempCur <= b.maxHeaterProd ?
          b.tempCur :
          (Math.sqrt(Math.pow(b.maxHeaterProd, 2) * 4.0 + b.tempCur * b.maxHeaterProd * 4.0) - b.maxHeaterProd * (Math.sqrt(2) * 2.0 - 1.0));
      }
      .setProp({
        noSuper: true,
      }),


      ex_processData: function(wr0rd, LCRevi) {
        processData(
          wr0rd, LCRevi,

          (wr, revi) => {
            wr.f(this.tempCur);
          },

          (rd, revi) => {
            let temp = rd.f();
            this.tempCur = temp;
            this.tempRiseTg = temp;
          },
        );
      }
      .setProp({
        noSuper: true,
        argLen: 2,
      }),


    }),


  ];
