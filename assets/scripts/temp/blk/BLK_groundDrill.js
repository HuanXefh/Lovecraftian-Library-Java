/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = require("lovec/temp/blk/BLK_baseGroundDrill");


  /* <---------- component ----------> */


  function comp_updateTile(b) {
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
      },


    }),


  ];
