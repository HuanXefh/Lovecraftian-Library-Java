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

    MDL_event.onLoadPost(() => {
      MDL_fuel.getFuelArr(blk).forEachFast(rs => {
        rs instanceof Item ?
        MDL_recipeDict.addItmConsTerm(blk, rs, 1, 1.0, {icon: "lovec-icon-fuel", item: MDL_fuel.getFuelPon(rs) * 60.0 / blk.fuelConsMtp}) :
        MDL_recipeDict.addFldConsTerm(blk, rs, MDL_fuel.getFuelPon(rs) * blk.fuelConsMtp, {icon: "lovec-icon-fuel"});
      });
    });
  };


  function comp_setStats(blk) {
    if(!blk.noFuelInput) {
      blk.stats.add(fetchStat("lovec", "blk0fac-fuel"), newStatValue(tb => {
        tb.row();
        MDL_table.pnFixed(tb, pnTb => {
          let matArr = [[
            "",
            tb1 => tb1.add(fetchStat("lovec", "rs0fuel-point").localized()).tooltip(MDL_bundle.getInfo("lovec", "tt-fuel-point")),
            tb1 => tb1.add(fetchStat("lovec", "rs0fuel-level").localized()).tooltip(MDL_bundle.getInfo("lovec", "tt-fuel-level")),
          ]];
          MDL_fuel.getFuelArr(blk).forEachFast(rs => {
            matArr.push([
              rs,
              rs instanceof Liquid ? "-" : (MDL_fuel.getFuelPon(rs) / blk.fuelConsMtp).color(blk.fuelConsMtp.fEqual(1.0) ? Color.white : blk.fuelConsMtp > 1.0 ? Pal.remove : Pal.heal),
              (MDL_fuel.getFuelLvl(rs) * blk.fuelLvlMtp).color(blk.fuelLvlMtp.fEqual(1.0) ? Color.white : blk.fuelLvlMtp < 1.0 ? Pal.remove : Pal.heal),
            ]);
          });
          MDL_table.setTable(pnTb, matArr);
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
      prov(() => Tmp.c2.set(Color.darkGray).lerp(Pal.lightOrange, b.ex_getHeatFrac())),
      () => b.ex_getHeatFrac(),
    ));
  };


  function comp_updateTile(b) {
    if(DEBUG.skipFurnUpdate) return;

    // Update currently used fuel
    if(TIMER.secFive && !b.block.delegee.noFuelInput) {
      b.fuelTup = MDL_fuel.getFuelTup(b.fuelTup, b);
      b.tempFuel = b.fuelTup[0] == null ?
        0.0 :
        (b.fuelTup[2] * 100.0 * b.block.delegee.fuelLvlMtp);
      b.fuelPolProd = b.fuelTup[0] == null ?
        0.0 :
        MDL_pollution.getRsPol(b.fuelTup[0]);
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
      Mathf.clamp(Math.min(
        Math.pow(b.tempCur / b.ex_getHeatTarget(), 1.5),
        !isFinite(b.ex_getHeatAllowed()) ? Infinity : ((b.ex_getHeatAllowed() - 2.0 * b.tempCur) / b.ex_getHeatAllowed() + 2.0),
      ));
    if(b.furnEffc < 0.15) b.furnEffc = 0.0;
    if(b.tempExt <= b.tempFuel && b.maxHeaterProd <= b.tempFuel) b.furnEffc *= b.fuelEffc;
  };


  function comp_updateEfficiencyMultiplier(b) {
    b.efficiency *= b.cheating() ? 1.0 : b.furnEffc;
  };


  function comp_acceptItem(b, b_f, itm) {
    return b.block.delegee.noFuelInput ?
      b.items != null :
      b.items != null && b.items.get(itm) < b.getMaximumAccepted(itm) && (b.fuelSel != null ? itm === b.fuelSel : MDL_fuel.checkFuelInput(b.block, itm));
  };


  function comp_acceptLiquid(b, b_f, liq) {
    return b.block.delegee.noFuelInput ?
      b.liquids != null :
      b.liquids != null && b.liquids.get(liq) < b.block.liquidCapacity && (b.fuelSel != null ? liq === b.fuelSel : MDL_fuel.checkFuelInput(b.block, liq));
  };


  function comp_ex_updateFuelConsumption(b, fuel, pon) {
    b.fuelEffc = 1.0;

    if(fuel instanceof Item) {
      if(b.fuelPonCur < 1.0 && pon > 0.0 && FRAG_item.consumeItem(b, fuel, 1)) b.fuelPonCur += pon;
      if(b.fuelPonCur < 1.0) b.fuelEffc = 0.0;
      b.fuelPonCur = Mathf.maxZero(b.fuelPonCur - VAR.time.heatIntv / 60.0 * b.block.delegee.fuelConsMtp);
    } else {
      b.fuelPonCur = LCCraftingHandler.addLiquid(b, b, fuel, -pon * b.block.delegee.fuelConsMtp * VAR.time.heatIntv, false, false, true);
      b.fuelEffc = Math.min(b.fuelPonCur, 1.0);
    };
  };


  function comp_ex_postUpdateEfficiencyMultiplier(b) {
    comp_updateEfficiencyMultiplier(b);
  };


  function comp_ex_calcTempTargetFrac(b) {
    // If external heat outruns fuel heat
    if(b.tempExt > b.tempFuel || b.maxHeaterProd > b.tempFuel) return 1.0;
    // If no fuel supplied
    if(b.fuelTup[0] == null || b.fuelPonCur < 0.0001) return 0.0;
    if(b.fuelTup[0] instanceof Item) {
      if(b.items == null || !b.items.has(b.fuelTup[0])) return 0.0;
    } else {
      if(b.liquids == null || !b.liquids.get(b.fuelTup[0]) < 0.01) return 0.0;
    };

    return 1.0;
  };


  function comp_ex_buildFuelSelector(b, tb) {
    MDL_table.setCtSelect(
      tb, b.block, MDL_fuel.getFuelArr(b.block),
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


      __paramObjM__: (() => ({


        /**
         * `PARAM`: If true, this furnace cannot warm up on its own.
         * @memberof INTF_BLK_furnaceBlock
         * @instance
         */
        noFuelInput: false,
        /**
         * `PARAM`: Type of fuel to consume, see {@link MDL_fuel}.
         * @memberof INTF_BLK_furnaceBlock
         * @instance
         */
        fuelType: FuelTypes.ITEM,
        /**
         * `PARAM`: List of resources that annot be consumed as fuel.
         * @memberof INTF_BLK_furnaceBlock
         * @instance
         */
        blockedFuels: tprov(() => []),
        /**
         * `PARAM`: If not null, this furnace can only consume these fuels.
         * @memberof INTF_BLK_furnaceBlock
         * @instance
         */
        allowedFuels: null,
        /**
         * `PARAM`: Multiplier on fuel consumption.
         * @memberof INTF_BLK_furnaceBlock
         * @instance
         */
        fuelConsMtp: 1.0,
        /**
         * `PARAM`: Multiplier on fuel level.
         * @memberof INTF_BLK_furnaceBlock
         * @instance
         */
        fuelLvlMtp: 1.0,
        /**
         * `PARAM`
         * @override
         * @memberof INTF_BLK_furnaceBlock
         * @instance
         */
        heatWarmupRate: 0.0001,
        /**
         * `PARAM`
         * @override
         * @memberof INTF_BLK_furnaceBlock
         * @instance
         */
        heatLightRad: 40.0,


        /* <------------------------------ internal ------------------------------ */


        /**
         * `INTERNAL`: Toggle this if `acceptXxx` from this interface is the last template method to be mixed.
         * @memberof INTF_BLK_furnaceBlock
         * @instance
         */
        useAndOperForAccept: false,
        /**
         * `INTERNAL`
         * @override
         * @memberof INTF_BLK_furnaceBlock
         * @instance
         */
        skipHeatTrans: true,
        /**
         * `INTERNAL`
         * @override
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
        return MDL_fuel.checkFuelInput(this, itm);
      }
      .setProp({
        boolMode: "or",
      }),


      consumesLiquid: function(liq) {
        return MDL_fuel.checkFuelInput(this, liq);
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


      __paramObjM__: (() => ({


        /* <------------------------------ internal ------------------------------ */


        /**
         * `INTERNAL`
         * @memberof INTF_B_furnaceBlock
         * @instance
         */
        tempFuel: 0.0,
        /**
         * `INTERNAL`
         * @memberof INTF_B_furnaceBlock
         * @instance
         */
        fuelPonCur: 0.0,
        /**
         * `INTERNAL`
         * @memberof INTF_B_furnaceBlock
         * @instance
         */
        fuelSel: null,
        /**
         * `INTERNAL`
         * @memberof INTF_B_furnaceBlock
         * @instance
         */
        fuelTup: tprov(() => []),
        /**
         * `INTERNAL`
         * @memberof INTF_B_furnaceBlock
         * @instance
         */
        fuelEffc: 0.0,
        /**
         * `INTERNAL`
         * @memberof INTF_B_furnaceBlock
         * @instance
         */
        furnEffc: 0.0,
        /**
         * `INTERNAL`
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
        mergeMode: function(valPrev, val) {
          return this.block.delegee.noFuelInput || this.block.delegee.useAndOperForAccept ?
            val && valPrev :
            val || valPrev;
        },
      }),


      acceptLiquid: function(b_f, liq) {
        return comp_acceptLiquid(this, b_f, liq);
      }
      .setProp({
        mergeMode: function(valPrev, val) {
          return this.block.delegee.noFuelInput || this.block.delegee.useAndOperForAccept ?
            val && valPrev :
            val || valPrev;
        },
      }),


      canDump: function(b_t, itm) {
        return this.fuelTup[0] == null || this.fuelTup[0].id != itm.id || this.items.has(itm, 5);
      }
      .setProp({
        boolMode: "and",
      }),


      warmupTarget: function() {
        return this.cheating() ? 1.0 : this.ex_getHeatFrac();
      }
      .setProp({
        noSuper: true,
        mergeMode: function(valPrev, val) {
          return val * valPrev;
        },
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
      ex_calcTempTarget: function thisFun() {
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
      ex_calcTempTargetFrac: function() {
        return comp_ex_calcTempTargetFrac(this);
      }
      .setProp({
        noSuper: true,
        override: true,
      }),


      /**
       * `LATER`
       * @override
       * @memberof INTF_B_furnaceBlock
       * @instance
       * @return {number}
       */
      ex_getHeatTarget: function() {
        return PARAM.GLOBAL_HEAT;
      }
      .setProp({
        noSuper: true,
        override: true,
      }),


      /**
       * Expected maximum temperature allowed for current recipe.
       * <br> `LATER`
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
        return this.tempRiseTarget - PARAM.GLOBAL_HEAT >= 10.0;
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
          wr0rd,

          wr => {
            MDL_io.ct(wr, this.fuelSel);
          },

          rd => {
            this.fuelSel = MDL_io.ct(rd);
          },
        );
      }
      .setProp({
        noSuper: true,
        argLen: 1,
      }),


    }).extendInterface(INTF[1], "INTF_B_furnaceBlock"),


  ];
