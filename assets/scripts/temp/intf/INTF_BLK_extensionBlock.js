/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * This block can only be placed near some blocks.
   * ---------------------------------------- */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const CLS_interface = require("lovec/cls/struct/CLS_interface");
  const TIMER = require("lovec/glb/GLB_timer");


  const MDL_content = require("lovec/mdl/MDL_content");
  const MDL_pos = require("lovec/mdl/MDL_pos");
  const MDL_table = require("lovec/mdl/MDL_table");


  /* <---------- component ----------> */


  function comp_init(blk) {
    blk.blkTgs.inSituMap(nmBlk => MDL_content._ct(nmBlk, "blk")).pullAll(null);
    if(blk.blkTgs.length === 0) {
      Vars.content.blocks().each(oblk => blk.filterScrTup[0](blk, oblk), oblk => blk.extensionTmpBlks.push(oblk));
    };
  };


  function comp_setStats(blk) {
    blk.stats.add(fetchStat("lovec", "blk0misc-blktg"), newStatValue(tb => {
      tb.row();
      MDL_table.setDisplay_ctLi(tb, blk.blkTgs.length > 0 ? blk.blkTgs : blk.extensionTmpBlks);
    }));
  };


  const comp_canPlaceOn = function thisFun(blk, t, team, rot) {
    if(Array.someMismatch(thisFun.tmpTup, true, blk, t, team, rot)) {
      thisFun.tmpTup[4] = blk.ex_checkValidExtension(t, team, rot);
    };

    return thisFun.tmpTup[4];
  }
  .setProp({
    tmpTup: [],
  });


  function comp_ex_findExtensionTs(blk, contArr, tx, ty, rot) {
    contArr.clear();
    !blk.rotate ?
      MDL_pos._tsEdge(Vars.world.tile(tx, ty), blk.size, false, contArr) :
      MDL_pos._tsRot(Vars.world.tile(tx, ty), rot, blk.size, contArr);

    return contArr;
  };


  function comp_ex_checkValidExtension(blk, t, team, rot) {
    return blk.ex_findExtensionTs(blk, blk.extensionTmpTs, t.x, t.y, rot).some(ot => ot.build != null && ot.build.team === team && blk.filterScrTup[0](blk, ot.build.block));
  };


  function comp_updateTile(b) {
    if(TIMER.secTwo) {
      b.extensionValid = b.block.ex_checkValidExtension(b.tile, b.team, b.rotation);
    };
  };


  function comp_updateEfficiencyMultiplier(b) {
    if(!b.extensionValid) b.efficiency = 0.0;
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


    // Block
    new CLS_interface({


      __PARAM_OBJ_SETTER__: () => ({
        // @PARAM: Condition for valid extension. By default, this checks if a block is found in {blkTgs}.
        // @ARGS: blk, oblk
        filterScrTup: prov(() => [(blk, oblk) => blk.delegee.blkTgs.includes(oblk)]),
        // @PARAM: Blocks seen as extension targets.
        blkTgs: prov(() => []),

        extensionTmpBlks: prov(() => []),
        extensionTmpTs: prov(() => []),
      }),


      init: function() {
        comp_init(this);
      },


      setStats: function() {
        comp_setStats(this);
      },


      canPlaceOn: function(t, team, rot) {
        return comp_canPlaceOn(this, t, team, rot);
      }
      .setProp({
        boolMode: "true",
      }),


      ex_findExtensionTs: function(contArr, tx, ty, rot) {
        return comp_ex_findExtensionTs(this, contArr, tx, ty, rot);
      }
      .setProp({
        noSuper: true,
      }),


      ex_checkValidExtension: function(t, team, rot) {
        return comp_ex_checkValidExtension(this, t, team, rot);
      }
      .setProp({
        noSuper: true,
      }),


    }),


    // Building
    new CLS_interface({


      __PARAM_OBJ_SETTER__: () => ({
        extensionValid: false,
      }),


      updateTile: function() {
        extensionValid(this);
      },


      updateEfficiencyMultiplier: function() {
        comp_updateEfficiencyMultiplier(this);
      },


      ex_postUpdateEfficiencyMultiplier: function() {
        comp_ex_postUpdateEfficiencyMultiplier(this);
      }
      .setProp({
        noSuper: true,
      }),


    }),


  ];
