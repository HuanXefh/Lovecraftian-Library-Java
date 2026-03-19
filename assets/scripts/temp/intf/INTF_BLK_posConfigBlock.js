/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  /* <---------- component ----------> */


  function comp_init() {
    blk.configurable = true;

    blk.config(Vec2, (b, vec2) => {
      b.delegee.posConfigVec2.set(vec2);
      b.delegee.posConfigT = Vars.world.tileWorld(vec2.x, vec2.y);
      b.delegee.posConfigB = Vars.world.buildWorld(vec2.x, vec2.y);
    });
  };


  function comp_onConfigureTapped(b, x, y) {
    if(Mathf.dst(b.x, b.y, x, y) <= b.ex_getPosConfigRad() && b.ex_checkPosConfigValid(x, y)) {
      b.configure(Tmp.v1.set(x, y));
      return true;
    };

    return false;
  };


/*
  ========================================
  Section: Application
  ========================================
*/


  module.exports = [


    /**
     * Handles position config that can be set by tapping somewhere.
     * @class INTF_BLK_posConfigBlock
     */
    new CLS_interface("INTF_BLK_posConfigBlock", {


      init: function() {
        comp_init(this);
      },


    }),


    /**
     * @class INTF_B_posConfigBlock
     */
    new CLS_interface("INTF_B_posConfigBlock", {


      __PARAM_OBJ_SETTER__: () => ({


        /* <------------------------------ internal ------------------------------ */


        /**
         * <INTERNAL>: Vector for config position.
         * @memberof INTF_B_posConfigBlock
         * @instance
         */
        posConfigVec2: prov(() => new Vec2()),
        /**
         * <INTERNAL>: Tile for config position.
         * @memberof INTF_B_posConfigBlock
         * @instance
         */
        posConfigT: null,
        /**
         * <INTERNAL>: Building for config position.
         * @memberof INTF_B_posConfigBlock
         * @instance
         */
        posConfigB: null,


      }),


      onConfigureTapped: function(x, y) {
        return comp_onConfigureTapped(this, x, y);
      },


      /**
       * Position selection radius.
       * <br> <LATER>
       * @memberof INTF_B_posConfigBlock
       * @instance
       * @return {number}
       */
      ex_getPosConfigRad: function() {
        return 0.0;
      }
      .setProp({
        noSuper: true,
      }),


      /**
       * Used to check whether a position is valid to be used.
       * <br> <LATER>
       * @memberof INTF_B_posConfigBlock
       * @instance
       * @param {number} x
       * @param {number} y
       * @return {boolean}
       */
      ex_checkPosConfigValid: function(x, y) {
        return true;
      }
      .setProp({
        noSuper: true,
      }),


    }),


  ];
