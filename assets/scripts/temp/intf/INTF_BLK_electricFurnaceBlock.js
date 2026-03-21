/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  /* <---------- component ----------> */


  function comp_init(blk) {
    if(!blk.hasPower) ERROR_HANDLER.throw("noPowerModule", blk.name);

    blk.clipSize += 140.0;
    blk.fuelTempRes = MDL_flow._heatRes(blk);
    blk.furnLightTempReq = Math.max(blk.furnLightTempReq, 60.01);

    MDL_event._c_onLoad(() => {
      let blkCons = new ConsumePowerDynamic(b => b.ex_calcFurnPowCons());
      blk.consumers = [blkCons];
      blk.consPower = blkCons;
    });

    blk.configurable = true;

    blk.config(JAVA.float, (b, f) => {
      b.delegee.tempSet = f;
    });

    blk.ex_addLogicGetter(LAccess.heat, b => b.delegee.tempCur / 100.0);
  };


  function comp_load(blk) {
    blk.fuelHeatReg = fetchRegionOrNull(blk, "-fuel-heat", "-heat");
  };


  function comp_setStats(blk) {
    if(!blk.tempExtMtp.fEqual(1.0)) blk.stats.add(fetchStat("lovec", "blk0fac-extheatmtp"), blk.tempExtMtp.perc());
    if(isFinite(blk.fuelTempRes)) blk.stats.add(fetchStat("lovec", "blk0heat-heatres"), blk.fuelTempRes, fetchStatUnit("lovec", "heatunits"));
    blk.stats.add(Stat.powerUse, blk.powConsBase * 60.0, StatUnit.powerSecond);
    blk.stats.add(fetchStat("lovec", "blk0pow-powuseper100hu"), blk.powConsPerFuelLvl * 60.0, StatUnit.powerSecond);
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
    // External heat control
    if(b.extHeatCd > 0.0) {
      b.extHeatCd -= Time.delta;
    } else {
      b.tempExt = 0.0;
    };

    // Update furnace temperature and apply damage if overheated
    if(!PARAM.updateSuppressed && TIMER.secHalf) {
      b.tempRiseTg = Math.max(b.tempSet, b.tempExt, PARAM.glbHeat);
      b.tempCur = Mathf.lerp(b.tempCur, Mathf.lerp(PARAM.glbHeat, b.tempRiseTg, b.tempExt > b.tempSet ? 1.0 : b.power.status), b.block.delegee.fuelWarmupRate * 30.0);
      if(b.tempCur > b.block.delegee.fuelTempRes) FRAG_attack.damage(b, (VAR.blk_corDmgMin + VAR.blk_corDmgFrac * b.maxHealth) * (b.tempCur - b.block.delegee.fuelTempRes) / 50.0, 0.0, "heat");
    };

    // Update heat fraction
    if(TIMER.secQuarter) {
      b.heatFrac = Mathf.clamp(b.tempCur / Math.max(b.ex_getHeatTg(), 100.0), 0.0, 1.0);
    };

    // Update furnace efficiency
    b.furnEffc = Mathf.clamp(Math.min(
      Math.pow(b.tempCur / b.ex_getHeatTg(), 1.5),
      !isFinite(b.ex_getHeatAllowed()) ? Infinity : (b.ex_getHeatAllowed() - 2.0 * b.tempCur) / b.ex_getHeatAllowed() + 2.0,
    ));
    if(b.furnEffc < 0.15) b.furnEffc = 0.0;
  };


  function comp_updateEfficiencyMultiplier(b) {
    b.efficiency *= b.furnEffc;
  };


  function comp_buildConfiguration(b, tb) {
    tb.row();
    b.ex_buildTempSlider(tb);
  };


  function comp_draw(b) {
    if(b.isPayload()) return;

    if(PARAM.drawFurnaceHeat && b.block.delegee.furnHeatA > 0.0) {
      MDL_draw._reg_heat(b.x, b.y, Math.pow(b.delegee.heatFrac, 3) * 0.5 * b.block.delegee.furnHeatA, b.block.delegee.fuelHeatReg, b.drawrot(), b.block.size);
      MDL_draw._reg_heat(b.x, b.y, Math.pow(b.delegee.heatFrac, 3) * 0.35 * b.block.delegee.furnHeatA, VARGEN.blockHeatRegs[b.block.size + 2], b.drawrot(), b.block.size);
    };

    if(b.block.delegee.shouldDrawFurnLight) {
      MDL_draw._l_disk(b.x, b.y, Mathf.clamp((b.tempCur - 60.0) / (b.block.delegee.furnLightTempReq - 60.0)), b.block.delegee.furnLightRad, b.block.size);
    };
  };


  function comp_ex_postUpdateEfficiencyMultiplier(b) {
    comp_updateEfficiencyMultiplier(b);
  };


  function comp_ex_handleExtHeat(b, amt) {
    b.tempExt = (b.tempExt + amt * b.block.delegee.tempExtMtp) * 0.5;
    b.extHeatCd = 300.0;
  };


  function comp_ex_buildTempSlider(b, tb) {
    tb.table(Styles.black3, tb1 => {
      tb1.left();
      MDL_table.__margin(tb1);
      MDL_table.__sliderCfg(tb1, b, () => "${1}: ${2}".format(MDL_bundle._term("lovec", "temperature"), Strings.fixed(b.tempSet, 2) + " " + fetchStatUnit("lovec", "heatunits").localized()), 0.0, b.block.delegee.fuelTempRes * b.block.delegee.maxOverheatScl, 50.0, b.tempSet);
    }).left().growX();
  };


