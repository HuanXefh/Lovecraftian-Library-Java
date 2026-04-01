/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = require("lovec/temp/blk/BLK_baseGroundDrill");


  /* <---------- component ----------> */


  function comp_updateTile(b) {
    if(b.timer.get(b.block.timerDump, b.block.dumpTime / b.timeScale)) {
      b.dump(b.dominantItem != null && b.items.has(b.dominantItem) ? b.dominantItem : null);
    };

    if(b.dominantItem != null) {
      b.timeDrilled += b.warmup * b.delta();

      let drillTime = b.block.getDrillTime(b.dominantItem);
      if(b.dominantItems > 0 && b.efficiency > 0.0 && b.items.get(b.dominantItem) < b.block.itemCapacity) {
        let spd = Mathf.lerp(1.0, b.block.liquidBoostIntensity, b.optionalEfficiency) * b.efficiency;
        b.lastDrillSpeed = spd * b.dominantItems * b.warmup / drillTime;
        b.warmup = Mathf.approachDelta(b.warmup, spd, b.block.warmupSpeed);
        b.progress += b.delta() * b.dominantItems * spd * b.warmup;
        if(Mathf.chanceDelta(b.block.updateEffectChance * b.warmup)) {
          b.block.updateEffect.at(b.x + Mathf.range(b.block.size * 2.0), b.y + Mathf.range(b.block.size * 2.0));
        };
        if(b.progress >= drillTime) {
          let amt = Math.floor(b.progress / drillTime);
          FRAG_item.offload(b, b, b.dominantItem, amt);
          b.progress %= drillTime;
          if(Mathf.chanceDelta(b.block.drillEffectChance * b.warmup)) {
            b.block.drillEffect.at(b.x + Mathf.range(b.block.drillEffectRnd), b.y + Mathf.range(b.block.drillEffectRnd), b.dominantItem.color);
          };
          b.ex_onCraft();
        };
      } else {
        b.lastDrillSpeed = 0.0;
        b.warmup = Mathf.approachDelta(b.warmup, 0.0, b.block.warmupSpeed);
      };
    };

    if(b.block.delegee.useAccel) {
      b.timeDrilledInc = Mathf.approachDelta(
        b.timeDrilledInc,
        Mathf.lerp(
          0.0, b.warmup * b.delta() * 8.0,
          b.dominantItem == null ?
            0.0 :
            Interp.pow5In.apply(Mathf.clamp(b.progress / b.block.getDrillTime(b.dominantItem))),
        ),
        0.1,
      );
      b.timeDrilled += b.timeDrilledInc;
    };
  };


/*
  ========================================
  Section: Application
  ========================================
*/


  module.exports = [


    /**
     * The most common drill type.
     * <br> <DEDICATION>: Inspired by Psammos.
     * @class BLK_groundDrill
     * @extends BLK_baseGroundDrill
     */
    newClass().extendClass(PARENT[0], "BLK_groundDrill").initClass()
    .setParent(Drill)
    .setTags("blk-min", "blk-drl")
    .setParam({


      /**
       * <PARAM>: If true, the drill rotator will gradually accelerate before finishing a round.
       * @memberof BLK_groundDrill
       * @instance
       */
      useAccel: true,


    })
    .setMethod({}),


    /**
     * @class B_groundDrill
     * @extends B_baseGroundDrill
     */
    newClass().extendClass(PARENT[1], "B_groundDrill").initClass()
    .setParent(Drill.DrillBuild)
    .setParam({


      /* <------------------------------ internal ------------------------------ */


      /**
       * <INTERNAL>
       * @memberof B_groundDrill
       * @instance
       */
      timeDrilledInc: 0.0,


    })
    .setMethod({


      updateTile: function() {
        comp_updateTile(this);
      }
      .setProp({
        noSuper: true,
      }),


      shouldConsume: function() {
        return this.enabled && this.dominantItem != null && this.items.get(this.dominantItem) < this.block.itemCapacity;
      }
      .setProp({
        noSuper: true,
        boolMode: "and",
      }),


      shouldAmbientSound: function() {
        // I don't understand why this got overrided
        return this.shouldConsume();
      }
      .setProp({
        noSuper: true,
        boolMode: "and",
      }),


    }),


  ];
