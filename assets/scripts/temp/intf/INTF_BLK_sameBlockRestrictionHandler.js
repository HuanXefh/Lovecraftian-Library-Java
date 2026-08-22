/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  /* <---------- component ----------> */


  function comp_setStats(blk) {
    blk.stats.add(fetchStat("lovec", "blk0misc-restrictr"), blk.placeRestrictR, StatUnit.blocks);
  };


  const comp_canPlaceOn = function thisFun(blk, t, team, rot) {
    if(LCNativeArray.checkTupChange(thisFun.tmpTup, blk, t, team, rot)) {
      blk.ex_findPlaceRestrictTs(blk.placeRestrictTmpTs, t, rot);
      thisFun.tmpCond = !LCEntity.getBuildsByTiles(blk.placeRestrictTmpBs, blk.placeRestrictTmpTs).some(ob => blk.sameTypeFilter.get(blk, ob.block));
    };

    return thisFun.tmpCond;
  }
  .setProp({
    tmpTup: [],
    tmpCond: false,
  });


  function comp_ex_findPlaceRestrictTs(blk, contArr, t, rot) {
    return blk.rotate ?
      LCPos.getTilesRectRotCenter(contArr, t, blk.placeRestrictR, blk.size, rot) :
      !blk.useCircularPlaceRestrict ?
        LCPos.getTilesRect(contArr, t, blk.placeRestrictR, blk.size) :
        LCPos.getTilesCircle(contArr, t, blk.placeRestrictR, blk.size);
  };


  function comp_onProximityUpdate(b) {
    b.block.ex_findPlaceRestrictTs(b.placeRestrictTmpTs, b.tile, b.rotation);
  };


  function comp_updateTile(b) {
    if(TIMER.secFive) {
      b.placeRestrictEffc = LCEntity.getBuildsByTiles(b.placeRestrictTmpBs, b.placeRestrictTmpTs).some(ob => ob.id !== b.id && b.block.delegee.sameTypeFilter.get(b.block, ob.block)) ?
        0.0 :
        1.0;
    };
  };


  function comp_updateEfficiencyMultiplier(b) {
    b.efficiency *= b.placeRestrictEffc;
  };


  function comp_ex_postUpdateEfficiencyMultiplier(b) {
    comp_updateEfficiencyMultiplier(b);
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


      __paramObjM__: () => ({


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
        /**
         * `PARAM`: Same type check.
         * <br> `ARGS`: blk, oblk.
         * @memberof INTF_BLK_sameBlockRestrictionHandler
         * @instance
         */
        sameTypeFilter: tprov(() => boolf2(function(blk, oblk) {return blk === oblk})),


        /* <------------------------------ internal ------------------------------ */


        /**
         * `INTERNAL`
         * @memberof INTF_BLK_sameBlockRestrictionHandler
         * @instance
         */
        placeRestrictTmpTs: tprov(() => []),
        /**
         * `INTERNAL`
         * @memberof INTF_BLK_sameBlockRestrictionHandler
         * @instance
         */
        placeRestrictTmpBs: tprov(() => []),


      }),


      setStats: function() {
        comp_setStats(this);
      },


      changePlacementPath: function(ponSeq, rot) {
        Placement.calculateNodes(ponSeq, this, rot, (pon, opon) => rot % 2 == 0 ?
          Math.abs(pon.x - opon.x) <= (this.size + this.placeRestrictR) :
          Math.abs(pon.y - opon.y) <= (this.size + this.placeRestrictR)
        );
      }
      .setProp({
        noSuper: true,
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
    new CLS_interface("INTF_B_sameBlockRestrictionHandler", {


      __paramObjM__: () => ({


        /* <------------------------------ internal ------------------------------ */


        /**
         * `INTERNAL`
         * @memberof INTF_B_sameBlockRestrictionHandler
         * @instance
         */
        placeRestrictTmpTs: tprov(() => []),
        /**
         * `INTERNAL`
         * @memberof INTF_B_sameBlockRestrictionHandler
         * @instance
         */
        placeRestrictTmpBs: tprov(() => []),
        /**
         * `INTERNAL`
         * @memberof INTF_B_sameBlockRestrictionHandler
         * @instance
         */
        placeRestrictEffc: 1.0,


      }),


      onProximityUpdate: function() {
        comp_onProximityUpdate(this);
      },


      updateTile: function() {
        comp_updateTile(this);
      },


      updateEfficiencyMultiplier: function() {
        comp_updateEfficiencyMultiplier(this);
      },


      /**
       * @memberof INTF_B_sameBlockRestrictionHandler
       * @instance
       * @return {void}
       */
      ex_postUpdateEfficiencyMultiplier: function() {
        comp_ex_postUpdateEfficiencyMultiplier(this);
      }
      .setProp({
        noSuper: true,
      }),


    }),


  ];
