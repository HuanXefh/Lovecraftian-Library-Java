/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * Handles methods that check terrain type for valid placement..
   * ---------------------------------------- */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const CLS_interface = require("lovec/cls/struct/CLS_interface");


  const MDL_bundle = require("lovec/mdl/MDL_bundle");
  const MDL_draw = require("lovec/mdl/MDL_draw");
  const MDL_terrain = require("lovec/mdl/MDL_terrain");
  const MDL_text = require("lovec/mdl/MDL_text");


  /* <---------- component ----------> */


  function comp_setStats(blk) {
    if(blk.ters.length === 0) return;

    blk.stats.add(
      blk.terMode === "enable" ? fetchStat("lovec", "blk-terreq") : fetchStat("lovec", "blk-terban"),
      MDL_text._tagText(blk.ters.map(ter => MDL_terrain._terB(ter))).color(blk.terMode === "enable" ? Pal.heal : Pal.remove),
    );
  };


  const comp_canPlaceOn = function thisFun(blk, t, team, rot) {
    if(t == null) return false;

    if(Array.someMismatch(thisFun.tmpTup, true, blk, t, team, rot)) {
      thisFun.tmpTup[4] = MDL_terrain._ter(t, blk.size, blk.ex_getTerrainCheckR());
      thisFun.tmpTup[5] = MDL_terrain._terB(thisFun.tmpTup[4]);
    };

    let cond = true;
    if(blk.terMode === "enable") {
      if(thisFun.tmpTup[4] == null || !blk.ters.includes(thisFun.tmpTup[4])) {
        MDL_draw._d_textPlace(blk, t.x, t.y, MDL_bundle._info("lovec", "text-terrain-enabled") + " " + thisFun.tmpTup[5], false, blk.terTextOffTy);
        cond = false;
      };
    } else {
      if(thisFun.tmpTup[4] != null && blk.ters.includes(thisFun.tmpTup[4])) {
        MDL_draw._d_textPlace(blk, t.x, t.y, MDL_bundle._info("lovec", "text-terrain-disabled") + " " + thisFun.tmpTup[5], false, blk.terTextOffTy);
        cond = false;
      };
    };

    return cond;
  }
  .setProp({
    tmpTup: [],
  });


/*
  ========================================
  Section: Application
  ========================================
*/


  module.exports = [


    // Block
    new CLS_interface({


      __PARAM_OBJ_SETTER__: () => ({
        // @PARAM: Terrain types involved.
        ters: prov(() => []),
        // @PARAM: "enable" for requirement, "disable" for restriction.
        terMode: "enable",
        // @PARAM: Integer offset of the terrain text in {blk.drawPlace}.
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


      /* ----------------------------------------
       * NOTE:
       *
       * Range used for terrain calculation.
       * Do not set it dynamic or too large!
       * ---------------------------------------- */
      ex_getTerrainCheckR: function() {
        return 5;
      }
      .setProp({
        noSuper: true,
      }),


    }),


    // Building
    new CLS_interface({}),


  ];
