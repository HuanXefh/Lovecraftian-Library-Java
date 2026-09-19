/*
  ========================================
  Section: Definition
  ========================================
*/


    /* <------------------------------ meta ------------------------------ */


    /**
     * @typedef {Planet&PLA_planet} PLAPlanet
     */


    const PARENT = require("lovec/temp/pla/PLA_basePlanet");


    /* <------------------------------ component ------------------------------ */


/*
  ========================================
  Section: Application
  ========================================
*/


    /**
     * Regular planet.
     * @class PLA_planet
     * @extends PLA_basePlanet
     */
    module.exports = newClass()
    .extendClass(PARENT, "PLA_planet")
    .initClass()
    .setParent(Planet)
    .setTags()
    .setParam({})
    .setMethod({});
