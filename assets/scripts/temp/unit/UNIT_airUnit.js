/*
  ========================================
  Section: Definition
  ========================================
*/


    /* <------------------------------ meta ------------------------------ */


    /**
     * @typedef {TemplateInstance<UnitType, UNIT_airUnit>} UNITAirUnit
     */


    const PARENT = require("lovec/temp/unit/UNIT_baseUnit");


    /* <------------------------------ component ------------------------------ */


/*
  ========================================
  Section: Application
  ========================================
*/


    /**
     * Parent of all air units.
     * @class UNIT_airUnit
     * @extends UNIT_baseUnit
     */
    module.exports = newClass()
    .extendClass(PARENT, "UNIT_airUnit")
    .initTemplate()
    .setParent(UnitType)
    .setTags("dmg0type-air")
    .setParam({


        /* <------------------------------ internal ------------------------------ */


        /**
         * `INTERNAL`
         * <br> `REALIZED`
         * @override
         * @memberof UNIT_airUnit
         * @instance
         * @type {string}
         */
        entityName: "lovec-air",


    })
    .setMethod({});
