/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = require("lovec/temp/rs/RS_solutionLiquid");


  /* <---------- component ----------> */


/*
  ========================================
  Section: Application
  ========================================
*/


  /**
   * Fluids with unwanted insolubles.
   * <br> <NAMEGEN>
   * @class RS_morbidSolutionLiquid
   * @extends RS_solutionLiquid
   */
  module.exports = newClass().extendClass(PARENT, "RS_morbidSolutionLiquid").initClass()
  .setParent(Liquid)
  .setTags("rs-intmd", "rs-morbid")
  .setParam({


    /* <------------------------------ internal ------------------------------ */


    /**
     * <INTERNAL>
     * @override
     * @memberof RS_morbidSolutionLiquid
     * @instance
     */
    recolorRegStr: "lovec-gen-morbid-solution-liquid",


  })
  .setMethod({


    /**
     * @override
     * @memberof RS_morbidSolutionLiquid
     * @instance
     * @return {string}
     */
    ex_getLocalizedMainName: function() {
      return MDL_bundle._term("common", "intmd-morbid-solution" + (this.solvent === "water" ? "" : ("-" + this.solvent)));
    }
    .setProp({
      noSuper: true,
      override: true,
    }),


  });
