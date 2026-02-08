/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * This block cannot be placed when any block of the same type exists in range.
   * Does not draw the range.
   * ---------------------------------------- */


/*
  ========================================
  Section: Definition
  ========================================
*/


  // TODO: Test.


  /* <---------- import ----------> */


  const CLS_interface = require("lovec/cls/struct/CLS_interface");


  const MDL_pos = require("lovec/mdl/MDL_pos");


  /* <---------- component ----------> */


  const comp_canPlaceOn = function thisFun(blk, t, team, rot) {
    if(Array.someMismatch(thisFun.tmpTup, true, blk, t, team, rot)) {
      blk.ex_findPlaceRestrictTs(blk.placeRestrictTmpTs, t, rot);
      thisFun.tmpTup[4] = !MDL_pos._bsTs(blk.placeRestrictTmpTs, blk.placeRestrictTmpBs).some(ob => ob.block === blk);
    };

    return thisFun.tmpTup[4];
  }
  .setProp({
    tmpTup: [],
  });


  function comp_ex_findPlaceRestrictTs(blk, contArr, t, rot) {
    return blk.rotate ?
      MDL_pos._tsRectRot(t, blk.placeRestrictR, blk.size, rot, blk.placeRestrictTmpTs) :
      !blk.useCircularPlaceRestrict ?
        MDL_pos._tsRect(t, blk.placeRestrictR, blk.size, blk.placeRestrictTmpTs) :
        MDL_pos._tsCircle(t, blk.placeRestrictR, blk.size, blk.placeRestrictTmpTs);
  };


/*
  ========================================
  Section: Application
  ========================================
*/


  module.exports = [


    // Block
    new CLS_interface({


      __PARAM_OBJ_SETTER__: () => ({
        // @PARAM: Range in blocks for placement restriction.
        placeRestrictR: 5,
        // @PARAM: If {true}, the restriction area is a disk. Rotation will be ignored then.
        useCircularPlaceRestrict: false,

        placeRestrictTmpTs: prov(() => []),
        placeRestrictTmpBs: prov(() => []),
      }),


      canPlaceOn: function(t, team, rot) {
        return comp_canPlaceOn(this, t, team, rot);
      }
      .setProp({
        boolMode: "and",
      }),


      ex_findPlaceRestrictTs: function(contArr, t, rot) {
        return comp_ex_findPlaceRestrictTs(this, contArr, t, rot);
      }
      .setProp({
        noSuper: true,
        argLen: 3,
      }),


    }),


    // Building
    new CLS_interface({}),


  ];
