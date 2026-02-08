/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * Modified payload conveyors that are affected by efficiency.
   * It's not possible to slow down the conveyor as it will break sync.
   * ---------------------------------------- */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = require("lovec/temp/blk/BLK_basePayloadBlock");
  const VAR = require("lovec/glb/GLB_var");


  /* <---------- component ----------> */


  function comp_init(blk) {
    if(blk.overwriteVanillaProp) {
      blk.canOverdrive = false;
      if(blk.hasPower) {
        blk.conductivePower = true;
        blk.connectedPower = false;
      };
    };
  };


  function comp_updateTile(b) {
    if(b.ex_shouldOperate()) {
      b.super$updateTile();
    } else {
      b.progress = Mathf.approachDelta(b.progress, b.block.moveTime, b.block.moveTime * 0.02);
      b.updatePayload();
    };
  };


  function comp_unitOn(b, unit) {
    if(b.ex_shouldOperate()) b.super$unitOn(unit);
  };


  function comp_ex_shouldOperate(b) {
    return b.efficiency >= VAR.blk_updateEffcThr;
  };


/*
  ========================================
  Section: Application
  ========================================
*/


  module.exports = [


    // Block
    newClass().extendClass(PARENT[0]).initClass()
    .setParent(PayloadConveyor)
    .setTags()
    .setParam({})
    .setMethod({


      init: function() {
        comp_init(this);
      },


    }),


    // Building
    newClass().extendClass(PARENT[1]).initClass()
    .setParent(PayloadConveyor.PayloadConveyorBuild)
    .setParam({})
    .setMethod({


      updateTile: function() {
        comp_updateTile(this);
      }
      .setProp({
        noSuper: true,
      }),


      unitOn: function(unit) {
        comp_unitOn(this, unit);
      }
      .setProp({
        noSuper: true,
      }),


      ex_shouldOperate: function() {
        return comp_ex_shouldOperate(this);
      }
      .setProp({
        noSuper: true,
      }),


    }),


  ];
