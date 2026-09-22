/*
  ========================================
  Section: Definition
  ========================================
*/


    /* <------------------------------ meta ------------------------------> */


    /**
     * @typedef {TemplateInstance<ParticleWeather, WEA_particleWeather>} WEAParticleWeather
     */


    const PARENT = require("lovec/temp/wea/WEA_decoWeather");


    /* <------------------------------ component ------------------------------> */


/*
  ========================================
  Section: Application
  ========================================
*/


    /**
     * {@link ParticleWeather}.
     * @class WEA_particleWeather
     * @extends WEA_decoWeather
     */
    module.exports = newClass()
    .extendClass(PARENT, "WEA_particleWeather")
    .initTemplate()
    .setParent(ParticleWeather)
    .setTags()
    .setParam({})
    .setMethod({});
