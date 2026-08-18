/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  /* <---------- component ----------> */


  function comp_setStats(blk) {
    if(blk.ters.length === 0) return;

    blk.stats.add(
      blk.terMode === "enable" ? fetchStat("lovec", "blk-terreq") : fetchStat("lovec", "blk-terban"),
      MDL_text.getTagText(blk.ters.map(ter => MDL_terrain.getTerB(ter))).color(blk.terMode === "enable" ? Pal.heal : Pal.remove),
    );
  };


  const comp_canPlaceOn = function thisFun(blk, t, team, rot) {
    if(t == null) return false;
    if(blk.ters.length === 0) return true;

    if(LCNativeArray.checkTupChange(thisFun.tmpTup, blk, t, team, rot)) {
      thisFun.tmpTer = MDL_terrain.getTer(t, blk.size, blk.ex_getTerrainCheckR());
      thisFun.tmpTerB = MDL_terrain.getTerB(thisFun.tmpTer);
    };

    let cond = true;
    if(blk.terMode === "enable") {
      if(thisFun.tmpTer == null || !blk.ters.includes(thisFun.tmpTer)) {
        LCDrawf.textPlace(blk, t.x, t.y, MDL_bundle.getInfo("lovec", "text-terrain-enabled") + " " + thisFun.tmpTerB, false, blk.terTextOffTy);
        cond = false;
      };
    } else {
      if(thisFun.tmpTer != null && blk.ters.includes(thisFun.tmpTer)) {
        LCDrawf.textPlace(blk, t.x, t.y, MDL_bundle.getInfo("lovec", "text-terrain-disabled") + " " + thisFun.tmpTerB, false, blk.terTextOffTy);
        cond = false;
      };
    };

    return cond;
  }
  .setProp({
    tmpTup: [],
    tmpTer: null,
    tmpTerB: "",
  });


/*
  ========================================
  Section: Application
  ========================================
*/


  module.exports = [


    /**
     * Handles methods that check terrain type for valid placement.
     * @class INTF_BLK_terrainHandler
     */
    new CLS_interface("INTF_BLK_terrainHandler", {


      __paramObjM__: () => ({


        /**
         * `PARAM`: Terrain types involved.
         * @memberof INTF_BLK_terrainHandler
         * @instance
         */
        ters: tprov(() => []),
        /**
         * `PARAM`: "enable" for requirement, "disable" for restriction.
         * @memberof INTF_BLK_terrainHandler
         * @instance
         */
        terMode: "enable",
        /**
         * `PARAM`: Integer offset of the terrain text in `blk.drawPlace`.
         * @memberof INTF_BLK_terrainHandler
         * @instance
         */
        terTextOffTy: 0,


      }),


      setStats: function() {
        comp_setStats(this);
      },


      canPlaceOn: function(t, team, rot) {
        return comp_canPlaceOn(this, t, team, rot);
      }
      .setProp({
        boolMode: "and",
      }),


      /**
       * Range used for terrain check.
       * Do not set this too large!
       * @memberof INTF_BLK_terrainHandler
       * @instance
       * @return {number}
       */
      ex_getTerrainCheckR: function() {
        return 5;
      }
      .setProp({
        noSuper: true,
      }),


    }),


    /**
     * @class INTF_B_terrainHandler
     */
    new CLS_interface("INTF_B_terrainHandler", {}),


  ];
