/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = require("lovec/temp/blk/BLK_baseHeatBlock");


  /* <---------- component ----------> */


  function comp_init(blk) {
    blk.rotate = true;
    blk.update = true;
    blk.group = BlockGroup.none;
    blk.priority = TargetPriority.base;
    blk.buildVisibility = BuildVisibility.sandboxOnly;

    blk.configurable = true;

    blk.config(JAVA.float, (b, f) => {
      b.delegee.tempSet = f;
    });
  };


  function comp_load(blk) {
    blk.sideReg1 = fetchRegion(blk, "-side1", "-side");
    blk.sideReg2 = fetchRegion(blk, "-side2", "-side");
  };


  function comp_buildConfiguration(b, tb) {
    tb.row();
    tb.table(Styles.black3, tb1 => {
      tb1.left();
      MDL_table.__margin(tb1);
      MDL_table.__sliderCfg(tb1, b, () => "${1}: ${2}".format(MDL_bundle._term("lovec", "temperature"), b.tempSet + " " + fetchStatUnit("lovec", "heatunits").localized()), b.block.delegee.tempMin, b.block.delegee.tempMax, 50.0, b.tempSet);
    }).left().growX();
  };


  function comp_draw(b) {
    b.drawTeamTop();

    Draw.rect(b.block.region, b.x, b.y);
    MDL_draw._reg_side(b.x, b.y, b.block.delegee.sideReg1, b.block.delegee.sideReg2, b.rotation);
  };


/*
  ========================================
  Section: Application
  ========================================
*/


  module.exports = [


    /**
     * Source of Lovec heat, with a slider to adjust the temperature.
     * @class BLK_heatSource
     * @extends BLK_baseHeatBlock
     */
    newClass().extendClass(PARENT[0], "BLK_heatSource").initClass()
    .setParent(Wall)
    .setTags()
    .setParam({


      /**
       * <PARAM>: Minimum temperature.
       * @memberof BLK_heatSource
       * @instance
       */
      tempMin: 0.0,
      /**
       * <PARAM>: Maximum temperature.
       * @memberof BLK_heatSource
       * @instance
       */
      tempMax: 3000.0,
      /**
       * <PARAM>
       * @override
       * @memberof BLK_heatSource
       * @instance
       */
      heatTransRate: 0.008,


      /* <------------------------------ internal ------------------------------ */


      /**
       * <INTERNAL>
       * @override
       * @memberof BLK_heatSource
       * @instance
       */
      skipHeatFetch: true,
      /**
       * <INTERNAL>
       * @override
       * @memberof BLK_heatSource
       * @instance
       */
      skipHeatTrans: true,
      /**
       * <INTERNAL>
       * @memberof BLK_heatSource
       * @instance
       */
      sideReg1: null,
      /**
       * <INTERNAL>
       * @memberof BLK_heatSource
       * @instance
       */
      sideReg2: null,


    })
    .setMethod({


      init: function() {
        comp_init(this);
      },


      load: function() {
        comp_load(this);
      },


    }),


    /**
     * @class B_heatSource
     * @extends B_baseHeatBlock
     */
    newClass().extendClass(PARENT[1], "B_heatSource").initClass()
    .setParent(Wall.WallBuild)
    .setParam({


      /* <------------------------------ internal ------------------------------ */


      /**
       * <INTERNAL>: Target temperature.
       * @memberof B_heatSource
       * @instance
       */
      tempSet: 0.0,


    })
    .setMethod({


      config: function() {
        return this.tempSet;
      }
      .setProp({
        noSuper: true,
      }),


      buildConfiguration: function(tb) {
        comp_buildConfiguration(this, tb);
      }
      .setProp({
        noSuper: true,
      }),


      draw: function() {
        comp_draw(this);
      }
      .setProp({
        noSuper: true,
      }),


      write: function(wr) {
        wr.f(this.tempSet);
      },


      read: function(rd, revi) {
        if(this.LCRevi === 5) rd.s();
        
        this.tempSet = rd.f();
      },


      /**
       * @override
       * @memberof B_heatSource
       * @instance
       * @return {number}
       */
      ex_calcTempTg: function() {
        return this.tempSet;
      }
      .setProp({
        noSuper: true,
        override: true,
      }),


      /**
       * @override
       * @memberof B_heatSource
       * @instance
       * @return {number}
       */
      ex_getHeatSupplied: function() {
        return this.tempCur;
      }
      .setProp({
        noSuper: true,
        override: true,
      }),


    }),


  ];
