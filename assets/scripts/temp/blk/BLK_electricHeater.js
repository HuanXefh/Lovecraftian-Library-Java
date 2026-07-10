/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = require("lovec/temp/blk/BLK_heatProducer");
  const INTF = require("lovec/temp/intf/INTF_BLK_electricFurnaceBlock");


  /* <---------- component ----------> */


  function comp_init(blk) {
    blk.ex_addConfigCaller("tempSet", (b, val) => b.delegee.tempSet = val);
  };


/*
  ========================================
  Section: Application
  ========================================
*/


  module.exports = [


    /**
     * @class BLK_electricHeater
     * @extends BLK_heatProducer
     * @extend INTF_BLK_electricFurnaceBlock
     */
    newClass().extendClass(PARENT[0], "BLK_electricHeater").implement(INTF[0]).initClass()
    .setParent(GenericCrafter)
    .setTags()
    .setParam({


      /**
       * <PARAM>: See {@link BLK_furnaceHeater}.
       * @memberof BLK_electricHeater
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
     * @class B_electricHeater
     * @extends B_heatProducer
     * @extends INTF_B_electricFurnaceBlock
     */
    newClass().extendClass(PARENT[1], "B_electricHeater").implement(INTF[1]).initClass()
    .setParent(GenericCrafter.GenericCrafterBuild)
    .setParam({})
    .setMethod({


      write: function(wr) {
        this.ex_processData(wr);
      },


      read: function(rd, revi) {
        this.ex_processData(rd);
      },


      /**
       * @override
       * @memberof B_electricHeater
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
       * @memberof B_electricHeater
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
       * @memberof B_electricHeater
       * @instance
       * @return {number}
       */
      ex_getTempSetMax: function() {
        return this.blk$heatProd * this.block.delegee.maxOverheatScl;
      }
      .setProp({
        noSuper: true,
        override: true,
      }),


      /**
       * @override
       * @memberof B_electricHeater
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
