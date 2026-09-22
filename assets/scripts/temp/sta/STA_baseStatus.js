/*
  ========================================
  Section: Definition
  ========================================
*/


    /* <------------------------------ meta ------------------------------ */


    /**
     * @typedef {TemplateInstance<StatusEffect, STA_baseStatus>} STABaseStatus
     */


    const PARENT = CLS_contentTemplate;


    /* <------------------------------ component ------------------------------ */


    /**
     * @private
     * @param {STABaseStatus} sta
     * @return {void}
     */
    function comp_init(sta) {
        if(!sta.exInitCalled) {
            sta.ex_init();
            sta.exInitCalled = true;
        };
    };


    /**
     * @private
     * @param {STABaseStatus} sta
     * @return {void}
     */
    function comp_ex_init(sta) {
        let osta;

        DB_status.db["map"]["affinity"].read(sta.name, Array.air).forEachRow(2, (nameSta, scr) => {
            osta = MDL_content.getCt(nameSta, ContentGetModes.STA);
            if(osta != null) sta.affinity(osta, scr);
        }, true);

        let oppoTmp = DB_status.db["map"]["opposite"].read(sta.name, Array.air);
        let oppoArr = typeof oppoTmp === "function" ? oppoTmp() : oppoTmp;
        oppoArr.forEachFast(sta_gn => {
            osta = MDL_content.getCt(sta_gn, ContentGetModes.STA);
            if(osta != null) sta.opposite(osta);
        }, true);
    };


/*
  ========================================
  Section: Application
  ========================================
*/


    /**
     * Most basic status effects with no features.
     * Affinities and opposites are defined in {@link DB_status}, do not call `sta.init` anymore!
     * @class STA_baseStatus
     * @extends CLS_contentTemplate
     */
    module.exports = newClass()
    .extendClass(PARENT, "STA_baseStatus")
    .initTemplate()
    .setParent(StatusEffect)
    .setTags()
    .setParam({


        /**
         * `PARAM`: See {@link RS_baseResource#setupVanillaStat}.
         * @memberof STA_baseStatus
         * @instance
         * @type {boolean}
         */
        setupVanillaStat: true,
        /**
         * `PARAM`: See {@link RS_baseResource#setupVanillaProp}.
         * @memberof STA_baseStatus
         * @instance
         * @type {boolean}
         */
        setupVanillaProp: true,


        /* <------------------------------ internal ------------------------------ */


        /**
         * `INTERNAL`: Used internally to avoid double initialization.
         * @memberof STA_baseStatus
         * @instance
         * @type {boolean}
         */
        exInitCalled: false,


        /* <------------------------------ vanilla ------------------------------ */


        outline: false,


    })
    .setParamAlias([
        /**
         * `ALIAS`: `effect`.
         * @memberof STA_baseStatus
         * @instance
         * @name eff
         * @type {Effect}
         */
        "eff", "effect", Fx.none,
        /**
         * `ALIAS`: `effectChance`.
         * @memberof STA_baseStatus
         * @instance
         * @name effP
         * @type {number}
         */
        "effP", "effectChance", 0.02,
    ])
    .setMethod({


        init: function() {
            comp_init(this);
        },


        /**
         * `init` of status effects can be called twice! Use this method to avoid it.
         * @memberof STA_baseStatus
         * @instance
         * @func
         * @return {void}
         */
        ex_init: function() {
            comp_ex_init(this);
        }
        .setProp({
            noSuper: true,
        }),


    });
