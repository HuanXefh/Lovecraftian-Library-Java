/*
  ========================================
  Section: Definition
  ========================================
*/


    /* <------------------------------ meta ------------------------------ */


    /**
     * @typedef {TemplateInstance<Floor, ENV_baseFloor>} ENVBaseFloor
     */


    const PARENT = require("lovec/temp/env/ENV_baseEnvBlock");


    /* <------------------------------ component ------------------------------ */


/*
  ========================================
  Section: Application
  ========================================
*/


    /**
     * Featureless floor block.
     * @class ENV_baseFloor
     * @extends ENV_baseEnvBlock
     */
    module.exports = newClass()
    .extendClass(PARENT, "ENV_baseFloor")
    .initTemplate()
    .setParent(Floor)
    .setTags()
    .setParam({})
    .setParamAlias([
        /**
         * `ALIAS`: `cacheLayer`.
         * @memberof ENV_baseFloor
         * @instance
         * @name cacheLay
         * @type {CacheLayer}
         */
        "cacheLay", "cacheLayer", CacheLayer.normal,
    ])
    .setMethod({});
