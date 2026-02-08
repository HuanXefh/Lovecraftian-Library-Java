/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * @SINGLESIZE
   * Conveyor, the most basic way of item transportation.
   * I tried to change that item capacity of 3, but it's too hard-coded.
   * ---------------------------------------- */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = require("lovec/temp/blk/BLK_baseItemDistributor");


  const MDL_cond = require("lovec/mdl/MDL_cond");
  const MDL_draw = require("lovec/mdl/MDL_draw");


  /* <---------- component ----------> */


  function comp_load(blk) {
    blk.sideReg1 = fetchRegionOrNull(blk, "-side1", "-side");
    blk.sideReg2 = fetchRegionOrNull(blk, "-side2", "-side");
  };


  function comp_onProximityUpdate(b) {
    let b_t = b.nearby(b.rotation);
    let b_f = b.nearby((b.rotation + 2) % 4);
    let b_s1 = b.nearby((b.rotation + 1) % 4);
    let b_s2 = b.nearby((b.rotation + 3) % 4);

    b.shouldDrawSide1 = !(
      (b_f != null && b_f.team === b.team && (b_f.block.outputsItems() || b_f.block instanceof Conveyor) && !MDL_cond._isCable(b_f.block))
        || (b_s1 != null && b_s1.block instanceof Conveyor && b_s1.team === b.team && b_s1.nearby(b_s1.rotation) === b)
        || (b_s2 != null && b_s2.block instanceof Conveyor && b_s2.team === b.team && b_s2.nearby(b_s2.rotation) === b)
    );
    b.shouldDrawSide2 = !(b_t != null && b_t.team === b.team && b_t.items != null && !MDL_cond._isCable(b_t.block));
  };


  function comp_pickedUp(b) {
    // Is it even possible to see the payload???
    b.shouldDrawSide1 = b.shouldDrawSide2 = true;
  };


  function comp_draw(b) {
    if(b.block.delegee.noSideReg) return;

    if(b.shouldDrawSide1) MDL_draw._reg_side(b.x, b.y, b.block.delegee.sideReg1, b.block.delegee.sideReg1, b.rotation, null, null, Layer.block - 0.19);
    if(b.shouldDrawSide2) MDL_draw._reg_side(b.x, b.y, b.block.delegee.sideReg2, b.block.delegee.sideReg2, (b.rotation + 2) % 4, null, null, Layer.block - 0.19);
  };


/*
  ========================================
  Section: Application
  ========================================
*/


  module.exports = [


    // Block
    newClass().extendClass(PARENT[0]).initClass()
    .setParent(Conveyor)
    .setTags("blk-dis", "blk-conv")
    .setParam({
      // @PARAM: Whether side regions are not used.
      noSideReg: false,

      sideReg1: null,
      sideReg2: null,
    })
    .setMethod({


      load: function() {
        comp_load(this);
      },


      ex_isSingleSized: function() {
        return true;
      }
      .setProp({
        noSuper: true,
        override: true,
      }),


    }),


    // Building
    newClass().extendClass(PARENT[1]).initClass()
    .setParent(Conveyor.ConveyorBuild)
    .setParam({
      shouldDrawSide1: false,
      shouldDrawSide2: false,
    })
    .setMethod({


      onProximityUpdate: function() {
        comp_onProximityUpdate(this);
      },


      pickedUp: function() {
        comp_pickedUp(this);
      },


      draw: function() {
        comp_draw(this);
      },


    }),


  ];
