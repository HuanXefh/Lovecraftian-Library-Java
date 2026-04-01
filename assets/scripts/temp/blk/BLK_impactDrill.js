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
    if(b.dominantItem != null) {
      if(b.invertTime > 0.0) b.invertTime -= b.delta() / b.block.invertedTime;

      if(b.timer.get(b.block.timerDump, b.block.dumpTime / b.timeScale)) {
        b.dump(b.items.has(b.dominantItem) ? b.dominantItem : null);
      };

      let drillTime = b.block.getDrillTime(b.dominantItem);
      b.smoothProgress = Mathf.lerpDelta(b.smoothProgress, b.progress / (drillTime - 20.0), 0.1);
      if(b.dominantItems > 0 && b.efficiency > 0.0 && b.items.get(b.dominantItem) <= b.block.itemCapacity - b.dominantItems) {
        b.warmup = Mathf.approachDelta(b.warmup, b.progress / drillTime, b.block.warmupSpeed);
        let spd = Mathf.lerp(1.0, b.block.liquidBoostIntensity, b.optionalEfficiency) * b.efficiency;
        b.timeDrilled += b.block.speedCurve.apply(b.progress / drillTime) * spd;
        b.lastDrillSpeed = 1.0 / drillTime * spd * b.dominantItems;
        b.progress += b.delta() * spd;
        if(b.progress >= drillTime) {
          FRAG_item.offload(b, b, b.dominantItem, b.dominantItems);
          b.invertTime = 1.0;
          b.progress %= drillTime;

          Effect.shake(b.block.shake, b.block.shake, b);
          b.block.drillSound.at(b.x, b.y, 1.0 + Mathf.range(b.block.drillSoundPitchRand), b.block.drillSoundVolume);
          b.block.drillEffect.at(b.x + Mathf.range(b.block.drillEffectRnd), b.y + Mathf.range(b.block.drillEffectRnd), b.dominantItem.color);

          b.ex_onCraft();
        };
      } else {
        b.warmup = Mathf.approachDelta(b.warmup, 0.0, 0.01);
        b.lastDrillSpeed = 0.0;
      };
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
    .setParam({})
    .setMethod({


      updateTile: function() {
        comp_updateTile(this);
      }
      .setProp({
        noSuper: true,
      }),


      shouldConsume: function() {
        return this.enabled && this.dominantItem != null && this.items.get(this.dominantItem) <= this.block.itemCapacity - this.dominantItems;
      }
      .setProp({
        noSuper: true,
        boolMode: "and",
      }),


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
