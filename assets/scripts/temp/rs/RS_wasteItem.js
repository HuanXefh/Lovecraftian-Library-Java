/*
  ========================================
  Section: Introduction
  ========================================
*/


  /* ----------------------------------------
   * NOTE:
   *
   * Items that are considered waste.
   * Unlike fluid, waste item has no relation with intermediate.
   * ---------------------------------------- */


/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = require("lovec/temp/rs/RS_baseItem");


  /* <---------- component ----------> */


  function comp_setStats(itm) {
    itm.stats.add(fetchStat("lovec", "rs-iswaste"), true);
  };


/*
  ========================================
  Section: Application
  ========================================
*/


  module.exports = newClass().extendClass(PARENT).initClass()
  .setParent(Item)
  .setTags("rs-was")
  .setParam({})
  .setMethod({


    setStats: function() {
      comp_setStats(this);
    },


  });
