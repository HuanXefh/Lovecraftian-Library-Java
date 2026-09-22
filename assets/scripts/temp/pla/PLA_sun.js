/*
  ========================================
  Section: Definition
  ========================================
*/


    /* <------------------------------ meta ------------------------------ */


    /**
     * @typedef {TemplateInstance<Planet, PLA_sun>} PLASun
     */


    const PARENT = require("lovec/temp/pla/PLA_basePlanet");


    /* <------------------------------ component ------------------------------ */


    /**
     * @private
     * @param {PLASun} pla
     * @return {void}
     */
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
    module.exports = newClass()
    .extendClass(PARENT, "PLA_sun")
    .initTemplate()
    .setParent(Planet)
    .setTags()
    .setParam({})
    .setMethod({


        init: function() {
            comp_init(this);
        },


    });
