/*
  ========================================
  Section: Definition
  ========================================
*/


    /* <------------------------------ meta ------------------------------> */


    /**
     * @typedef {TemplateInstance<Seaweed, ENV_weed>} ENVWeed
     */


    const PARENT = require("lovec/temp/env/ENV_baseGrass");


    /* <------------------------------ component ------------------------------> */


/*
  ========================================
  Section: Application
  ========================================
*/


    /**
     * Unbreakable seaweed.
     * @class ENV_weed
     * @extends ENV_baseGrass
     */
    module.exports = newClass()
    .extendClass(PARENT, "ENV_weed")
    .initTemplate()
    .setParent(Seaweed)
    .setTags()
    .setParam({})
    .setMethod({});
