/*
  ================================================================================
  Section: Definition
  ================================================================================
*/


    /* <------------------------------ meta ------------------------------> */


    /**
     * @typedef {TemplateInstance<Weapon, WEAP_baseWeapon>} WEAPBaseWeapon
     */


    const PARENT = CLS_contentTemplate;


    /* <------------------------------ component ------------------------------> */


/*
  ================================================================================
  Section: Application
  ================================================================================
*/


    /**
     * Root of all weapons.
     * @class WEAP_baseWeapon
     * @extends CLS_contentTemplate
     */
    module.exports = newClass()
    .extendClass(PARENT, "WEAP_baseWeapon")
    .initTemplate()
    .setParent("Weapon")
    .setTags()
    .setParam({


        /**
         * `PARAM`: See {@link RS_baseResource#setupVanillaStat}.
         * @memberof WEAP_baseWeapon
         * @instance
         * @type {boolean}
         * @default true
         */
        setupVanillaStat: true,
        /**
         * `PARAM`: See {@link RS_baseResource#setupVanillaProp}.
         * @memberof WEAP_baseWeapon
         * @instance
         * @type {boolean}
         * @default true
         */
        setupVanillaProp: true,
        /**
         * `PARAM`: If true, this weapon is designed for player control.
         * @memberof WEAP_baseWeapon
         * @instance
         * @type {boolean}
         * @default false
         */
        forPlayer: false,
        /**
         * `PARAM`: If true, this weapon is designed for AI control.
         * @memberof WEAP_baseWeapon
         * @instance
         * @type {boolean}
         * @default false
         */
        forAi: false,


        /* <------------------------------ vanilla ------------------------------> */


        name: "",
        reload: 1.0,
        cooldownTime: -1.0,
        shootCone: 10.0,
        mirror: false,
        x: 0.0,
        y: 0.0,
        shootX: 0.0,
        shootY: 0.0,
        xRand: 0.0,
        yRand: 0.0,
        shoot: tprov(() => new ShootPattern()),
        bullet: Bullets.placeholder,
        parts: tprov(() => []),


    })
    .setParamParser([
        "forPlayer", function(val) {
            if(val) {
                this.autoTarget = false;
                this.controllable = true;
            };
            return val;
        },
        "forAi", function(val) {
            if(val) {
                this.autoTarget = true;
                this.controllable = false;
            };
            return val;
        },
        "cooldownTime", function(val) {
            // Heat region cooldown time is calculated from reload by default
            return val >= 0.0 ? val : Math.round(this.reload * 0.75);
        },
        "parts", function(val) {
            // Defined as array and finally converted to seq
            return tprov(() => val.get().toSeq());
        },
    ])
    .setMethod({


        toString: function() {
            return this.name == null || String.isEmpty(this.name) ?
                this.self.ex_getTempName() :
                (this.self.ex_getTempName() + ": " + this.name);
        }
        .setProp({
            noSuper: true,
        }),


    });
