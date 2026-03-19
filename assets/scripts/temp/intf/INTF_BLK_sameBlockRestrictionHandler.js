/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  /* <---------- component ----------> */


  const comp_canPlaceOn = function thisFun(blk, t, team, rot) {
    if(checkTupChange(thisFun.tmpTup, true, blk, t, team, rot)) {
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


    /**
     * This block cannot be placed when any block of the same type exists in range.
     * Does not draw the range.
     * @class INTF_BLK_sameBlockRestrictionHandler
     */
    new CLS_interface("INTF_BLK_sameBlockRestrictionHandler", {


      __PARAM_OBJ_SETTER__: () => ({


        /**
         * <PARAM>: Range in blocks for placement restriction.
         * @memberof INTF_BLK_sameBlockRestrictionHandler
         * @instance
         */
        placeRestrictR: 5,
        /**
         * <PARAM>: If true, the restriction area is a disk.
         * @memberof INTF_BLK_sameBlockRestrictionHandler
         * @instance
         */
        useCircularPlaceRestrict: false,


        /* <------------------------------ internal ------------------------------ */


        /**
         * <INTERNAL>
         * @memberof INTF_BLK_sameBlockRestrictionHandler
         * @instance
         */
        placeRestrictTmpTs: prov(() => []),
        /**
         * <INTERNAL>
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
