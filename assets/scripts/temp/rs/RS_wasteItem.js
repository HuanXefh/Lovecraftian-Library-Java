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


  /**
   * Unwanted items.
   * Unlike fluids, waste items have no relation to intermediates.
   * @class RS_wasteItem
   * @extends RS_baseItem
   */
  module.exports = newClass().extendClass(PARENT, "RS_wasteItem").initClass()
  .setParent(Item)
  .setTags("rs-was")
  .setParam({})
  .setMethod({


    setStats: function() {
      comp_setStats(this);
    },


  });
