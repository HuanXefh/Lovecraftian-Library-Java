/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = CLS_contentTemplate;


  /* <---------- component ----------> */


/*
  ========================================
  Section: Application
  ========================================
*/


  /**
   * Root for all weathers.
   * @class WEA_baseWeather
   * @extends CLS_contentTemplate
   */
  module.exports = newClass().extendClass(PARENT, "WEA_baseWeather").initClass()
  .setParent(null)
  .setTags()
  .setParam({


    /**
     * <PARAM>: See {@link RS_baseResource}.
     * @memberof WEA_baseWeather
     * @instance
     */
    overwriteVanillaStat: true,
    /**
     * <PARAM>: See {@link RS_baseResource}.
     * @memberof WEA_baseWeather
     * @instance
     */
    overwriteVanillaProp: true,

    
  })
  .setMethod({});
