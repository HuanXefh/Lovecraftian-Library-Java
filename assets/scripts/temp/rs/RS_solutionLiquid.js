/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = require("lovec/temp/rs/RS_intermediateFluid");


  /* <---------- component ----------> */


  function comp_init(liq) {
    let liqSolv = MDL_content._ct(DB_HANDLER.read("liq-solvent", liq.solvent, null), "rs", true);

    if(liqSolv != null && liq.overwriteVanillaProp) {
      liq.flammability = liqSolv.flammability;
      liq.explosiveness = liqSolv.explosiveness;
      liq.viscosity = liqSolv.viscosity;
      if(liq.coolant) liq.heatCapacity = liqSolv.heatCapacity;
    };

    if(!liq.skipReactionAssign && liq.intmdParent != null) {
      MDL_event._c_onLoad(() => {
        // The parent item will react with the solvent liquid
        if(!(liq.intmdParent instanceof Item)) return;
        let obj = DB_reaction.db["solvationTarget"];
        if(obj[liq.solvent] === undefined) obj[liq.solvent] = [];
        obj[liq.solvent].push(liq.intmdParent.name, liq.name);
      });
    };
  };


/*
  ========================================
  Section: Application
  ========================================
*/


  /**
   * Fluids with solubles.
   * <br> `NAMEGEN`
   * @class RS_solutionLiquid
   * @extends RS_intermediateFluid
   */
  module.exports = newClass().extendClass(PARENT, "RS_solutionLiquid").initClass()
  .setParent(Liquid)
  .setTags("rs-intmd", "rs-sol")
  .setParam({


    /**
     * `PARAM`: Solvent used for this solution.
     * <br> `DB`: liq-solvent.
     * @memberof RS_solutionLiquid
     * @instance
     */
    solvent: "water",


    /* <------------------------------ internal ------------------------------ */


    /**
     * `INTERNAL`
     * @override
     * @memberof RS_solutionLiquid
     * @instance
     */
    recolorRegStr: "lovec-gen-solution-liquid",


  })
  .setMethod({


    init: function() {
      comp_init(this);
    },


    /**
     * @override
     * @memberof RS_solutionLiquid
     * @instance
     * @return {string}
     */
    ex_getLocalizedMainName: function() {
      return MDL_bundle._term("common", "intmd-solution" + (this.solvent === "water" ? "" : ("-" + this.solvent)));
    }
    .setProp({
      noSuper: true,
      override: true,
    }),


  });
