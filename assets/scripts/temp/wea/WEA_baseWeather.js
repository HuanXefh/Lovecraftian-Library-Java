/*
  ========================================
  Section: Definition
  ========================================
*/


    /* <------------------------------ meta ------------------------------> */


    /**
     * @typedef {TemplateInstance<Weather, WEA_baseWeather>} WEABaseWeather
     */


    const PARENT = CLS_contentTemplate;


    /* <------------------------------ component ------------------------------> */


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
         * `PARAM`: See {@link RS_baseResource#setupVanillaStat}.
         * @memberof WEA_baseWeather
         * @instance
         * @type {boolean}
         */
        setupVanillaStat: true,
        /**
         * `PARAM`: See {@link RS_baseResource#setupVanillaProp}.
         * @memberof WEA_baseWeather
         * @instance
         * @type {boolean}
         */
        setupVanillaProp: true,


    })
    .setMethod({});


    /**
     * @override
     * @memberof WEA_baseWeather
     * @func
     * @param {WEABaseWeather} wea
     * @return {void}
     */
    module.exports.initContent = function(wea) {
        this.super("initContent", wea);

        let jval = LCContentParser.getJval(wea);
        if(jval != null) {
            LCContentParser.setupFields(wea, jval);
        };

    };
