/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * Static effects used widely.
   * This module is simply used to prevent duplication of effects, which renders Json files a mess.
   * ---------------------------------------- */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const TP_effect = require("lovec/tp/TP_effect");


  /* <---------- static ----------> */


  exports.sniperTrail = TP_effect._trailFade({
    spr: "lovec-efr-sniper-wave",
    size: 18.0,
    color: "ffffffa0",
    scl: 0.22222222,
  });


  /* <---------- particle ----------> */


  exports.harvesterParticle = TP_effect._shrinkParticle({
    spr: "lovec-efr-square",
    size: 4.0,
    color: Pal.accent,
    scl: 0.7,
    hasBloom: true,
    noLight: true,
  });
  exports.powerParticle = TP_effect._releaseParticle({
    spr: "circle",
    amt: 3,
    size: 1.2,
    rad: 8.0,
    color: Pal.accent,
  });


  /* <---------- crack ----------> */


  exports.furnaceCrack = TP_effect._furnaceCrack();
  exports.furnaceCrackLarge = TP_effect._furnaceCrack({
    size: 4.5,
    rad: 24.0,
    scl: 2.0,
  });
  exports.craftCrack = TP_effect._craftCrack();
  exports.drillCrack = TP_effect._drillCrack();
  exports.plantCrack = TP_effect._plantCrack();
  exports.sawmillCrack = TP_effect._smokeCrack({color: "dccdb1"});


  /* <---------- spark ----------> */


  exports.powerSpark = TP_effect._lineSpark({
    amt: 5,
    color: Pal.accent,
  });


  /* <---------- smog ----------> */


  exports.furnaceSmog = TP_effect._releaseSmog();
  exports.furnaceSmogLarge = TP_effect._releaseSmog({
    amt: 18,
    size: 14.0,
    rad: 64.0,
    scl: 4.0,
  });
  exports.blackSmog = TP_effect._releaseSmog({
    scl: 1.5,
    isBlack: true,
  });
  exports.unitDamagedSmog = TP_effect._releaseSmog({
    amt: 1,
    rad: 12.0,
    scl: 0.6,
    isBlack: true,
    isHigh: true,
  });
  exports.heatSmog = TP_effect._heatSmog();
  exports.gunSmog = TP_effect._shootSmog({
    amt: 8,
    size_f: 2.0,
    size_t: 6.0,
    rad: 16.0,
    cone: 30.0,
    scl: 0.6,
  });
  exports.launcherSmog = TP_effect._shootSmog({
    amt: 24,
    size_f: 2.0,
    size_t: 16.0,
    rad: 28.0,
    cone: 40.0,
    scl: 1.6,
  });
  exports.sniperSmog = TP_effect._shootSmog({
    amt: 22,
    size_f: 2.0,
    size_t: 10.0,
    rad: 28.0,
    cone: 30.0,
    scl: 1.6,
  });
  exports.massDriverSmog = TP_effect._shootSmog({
    amt: 14,
    size_f: 4.0,
    size_t: 12.0,
    rad: 28.0,
    cone: 24.0,
    scl: 2.8,
  });
  exports.massDriverSmogLarge = TP_effect._shootSmog({
    amt: 26,
    size_f: 4.0,
    size_t: 20.0,
    rad: 48.0,
    cone: 24.0,
    scl: 3.2,
  });


  /* <---------- wave ----------> */


  /* <---------- area ----------> */


  exports.squareFadePack = (function() {
    let arr = [];
    (10)._it(1, size => {
      arr.push(size === 0 ? Fx.none : TP_effect._squareFade({
        r: size * 0.5,
        color: Pal.accent,
      }));
    });
    return arr;
  })();


  exports.disableFadePack = (function() {
    let arr = [];
    (10)._it(1, size => {
      arr.push(size === 0 ? Fx.none : TP_effect._squareFade({
        r: size * 0.5,
        color: Pal.sap,
      }));
    });
    return arr;
  })();


  /* <---------- complex ----------> */


  exports.fireExplodeSmog = TP_effect._gasEmission({
    color: "303030",
    scl: 0.75,
  });


  exports.explosion = TP_effect._explosion({
    rad: 56.0,
  });
  exports.explosionSmall = TP_effect._explosion({
    rad: 24.0,
    noSmog: true,
  });


  exports.drillPulsePack = (function() {
    let arr = [];
    (10)._it(1, size => {
      arr.push(size === 0 ? Fx.none : TP_effect._rectPulse({
        r: size * 0.5,
        color: Pal.techBlue,
      }));
    });
    return arr;
  })();


  exports.circlePulseDynamic = TP_effect._circlePulse();
