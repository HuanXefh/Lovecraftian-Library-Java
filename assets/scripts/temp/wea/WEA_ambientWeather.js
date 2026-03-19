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
   * Weathers for ambient sound loop only.
   * @class WEA_ambientWeather
   * @extends WEA_baseWeather
   */
  module.exports = newClass().extendClass(PARENT, "WEA_ambientWeather").initClass()
  .setParent(Weather)
  .setTags("wea-amb")
  .setParam({})
  .setMethod({});
