/*
  ========================================
  Section: Definition
  ========================================
*/


    /* <------------------------------ meta ------------------------------> */


    /**
     * @typedef {TemplateInstance<Block, ENV_baseProp>} ENVBaseProp
     */


    const PARENT = require("lovec/temp/env/ENV_baseEnvBlock");


    /* <------------------------------ component ------------------------------> */


/*
  ========================================
  Section: Application
  ========================================
*/


    /**
     * Featureless prop block.
     * @class ENV_baseProp
     * @extends ENV_baseEnvBlock
     */
    module.exports = newClass()
    .extendClass(PARENT, "ENV_baseProp")
    .initTemplate()
    .setParent(null)
    .setTags()
    .setParam({})
    .setMethod({});
