/*
  ========================================
  Section: Definition
  ========================================
*/


    /* <------------------------------ meta ------------------------------> */


    /**
     * @typedef {TemplateInstance<Weapon, WP_baseWeapon>} WPBaseWeapon
     */


    const PARENT = CLS_contentTemplate;


    /* <------------------------------ component ------------------------------> */


/*
  ========================================
  Section: Application
  ========================================
*/


    /**
     * Root of all weapons.
     * @class WP_baseWeapon
     * @extends CLS_contentTemplate
     */
    module.exports = newClass()
    .extendClass(PARENT, "WP_baseWeapon")
    .initTemplate()
    .setParent(Weapon)
    .setTags()
    .setParam({


        /**
         * `PARAM`: See {@link RS_baseResource}.
         * @memberof WP_baseWeapon
         * @instance
         * @type {boolean}
         */
        setupVanillaStat: true,
        /**
         * `PARAM`: See {@link RS_baseResource}.
         * @memberof WP_baseWeapon
         * @instance
         * @type {boolean}
         */
        setupVanillaProp: true,


        /* <------------------------------ vanilla ------------------------------> */


        cooldownTime: -1.0,
        parts: [],


    })
    .setParamParser([
        "cooldownTime", function(val) {
            // Heat region cooldown time is calculated from reload by default
            return val >= 0.0 ? val : Math.round(this.reload * 0.75);
        },
        "parts", function(val) {
            // Defined as array and finally converted to seq
            return tprov(() => val.get().toSeq());
        },
    ])
    .setMethod({});
