/*
  ========================================
  Section: Definition
  ========================================
*/


    /* <------------------------------ meta ------------------------------> */


    /**
     * @typedef {TemplateInstance<RainWeather, WEA_rainWeather>} WEARainWeather
     */


    const PARENT = require("lovec/temp/wea/WEA_decoWeather");


    /* <------------------------------ component ------------------------------> */


/*
  ========================================
  Section: Application
  ========================================
*/


    /**
     * {@link RainWeather}.
     * @class WEA_rainWeather
     * @extends WEA_decoWeather
     */
    module.exports = newClass()
    .extendClass(PARENT, "WEA_rainWeather")
    .initTemplate()
    .setParent(RainWeather)
    .setTags()
    .setParam({})
    .setMethod({});
