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
    blk.drawCached = false;
    blk.drawDynamic = true;

    blk.heatLightTempReq = blk.fullHeatThr;
  };


  function comp_load(blk) {
    blk.dirReg = fetchRegion(blk, "-dir");
  };


  function comp_draw(b) {
    Draw.rect(b.block.region, b.x, b.y);
    Draw.rect(b.block.delegee.dirReg, b.x, b.y, b.drawrot());
  };


/*
  ========================================
  Section: Application
  ========================================
*/


  module.exports = [


    /**
     * Conducts Lovec heat.
     * Note that this is not vanilla Erekir {@link HeatConductor}.
     * @class BLK_heatConductor
     * @extends BLK_baseHeatBlock
     */
    newClass().extendClass(PARENT[0], "BLK_heatConductor").initClass()
    .setParent(Wall)
    .setTags("blk-non-wall")
    .setParam({


      /**
       * <PARAM>: Temperature at which heat region is drawn with maximum alpha.
       * @memberof BLK_heatConductor
       * @instance
       */
      fullHeatThr: 100.0,
      /**
       * <PARAM>: For heat conductors one heat region is just bright enough on most occasions.
       * @override
       * @memberof BLK_heatConductor
       * @instance
       */
      shouldDrawDoubleHeat: false,


      /* <------------------------------ internal ------------------------------ */


      /**
       * <INTERNAL>
       * @memberof BLK_heatConductor
       * @instance
       */
      dirReg: null,
      /**
       * <INTERNAL>
       * @override
       * @memberof INTF_BLK_heatBlock
       * @instance
       */
      heatLightTempReq: 100.0,


      /* <------------------------------ vanilla ------------------------------ */


      solid: false,
      underBullets: true,


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
     * @class B_heatConductor
     * @extends B_baseHeatBlock
     */
    newClass().extendClass(PARENT[1], "B_heatConductor").initClass()
    .setParent(Wall.WallBuild)
    .setParam({})
    .setMethod({


      draw: function() {
        comp_draw(this);
      }
      .setProp({
        noSuper: true,
      }),


      /**
       * @override
       * @memberof B_heatConductor
       * @instance
       * @return {number}
       */
      ex_getHeatTg: function() {
        return this.block.delegee.fullHeatThr;
      }
      .setProp({
        noSuper: true,
        override: true,
      }),


    }),


  ];
