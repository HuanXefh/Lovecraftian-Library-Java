/*
  ========================================
  Section: Definition
  ========================================
*/


    /* <------------------------------ meta ------------------------------ */


    /**
     * @typedef {TemplateInstance<OverlayFloor, ENV_baseOverlay>} ENVBaseOverlay
     */


    const PARENT = require("lovec/temp/env/ENV_baseEnvBlock");


    /* <------------------------------ component ------------------------------ */


/*
  ========================================
  Section: Application
  ========================================
*/


    /**
     * Featureless overlay floor.
     * @class ENV_baseOverlay
     * @extends ENV_baseEnvBlock
     */
    module.exports = newClass()
    .extendClass(PARENT, "ENV_baseOverlay")
    .initTemplate()
    .setParent(OverlayFloor)
    .setTags()
    .setParam({})
    .setMethod({});
