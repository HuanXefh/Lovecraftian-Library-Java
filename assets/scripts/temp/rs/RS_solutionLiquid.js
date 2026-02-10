/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * @NAMEGEN
   * Intermediate: solution.
   * Any fluid with solubles.
   * ---------------------------------------- */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = require("lovec/temp/rs/RS_intermediateFluid");


  const MDL_bundle = require("lovec/mdl/MDL_bundle");
  const MDL_event = require("lovec/mdl/MDL_event");


  /* <---------- component ----------> */


  function comp_init(liq) {
    if(!liq.skipReactionAssign && liq.intmdParent != null) {
      MDL_event._c_onLoad(() => {
        let obj = global.lovec.db_reaction.db["solvationTarget"];
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


  module.exports = newClass().extendClass(PARENT, "RS_solutionLiquid").initClass()
  .setParent(Liquid)
  .setTags("rs-intmd", "rs-sol")
  .setParam({
    // @PARAM: Solvent used for this solution. Also see {DB_reaction.db["solvationTarget"]}.
    solvent: "water",

    recolorRegStr: "lovec-gen-solution-liquid",
  })
  .setMethod({


    init: function() {
      comp_init(this);
    },


    ex_getLocalizedMainName: function() {
      return MDL_bundle._term("common", "intmd-solution" + (this.solvent === "water" ? "" : ("-" + this.solvent)));
    }
    .setProp({
      noSuper: true,
      override: true,
    }),


  });
