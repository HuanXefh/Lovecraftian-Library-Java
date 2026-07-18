/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  /* <---------- component ----------> */


  function comp_update(unit) {
    if(PARAM.UPDATE_SUPPRESSED || unit.type.delegee.unitDurabCap < 0.0) return;

    unit.unitDurabUsed += Time.delta;
    if(unit.unitDurabUsed >= unit.type.unitDurabCap) {
      unit.type.ex_onDurabOutage(unit);
    } else {
      unit.type.ex_onDurabDec(unit);
    };
  };


/*
  ========================================
  Section: Application
  ========================================
*/


  /**
   * Handles unit durability mechanics.
   * @class INTF_ENTITY_unitDurabilityHandler
   */
  module.exports = new CLS_interface("INTF_ENTITY_unitDurabilityHandler", {


    __paramObjSetter__: () => ({


      /* <------------------------------ internal ------------------------------ */


      /**
       * `INTERNAL`
       * @memberof INTF_ENTITY_unitDurabilityHandler
       * @instance
       */
      unitDurabUsed: 0.0,


    }),


    update: function() {
      comp_update(this);
    },


    /**
     * @memberof INTF_ENTITY_unitDurabilityHandler
     * @instance
     * @param {Object} dataObj
     * @return {void}
     */
    ex_writeUnitData: function(dataObj) {
      dataObj.unitDurabUsed = this.unitDurabUsed;
    }
    .setProp({
      noSuper: true,
      argLen: 1,
    }),


    /**
     * @memberof INTF_ENTITY_unitDurabilityHandler
     * @instance
     * @param {Object} dataObj
     * @return {void}
     */
    ex_readUnitData: function(dataObj) {
      this.unitDurabUsed = Number(dataObj.unitDurabUsed);
    }
    .setProp({
      noSuper: true,
      argLen: 1,
    }),


  });
