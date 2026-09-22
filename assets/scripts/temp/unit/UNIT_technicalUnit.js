/*
  ========================================
  Section: Definition
  ========================================
*/


    /* <------------------------------ meta ------------------------------ */


    /**
     * @typedef {TemplateInstance<UnitType, UNIT_technicalUnit>} UNITTechnicalUnit
     */


    const PARENT = require("lovec/temp/unit/UNIT_baseUnit");


    /* <------------------------------ component ------------------------------ */


/*
  ========================================
  Section: Application
  ========================================
*/


    /**
     * Mostly internal units that you cannot control.
     * @class UNIT_technicalUnit
     * @extends UNIT_baseUnit
     */
    module.exports = newClass()
    .extendClass(PARENT, "UNIT_technicalUnit")
    .initTemplate()
    .setParent(null)
    .setTags()
    .setParam({


        /* <------------------------------ internal ------------------------------ */


        /**
         * `INTERNAL`
         * <br> `REALIZED`
         * @override
         * @memberof UNIT_technicalUnit
         * @instance
         * @type {string}
         */
        entityName: "base",
        /**
         * `INTERNAL`
         * <br> `REALIZED`
         * @override
         * @memberof UNIT_technicalUnit
         * @instance
         * @type {boolean}
         */
        useLovecDamagePenalty: false,
        /**
         * `INTERNAL`
         * <br> `REALIZED`
         * @override
         * @memberof UNIT_technicalUnit
         * @instance
         * @type {boolean}
         */
        useConicalLight: false,
        /**
         * `INTERNAL`
         * <br> `REALIZED`
         * @override
         * @memberof UNIT_technicalUnit
         * @instance
         * @type {boolean}
         */
        hasUnitData: false,


        /* <------------------------------ vanilla ------------------------------ */


        envEnabled: Env.any,
        envDisabled: Env.none,
        fogRadius: 0,
        createWreck: false,
        createScorch: false,
        deathShake: 0.0,
        fallEffect: Fx.none,
        fallEngineEffect: Fx.none,
        deathExplosionEffect: Fx.none,
        // Don't use `Sounds.unset` here
        deathSound: Sounds.none,
        hoverable: false,
        drawMiniMap: false,
        isEnemy: false,
        canAttack: false,
        hittable: false,
        targetable: false,
        allowedInPayloads: false,
        hidden: true,
        internal: true,
        useUnitCap: false,
        physics: false,
        bounded: false,
        playerControllable: false,
        logicControllable: false,
        speed: 0.0,
        rotateSpeed: 0.0,


    })
    .setMethod({});
