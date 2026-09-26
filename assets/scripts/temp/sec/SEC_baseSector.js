/*
  ========================================
  Section: Definition
  ========================================
*/


    /* <------------------------------ meta ------------------------------> */


    /**
     * @typedef {TemplateInstance<SectorPreset, SEC_baseSector>} SECBaseSector
     */


    const PARENT = CLS_contentTemplate;


    /* <------------------------------ component ------------------------------> */


/*
  ========================================
  Section: Application
  ========================================
*/


    /**
     * Root for all sector presets.
     * @class SEC_baseSector
     * @extends CLS_contentTemplate
     */
    module.exports = newClass()
    .extendClass(PARENT, "SEC_baseSector")
    .initTemplate()
    .setParent(SectorPreset)
    .setTags()
    .setParam({


        /**
         * `PARAM`: See {@link RS_baseResource#setupVanillaStat}.
         * @memberof SEC_baseSector
         * @instance
         * @type {boolean}
         */
        setupVanillaStat: true,
        /**
         * `PARAM`: See {@link RS_baseResource#setupVanillaProp}.
         * @memberof SEC_baseSector
         * @instance
         * @type {boolean}
         */
        setupVanillaProp: true,


    })
    .setMethod({});


    /**
     * @override
     * @memberof SEC_baseSector
     * @func
     * @param {SECBaseSector} sec
     * @return {void}
     */
    module.exports.initContent = function(sec) {
        this.super("initContent", sec);

        let jval = LCContentParser.getJval(sec);
        if(jval != null) {
            LCContentParser.parseSector(sec, jval);
            LCContentParser.setupFields(sec, jval);
        };
    };
