/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * Handles methods for pressure.
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


  const FRAG_attack = require("lovec/frag/FRAG_attack");
  const FRAG_fluid = require("lovec/frag/FRAG_fluid");


  const MDL_cond = require("lovec/mdl/MDL_cond");
  const MDL_flow = require("lovec/mdl/MDL_flow");
  const MDL_recipeDict = require("lovec/mdl/MDL_recipeDict");


  /* <---------- component ----------> */


  function comp_init(blk) {
    blk.presRes = MDL_flow._presRes(blk);
    blk.vacRes = MDL_flow._vacRes(blk);
  };


  function comp_setStats(blk) {
    blk.stats.add(fetchStat("lovec", "blk0liq-presres"), blk.presRes);
    blk.stats.add(fetchStat("lovec", "blk0liq-vacres"), -blk.vacRes);
    if(!blk.presThr.fEqual(0.0)) blk.stats.add(blk.presThr > 0.0 ? fetchStat("lovec", "blk0liq-presreq") : fetchStat("lovec", "blk0liq-vacreq"), Math.abs(blk.presThr));
  };


  function comp_setBars(blk) {
    blk.addBar("lovec-pressure", b => new Bar(
      prov(() => Core.bundle.format(b.delegee.presTmp >= 0.0 ? "bar.lovec-bar-pressure-amt" : "bar.lovec-bar-vacuum-amt", Strings.fixed(Math.abs(b.delegee.presTmp), 2))),
      prov(() => b.delegee.presTmp >= 0.0 ? Color.valueOf(Tmp.c1, "cce5ff") : Color.valueOf(Tmp.c1, "7898ba")),
      () => Mathf.clamp(Math.abs(b.delegee.presTmp + b.delegee.presExtra) / Math.max(b.delegee.presTmp >= 0.0 ? blk.presRes : -blk.vacRes, 0.0001)),
    ));
  };


  function comp_onDestroyed(b) {
    if(Math.abs(b.presTmp) > 0.5) {
      Damage.damage(b.x, b.y, b.block.size * Vars.tilesize * 2.5, b.maxHealth * Math.abs(b.presTmp) * 0.2);
      Fx.explosion.at(b.x, b.y, b.block.size * Vars.tilesize * 2.5);
    };
  };


  function comp_remove(b) {
    if(b.liquids.currentAmount() < 0.01) {
      b.presBase = 0.0;
      b.presTmp = 0.0;
    };

    b.super$remove();
  };


  function comp_onProximityUpdate(b) {
    b.ex_updatePresFetchTgs();
    b.ex_updatePresSupplyTgs();
  };


  function comp_pickedUp(b) {
    b.presFetchTgs.clear();
    b.presSupplyTgs.clear();
  };


  function comp_updateTile(b) {
    if(PARAM.updateSuppressed) return;

    if(TIMER.secQuarter) {
      b.ex_updatePresTg();
      b.presTmp = (b.presTmp + b.presTg) * 0.5;
      if(Math.abs(b.presTmp) < 0.005) b.presTmp = 0.0;
    };
    if(Math.abs(b.presTmp) > 0.0) {
      b.noSleep();
      if(b.next != null && b.next() != null) b.next().noSleep();
    };

    if(TIMER.sec && Math.abs(b.presTmp) > 0.0) {
      b.ex_updatePresSupplyTgs();
    };

    // Apply damage if over limit
    if(
      !PARAM.updateDeepSuppressed && TIMER.secQuarter && Mathf.chance(0.25)
        && (
          (b.presTmp + b.presExtra) > 0.0 ?
            (b.presTmp + b.presExtra) > b.block.delegee.presRes + 0.5 :
            (b.presTmp + b.presExtra) < b.block.delegee.vacRes - 0.5
        )
    ) {
      b.damagePierce((b.maxHealth * VAR.blk_presDmgFrac + VAR.blk_presDmgMin) * (
        b.presTmp > 0.0 ?
          b.presTmp / Math.max(b.block.delegee.presRes, 0.0001) :
          -b.presTmp / Math.max(-b.block.delegee.vacRes, 0.0001)
      ));
    };

    // Pressure drop
    b.presBase -= b.presBase.fEqual(0.0, 0.005) ? b.presBase : b.presBase * 0.01666667 * Time.delta;

    // Occasionally supply abstract fluid
    if(TIMER.liq && !b.block.delegee.skipPresSupply && b.presSupplyTgs.length > 0 && Math.abs(b.presTmp) > 0.0) {
      b.presSupplyIncre++;
      let b_t = b.presSupplyTgs[b.presSupplyIncre % b.presSupplyTgs.length];
      if(b_t.added && !b_t.isPayload()) {
        let addAmt = Math.abs(b.presTmp.roundFixed(0)) / 60.0;
        FRAG_fluid.addLiquid(b_t, null, b.presTmp > 0.0 ? VARGEN.auxPres : VARGEN.auxVac, addAmt * VAR.time_liqIntv, false, false, true);
        if(addAmt > (MDL_recipeDict._consAmt(b.presTmp > 0.0 ? VARGEN.auxPres : VARGEN.auxVac, b_t.block) + 5.5 / 60.0)) {
          b_t.damagePierce(b_t.maxHealth * VAR.blk_presDmgFrac + VAR.blk_presDmgMin) / 5.0;
        };
      };
    };
  };


  function comp_acceptLiquid(b, b_f, liq) {
    let presThr = b.block.delegee.presThr;
    if(presThr.fEqual(0.0)) return true;

    return presThr > 0.0 ?
      b.presTmp >= presThr - 0.1 :
      b.presTmp <= presThr + 0.1;
  };


  function comp_ex_updatePresFetchTgs(b) {
    b.presFetchTgs.clear();
    // Find all possible pressure sources
    b.proximity.each(
      ob => ob.ex_getPres != null
        && (!ob.block.rotate ? true : ob.relativeTo(b) === ob.rotation)
        && (
          !b.block.rotate ?
            true :
            MDL_cond._isNoSideBlock(b.block) ?
              b.relativeTo(ob) !== b.rotation :
              (ob.relativeTo(b) === b.rotation || (MDL_cond._isFluidConduit(b.block) ? MDL_cond._isFluidConduit(ob.block) : false))
        ),
      ob => b.presFetchTgs.push(ob),
    );
  };


  function comp_ex_updatePresSupplyTgs(b) {
    let aux = b.presTmp > 0.0 ? VARGEN.auxPres : VARGEN.auxVac;
    b.presSupplyTgs.clear();
    // Find all possible pressure consumers
    b.proximity.each(ob => {
      ob = ob.getLiquidDestination(b, aux);
      if(
        (!b.block.rotate ? true : (b.relativeTo(ob) === b.rotation))
          && ob.acceptLiquid(b, aux)
      ) {
        b.presSupplyTgs.push(ob);
      };
    });
  };


  function comp_ex_updatePresTg(b) {
    b.presTg = b.presBase;
    b.presFetchTgs.forEachFast(ob => {
      if(!ob.added || ob.isPayload()) return;
      b.presTg += tryFun(ob.ex_getPres, ob, 0.0) * tryFun(ob.ex_getPresTransScl, ob, 1.0, b);
    });
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
        // @PARAM: Pressure required for this block to operate, can be negative for vacuum requirement.
        presThr: 0.0,
        // @PARAM: Whether this block should not supply pressure/vacuum for consumers.
        skipPresSupply: false,

        presRes: 0.0,
        vacRes: 0.0,
      }),


      init: function() {
        comp_init(this);
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
        presBase: 0.0,
        presTmp: 0.0,
        presTg: 0.0,
        presExtra: 0.0,
        presFetchTgs: prov(() => []),
        presSupplyTgs: prov(() => []),
        presSupplyIncre: 0,
      }),


      onDestroyed: function() {
        comp_onDestroyed(this);
      },


      remove: function() {
        comp_remove(this);
      }
      .setProp({
        noSuper: true,
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


      acceptLiquid: function(b_f, liq) {
        return comp_acceptLiquid(this, b_f, liq);
      }
      .setProp({
        boolMode: "and",
      }),


      ex_updatePresFetchTgs: function() {
        comp_ex_updatePresFetchTgs(this);
      }
      .setProp({
        noSuper: true,
      }),


      ex_updatePresSupplyTgs: function() {
        comp_ex_updatePresSupplyTgs(this);
      }
      .setProp({
        noSuper: true,
      }),


      ex_updatePresTg: function() {
        comp_ex_updatePresTg(this);
      }
      .setProp({
        noSuper: true,
      }),


      ex_getPres: function() {
        return this.presTmp;
      }
      .setProp({
        noSuper: true,
      }),


      /* ----------------------------------------
       * NOTE:
       *
       * @LATER
       * Extra multiplier on the pressure transfered to another pressure block.
       * Rarely used.
       * ---------------------------------------- */
      ex_getPresTransScl: function(b_t) {
        return 1.0;
      }
      .setProp({
        noSuper: true,
        argLen: 1,
      }),


      ex_processData: function(wr0rd, LCRevi) {
        processData(
          wr0rd, LCRevi,

          (wr, revi) => {
            wr.f(this.presTmp);
          },

          (rd, revi) => {
            if(revi < 1) {
              return;
            };

            let pres = rd.f();
            this.presTmp = pres;
            this.presTg = pres;
          },
        );
      }
      .setProp({
        noSuper: true,
        argLen: 2,
      }),


    }),


  ];
