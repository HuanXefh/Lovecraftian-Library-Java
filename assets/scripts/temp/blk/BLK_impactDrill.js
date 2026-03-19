/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = require("lovec/temp/blk/BLK_baseGroundDrill");
  const INTF = require("lovec/temp/intf/INTF_BLK_impactInducer");


  /* <---------- component ----------> */


  function comp_updateTile(b) {
    if(b.invertTime > 0.99 && !b.justCrafted) {
      b.ex_onCraft();
      b.justCrafted = true;
    };
    if(b.invertTime < 0.1) {
      b.justCrafted = false;
    };
  };


/*
  ========================================
  Section: Application
  ========================================
*/


  module.exports = [


    /**
     * Vanilla burst drill rebalanced.
     * @class BLK_impactDrill
     * @extends BLK_baseGroundDrill
     * @extends INTF_BLK_impactInducer
     */
    newClass().extendClass(PARENT[0], "BLK_impactDrill").implement(INTF[0]).initClass()
    .setParent(BurstDrill)
    .setTags("blk-min", "blk-drl")
    .setParam({


      /**
       * <PARAM>: Impact drills are designed to mine depth ore by default.
       * @override
       * @memberof BLK_impactDrill
       * @instance
       */
      canMineDepthOre: true,


    })
    .setMethod({


      drawPlace: function(tx, ty, rot, valid) {

      }
      .setProp({
        noSuper: true,
      }),


      /**
       * @override
       * @memberof BLK_impactDrill
       * @instance
       * @param {Building} b
       * @return {number}
       */
      ex_calcImpactIntv: function(b) {
        return this.drillTime;
      }
      .setProp({
        noSuper: true,
        override: true,
        argLen: 1,
      }),


      /**
       * @override
       * @memberof BLK_impactDrill
       * @instance
       * @param {Building} b
       * @return {number}
       */
      ex_calcImpactShake: function(b) {
        return this.shake;
      }
      .setProp({
        noSuper: true,
        override: true,
        argLen: 1,
      }),


    }),


    /**
     * @class B_impactDrill
     * @extends B_baseGroundDrill
     * @extends INTF_B_impactInducer
     */
    newClass().extendClass(PARENT[1], "B_impactDrill").implement(INTF[1]).initClass()
    .setParent(BurstDrill.BurstDrillBuild)
    .setParam({


      /* <------------------------------ internal ------------------------------ */


      /**
       * <INTERNAL>
       * @memberof B_impactDrill
       * @instance
       */
      justCrafted: false,


    })
    .setMethod({


      updateTile: function() {
        comp_updateTile(this);
      },


      drawSelect: function() {

      }
      .setProp({
        noSuper: true,
      }),


      /**
       * @memberof B_impactDrill
       * @instance
       * @return {void}
       */
      ex_onCraft: function() {
        this.ex_createImpactWave();
      }
      .setProp({
        noSuper: true,
      }),


    }),


  ];
