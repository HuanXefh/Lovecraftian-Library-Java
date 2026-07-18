/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  /* <---------- auxiliary ----------> */


  let
    b_t,
    b_f,
    b_s1,
    b_s2;


  /* <---------- component ----------> */


  function comp_load(blk) {
    if(blk.noSideReg) return;

    blk.sideReg1 = fetchRegionOrNull(blk, "-side1", "-side");
    blk.sideReg2 = fetchRegionOrNull(blk, "-side2", "-side");
  };


  function comp_onProximityUpdate(b) {
    if(b.block.delegee.noSideReg) return;

    b.shouldDrawSide1 = LCGeometry.showBackSide(b);
    b.shouldDrawSide2 = LCGeometry.showFrontSide(b);
  };


  function comp_pickedUp(b) {
    if(b.block.delegee.noSideReg) return;

    // Is it even possible to see the payload???
    b.shouldDrawSide1 = b.shouldDrawSide2 = true;
  };


  function comp_draw(b) {
    if(b.block.delegee.noSideReg) return;

    if(b.shouldDrawSide1) {
      LCDrawf.side(b.x, b.y, b.block.delegee.sideReg1, b.rotation, Color.white, 1.0, b.block.delegee.sideRegZ);
    };
    if(b.shouldDrawSide2) {
      LCDrawf.side(b.x, b.y, b.block.delegee.sideReg2, b.rotation + 2, Color.white, 1.0, b.block.delegee.sideRegZ);
    };
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


      __paramObjSetter__: () => ({


        /**
         * `PARAM`: Whether side regions are NOT used.
         * @memberof INTF_BLK_transportBlockSideDisplay
         * @instance
         */
        noSideReg: false,
        /**
         * `PARAM`: Layer for side regions.
         * @memberof INTF_BLK_transportBlockSideDisplay
         * @instance
         */
        sideRegZ: -1,


        /* <------------------------------ internal ------------------------------ */


        /**
         * `INTERNAL`
         * @memberof INTF_BLK_transportBlockSideDisplay
         * @instance
         */
        sideReg1: null,
        /**
         * `INTERNAL`
         * @memberof INTF_BLK_transportBlockSideDisplay
         * @instance
         */
        sideReg2: null,


      }),


      load: function() {
        comp_load(this);
      },


      /**
       * `LATER`
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
       * `LATER`
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
       * `LATER`
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


      __paramObjSetter__: () => ({


        /* <------------------------------ internal ------------------------------ */


        /**
         * `INTERNAL`
         * @memberof INTF_B_transportBlockSideDisplay
         * @instance
         */
        shouldDrawSide1: false,
        /**
         * `INTERNAL`
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
