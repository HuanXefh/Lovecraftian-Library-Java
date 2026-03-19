/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  /* <---------- component ----------> */


  function comp_update(unit) {
    if(unit.shouldDespawnForNoLink && (unit.bLink == null || !unit.bLink.isValid() || unit.bLink.team !== unit.team)) {
      unit.noLinkTimeCur += Time.delta;
    } else {
      unit.noLinkTimeCur = Mathf.maxZero(unit.noLinkTimeCur - Time.delta);
    };
    if(unit.noLinkTimeCur >= VAR.time_noLinkDespawnTime) {
      MDL_call.despawnUnit(unit);
    };
  };


/*
  ========================================
  Section: Application
  ========================================
*/


  /**
   * A unit linked to some building.
   * @class INTF_ENTITY_tetheredEntity
   */
  module.exports = new CLS_interface("INTF_ENTITY_tetheredEntity", {


    __PARAM_OBJ_SETTER__: () => ({


      /* <------------------------------ internal ------------------------------ */


      /**
       * <INTERNAL>: Linked building.
       * @memberof INTF_ENTITY_tetheredEntity
       * @instance
       */
      bLink: null,
      /**
       * <INTERNAL>: If this unit can exist when no link found, set this to false.
       * @memberof INTF_ENTITY_tetheredEntity
       * @instance
       */
      shouldDespawnForNoLink: true,
      /**
       * <INTERNAL>
       * @memberof INTF_ENTITY_tetheredEntity
       * @instance
       */
      noLinkTimeCur: 0.0,


    }),


    update: function(unit, staEn) {
      comp_update(this, unit, staEn);
    },


    /**
     * Sets linked building of this unit.
     * @memberof INTF_ENTITY_tetheredEntity
     * @instance
     * @param {Building} ob
     * @return {void}
     */
    ex_setBLink: function(ob) {
      if(ob.isValid() && ob.team === unit.team) {
        this.bLink = ob;
      };
    }
    .setProp({
      noSuper: true,
    }),


  });
