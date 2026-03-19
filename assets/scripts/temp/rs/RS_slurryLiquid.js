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
   * Fluids with insolubles as the products.
   * <br> <NAMEGEN>
   * @class RS_slurryLiquid
   * @extends RS_solutionLiquid
   */
  module.exports = newClass().extendClass(PARENT, "RS_slurryLiquid").initClass()
  .setParent(Liquid)
  .setTags("rs-intmd", "rs-slur")
  .setParam({


    /* <------------------------------ internal ------------------------------ */


    /**
     * <INTERNAL>
     * @override
     * @memberof RS_slurryLiquid
     * @instance
     */
    recolorRegStr: "lovec-gen-slurry-liquid",


  })
  .setMethod({


    /**
     * @override
     * @memberof RS_slurryLiquid
     * @instance
     * @return {string}
     */
    ex_getLocalizedMainName: function() {
      return MDL_bundle._term("common", "intmd-slurry" + (this.solvent === "water" ? "" : ("-" + this.solvent)));
    }
    .setProp({
      noSuper: true,
      override: true,
    }),


  });
