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


  /**
   * Unwanted fluids.
   * Technically intermediates, but categorized as waste.
   * @class RS_wasteFluid
   * @extends RS_intermediateFluid
   */
  module.exports = newClass().extendClass(PARENT, "RS_wasteFluid").initClass()
  .setParent(Liquid)
  .setTags("rs-waste")
  .setParam({


    /* <------------------------------ internal ------------------------------ */


    /**
     * <INTERNAL>
     * @override
     * @memberof RS_wasteFluid
     * @instance
     */
    useParentReg: false,


    /* <------------------------------ vanilla ------------------------------ */


    databaseTag: null,

    
  })
  .setMethod({


    setStats: function() {
      comp_setStats(this);
    },


  });
