/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * Root of all bullet types.
   * ---------------------------------------- */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = require("lovec/cls/util/CLS_contentTemplate");


  const FRAG_attack = require("lovec/frag/FRAG_attack");


  /* <---------- component ----------> */


  function comp_hitEntity(btp, bul, e, hp) {
    let wasDead = e instanceof Unit && e.dead;

    if(e instanceof Healthc) {
      let
        dmg = bul.damage * FRAG_attack._dmgMtp_typeMtpArr(e, btp.typeMtpArr),
        shield = e instanceof Shieldc ? Math.max(e.shield, 0.0) : 0.0;

      if(btp.maxDamageFraction > 0.0) {
        let cap = e.maxHealth * btp.maxDamageFraction + shield;
        dmg = Math.min(dmg, cap);
        hp = Math.min(hp, cap);
      } else {
        hp += shield;
      };
      if(btp.pierceArmor) {
        e.damagePierce(dmg);
      } else {
        e.damage(dmg);
      };
    };

    if(e instanceof Unit) {
      // Knockback
      if(!btp.knockback.fEqual(0.0)) {
        Tmp.v3.set(e).sub(bul).nor().scl(btp.knockback * 80.0);
        if(btp.impact) {
          Tmp.v3.setAngle(bul.rotation + (btp.knockback < 0.0 ? 180.0 : 0.0));
          e.impulse(Tmp.v3);
        };
      };

      // Status effect
      e.apply(btp.status, btp.statusDuration);

      Events.fire(Reflect.get(BulletType, "bulletDamageEvent").set(e, bul));
    };

    if(!wasDead && e instanceof Unit && e.dead) {
      Events.fire(new UnitBulletDestroyEvent(e, bul));
    };

    btp.handlePierce(bul, hp, e.x, e.y);
  };


