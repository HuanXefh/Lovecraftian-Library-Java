/*
  ========================================
  Section: Introduction
  ========================================
*/


  /**
   * Collection of effect getter functions.
   * @module lovec/tp/TP_effect
   */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <------------------------------ static ------------------------------ */


  /**
   * @param {Object|unset} [paramObj]
   * @return {ParticleEffect}
   */
  const flare = function(paramObj) {
    let
      size = readParam(paramObj, "size", 40.0),
      ang = readParam(paramObj, "ang", 0.0),
      color = MDL_color.getColor(readParam(paramObj, "color", Pal.accent), "new"),
      scl = readParam(paramObj, "scl", 1.0),
      noLight = readParam(paramObj, "noLight", false);

    return extend(ParticleEffect, {

      /* meta */

      interp: Interp.pow5Out,
      lifetime: 60.0 * scl,
      startDelay: 0.0,

      /* visual */

      region: "lovec-efr-flare",
      layer: VAR.layer.effBloom,
      particles: 1,
      followParent: true,
      rotWithParent: false,
      useRotation: true,
      colorFrom: Color.white,
      colorTo: color,
      lightScl: 2.0,
      lightOpacity: noLight ? 0.0 : 0.65,

      /* angle & length */

      baseRotation: ang,
      offset: 0.0,
      cone: 180.0,
      spin: 0.0,
      randLength: true,
      length: 0.0,
      baseLength: 0.0,

      /* size & stroke & len */

      line: false,
      sizeInterp: Interp.linear,
      sizeFrom: size,
      sizeTo: 0.0,
      strokeFrom: 0.0,
      strokeTo: 0.0,
      lenFrom: 0.0,
      lenTo: 0.0,

    });
  };
  exports.flare = flare;


  /**
   * @param {Object|unset} [paramObj]
   * @return {ParticleEffect}
   */
  const trailFade = function(paramObj) {
    let
      spr = readParam(paramObj, "spr", "circle"),
      size = readParam(paramObj, "size", 8.0),
      color = MDL_color.getColor(readParam(paramObj, "color", Color.white), "new"),
      scl = readParam(paramObj, "scl", 1.0),
      noLight = readParam(paramObj, "noLight", true);

    let color_t = color.cpy();
    color_t.a = 0.0;

    return extend(ParticleEffect, {

      /* meta */

      interp: Interp.pow3Out,
      lifetime: 90.0 * scl,
      startDelay: 0.0,

      /* visual */

      region: spr,
      layer: VAR.layer.effBase,
      particles: 1,
      followParent: false,
      rotWithParent: true,
      useRotation: true,
      colorFrom: color,
      colorTo: color_t,
      lightScl: 2.0,
      lightOpacity: noLight ? 0.0 : 0.65,

      /* angle & length */

      baseRotation: 0.0,
      offset: 0.0,
      cone: 180.0,
      spin: 0.0,
      randLength: true,
      length: 0.0,
      baseLength: 0.0,

      /* size & stroke & len */

      line: false,
      sizeInterp: Interp.pow3Out,
      sizeFrom: 0.0,
      sizeTo: size,
      strokeFrom: 0.0,
      strokeTo: 0.0,
      lenFrom: 0.0,
      lenTo: 0.0,

    });
  };
  exports.trailFade = trailFade;


  /* <------------------------------ particle ------------------------------ */


  /**
   * @param {Object|unset} [paramObj]
   * @return {ParticleEffect}
   */
  const particleRelease = function(paramObj) {
    let
      spr = readParam(paramObj, "spr", "circle"),
      amt = readParam(paramObj, "amt", 5),
      size = readParam(paramObj, "size", 4.0),
      rad = readParam(paramObj, "rad", 12.0),
      color = MDL_color.getColor(readParam(paramObj, "color", Color.white), "new"),
      scl = readParam(paramObj, "scl", 1.0),
      rev = readParam(paramObj, "rev", false),
      hasBloom = readParam(paramObj, "hasBloom", false),
      noLight = readParam(paramObj, "noLight", true);

    return extend(ParticleEffect, {

      /* meta */

      interp: rev ? Interp.reverse : Interp.linear,
      lifetime: 60.0 * scl,
      startDelay: 0.0,

      /* visual */

      region: spr,
      layer: hasBloom ? VAR.layer.effBloom : VAR.layer.effBase,
      particles: amt,
      followParent: true,
      rotWithParent: false,
      useRotation: true,
      colorFrom: color,
      colorTo: color,
      lightScl: 2.0,
      lightOpacity: noLight ? 0.0 : 0.65,

      /* angle & length */

      baseRotation: 0.0,
      offset: 0.0,
      cone: 180.0,
      spin: 0.0,
      randLength: true,
      length: rad,
      baseLength: 0.0,

      /* size & stroke & len */

      line: false,
      sizeInterp: Interp.linear,
      sizeFrom: size,
      sizeTo: 0.0,
      strokeFrom: 0.0,
      strokeTo: 0.0,
      lenFrom: 0.0,
      lenTo: 0.0,

    });
  };
  exports.particleRelease = particleRelease;


  /**
   * @param {Object|unset} [paramObj]
   * @return {ParticleEffect}
   */
  const particleShrink = function(paramObj) {
    let
      spr = readParam(paramObj, "spr", "circle"),
      size = readParam(paramObj, "size", 4.0),
      spin = readParam(paramObj, "spin", 0.0),
      color = MDL_color.getColor(readParam(paramObj, "color", Color.white), "new"),
      scl = readParam(paramObj, "scl", 1.0),
      shouldFade = readParam(paramObj, "shouldFade", false),
      hasBloom = readParam(paramObj, "hasBloom", false),
      noLight = readParam(paramObj, "noLight", true);

    let color_t = color.cpy();
    if(shouldFade) color_t.a = 0.0;

    return extend(ParticleEffect, {

      /* meta */

      interp: Interp.linear,
      lifetime: 150.0 * scl,
      startDelay: 0.0,

      /* visual */

      region: spr,
      layer: hasBloom ? VAR.layer.effBloom : VAR.layer.effBase,
      particles: 1,
      followParent: true,
      rotWithParent: false,
      useRotation: true,
      colorFrom: color,
      colorTo: color_t,
      lightScl: 2.0,
      lightOpacity: noLight ? 0.0 : 0.65,

      /* angle & length */

      baseRotation: 0.0,
      offset: 0.0,
      cone: 180.0,
      spin: spin,
      randLength: true,
      length: 0.0,
      baseLength: 0.0,

      /* size & stroke & len */

      line: false,
      sizeInterp: Interp.pow2In,
      sizeFrom: size,
      sizeTo: 0.0,
      strokeFrom: 0.0,
      strokeTo: 0.0,
      lenFrom: 0.0,
      lenTo: 0.0,

    });
  };
  exports.particleShrink = particleShrink;


  /**
   * @param {Object|unset} [paramObj]
   * @return {Effect}
   */
  const particleWet = function(paramObj) {
    let
      color = MDL_color.getColor(readParam(paramObj, "color", Color.white), "new");

    return new Effect(80.0, eff => {
      Draw.color(color);
      Draw.alpha(Mathf.clamp(eff.fin() * 2.0));
      Fill.circle(eff.x, eff.y, eff.fout());
      Draw.reset();
    });
  };
  exports.particleWet = particleWet;


  /* <------------------------------ crack ------------------------------ */


  /**
   * @param {Object|unset} [paramObj]
   * @return {ParticleEffect}
   */
  const crackFurnace = function(paramObj) {
    let
      spr = readParam(paramObj, "spr", "lovec-efr-diamond"),
      size = readParam(paramObj, "size", 3.0),
      rad = readParam(paramObj, "rad", 18.0),
      color = MDL_color.getColor(readParam(paramObj, "color", "ffc999"), "new"),
      scl = readParam(paramObj, "scl", 1.0),
      noLight = readParam(paramObj, "noLight", false);

    return extend(ParticleEffect, {

      /* meta */

      interp: Interp.pow2Out,
      lifetime: 60.0 * scl,
      startDelay: 0.0,

      /* visual */

      region: spr,
      layer: VAR.layer.effBase,
      particles: 2,
      followParent: true,
      rotWithParent: false,
      useRotation: true,
      colorFrom: color,
      colorTo: color,
      lightScl: 2.0,
      lightOpacity: noLight ? 0.0 : 0.65,

      /* angle & length */

      baseRotation: 0.0,
      offset: 0.0,
      cone: 180.0,
      spin: 0.0,
      randLength: true,
      length: rad,
      baseLength: 0.0,

      /* size & stroke & len */

      line: false,
      sizeInterp: Interp.sine,
      sizeFrom: size,
      sizeTo: 0.0,
      strokeFrom: 0.0,
      strokeTo: 0.0,
      lenFrom: 0.0,
      lenTo: 0.0,

    });
  };
  exports.crackFurnace = crackFurnace;


  /**
   * @param {Object|unset} [paramObj]
   * @return {ParticleEffect}
   */
  const crackDrill = function(paramObj) {
    let
      spr = readParam(paramObj, "spr", "lovec-efr-diamond"),
      amt = readParam(paramObj, "amt", 3),
      size = readParam(paramObj, "size", 4.0),
      rad = readParam(paramObj, "rad", 18.0),
      color = MDL_color.getColor(readParam(paramObj, "color", Color.white), "new"),
      scl = readParam(paramObj, "scl", 1.0),
      noLight = readParam(paramObj, "noLight", true);

    color.a = 0.5;

    return extend(ParticleEffect, {

      /* meta */

      interp: Interp.pow10Out,
      lifetime: 180.0 * scl,
      startDelay: 0.0,

      /* visual */

      region: spr,
      layer: VAR.layer.effBase,
      particles: amt,
      followParent: true,
      rotWithParent: false,
      useRotation: true,
      colorFrom: color,
      colorTo: color,
      lightScl: 2.0,
      lightOpacity: noLight ? 0.0 : 0.65,

      /* angle & length */

      baseRotation: 0.0,
      offset: 0.0,
      cone: 180.0,
      spin: 0.0,
      randLength: true,
      length: rad,
      baseLength: 0.0,

      /* size & stroke & len */

      line: false,
      sizeInterp: Interp.sine,
      sizeFrom: size,
      sizeTo: 0.0,
      strokeFrom: 0.0,
      strokeTo: 0.0,
      lenFrom: 0.0,
      lenTo: 0.0,

    });
  };
  exports.crackDrill = crackDrill;


  /**
   * @param {Object|unset} [paramObj]
   * @return {ParticleEffect}
   */
  const crackCraft = function(paramObj) {
    let
      spr = readParam(paramObj, "spr", "lovec-efr-diamond"),
      amt = readParam(paramObj, "amt", 2),
      size = readParam(paramObj, "size", 4.0),
      rad = readParam(paramObj, "rad", 10.0),
      color = MDL_color.getColor(readParam(paramObj, "color", Color.white), "new"),
      scl = readParam(paramObj, "scl", 1.0),
      noLight = readParam(paramObj, "noLight", true);

    return extend(ParticleEffect, {

      /* meta */

      interp: Interp.pow5Out,
      lifetime: 90.0 * scl,
      startDelay: 0.0,

      /* visual */

      region: spr,
      layer: VAR.layer.effBase,
      particles: amt,
      followParent: true,
      rotWithParent: false,
      useRotation: true,
      colorFrom: color,
      colorTo: color,
      lightScl: 2.0,
      lightOpacity: noLight ? 0.0 : 0.65,

      /* angle & length */

      baseRotation: 0.0,
      offset: 0.0,
      cone: 180.0,
      spin: 0.0,
      randLength: true,
      length: rad,
      baseLength: 0.0,

      /* size & stroke & len */

      line: false,
      sizeInterp: Interp.pow10In,
      sizeFrom: size,
      sizeTo: 0.0,
      strokeFrom: 0.0,
      strokeTo: 0.0,
      lenFrom: 0.0,
      lenTo: 0.0,

    });
  };
  exports.crackCraft = crackCraft;


  /**
   * @param {Object|unset} [paramObj]
   * @return {ParticleEffect}
   */
  const crackPlant = function(paramObj) {
    let
      spr = readParam(paramObj, "spr", "lovec-efr-diamond"),
      amt = readParam(paramObj, "amt", 12),
      size = readParam(paramObj, "size", 1.5),
      rad = readParam(paramObj, "rad", 12.0),
      color = MDL_color.getColor(readParam(paramObj, "color", "91b692"), "new"),
      scl = readParam(paramObj, "scl", 1.0);

    return extend(ParticleEffect, {

      /* meta */

      interp: Interp.pow10Out,
      lifetime: 480.0 * scl,
      startDelay: 0.0,

      /* visual */

      region: spr,
      layer: VAR.layer.effBase,
      particles: amt,
      followParent: true,
      rotWithParent: false,
      useRotation: true,
      colorFrom: color,
      colorTo: color,
      lightScl: 2.0,
      lightOpacity: 0.0,

      /* angle & length */

      baseRotation: 0.0,
      offset: 0.0,
      cone: 180.0,
      spin: 0.0,
      randLength: true,
      length: rad,
      baseLength: 0.0,

      /* size & stroke & len */

      line: false,
      sizeInterp: Interp.pow10Out,
      sizeFrom: size,
      sizeTo: 0.0,
      strokeFrom: 0.0,
      strokeTo: 0.0,
      lenFrom: 0.0,
      lenTo: 0.0,

    });
  };
  exports.crackPlant = crackPlant;


  /**
   * @param {Object|unset} [paramObj]
   * @return {ParticleEffect}
   */
  const crackSmoke = function(paramObj) {
    let
      spr = readParam(paramObj, "spr", "lovec-efr-urchin"),
      amt = readParam(paramObj, "amt", 5),
      size = readParam(paramObj, "size", 3.0),
      rad = readParam(paramObj, "rad", 12.0),
      color = MDL_color.getColor(readParam(paramObj, "color", Color.white), "new"),
      scl = readParam(paramObj, "scl", 1.0);

    return extend(ParticleEffect, {

      /* meta */

      interp: Interp.pow10Out,
      lifetime: 180.0 * scl,
      startDelay: 0.0,

      /* visual */

      region: spr,
      layer: VAR.layer.effBase,
      particles: amt,
      followParent: true,
      rotWithParent: false,
      useRotation: true,
      colorFrom: color,
      colorTo: color,
      lightScl: 2.0,
      lightOpacity: 0.0,

      /* angle & length */

      baseRotation: 0.0,
      offset: 0.0,
      cone: 180.0,
      spin: 0.0,
      randLength: true,
      length: rad,
      baseLength: 0.0,

      /* size & stroke & len */

      line: false,
      sizeInterp: Interp.sine,
      sizeFrom: size,
      sizeTo: 0.0,
      strokeFrom: 0.0,
      strokeTo: 0.0,
      lenFrom: 0.0,
      lenTo: 0.0,

    });
  };
  exports.crackSmoke = crackSmoke;


  /**
   * @param {Object|unset} [paramObj]
   * @return {ParticleEffect}
   */
  const crackSquare = function(paramObj) {
    let
      spr = readParam(paramObj, "spr", "lovec-efr-square"),
      amt = readParam(paramObj, "amt", 7),
      size = readParam(paramObj, "size", 4.0),
      rad = readParam(paramObj, "rad", 56.0),
      color = MDL_color.getColor(readParam(paramObj, "color", Color.white), "new"),
      scl = readParam(paramObj, "scl", 1.0),
      noLight = readParam(paramObj, "noLight", true);

    return extend(ParticleEffect, {

      /* meta */

      interp: Interp.pow2Out,
      lifetime: 150.0 * scl,
      startDelay: 0.0,

      /* visual */

      region: spr,
      layer: VAR.layer.effBase,
      particles: amt,
      followParent: true,
      rotWithParent: false,
      useRotation: true,
      colorFrom: color,
      colorTo: color,
      lightScl: 2.0,
      lightOpacity: noLight ? 0.0 : 0.65,

      /* angle & length */

      baseRotation: 0.0,
      offset: 0.0,
      cone: 180.0,
      spin: 0.0,
      randLength: true,
      length: rad,
      baseLength: 0.0,

      /* size & stroke & len */

      line: false,
      sizeInterp: Interp.pow3In,
      sizeFrom: size,
      sizeTo: 0.0,
      strokeFrom: 0.0,
      strokeTo: 0.0,
      lenFrom: 0.0,
      lenTo: 0.0,

    });
  };
  exports.crackSquare = crackSquare;


  /* <------------------------------ spark ------------------------------ */


  /**
   * @param {Object|unset} [paramObj]
   * @return {Effect}
   */
  const sparkLine = function(paramObj) {
    let
      amt = readParam(paramObj, "amt", 7),
      stroke = readParam(paramObj, "stroke", 1.5),
      len = readParam(paramObj, "len", 4.0),
      rad = readParam(paramObj, "rad", 18.0),
      color = MDL_color.getColor(readParam(paramObj, "color", "null"), "new"),
      scl = readParam(paramObj, "scl", 1.0);

    return new Effect(15.0 * scl, eff => {
      Draw.color(tryVal(color, eff.color));
      Lines.stroke(eff.fout() * stroke);
      Angles.randLenVectors(eff.id, amt, eff.finpow() * rad, (x, y) => {
        Lines.lineAngle(eff.x + x, eff.y + y, Mathf.angle(x, y), (eff.fout() + 0.25) * len);
      });
    });
  };
  exports.sparkLine = sparkLine;


  /**
   * @param {Object|unset} [paramObj]
   * @return {Effect}
   */
  const sparkCircle = function(paramObj) {
    let
      amt = readParam(paramObj, "amt", 7),
      size = readParam(paramObj, "size", 4.0),
      rad = readParam(paramObj, "rad", 30.0),
      color = MDL_color.getColor(readParam(paramObj, "color", "null"), "new"),
      scl = readParam(paramObj, "scl", 1.0);

    return new Effect(30.0 * scl, eff => {
      Draw.color(tryVal(color, eff.color));
      Angles.randLenVectors(eff.id, amt, eff.finpow() * rad, (x, y) => {
        Fill.circle(eff.x + x, eff.y + y, (eff.fout() + 0.25) * size);
      });
    });
  };
  exports.sparkCircle = sparkCircle;


  /* <------------------------------ smog ------------------------------ */


  /**
   * @param {Object|unset} [paramObj]
   * @return {ParticleEffect}
   */
  const smogRelease = function(paramObj) {
    let
      amt = readParam(paramObj, "amt", 12),
      size = readParam(paramObj, "size", 7.0),
      rad = readParam(paramObj, "rad", 36.0),
      scl = readParam(paramObj, "scl", 1.0),
      isBlack = readParam(paramObj, "isBlack", false),
      isHigh = readParam(paramObj, "isHigh", false);

    return extend(ParticleEffect, {

      /* meta */

      interp: Interp.pow2Out,
      lifetime: 120.0 * scl,
      startDelay: 0.0,

      /* visual */

      region: isBlack ? "lovec-efr-shadow" : "lovec-efr-shadow-white",
      layer: isHigh ? VAR.layer.effSmogHigh : VAR.layer.effSmog,
      particles: amt,
      followParent: true,
      rotWithParent: false,
      useRotation: true,
      colorFrom: VAR.color.smogWhite,
      colorTo: VAR.color.whiteClear,
      lightScl: 2.0,
      lightOpacity: 0.0,

      /* angle & length */

      baseRotation: 55.0,
      offset: 0.0,
      cone: 30.0,
      spin: 0.0,
      randLength: true,
      length: rad,
      baseLength: 0.0,

      /* size & stroke & len */

      line: false,
      sizeInterp: Interp.pow5Out,
      sizeFrom: 2.0,
      sizeTo: size,
      strokeFrom: 0.0,
      strokeTo: 0.0,
      lenFrom: 0.0,
      lenTo: 0.0,

    });
  };
  exports.smogRelease = smogRelease;


  /**
   * @param {Object|unset} [paramObj]
   * @return {ParticleEffect}
   */
  const smogSideRelease = function(paramObj) {
    let
      amt = readParam(paramObj, "amt", 6),
      size = readParam(paramObj, "size", 5.0),
      rad = readParam(paramObj, "rad", 14.0),
      offRad = readParam(paramObj, "offRad", 0.0),
      cone = readParam(paramObj, "cone", 10.0),
      scl = readParam(paramObj, "scl", 1.0),
      rev = readParam(paramObj, "rev", false),
      isBlack = readParam(paramObj, "isBlack", false),
      isHigh = readParam(paramObj, "isHigh", false);

    return extend(ParticleEffect, {

      /* meta */

      interp: rev ? Interp.reverse : Interp.linear,
      lifetime: 80.0 * scl,
      startDelay: 0.0,

      /* visual */

      region: isBlack ? "lovec-efr-shadow" : "lovec-efr-shadow-white",
      layer: isHigh ? VAR.layer.effSmogHigh : VAR.layer.effSmog,
      particles: amt,
      followParent: true,
      rotWithParent: false,
      useRotation: true,
      colorFrom: VAR.color.smogWhite,
      colorTo: VAR.color.whiteClear,
      lightScl: 2.0,
      lightOpacity: 0.0,

      /* angle & length */

      baseRotation: 0.0,
      offset: 0.0,
      cone: cone,
      spin: 0.0,
      randLength: true,
      length: rad,
      baseLength: offRad,

      /* size & stroke & len */

      line: false,
      sizeInterp: rev ? Interp.reverse : Interp.linear,
      sizeFrom: 0.0,
      sizeTo: size,
      strokeFrom: 0.0,
      strokeTo: 0.0,
      lenFrom: 0.0,
      lenTo: 0.0,

    });
  };
  exports.smogSideRelease = smogSideRelease;


  /**
   * @param {Object|unset} [paramObj]
   * @return {ParticleEffect}
   */
  const smogShoot = function(paramObj) {
    let
      amt = readParam(paramObj, "amt", 12),
      size_f = readParam(paramObj, "size_f", 4.0),
      size_t = readParam(paramObj, "size_t", 12.0),
      rad = readParam(paramObj, "rad", 28.0),
      cone = readParam(paramObj, "cone", 20.0),
      scl = readParam(paramObj, "scl", 1.0),
      isBlack = readParam(paramObj, "isBlack", false),
      isHigh = readParam(paramObj, "isHigh", false);

    return extend(ParticleEffect, {

      /* meta */

      interp: Interp.pow10Out,
      lifetime: 300.0 * scl,
      startDelay: 0.0,

      /* visual */

      region: isBlack ? "lovec-efr-shadow" : "lovec-efr-shadow-white",
      layer: isHigh ? VAR.layer.effSmogHigh : VAR.layer.effSmog,
      particles: amt,
      followParent: false,
      rotWithParent: false,
      useRotation: true,
      colorFrom: VAR.color.smogWhiteThick,
      colorTo: VAR.color.whiteClear,
      lightScl: 2.0,
      lightOpacity: 0.0,

      /* angle & length */

      baseRotation: 0.0,
      offset: 0.0,
      cone: cone,
      spin: 0.0,
      randLength: true,
      length: rad,
      baseLength: 0.0,

      /* size & stroke & len */

      line: false,
      sizeInterp: Interp.pow2Out,
      sizeFrom: size_f,
      sizeTo: size_t,
      strokeFrom: 0.0,
      strokeTo: 0.0,
      lenFrom: 0.0,
      lenTo: 0.0,

    });
  };
  exports.smogShoot = smogShoot;


  /**
   * @param {Object|unset} [paramObj]
   * @return {ParticleEffect}
   */
  const smogHeat = function(paramObj) {
    let
      amt = readParam(paramObj, "amt", 4),
      size = readParam(paramObj, "size", 6.0),
      rad = readParam(paramObj, "rad", 18.0),
      scl = readParam(paramObj, "scl", 1.0),
      isBlack = readParam(paramObj, "isBlack", false),
      isHigh = readParam(paramObj, "isHigh", false);

    return extend(ParticleEffect, {

      /* meta */

      interp: Interp.linear,
      lifetime: 40.0 * scl,
      startDelay: 0.0,

      /* visual */

      region: isBlack ? "lovec-efr-shadow" : "lovec-efr-shadow-white",
      layer: isHigh ? VAR.layer.effSmogHigh : VAR.layer.effSmog,
      particles: amt,
      followParent: true,
      rotWithParent: false,
      useRotation: true,
      colorFrom: VAR.color.smogWhiteThickest,
      colorTo: VAR.color.whiteClear,
      lightScl: 2.0,
      lightOpacity: 0.0,

      /* angle & length */

      baseRotation: 55.0,
      offset: 20.0,
      cone: 180.0,
      spin: 0.0,
      randLength: true,
      length: rad,
      baseLength: 0.0,

      /* size & stroke & len */

      line: false,
      sizeInterp: Interp.linear,
      sizeFrom: 0.0,
      sizeTo: size,
      strokeFrom: 0.0,
      strokeTo: 0.0,
      lenFrom: 0.0,
      lenTo: 0.0,

    });
  };
  exports.smogHeat = smogHeat;


  /**
   * @param {Object|unset} [paramObj]
   * @return {ParticleEffect}
   */
  const smogExplo = function(paramObj) {
    let
      amt = readParam(paramObj, "amt", 24),
      size = readParam(paramObj, "size", 14.0),
      rad = readParam(paramObj, "rad", 36.0),
      scl = readParam(paramObj, "scl", 1.0),
      isBlack = readParam(paramObj, "isBlack", false),
      isHigh = readParam(paramObj, "isHigh", false);

    return extend(ParticleEffect, {

      /* meta */

      interp: Interp.pow2Out,
      lifetime: 360.0 * scl,
      startDelay: 0.0,

      /* visual */

      region: isBlack ? "lovec-efr-shadow" : "lovec-efr-shadow-white",
      layer: isHigh ? VAR.layer.effSmogHigh : VAR.layer.effSmog,
      particles: amt,
      followParent: true,
      rotWithParent: false,
      useRotation: true,
      colorFrom: VAR.color.smogWhite,
      colorTo: VAR.color.whiteClear,
      lightScl: 2.0,
      lightOpacity: 0.0,

      /* angle & length */

      baseRotation: 55.0,
      offset: 0.0,
      cone: 40.0,
      spin: 0.0,
      randLength: true,
      length: rad,
      baseLength: 0.0,

      /* size & stroke & len */

      line: false,
      sizeInterp: Interp.pow2Out,
      sizeFrom: 2.0,
      sizeTo: size,
      strokeFrom: 0.0,
      strokeTo: 0.0,
      lenFrom: 0.0,
      lenTo: 0.0,

    });
  };
  exports.smogExplo = smogExplo;


  /**
   * @param {Object|unset} [paramObj]
   * @return {ParticleEffect}
   */
  const smogVent = function(paramObj) {
    let
      amt = readParam(paramObj, "amt", 1),
      size = readParam(paramObj, "size", 10.0),
      rad = readParam(paramObj, "rad", 20.0),
      color = MDL_color.getColor(readParam(paramObj, "color", "7898ba")),
      scl = readParam(paramObj, "scl", 1.0),
      isBlack = readParam(paramObj, "isBlack", false);

    let color_f = color.cpy();
    color_f.a = 0.3;
    let color_t = color.cpy();
    color_t.a = 0.0;

    return extend(ParticleEffect, {

      /* meta */

      interp: Interp.pow2In,
      lifetime: 160.0 * scl,
      startDelay: 0.0,

      /* visual */

      region: isBlack ? "lovec-efr-shadow" : "lovec-efr-shadow-white",
      layer: VAR.layer.effSmog,
      particles: amt,
      followParent: true,
      rotWithParent: false,
      useRotation: true,
      colorFrom: color_f,
      colorTo: color_t,
      lightScl: 2.0,
      lightOpacity: 0.0,

      /* angle & length */

      baseRotation: 55.0,
      offset: 0.0,
      cone: 22.5,
      spin: 0.0,
      randLength: true,
      length: rad,
      baseLength: 0.0,

      /* size & stroke & len */

      line: false,
      sizeInterp: Interp.sine,
      sizeFrom: 0.0,
      sizeTo: size,
      strokeFrom: 0.0,
      strokeTo: 0.0,
      lenFrom: 0.0,
      lenTo: 0.0,

    });
  };
  exports.smogVent = smogVent;


  /* <------------------------------ wave ------------------------------ */


  /**
   * @param {Object|unset} [paramObj]
   * @return {Effect}
   */
  const waveImpact = function(paramObj) {
    let
      size_f = readParam(paramObj, "size_f", 6.0),
      size_t = readParam(paramObj, "size_t", 0.0),
      rad = readParam(paramObj, "rad", null),
      scl = readParam(paramObj, "scl", 1.0);

    const eff = new Effect(40.0, eff => {
      eff.lifetime = 40.0 * scl * Math.pow(tryVal(rad, eff.rotation) * 0.025, 0.5);

      Draw.color(MDL_color.getColor("ffffff30", Tmp.c2), MDL_color.getColor("ffffff00", Tmp.c3), eff.fin());
      Lines.stroke(size_f - Interp.pow2Out.apply(eff.fin()) * (size_f - size_t));
      Lines.circle(eff.x, eff.y, tryVal(rad, eff.rotation) * Interp.pow2Out.apply(eff.fin()));
      Draw.reset();
    });
    eff.layer = VAR.layer.effFlr;

    return eff;
  };
  exports.waveImpact = waveImpact;


  /**
   * @param {Object|unset} [paramObj]
   * @return {Effect}
   */
  const waveRect = function(paramObj) {
    let
      size_f = readParam(paramObj, "size_f", 4.0),
      size_t = readParam(paramObj, "size_t", 0.0),
      r = readParam(paramObj, "r", null),
      color = MDL_color.getColor(readParam(paramObj, "color", "null"), "new"),
      scl = readParam(paramObj, "scl", 1.0);

    return new Effect(20.0 * scl, eff => {
      let rad = tryVal(r, eff.rotation) * Vars.tilesize * Interp.pow2Out.apply(eff.fin());

      Draw.color(tryVal(color, eff.color));
      Lines.stroke(size_f - eff.fin() * (size_f - size_t));
      Lines.line(eff.x - rad, eff.y - rad, eff.x + rad, eff.y - rad);
      Lines.line(eff.x + rad, eff.y - rad, eff.x + rad, eff.y + rad);
      Lines.line(eff.x + rad, eff.y + rad, eff.x - rad, eff.y + rad);
      Lines.line(eff.x - rad, eff.y + rad, eff.x - rad, eff.y - rad);
      Draw.reset();
    });
  };
  exports.waveRect = waveRect;


  /**
   * @param {Object|unset} [paramObj]
   * @return {Effect}
   */
  const waveCircle = function(paramObj) {
    let
      size_f = readParam(paramObj, "size_f", 4.0),
      size_t = readParam(paramObj, "size_t", 0.0),
      rad = readParam(paramObj, "rad", null),
      color = MDL_color.getColor(readParam(paramObj, "color", "null"), "new"),
      scl = readParam(paramObj, "scl", 1.0);

    return new Effect(20.0 * scl, eff => {
      Draw.color(tryVal(color, eff.color));
      Lines.stroke(size_f - eff.fin() * (size_f - size_t));
      Lines.circle(eff.x, eff.y, tryVal(rad, eff.rotation) * Interp.pow2Out.apply(eff.fin()));
      Draw.reset();
    });
  };
  exports.waveCircle = waveCircle;


  /* <------------------------------ area ------------------------------ */


  /**
   * @param {Object|unset} [paramObj]
   * @return {Effect}
   */
  const fadeSquare = function(paramObj) {
    let
      r = readParam(paramObj, "r", 0.5),
      color = MDL_color.getColor(readParam(paramObj, "color", "null"), "new"),
      scl = readParam(paramObj, "scl", 1.0);

    return new Effect(40.0 * scl, eff => {
      Draw.color(tryVal(color, eff.color));
      Draw.alpha(eff.fout());
      Fill.square(eff.x, eff.y, r * Vars.tilesize);
      Draw.reset();
    });
  };
  exports.fadeSquare = fadeSquare;


  /**
   * @param {Object|unset} [paramObj]
   * @return {MultiEffect}
   */
  const diskExplo = function(paramObj) {
    let
      rad = readParam(paramObj, "rad", 40.0),
      color = MDL_color.getColor(readParam(paramObj, "color", Pal.accent), "new"),
      scl = readParam(paramObj, "scl", 1.0),
      noLight = readParam(paramObj, "noLight", false);

    let color_t = color.cpy();
    color_t.a = 0.0;

    return new MultiEffect(
      extend(ParticleEffect, {

        /* meta */

        interp: Interp.pow5In,
        lifetime: 40.0 * scl,
        startDelay: 0.0,

        /* visual */

        region: "lovec-efr-shadow-white",
        layer: VAR.layer.effHigh,
        particles: 1,
        followParent: true,
        rotWithParent: false,
        useRotation: true,
        colorFrom: color,
        colorTo: color_t,
        lightScl: 2.0,
        lightOpacity: noLight ? 0.0 : 0.65,

        /* angle & length */

        baseRotation: 0.0,
        offset: 0.0,
        cone: 180.0,
        spin: 0.0,
        randLength: true,
        length: 0.0,
        baseLength: 0.0,

        /* size & stroke & len */

        line: false,
        sizeInterp: Interp.pow10Out,
        sizeFrom: 0.0,
        sizeTo: rad,
        strokeFrom: 0.0,
        strokeTo: 0.0,
        lenFrom: 0.0,
        lenTo: 0.0,

      }),
      extend(ParticleEffect, {

        /* meta */

        interp: Interp.pow5In,
        lifetime: 40.0 * scl,
        startDelay: 0.0,

        /* visual */

        region: "lovec-efr-shadow-white",
        layer: VAR.layer.effHigh + 0.0001,
        particles: 1,
        followParent: true,
        rotWithParent: false,
        useRotation: true,
        colorFrom: Color.white,
        colorTo: VAR.color.whiteClear,
        lightScl: 2.0,
        lightOpacity: 0.65,

        /* angle & length */

        baseRotation: 0.0,
        offset: 0.0,
        cone: 180.0,
        spin: 0.0,
        randLength: true,
        length: 0.0,
        baseLength: 0.0,

        /* size & stroke & len */

        line: false,
        sizeInterp: Interp.pow10Out,
        sizeFrom: 0.0,
        sizeTo: rad * 0.7,
        strokeFrom: 0.0,
        strokeTo: 0.0,
        lenFrom: 0.0,
        lenTo: 0.0,

      }),
    );
  };
  exports.diskExplo = diskExplo;


  /* <------------------------------ complex ------------------------------ */


  /**
   * @param {Object|unset} [paramObj]
   * @return {MultiEffect}
   */
  const gasEmission = function(paramObj) {
    let
      size = readParam(paramObj, "size", 7.0),
      rad = readParam(paramObj, "rad", 30.0),
      color = readParam(paramObj, "color", Color.white),
      scl = readParam(paramObj, "scl", 1.0),
      isBlack = readParam(paramObj, "isBlack", false);

    return new MultiEffect(
      smogVent({
        size: size,
        rad: rad,
        color: MDL_color.getColor(color).cpy(),
        scl: scl * 1.1,
        isBlack: isBlack,
      }),
      smogVent({
        size: size * 0.85,
        rad: rad,
        color: MDL_color.getColor(color).lerp(Color.white, 0.4).cpy(),
        scl: scl * 0.85,
        isBlack: isBlack,
      }),
      smogVent({
        size: size * 0.7,
        rad: rad,
        color: MDL_color.getColor(color).lerp(Color.white, 0.7).cpy(),
        scl: scl * 0.7,
        isBlack: isBlack,
      }),
    );
  };
  exports.gasEmission = gasEmission;


  /**
   * @param {Object|unset} [paramObj]
   * @return {MultiEffect}
   */
  const impactDrillCraft = function(paramObj) {
    let
      blkSize = readParam(paramObj, "blkSize", 1),
      rad = readParam(paramObj, "rad", null);

    return new MultiEffect(
      waveImpact({
        rad: rad,
        scl: blkSize / 2.0 * 0.75,
      }),
      waveImpact({
        rad: rad,
        scl: blkSize / 2.0,
      }),
      smogRelease({
        amt: 18,
        size: 10.0,
        rad: 40.0,
        scl: 1.5,
      }),
      crackDrill({
        amt: 6,
        rad: blkSize * 9.0,
        scl: 1.33333333,
      }),
    );
  };
  exports.impactDrillCraft = impactDrillCraft;


  /**
   * @param {Object|unset} [paramObj]
   * @return {MultiEffect}
   */
  const explosion = function(paramObj) {
    let
      rad = readParam(paramObj, "rad", 56.0),
      radDyna = readParam(paramObj, "rad", null),
      color = readParam(paramObj, "color", "feb380"),
      colorCenter = readParam(paramObj, "colorCenter", Pal.accent),
      noSmog = readParam(paramObj, "noSmog", false);

    return noSmog ?
      new MultiEffect(
        crackSquare({
          amt: 5,
          size: 1.5,
          rad: rad,
          color: color,
          scl: 0.3,
          noLight: false,
        }),
        diskExplo({
          rad: rad * 0.7,
          color: colorCenter,
        }),
      ) :
      new MultiEffect(
        waveImpact({
          rad: radDyna,
        }),
        waveImpact({
          rad: radDyna,
          scl: 1.2,
        }),
        waveImpact({
          rad: radDyna,
          scl: 1.5,
        }),
        waveImpact({
          rad: radDyna,
          scl: 1.9,
        }),
        smogExplo({
          size: rad * 0.35,
          rad: rad * 1.125,
        }),
        crackSquare({
          rad: rad,
          color: color,
          noLight: false,
        }),
        diskExplo({
          rad: rad * 0.7,
          color: colorCenter,
        }),
      );
  };
  exports.explosion = explosion;


  /**
   * @param {Object|unset} [paramObj]
   * @return {MultiEffect}
   */
  const pulseRect = function(paramObj) {
    let
      r = readParam(paramObj, "r", null),
      color = readParam(paramObj, "color", null);

    return new MultiEffect(
      waveRect({
        size_f: 3.5,
        r: r,
        color: color,
      }),
      waveRect({
        size_f: 2.5,
        r: r,
        color: color,
        scl: 2.0,
      }),
    );
  };
  exports.pulseRect = pulseRect;


  /**
   * @param {Object|unset} [paramObj]
   * @return {MultiEffect}
   */
  const pulseCircle = function(paramObj) {
    let
      rad = readParam(paramObj, "rad", null),
      color = readParam(paramObj, "color", null);

    return new MultiEffect(
      waveCircle({
        size_f: 3.5,
        rad: rad,
        color: color,
      }),
      waveCircle({
        size_f: 2.5,
        rad: rad,
        color: color,
        scl: 2.0,
      }),
    );
  };
  exports.pulseCircle = pulseCircle;
