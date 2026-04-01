/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = require("lovec/temp/unit/UNIT_baseUnit");


  /* <---------- component ----------> */


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
  module.exports = newClass().extendClass(PARENT, "UNIT_technicalUnit").initClass()
  .setParent(null)
  .setTags()
  .setParam({


    /**
     * <PARAM>
     * @override
     * @memberof UNIT_technicalUnit
     * @instance
     */
    useLovecDamagePenalty: false,
    /**
     * <PARAM>
     * @override
     * @memberof UNIT_technicalUnit
     * @instance
     */
    useConicalLight: false,


    /* <------------------------------ internal ------------------------------ */


    /**
     * <INTERNAL>
     * @override
     * @memberof UNIT_technicalUnit
     * @instance
     */
    entityName: "base",
    /**
     * <INTERNAL>
     * @override
     * @memberof UNIT_technicalUnit
     * @instance
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
