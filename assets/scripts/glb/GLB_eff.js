/*
  ========================================
  Section: Introduction
  ========================================
*/


    /**
     * Static effects used widely.
     * This module is simply used to prevent duplication of effects, which renders .json files a mess.
     * @module lovec/glb/GLB_eff
     */


/*
  ========================================
  Section: Definition
  ========================================
*/


    /* <------------------------------ static ------------------------------ */


    /** @type {Effect} */
    exports.trailSniper = TP_effect.trailFade({
        spr: "lovec-efr-sniper-wave",
        size: 18.0,
        color: "ffffffa0",
        scl: 0.22222222,
    });


    /* <------------------------------ particle ------------------------------ */


    /** @type {Effect} */
    exports.particleHarvester = TP_effect.particleShrink({
        spr: "lovec-efr-square",
        size: 4.0,
        color: Pal.accent,
        scl: 0.7,
        hasBloom: true,
        noLight: true,
    });
    /** @type {Effect} */
    exports.particlePower = TP_effect.particleRelease({
        spr: "circle",
        amt: 3,
        size: 1.2,
        rad: 8.0,
        color: Pal.accent,
    });


    /* <------------------------------ crack ------------------------------ */


    /** @type {Effect} */
    exports.crackFurnace = TP_effect.crackFurnace();
    /** @type {Effect} */
    exports.crackFurnaceLarge = TP_effect.crackFurnace({
        size: 4.5,
        rad: 24.0,
        scl: 2.0,
    });
    /** @type {Effect} */
    exports.crackCraft = TP_effect.crackCraft();
    /** @type {Effect} */
    exports.crackDrill = TP_effect.crackDrill();
    /** @type {Effect} */
    exports.crackPlant = TP_effect.crackPlant();
    /** @type {Effect} */
    exports.crackSawmill = TP_effect.crackSmoke({color: "dccdb1"});


    /* <------------------------------ spark ------------------------------ */


    /** @type {Effect} */
    exports.sparkPower = TP_effect.sparkLine({
        amt: 5,
        color: Pal.accent,
    });


    /* <------------------------------ smog ------------------------------ */


    /** @type {Effect} */
    exports.smogFurnace = TP_effect.smogRelease({
        scl: 1.5,
    });
    /** @type {Effect} */
    exports.smogFurnaceLarge = TP_effect.smogRelease({
        amt: 18,
        size: 14.0,
        rad: 96.0,
        scl: 4.0,
    });
    /** @type {Effect} */
    exports.smogBlack = TP_effect.smogRelease({
        scl: 1.5,
        isBlack: true,
    });
    /** @type {Effect} */
    exports.smogFail = new MultiEffect(
        module.exports.smogBlack,
        module.exports.smogBlack,
        module.exports.smogBlack,
    );
    /** @type {Effect} */
    exports.smogUnitDamaged = TP_effect.smogRelease({
        amt: 1,
        rad: 12.0,
        scl: 0.6,
        isBlack: true,
        isHigh: true,
    });
    /** @type {Effect} */
    exports.smogHeat = TP_effect.smogHeat();
    /** @type {Effect} */
    exports.smogGun = TP_effect.smogShoot({
        amt: 8,
        size_f: 2.0,
        size_t: 6.0,
        rad: 16.0,
        cone: 30.0,
        scl: 0.6,
    });
    /** @type {Effect} */
    exports.smogLauncher = TP_effect.smogShoot({
        amt: 24,
        size_f: 2.0,
        size_t: 16.0,
        rad: 28.0,
        cone: 40.0,
        scl: 1.6,
    });
    /** @type {Effect} */
    exports.smogSniper = TP_effect.smogShoot({
        amt: 22,
        size_f: 2.0,
        size_t: 10.0,
        rad: 28.0,
        cone: 30.0,
        scl: 1.6,
    });
    /** @type {Effect} */
    exports.smogMassDriver = TP_effect.smogShoot({
        amt: 14,
        size_f: 4.0,
        size_t: 12.0,
        rad: 28.0,
        cone: 24.0,
        scl: 2.8,
    });
    /** @type {Effect} */
    exports.smogMassDriverLarge = TP_effect.smogShoot({
        amt: 26,
        size_f: 4.0,
        size_t: 20.0,
        rad: 48.0,
        cone: 24.0,
        scl: 3.2,
    });


    /* <------------------------------ wave ------------------------------ */


    /* <------------------------------ area ------------------------------ */


    /** @type {Array<Effect>} */
    exports.fadePlacePack = (function() {
        let arr = [];
        (10).each(size => {
            arr.push(size === 0 ? Fx.none : TP_effect.fadeSquare({
                r: size * 0.5,
                color: Pal.accent,
            }));
        });
        return arr;
    })();
    /** @type {Array<Effect>} */
    exports.fadeRemovePack = (function() {
        let arr = [];
        (10).each(size => {
            arr.push(size === 0 ? Fx.none : TP_effect.fadeSquare({
                r: size * 0.5,
                color: Pal.remove,
            }));
        });
        return arr;
    })();
    /** @type {Array<Effect>} */
    exports.fadeDisablePack = (function() {
        let arr = [];
        (10).each(size => {
            arr.push(size === 0 ? Fx.none : TP_effect.fadeSquare({
                r: size * 0.5,
                color: Pal.sap,
            }));
        });
        return arr;
    })();


    /* <------------------------------ complex ------------------------------ */


    /** @type {Effect} */
    exports.smogFireExplo = TP_effect.gasEmission({
        color: "303030",
        scl: 0.75,
    });


    /** @type {Effect} */
    exports.explosion = TP_effect.explosion({
        rad: 56.0,
    });
    /** @type {Effect} */
    exports.explosionSmall = TP_effect.explosion({
        rad: 24.0,
        noSmog: true,
    });


    /** @type {Array<Effect>} */
    exports.pulseDrillPack = (function() {
        let arr = [];
        (10).each(size => {
            arr.push(size === 0 ? Fx.none : TP_effect.pulseRect({
                r: size * 0.5,
                color: Pal.techBlue,
            }));
        });
        return arr;
    })();


    /** @type {Effect} */
    exports.pulseCircleDynamic = TP_effect.pulseCircle();
