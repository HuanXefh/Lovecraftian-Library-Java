/*
  ========================================
  Section: Definition
  ========================================
*/


    /* <------------------------------ meta ------------------------------> */


    /**
     * @typedef {TemplateInstance<UnitType, UNIT_mech>} UNITMech
     */


    const PARENT = require("lovec/temp/unit/UNIT_groundUnit");


    /* <------------------------------ component ------------------------------> */


    /**
     * @private
     * @param {UNITMech} utp
     * @param {ENTITYMech} unit
     * @return {void}
     */
    function comp_update(utp, unit) {
        if(!PARAM.IS_SPACE_MAP && TIMER.jetTrail && utp.jetTrailVelThr > 0.0 && unit.isFlying() && unit.vel.len() > utp.jetTrailVelThr) {
            MDL_effect.trailJet(unit.x, unit.y, unit);
        };
    };


/*
  ========================================
  Section: Application
  ========================================
*/


    /**
     * Mech unit.
     * @class UNIT_mech
     * @extends UNIT_groundUnit
     */
    module.exports = newClass()
    .extendClass(PARENT, "UNIT_mech")
    .initTemplate()
    .setParent(UnitType)
    .setTags("dmg0type-inf")
    .setParam({


        /**
         * `PARAM`: Velocity threshold for jet trail. Use 0.0 to disable jet trail effect.
         * @memberof UNIT_mech
         * @instance
         * @type {number}
         */
        jetTrailVelThr: 0.0,


        /* <------------------------------ internal ------------------------------> */


        /**
         * `INTERNAL`
         * <br> `REALIZED`
         * @override
         * @memberof UNIT_mech
         * @instance
         * @type {string}
         */
        entityName: "lovec-mech",


    })
    .setMethod({


        update: function(unit) {
            comp_update(this, unit);
        },


    });
