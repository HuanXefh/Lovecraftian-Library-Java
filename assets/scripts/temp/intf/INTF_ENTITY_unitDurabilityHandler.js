/*
  ========================================
  Section: Definition
  ========================================
*/


    /* <------------------------------ meta ------------------------------> */


    /**
     * @typedef {TemplateInstance<Unit, INTF_ENTITY_unitDurabilityHandler>} INTFENTITYUnitDurabilityHandler
     */


    /* <------------------------------ component ------------------------------> */


    /**
     * @private
     * @param {INTFENTITYUnitDurabilityHandler} unit
     * @return {void}
     */
    function comp_update(unit) {
        if(PARAM.UPDATE_SUPPRESSED || unit.type.delegee.unitDurabCap < 0.0) return;

        unit.unitDurabUsed += unit.ex_getDurabDec();
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


        __paramObjM__: function() {
            return {


                /* <------------------------------ internal ------------------------------> */


                /**
                 * `INTERNAL`
                 * @memberof INTF_ENTITY_unitDurabilityHandler
                 * @instance
                 * @type {number}
                 */
                unitDurabUsed: 0.0,


            };
        },


        update: function() {
            comp_update(this);
        },


        /**
         * Gets durability decrease rate (per frame).
         * @memberof INTF_ENTITY_unitDurabilityHandler
         * @instance
         * @func
         * @return {number}
         */
        ex_getDurabDec: function() {
            return Time.delta;
        }
        .setProp({
            noSuper: true,
        }),


        /**
         * @memberof INTF_ENTITY_unitDurabilityHandler
         * @instance
         * @func
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
         * @func
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
