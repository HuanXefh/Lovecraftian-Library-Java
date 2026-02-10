/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * Beam drill but usually with range of 1.
   * ---------------------------------------- */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = require("lovec/temp/blk/BLK_baseDrill");


  /* <---------- component ----------> */


  function comp_init(blk) {
    if(blk.overwriteVanillaProp) {
      blk.drawArrow = true;
      blk.laserWidth = 0.0;
      blk.sparks = 10;
      blk.sparkRange = blk.size * Vars.tilesize * 0.5;
      blk.sparkLife = 20.0;
      blk.sparkRecurrence = 2.0;
      blk.sparkSpread = 50.0;
      blk.sparkSize = 0.5 + blk.size * 0.5;
    };
  };


  const comp_canPlaceOn = function thisFun(blk, t, team, rot) {
    if(t == null) return;
    if(Array.someMismatch(thisFun.tmpTup, true, blk, t, team, rot)) {
      thisFun.tmpTup[4] = thisFun.tmpBoolF(blk, t, team, rot);
    };

    return thisFun.tmpTup[4];
  }
  .setProp({
    tmpTup: [],
    tmpBoolF: function(blk, t, team, rot) {
      let ot = null, itm = null, isBlockDrop = false;
      for(let i = 0; i < blk.size; i++) {
        blk.nearbySide(t.x, t.y, rot, i, Tmp.p1);
        for(let j = 0; j < blk.range; j++) {
          ot = Vars.world.tile(Tmp.p1.x + Geometry.d4x[rot] * j, Tmp.p1.y + Geometry.d4y[rot] * j);
          if(ot != null && ot.solid()) {
            if(ot.overlay().itemDrop != null) {
              itm = ot.overlay().itemDrop;
            } else if(ot.block().itemDrop != null) {
              itm = ot.block().itemDrop;
              isBlockDrop = true;
            };
            if(itm != null && blk.ex_calcDropHardness(isBlockDrop ? ot.block() : ot.overlay(), itm) <= blk.tier && !(
              (blk.blockedItems != null && blk.blockedItems.contains(itm))
                || ((blk.blockedItems == null || blk.blockedItems.size === 0) && blk.itmWhitelist.length > 0 && !blk.itmWhitelist.includes(itm))
            )) return true;
            isBlockDrop = false;
            break;
          };
        };
      };

      return false;
    },
  });


/*
  ========================================
  Section: Application
  ========================================
*/


  module.exports = [


    // Block
    newClass().extendClass(PARENT[0], "BLK_wallDrill").initClass()
    .setParent(BeamDrill)
    .setTags("blk-min", "blk-drl")
    .setParam({})
    .setParamAlias([
      "mineR", "range", 1,
    ])
    .setMethod({


      init: function() {
        comp_init(this);
      },


      canPlaceOn: function(t, team, rot) {
        return comp_canPlaceOn(this, t, team, rot);
      }
      .setProp({
        noSuper: true,
      }),


    }),


    // Building
    newClass().extendClass(PARENT[1], "BLK_wallDrill").initClass()
    .setParent(BeamDrill.BeamDrillBuild)
    .setParam({})
    .setMethod({}),


  ];
