/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * Handles utility methods related to depth ore.
   * ---------------------------------------- */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const CLS_interface = require("lovec/cls/struct/CLS_interface");
  const VARGEN = require("lovec/glb/GLB_varGen");


  const MDL_cond = require("lovec/mdl/MDL_cond");


  /* <---------- component ----------> */


  function comp_ex_findPlaceRsIcon(blk, tx, ty, rs) {
    return blk.ex_isMiningDpore(tx, ty, rs) && !blk.ex_anyDeporeRevealed(tx, ty, rs) ?
      VARGEN.iconRegs.questionMark :
      rs.uiIcon;
  };


  function comp_ex_findDporesInLinkedTiles(blk, tx, ty, rs) {
    if(blk.skipDepthOreMethod) return Reflect.get(Block, "tempTiles").clear();
    let t = Vars.world.tile(tx, ty);
    if(t == null) return Reflect.get(Block, "tempTiles").clear();

    return t.getLinkedTilesAs(blk, Reflect.get(Block, "tempTiles")).removeAll(
      ot => (rs instanceof Item || rs === "item") ?
        ((rs !== "item" && ot.overlay().itemDrop !== rs) || !MDL_cond._isDepthOre(ot.overlay())) :
        (!MDL_cond._isDepthLiquid(ot.overlay()) || (rs !== "liquid" && ot.overlay().ex_getRsDrop() !== rs))
    );
  };


  function comp_ex_isMiningDepore(blk, tx, ty, rs) {
    return blk.ex_findDporesInLinkedTiles(tx, ty, rs).size > 0;
  };


  function comp_ex_anyDeporeRevealed(blk, tx, ty, rs) {
    return blk.ex_findDporesInLinkedTiles(tx, ty, rs).find(ot => tryFun(ot.overlay().ex_accRevealed, ot.overlay(), true, ot, "read")) != null;
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
        // @PARAM: Whether to skip methods here.
        skipDepthOreMethod: false,
      }),


      ex_findPlaceRsIcon: function(tx, ty, rs) {
        return comp_ex_findPlaceRsIcon(this, tx, ty, rs);
      }
      .setProp({
        noSuper: true,
        argLen: 3,
      }),


      ex_findDporesInLinkedTiles: function(tx, ty, rs) {
        return comp_ex_findDporesInLinkedTiles(this, tx, ty, rs);
      }
      .setProp({
        noSuper: true,
        argLen: 3,
      }),


      ex_isMiningDpore: function(tx, ty, rs) {
        return comp_ex_isMiningDepore(this, tx, ty, rs);
      }
      .setProp({
        noSuper: true,
        argLen: 3,
      }),


      ex_anyDeporeRevealed: function(tx, ty, rs) {
        return comp_ex_anyDeporeRevealed(this, tx, ty, rs);
      }
      .setProp({
        noSuper: true,
        argLen: 3,
      }),


    }),


    // Building
    new CLS_interface({}),


  ];
