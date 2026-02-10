/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * Fluids as intermediates.
   * ---------------------------------------- */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = require("lovec/temp/rs/RS_baseFluid");


  const MDL_content = require("lovec/mdl/MDL_content");
  const MDL_table = require("lovec/mdl/MDL_table");


  /* <---------- component ----------> */


  function comp_init(liq) {
    liq.intmdParent = MDL_content._ct(liq.intmdParent, "rs");
    liq.extraIntmdParents.inSituMap(nmRs => MDL_content._ct(nmRs, "rs"));

    liq.ex_generateIntmdName();
  };


  function comp_setStats(liq) {
    liq.stats.add(fetchStat("lovec", "rs-isintermediate"), true);
    if(liq.intmdParent != null) liq.stats.add(fetchStat("lovec", "rs0int-parent"), newStatValue(tb => {
      tb.row();
      MDL_table.setDisplay_ctRow(tb, liq.intmdParent);
    }));
  };


/*
  ========================================
  Section: Application
  ========================================
*/


  module.exports = newClass().extendClass(PARENT, "RS_intermediateFluid").initClass()
  .setParent(Liquid)
  .setTags("rs-intmd")
  .setParam({
    // @PARAM: See {RS_intermediateItem}.
    intmdParent: null,
    // @PARAM: See {RS_intermediateItem}.
    extraIntmdParents: prov(() => []),
    // @PARAM: See {RS_intermediateItem}.
    useParentReg: true,
    // @PARAM: See {RS_intermediateItem}.
    recolorRegStr: null,

    databaseTag: "lovec-intermediate",
  })
  .setMethod({


    init: function() {
      comp_init(this);
    },


    setStats: function() {
      comp_setStats(this);
    },


  });
