/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * Handles retangular range display.
   * No stat is added.
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
      LCDrawP3D.roomFade(tx.toFCoord(blk.size), ty.toFCoord(blk.size), 1.0, blk.blkR.toRectW(blk.size), blk.blkR.toRectW(blk.size), blk.ex_getBlkRColor(valid)) :
      MDL_draw._d_rectPlace(blk, tx, ty, blk.blkR, blk.ex_getBlkRColor(valid), true);
  };


  function comp_draw(b) {
    if(!b.isPayload() && b.block.delegee.useP3dRange && MDL_cond._posHoveredRect(b.x, b.y, 0, b.block.size)) {
      processZ(VAR.lay_p3dRange);
      LCDrawP3D.roomFade(b.x, b.y, 1.0, b.block.delegee.blkR.toRectW(b.block.size), b.block.delegee.blkR.toRectW(b.block.size), b.block.ex_getBlkRColor(true));
      processZ(VAR.lay_p3dRange);
    };
  };


  function comp_drawSelect(b) {
    if(!b.block.delegee.useP3dRange) {
      MDL_draw._d_rectSelect(b, b.block.delegee.blkR, b.block.ex_getBlkRColor(true), true);
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
        // @PARAM: Range (in blocks) to show.
        blkR: 5,
        // @PARAM: See {INTF_BLK_radiusDisplay}.
        useP3dRange: true,
      }),


      drawPlace: function(tx, ty, rot, valid) {
        comp_drawPlace(this, tx, ty, rot, valid);
      },


      // @LATER
      ex_getBlkRColor: function(valid) {
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
