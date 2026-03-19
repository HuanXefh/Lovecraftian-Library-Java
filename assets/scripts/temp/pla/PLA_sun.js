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


  /**
   * Regular sun.
   * @class PLA_sun
   * @extends PLA_basePlanet
   */
  module.exports = newClass().extendClass(PARENT, "PLA_sun").initClass()
  .setParent(Planet)
  .setTags("pla-sun")
  .setParam({


    /* <------------------------------ vanilla ------------------------------ */


    tidalLock: true,
    drawOrbit: false,
    bloom: true,
    updateLighting: false,


  })
  .setMethod({});
