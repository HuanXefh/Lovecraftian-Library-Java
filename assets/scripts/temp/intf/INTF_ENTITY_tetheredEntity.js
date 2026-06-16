/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  /* <---------- component ----------> */


  function comp_update(unit) {
    if(!unit.type.delegee.isTetheredUnit) return;

    if(unit.type.delegee.noTetherDespawnTime >= 0.0 && (unit.bLink == null || !unit.bLink.isValid() || unit.bLink.team !== unit.team)) {
      unit.noTetherDespawnTimeCur += Time.delta;
    } else {
      unit.noTetherDespawnTimeCur = Mathf.maxZero(unit.noTetherDespawnTimeCur - Time.delta);
    };
    if(unit.noTetherDespawnTimeCur >= unit.type.delegee.noTetherDespawnTime) {
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
       * <INTERNAL>: Tethered building.
       * @memberof INTF_ENTITY_tetheredEntity
       * @instance
       */
      bLink: null,
      /**
       * <INTERNAL>
       * @memberof INTF_ENTITY_tetheredEntity
       * @instance
       */
      noTetherDespawnTimeCur: 0.0,


    }),


    update: function() {
      comp_update(this);
    },


    /**
     * Sets tethered building of this unit.
     * @memberof INTF_ENTITY_tetheredEntity
     * @instance
     * @param {Building} ob
     * @return {void}
     */
    ex_setBLink: function(ob) {
      if(ob == null || (ob.isValid() && ob.team === unit.team)) {
        this.bLink = ob;
      };
    }
    .setProp({
      noSuper: true,
      argLen: 1,
    }),


    /**
     * @memberof INTF_ENTITY_tetheredEntity
     * @instance
     * @param {Object} dataObj
     * @return {void}
     */
    ex_writeUnitData: function(dataObj) {
      dataObj.bLinkPos = this.bLink == null ? -1 : this.bLink.pos();
    }
    .setProp({
      noSuper: true,
      argLen: 1,
    }),


    /**
     * @memberof INTF_ENTITY_tetheredEntity
     * @instance
     * @param {Object} dataObj
     * @return {void}
     */
    ex_readUnitData: function(dataObj) {
      let posInt = Number(dataObj.bLinkPos);
      this.bLink = Vars.world.build(isNaN(posInt) ? -1 : posInt);
    }
    .setProp({
      noSuper: true,
      argLen: 1,
    }),


  });
