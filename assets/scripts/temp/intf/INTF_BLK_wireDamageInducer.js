/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  /* <---------- component ----------> */


  function comp_init(blk) {
    blk.update = true;
  };


  function comp_ex_getWireGlowAlpha(blk, x1, y1, x2, y2) {
    let b = Vars.world.buildWorld(x1, y1);
    let b_t = Vars.world.buildWorld(x2, y2);
    if(b == null || b_t == null || b.power == null || b_t.power == null) return 0.0;

    return Math.max(b.power.status, b_t.power.status);
  };


  function comp_updateTile(b) {
    if(!TIMER.secQuarter) return;
    let dmg = b.block.delegee.wireTouchDmg * b.power.status;
    if(dmg < 0.0001) return;
    let b_t = b.ex_findWireTarget();
    if(b_t == null || b_t.power == null || b_t.power < 0.01) return;
    let unit = MDL_pos._rayFind_unit(b.x, b.y, b_t.x, b_t.y, ounit => MDL_cond._isBoosting(ounit));
    if(unit == null) return;

    TRIGGER.wireTouch.fire(b, unit);
    FRAG_attack._a_lightning(unit.x, unit.y, null, dmg, 3, 7, 8, b.block.delegee.wireArcColor, "air");
  };


/*
  ========================================
  Section: Application
  ========================================
*/


  module.exports = [


    /**
     * Handles wire damage.
     * Does not draw wire.
     * @class INTF_BLK_wireDamageInducer
     */
    new CLS_interface("INTF_BLK_wireDamageInducer", {


      __PARAM_OBJ_SETTER__: () => ({


        /**
         * <PARAM>: Wire material. See {@link DB_block}.
         * @memberof INTF_BLK_wireDamageInducer
         * @instance
         */
        wireMat: "copper",
        /**
         * <PARAM>: Damage dealt when a boosting unit touches the wire.
         * @memberof INTF_BLK_wireDamageInducer
         * @instance
         */
        wireTouchDmg: 0.0,
        /**
         * <PARAM>: Lightning color.
         * @memberof INTF_BLK_wireDamageInducer
         * @instance
         */
        wireArcColor: Pal.accent,


      }),


      init: function() {
        comp_init(this);
      },


      /**
       * @memberof INTF_BLK_wireDamageInducer
       * @instance
       * @param {number} x1
       * @param {number} y1
       * @param {number} x2
       * @param {number} y2
       * @return {number}
       */
      ex_getWireGlowAlpha: function(x1, y1, x2, y2) {
        return comp_ex_getWireGlowAlpha(this, x1, y1, x2, y2);
      }
      .setProp({
        noSuper: true,
      }),


    }),


    /**
     * @class INTF_B_wireDamageInducer
     */
    new CLS_interface("INTF_B_wireDamageInducer", {


      updateTile: function() {
        comp_updateTile(this);
      },


      /**
       * Finds a random target building to check whether a boosting unit is on the way.
       * Normally a target building is a building connected to this wire block.
       * <br> <LATER>
       * @memberof INTF_B_wireDamageInducer
       * @instance
       * @return {Building|null}
       */
      ex_findWireTarget: function() {
        return null;
      }
      .setProp({
        noSuper: true,
      }),


    }),


  ];
