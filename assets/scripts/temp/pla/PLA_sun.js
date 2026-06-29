/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = require("lovec/temp/pla/PLA_basePlanet");


  /* <---------- component ----------> */


  function comp_init(pla) {
    pla.drawOrbit = false;
    pla.bloom = true;
    pla.updateLighting = false;
  };


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
  .setTags()
  .setParam({})
  .setMethod({


    init: function() {
      comp_init(this);
    },


  });
