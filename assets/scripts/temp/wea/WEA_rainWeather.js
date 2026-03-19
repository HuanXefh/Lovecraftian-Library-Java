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
   * {@link RainWeather}.
   * @class WEA_rainWeather
   * @extends WEA_decoWeather
   */
  module.exports = newClass().extendClass(PARENT, "WEA_rainWeather").initClass()
  .setParent(RainWeather)
  .setTags("wea-deco")
  .setParam({})
  .setMethod({});
