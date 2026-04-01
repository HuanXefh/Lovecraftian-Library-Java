/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const INTF = require("lovec/temp/intf/INTF_BLK_heatBlock");


  /* <---------- component ----------> */


  function comp_init(blk) {
    if(!blk.hasPower) ERROR_HANDLER.throw("noPowerModule", blk.name);

    MDL_event._c_onLoad(() => {
      let blkCons = new ConsumePowerDynamic(b => b.ex_calcFurnPowCons());
      blk.consumers = [blkCons];
      blk.consPower = blkCons;
    });

    blk.configurable = true;

    blk.config(JAVA.float, (b, f) => {
      b.delegee.tempSet = f;
    });
  };


  function comp_setStats(blk) {
    blk.stats.add(Stat.powerUse, blk.powConsBase * 60.0, StatUnit.powerSecond);
    blk.stats.add(fetchStat("lovec", "blk0pow-powuseper100hu"), blk.powConsPerFuelLvl * 60.0, StatUnit.powerSecond);
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


  function comp_ex_postUpdateEfficiencyMultiplier(b) {
    comp_updateEfficiencyMultiplier(b);
  };


  function comp_ex_buildTempSlider(b, tb) {
    tb.table(Styles.black3, tb1 => {
      tb1.left();
      MDL_table.__margin(tb1);
      MDL_table.__sliderCfg(tb1, b, () => "${1}: ${2}".format(MDL_bundle._term("lovec", "temperature"), Strings.fixed(b.tempSet, 2) + " " + fetchStatUnit("lovec", "heatunits").localized()), 0.0, b.block.delegee.heatBlkMeltTemp * b.block.delegee.maxOverheatScl, 50.0, b.tempSet);
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
     * @extends INTF_BLK_heatBlock
     */
    new CLS_interface({


      __PARAM_OBJ_SETTER__: (() => ({


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
         * <PARAM>
         * @override
         * @memberof INTF_BLK_electricFurnaceBlock
         * @instance
         */
        heatWarmupRate: 0.0001,
        /**
         * <PARAM>
         * @override
         * @memberof INTF_BLK_electricFurnaceBlock
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


    }).extendInterface(INTF[0], "INTF_BLK_electricFurnaceBlock"),


    /**
     * @class INTF_B_electricFurnaceBlock
     * @extends INTF_B_heatBlock
     */
    new CLS_interface({


      __PARAM_OBJ_SETTER__: (() => ({


        /* <------------------------------ internal ------------------------------ */


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
        furnEffc: 0.0,


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


      warmupTarget: function() {
        return this.heatFrac;
      }
      .setProp({
        noSuper: true,
      }),


      buildConfiguration: function(tb) {
        comp_buildConfiguration(this, tb);
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
       * @override
       * @memberof INTF_B_electricFurnaceBlock
       * @instance
       * @return {number}
       */
      ex_calcTempTg: function thisFun() {
        return Math.max(thisFun.funPrev.apply(this, arguments), this.tempSet);
      }
      .setProp({
        noSuper: true,
        override: true,
      }),


      /**
       * @override
       * @memberof INTF_B_electricFurnaceBlock
       * @instance
       * @return {number}
       */
      ex_calcTempTgFrac: function() {
        return Math.max(Mathf.clamp(this.tempExt / this.tempSet), this.power.status);
      }
      .setProp({
        noSuper: true,
        override: true,
      }),


      /**
       * <br> <LATER>
       * @override
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
            wr.f(this.tempSet);
          },

          (rd, revi) => {
            this.tempSet = rd.f();
          },
        );
      }
      .setProp({
        noSuper: true,
        argLen: 1,
      }),


    }).extendInterface(INTF[1], "INTF_B_electricFurnaceBlock"),


  ];
