/*
  ========================================
  Section: Definition
  ========================================
*/


    /* <------------------------------ meta ------------------------------> */


    /**
     * @typedef {TemplateInstance<SeaBush, ENV_grass>} ENVGrass
     */


    const PARENT = require("lovec/temp/env/ENV_baseGrass");


    /* <------------------------------ component ------------------------------> */


/*
  ========================================
  Section: Application
  ========================================
*/


    /**
     * Unbreakable sea bush.
     * @class ENV_grass
     * @extends ENV_baseGrass
     */
    module.exports = newClass()
    .extendClass(PARENT, "ENV_grass")
    .initTemplate()
    .setParent(SeaBush)
    .setTags()
    .setParam({})
    .setMethod({});
