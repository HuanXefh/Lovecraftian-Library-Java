/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = require("lovec/temp/rs/RS_slurryLiquid");


  /* <---------- component ----------> */


/*
  ========================================
  Section: Application
  ========================================
*/


  /**
   * Slurry that should be thickened before being further processed.
   * <br> <NAMEGEN>
   * @class RS_dilutedSlurryLiquid
   * @extends RS_slurryLiquid
   */
  module.exports = newClass().extendClass(PARENT, "RS_dilutedSlurryLiquid").initClass()
  .setParent(Liquid)
  .setTags("rs-intmd", "rs-slur0dil")
  .setParam({


    /* <------------------------------ internal ------------------------------ */


    /**
     * <INTERNAL>
     * @override
     * @memberof RS_slurryLiquid
     * @instance
     */
    recolorRegStr: "lovec-gen-diluted-slurry-liquid",


  })
  .setMethod({


    /**
     * @override
     * @memberof RS_dilutedSlurryLiquid
     * @instance
     * @return {string}
     */
    ex_getLocalizedMainName: function() {
      return MDL_bundle._term("common", "intmd-diluted-slurry" + (this.solvent === "water" ? "" : ("-" + this.solvent)));
    }
    .setProp({
      noSuper: true,
      override: true,
    }),


  });
