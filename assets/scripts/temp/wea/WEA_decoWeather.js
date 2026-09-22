/*
  ========================================
  Section: Definition
  ========================================
*/


    /* <------------------------------ meta ------------------------------> */


    /**
     * @typedef {TemplateInstance<Weather, WEA_decoWeather>} WEADecoWeather
     */


    const PARENT = require("lovec/temp/wea/WEA_baseWeather");


    /* <------------------------------ component ------------------------------> */


/*
  ========================================
  Section: Application
  ========================================
*/


    /**
     * Weathers for visual effect only.
     * @class WEA_decoWeather
     * @extends WEA_baseWeather
     */
    module.exports = newClass()
    .extendClass(PARENT, "WEA_decoWeather")
    .initTemplate()
    .setParent(null)
    .setTags()
    .setParam({})
    .setMethod({});
