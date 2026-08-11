/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  /* <---------- component ----------> */


  const comp_canPlaceOn = function thisFun(blk, t, team, rot) {
    if(LCNativeArray.checkTupChange(thisFun.tmpTup, blk, t, team, rot)) {
      blk.ex_findPlaceRestrictTs(blk.placeRestrictTmpTs, t, rot);
      thisFun.tmpCond = !LCEntity.getBuildsByTiles(blk.placeRestrictTmpBs, blk.placeRestrictTmpTs).some(ob => ob.block === blk);
    };

    return thisFun.tmpCond;
  }
  .setProp({
    tmpTup: [],
    tmpCond: false,
  });


  function comp_ex_findPlaceRestrictTs(blk, contArr, t, rot) {
    return blk.rotate ?
      LCPos.getTilesRectRotCenter(blk.placeRestrictTmpTs, t, blk.placeRestrictR, blk.size, rot) :
      !blk.useCircularPlaceRestrict ?
        LCPos.getTilesRect(blk.placeRestrictTmpTs, t, blk.placeRestrictR, blk.size) :
        LCPos.getTilesCircle(blk.placeRestrictTmpTs, t, blk.placeRestrictR, blk.size);
  };


/*
  ========================================
  Section: Application
  ========================================
*/


  module.exports = [


    /**
     * This block cannot be placed when any block of the same type exists in range.
     * Does not draw the range.
     * @class INTF_BLK_sameBlockRestrictionHandler
     */
    new CLS_interface("INTF_BLK_sameBlockRestrictionHandler", {


      __paramObjSetter__: () => ({


        /**
         * `PARAM`: Range in blocks for placement restriction.
         * @memberof INTF_BLK_sameBlockRestrictionHandler
         * @instance
         */
        placeRestrictR: 5,
        /**
         * `PARAM`: If true, the restriction area is a disk.
         * @memberof INTF_BLK_sameBlockRestrictionHandler
         * @instance
         */
        useCircularPlaceRestrict: false,


        /* <------------------------------ internal ------------------------------ */


        /**
         * `INTERNAL`
         * @memberof INTF_BLK_sameBlockRestrictionHandler
         * @instance
         */
        placeRestrictTmpTs: prov(() => []),
        /**
         * `INTERNAL`
         * @memberof INTF_BLK_sameBlockRestrictionHandler
         * @instance
         */
        placeRestrictTmpBs: prov(() => []),


      }),


      canPlaceOn: function(t, team, rot) {
        return comp_canPlaceOn(this, t, team, rot);
      }
      .setProp({
        boolMode: "and",
      }),


      /**
       * @memberof INTF_BLK_sameBlockRestrictionHandler
       * @instance
       * @param {Array|unset} contArr
       * @param {Tile|null} t
       * @param {number} rotation
       * @return {Array<Tile>}
       */
      ex_findPlaceRestrictTs: function(contArr, t, rot) {
        return comp_ex_findPlaceRestrictTs(this, contArr, t, rot);
      }
      .setProp({
        noSuper: true,
        argLen: 3,
      }),


    }),


    /**
     * @class INTF_B_sameBlockRestrictionHandler
     */
    new CLS_interface("INTF_B_sameBlockRestrictionHandler", {}),


  ];
