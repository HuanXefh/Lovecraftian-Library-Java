/*
  ========================================
  Section: Definition
  ========================================
*/


    /* <------------------------------ meta ------------------------------ */


    /**
     * @typedef {TemplateInstance<Weather, WEA_baseWeather>} WEABaseWeather
     */


    const PARENT = CLS_contentTemplate;


    /* <------------------------------ component ------------------------------ */


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
    module.exports = newClass()
    .extendClass(PARENT, "WEA_baseWeather")
    .initTemplate()
    .setParent(null)
    .setTags()
    .setParam({


        /**
         * `PARAM`: See {@link RS_baseResource}.
         * @memberof WEA_baseWeather
         * @instance
         * @type {boolean}
         */
        setupVanillaStat: true,
        /**
         * `PARAM`: See {@link RS_baseResource}.
         * @memberof WEA_baseWeather
         * @instance
         * @type {boolean}
         */
        setupVanillaProp: true,


    })
    .setMethod({});
