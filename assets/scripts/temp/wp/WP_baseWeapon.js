/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * Root of all weapons.
   * ---------------------------------------- */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = require("lovec/cls/util/CLS_contentTemplate");


  /* <---------- component ----------> */


/*
  ========================================
  Section: Application
  ========================================
*/


  module.exports = newClass().extendClass(PARENT).initClass()
  .setParent(null)
  .setTags()
  .setParam({
    // @PARAM: See {RS_baseResource}.
    overwriteVanillaStat: true,
    // @PARAM: See {RS_baseResource}.
    overwriteVanillaProp: true,

    // For convenience
    shootX: 0.0,
    shootY: 0.0,
    mirror: false,
    alternate: true,
    rotate: false,
    reload: 1.0,
    inaccuracy: 0.0,
    shootCone: 5.0,
    minWarmup: 0.0,
    shootWarmupSpeed: 0.1,
    smoothReloadSpeed: 0.15,
    linearWarmup: false,
    shake: 0.0,
    recoil: 0.0,
    recoilTime: -1.0,
    recoilPow: 1.8,
    heatColor: Pal.turretHeat,
    cooldownTime: -1.0,
    controllable: true,
    aiControllable: true,
    useAttackRange: true,
    shootOnDeath: false,
    parts: prov(() => []),
  })
  .setParamAlias([
    "nm", "name", null
    "btp", "bullet", Bullets.placeholder,
    "isTop", "top", false,
    "shaRad", "shadow", -1.0,
    "offX", "x", 0.0,
    "offY", "y", 0.0,
    "offZ", "layerOffset", 0.0,
    "randX", "xRand", 0.0,
    "randY", "yRand", 0.0,
    "velRand", "velocityRnd", 0.0,
    "velExtraFrac", "extraVelocity", 0.0,
    "shootVelReq", "minShootVelocity", -1.0,
    "baseRot", "baseRotation", 0.0,
    "rotCap", "rotationLimit", 361.0,
    "rotSpd", "rotateSpeed", 20.0,
    "pattern", "shoot", prov(() => new ShootPattern()),
    "shootSta", "shootStatus", StatusEffects.none,
    "shootStaDur", "shootStatusDuration", 300.0,
    "activeSe", "activeSound", Sounds.unset,
    "activeSeVol", "activeSoundVolume", 1.0,
    "shootSe", "shootSound", Sounds.shoot,
    "shootSeVol", "shootSoundVolume", 1.0,
    "shootSePitchMin", "soundPitchMin", 0.8,
    "shootSePitchMax", "shootSePitchMax", 1.0,
    "firstShootSe", "initialShootSound", Sounds.unset,
    "chargeSe", "chargeSound", Sounds.unset,
  ])
  .setParamParser([
    "cooldownTime", function(val) {
      return val >= 0.0 ? val : Math.round(this.reload * 0.75);
    },
    "parts", function(val) {
      return prov(() => val.get().toSeq());
    },
  ])
  .setMethod({});
