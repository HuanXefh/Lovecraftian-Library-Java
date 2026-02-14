/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * Vanilla burst drill.
   * ---------------------------------------- */


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


    // Block
    newClass().extendClass(PARENT[0], "BLK_impactDrill").implement(INTF[0]).initClass()
    .setParent(BurstDrill)
    .setTags("blk-min", "blk-drl")
    .setParam({
      canMineDepthOre: true,
    })
    .setMethod({


      drawPlace: function(tx, ty, rot, valid) {

      }
      .setProp({
        noSuper: true,
      }),


      ex_calcImpactIntv: function(b) {
        return this.drillTime;
      }
      .setProp({
        noSuper: true,
        override: true,
        argLen: 1,
      }),


      ex_calcImpactShake: function(b) {
        return this.shake;
      }
      .setProp({
        noSuper: true,
        override: true,
        argLen: 1,
      }),


    }),


    // Building
    newClass().extendClass(PARENT[1], "BLK_impactDrill").implement(INTF[1]).initClass()
    .setParent(BurstDrill.BurstDrillBuild)
    .setParam({
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


      ex_onCraft: function() {
        this.ex_createImpactWave();
      }
      .setProp({
        noSuper: true,
      }),


    }),


  ];
