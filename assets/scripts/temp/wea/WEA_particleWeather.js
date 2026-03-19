/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = require("lovec/temp/wea/WEA_decoWeather");


  /* <---------- component ----------> */


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
  module.exports = newClass().extendClass(PARENT, "WEA_particleWeather").initClass()
  .setParent(ParticleWeather)
  .setTags("wea-deco")
  .setParam({})
  .setMethod({});
