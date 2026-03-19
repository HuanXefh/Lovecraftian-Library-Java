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
   * Similar to {@link RS_slurryLiquid} though, these are usually processed in different separators.
   * <br> <NAMEGEN>
   * @class RS_suspensionLiquid
   * @extends RS_solutionLiquid
   */
  module.exports = newClass().extendClass(PARENT, "RS_suspensionLiquid").initClass()
  .setParent(Liquid)
  .setTags("rs-intmd", "rs-susp")
  .setParam({


    /* <------------------------------ internal ------------------------------ */


    /**
     * <INTERNAL>
     * @override
     * @memberof RS_suspensionLiquid
     * @instance
     */
    recolorRegStr: "lovec-gen-suspension-liquid",


  })
  .setMethod({


    /**
     * @override
     * @memberof RS_suspensionLiquid
     * @instance
     * @return {string}
     */
    ex_getLocalizedMainName: function() {
      return MDL_bundle._term("common", "intmd-suspension" + (this.solvent === "water" ? "" : ("-" + this.solvent)));
    }
    .setProp({
      noSuper: true,
      override: true,
    }),


  });
