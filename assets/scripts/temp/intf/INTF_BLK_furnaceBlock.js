/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const INTF = require("lovec/temp/intf/INTF_BLK_heatBlock");


  /* <---------- component ----------> */


  function comp_init(blk) {
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
  };


  function comp_setStats(blk) {
    if(!blk.noFuelInput) {
      blk.stats.add(fetchStat("lovec", "blk0fac-fuel"), newStatValue(tb => {
        tb.row();
        MDL_table.__pnFixed(tb, pnTb => {
          let matArr = [[
            "",
            fetchStat("lovec", "rs0fuel-point").localized(),
            fetchStat("lovec", "rs0fuel-level").localized(),
          ]];
          MDL_fuel._fuelArr(blk).forEachFast(rs => {
            matArr.push([
              rs,
              rs instanceof Liquid ? "-" : (MDL_fuel._fuelPon(rs) / blk.fuelConsMtp).color(blk.fuelConsMtp.fEqual(1.0) ? Color.white : blk.fuelConsMtp > 1.0 ? Pal.remove : Pal.heal),
              (MDL_fuel._fuelLvl(rs) * blk.fuelLvlMtp).color(blk.fuelLvlMtp.fEqual(1.0) ? Color.white : blk.fuelLvlMtp < 1.0 ? Pal.remove : Pal.heal),
            ]);
          });
          MDL_table._l_table(pnTb, matArr);
        }, null, 300.0).left().padLeft(28.0);
      }));

      if(!blk.fuelConsMtp.fEqual(1.0)) blk.stats.add(fetchStat("lovec", "blk0fac-fuelconsmtp"), blk.fuelConsMtp.perc());
      if(!blk.fuelLvlMtp.fEqual(1.0)) blk.stats.add(fetchStat("lovec", "blk0fac-fuellvlmtp"), blk.fuelLvlMtp.perc());
    };
  };


  function comp_setBars(blk) {
    blk.removeBar("lovec-temp");
    blk.addBar("lovec-furnace-temp", b => new Bar(
      prov(() => Core.bundle.format("bar.heatpercent", Strings.fixed(b.delegee.tempCur, 2) + " " + fetchStatUnit("lovec", "heatunits").localized(), b.delegee.furnEffc.roundFixed(2) * 100.0)),
      prov(() => Tmp.c2.set(Color.darkGray).lerp(Pal.lightOrange, b.delegee.heatFrac)),
      () => b.delegee.heatFrac,
    ));
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

    // Occasionally update fuel consumption status
    if(TIMER.heat && b.fuelTup != null && b.fuelTup[0] != null) {
      b.ex_updateFuelConsumption(b.fuelTup[0], b.fuelTup[1]);
    };

    // Update furnace efficiency
    b.furnEffc = b.cheating() ?
      1.0 :
      !b.ex_checkHeatingValid() ?
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
    MDL_table._s_ct(
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


    /**
     * Handles methods for fuel consumption.
     * @class INTF_BLK_furnaceBlock
     * @extends INTF_BLK_heatBlock
     */
    new CLS_interface({


      __PARAM_OBJ_SETTER__: (() => ({


        /**
         * <PARAM>: If true, this furnace cannot warm up on its own.
         * @memberof INTF_BLK_furnaceBlock
         * @instance
         */
        noFuelInput: false,
        /**
         * <PARAM>: Type of fuel to consume.
         * <br> <VALS>: "item", "liquid", "gas", "any".
         * @memberof INTF_BLK_furnaceBlock
         * @instance
         */
        fuelType: "item",
        /**
         * <PARAM>: List of resources that annot be consumed as fuel.
         * @memberof INTF_BLK_furnaceBlock
         * @instance
         */
        blockedFuels: prov(() => []),
        /**
         * <PARAM>: If not null, this furnace can only consume these fuels.
         * @memberof INTF_BLK_furnaceBlock
         * @instance
         */
        allowedFuels: null,
        /**
         * <PARAM>: Multiplier on fuel consumption.
         * @memberof INTF_BLK_furnaceBlock
         * @instance
         */
        fuelConsMtp: 1.0,
        /**
         * <PARAM>: Multiplier on fuel level.
         * @memberof INTF_BLK_furnaceBlock
         * @instance
         */
        fuelLvlMtp: 1.0,
        /**
         * <PARAM>
         * @override
         * @memberof INTF_BLK_furnaceBlock
         * @instance
         */
        heatWarmupRate: 0.0001,
        /**
         * <PARAM>
         * @override
         * @memberof INTF_BLK_furnaceBlock
         * @instance
         */
        heatLightRad: 40.0,


        /* <------------------------------ internal ------------------------------ */


        /**
         * <INTERNAL>
         * @memberof INTF_BLK_furnaceBlock
         * @instance
         */
        skipHeatTrans: true,
        /**
         * <INTERNAL>
         * @memberof INTF_BLK_furnaceBlock
         * @instance
         */
        skipHeatSupply: true,


      }))
      .setProp({
        mergeMode: "object",
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


    }).extendInterface(INTF[0], "INTF_BLK_furnaceBlock"),


    /**
     * @class INTF_B_furnaceBlock
     * @extends INTF_B_heatBlock
     */
    new CLS_interface({


      __PARAM_OBJ_SETTER__: (() => ({


        /* <------------------------------ internal ------------------------------ */


        /**
         * <INTERNAL>
         * @memberof INTF_B_furnaceBlock
         * @instance
         */
        tempFuel: 0.0,
        /**
         * <INTERNAL>
         * @memberof INTF_B_furnaceBlock
         * @instance
         */
        fuelPonCur: 0.0,
        /**
         * <INTERNAL>
         * @memberof INTF_B_furnaceBlock
         * @instance
         */
        fuelSel: null,
        /**
         * <INTERNAL>
         * @memberof INTF_B_furnaceBlock
         * @instance
         */
        fuelTup: null,
        /**
         * <INTERNAL>
         * @memberof INTF_B_furnaceBlock
         * @instance
         */
        fuelEffc: 0.0,
        /**
         * <INTERNAL>
         * @memberof INTF_B_furnaceBlock
         * @instance
         */
        furnEffc: 0.0,
        /**
         * <INTERNAL>
         * @memberof INTF_B_furnaceBlock
         * @instance
         */
        fuelPolProd: 0.0,


      }))
      .setProp({
        mergeMode: "object",
      }),


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


      /**
       * @memberof INTF_B_furnaceBlock
       * @instance
       * @param {Resource} fuel
       * @param {number} pon
       * @return {void}
       */
      ex_updateFuelConsumption: function(fuel, pon) {
        comp_ex_updateFuelConsumption(this, fuel, pon);
      }
      .setProp({
        noSuper: true,
        argLen: 2,
      }),


      /**
       * @memberof INTF_B_furnaceBlock
       * @instance
       * @return {void}
       */
      ex_postUpdateEfficiencyMultiplier: function() {
        comp_ex_postUpdateEfficiencyMultiplier(this);
      }
      .setProp({
        noSuper: true,
      }),


      /**
       * @override
       * @memberof INTF_B_furnaceBlock
       * @instance
       * @return {number}
       */
      ex_calcTempTg: function thisFun() {
        return Math.max(thisFun.funPrev.apply(this, arguments), this.tempFuel);
      }
      .setProp({
        noSuper: true,
        override: true,
      }),


      /**
       * @override
       * @memberof INTF_B_furnaceBlock
       * @instance
       * @return {number}
       */
      ex_calcTempTgFrac: function() {
        return comp_ex_calcTempTgFrac(this);
      }
      .setProp({
        noSuper: true,
        override: true,
      }),


      /**
       * <br> <LATER>
       * @override
       * @memberof INTF_B_furnaceBlock
       * @instance
       * @return {number}
       */
      ex_getHeatTg: function() {
        return PARAM.glbHeat;
      }
      .setProp({
        noSuper: true,
        override: true,
      }),


      /**
       * Expected maximum temperature allowed for current recipe.
       * <br> <LATER>
       * @memberof INTF_B_furnaceBlock
       * @instance
       * @return {number}
       */
      ex_getHeatAllowed: function() {
        return Infinity;
      }
      .setProp({
        noSuper: true,
      }),


      /**
       * @override
       * @memberof INTF_B_furnaceBlock
       * @instance
       * @return {boolean}
       */
      ex_checkHeatingValid: function() {
        return this.tempRiseTg - PARAM.glbHeat >= 10.0;
      }
      .setProp({
        noSuper: true,
        override: true,
      }),


      /**
       * @memberof INTF_B_furnaceBlock
       * @instance
       * @param {Table} tb
       * @return {void}
       */
      ex_buildFuelSelector: function(tb) {
        comp_ex_buildFuelSelector(this, tb);
      }
      .setProp({
        noSuper: true,
      }),


      /**
       * @memberof INTF_B_furnaceBlock
       * @instance
       * @param {Writes|Reads} wr0rd
       * @return {void}
       */
      ex_processData: function(wr0rd) {
        processData(
          wr0rd, this.LCRevi,

          (wr, revi) => {
            MDL_io._wr_ct(wr, this.fuelSel);
          },

          (rd, revi) => {
            this.fuelSel = MDL_io._rd_ct(rd);
          },
        );
      }
      .setProp({
        noSuper: true,
        argLen: 1,
      }),


    }).extendInterface(INTF[1], "INTF_B_furnaceBlock"),


  ];
