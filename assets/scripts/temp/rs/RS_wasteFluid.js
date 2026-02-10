/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * Any fluid that is unwanted.
   * Technically an intermediate, but categorized as waste.
   * ---------------------------------------- */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = require("lovec/temp/rs/RS_intermediateFluid");


  /* <---------- component ----------> */


  function comp_setStats(liq) {
    liq.stats.remove(fetchStat("lovec", "rs-isintermediate"));
    liq.stats.add(fetchStat("lovec", "rs-iswaste"), true);
  };


/*
  ========================================
  Section: Application
  ========================================
*/


  module.exports = newClass().extendClass(PARENT, "RS_wasteFluid").initClass()
  .setParent(Liquid)
  .setTags("rs-waste")
  .setParam({
    useParentReg: false,
    databaseTag: null,
  })
  .setMethod({


    setStats: function() {
      comp_setStats(this);
    },


  });
