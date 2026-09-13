/*
  ========================================
  Section: Definition
  ========================================
*/


    /* <------------------------------ meta ------------------------------ */


    /**
     * @typedef {TemplateInstance<StatusEffect, STA_burstStatus>} STABurstStatus
     */


    const PARENT = require("lovec/temp/sta/STA_baseStatus");
    const INTF_STA_burstStatus = require("lovec/temp/intf/INTF_STA_burstStatus");


    /* <------------------------------ component ------------------------------ */


    /**
     * @private
     * @param {STABurstStatus} sta
     * @param {Unit} unit
     * @param {number} time
     * @param {boolean} isExtend
     * @return {void}
     */
    function comp_applied(sta, unit, time, isExtend) {
        if(sta.justApplied) return;

        sta.justApplied = true;
        unit.apply(sta, time + sta.timeF.get(unit, time));
        sta.justApplied = false;
    };


/*
  ========================================
  Section: Application
  ========================================
*/


    /**
     * A status effect that bursts if applied multiple times.
     * @class STA_burstStatus
     * @extends STA_baseStatus
     * @extends INTF_STA_burstStatus
     */
    module.exports = newClass()
    .extendClass(PARENT, "STA_burstStatus")
    .implement(INTF_STA_burstStatus)
    .initClass()
    .setParent(StatusEffect)
    .setTags()
    .setParam({


        /**
         * `PARAM`: Gets time added when this effect is applied each time.
         * <br> `ARGS`: unit, time.
         * @memberof STA_burstStatus
         * @instance
         * @type {Floatf2<Unit, number>}
         */
        timeF: floatf2(function(unit, time) {return 300.0}),


        /* <------------------------------ internal ------------------------------ */


        /**
         * `INTERNAL`
         * @memberof STA_burstStatus
         * @instance
         * @type {boolean}
         */
        justApplied: false,


    })
    .setMethod({


        applied: function(unit, time, isExtend) {
            comp_applied(this, unit, time, isExtend);
        },


    });
