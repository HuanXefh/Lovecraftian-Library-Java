/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = require("lovec/temp/blk/BLK_heatProducer");
  const INTF = require("lovec/temp/intf/INTF_BLK_furnaceBlock");


  /* <---------- component ----------> */


  function comp_init(blk) {
    blk.config(JAVA.string, (b, str) => {
      if(str.startsWith("FUEL: ")) {
        b.delegee.fuelSel = MDL_content._ct(str.replace("FUEL: ", ""), "rs");
      };
    });
  };


  function comp_buildConfiguration(b, tb) {
    tb.row();
    b.ex_buildFuelSelector(tb);
  };


/*
  ========================================
  Section: Application
  ========================================
*/


  module.exports = [


    /**
     * @class BLK_furnaceHeater
     * @extends BLK_heatProducer
     * @extend INTF_BLK_furnaceBlock
     */
    newClass().extendClass(PARENT[0], "BLK_furnaceHeater").implement(INTF[0]).initClass()
    .setParent(GenericCrafter)
    .setTags()
    .setParam({


      /**
      * `PARAM`: Maximum heat produced by this heater.
      * @override
      * @memberof BLK_furnaceHeater
      * @instance
      */
      heatProd: 100.0,


      /* <------------------------------ internal ------------------------------ */


      /**
       * <INTERNAL>
       * @override
       * @memberof BLK_furnaceHeater
       * @instance
       */
      useAndOperForAccept: true,
      /**
       * <INTERNAL>
       * @memberof BLK_furnaceHeater
       * @instance
       */
      skipHeatFetch: true,
      /**
       * <INTERNAL>
       * @memberof BLK_furnaceHeater
       * @instance
       */
      skipHeatSupply: false,


    })
    .setMethod({


      init: function() {
        comp_init(this);
      },


    }),


    /**
     * @class B_furnaceHeater
     * @extends B_heatProducer
     * @extends INTF_B_furnaceBlock
     */
    newClass().extendClass(PARENT[1], "B_furnaceHeater").implement(INTF[1]).initClass()
    .setParent(GenericCrafter.GenericCrafterBuild)
    .setParam({})
    .setMethod({


      acceptItem: function thisFun(b_f, itm) {
        return thisFun.funPrev.apply(this, arguments);
      }
      .setProp({
        noSuper: true,
        override: true,
      }),


      acceptLiquid: function thisFun(b_f, liq) {
        return thisFun.funPrev.apply(this, arguments);
      }
      .setProp({
        noSuper: true,
        override: true,
      }),


      config: function() {
        return this.fuelSel;
      }
      .setProp({
        noSuper: true,
        override: true,
      }),


      buildConfiguration: function(tb) {
        comp_buildConfiguration(this, tb);
      }
      .setProp({
        noSuper: true,
      }),


      write: function(wr) {
        this.ex_processData(wr);
      },


      read: function(rd, revi) {
        this.ex_processData(rd);
      },


      /**
       * @override
       * @memberof B_furnaceHeater
       * @instance
       * @return {number}
       */
      ex_calcHeatSupplied: function() {
        return this.ex_getHeatProd();
      }
      .setProp({
        noSuper: true,
        override: true,
      }),


      /**
       * @override
       * @memberof B_furnaceHeater
       * @instance
       * @return {number}
       */
      ex_getHeatTg: function() {
        return this.blk$heatProd;
      }
      .setProp({
        noSuper: true,
        override: true,
      }),


      /**
       * @override
       * @memberof B_furnaceHeater
       * @instance
       * @return {number}
       */
      ex_getHeatProd: function() {
        return Math.min(this.tempCur, this.blk$heatProd);
      }
      .setProp({
        noSuper: true,
        override: true,
      }),


    }),


  ];