/*
  ========================================
  Section: Application
  ========================================
*/


  module.exports = newClass().extendClass(PARENT).initClass()
  .setParent(null)
  .setTags()
  .setParam({
    // @PARAM: Used to define type affinity (damage multiplier on specific units) for the bullet.
    typeMtpArr: prov(() => []),

    // For convenience
    hitSize: 4.0,
    drawSize: -1.0,
    lifetime: 40.0,
    speed: 1.0,
    maxRange: -1.0,
    drag: 0.0,
    accel: 0.0,
    inaccuracy: 0.0,
    hittable: true,
    reflectable: true,
    absorbable: true,
    recoil: 0.0,
    lightColor: Pal.powerLight,
    hitShake: 0.0,
    trailColor: Pal.missileYellowBack,
    trailParam: 2.0,
    trailInterp: Interp.one,
    trailSinMag: 0.0,
    trailSinScl: 3.0,
    hitColor: Color.white,
    healColor: Pal.heal,
    knockback: 0.0,
    pierce: false,
    pierceBuilding: true,
    pierceCap: -1,
    pierceDamageFactor: 0.0,
    pierceFragCap: -1,
    pierceArmor: false,
    homingDelay: -1.0,
    suppressColor: Pal.sapBullet,
    fragOnHit: false,
    fragOnAbsorb: true,
    sticky: false,
    weaveMag: 0.0,
    circleShooter: false,
    parts: prov(() => []),
  })
  .setParamAlias([
    "z", "layer", Layer.bullet,
    "createP", "createChance", 1.0,
    "lifetimeRandMin", "lifeScaleRandMin", 1.0,
    "lifetimeRandMax", "lifeScaleRandMax", 1.0,
    "keepVel", "keepVelocity", true,
    "velRandMin", "velocityScaleRandMin", 1.0,
    "velRandMax", "velocityScaleRandMax", 1.0,
    "offAng", "angleOffset", 0.0,
    "offRandAng", "randomAngleOffset", 0.0,
    "rangeAdded", "rangeChange", 0.0,
    "minRangeAdded", "minRangeChange", 0.0,
    "dmg", "damage", 0.0,
    "maxDmgFrac", "maxDamageFraction", -1.0,
    "sDmg", "splashDamage", 0.0,
    "sDmgRad", "splashDamageRadius", -1.0,
    "sDmgOnly", "scaledSplashDamage", false,
    "sDmgAccuratePos", "scaleLife", true,
    "sDmgPierce", "splashDamagePierce", false,
    "ammoMtp", "ammoMultiplier", 1.0,
    "reloadMtp", "reloadMultiplier", 1.0,
    "bDmgMtp", "buildingDamageMultiplier", 1.0,
    "shieldDmgMtp", "shieldDamageMultiplier", 1.0,
    "pattern", "shootPattern", null,
    "lightRad", "lightRadius", -1.0,
    "lightOpac", "lightOpacity", 0.0,
    "desShake", "despawnShake", 0.0,
    "trailP", "trailChance", -0.0001,
    "trailIntv", "trailInterval", 0.0,
    "trailMinVel", "trailMinVelocity", 0.0,
    "trailRad", "trailSpread", 0.0,
    "trailLen", "trailLength", -1,
    "trailW", "trailWidth", 2.0,
    "bulRotForTrail", "trailRotation", false,
    "trailEff", "trailEffect", Fx.missileTrail,
    "shootEff", "shootEffect", Fx.none,
    "chargeEff", "chargeEffect", Fx.none,
    "hitEff", "hitEffect", Fx.none,
    "desEff", "despawnEffect", Fx.none,
    "smokeEff", "smokeEffect", Fx.none,
    "healEff", "healEffect", Fx.healBlockFull,
    "shootSe", "shootSound", Sounds.unset,
    "hitSe", "hitSound", Sounds.unset,
    "hitSeVol", "hitSoundVolume", 1.0,
    "hitSePitch", "hitSoundPitch", 1.0,
    "hitSeOffPitch", "hitSoundPitchRange", 0.1,
    "desSe", "despawnSound", Sounds.unset,
    "healSe", "healSound", Sounds.blockHeal,
    "healSeVol", "healSoundVolume", 0.9,
    "shouldAimBlock", "targetBlocks", true,
    "shouldAimMissile", "targetMissiles", true,
    "shouldAimAir", "collidesAir", true,
    "shouldAimGround", "collidesGround", true,
    "shouldAimUnderBlock", "hitUnder", false,
    "shouldCollide", "collides", true,
    "shouldCollideTile", "collidesTiles", true,
    "shouldCollideBank", "collideFloor", false,
    "shouldCollideTerrain", "collideTerrain", false,
    "shouldImpact", "impact", true,
    "healPerc", "healPercent", 0.0,
    "healAmt", "healAmount", 0.0,
    "lifestealFrac", "lifesteal", 0.0,
    "incendiary", "makeFire", false,
    "incendAmt", "incendAmount", 0,
    "incendRad", "incendSpread", 8.0,
    "incendP", "incendChance", 1.0,
    "puddleLiq", "puddleLiquid", Liquids.water,
    "puddleAmt", "puddles", 0,
    "puddleRad", "puddleRange", 0.0,
    "puddleLiqAmt", "puddleAmount", 5.0,
    "armorMtp", "armorMultiplier", 1.0,
    "homingPow", "homingPower", 0.0,
    "homingRad", "homingRange", 50.0,
    "homingFollowRotSpd", "followAimSpeed", 0.0,
    "suppressRad", "suppressionRange", -1.0,
    "suppressDur", "suppressionDuration", 480.0,
    "suppressPNum", "suppressionEffectChance", 50.0,
    "arcSegAmt", "lightning", 0,
    "arcLen", "lightningLength", 5,
    "arcOffLen", "lightningLengthRand", 0,
    "arcCone", "lightningCone", 360.0,
    "arcOffAng", "lightningAngle", 0.0,
    "arcDmg", "lightningDamage", -1.0,
    "arcColor", "lightningColor", Pal.surge,
    "arcBtp", "lightningType", null,
    "fragBtp", "fragBullet", null,
    "fragAmt", "fragBullets", 1,
    "fragRandAng", "fragRandomSpread", 360.0,
    "fragAng", "fragSpread", 0.0,
    "fragOffAng", "fragAngle", 0.0,
    "fragLifetimeRandMin", "fragLifeMin", 1.0,
    "fragLifetimeRandMax", "fragLifeMax", 1.0,
    "fragVelRandMin", "fragVelocityMin", 0.2,
    "fragVelRandMax", "fragVelocityMax", 1.0,
    "fragLenRandMin", "fragOffsetMin", 1.0,
    "fragLenRandMax", "fragOffsetMax", 7.0,
    "intvBtp", "intervalBullet", null,
    "intvAmt", "intervalBullets", 1,
    "intv", "bulletInterval", 20.0,
    "intvRandAng", "intervalRandomSpread", 360.0,
    "intvAng", "intervalSpread", 0.0,
    "intvOffAng", "intervalAngle", 0.0,
    "intvDelay", "intervalDelay", -1.0,
    "bulSta", "status", StatusEffects.none,
    "bulStaDur", "statusDuration", 480.0,
    "stickyLifetime", "stickyExtraLifetime", 0.0,
    "weaveScl", "weaveScale", 1.0,
    "weaveRotSpd", "rotateSpeed", 0.0,
    "useRandomWeave", "weaveRandom", true,
    "circleShooterRad", "circleShooterRadius", 13.0,
    "circleShooterSmoothRad", "circleShooterRadiusSmooth", -1.0,
    "circleShooterRotSpdFrac", "circleShooterRotateSpeed", 0.3,
    "btps", "spawnBullets", prov(() => []),
    "btpsRandAng", "spawnBulletRandomSpread", 0.0,
    "utp", "spawnUnit", null,
    "desUtp", "despawnUnit", null,
    "desUtpP", "despawnUnitChance", 1.0,
    "desUtpAmt", "despawnUnitCount", 1,
    "desUtpRad", "despawnUnitRadius", 0.1,
    "desUtpFaceOutwards", "faceOutwards", false,
  ])
  .setParamParser([
    "drawSize", function(val) {
      return val >= 0.0 ? val : (this.hitSize * 10.0);
    },
    "collidesTeam", function(val) {
      return this.healPercent > 0.0 || this.healAmount > 0.0;
    },
    "maxRange", function(val) {
      return val >= 0.0 ? val : (this.lifetime * this.speed);
    },
    "circleShooterRadiusSmooth", function(val) {
      return val >= 0.0 ? val : (this.circleShooterRadius * 0.7692);
    },
    "spawnBullets", function(val) {
      return prov(() => val.get().toSeq());
    },
    "parts", function(val) {
      return prov(() => val.get().toSeq());
    },
  ])
  .setMethod({


    hitEntity: function(bul, e, hp) {
      comp_hitEntity(this, bul, e, hp);
    }
    .setProp({
      noSuper: true,
    }),


  });
