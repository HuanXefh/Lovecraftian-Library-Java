/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * The most common drill type.
   * ----------------------------------------
   * DEDICATION:
   *
   * Inspired by Psammos.
   * ---------------------------------------- */


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


    // Block
    newClass().extendClass(PARENT[0], "BLK_groundDrill").initClass()
    .setParent(Drill)
    .setTags("blk-min", "blk-drl")
    .setParam({
      // @PARAM: Whether the drill rotator gradually accelerates before finishing a round.
      useAccel: true,
    })
    .setMethod({}),


    // Building
    newClass().extendClass(PARENT[1], "BLK_groundDrill").initClass()
    .setParent(Drill.DrillBuild)
    .setParam({
      timeDrilledInc: 0.0,
    })
    .setMethod({


      updateTile: function() {
        comp_updateTile(this);
      },


    }),


  ];
