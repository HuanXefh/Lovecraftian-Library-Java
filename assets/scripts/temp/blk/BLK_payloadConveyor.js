/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = require("lovec/temp/blk/BLK_basePayloadBlock");


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


    /**
     * Modified payload conveyors that are affected by efficiency.
     * Conducts power, why not?
     * <br> It's not possible to slow down the conveyor as it will break sync.
     * @class BLK_payloadConveyor
     * @extends BLK_basePayloadBlock
     */
    newClass().extendClass(PARENT[0], "BLK_payloadConveyor").initClass()
    .setParent(PayloadConveyor)
    .setTags()
    .setParam({})
    .setMethod({


      init: function() {
        comp_init(this);
      },


    }),


    /**
     * @class B_payloadConveyor
     * @extends B_basePayloadBlock
     */
    newClass().extendClass(PARENT[1], "B_payloadConveyor").initClass()
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


      /**
       * @memberof B_payloadConveyor
       * @instance
       * @return {boolean}
       */
      ex_shouldOperate: function() {
        return comp_ex_shouldOperate(this);
      }
      .setProp({
        noSuper: true,
      }),


    }),


  ];
