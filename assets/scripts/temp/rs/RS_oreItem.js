/*
  ========================================
  Section: Definition
  ========================================
*/


  /* <---------- import ----------> */


  const PARENT = require("lovec/temp/rs/RS_baseItem");


  /* <---------- component ----------> */


  function comp_init(itm) {
    itm.sintTemp = itm.sintTemp >= 0.0 ? itm.sintTemp : DB_HANDLER.read("itm-sint-temp", itm, 100.0);
  };


  function comp_setStats(itm) {
    itm.stats.add(fetchStat("lovec", "rs-isore"), true);
    if(itm.sintTemp > 100.0) itm.stats.add(fetchStat("lovec", "rs-sinttemp"), itm.sintTemp, fetchStatUnit("lovec", "heatunits"));
  };


/*
  ========================================
  Section: Application
  ========================================
*/


  /**
   * Items that can be obtained through mining.
   * @class RS_oreItem
   * @extends RS_baseItem
   */
  module.exports = newClass().extendClass(PARENT, "RS_oreItem").initClass()
  .setParent(Item)
  .setTags("rs-ore")
  .setParam({


    /**
     * <PARAM>: Sintering temperature.
     * <br> <DB>: itm-sint-temp.
     * @memberof RS_oreItem
     * @instance
     */
    sintTemp: -1.0,


    /* <------------------------------ vanilla ------------------------------ */


    databaseTag: "lovec-ore",

    
  })
  .setMethod({


    init: function() {
      comp_init(this);
    },


    setStats: function() {
      comp_setStats(this);
    },


  });
