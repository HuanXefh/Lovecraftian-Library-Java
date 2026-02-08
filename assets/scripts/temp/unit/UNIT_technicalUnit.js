/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * Mostly internal units that you cannot control.
   * ---------------------------------------- */


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


  module.exports = newClass().extendClass(PARENT).initClass()
  .setParent(UnitType)
  .setTags()
  .setParam({
    useLovecDamagePenalty: false,
    useConicalLight: false,
    entityName: "base",

    // For convenience
    envEnabled: Env.any,
    envDisabled: Env.none,
    fogRadius: 0,
    createWreck: false,
    createScorch: false,
    deathShake: 0.0,
    fallEffect: Fx.none,
    fallEngineEffect: Fx.none,
    deathExplosionEffect: Fx.none,
    deathSound: Sounds.none,                // Don't use {Sounds.unset} here
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
