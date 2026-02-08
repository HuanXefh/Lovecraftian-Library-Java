/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * Handles methods for fuel consumption.
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


  const CLS_window = require("lovec/cls/ui/CLS_window");


  const FRAG_attack = require("lovec/frag/FRAG_attack");
  const FRAG_fluid = require("lovec/frag/FRAG_fluid");
  const FRAG_item = require("lovec/frag/FRAG_item");


  const MDL_bundle = require("lovec/mdl/MDL_bundle");
  const MDL_draw = require("lovec/mdl/MDL_draw");
  const MDL_event = require("lovec/mdl/MDL_event");
  const MDL_flow = require("lovec/mdl/MDL_flow");
  const MDL_fuel = require("lovec/mdl/MDL_fuel");
  const MDL_io = require("lovec/mdl/MDL_io");
  const MDL_pollution = require("lovec/mdl/MDL_pollution");
  const MDL_recipeDict = require("lovec/mdl/MDL_recipeDict");
  const MDL_table = require("lovec/mdl/MDL_table");


  /* <---------- component ----------> */


  function comp_init(blk) {
    blk.clipSize += 140.0;
    blk.fuelTempRes = MDL_flow._heatRes(blk);
    blk.furnLightTempReq = Math.max(blk.furnLightTempReq, 60.01);

    if(!blk.noFuelInput) blk.configurable = true;

    MDL_event._c_onLoad(() => {
      Core.app.post(() => {
        MDL_fuel._fuelArr(blk).forEachFast(rs => {
          rs instanceof Item ?
            MDL_recipeDict.addItmConsTerm(blk, rs, 1, 1.0, {icon: "lovec-icon-fuel", item: MDL_fuel._fuelPon(rs) * 60.0 / blk.fuelConsMtp}) :
            MDL_recipeDict.addFldConsTerm(blk, rs, MDL_fuel._fuelPon(rs) * blk.fuelConsMtp, {icon: "lovec-icon-fuel"});
        });
      });
    });

    blk.ex_addLogicGetter(LAccess.heat, b => b.delegee.tempCur / 100.0);
  };


  function comp_load(blk) {
    blk.fuelHeatReg = fetchRegionOrNull(blk, "-fuel-heat", "-heat");
  };


  function comp_setStats(blk) {
    if(!blk.noFuelInput) {
      blk.stats.add(fetchStat("lovec", "blk0fac-fuel"), newStatValue(tb => {
        tb.row();
        MDL_table.__btnSmall(tb, "?", () => {
          new CLS_window(
            "[$1] ([$2])".format(MDL_bundle._term("lovec", "fuel"), blk.localizedName),
            tb1 => MDL_table.setDisplay_ctLi(tb1, MDL_fuel._fuelArr(blk), null, 10),
          ).add();
        }).left().padLeft(28.0);
      }));

      if(!blk.fuelConsMtp.fEqual(1.0)) blk.stats.add(fetchStat("lovec", "blk0fac-fuelconsmtp"), blk.fuelConsMtp.perc());
      if(!blk.fuelLvlMtp.fEqual(1.0)) blk.stats.add(fetchStat("lovec", "blk0fac-fuellvlmtp"), blk.fuelLvlMtp.perc());
    };

    if(!blk.tempExtMtp.fEqual(1.0)) blk.stats.add(fetchStat("lovec", "blk0fac-extheatmtp"), blk.tempExtMtp.perc());
    if(isFinite(blk.fuelTempRes)) blk.stats.add(fetchStat("lovec", "blk0heat-heatres"), blk.fuelTempRes, fetchStatUnit("lovec", "heatunits"));
  };


  function comp_setBars(blk) {
    blk.addBar("lovec-furnace-temp", b => new Bar(
      prov(() => Core.bundle.format("bar.heatpercent", Strings.fixed(b.delegee.tempCur, 2) + " " + fetchStatUnit("lovec", "heatunits").localized(), b.delegee.furnEffc.roundFixed(2) * 100.0)),
      prov(() => Tmp.c2.set(Color.darkGray).lerp(Pal.lightOrange, b.delegee.heatFrac)),
      () => b.delegee.heatFrac,
    ));
  };


  function comp_created(b) {
    b.tempCur = PARAM.glbHeat;
  };


  function comp_updateTile(b) {
    // Update currently used fuel
    if(TIMER.secFive && !b.block.delegee.noFuelInput) {
      b.fuelTup = MDL_fuel._fuelTup(b);
      b.tempFuel = b.fuelTup == null ?
        0.0 :
        (b.fuelTup[2] * 100.0 * b.block.delegee.fuelLvlMtp);
      b.fuelPolProd = b.fuelTup == null ?
        0.0 :
        MDL_pollution._rsPol(b.fuelTup[0]);
    };

    // Add dynamic pollution
    if(TIMER.sec && b.fuelPonCur > 0.0) {
      MDL_pollution.addDynaPol(b.fuelPolProd);
    };

    // External heat control
    if(b.extHeatCd > 0.0) {
      b.extHeatCd -= Time.delta;
    } else {
      b.tempExt = 0.0;
    };

    // Update furnace temperature and apply damage if overheated
    if(!PARAM.updateSuppressed && TIMER.secHalf) {
      b.tempRiseTg = Math.max(b.tempFuel, b.tempExt, PARAM.glbHeat);
      b.tempCur = Mathf.lerp(b.tempCur, Mathf.lerp(PARAM.glbHeat, b.tempRiseTg, !b.ex_checkFurnProdValid() ? 0.0 : b.ex_calcTempTgFrac()), b.block.delegee.fuelWarmupRate * 30.0);
      if(b.tempCur > b.block.delegee.fuelTempRes) FRAG_attack.damage(b, (VAR.blk_corDmgMin + VAR.blk_corDmgFrac * b.maxHealth) * (b.tempCur - b.block.delegee.fuelTempRes) / 50.0, 0.0, "heat");
    };

    // Occasionally update fuel consumption status
    if(TIMER.heat && b.fuelTup != null && b.fuelTup != null && b.fuelTup[0] != null) {
      b.ex_updateFuelConsumption(b.fuelTup[0], b.fuelTup[1]);
    };

    // Update heat fraction
    if(TIMER.secQuarter) {
      b.heatFrac = Mathf.clamp(b.tempCur / Math.max(b.ex_getHeatTg(), 100.0));
    };

    // Update furnace efficiency
    b.furnEffc = b.cheating() ?
      1.0 :
      !b.ex_checkFurnProdValid() ?
        0.0 :
        Mathf.clamp(Math.min(
          Math.pow(b.tempCur / b.ex_getHeatTg(), 1.5),
          !isFinite(b.ex_getHeatAllowed()) ? Infinity : (b.ex_getHeatAllowed() - 2.0 * b.tempCur) / b.ex_getHeatAllowed() + 2.0,
        ));
    if(b.furnEffc < 0.15) b.furnEffc = 0.0;
    if(b.tempExt <= b.tempFuel) b.furnEffc *= b.fuelEffc;
  };


  function comp_updateEfficiencyMultiplier(b) {
    b.efficiency *= b.furnEffc;
  };


  function comp_acceptItem(b, b_f, itm) {
    return b.block.delegee.noFuelInput ?
      false :
      b.items != null && b.items.get(itm) < b.getMaximumAccepted(itm) && (b.fuelSel != null ? itm === b.fuelSel : MDL_fuel._hasFuelInput(b.block, itm));
  };


  function comp_acceptLiquid(b, b_f, liq) {
    return b.block.delegee.noFuelInput ?
      false :
      b.liquids != null && b.liquids.get(liq) < b.block.liquidCapacity && (b.fuelSel != null ? liq === b.fuelSel : MDL_fuel._hasFuelInput(b.block, liq));
  };


  function comp_draw(b) {
    if(b.isPayload()) return;

    if(PARAM.drawFurnaceHeat && b.block.delegee.furnHeatA > 0.0) {
      MDL_draw._reg_heat(b.x, b.y, Math.pow(b.heatFrac, 3) * 0.5 * b.block.delegee.furnHeatA, b.block.delegee.fuelHeatReg, b.drawrot(), b.block.size);
      MDL_draw._reg_heat(b.x, b.y, Math.pow(b.heatFrac, 3) * 0.35 * b.block.delegee.furnHeatA, VARGEN.blockHeatRegs[b.block.size + 2], b.drawrot(), b.block.size);
    };

    if(b.block.delegee.shouldDrawFurnLight) {
      MDL_draw._l_disk(b.x, b.y, Mathf.clamp((b.tempCur - 60.0) / (b.block.delegee.furnLightTempReq - 60.0)), b.block.delegee.furnLightRad, b.block.size);
    };
  };


  function comp_ex_updateFuelConsumption(b, fuel, pon) {
    b.fuelEffc = 1.0;

    if(fuel instanceof Item) {
      if(b.fuelPonCur < 1.0 && pon > 0.0 && FRAG_item.consumeItem(b, fuel, 1)) b.fuelPonCur += pon;
      if(b.fuelPonCur < 1.0) b.fuelEffc = 0.0;
      b.fuelPonCur = Mathf.maxZero(b.fuelPonCur - VAR.time_heatIntv / 60.0 * b.block.delegee.fuelConsMtp);
    } else {
      b.fuelPonCur = FRAG_fluid.addLiquid(b, b, fuel, pon * b.block.delegee.fuelConsMtp * VAR.time_heatIntv, false, false, true);
      b.fuelEffc = Math.min(b.fuelPonCur, 1.0);
    };
  };


  function comp_ex_postUpdateEfficiencyMultiplier(b) {
    comp_updateEfficiencyMultiplier(b);
  };


  function comp_ex_handleExtHeat(b, amt) {
    b.tempExt = amt * b.block.delegee.tempExtMtp;
    b.extHeatCd = 300.0;
  };


  function comp_ex_calcTempTgFrac(b) {
    // If external heat outruns fuel heat
    if(b.tempExt > b.tempFuel) return 1.0;
    // If no fuel supplied
    if(b.fuelTup == null || b.fuelTup[0] == null || b.fuelPonCur < 0.0001) return 0.0;
    if(b.fuelTup[0] instanceof Item) {
      if(b.items == null || !b.items.has(b.fuelTup[0])) return 0.0;
    } else {
      if(b.liquids == null || !b.liquids.get(b.fuelTup[0]) < 0.01) return 0.0;
    };

    return 1.0;
  };


  function comp_ex_buildFuelSelector(b, tb) {
    MDL_table.setSelector_ct(
      tb, b.block, MDL_fuel._fuelArr(b.block),
      () => b.delegee.fuelSel, val => b.configure("FUEL: " + (val == null ? "null" : val.name)), false,
      b.block.selectionRows, b.block.selectionColumns - 1,
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
        // @PARAM: If {true}, this furnace cannot warmup on its own.
        noFuelInput: false,
        // @PARAM: Multiplier on external heat accepted.
        tempExtMtp: 1.0,
        // @PARAM: Type of fuel to consume. Possible values: "item", "liquid", "gas", "any".
        fuelType: "item",
        // @PARAM: List of resources that cannot be consumed as fuel.
        blockedFuels: prov(() => []),
        // @PARAM: If not {null}, this furnace can only consume these fuels.
        allowedFuels: null,
        // @PARAM: Multiplier on fuel consumption.
        fuelConsMtp: 1.0,
        // @PARAM: Multiplier on fuel level.
        fuelLvlMtp: 1.0,
        // @PARAM: How fast the furnace reaches target temperature.
        fuelWarmupRate: 0.0001,
        // @PARAM: Alpha of heat region.
        furnHeatA: 1.0,
        // @PARAM: Whether the furnace emits light.
        shouldDrawFurnLight: true,
        // @PARAM: Maximum furnace light radius.
        furnLightRad: 40.0,
        // @PARAM: Temperature at which maximum light radius is achieved.
        furnLightTempReq: 1000.0,

        fuelTempRes: Infinity,
        fuelHeatReg: null,
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


      consumesItem: function(itm) {
        return MDL_fuel._hasFuelInput(this, itm);
      }
      .setProp({
        boolMode: "or",
      }),


      consumesLiquid: function(liq) {
        return MDL_fuel._hasFuelInput(this, liq);
      }
      .setProp({
        boolMode: "or",
      }),


    }),


    // Building
    new CLS_interface({


      __PARAM_OBJ_SETTER__: () => ({
        tempCur: 0.0,
        tempExt: 0.0,
        tempFuel: 0.0,
        tempRiseTg: 0.0,
        heatFrac: 0.0,
        extHeatCd: 0.0,
        fuelPonCur: 0.0,
        fuelSel: null,
        fuelTup: null,
        fuelEffc: 0.0,
        furnEffc: 0.0,
        fuelPolProd: 0.0,
      }),


      created: function() {
        comp_created(this);
      },


      updateTile: function() {
        comp_updateTile(this);
      },


      updateEfficiencyMultiplier: function() {
        comp_updateEfficiencyMultiplier(this);
      },


      acceptItem: function(b_f, itm) {
        return comp_acceptItem(this, b_f, itm);
      }
      .setProp({
        boolMode: "or",
      }),


      acceptLiquid: function(b_f, liq) {
        return comp_acceptLiquid(this, b_f, liq);
      }
      .setProp({
        boolMode: "or",
      }),


      warmupTarget: function() {
        return this.heatFrac;
      }
      .setProp({
        noSuper: true,
      }),


      draw: function() {
        comp_draw(this);
      },


      ex_updateFuelConsumption: function(fuel, pon) {
        comp_ex_updateFuelConsumption(this, fuel, pon);
      }
      .setProp({
        noSuper: true,
        argLen: 2,
      }),


      ex_postUpdateEfficiencyMultiplier: function() {
        comp_ex_postUpdateEfficiencyMultiplier(this);
      }
      .setProp({
        noSuper: true,
      }),


      /* ----------------------------------------
       * NOTE:
       *
       * Call this to input external heat, should be called in {updateTile} of other blocks.
       * ---------------------------------------- */
      ex_handleExtHeat: function(amt) {
        comp_ex_handleExtHeat(this, amt);
      }
      .setProp({
        noSuper: true,
        argLen: 1,
      }),


      ex_calcTempTgFrac: function() {
        return comp_ex_calcTempTgFrac(this);
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


      /* ----------------------------------------
       * NOTE:
       *
       * @LATER
       * Returns the target temperature that this furnace is expected to have, based on the building status.
       * ---------------------------------------- */
      ex_getHeatTg: function() {
        return PARAM.glbHeat;
      }
      .setProp({
        noSuper: true,
      }),


      /* ----------------------------------------
       * NOTE:
       *
       * @LATER
       * Returns the maximum heat allowed for the recipe, based on the building status.
       * ---------------------------------------- */
      ex_getHeatAllowed: function() {
        return Infinity;
      }
      .setProp({
        noSuper: true,
      }),


      ex_checkFurnProdValid: function() {
        return this.tempRiseTg - PARAM.glbHeat >= 10.0;
      }
      .setProp({
        noSuper: true,
      }),


      ex_buildFuelSelector: function(tb) {
        comp_ex_buildFuelSelector(this, tb);
      }
      .setProp({
        noSuper: true,
      }),


      ex_processData: function(wr0rd, LCRevi) {
        processData(
          wr0rd, LCRevi,

          (wr, revi) => {
            wr.f(this.tempCur);
            MDL_io._wr_ct(wr, this.fuelSel);
          },

          (rd, revi) => {
            if(revi < 1) {
              rd.s();
            };

            this.tempCur = rd.f();

            if(revi > 3) {
              this.fuelSel = MDL_io._rd_ct(rd);
            };
          },
        );
      }
      .setProp({
        noSuper: true,
        argLen: 2,
      }),


    }),


  ];
