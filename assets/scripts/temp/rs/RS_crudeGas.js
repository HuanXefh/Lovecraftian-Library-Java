/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = require("lovec/temp/rs/RS_intermediateFluid");


  /* <---------- component ----------> */


  function comp_init(rs) {
    if(rs.intmdParent.gas) {
      rs.dens = rs.intmdParent.dens;
    };
  };


/*
  ========================================
  Section: Application
  ========================================
*/


  /**
   * Impure gaseous chemicals.
   * <br> `NAMEGEN`
   * @class RS_crudeGas
   * @extends RS_intermediateFluid
   */
  module.exports = newClass().extendClass(PARENT, "RS_crudeGas").initClass()
  .setParent(Liquid)
  .setTags("rs-intmd", "rs-crdg")
  .setParam({


    /* <------------------------------ internal ------------------------------ */


    /**
     * `INTERNAL`
     * @override
     * @memberof RS_crudeGas
     * @instance
     */
    recolorRegStr: "lovec-gen-crude-gas",


  })
  .setMethod({


    init: function() {
      comp_init(this);
    },


    /**
     * @override
     * @memberof RS_crudeGas
     * @instance
     * @return {string}
     */
    ex_getLocalizedMainName: function() {
      return MDL_bundle._term("common", "intmd-crude-gas");
    }
    .setProp({
      noSuper: true,
      override: true,
    }),


  });
