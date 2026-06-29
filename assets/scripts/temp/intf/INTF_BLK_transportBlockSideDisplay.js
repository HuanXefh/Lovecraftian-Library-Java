/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  /* <---------- component ----------> */


  function comp_load(blk) {
    if(blk.noSideReg) return;

    blk.sideReg1 = fetchRegionOrNull(blk, "-side1", "-side");
    blk.sideReg2 = fetchRegionOrNull(blk, "-side2", "-side");
  };


  function comp_onProximityUpdate(b) {
    if(b.block.delegee.noSideReg) return;

    let b_t = b.nearby(b.rotation);
    let b_f = b.nearby((b.rotation + 2) % 4);
    let b_s1 = b.nearby((b.rotation + 1) % 4);
    let b_s2 = b.nearby((b.rotation + 3) % 4);

    // This is nightmare
    b.shouldDrawSide1 = !(
      (b_f != null && b_f.team === b.team && b.block.ex_shouldBlendBackSide(b_f))
        || (b_s1 != null && b_s1.team === b.team && GEOMETRY_HANDLER.accept(b_s1, b, MDL_cond._isGenericRouter(b_s1.block), !MDL_cond._isNoSideBlock(b.block) || MDL_cond._isSameNoSideBlock(b_s1.block, b.block)) && b.block.ex_shouldBlendFlankSide(b_s1))
        || (b_s2 != null && b_s2.team === b.team && GEOMETRY_HANDLER.accept(b_s2, b, MDL_cond._isGenericRouter(b_s2.block), !MDL_cond._isNoSideBlock(b.block) || MDL_cond._isSameNoSideBlock(b_s2.block, b.block)) && b.block.ex_shouldBlendFlankSide(b_s2))
    );
    b.shouldDrawSide2 = !(b_t != null && b_t.team === b.team && b.block.ex_shouldBlendFrontSide(b_t));
  };


  function comp_pickedUp(b) {
    if(b.block.delegee.noSideReg) return;

    // Is it even possible to see the payload???
    b.shouldDrawSide1 = b.shouldDrawSide2 = true;
  };


  function comp_draw(b) {
    if(b.block.delegee.noSideReg) return;

    if(b.shouldDrawSide1) MDL_draw._reg_side(b.x, b.y, b.block.delegee.sideReg1, b.block.delegee.sideReg1, b.rotation, null, null, b.block.delegee.sideRegZ);
    if(b.shouldDrawSide2) MDL_draw._reg_side(b.x, b.y, b.block.delegee.sideReg2, b.block.delegee.sideReg2, (b.rotation + 2) % 4, null, null, b.block.delegee.sideRegZ);
  };


/*
  ========================================
  Section: Application
  ========================================
*/


  module.exports = [


    /**
     * Used to draw side regions for conveyors and ducts.
     * @class INTF_BLK_transportBlockSideDisplay
     */
    new CLS_interface("INTF_BLK_transportBlockSideDisplay", {


      __PARAM_OBJ_SETTER__: () => ({


        /**
         * <PARAM>: Whether side regions are NOT used.
         * @memberof INTF_BLK_transportBlockSideDisplay
         * @instance
         */
        noSideReg: false,
        /**
         * <PARAM>: Layer for side regions.
         * @memberof INTF_BLK_transportBlockSideDisplay
         * @instance
         */
        sideRegZ: null,


        /* <------------------------------ internal ------------------------------ */


        /**
         * <INTERNAL>
         * @memberof INTF_BLK_transportBlockSideDisplay
         * @instance
         */
        sideReg1: null,
        /**
         * <INTERNAL>
         * @memberof INTF_BLK_transportBlockSideDisplay
         * @instance
         */
        sideReg2: null,


      }),


      load: function() {
        comp_load(this);
      },


      /**
       * <LATER>
       * @memberof INTF_BLK_transportBlockSideDisplay
       * @instance
       * @param {Building} ob
       * @return {boolean}
       */
      ex_shouldBlendBackSide: function(ob) {
        return true;
      }
      .setProp({
        noSuper: true,
        argLen: 1,
      }),


      /**
       * <LATER>
       * @memberof INTF_BLK_transportBlockSideDisplay
       * @instance
       * @param {Building} ob
       * @return {boolean}
       */
      ex_shouldBlendFlankSide: function(ob) {
        return true;
      }
      .setProp({
        noSuper: true,
        argLen: 1,
      }),


      /**
       * <LATER>
       * @memberof INTF_BLK_transportBlockSideDisplay
       * @instance
       * @param {Building} ob
       * @return {boolean}
       */
      ex_shouldBlendFrontSide: function(ob) {
        return true;
      }
      .setProp({
        noSuper: true,
        argLen: 1,
      }),


    }),


    /**
     * @class INTF_B_transportBlockSideDisplay
     */
    new CLS_interface("INTF_B_transportBlockSideDisplay", {


      __PARAM_OBJ_SETTER__: () => ({


        /* <------------------------------ internal ------------------------------ */


        /**
         * <INTERNAL>
         * @memberof INTF_B_transportBlockSideDisplay
         * @instance
         */
        shouldDrawSide1: false,
        /**
         * <INTERNAL>
         * @memberof INTF_B_transportBlockSideDisplay
         * @instance
         */
        shouldDrawSide2: false,


      }),


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
