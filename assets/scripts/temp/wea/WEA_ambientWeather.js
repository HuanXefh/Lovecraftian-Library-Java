/*
  ========================================
  Section: Definition
  ========================================
*/


    /* <------------------------------ meta ------------------------------> */


    /**
     * @typedef {TemplateInstance<Weather, WEA_ambientWeather>} WEAAmbientWeather
     */


    const PARENT = require("lovec/temp/wea/WEA_baseWeather");


    /* <------------------------------ component ------------------------------> */


/*
  ========================================
  Section: Application
  ========================================
*/


    /**
     * Weathers for ambient sound loop only.
     * @class WEA_ambientWeather
     * @extends WEA_baseWeather
     */
    module.exports = newClass()
    .extendClass(PARENT, "WEA_ambientWeather")
    .initTemplate()
    .setParent(Weather)
    .setTags()
    .setParam({


        /* <------------------------------ vanilla ------------------------------> */


        sound: Sounds.none,
        soundVol: 0.1,
        soundVolMin: 0.0,
        soundVolOscMag: 0.0,
        soundVolOscScl: 20.0,


    })
    .setMethod({});
