/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = require("lovec/temp/wea/WEA_baseWeather");


  /* <---------- component ----------> */


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
  module.exports = newClass().extendClass(PARENT, "WEA_decoWeather").initClass()
  .setParent(null)
  .setTags("wea-deco")
  .setParam({})
  .setMethod({});
