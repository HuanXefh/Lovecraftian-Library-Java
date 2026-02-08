/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * Like {INTF_BLK_rangeDisplay} but for circular range.
   * ---------------------------------------- */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const CLS_interface = require("lovec/cls/struct/CLS_interface");
  const VAR = require("lovec/glb/GLB_var");


  const MDL_cond = require("lovec/mdl/MDL_cond");
  const MDL_draw = require("lovec/mdl/MDL_draw");


  /* <---------- component ----------> */


  function comp_drawPlace(blk, tx, ty, rot, valid) {
    blk.useP3dRange ?
      LCDrawP3D.cylinderFade(tx.toFCoord(blk.size), ty.toFCoord(blk.size), 1.0, blk.blkRad, blk.ex_getBlkRadColor(valid)) :
      MDL_draw._d_circlePlace(blk, tx, ty, blk.blkRad, blk.ex_getBlkRadColor(valid), true);
  };


  function comp_draw(b) {
    if(!b.isPayload() && b.block.delegee.useP3dRange && MDL_cond._posHoveredRect(b.x, b.y, 0, b.block.size)) {
      processZ(VAR.lay_p3dRange);
      LCDrawP3D.cylinderFade(b.x, b.y, 1.0, b.block.delegee.blkRad, b.block.ex_getBlkRadColor(true));
      processZ(VAR.lay_p3dRange);
    };
  };


  function comp_drawSelect(b) {
    if(!b.block.delegee.useP3dRange) {
      MDL_draw._d_circleSelect(b, b.block.delegee.blkRad, b.block.ex_getBlkRadColor(true), true);
    };
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
        // @PARAM: Radius to show.
        blkRad: 40.0,
        // @PARAM: Whether to draw pseudo-3D range instead of vanilla dashed circle.
        useP3dRange: true,
      }),


      drawPlace: function(tx, ty, rot, valid) {
        comp_drawPlace(this, tx, ty, rot, valid);
      },


      // @LATER
      ex_getBlkRadColor: function(valid) {
        return Pal.accent;
      }
      .setProp({
        noSuper: true,
        argLen: 1,
      }),


    }),


    // Building
    new CLS_interface({


      draw: function() {
        comp_draw(this);
      },


      drawSelect: function() {
        comp_drawSelect(this);
      },


    }),


  ];
