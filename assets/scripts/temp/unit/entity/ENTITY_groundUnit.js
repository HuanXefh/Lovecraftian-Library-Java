/*
  ========================================
  Section: Definition
  ========================================
*/


    /* <------------------------------ meta ------------------------------> */


    /**
     * @typedef {TemplateInstance<Unit, ENTITY_groundUnit>} ENTITYGroundUnit
     */


    const PARENT = require("lovec/temp/unit/entity/ENTITY_baseUnitEntity");


    /* <------------------------------ component ------------------------------> */


/*
  ========================================
  Section: Application
  ========================================
*/


    /**
     * Basic ground units.
     * @class ENTITY_groundUnit
     * @extends ENTITY_baseUnitEntity
     */
    module.exports = newClass()
    .extendClass(PARENT, "ENTITY_groundUnit")
    .initTemplate()
    .setParent(null)
    .setParam({})
    .setMethod({});
