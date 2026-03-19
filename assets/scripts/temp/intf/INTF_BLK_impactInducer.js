/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  /* <---------- component ----------> */


  function comp_setStats(blk) {
    blk.stats.add(fetchStat("lovec", "blk-impactr"), blk.impactRad / Vars.tilesize, StatUnit.blocks);
  };


  function comp_drawPlace(blk, tx, ty, rot) {
    MDL_draw._d_pulseCircle(tx.toFCoord(blk.size), ty.toFCoord(blk.size), blk.impactRad);
  };


  function comp_ex_calcImpactDmg(blk, b) {
    return FRAG_attack._impactDmg(blk.size, blk.ex_calcImpactIntv(b));
  };


  function comp_ex_calcImpactDur(blk, b) {
    return FRAG_attack._impactDur(blk.ex_calcImpactIntv(b));
  };


  function comp_ex_calcImpactMinRad(blk, b) {
    return FRAG_attack._impactMinRad(blk.size);
  };


  function comp_drawSelect(b) {
    MDL_draw._d_pulseCircle(b.x, b.y, b.block.ex_calcImpactRad(b));
  };


  function comp_createImpactWave(b) {
    TRIGGER.impactWave.fire(b.x, b.y, b.block.ex_calcImpactDmg(b), b.block.ex_calcImpactRad(b));
    FRAG_attack._a_impact(
      b.x, b.y,
      b.block.ex_calcImpactDmg(b),
      b.block.ex_calcImpactDur(b),
      b.block.ex_calcImpactRad(b),
      b.block.ex_calcImpactMinRad(b),
      b.block.ex_calcImpactShake(b),
    );
    MDL_effect._e_dust(b.x, b.y, FRAG_attack._impactDustRad(b.block.size), Math.pow(b.block.size, 2));
    MDL_effect._e_colorDust(b.x, b.y, FRAG_attack._impactDustRad(b.block.size) * 1.5, b.tile.getFloorColor());
  };


/*
  ========================================
  Section: Application
  ========================================
*/


  module.exports = [


    /**
     * Handles impact wave creation.
     * @class INTF_BLK_impactInducer
     */
    new CLS_interface("INTF_BLK_impactInducer", {


      __PARAM_OBJ_SETTER__: () => ({


        /**
         * <PARAM>: Base impact wave radius.
         * @memberof INTF_BLK_impactInducer
         * @instance
         */
        impactRad: 40.0,


      }),


      setStats: function() {
        comp_setStats(this);
      },


      drawPlace: function(tx, ty, rot) {
        comp_drawPlace(this, tx, ty, rot);
      },


      /**
       * Calculates expected interval between each impact wave.
       * This affects things like impact damage by default.
       * <br> <LATER>
       * @memberof INTF_BLK_impactInducer
       * @instance
       * @param {Building} b
       * @return {number}
       */
      ex_calcImpactIntv: function(b) {
        return 60.0;
      }
      .setProp({
        noSuper: true,
        argLen: 1,
      }),


      /**
       * Calculates impact wave damage.
       * @memberof INTF_BLK_impactInducer
       * @instance
       * @param {Building} b
       * @return {number}
       */
      ex_calcImpactDmg: function(b) {
        return comp_ex_calcImpactDmg(this, b);
      }
      .setProp({
        noSuper: true,
        argLen: 1,
      }),


      /**
       * Calculates impact wave duration.
       * @memberof INTF_BLK_impactInducer
       * @instance
       * @param {Building} b
       * @return {number}
       */
      ex_calcImpactDur: function(b) {
        return comp_ex_calcImpactDur(this, b);
      }
      .setProp({
        noSuper: true,
        argLen: 1,
      }),


      /**
       * Calculates impact wave radius.
       * @memberof INTF_BLK_impactInducer
       * @instance
       * @param {Building} b
       * @return {number}
       */
      ex_calcImpactRad: function(b) {
        return this.impactRad;
      }
      .setProp({
        noSuper: true,
        argLen: 1,
      }),


      /**
       * Calculates minimum radius that impact wave can be absorbed by mobile floor like water.
       * @memberof INTF_BLK_impactInducer
       * @instance
       * @param {Building} b
       * @return {number}
       */
      ex_calcImpactMinRad: function(b) {
        return comp_ex_calcImpactMinRad(this, b);
      }
      .setProp({
        noSuper: true,
        argLen: 1,
      }),


      /**
       * Calculates impact wave shake.
       * @memberof INTF_BLK_impactInducer
       * @instance
       * @param {Building} b
       * @return {number}
       */
      ex_calcImpactShake: function(b) {
        return 1.0;
      }
      .setProp({
        noSuper: true,
        argLen: 1,
      }),


    }),


    /**
     * @class INTF_B_impactInducer
     */
    new CLS_interface("INTF_B_impactInducer", {


      drawSelect: function() {
        comp_drawSelect(this);
      },


      /**
       * Call this method to create impact wave.
       * @memberof INTF_B_impactInducer
       * @instance
       * @return {void}
       */
      ex_createImpactWave: function() {
        comp_createImpactWave(this);
      }
      .setProp({
        noSuper: true,
      }),


    }),


  ];