/*
  ========================================
  Section: Application
  ========================================
*/


  module.exports = [


    /**
     * {@link INTF_BLK_furnaceBlock} but instead of consuming fuel, this will consume power dynamically.
     * @class INTF_BLK_electricFurnaceBlock
     */
    new CLS_interface("INTF_BLK_electricFurnaceBlock", {


      __PARAM_OBJ_SETTER__: () => ({


        /**
         * <PARAM>: See {@link INTF_BLK_furnaceBlock}.
         * @memberof INTF_BLK_electricFurnaceBlock
         * @instance
         */
        tempExtMtp: 1.0,
        /**
         * <PARAM>: Base power consumption regardless of temperature.
         * @memberof INTF_BLK_electricFurnaceBlock
         * @instance
         */
        powConsBase: 1.0,
        /**
         * <PARAM>: Power consumption added for each 100 HU.
         * @memberof INTF_BLK_electricFurnaceBlock
         * @instance
         */
        powConsPerFuelLvl: 1.0,
        /**
         * <PARAM>: Affects maximum temperature allowed to reach. The furnace will get damaged when overheated.
         * @memberof INTF_BLK_electricFurnaceBlock
         * @instance
         */
        maxOverheatScl: 1.5,
        /**
         * <PARAM>: See {@link INTF_BLK_furnaceBlock}.
         * @memberof INTF_BLK_electricFurnaceBlock
         * @instance
         */
        fuelWarmupRate: 0.0001,
        /**
         * <PARAM>: See {@link INTF_BLK_furnaceBlock}.
         * @memberof INTF_BLK_electricFurnaceBlock
         * @instance
         */
        furnHeatA: 1.0,
        /**
         * <PARAM>: See {@link INTF_BLK_furnaceBlock}.
         * @memberof INTF_BLK_electricFurnaceBlock
         * @instance
         */
        shouldDrawFurnLight: true,
        /**
         * <PARAM>: See {@link INTF_BLK_furnaceBlock}.
         * @memberof INTF_BLK_electricFurnaceBlock
         * @instance
         */
        furnLightRad: 40.0,
        /**
         * <PARAM>: See {@link INTF_BLK_furnaceBlock}.
         * @memberof INTF_BLK_electricFurnaceBlock
         * @instance
         */
        furnLightTempReq: 1000.0,


        /* <------------------------------ internal ------------------------------ */


        /**
         * <INTERNAL>
         * @memberof INTF_BLK_electricFurnaceBlock
         * @instance
         */
        fuelTempRes: Infinity,
        /**
         * <INTERNAL>
         * @memberof INTF_BLK_electricFurnaceBlock
         * @instance
         */
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


    }),


    /**
     * @class INTF_B_electricFurnaceBlock
     */
    new CLS_interface("INTF_B_electricFurnaceBlock", {


      __PARAM_OBJ_SETTER__: () => ({


        /* <------------------------------ internal ------------------------------ */


        /**
         * <INTERNAL>
         * @memberof INTF_B_electricFurnaceBlock
         * @instance
         */
        tempCur: 0.0,
        /**
         * <INTERNAL>
         * @memberof INTF_B_electricFurnaceBlock
         * @instance
         */
        tempExt: 0.0,
        /**
         * <INTERNAL>
         * @memberof INTF_B_electricFurnaceBlock
         * @instance
         */
        tempSet: 0.0,
        /**
         * <INTERNAL>
         * @memberof INTF_B_electricFurnaceBlock
         * @instance
         */
        tempRiseTg: 0.0,
        /**
         * <INTERNAL>
         * @memberof INTF_B_electricFurnaceBlock
         * @instance
         */
        heatFrac: 0.0,
        /**
         * <INTERNAL>
         * @memberof INTF_B_electricFurnaceBlock
         * @instance
         */
        extHeatCd: 0.0,
        /**
         * <INTERNAL>
         * @memberof INTF_B_electricFurnaceBlock
         * @instance
         */
        furnEffc: 0.0,


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


      warmupTarget: function() {
        return this.heatFrac;
      }
      .setProp({
        noSuper: true,
      }),


      buildConfiguration: function(tb) {
        comp_buildConfiguration(this, tb);
      },


      draw: function() {
        comp_draw(this);
      },


      /**
       * @memberof INTF_B_electricFurnaceBlock
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
       * See {@link INTF_B_furnaceBlock}.
       * @memberof INTF_B_electricFurnaceBlock
       * @instance
       * @param {number} amt
       * @return {void}
       */
      ex_handleExtHeat: function(amt) {
        comp_ex_handleExtHeat(this, amt);
      }
      .setProp({
        noSuper: true,
        argLen: 1,
      }),


      /**
       * Calculated current power usage.
       * @memberof INTF_B_electricFurnaceBlock
       * @instance
       * @return {number}
       */
      ex_calcFurnPowCons: function() {
        return Mathf.maxZero(this.tempSet - Math.max(this.tempExt, PARAM.glbHeat)) / 100.0 * this.block.delegee.powConsPerFuelLvl + this.block.delegee.powConsBase;
      }
      .setProp({
        noSuper: true,
      }),


      /**
       * @memberof INTF_B_electricFurnaceBlock
       * @instance
       * @return {number}
       */
      ex_getHeat: function() {
        return this.tempCur;
      }
      .setProp({
        noSuper: true,
      }),


      /**
       * See {@link INTF_B_furnaceBlock}.
       * <br> <LATER>
       * @memberof INTF_B_electricFurnaceBlock
       * @instance
       * @return {number}
       */
      ex_getHeatTg: function() {
        return PARAM.glbHeat;
      }
      .setProp({
        noSuper: true,
      }),


      /**
       * See {@link INTF_B_furnaceBlock}.
       * <br> <LATER>
       * @memberof INTF_B_electricFurnaceBlock
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
       * @memberof INTF_B_electricFurnaceBlock
       * @instance
       * @param {Table} tb
       * @return {void}
       */
      ex_buildTempSlider: function(tb) {
        comp_ex_buildTempSlider(this, tb);
      }
      .setProp({
        noSuper: true,
        argLen: 1,
      }),


      /**
       * @memberof INTF_B_electricFurnaceBlock
       * @instance
       * @param {Writes|Reads} wr0rd
       * @return {void}
       */
      ex_processData: function(wr0rd) {
        processData(
          wr0rd, this.LCRevi,

          (wr, revi) => {
            wr.f(this.tempCur);
            wr.f(this.tempSet);
          },

          (rd, revi) => {
            this.tempCur = rd.f();
            this.tempSet = rd.f();
          },
        );
      }
      .setProp({
        noSuper: true,
        argLen: 1,
      }),


    }),


  ];
