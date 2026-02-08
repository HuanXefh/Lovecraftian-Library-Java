/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * Handles pressure production methods.
   * ---------------------------------------- */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const CLS_interface = require("lovec/cls/struct/CLS_interface");
  const PARAM = require("lovec/glb/GLB_param");
  const VARGEN = require("lovec/glb/GLB_varGen");


  const FRAG_fluid = require("lovec/frag/FRAG_fluid");


  const MDL_cond = require("lovec/mdl/MDL_cond");


  /* <---------- component ----------> */


  function comp_init(blk) {
    if(!blk.hasLiquids) ERROR_HANDLER.throw("noLiquidModule", blk.name);
  };


  function comp_setStats(blk) {
    if(!blk.presProd.fEqual(0.0)) {
      blk.stats.add(blk.presProd > 0.0 ? fetchStat("lovec", "blk0liq-presoutput") : fetchStat("lovec", "blk0liq-vacoutput"), Math.abs(blk.presProd * 60.0), StatUnit.perSecond);
    };
  };


  function comp_onProximityUpdate(b) {
    b.ex_updatePresDumpTgs();
  };


  function comp_pickedUp(b) {
    b.presDumpTgs.clear();
  };


  function comp_updateTile(b) {
    if(PARAM.updateSuppressed) return;
    let presProd = b.block.delegee.presProd;
    if(presProd.fEqual(0.0)) return;
    let aux = presProd > 0.0 ? VARGEN.auxPres : VARGEN.auxVac;

    FRAG_fluid.addLiquid(b, b, aux, Math.abs(presProd), true);
    if(!b.ex_dumpPres(Math.abs(presProd), presProd < 0.0)) {
      b.dumpLiquid(aux, 2.0);
    };
  };


  function comp_ex_updatePresDumpTgs(b) {
    b.presDumpTgs.clear();
    let fldType1, fldType2;
    b.proximity.each(ob => {
      if(tryJsProp(ob, "presBase") == null) return;
      if(ob.block.rotate && (!MDL_cond._isNoSideBlock(ob.block) ? ob.relativeTo(b) === ob.rotation : b.relativeTo(ob) !== ob.rotation)) return;
      fldType1 = b.block.delegee.presFldType;
      fldType2 = tryJsProp(ob.block, "fldType", "any");
      if(fldType1 !== "any" && fldType2 !== "any" && fldType1 !== fldType2) return;
      b.presDumpTgs.push(ob);
    });
  };


  function comp_ex_dumpPres(b, rate, isVac) {
    if(b.presDumpTgs.length === 0) return false;
    let b_t = b.presDumpTgs[b.presDumpIncre % b.presDumpTgs.length];
    b.presDumpIncre++;
    if(!b_t.added || b_t.isPayload()) return false;
    let amtTrans = FRAG_fluid.addLiquid(b, b, !isVac ? VARGEN.auxPres : VARGEN.auxVac, -rate);
    if(amtTrans < 0.0001) return false;

    b_t.delegee.presBase = b_t.delegee.presBase + amtTrans * (isVac ? -1.0 : 1.0);

    return true;
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
        // @PARAM: Pressure produced by this block per frame, can be negative for vacuum production.
        presProd: 0.0,
        // @PARAM: Fluid type restriction for pressure dumping. See (INTF_BLK_fluidTypeFilter).
        presFldType: "any",
      }),


      init: function() {
        comp_init(this);
      },


      setStats: function() {
        comp_setStats(this);
      },


    }),


    // Building
    new CLS_interface({


      __PARAM_OBJ_SETTER__: () => ({
        presDumpTgs: prov(() => []),
        presDumpIncre: 0,
      }),


      onProximityUpdate: function() {
        comp_onProximityUpdate(this);
      },


      pickedUp: function() {
        comp_pickedUp(this);
      },


      updateTile: function() {
        comp_updateTile(this);
      },


      ex_updatePresDumpTgs: function() {
        comp_ex_updatePresDumpTgs(this);
      }
      .setProp({
        noSuper: true,
      }),


      ex_dumpPres: function(rate, isVac) {
        comp_ex_dumpPres(this, rate, isVac);
      }
      .setProp({
        noSuper: true,
        argLen: 2,
      }),


    }),


  ];
