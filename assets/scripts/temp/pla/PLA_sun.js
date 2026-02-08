/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * Regular sun.
   * ---------------------------------------- */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = require("lovec/temp/pla/PLA_basePlanet");


  /* <---------- component ----------> */


/*
  ========================================
  Section: Application
  ========================================
*/


  module.exports = newClass().extendClass(PARENT).initClass()
  .setParent(Planet)
  .setTags("pla-sun")
  .setParam({
    tidalLock: true,
    drawOrbit: false,
    bloom: true,
    updateLighting: false,
  })
  .setMethod({});
