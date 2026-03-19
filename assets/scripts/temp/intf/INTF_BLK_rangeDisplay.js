/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  /* <---------- component ----------> */


  function comp_drawPlace(blk, tx, ty, rot, valid) {
    blk.useP3dRange ?
      LCDrawP3D.roomFade(tx.toFCoord(blk.size), ty.toFCoord(blk.size), 1.0, blk.blkR.toRectW(blk.size), blk.blkR.toRectW(blk.size), blk.ex_getBlkRColor(valid)) :
      MDL_draw._d_rectPlace(blk, tx, ty, blk.blkR, blk.ex_getBlkRColor(valid), true);
  };


  function comp_draw(b) {
    if(!b.isPayload() && b.block.delegee.useP3dRange && LCCheck.checkPosHoveredRect(b.x, b.y, 0, b.block.size)) {
      processZ(VAR.lay_p3dRange);
      LCDrawP3D.roomFade(b.x, b.y, 1.0, b.block.delegee.blkR.toRectW(b.block.size), b.block.delegee.blkR.toRectW(b.block.size), b.block.ex_getBlkRColor(true));
      processZ();
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


    /**
     * Handles rectangular range display.
     * No stat is added.
     * @class INTF_BLK_rangeDisplay
     */
    new CLS_interface("INTF_BLK_rangeDisplay", {


      __PARAM_OBJ_SETTER__: () => ({


        /**
         * <PARAM>: Range (in blocks) to show.
         * @memberof INTF_BLK_rangeDisplay
         * @instance
         */
        blkR: 5,
        /**
         * <PARAM>: See {@link INTF_BLK_radiusDisplay}.
         * @memberof INTF_BLK_rangeDisplay
         * @instance
         */
        useP3dRange: true,


      }),


      drawPlace: function(tx, ty, rot, valid) {
        comp_drawPlace(this, tx, ty, rot, valid);
      },


      /**
       * <LATER>
       * @memberof INTF_BLK_rangeDisplay
       * @instance
       * @param {boolean} valid
       * @return {Color}
       */
      ex_getBlkRColor: function(valid) {
        return Pal.accent;
      }
      .setProp({
        noSuper: true,
        argLen: 1,
      }),


    }),


    /**
     * @class INTF_B_rangeDisplay
     */
    new CLS_interface("INTF_B_rangeDisplay", {


      draw: function() {
        comp_draw(this);
      },


      drawSelect: function() {
        comp_drawSelect(this);
      },


    }),


  ];
